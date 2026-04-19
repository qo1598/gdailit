const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean middle-elementary students (grades 3-4), clean modern editorial cartoon style, warm pastel colors, friendly Korean animation feel.",
    "Single wide panoramic scene that summarizes one mission: a middle-grade kid 'school AI fairness inspector' wearing a simple inspector lanyard with a small balance-scale icon badge, standing in the foreground of a bright school hallway, inspecting three school AI services to find who is getting an unfair result and to draft a fairness opinion.",
    "Composition: the school hallway backdrop shows THREE rounded pastel case panels arranged left to right, each a small diorama with ONLY abstract icons — no words:",
    "- Panel 1 (face recognition gate): a school entrance door with a face-scan pictogram — student A silhouette passing smoothly with a soft-green check glow, student B silhouette paused with a small soft-orange retry-arrow and a tiny clock icon hinting longer wait.",
    "- Panel 2 (homework-finder voice app): a tablet showing a learning app with a microphone pictogram — student A silhouette with a smooth voice-wave leading to a correct page icon with a green check, student B silhouette with a scattered voice-wave turning into a question mark over a wrong/confused screen pictogram.",
    "- Panel 3 (text-to-speech reading app): a tablet with a speaker/sound-wave pictogram — student A silhouette smiling with a comfortable sound-wave and a small music-note, student B silhouette looking stressed with a too-fast sound-wave icon and a small ellipsis bubble suggesting missed content.",
    "Between the three panels and the inspector, soft curved connection lines flow toward a central 'balance scale' pictogram (fair vs. unfair), visually linking the three cases to a single fairness judgment moment. A small icon cluster near the inspector shows three tiny opinion-bullet dots (just dots with checkmark icons, no letters) representing the fairness opinion the student will write.",
    "In the foreground bottom-right corner, a clearly visible blank 'fairness opinion' card (a paper card with a small balance-scale-plus-checkmark icon on top) rests on a pastel surface, representing the final artifact the student will complete.",
    "Mood: thoughtful, fair, observant. The inspector gently points at the balance pictogram as if weighing the three cases.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words, no readable text on any screen, badge, door, tablet, panel, or card. Every panel must display ONLY abstract icons, shapes, or pictograms — never letters or words. The fairness opinion card in the corner must be completely blank.",
    "Bright, thoughtful, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e4m");
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
