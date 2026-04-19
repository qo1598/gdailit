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
    "Scene concept: a cheerful lower-elementary kid standing in front of a classroom science bulletin board, acting as a tiny 'AI answer inspector'. The board is meant to display 'common-knowledge cards supposedly written by an AI', but some of the answers are weirdly wrong and need to be caught before being pinned up.",
    "Composition: classroom interior with a large corkboard on the wall. On the board and floating around the kid are exactly SIX small rectangular cards arranged in a friendly cluster. Each card shows ONLY a simple symbolic icon — a banana, a cat with legs, an apple on a tree, a dog with tiny wings, a sun-and-earth diagram, an ice cube — no words or numbers. Two or three of the cards are clearly 'wrong' (e.g., dog has wings, cat has too many legs) and have a subtle question-mark sparkle or wobble around them to hint they are suspicious. The kid is holding a small magnifying glass, gently inspecting one suspicious card.",
    "On a nearby small desk in the foreground-right, two empty tray areas are visible — one marked with a tiny green check icon (approve for posting), one marked with a tiny yellow circular-arrow icon (hold for verification). No text labels, only icons.",
    "Mood: inviting, safe, curious. The kid looks thoughtful and alert, not scared.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles, no buttons with words. Any card, board, tray, or screen must display ONLY abstract icons, pictograms, or simple drawings — never letters or words.",
    "Bright, inviting, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e2l");
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
