import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * 주제 유형별 이미지 생성 컨텍스트.
 * 학생이 입력한 프롬프트 앞에 붙어 Imagen에게 방향을 준다.
 */
const TASK_IMAGE_CONTEXTS = {
  poster: {
    ko: "환경 보호 포스터, 초등학생 대상, 밝고 희망찬 분위기, 자연과 지구를 주제로",
    en: "environmental protection educational poster for elementary school, bright hopeful colors, nature and earth theme"
  },
  event_notice: {
    ko: "학교 행사 안내 포스터, 초등학생 대상, 신나고 활기찬 분위기, 학교 축제 느낌",
    en: "school event announcement poster for elementary school, cheerful and energetic, school festival atmosphere"
  },
  book_intro: {
    ko: "동화책 소개 일러스트, 아이 친화적, 따뜻하고 상상력 자극하는 분위기, 모험과 이야기 느낌",
    en: "children's book introduction illustration, warm and imaginative, adventure and storytelling atmosphere"
  }
};

/**
 * 학생이 입력한 프롬프트와 선택한 주제를 결합해 Imagen 프롬프트를 구성한다.
 * @param {string} studentPrompt - 학생이 직접 입력한 프롬프트
 * @param {string} taskType - 'poster' | 'event_notice' | 'book_intro'
 */
function buildImagenPrompt(studentPrompt, taskType) {
  const ctx = TASK_IMAGE_CONTEXTS[taskType] || TASK_IMAGE_CONTEXTS.poster;
  return [
    "2D illustration, cute cartoon style, colorful and vibrant, child-friendly art style,",
    "simple and clear composition, no text overlay,",
    ctx.en + ".",
    "Korean student's creative direction:",
    studentPrompt
  ].join(" ");
}

/**
 * Imagen으로 이미지를 생성하고 base64 data URL을 반환한다.
 * @param {string} studentPrompt
 * @param {string} taskType
 * @returns {Promise<string>} data:image/png;base64,...
 */
export async function generateImage(studentPrompt, taskType) {
  const fullPrompt = buildImagenPrompt(studentPrompt, taskType);

  const response = await ai.models.generateImages({
    model: "imagen-4.0-fast-generate-001",
    prompt: fullPrompt,
    config: { numberOfImages: 1 }
  });

  const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!imageBytes) throw new Error("이미지를 생성하지 못했어요. 다시 시도해주세요.");

  return `data:image/png;base64,${imageBytes}`;
}
