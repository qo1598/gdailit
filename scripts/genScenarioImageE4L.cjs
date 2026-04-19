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
    "Single wide panoramic scene that summarizes one mission: a cheerful kid 'AI caring observer' wearing a small observer cap with a little heart-and-eye icon badge, standing in the foreground of a bright school AI experience zone, carefully watching two other kids try the same AI technology with clearly different experiences.",
    "Composition: in the center-left, two friendly cartoon kids interact with ONE identical AI device — a rounded pastel AI kiosk/speaker with a friendly smiley screen. Kid A stands on the left side with a happy smile and a small green check sparkle floating over the device (works smoothly on the first try). Kid B stands on the right side looking slightly puzzled, with a small soft-orange retry-arrow pictogram and a tiny sweat-drop icon over the device (needs several tries).",
    "Around the observer kid, three small floating observation bubbles shaped like rounded speech clouds each hold a simple pictogram — a face-scan icon, a microphone/voice icon, and a music-note/speaker icon — representing the three example AI cases (face recognition door, voice-toy, and AI music speaker). No words, just icons.",
    "A soft curved connection line flows from kid A (green check) and kid B (retry arrow) toward a small heart-shaped 'caring' pictogram near the observer, visually linking the observation to kindness and understanding.",
    "In the foreground bottom-right corner, a clearly visible blank 'caring observation log' card (a small paper card with a heart-plus-eye icon on top) rests on a pastel surface, representing the final artifact the student will complete.",
    "Mood: kind, curious, gentle. The observer kid lightly touches the chin with one hand and points at the two kids with the other, showing caring attention.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles with words, no buttons with words. Any screen, card, kiosk, or bubble must display ONLY abstract icons, shapes, or pictograms — never letters or words. The observation log card in the corner must be completely blank.",
    "Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "e4l");
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
