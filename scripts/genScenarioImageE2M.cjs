const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D illustration for Korean middle-elementary students (grades 3-4), clean modern editorial cartoon style, soft warm colors, friendly Korean animation feel.",
    "Scene concept: a middle-grade kid working as a 'student reporter / AI dialogue reviewer'. The reporter is reviewing a chat log between a student and an AI about space, deciding which speech bubbles are safe to put into a space-themed card-news and which are suspicious and must be held back.",
    "Composition: cozy reporter desk setup. On the desk: an open laptop/tablet showing a vertical chat thread made only of alternating speech-bubble shapes (NO text inside them, just shape + small icons). Next to the laptop: a small stack of empty card-news templates with rounded corners, blank faces.",
    "On top of the chat view, floating around the kid, there are SIX AI-response bubbles visualized as rounded rectangles; two of them are clearly 'suspicious' (slight red/orange glow, a small tiny warning icon like a small question-mark spark), the rest look calm and soft blue.",
    "Background: a softly rendered space-theme backdrop behind the desk — planets in orbit, a crescent moon, a stylized black hole spiral, all as decorative shapes, no labels.",
    "The kid is holding a pencil in one hand and pointing at one suspicious bubble with a curious, critical expression. Reporter vibe: a simple press-pass lanyard with an abstract camera/pencil icon (no letters).",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no words inside speech bubbles, no buttons with text. Chat bubbles, screens, cards, and press pass must display ONLY abstract icons or shapes — never letters, digits, or words.",
    "Bright, thoughtful, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e2m");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`생성 중: ${target.filename}`);
  const res = await genAI.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: [{ parts: [{ text: target.prompt }] }],
    config: { responseModalities: ["IMAGE", "TEXT"] },
  });

  const imagePart = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!imagePart) throw new Error("이미지 데이터 없음");

  const outPath = path.join(outDir, target.filename);
  fs.writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  ✓ 저장: ${outPath}`);
}

run().catch(e => { console.error("실패:", e.message); process.exit(1); });
