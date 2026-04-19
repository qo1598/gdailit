import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = 'AIzaSyB_DpGROvouKlHh7K61Wl-DlswHk-yC_RQ';
const MODEL = 'gemini-3.1-flash-image-preview';

const scenes = [
  {
    filename: 'e4h_scene1_gate.png',
    prompt: `A clean, friendly flat illustration for elementary school students (ages 10-12).
Scene: An amusement park entrance gate with AI facial recognition.
Left side: A child walks through easily, gate shows green checkmark and "인식 완료" label.
Right side: An elderly person stands waiting, gate shows red X and "인식 실패" label, looking slightly frustrated but not sad.
Bright, cheerful colors. Simple flat illustration style. Korean school textbook aesthetic. No English text.`
  },
  {
    filename: 'e4h_scene2_recommendation.png',
    prompt: `A clean, friendly flat illustration for elementary school students (ages 10-12).
Scene: Two people looking at mobile phones showing an amusement park ride recommendation app.
Left side: A young child sees many colorful diverse ride icons recommended on the screen.
Right side: An elderly person sees only 2-3 repetitive similar ride icons with "추천" label, looking slightly puzzled.
Bright, cheerful colors. Simple flat illustration style. Korean school textbook aesthetic. No English text.`
  },
  {
    filename: 'e4h_scene3_kiosk.png',
    prompt: `A clean, friendly flat illustration for elementary school students (ages 10-12).
Scene: An amusement park AI navigation kiosk (tall touchscreen).
Left side: A person speaks to the kiosk, screen shows a correct map with green arrow pointing right direction.
Right side: A person with different appearance speaks to same kiosk, screen shows a confusing wrong map with red arrow pointing wrong way, the person looks confused.
Bright, cheerful colors. Simple flat illustration style. Korean school textbook aesthetic. No English text.`
  },
  {
    filename: 'e4h_scene4_performance.png',
    prompt: `A clean, friendly flat illustration for elementary school students (ages 10-12).
Scene: An outdoor performance stage at an amusement park with an AI subtitle/audio guide system.
Front row audience: One person happily watches with clear readable subtitles appearing correctly.
Nearby: Another person (shown with hearing aid or looking confused) sees garbled/wrong subtitles on the screen, looking disappointed.
Stage has colorful performers. Bright, cheerful colors. Simple flat illustration style. Korean school textbook aesthetic. No English text.`
  }
];

async function generateImage(scene) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const body = {
    contents: [{ parts: [{ text: scene.prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
  };

  console.log(`Generating: ${scene.filename}...`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error for ${scene.filename}: ${res.status} ${err}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    throw new Error(`No image in response for ${scene.filename}: ${JSON.stringify(data).slice(0, 200)}`);
  }

  const imgBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const outPath = join(__dirname, '..', 'public', scene.filename);
  writeFileSync(outPath, imgBuffer);
  console.log(`  Saved: ${outPath}`);
}

(async () => {
  for (const scene of scenes) {
    try {
      await generateImage(scene);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
    }
  }
  console.log('Done.');
})();
