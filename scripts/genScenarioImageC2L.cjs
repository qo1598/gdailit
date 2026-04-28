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
    "Scene: a cheerful young child sitting at a colorful classroom desk, acting as an 'event illustration commissioner'. The child is carefully filling out a picture-request card with checkboxes and icon slots — choosing place, characters, action, mood, and things to exclude.",
    "On the desk: a half-finished request card with simple icon checkboxes (park icon, friends icon, lunchbox icon, sunny icon, crossed-out rain icon). Next to the card, a bright tablet screen shows a preview of an AI-generated cheerful picnic illustration emerging in real time.",
    "Behind the child, a bulletin board displays a blank 'Class Picnic Notice' poster with an empty rectangular frame waiting for the finished illustration.",
    "A small friendly AI assistant character (round, glowing, non-humanoid) hovers near the tablet, ready to draw based on the child's specific instructions.",
    "Visual emphasis: the child is the decision-maker — pointing at specific slots on the request card, while the AI waits for clear instructions before drawing.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no captions. All cards, posters, and screens show ONLY abstract icons, shapes, or color blocks — never letters or words. Purely visual storytelling.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c2l");
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
