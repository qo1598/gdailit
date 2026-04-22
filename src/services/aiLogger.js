import { supabase } from '../supabaseClient.js';

const ENABLED = import.meta.env.VITE_ENABLE_RESEARCH_LOGGING === 'true';

/**
 * AI 호출 1건을 ai_interactions 테이블에 기록한다.
 * 실패해도 throw하지 않음 — 로깅 오류가 UX에 영향 없도록.
 */
export async function logAiInteraction({
  userId,
  sessionId,
  missionCode,
  stepId,
  attempt = 1,
  provider,           // 'gemini-text' | 'gemini-image'
  modelName,
  systemPrompt = null,
  userPrompt,
  aiResponse = null,
  responseType,       // 'text' | 'options_list' | 'options_block' | 'image_url'
  latencyMs = null,
  fallbackUsed = false,
  studentAction = null,
  studentActionPayload = null,
}) {
  if (!ENABLED) return null;

  try {
    const { data, error } = await supabase.from('ai_interactions').insert({
      user_id:                userId,
      session_id:             sessionId,
      mission_code:           missionCode,
      step_id:                stepId,
      attempt,
      provider,
      model_name:             modelName,
      system_prompt:          systemPrompt,
      user_prompt:            userPrompt,
      ai_response:            aiResponse,
      response_type:          responseType,
      response_metadata:      latencyMs !== null ? { latency_ms: latencyMs } : {},
      fallback_used:          fallbackUsed,
      student_action:         studentAction,
      student_action_payload: studentActionPayload,
    }).select('id').single();

    if (error) throw error;
    return data?.id ?? null;
  } catch (_) {
    return null;
  }
}

/**
 * 학생이 AI 결과에 취한 행동을 사후 업데이트한다.
 * (accepted / modified / rejected / regenerated)
 */
export async function updateStudentAction(interactionId, action, payload = null) {
  if (!ENABLED || !interactionId) return;
  try {
    await supabase
      .from('ai_interactions')
      .update({ student_action: action, student_action_payload: payload })
      .eq('id', interactionId);
  } catch (_) { /* 조용히 무시 */ }
}
