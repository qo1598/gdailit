const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean lower-elementary students (grades 1-2), warm pastel colors, soft rounded shapes, friendly Korean animation style.",
    "Single wide panoramic scene that summarizes one mission: a cheerful kid 'AI recommendation explorer' wearing a small explorer cap with a compass badge icon, standing at a bright, friendly touchscreen kiosk that mimics a playful recommendation app.",
    "Composition: in the center, a large rounded pastel tablet/kiosk screen shows three clearly-distinct visual topic cards arranged side by side — a cute cartoon animal face, a cute plate of food, and a cute vehicle icon — representing the three topics the child can choose. Around the kid, three floating question bubbles shaped like rounded speech clouds each hold a tiny pictogram and a small thumbs-up / thumbs-down pair of face icons (no words).",
    "To the right side of the tablet, a soft glowing arrow-like swirl leads to a small 'recommendation result' card showing one highlighted cartoon item (e.g., a rabbit) surrounded by three soft sparkles hinting 'this is recommended for you'.",
    "In the foreground bottom-right corner, a clearly visible blank 'exploration card' (a small paper card with a compass icon at the top) rests on a pastel surface, representing the final artifact the student will complete.",
    "Mood: curious, playful, safe. The explorer kid points excitedly at one of the topic cards.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words. Any screen, card, kiosk, or bubble must display ONLY abstract icons, shapes, or pictograms — never letters or words. The exploration card in the corner must be completely blank.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e3l");
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
