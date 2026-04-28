import { GoogleGenAI } from "@google/genai";
import { logAiInteraction } from './aiLogger.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const IMAGE_MODEL = "gemini-2.5-flash-image";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const TASK_IMAGE_CONTEXTS = {
  poster: {
    en: "environmental protection educational poster for elementary school, bright hopeful colors, nature and earth theme"
  },
  event_notice: {
    en: "school event announcement poster for elementary school, cheerful and energetic, school festival atmosphere"
  },
  book_intro: {
    en: "children's book introduction illustration, warm and imaginative, adventure and storytelling atmosphere"
  }
};

const PROMPT_MODE_CONFIG = {
  simple: {
    prefix: "Basic simple 2D cartoon illustration, flat colors, minimal detail,",
    suffix: ""
  },
  detailed: {
    prefix: "2D illustration, cute cartoon style, colorful and vibrant, child-friendly art style, clear composition, carefully following the specified conditions,",
    suffix: "Make the illustration organized and visually clear."
  },
  expert: {
    prefix: "High quality 2D illustration, professional cartoon art style, vibrant detailed colors, perfect composition, child-friendly premium art,",
    suffix: "Create a visually impressive and polished illustration that captures every detail of the prompt."
  }
};

function buildImagePrompt(studentPrompt, taskType, mode = 'detailed') {
  const ctx = TASK_IMAGE_CONTEXTS[taskType] || TASK_IMAGE_CONTEXTS.poster;
  const modeConf = PROMPT_MODE_CONFIG[mode] || PROMPT_MODE_CONFIG.detailed;
  return [
    modeConf.prefix,
    "no text overlay,",
    ctx.en + ".",
    "Korean student's creative direction:",
    studentPrompt,
    modeConf.suffix
  ].filter(Boolean).join(" ");
}

/**
 * Gemini Flash Image 모델로 이미지를 생성하고 base64 data URL을 반환한다.
 */
export async function generateImage(
  studentPrompt,
  taskType,
  mode = 'detailed',
  _log = null,
) {
  const fullPrompt = buildImagePrompt(studentPrompt, taskType, mode);
  const t0 = Date.now();

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: fullPrompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart?.inlineData?.data) {
      throw new Error("이미지를 생성하지 못했어요. 다시 시도해주세요.");
    }

    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    const dataUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;

    if (_log) {
      await logAiInteraction({
        ..._log,
        provider: 'gemini-image',
        modelName: IMAGE_MODEL,
        userPrompt: fullPrompt,
        aiResponse: dataUrl,
        responseType: 'image_url',
        latencyMs: Date.now() - t0,
        fallbackUsed: false,
      });
    }

    return dataUrl;
  } catch (err) {
    if (_log) {
      await logAiInteraction({
        ..._log,
        provider: 'gemini-image',
        modelName: IMAGE_MODEL,
        userPrompt: fullPrompt,
        aiResponse: null,
        responseType: 'image_url',
        latencyMs: Date.now() - t0,
        fallbackUsed: true,
      });
    }
    throw err;
  }
}
