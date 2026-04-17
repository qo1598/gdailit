const fs = require("fs");
const path = require("path");
const env = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
const apiKey = env.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey });

const cases = [
  {
    filename: "e3h_case1_minseo.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: A girl student sitting at a desk with a laptop. The laptop screen clearly shows a video playing about a volcano erupting, and on the right side of the screen there is a recommendation sidebar with 3 similar science video thumbnails showing earthquake, Earth layers, and volcanic experiment. The girl is smiling and writing notes. Warm classroom background. Cute Korean animation style, soft pastel colors.",
  },
  {
    filename: "e3h_case2_jiho.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: A boy lying on a sofa holding a tablet. The tablet screen is completely filled with a grid of recommended gaming videos, all looking very similar with game controller icons and similar thumbnails. An arrow loops back showing the same type of content repeating endlessly. The boy looks glued to the screen. Living room background. Cute Korean animation style, soft pastel colors.",
  },
  {
    filename: "e3h_case3_seoyeon.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: A girl holding a smartphone showing a shopping app. The phone screen is filled entirely with rows of almost identical white sneakers recommended one after another. The girl looks slightly confused as every single recommendation shows the same style of white sneaker. No other types of shoes are visible anywhere on the screen. Cute Korean animation style, soft pastel colors.",
  },
  {
    filename: "e3h_case4_junho.png",
    prompt:
      "2D cartoon illustration for Korean elementary students. Scene: A boy reading a news article on a tablet. The screen shows one news article, and the recommended articles sidebar shows 4-5 articles all with very similar headlines and the same viewpoint. The boy is surrounded by a transparent bubble or circular frame, symbolizing an echo chamber where only one type of news reaches him. Outside the bubble, diverse and different news icons are faded and unreachable. Cute Korean animation style, soft pastel colors.",
  },
];

async function generateImages() {
  const outDir = path.join(__dirname, "public");

  for (const c of cases) {
    console.log(`생성 중: ${c.filename}`);
    try {
      const res = await genAI.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: c.prompt,
        config: { numberOfImages: 1, aspectRatio: "1:1" },
      });

      const bytes = res.generatedImages?.[0]?.image?.imageBytes;
      if (!bytes) throw new Error("이미지 데이터 없음");

      fs.writeFileSync(path.join(outDir, c.filename), Buffer.from(bytes, "base64"));
      console.log(`  ✓ 저장: ${c.filename}`);
    } catch (err) {
      console.error(`  ✗ 실패: ${err.message}`);
    }
  }
  console.log("\n완료!");
}

generateImages();
