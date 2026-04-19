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
    "Single wide panoramic scene that summarizes one mission: two cheerful kid 'AI detectives' wearing simple detective caps and holding magnifying glasses, exploring daily life to find hidden AI.",
    "Composition: the background smoothly transitions across three connected zones from left to right - (1) a HOME living room on the left with a round robot vacuum cleaning the floor and a small smart speaker on a shelf, (2) a SCHOOL hallway in the middle with a face-recognition entry panel glowing softly next to a door, (3) a STORE on the right with a self-order kiosk screen showing recommendation thumbnails and a small smart camera above the entrance.",
    "Subtle glowing sparkles or soft highlight circles around each AI device to hint that these are the 'hidden AI' the detectives are discovering.",
    "In the foreground bottom-right corner, a clearly visible blank 'detective card' (a small paper card with a magnifying-glass icon at the top) rests on a surface, representing the final artifact the students will complete.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no shop names, no labels, no UI captions, no speech bubbles, no buttons with words. Any screen, kiosk, panel, or card must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The detective card in the corner must be completely blank. Purely visual storytelling with icons and imagery only.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e1l");
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
