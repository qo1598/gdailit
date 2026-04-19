const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean middle-elementary students (grades 3-4), warm pastel colors, soft rounded shapes, friendly Korean animation style.",
    "Single wide scene that summarizes one mission: a cheerful kid 'AI reporter' with a press-style cap, holding a small notepad and a microphone, standing in the foreground as if interviewing daily life technologies.",
    "Composition: the background is a modern elementary school setting combining a classroom corner and a school-website bulletin board vibe. Across the scene, show a mix of clearly-AI devices AND clearly-non-AI everyday electronics so viewers can sense 'not every electronic is AI':",
    "- AI examples (subtle glowing sparkle hint): a smartphone doing face recognition on a student, a tablet showing a recommendation feed of video thumbnails, a small smart speaker, a translation app screen with two language bubbles (no letters, just flag-like color circles and icons).",
    "- Non-AI examples (plain, no glow): a calculator, a simple desk lamp, a wall clock.",
    "In the foreground corner, a blank 'news article card' (a paper card with a small microphone icon on top) rests on a desk, representing the final artifact the student will complete.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words, no readable text on any screen or sign. Screens, notepads, and cards must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The reporter's notepad and the article card in the corner must be completely blank. Purely visual storytelling with icons and imagery only.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e1m");
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
