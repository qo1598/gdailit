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
    "Single wide panoramic scene summarizing one mission: a cheerful kid 'picture-book author' at a cozy school library desk, holding a pencil over an open blank picture-book spread, imagining a gentle story.",
    "Composition: on the left side, the kid author sits at a wooden library desk with bookshelves behind, a soft lamp glowing, an open blank picture-book on the desk, and thought bubbles rising up containing simple icon-hints of story elements (a small sleeping puppy, a rainy playground swing, a forest silhouette, a sunset wave, a school building icon).",
    "On the right side, a friendly glowing robot-shaped AI helper floats beside the desk offering small sparkle ideas, but clearly the pencil and the final book remain in the kid's hand — emphasizing that the author is the child.",
    "A small exhibition corner in the background with blank rectangular display cards hung on a string, waiting to be filled — representing the class picture-book exhibition the mission culminates in.",
    "Subtle glowing sparkles around both the thought bubbles and the AI helper to suggest creative collaboration.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no book titles, no labels, no UI captions, no speech bubbles with words. Any book cover, display card, or bookshelf spine must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The open picture-book spread must be completely blank. Purely visual storytelling with icons and imagery only.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c1l");
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
