const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D illustration for Korean upper-elementary students (grades 5-6), mature-yet-friendly editorial cartoon style, warm indoor lighting, slightly more sophisticated color palette than lower grades.",
    "Scene concept: an upper-grade kid in the role of 'class newspaper editor-in-chief', sitting in a small newsroom-like setting, reviewing five AI-written draft articles and deciding for each one whether to ACCEPT / REVISE / RE-VERIFY before publishing them in a class digital archive.",
    "Composition: an editor's desk covered with five draft article sheets laid out in a fan or grid. Each article is a rectangular paper with only abstract placeholder blocks — horizontal gray bars representing paragraphs, a small headline area with an icon, a small image placeholder — and NO readable text. A few sheets are clearly 'flagged': one has a small red-dotted outline, one has a small yellow spiral 'reconfirm' icon, others are clean.",
    "The kid editor holds a red editing pen, one sheet mid-air being inspected; on the desk: a small rubber stamp marked only with an abstract check icon, a small sticky-note flag with a tiny magnifier icon (re-verify), and a neat stack of approved articles with a subtle green tab.",
    "Background: a small newsroom corner — a bulletin board with pinned-up layouts (again, all blank or icon-only), a desk lamp casting soft light, a bookshelf with stylized reference books (spines are plain colored — no letters).",
    "Mood: focused, professional-but-warm, responsible. The editor looks calm, deliberate, and critical.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no headlines, no words on books, sticky notes, stamps, or article sheets. Every document or surface must show ONLY abstract blocks, icons, or placeholder shapes — never letters, digits, or words.",
    "Warm, focused, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e2h");
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
