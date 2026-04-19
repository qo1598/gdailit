# Claude API 이미지 전달 템플릿

## 문제 상황
Pollinations 등 외부 API로 이미지를 생성한 뒤 Claude API(vision)에 넘기면
`400 Could not process image` 오류가 발생할 수 있다.

**원인:**
- Pollinations는 `image/jpeg`를 반환하지만 `.png` 확장자로 저장하면 media_type 불일치
- `/tmp` 경로는 Node.js(Windows)에서 접근 불가 → `C:\tmp`로 해석됨
- base64 인코딩 전 파일 유효성 미검증

---

## 올바른 절차

### STEP 1 — 이미지 다운로드 (Windows 환경)

```bash
# /tmp 대신 Windows 접근 가능한 경로에 직접 저장
curl -s "https://image.pollinations.ai/prompt/..." \
  -o "c:/Cursor/allit/public/image_tmp.bin" \
  -L --max-time 60
```

### STEP 2 — 파일 유효성 검증 + 저장 (Node.js)

```js
const fs = require('fs');
const src = 'c:/Cursor/allit/public/image_tmp.bin';
const buf = fs.readFileSync(src);

// magic bytes 확인
const isJPEG = buf[0] === 0xff && buf[1] === 0xd8;
const isPNG  = buf[0] === 0x89 && buf[1] === 0x50;

if (!isJPEG && !isPNG) {
  fs.unlinkSync(src);
  throw new Error('유효한 이미지가 아님 (JSON 오류 응답 등)');
}

const mediaType = isJPEG ? 'image/jpeg' : 'image/png';
const dest = 'c:/Cursor/allit/public/target.png';  // 확장자와 무관하게 동작
fs.copyFileSync(src, dest);
fs.unlinkSync(src);
console.log('OK:', mediaType, buf.length, 'bytes');
```

### STEP 3 — Claude API에 base64로 전달

```js
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const client = new Anthropic();

async function analyzeImage(imagePath) {
  const buf = fs.readFileSync(imagePath);

  // 실제 포맷 기준으로 mediaType 결정 (확장자 무시)
  const isJPEG = buf[0] === 0xff && buf[1] === 0xd8;
  const mediaType = isJPEG ? 'image/jpeg' : 'image/png';

  const base64 = buf.toString('base64');

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,   // ← 파일 내용 기반으로 결정
              data: base64,
            },
          },
          { type: 'text', text: '이 그림에서 이상한 부분을 찾아주세요.' },
        ],
      },
    ],
  });

  return response.content[0].text;
}
```

---

## 핵심 체크리스트

| 항목 | 확인 |
|------|------|
| curl 저장 경로가 Windows Node.js 접근 가능한가? (`c:/...`) | ✅ |
| magic bytes로 JPEG/PNG 실제 포맷 확인했는가? | ✅ |
| `media_type`을 확장자가 아닌 실제 포맷으로 지정했는가? | ✅ |
| 오류 응답(JSON) 저장 후 API에 넘기지 않았는가? | ✅ |
| 이미지 크기가 5MB 이하인가? (Claude API 제한) | ✅ |

---

## Pollinations 사용 시 주의사항

- Pollinations는 항상 JPEG를 반환함 (Content-Type: image/jpeg)
- `.png` 확장자로 저장해도 브라우저에서는 표시됨 (content sniffing)
- Claude API에 넘길 때는 반드시 `media_type: 'image/jpeg'` 사용
- 간헐적으로 `{"error":"Internal"}` JSON을 반환하므로 재시도 로직 필요

```js
// 재시도 래퍼 예시
async function downloadWithRetry(url, dest, maxRetry = 3) {
  for (let i = 0; i < maxRetry; i++) {
    const { execSync } = require('child_process');
    execSync(`curl -s "${url}" -o "${dest}" -L --max-time 60`);

    const buf = fs.readFileSync(dest);
    const isValid = (buf[0] === 0xff && buf[1] === 0xd8) ||
                    (buf[0] === 0x89 && buf[1] === 0x50);
    if (isValid) return true;

    console.log(`재시도 ${i + 1}/${maxRetry}...`);
  }
  throw new Error('이미지 다운로드 실패 (3회 시도)');
}
```
