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
    "Single wide panoramic scene that summarizes one mission: an upper-grade kid 'AI fairness advisor' wearing a simple advisor lanyard with a small balance-scale icon badge, standing in the foreground of a cheerful amusement park plaza, carefully inspecting four AI service scenes to judge who is getting an unfair experience and to draft a final advisory opinion.",
    "Composition: the amusement park backdrop is arranged so that FOUR scene vignettes are visible left to right, each a rounded pastel card/diorama with ONLY abstract icons — no words:",
    "- Scene 1 (entry gate): a face-scan entrance gate with two visitor silhouettes — one passing through smoothly with a soft-green check glow, the other paused with a small soft-orange retry-arrow icon and a clock pictogram suggesting longer wait.",
    "- Scene 2 (ride recommendation): a phone/tablet app screen showing a ride recommendation feed — one side a colorful variety of different ride pictograms (roller-coaster, carousel, ferris-wheel, bumper-car), the other side repeating near-identical ride icons forming a narrow loop, hinting limited variety.",
    "- Scene 3 (wayfinding kiosk): a standing wayfinding kiosk with a map pictogram — one visitor silhouette following a clear straight arrow to a destination pictogram, the other visitor silhouette following a tangled detour arrow past a question-mark sparkle.",
    "- Scene 4 (performance captions): an amusement park stage with a subtitle/caption panel and a small speaker icon — one visitor silhouette enjoying the show with a music-note and smile pictogram, the other visitor silhouette with a broken-caption icon and a small ellipsis bubble suggesting missed content.",
    "Between the four scenes and the advisor, soft curved connection lines flow toward a central 'balance scale' pictogram (fair vs. unfair), visually linking the four scenes to a single fairness judgment moment. A second small icon cluster near the advisor shows a few tiny advisory-bullet dots (just dots with checkmark icons, no letters) representing the advisory points the student will write.",
    "In the foreground bottom-right corner, a clearly visible blank 'final advisory opinion' card (a clean paper card with a small balance-scale-plus-checkmark icon on top) rests on a pedestal, representing the final artifact the student will complete.",
    "Mood: calm, thoughtful, responsible, yet lively with amusement-park warmth. The advisor rests one hand on the chin, the other gesturing at the balance pictogram.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words, no readable text on any panel, screen, badge, card, kiosk, stage, or lanyard. Every scene must display ONLY abstract icons, pictograms, or silhouettes — never letters or words. The advisory opinion card in the foreground must be completely blank.",
    "Warm, thoughtful, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e4h");
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
