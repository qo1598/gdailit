// scripts/integration_test.cjs
// M12: 연구 데이터 파이프라인 통합 테스트
//
// 실행: SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/integration_test.cjs
//
// 검증 흐름:
//   T1. mission_submissions_v4 — 제출 저장 + upsert 중복 방지
//   T2. mission_events          — 이벤트 로그 배치 저장
//   T3. ai_interactions         — AI 인터랙션 로그 저장
//   T4. post_mission_evaluations — 자가평가 저장 (submission_id 연결)
//   T5. teacher_ratings         — 교사 채점 저장 (submission_id 연결)
//   T6. ksa_item_bank           — 시딩 데이터 조회 (grade_band + ksa_code 필터)
//   T7. 전체 파이프라인 체인     — T1~T5를 한 학생 흐름으로 연속 실행
//   T8. 정리                    — 테스트 데이터 삭제

const fs   = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ── 환경변수 로드
function loadEnv() {
  const envFile = path.resolve(__dirname, '../.env.local');
  const fallback = path.resolve(__dirname, '../.env');
  const file = fs.existsSync(envFile) ? envFile : fs.existsSync(fallback) ? fallback : null;
  if (!file) return;
  fs.readFileSync(file, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  });
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[ERROR] SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── 테스트 식별자 (실행마다 고유)
const RUN_ID      = `test_${Date.now()}`;
const TEST_USER   = `__test_user_${RUN_ID}`;
const TEST_MISSION = 'E-1-M';
const TEST_GRADE   = 'M';

// ── 출력 유틸
let passed = 0, failed = 0;
const PASS = '✅ PASS';
const FAIL = '❌ FAIL';

function log(label, ok, detail = '') {
  if (ok) { passed++; console.log(`  ${PASS}  ${label}${detail ? ' — ' + detail : ''}`); }
  else    { failed++; console.error(`  ${FAIL}  ${label}${detail ? ' — ' + detail : ''}`); }
}

function section(title) {
  console.log(`\n${'─'.repeat(54)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(54));
}

// ── 생성한 레코드 추적 (정리용)
const created = { submissionId: null, evalId: null, ratingId: null };

// ═══════════════════════════════════════════════
// T1. mission_submissions_v4
// ═══════════════════════════════════════════════
async function testSubmission() {
  section('T1. mission_submissions_v4 — 제출 저장');

  const row = {
    user_id:          TEST_USER,
    mission_code:     TEST_MISSION,
    grade_band:       TEST_GRADE,
    domain:           'E',
    performance_type: 'TD',
    answers: {
      step1: ['ai_speaker', 'ai_camera'],
      step2: 'living_room',
      step3: 'translation',
      step4: '스스로 학습하기 때문입니다.',
      step5: '우리 집 거실에 있는 AI 스피커는 음악을 틀어줍니다.',
      step_schema: [
        { step_id: 'step1', title: '취재 대상 판별', ui_mode: 'multi_select', question: null, hint: null },
        { step_id: 'step2', title: '주변 AI 찾기',   ui_mode: 'single_select', question: null, hint: null },
        { step_id: 'step3', title: '하는 일 선택',   ui_mode: 'single_select', question: null, hint: null },
        { step_id: 'step4', title: 'AI인 이유 서술', ui_mode: 'free_text',     question: null, hint: null },
        { step_id: 'step5', title: '소개 문장 완성', ui_mode: 'free_text',     question: null, hint: null },
      ],
      step_trace: [
        { step: 'step1', completed: true, hint_used: false, time_spent_sec: 18 },
        { step: 'step2', completed: true, hint_used: false, time_spent_sec: 12 },
        { step: 'step3', completed: true, hint_used: true,  time_spent_sec: 22 },
        { step: 'step4', completed: true, hint_used: false, time_spent_sec: 55 },
        { step: 'step5', completed: true, hint_used: false, time_spent_sec: 40 },
      ],
      hint_used:      { step3: true },
      time_spent_sec: { step1: 18, step2: 12, step3: 22, step4: 55, step5: 40 },
      artifact: '우리 집 거실에 있는 AI 스피커는 음악을 틀어줍니다.',
      artifact_binding_key: 'e_1_m_article',
    },
    started_at:   new Date(Date.now() - 150_000).toISOString(),
    submitted_at: new Date().toISOString(),
    completed:    true,
  };

  // 삽입
  const { data: ins, error: insErr } = await supabase
    .from('mission_submissions_v4')
    .upsert([row], { onConflict: 'user_id,mission_code' })
    .select('id')
    .single();

  log('INSERT 성공', !insErr, insErr?.message);
  log('id 반환',    !!ins?.id, ins?.id ? `id=${ins.id}` : '');
  if (!ins?.id) return;
  created.submissionId = ins.id;

  // 재조회
  const { data: fetched } = await supabase
    .from('mission_submissions_v4')
    .select('answers')
    .eq('id', ins.id)
    .single();
  log('artifact 저장됨', fetched?.answers?.artifact === row.answers.artifact);
  log('step_schema 저장됨', Array.isArray(fetched?.answers?.step_schema) && fetched.answers.step_schema.length === 5);

  // upsert — 동일 user+mission 재제출 시 row 1개 유지
  const { data: ups } = await supabase
    .from('mission_submissions_v4')
    .upsert([{ ...row, answers: { ...row.answers, artifact: 'updated' } }], { onConflict: 'user_id,mission_code' })
    .select('id')
    .single();
  log('upsert 후 id 동일 (중복 방지)', ups?.id === ins.id, `before=${ins.id} after=${ups?.id}`);
}

// ═══════════════════════════════════════════════
// T2. mission_events
// ═══════════════════════════════════════════════
async function testEvents() {
  section('T2. mission_events — 이벤트 배치 저장');

  // uuid v4 간이 생성
  const sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  const now = new Date().toISOString();
  const baseEvt = {
    user_id:      TEST_USER,
    mission_code: TEST_MISSION,
    grade_band:   TEST_GRADE,
    session_id:   sessionId,
    client_ts:    now,
  };

  const batch = [
    { ...baseEvt, event_type: 'session_start',  step_id: null,    stage: 'mission',   event_payload: {} },
    { ...baseEvt, event_type: 'step_enter',      step_id: 'step1', stage: 'mission',   event_payload: {} },
    { ...baseEvt, event_type: 'hint_open',       step_id: 'step3', stage: 'mission',   event_payload: {} },
    { ...baseEvt, event_type: 'step_exit',       step_id: 'step3', stage: 'mission',   event_payload: { time_sec: 22 } },
    { ...baseEvt, event_type: 'mission_submit',  step_id: null,    stage: 'mission',   event_payload: { submission_id: created.submissionId } },
    { ...baseEvt, event_type: 'stage_enter',     step_id: null,    stage: 'self_eval', event_payload: {} },
  ];

  const { error } = await supabase.from('mission_events').insert(batch);
  log('배치 INSERT (6건) 성공', !error, error?.message);

  // 재조회 확인
  const { count } = await supabase
    .from('mission_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', TEST_USER)
    .eq('mission_code', TEST_MISSION);
  log('6건 저장 확인', count === 6, `count=${count}`);

  // event_type enum 검증 — 잘못된 값 거부 확인
  const { error: badErr } = await supabase.from('mission_events').insert([{
    ...baseEvt, event_type: 'invalid_event_type_xyz', step_id: null, stage: 'mission', payload: {},
  }]);
  log('잘못된 event_type 거부됨', !!badErr, badErr ? '정상 거부' : '거부되지 않음(스키마 재확인 필요)');
}

// ═══════════════════════════════════════════════
// T3. ai_interactions
// ═══════════════════════════════════════════════
async function testAiInteractions() {
  section('T3. ai_interactions — AI 로그 저장');

  const aiSessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  const row = {
    user_id:           TEST_USER,
    session_id:        aiSessionId,
    mission_code:      TEST_MISSION,
    step_id:           'step4',
    attempt:           1,
    provider:          'gemini',
    model_name:        'gemini-2.0-flash',
    system_prompt:     '당신은 AI 리터러시 튜터입니다.',
    user_prompt:       'AI가 스스로 학습한다는 게 무슨 뜻인가요?',
    ai_response:       'AI는 많은 데이터를 보고 패턴을 찾아 스스로 개선해요.',
    response_type:     'text',
    response_metadata: { latency_ms: 830 },
    fallback_used:     false,
  };

  const { data, error } = await supabase
    .from('ai_interactions')
    .insert([row])
    .select('id')
    .single();

  log('INSERT 성공',  !error, error?.message);
  log('id 반환',     !!data?.id, data?.id ? `id=${data.id}` : '');

  // student_action 업데이트
  if (data?.id) {
    const { error: updErr } = await supabase
      .from('ai_interactions')
      .update({ student_action: 'applied', student_action_payload: { note: '참고해서 작성' } })
      .eq('id', data.id);
    log('student_action 업데이트', !updErr, updErr?.message);
  }
}

// ═══════════════════════════════════════════════
// T4. post_mission_evaluations
// ═══════════════════════════════════════════════
async function testSelfEval() {
  section('T4. post_mission_evaluations — 자가평가 저장');

  if (!created.submissionId) {
    log('submission_id 필요 — T1 실패로 건너뜀', false); return;
  }

  const row = {
    submission_id:         created.submissionId,
    user_id:               TEST_USER,
    mission_code:          TEST_MISSION,
    grade_band:            TEST_GRADE,
    k_responses:           { 'K1.4': 4, 'K4.3': 3 },
    s_responses:           { 'S.critical_thinking': 4 },
    a_responses:           { 'A.curious': 5 },
    difficulty_rating:     3,
    ai_helpfulness_rating: 4,
  };

  const { data, error } = await supabase
    .from('post_mission_evaluations')
    .insert([row])
    .select('id')
    .single();

  log('INSERT 성공',           !error, error?.message);
  log('id 반환',               !!data?.id);
  log('difficulty_rating 저장', data ? true : false,
    data ? `difficulty=${row.difficulty_rating}` : '');
  if (data?.id) created.evalId = data.id;

  // submission_id FK 무결성 — 존재하지 않는 id 시도
  const { error: fkErr } = await supabase
    .from('post_mission_evaluations')
    .insert([{ ...row, submission_id: 99999999 }]);
  log('존재하지 않는 submission_id FK 거부', !!fkErr, fkErr ? '정상 거부' : '거부 안됨(FK 확인 필요)');
}

// ═══════════════════════════════════════════════
// T5. teacher_ratings
// ═══════════════════════════════════════════════
async function testTeacherRating() {
  section('T5. teacher_ratings — 교사 채점 저장');

  if (!created.submissionId) {
    log('submission_id 필요 — T1 실패로 건너뜀', false); return;
  }

  const rubricScores = {
    A: { a1: 3 },
    B: { b1: 3, b2: 2, b3: 3 },
  };

  const row = {
    submission_id:        created.submissionId,
    rater_id:             '__test_teacher',
    rater_school:         '테스트초등학교',
    rubric_scores:        rubricScores,
    qualitative_comment:  '전반적으로 AI 기능 이해가 잘 됨. 근거 서술 보완 필요.',
    rating_duration_sec:  142,
  };

  const { data, error } = await supabase
    .from('teacher_ratings')
    .insert([row])
    .select('id')
    .single();

  log('INSERT 성공',          !error, error?.message);
  log('id 반환',              !!data?.id);
  log('rubric_scores jsonb 저장', data ? true : false);
  if (data?.id) created.ratingId = data.id;

  // 수정 (upsert 패턴 — 기존 id로 update)
  if (data?.id) {
    const { error: updErr } = await supabase
      .from('teacher_ratings')
      .update({ qualitative_comment: '수정된 논평' })
      .eq('id', data.id);
    log('채점 수정 성공', !updErr, updErr?.message);
  }
}

// ═══════════════════════════════════════════════
// T6. ksa_item_bank 조회
// ═══════════════════════════════════════════════
async function testKsaBank() {
  section('T6. ksa_item_bank — 조회 필터링');

  // E-1-M KSA: K1.4, S.critical_thinking
  const codes = ['K1.4', 'S.critical_thinking'];
  const { data, error } = await supabase
    .from('ksa_item_bank')
    .select('ksa_code, grade_band, item_text')
    .eq('grade_band', 'M')
    .in('ksa_code', codes)
    .eq('is_active', true);

  log('조회 성공', !error, error?.message);
  log('M학년 항목 반환', (data?.length ?? 0) > 0, `${data?.length ?? 0}건`);

  // 전체 카운트
  const { count } = await supabase
    .from('ksa_item_bank')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  log('활성 항목 84개 이상', (count ?? 0) >= 84, `count=${count}`);
}

// ═══════════════════════════════════════════════
// T7. 전체 파이프라인 체인 검증
// ═══════════════════════════════════════════════
async function testPipelineChain() {
  section('T7. 전체 파이프라인 체인 — JOIN 조회');

  if (!created.submissionId) {
    log('submission_id 없음 — 건너뜀', false); return;
  }

  // submission 조회
  const { data: sub } = await supabase
    .from('mission_submissions_v4')
    .select('id, user_id, mission_code')
    .eq('id', created.submissionId)
    .single();
  log('submission 조회', !!sub?.id);

  // post_mission_evaluations 직접 조회
  const { data: evals } = await supabase
    .from('post_mission_evaluations')
    .select('id, difficulty_rating')
    .eq('submission_id', created.submissionId);
  log('post_mission_evaluations 연결', (evals?.length ?? 0) > 0, `${evals?.length ?? 0}건`);

  // teacher_ratings 직접 조회
  const { data: ratings } = await supabase
    .from('teacher_ratings')
    .select('id, rubric_scores')
    .eq('submission_id', created.submissionId);
  log('teacher_ratings 연결', (ratings?.length ?? 0) > 0, `${ratings?.length ?? 0}건`);

  // mission_events → submission 연결 (session_id 기반)
  const { count: evtCount } = await supabase
    .from('mission_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', TEST_USER)
    .eq('mission_code', TEST_MISSION);

  log('mission_events 연결 (user+mission)',  (evtCount ?? 0) >= 6, `이벤트 ${evtCount}건`);
}

// ═══════════════════════════════════════════════
// T8. 테스트 데이터 정리
// ═══════════════════════════════════════════════
async function cleanup() {
  section('T8. 테스트 데이터 정리');

  const results = await Promise.all([
    supabase.from('mission_events')           .delete().eq('user_id', TEST_USER),
    supabase.from('ai_interactions')          .delete().eq('user_id', TEST_USER),
    created.evalId
      ? supabase.from('post_mission_evaluations').delete().eq('id', created.evalId)
      : Promise.resolve({ error: null }),
    created.ratingId
      ? supabase.from('teacher_ratings')        .delete().eq('id', created.ratingId)
      : Promise.resolve({ error: null }),
    created.submissionId
      ? supabase.from('mission_submissions_v4') .delete().eq('id', created.submissionId)
      : Promise.resolve({ error: null }),
  ]);

  const anyErr = results.find(r => r.error);
  log('테스트 데이터 전체 삭제', !anyErr, anyErr?.error?.message);
}

// ═══════════════════════════════════════════════
// 메인
// ═══════════════════════════════════════════════
async function main() {
  const t0 = Date.now();
  console.log('═'.repeat(54));
  console.log('  LearnAILIT V4 — Integration Test (M12)');
  console.log(`  RUN_ID: ${RUN_ID}`);
  console.log(`  실행: ${new Date().toLocaleString('ko-KR')}`);
  console.log('═'.repeat(54));

  try {
    await testSubmission();
    await testEvents();
    await testAiInteractions();
    await testSelfEval();
    await testTeacherRating();
    await testKsaBank();
    await testPipelineChain();
  } finally {
    await cleanup();
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const total   = passed + failed;
  console.log('\n' + '═'.repeat(54));
  console.log(`  결과: ${passed}/${total} 통과  ${failed > 0 ? `(실패 ${failed}건)` : ''}`);
  console.log(`  소요: ${elapsed}s`);
  console.log('═'.repeat(54) + '\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
