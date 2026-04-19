const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

// E-2-L STEP3 카드 6장: AI가 알려준 상식 카드. 각 카드의 맥락만 상징적으로 표현 (정답/오답 힌트 없음).
const baseStyle = [
  "2D cartoon illustration for Korean lower-elementary kids (grades 1-2),",
  "warm pastel colors, soft rounded shapes, friendly Korean animation style,",
  "single subject centered, clean light background, square 1:1 composition,",
  "ABSOLUTELY NO text of any kind: no English letters, no Korean Hangul, no numbers,",
  "no logos, no signs, no labels, no captions, no speech bubbles."
].join(" ");

const targets = [
  { filename: "q1_banana.png",  subject: "a single ripe yellow banana, simple and cheerful, on a soft cream background" },
  { filename: "q2_cat.png",     subject: "a cute friendly cat sitting and looking at the viewer, full body visible, on a soft cream background" },
  { filename: "q3_apple.png",   subject: "a small apple tree with a few red apples hanging from green branches, on a soft sky-blue background" },
  { filename: "q4_dog.png",     subject: "a happy puppy standing on the ground, ordinary dog without any wings, on a soft cream background" },
  { filename: "q5_earth.png",   subject: "a simple cute illustration of the sun and earth in space with a curved orbit line between them, on a soft dark-blue starry background" },
  { filename: "q6_ice.png",     subject: "a single transparent ice cube with a small frost sparkle, on a soft mint background" }
];

async function generateOne(target) {
  const prompt = `${baseStyle} Subject: ${target.subject}.`;
  console.log(`생성 중: ${target.filename}`);
  const res = await genAI.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseModalities: ["IMAGE", "TEXT"] },
  });
  const imagePart = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!imagePart) throw new Error(`이미지 데이터 없음: ${target.filename}`);
  const outDir = path.join(__dirname, "..", "public", "images", "e2l", "cards");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, target.filename);
  fs.writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  ✓ 저장: ${outPath}`);
}

async function run() {
  for (const t of targets) {
    try { await generateOne(t); }
    catch (e) { console.error(`  × 실패 (${t.filename}): ${e.message}`); }
  }
}

run().catch(e => { console.error("실패:", e.message); process.exit(1); });
