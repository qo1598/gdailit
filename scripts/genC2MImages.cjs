const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const targets = [
  {
    filename: "picnic_defect.png",
    prompt: [
      "2D cartoon illustration, bright cheerful colors, child-friendly Korean animation aesthetic.",
      "Scene: children and a friendly robot having a picnic in a sunny green park. There are trees, a picnic blanket, food, and a small dog.",
      "",
      "THIS IMAGE MUST CONTAIN EXACTLY 4 INTENTIONAL VISUAL ERRORS. Each error must be large, obvious, and clearly visible:",
      "",
      "ERROR 1 — NATURE ERROR: Draw TWO large smiling suns side by side in the sky. Both suns must be big and clearly visible. This is the most important error.",
      "",
      "ERROR 2 — PHYSICS ERROR: The small dog must be clearly FLOATING in mid-air, high above the picnic blanket, with empty space below it. It should look like it is flying with no support.",
      "",
      "ERROR 3 — ANATOMY ERROR: One child must have a hand with exactly SIX fingers, clearly spread out and countable. Make the hand large enough to see all six fingers distinctly.",
      "",
      "ERROR 4 — SCENE COMPOSITION ERROR: Place a large SNOWMAN standing right next to the picnic blanket, even though the scene is a warm sunny summer day with green grass. The snowman should be prominent and obviously out of place.",
      "",
      "IMPORTANT: Other than these 4 errors, everything else should look normal and pleasant. The errors must be OBVIOUS and easy to spot for elementary school students.",
      "CRITICAL: ZERO text in the image. No letters, no numbers, no Korean, no English, no signs, no labels. Purely visual.",
      "Wide 16:9 aspect ratio. Bright educational illustration style.",
    ].join(" "),
  },
  {
    filename: "picnic_good.png",
    prompt: [
      "2D cartoon illustration, bright cheerful colors, child-friendly Korean animation aesthetic.",
      "Scene: children and a friendly robot having a picnic in a sunny park.",
      "This is the CORRECTED version — everything is physically and visually accurate:",
      "ONE sun in the sky. A puppy sitting on the grass normally. The robot has proper sturdy metal legs.",
      "All children have correct five-fingered hands. Shadows are consistent, all pointing the same direction.",
      "Pleasant scene: green grass, trees, picnic blanket with food, happy expressions, blue sky with a few clouds.",
      "CRITICAL: ZERO text in the image. No letters, no numbers, no Korean, no English, no signs, no labels. Purely visual.",
      "Wide 16:9 aspect ratio. Bright educational illustration style.",
    ].join(" "),
  },
];

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c2m");
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
