const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean upper-elementary students (grades 5-6), slightly more mature palette than lower grades but still warm pastel colors, soft rounded shapes, friendly Korean animation style.",
    "Single wide panoramic scene summarizing one mission: a confident tween 'web-novel planning booth organizer' at a school-festival booth, curating a web-novel concept poster.",
    "Composition: center-left, the tween organizer stands in front of a large blank poster board mounted on an easel, arranging small blank placeholder panels on it (representing title, logline, characters, conflict, ending — all as blank shapes, not text). A clipboard with a blank planning form rests in one hand.",
    "Center-right, a soft glowing AI helper (abstract chip-shaped silhouette with gentle sparkles) offers several floating idea bubbles containing simple visual icons (a book, a key, a door, a silhouette of two friends, a sunset) — the AI is a collaborator, not the author.",
    "The tween is clearly in charge: one idea bubble is being pulled toward the poster, another is being gently pushed aside, demonstrating selective judgment.",
    "Background: a school festival hall with colorful (but textless) banners and a few other booths visible, warm festival lighting, a couple of student visitors approaching with curiosity.",
    "A small reflection corner on the far right: a mirror-like panel hinting that the organizer will later reflect on their own contribution versus the AI's help.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no titles, no signs, no labels, no UI captions, no speech bubbles with words. Any poster panel, idea bubble, banner, or clipboard page must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The clipboard form must be completely blank. Purely visual storytelling with icons and imagery only.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c1h");
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
