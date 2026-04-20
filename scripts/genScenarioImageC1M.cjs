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
    "Single wide panoramic scene summarizing one mission: a kid 'class newspaper reporter' at a classroom newsroom desk, working on a short-story column for the class paper.",
    "Composition: on the left, the reporter kid sits at a desk wearing a simple reporter cap, writing on a blank newspaper-layout page with a pencil; three blank story-candidate cards float above the desk like idea options the reporter is comparing.",
    "On the right side, a gentle AI-shaped helper (small glowing speech cloud with a simple chip-pattern) offers sparkling story candidates, but the reporter is clearly evaluating and choosing — one candidate is circled with a pencil mark (no words), one is set aside, one is held up.",
    "Background: a classroom setting with a bulletin board displaying a blank newspaper front page waiting to be filled, a few reading classmates in the distance as the intended readers.",
    "A warm reading-corner light, subtle sparkles to show creative thinking without overpowering.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no headlines, no signs, no labels, no UI captions, no speech bubbles with words. Any newspaper page, story card, or bulletin board must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The pencil mark on the chosen candidate must be a simple shape, not text. Purely visual storytelling with icons and imagery only.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c1m");
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
