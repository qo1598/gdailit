const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const targets = [
  {
    filename: "banner_defect.png",
    prompt: [
      "2D cartoon illustration, bright vivid colors, clean outlines, child-friendly Korean animation style. Wide 16:9 landscape format.",
      "",
      "Draw a school science exhibition hall. Five children are exploring displays: a robot model, a telescope on a tripod, experiment beakers on a table, and planet posters on the wall. The hall has bright lighting and a clean tiled floor.",
      "",
      "YOU MUST DRAW EXACTLY THESE 5 LARGE, OBVIOUS ERRORS. Each error must take up significant visual space and be instantly noticeable:",
      "",
      "ERROR 1 — THREE SUNS: Draw exactly THREE large yellow smiling suns in the sky visible through a window. All three suns must be big, bright, side by side, and impossible to miss.",
      "",
      "ERROR 2 — FLOATING TABLE: One entire display table with beakers on it must be clearly FLOATING 30cm above the floor. Show a large obvious gap of empty space between the table legs and the floor. The gap must be clearly visible.",
      "",
      "ERROR 3 — GIANT PALM TREE: Place a large tropical palm tree (taller than the children) growing from a pot right in the middle of the indoor exhibition hall floor. It must be huge and completely out of place indoors at a science exhibition.",
      "",
      "ERROR 4 — BACKWARDS TELESCOPE: The child looking through the telescope is looking through the WRONG END — their eye is pressed against the large objective lens end, while the small eyepiece end points away into the air. The telescope must be clearly reversed.",
      "",
      "ERROR 5 — THREE-ARMED CHILD: One child standing near the robot display must have exactly THREE arms — two normal arms plus one extra arm growing from the same shoulder, all clearly visible and spread apart so they are easy to count. Make all three arms large and obvious.",
      "",
      "VERY IMPORTANT: These 5 errors must each be SO LARGE and SO OBVIOUS that a 10-year-old child can spot them within seconds. Do not make subtle errors. Make them cartoonishly wrong.",
      "CRITICAL: ZERO text of any kind in the image. No English, no Korean, no numbers, no labels, no signs. Only visual elements.",
    ].join("\n"),
  },
  {
    filename: "banner_good.png",
    prompt: [
      "2D cartoon illustration, professional yet child-friendly Korean animation aesthetic, bright warm colors, clean vector style.",
      "Scene: a well-designed elementary school science exhibition promotional banner image — the CORRECTED, perfect version.",
      "An inviting school exhibition hall entrance with happy children exploring science displays: a friendly robot exhibit, a telescope on a sturdy stand, a globe on a table, colorful experiment tools neatly arranged on display tables.",
      "Everything is visually accurate and consistent:",
      "All children have correct five-fingered hands. All objects rest naturally on surfaces (nothing floating). Consistent cartoon illustration style throughout. Shadows all point the same direction. Every element fits the science exhibition theme — no out-of-place objects.",
      "Warm, inviting atmosphere with consistent pastel-bright color palette. Clean composition that clearly communicates 'school science exhibition'.",
      "CRITICAL: ZERO text in the image. No letters, no numbers, no Korean, no English, no signs, no labels. Purely visual.",
      "Wide 16:9 aspect ratio. Professional educational illustration style.",
    ].join(" "),
  },
];

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c2h");
  fs.mkdirSync(outDir, { recursive: true });

  for (const t of targets) {
    const outPath = path.join(outDir, t.filename);
    if (fs.existsSync(outPath)) {
      console.log(`이미 존재: ${t.filename}, 건너뜀`);
      continue;
    }
    console.log(`생성 중: ${t.filename}`);
    const res = await genAI.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ parts: [{ text: t.prompt }] }],
      config: { responseModalities: ["IMAGE", "TEXT"] },
    });

    const imagePart = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imagePart) {
      console.error(`  ✗ ${t.filename}: 이미지 데이터 없음`);
      continue;
    }

    fs.writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, "base64"));
    console.log(`  ✓ 저장: ${outPath}`);
  }
}

run().catch(e => { console.error("실패:", e.message); process.exit(1); });
