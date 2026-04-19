const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D illustration for Korean upper-elementary students (grades 5-6), mature-yet-friendly editorial cartoon style, warm but slightly more sophisticated color palette than lower grades.",
    "Single wide panoramic scene that summarizes one mission: an upper-grade kid 'recommendation-use consultant' wearing a simple consultant lanyard with a small gear-and-check icon badge, standing in the foreground of a small analysis studio, calmly examining four recommendation case panels on a wall display to weigh pros and cons and draft a personal usage-principle guide.",
    "Composition: the wall behind the consultant shows a FOUR-panel case display arranged left to right, each panel a rounded pastel card with ONLY abstract icons — no words:",
    "- Panel 1 (helpful case): a video-platform recommendation feed with science/volcano/earth pictograms, subtle soft-green glow and a small thumbs-up icon in the corner suggesting 'helpful'.",
    "- Panel 2 (loop case): the same recommendation feed filled with repeating game-controller icons forming a circular arrow loop, subtle soft-orange warning glow.",
    "- Panel 3 (shopping case): a shopping-mall grid showing repeating near-identical white sneaker icons, with one small 'question-mark' sparkle hinting 'too similar?'.",
    "- Panel 4 (echo-chamber case): a news/article grid with news-paper pictograms all sharing one identical tint forming a subtle bubble around the reader icon, implying one-sided view.",
    "Between the panels and the consultant, soft curved connection lines flow toward a central 'balance scale' pictogram (good vs. careful), visually linking the four cases to a single weighing moment. A second small icon cluster near the consultant shows three tiny principle-bullet dots (just dots with checkmark icons, no letters) representing the three personal principles the student will write.",
    "In the foreground bottom-right corner, a clearly visible blank 'usage-principle guide' card (a clean paper card with a small shield-plus-checkmark icon on top) rests on a pedestal, representing the final artifact the student will complete.",
    "Mood: calm, reflective, responsible. The consultant rests one hand on the chin, the other gesturing at the balance pictogram.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words, no readable text on any panel, screen, badge, card, or lanyard. Every panel must display ONLY abstract icons, pictograms, or thumbnails — never letters or words. The guide card in the foreground must be completely blank.",
    "Warm, thoughtful, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e3h");
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
