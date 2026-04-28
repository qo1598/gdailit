const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean middle-elementary students (grades 3-4), clean bright colors, slightly more detailed than lower-grade style, friendly Korean animation aesthetic.",
    "Scene: a focused young student acting as an 'environmental campaign poster designer', sitting at a wide desk examining a printed AI-generated poster that has visible visual errors.",
    "On the desk: the flawed poster image showing a cheerful park picnic scene BUT with obvious defects — two suns in the sky, a puppy floating in mid-air, a robot with melting legs, inconsistent shadows. The student is using a magnifying glass to inspect these errors, with small red circle marks already placed on some defect areas.",
    "Next to the flawed poster, the student has a clipboard with a checklist-style diagnosis form showing icon categories: nature error, physics error, anatomy error, scene composition error — each with small visual icons instead of text.",
    "On the other side of the desk, a blank white canvas represents where the improved image will go after the student writes a better revision request.",
    "A small AI assistant character waits patiently nearby, ready to regenerate the image once given clearer instructions.",
    "Visual emphasis: the student as a critical evaluator — analyzing errors, not just accepting the AI output. The contrast between the flawed poster and the blank canvas for improvement.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no captions, no clipboard text. All forms, posters, and checklists show ONLY abstract icons, checkmarks, shapes, or color blocks — never letters or words. Purely visual storytelling.",
    "Bright, educational atmosphere. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c2m");
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
