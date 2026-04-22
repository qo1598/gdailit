// scripts/research_data_qa.cjs
// M11: 연구 데이터 품질 QA 스크립트
//
// 실행: SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/research_data_qa.cjs
// 또는: node scripts/research_data_qa.cjs  (로컬 .env.local 자동 로드)
//
// 검사 항목
//   1. mission_submissions_v4   — 필수 필드 누락, 답변 스키마 일관성
//   2. mission_events           — 세션 커버리지 (submit이 있는 submission에 session 존재 여부)
//   3. ai_interactions          — GC/DS 미션 AI 로그 커버리지
//   4. post_mission_evaluations — 자가평가 완료율
//   5. teacher_ratings          — 채점 커버리지
//   6. ksa_item_bank            — seeding 상태 (84개 기대)

const fs   = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ── 환경변수 로드 (.env.local 우선)
function loadEnv() {
  const envFile = path.resolve(__dirname, '../.env.local');
  const fallback = path.resolve(__dirname, '../.env');
  const file = fs.existsSync(envFile) ? envFile : fs.existsSync(fallback) ? fallback : null;
  if (!file) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[ERROR] SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── 유틸
const OK   = '✅';
const WARN = '⚠️ ';
const ERR  = '❌';
const SEP  = '─'.repeat(56);

function pct(n, d) { return d === 0 ? '0%' : `${Math.round(n / d * 100)}%`; }
function pad(s, n)  { return String(s).padEnd(n, ' '); }

// ── 개별 검사 함수 ──────────────────────────────────────────

async function checkKsaItemBank() {
  console.log('\n' + SEP);
  console.log('① ksa_item_bank — 시딩 상태');
  console.log(SEP);

  const { count: total } = await supabase
    .from('ksa_item_bank').select('*', { count: 'exact', head: true });

  const { data: byBand } = await supabase
    .from('ksa_item_bank')
    .select('grade_band, ksa_category')
    .eq('is_active', true);

  const groupBy = {};
  (byBand || []).forEach(r => {
    const k = `${r.grade_band}-${r.ksa_category}`;
    groupBy[k] = (groupBy[k] || 0) + 1;
  });

  console.log(`  전체 항목 수: ${total} (기대: 84)`);
  const icon = total >= 84 ? OK : WARN;
  console.log(`  ${icon} ${total >= 84 ? '정상' : '부족 — seed.cjs 재실행 필요'}`);

  console.log('\n  학년군 × KSA 범주별 분포:');
  for (const [k, v] of Object.entries(groupBy).sort()) {
    console.log(`    ${pad(k, 8)} : ${v}개`);
  }
}

async function checkSubmissions() {
  console.log('\n' + SEP);
  console.log('② mission_submissions_v4 — 필수 필드 / 데이터 일관성');
  console.log(SEP);

  const { data: subs, error } = await supabase
    .from('mission_submissions_v4')
    .select('id, user_id, mission_code, grade_band, domain, performance_type, answers, completed, submitted_at');

  if (error) { console.log(`  ${ERR} 쿼리 실패: ${error.message}`); return []; }
  if (!subs || subs.length === 0) { console.log('  (제출물 없음)'); return []; }

  console.log(`  전체 제출 수: ${subs.length}`);

  const issues = [];
  let missingFields = 0, noSchema = 0, noArtifact = 0, noStepTrace = 0;

  for (const sub of subs) {
    const row = `  submission ${sub.id} (${sub.mission_code})`;
    const ans = sub.answers || {};

    // 필수 최상위 필드
    for (const f of ['user_id', 'mission_code', 'grade_band', 'domain', 'performance_type']) {
      if (!sub[f]) {
        issues.push(`${row}: ${f} 없음`);
        missingFields++;
      }
    }
    // answers 내부 구조
    if (!ans.step_schema) noSchema++;
    if (!ans.step_trace)  noStepTrace++;
    if (!ans.artifact)    noArtifact++;
  }

  console.log(`  ${noSchema   === 0 ? OK : WARN} step_schema 누락: ${noSchema}건`);
  console.log(`  ${noStepTrace === 0 ? OK : WARN} step_trace 누락:  ${noStepTrace}건`);
  console.log(`  ${noArtifact === 0 ? OK : WARN} artifact 누락:    ${noArtifact}건`);
  console.log(`  ${missingFields === 0 ? OK : ERR} 필수 필드 누락:  ${missingFields}건`);

  if (issues.length) {
    console.log('\n  상세 이슈:');
    issues.slice(0, 10).forEach(i => console.log('   ' + i));
    if (issues.length > 10) console.log(`   ... 외 ${issues.length - 10}건`);
  }

  // 미션별 분포
  const byCode = {};
  subs.forEach(s => { byCode[s.mission_code] = (byCode[s.mission_code] || 0) + 1; });
  console.log('\n  미션별 제출 건수:');
  Object.entries(byCode).sort().forEach(([k, v]) => {
    console.log(`    ${pad(k, 10)}: ${v}건`);
  });

  return subs;
}

async function checkEventLogs(subs) {
  console.log('\n' + SEP);
  console.log('③ mission_events — 세션 커버리지');
  console.log(SEP);

  if (!subs.length) { console.log('  (제출물 없음, 건너뜀)'); return; }

  const { data: events } = await supabase
    .from('mission_events')
    .select('user_id, mission_code, event_type')
    .in('event_type', ['session_start', 'mission_submit']);

  if (!events || events.length === 0) {
    console.log(`  ${WARN} 이벤트 로그 없음. eventLogger가 연결됐는지 확인하세요.`);
    return;
  }

  const sessionSet  = new Set();
  const submitSet   = new Set();
  events.forEach(e => {
    const key = `${e.user_id}::${e.mission_code}`;
    if (e.event_type === 'session_start')  sessionSet.add(key);
    if (e.event_type === 'mission_submit') submitSet.add(key);
  });

  let hasSession = 0, hasSubmitEvent = 0;
  for (const sub of subs) {
    const key = `${sub.user_id}::${sub.mission_code}`;
    if (sessionSet.has(key))  hasSession++;
    if (submitSet.has(key))   hasSubmitEvent++;
  }

  console.log(`  총 이벤트 수:         ${events.length}`);
  console.log(`  ${pct(hasSession,  subs.length) === '100%' ? OK : WARN} 세션 로그 있는 제출: ${hasSession}/${subs.length} (${pct(hasSession, subs.length)})`);
  console.log(`  ${pct(hasSubmitEvent, subs.length) === '100%' ? OK : WARN} 제출 이벤트 있는 건: ${hasSubmitEvent}/${subs.length} (${pct(hasSubmitEvent, subs.length)})`);
}

async function checkAiLogs(subs) {
  console.log('\n' + SEP);
  console.log('④ ai_interactions — AI 로그 커버리지');
  console.log(SEP);

  const aiMissions = subs.filter(s => ['GC', 'DS'].includes(s.performance_type));
  if (!aiMissions.length) {
    console.log('  GC/DS 미션 제출 없음, 건너뜀');
    return;
  }

  const { data: logs } = await supabase
    .from('ai_interactions')
    .select('user_id, mission_code');

  const logSet = new Set();
  (logs || []).forEach(l => logSet.add(`${l.user_id}::${l.mission_code}`));

  let covered = 0;
  for (const sub of aiMissions) {
    if (logSet.has(`${sub.user_id}::${sub.mission_code}`)) covered++;
  }

  console.log(`  GC/DS 제출 수: ${aiMissions.length}`);
  console.log(`  총 AI 로그 수: ${logs?.length ?? 0}`);
  console.log(`  ${pct(covered, aiMissions.length) === '100%' ? OK : WARN} AI 로그 있는 GC/DS 제출: ${covered}/${aiMissions.length} (${pct(covered, aiMissions.length)})`);

  if (covered < aiMissions.length) {
    const missing = aiMissions.filter(s => !logSet.has(`${s.user_id}::${s.mission_code}`));
    console.log(`\n  AI 로그 미수집 제출:`);
    missing.slice(0, 5).forEach(s => console.log(`    - ${s.mission_code} / user ${s.user_id}`));
    if (missing.length > 5) console.log(`    ... 외 ${missing.length - 5}건`);
  }
}

async function checkSelfEval(subs) {
  console.log('\n' + SEP);
  console.log('⑤ post_mission_evaluations — 자가평가 완료율');
  console.log(SEP);

  if (!subs.length) { console.log('  (제출물 없음, 건너뜀)'); return; }

  const { data: evals } = await supabase
    .from('post_mission_evaluations')
    .select('submission_id, user_id, mission_code, difficulty_rating, ai_helpfulness_rating');

  if (!evals || evals.length === 0) {
    console.log(`  ${WARN} 자가평가 데이터 없음`);
    return;
  }

  const evalMap = new Set(evals.map(e => e.submission_id));
  const covered = subs.filter(s => evalMap.has(s.id)).length;

  console.log(`  자가평가 총 수:     ${evals.length}`);
  console.log(`  ${pct(covered, subs.length) === '100%' ? OK : WARN} 자가평가 완료 제출: ${covered}/${subs.length} (${pct(covered, subs.length)})`);

  // 난이도·AI도움 응답 분포
  const diffDist = {}, aiDist = {};
  evals.forEach(e => {
    if (e.difficulty_rating != null) diffDist[e.difficulty_rating] = (diffDist[e.difficulty_rating] || 0) + 1;
    if (e.ai_helpfulness_rating != null) aiDist[e.ai_helpfulness_rating] = (aiDist[e.ai_helpfulness_rating] || 0) + 1;
  });

  if (Object.keys(diffDist).length) {
    console.log(`\n  난이도 분포:  ${Object.entries(diffDist).sort().map(([k,v]) => `${k}점=${v}건`).join(', ')}`);
  }
  if (Object.keys(aiDist).length) {
    console.log(`  AI도움 분포:  ${Object.entries(aiDist).sort().map(([k,v]) => `${k}점=${v}건`).join(', ')}`);
  }

  // incomplete — K/S/A 중 하나라도 null
  const incomplete = evals.filter(e => !e.k_responses && !e.s_responses && !e.a_responses);
  if (incomplete.length) {
    console.log(`\n  ${WARN} KSA 응답 모두 null인 평가: ${incomplete.length}건`);
  }
}

async function checkTeacherRatings(subs) {
  console.log('\n' + SEP);
  console.log('⑥ teacher_ratings — 채점 커버리지');
  console.log(SEP);

  if (!subs.length) { console.log('  (제출물 없음, 건너뜀)'); return; }

  const { data: ratings } = await supabase
    .from('teacher_ratings')
    .select('submission_id, rater_id, rubric_scores, rating_duration_sec, rated_at');

  if (!ratings || ratings.length === 0) {
    console.log(`  ${WARN} 교사 채점 데이터 없음`);
    return;
  }

  const ratedSet = new Set(ratings.map(r => r.submission_id));
  const covered  = subs.filter(s => ratedSet.has(s.id)).length;

  console.log(`  채점 레코드 수:   ${ratings.length}`);
  console.log(`  ${pct(covered, subs.length) === '100%' ? OK : WARN} 채점 완료 제출:  ${covered}/${subs.length} (${pct(covered, subs.length)})`);

  // 평균 채점 소요 시간
  const durations = ratings.map(r => r.rating_duration_sec).filter(Boolean);
  if (durations.length) {
    const avg = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    console.log(`  평균 채점 시간:  ${avg}초`);
  }

  // rubric_scores 구조 이상 탐지
  let malformed = 0;
  for (const r of ratings) {
    const s = r.rubric_scores;
    if (!s || typeof s !== 'object' || !Object.keys(s).length) malformed++;
  }
  if (malformed) {
    console.log(`  ${ERR} rubric_scores 비어있거나 이상한 레코드: ${malformed}건`);
  }
}

// ── 중복 제출 탐지 ───────────────────────────────────────────
async function checkDuplicates() {
  console.log('\n' + SEP);
  console.log('⑦ 중복 제출 탐지');
  console.log(SEP);

  const { data } = await supabase
    .from('mission_submissions_v4')
    .select('user_id, mission_code');

  if (!data || !data.length) { console.log('  (데이터 없음)'); return; }

  const counter = {};
  data.forEach(r => {
    const k = `${r.user_id}::${r.mission_code}`;
    counter[k] = (counter[k] || 0) + 1;
  });
  const dups = Object.entries(counter).filter(([, v]) => v > 1);

  if (dups.length === 0) {
    console.log(`  ${OK} 중복 제출 없음`);
  } else {
    console.log(`  ${WARN} 중복 (user_id + mission_code 기준): ${dups.length}건`);
    dups.slice(0, 5).forEach(([k, v]) => console.log(`    ${k} → ${v}건`));
  }
}

// ── 메인 ────────────────────────────────────────────────────
async function main() {
  const startMs = Date.now();
  console.log('='.repeat(56));
  console.log(' LearnAILIT V4 — Research Data QA');
  console.log(` 실행: ${new Date().toLocaleString('ko-KR')}`);
  console.log('='.repeat(56));

  await checkKsaItemBank();
  const subs = await checkSubmissions();
  await checkEventLogs(subs);
  await checkAiLogs(subs);
  await checkSelfEval(subs);
  await checkTeacherRatings(subs);
  await checkDuplicates();

  console.log('\n' + '='.repeat(56));
  console.log(` QA 완료 — ${((Date.now() - startMs) / 1000).toFixed(1)}s`);
  console.log('='.repeat(56) + '\n');
}

main().catch(err => { console.error(err); process.exit(1); });
