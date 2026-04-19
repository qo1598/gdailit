const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean upper-elementary students (grades 5-6), warm pastel colors, clean modern lines, friendly Korean animation style. Slightly more mature and 'museum-curator' feel than younger-grade art.",
    "Single wide scene that summarizes one mission: a confident kid 'AI exhibition curator' wearing a simple curator lanyard/badge, standing in a bright school digital exhibition hall, gesturing at a wall of technology cards as if sorting them for a display.",
    "Composition: the wall behind the curator holds a grid of technology exhibit cards organized into three implied zones (left / middle / right) to represent 'AI / not AI / unclear' classification — do NOT label the zones with text, just use three gently different pastel background panels and subtle icon badges (e.g., a small glowing spark, a plain gear, a question-mark-shaped glow) to hint at each zone.",
    "Cards on the wall show a mix of technologies the mission discusses, each as a pure icon illustration without any words:",
    "- Clearly-AI (left zone, soft glow): face-recognition phone unlock, robot vacuum, recommendation video feed thumbnails, navigation map with a route, translation app bubbles (use only flag-like color circles, no letters).",
    "- Clearly not AI (middle zone, plain): calculator, alarm clock, desk lamp.",
    "- Borderline / unclear (right zone, question-mark glow): automatic sliding door, smart thermostat dial, spam-filter envelope icon, simple search magnifier.",
    "In the foreground, a blank 'criteria card' (a clean paper card with a small ribbon or museum-tag icon on top) rests on a small pedestal, representing the final artifact the student will complete.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words, no readable text on any screen, card, sign, badge, or lanyard. Every card, screen, panel, and pedestal must display ONLY abstract icons, shapes, or thumbnails — never letters or words. The criteria card in the foreground must be completely blank. Purely visual storytelling with icons and imagery only.",
    "Bright, inviting, safe, age-appropriate but slightly more sophisticated styling for older students. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e1h");
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
