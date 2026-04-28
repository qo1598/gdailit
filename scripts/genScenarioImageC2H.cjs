const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const target = {
  filename: "scenario.png",
  prompt: [
    "2D cartoon illustration for Korean upper-elementary students (grades 5-6), clean modern style with slightly more sophisticated details, bright professional colors, Korean animation aesthetic.",
    "Scene: a confident older elementary student acting as an 'exhibition art director', working at a professional-looking desk with multiple reference materials spread out.",
    "Center composition: the student sits before a large split-view display. On the left half, a flawed AI-generated exhibition banner image with multiple problems — visual errors (floating objects, wrong anatomy), style inconsistency, and poor information delivery for the exhibition purpose. On the right half, a clean blank canvas ready for the improved version.",
    "On the desk: a structured analysis worksheet with four sections represented by color-coded icon blocks — visual error analysis (red), style issue (orange), purpose gap (blue), information delivery (green). The student is connecting lines between the analysis sections, working through a systematic improvement process.",
    "Behind the student: a wall with three phases shown as icon panels — Phase 1: magnifying glass over broken image (error analysis), Phase 2: thought bubble with question mark (prompt reverse-engineering), Phase 3: sparkle over perfect image (improved prompt design).",
    "A sophisticated AI tool interface (tablet or screen) sits nearby, showing a prompt input area ready for the student's carefully designed improvement prompt.",
    "Visual emphasis: the student as a systematic art director — not just finding errors but analyzing WHY the errors occurred and designing precise improvement criteria.",
    "CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no captions. All worksheets, displays, panels, and screens show ONLY abstract icons, diagrams, color blocks, arrows, or shapes — never letters or words. Purely visual storytelling.",
    "Professional yet age-appropriate atmosphere. Wide 16:9 aspect ratio composition.",
  ].join(" "),
};

async function run() {
  const outDir = path.join(__dirname, "..", "public", "images", "c2h");
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
