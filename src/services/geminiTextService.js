import { GoogleGenAI } from "@google/genai";
import { logAiInteraction } from './aiLogger.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-lite";
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Gemini 텍스트 생성 서비스 (C영역 aiCall 전용).
 * - completion   : 단일 텍스트
 * - options_list : 줄바꿈으로 구분된 후보를 배열로 반환
 * - chat         : 단일 턴 대화 (현 버전은 completion과 동일 처리, 히스토리는 호출자 관리)
 *
 * 실패 시 throw. 호출자가 aiCall.fallback 처리.
 */
export async function generateText({
  systemPrompt,
  userPrompt,
  mode = 'completion',
  maxTokens = 500,
  temperature = 0.8,
  // 로깅용 (선택)
  _log = null,  // { userId, sessionId, missionCode, stepId, attempt }
}) {
  if (!userPrompt?.trim()) throw new Error("userPrompt가 비어 있어요.");

  const contents = [{ role: "user", parts: [{ text: userPrompt }] }];
  const config = {
    maxOutputTokens: maxTokens,
    temperature,
    ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
  };

  const t0 = Date.now();
  let text = '';
  let fallbackUsed = false;

  try {
    const res = await ai.models.generateContent({ model: MODEL, contents, config });
    text = res?.text ?? res?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join("") ?? "";
    if (!text.trim()) throw new Error("응답이 비어 있어요.");
  } catch (err) {
    fallbackUsed = true;
    if (_log) {
      await logAiInteraction({
        ..._log,
        provider: 'gemini-text',
        modelName: MODEL,
        systemPrompt,
        userPrompt,
        aiResponse: null,
        responseType: mode,
        latencyMs: Date.now() - t0,
        fallbackUsed: true,
      });
    }
    throw err;
  }

  if (_log) {
    await logAiInteraction({
      ..._log,
      provider: 'gemini-text',
      modelName: MODEL,
      systemPrompt,
      userPrompt,
      aiResponse: text,
      responseType: mode,
      latencyMs: Date.now() - t0,
      fallbackUsed,
    });
  }

  if (!text.trim()) throw new Error("응답이 비어 있어요.");

  if (mode === 'options_list') {
    return text
      .split(/\r?\n/)
      .map(line => line.replace(/^\s*(?:[-*•\d]+[.)]?)\s*/, '').trim())
      .filter(Boolean);
  }
  if (mode === 'options_block') {
    // 구분자(=== 혹은 --- 한 줄) 기준으로 블록 단위 분리.
    // 각 블록은 여러 문장/단락일 수 있음.
    // 인사말/라벨/번호 등 AI 서두를 제거하고 본문만 남긴다.
    const LABEL_LINE = /^\s*(?:\[[^\]]+\]|【[^】]+】|<[^>]+>|（[^）]+）|\([^)]+\))\s*$/;
    const NUMBER_PREFIX = /^\s*(?:후보|이야기|옵션|안)?\s*\d+\s*[.):·\-—]\s*/u;
    const LABEL_PREFIX = /^\s*(?:\[[^\]]+\]|【[^】]+】)\s*/u;

    const cleanBlock = (block) => {
      const lines = block.split(/\r?\n/)
        .map(l => l.replace(LABEL_PREFIX, '').trim())
        .filter(l => l && !LABEL_LINE.test(l));
      if (lines.length === 0) return '';
      lines[0] = lines[0].replace(NUMBER_PREFIX, '').trim();
      return lines.join('\n').trim();
    };

    const isGreeting = (block) => {
      // 한국어 AI 인사말 패턴: '네,', '좋아요', '알겠습니다', '제안해 드릴게요' 등.
      if (!block) return true;
      if (block.length < 80) return true;
      const sentenceCount = (block.match(/[.!?。]|[다요까][.\s\n]/g) || []).length;
      if (sentenceCount < 3) return true;
      const greetingHead = /^(네[,.\s]|좋아요|알겠|안녕|그럼|자,|여기|아래|다음은)/;
      if (greetingHead.test(block) && /제안|드릴게요|만들어|준비/.test(block.slice(0, 120))) return true;
      return false;
    };

    return text
      .split(/\r?\n\s*(?:={3,}|-{3,})\s*\r?\n/)
      .map(cleanBlock)
      .filter(b => !isGreeting(b));
  }
  return text.trim();
}

export { MODEL as GEMINI_TEXT_MODEL };
