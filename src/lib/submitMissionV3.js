import { supabase } from '../supabaseClient';

/**
 * V3 미션 제출 함수.
 *
 * 테이블: mission_submissions_v3
 *   user_id        text
 *   mission_code   text   (e.g. 'E-1-L')
 *   grade_band     text   (e.g. 'L' | 'M' | 'H')
 *   domain         text   (e.g. 'Engaging')
 *   performance_type text (e.g. 'TD' | 'SJ' | 'GC' | 'DS')
 *   answers        jsonb  (step별 답변 전체)
 *   started_at     timestamptz
 *   submitted_at   timestamptz
 *   completed      boolean
 *
 * answers 예시:
 *   {
 *     step1: ["robot_vacuum", "face_unlock"],
 *     step2: { type: "card", value: "navigation_app" },
 *     step3: "home",
 *     step4: "recognize",
 *     step_trace: [{ step: "step1", completed: true }, ...]
 *   }
 *
 * 미션 step 구조가 바뀌어도 answers JSONB 필드만 수정하면 되므로
 * 테이블 스키마 변경 없이 유지 가능합니다.
 */
export async function submitMissionV3({ userId, gradeSpec, mission, answers, startedAt, hintUsed = {}, timeSpent = {} }) {
  const stepAnswers = {};
  gradeSpec.steps.forEach(step => {
    const ans = answers[step.id];
    if (ans !== undefined && ans !== null) {
      stepAnswers[step.id] = ans;
    }
  });

  const row = {
    user_id: userId,
    mission_code: gradeSpec.cardCode,
    grade_band: gradeSpec.cardCode.split('-').pop(),
    domain: mission.meta.domain,
    performance_type: gradeSpec.performanceType,
    answers: {
      ...stepAnswers,
      step_trace: gradeSpec.steps.map(s => ({
        step: s.id,
        completed: answers[s.id] !== undefined && answers[s.id] !== null,
        hint_used: hintUsed[s.id] || false,
        time_spent_sec: timeSpent[s.id] || null,
      })),
      hint_used: hintUsed,
      time_spent_sec: timeSpent,
    },
    started_at: startedAt,
    submitted_at: new Date().toISOString(),
    completed: true,
  };

  const { error } = await supabase
    .from('mission_submissions_v3')
    .upsert([row], { onConflict: 'user_id,mission_code' });

  if (error) throw error;

  return row;
}
