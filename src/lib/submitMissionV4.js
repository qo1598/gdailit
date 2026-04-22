import { supabase } from '../supabaseClient';

/**
 * V4 미션 제출 — 학생 수행 원천 데이터 저장.
 *
 * 테이블: mission_submissions_v4
 *   user_id          text
 *   mission_code     text   (e.g. 'E-1-L')
 *   grade_band       text   ('L' | 'M' | 'H')
 *   domain           text
 *   performance_type text   ('TD' | 'SJ' | 'GC' | 'DS')
 *   answers          jsonb  (아래 내부 구조 참조)
 *   started_at       timestamptz
 *   submitted_at     timestamptz
 *   completed        boolean
 *
 * answers 내부 구조:
 *   step1, step2, ...        학생이 각 step에서 생성한 응답 원문.
 *                            uiMode에 따라 shape가 다름 (string | array | object).
 *   step1_other_text, ...    각 step에서 '기타'를 선택했을 때 자유 입력 텍스트.
 *                            원천 데이터 유실 방지 목적으로 별도 키로 보존.
 *   step_schema              각 step의 id·title·uiMode·question·hint 를 담은
 *                            해석용 메타. 응답 데이터가 "어떤 step의 어떤 입력인지"
 *                            뒤에 스펙 없이도 식별 가능하게 함.
 *   step_trace               step별 완료/힌트사용/체류시간 요약 (빠른 조회용 중복 기록).
 *   hint_used                { stepId: boolean } — 학생이 힌트를 눌렀는지.
 *   time_spent_sec           { stepId: number }  — step 체류 시간(초).
 *   artifact                 submit.artifact.template 치환 결과 문장 (표시용 요약).
 *   artifact_binding_key     artifact 저장 키.
 *
 * ⚠️ 이 파일은 학생 원천 응답의 "있는 그대로" 보존에 집중한다.
 *    채점·루브릭 점수 산출 로직은 이 계층에 두지 않는다.
 */

// submit.artifact.template 안의 {stepN} 토큰을 응답 값으로 치환
function renderArtifact(artifact, answers, steps) {
  if (!artifact?.template) return null;
  return artifact.template.replace(/\{(\w+)\}/g, (_, key) => {
    // 계산 토큰: {stepN_<judge>_count} 또는 {stepN_non_<judge>_count}
    const computed = key.match(/^(step\d+)_(non_)?([a-zA-Z]+)_count$/);
    if (computed) {
      const [, stepKey, negate, judgeId] = computed;
      const stepAns = answers[stepKey];
      if (!stepAns || typeof stepAns !== 'object') return '0';
      const matches = (v) => {
        if (typeof v === 'string') return v === judgeId;
        if (v && typeof v === 'object') {
          if (v.judge === judgeId || v.judgment === judgeId) return true;
          if ((judgeId === 'strange' || judgeId === 'selected') && v.selected === true) return true;
        }
        return false;
      };
      const exists = (v) => {
        if (v == null || v === '') return false;
        if (typeof v === 'string') return true;
        if (typeof v === 'object') return v.judge != null || v.judgment != null || v.selected === true;
        return false;
      };
      const count = Object.values(stepAns).filter(v => negate ? (exists(v) && !matches(v)) : matches(v)).length;
      return String(count);
    }
    // 서브필드 토큰: {stepN_field} — multi_free_text·ai_chat_turn 등 객체 답의 하위 필드
    if (answers[key] == null) {
      const sub = key.match(/^(step\d+)_(\w+)$/);
      if (sub) {
        const [, stepKey, field] = sub;
        const parent = answers[stepKey];
        if (parent && typeof parent === 'object') {
          const sv = parent[field];
          if (sv != null) {
            if (typeof sv === 'string') return sv;
            if (Array.isArray(sv)) return sv.join(', ');
            return String(sv);
          }
        }
      }
    }
    const val = answers[key];
    if (val == null) return `[${key}]`;
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') {
      const step = steps?.find(s => s.id === key);
      if ((step?.uiMode === 'per_case_judge' || step?.uiMode === 'card_drop_board') && step?.judgmentOptions) {
        const counts = {};
        Object.values(val).forEach(v => {
          const j = v?.judgment;
          if (j) counts[j] = (counts[j] || 0) + 1;
        });
        const parts = step.judgmentOptions
          .filter(opt => counts[opt.id])
          .map(opt => `${counts[opt.id]}개 ${opt.label}`);
        if (parts.length) return parts.join(', ');
      }
      return JSON.stringify(val);
    }
    return String(val);
  });
}

// 각 step이 어떤 입력을 담고 있는지 해석 가능하게 하는 메타
function buildStepSchema(steps) {
  return steps.map(s => ({
    step_id: s.id,
    title: s.title,
    ui_mode: s.uiMode,
    question: s.question ?? null,
    hint: s.hint ?? null,
  }));
}

export async function submitMissionV4({ userId, gradeSpec, mission, answers, startedAt, hintUsed = {}, timeSpent = {} }) {
  const stepAnswers = {};
  gradeSpec.steps.forEach(step => {
    const ans = answers[step.id];
    if (ans !== undefined && ans !== null) {
      stepAnswers[step.id] = ans;
    }
    // '기타' 자유 입력 — 유실 방지 위해 함께 저장
    const otherKey = `${step.id}_other_text`;
    const otherVal = answers[otherKey];
    const isEmptyString = typeof otherVal === 'string' && otherVal.trim() === '';
    if (otherVal !== undefined && otherVal !== null && !isEmptyString) {
      stepAnswers[otherKey] = otherVal;
    }
  });

  const artifactText = renderArtifact(gradeSpec.submit?.artifact, stepAnswers, gradeSpec.steps);

  const row = {
    user_id: userId,
    mission_code: gradeSpec.cardCode,
    grade_band: gradeSpec.cardCode.split('-').pop(),
    domain: mission.meta.domain,
    performance_type: gradeSpec.performanceType,
    answers: {
      ...stepAnswers,
      step_schema: buildStepSchema(gradeSpec.steps),
      step_trace: gradeSpec.steps.map(s => ({
        step: s.id,
        completed: answers[s.id] !== undefined && answers[s.id] !== null,
        hint_used: hintUsed[s.id] || false,
        time_spent_sec: timeSpent[s.id] || null,
      })),
      hint_used: hintUsed,
      time_spent_sec: timeSpent,
      artifact: artifactText,
      artifact_binding_key: gradeSpec.submit?.artifact?.bindingKey || null,
    },
    started_at: startedAt,
    submitted_at: new Date().toISOString(),
    completed: true,
  };

  const { data, error } = await supabase
    .from('mission_submissions_v4')
    .upsert([row], { onConflict: 'user_id,mission_code' })
    .select('id')
    .single();

  if (error) throw error;

  return { ...row, submissionId: data?.id ?? null };
}
