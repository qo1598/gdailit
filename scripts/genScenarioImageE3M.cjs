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
    "Single wide panoramic scene that summarizes one mission: a middle-grade kid 'shopping-mall taste analyst' wearing a simple analyst lanyard with a small star-icon badge, standing in the foreground of a friendly virtual clothing shop interface, evaluating clothes with star ratings and reading how the AI recommendation TOP 3 shifts.",
    "Composition: the background is a bright cartoon shopping-mall storefront with a tablet-like grid of clothes on the wall. The grid shows about 8–12 cute hanging outfits (T-shirts, pants, hoodies, skirts, caps, sneakers) in a mix of bright, dark, pastel, and vivid colors so viewers can sense 'variety of styles'. Each clothing tile sits on a soft rounded pastel card.",
    "Near the kid, three small floating star-rating bars (each shown as a row of simple 5 stars with some filled, some empty — purely pictogram style, no numbers) hover as if the analyst is currently rating items. On the right side, a clearly marked 'AI recommendation TOP 3' panel shows three highlighted outfit tiles with a soft glow and three small sparkle icons hinting 'this recommendation changed because of your ratings'. A subtle curved arrow connects the kid's star ratings to the TOP 3 panel, visually linking cause and effect.",
    "In the foreground bottom-right corner, a clearly visible blank 'taste analysis report' card (a paper card with a small star + chart icon on top) rests on a pastel surface, representing the final artifact the student will complete.",
    "Mood: thoughtful, curious, observant. The analyst gently points at the recommendation panel as if noticing a pattern.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words, no readable text on any screen, price tag, outfit, badge, or card. Star bars must be shown as pure pictograms without digits. Every tile, card, and panel must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The report card in the corner must be completely blank.",
    "Bright, thoughtful, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e3m");
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
