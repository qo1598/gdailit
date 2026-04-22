const fs = require("fs");
const path = require("path");
const env = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const cases = [
  {
    filename: "e4m_case1_face.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: Two students at a school entrance with a face recognition security panel on the wall. Left side: Student A (smiling) stands in front of the scanner, the display glows green with a checkmark, the door swings open smoothly. Right side: Student B (looking worried) stands in front of the same scanner, the display shows a red X three times with a blinking error icon, the door stays closed and the student waits. Clear visual contrast between the two outcomes. Bright school hallway background, Korean animation style, soft pastel colors.",
  },
  {
    filename: "e4m_case2_voice.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: Two students sitting at desks each holding an identical tablet showing a homework-finder learning app. Left side: Student A speaks with clear speech bubbles floating toward the tablet, the screen shows the correct homework page with a green checkmark and a happy face. Right side: Student B speaks with speech bubbles that turn into scattered question marks near the tablet, the screen shows a confused face and wrong subject icons. Korean animation style, warm classroom background, soft pastel colors.",
  },
  {
    filename: "e4m_case3_reading.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: Two students sitting side by side each using an identical text-to-speech reading app on a tablet. Left side: Student A looks relaxed and smiling, the tablet screen shows text being highlighted word by word at a comfortable pace, a small checkmark or musical note floats nearby. Right side: Student B looks stressed and confused, the tablet screen shows text racing by very fast with a speed dial turned to maximum, the student reaches out as if trying to stop it and has a speech bubble with ellipsis or a sad face. Korean animation style, soft pastel colors, clear side-by-side contrast.",
  },
];

async function generateImages() {
  const outDir = path.join(__dirname, "public");

  for (const c of cases) {
    console.log(`생성 중: ${c.filename}`);
    try {
      const res = await genAI.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: [{ parts: [{ text: c.prompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
      });

      const imagePart = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!imagePart) throw new Error("이미지 데이터 없음");

      const bytes = imagePart.inlineData.data;
      fs.writeFileSync(path.join(outDir, c.filename), Buffer.from(bytes, "base64"));
      console.log(`  ✓ 저장: ${c.filename}`);
    } catch (err) {
      console.error(`  ✗ 실패: ${err.message}`);
    }
  }
  console.log("\n완료!");
}

generateImages();
