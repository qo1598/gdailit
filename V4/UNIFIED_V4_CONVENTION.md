# LearnAILIT V4 통일 규약 (E/C/M/D 공통)

> E영역 V4 구현을 기준으로 C영역 착수 시 확정된 통일 규약.
> M영역·D영역도 **반드시 이 규약을 따른다.** 새로운 방식이 필요하면 이 문서를 먼저 갱신한 뒤 적용.

---

## 1. 데이터 파일 규약

### 파일 위치
```
src/data/missionsV4/{도메인}-{번호}.js   예: C-1.js
src/data/missionsV4/index.js            (각 미션 import/등록)
```

### export 이름
```js
export const C1_V4 = { ... };   // ✅ 형식: {코드}_V4
// ❌ C1_V4_SCENARIO, C1_V3_SCENARIO 등 금지 — 드래프트에서 쓰던 이름은 모두 정리
```

### 상단 주석
```js
/**
 * LearnAILIT V4 · C-1 {미션제목}
 * 시나리오 기반 수행 평가 — 공통 인터페이스 적용
 *
 * [공통 인터페이스]
 * scenario  : 카드 단위 역할·목표·맥락·산출물·시나리오 이미지
 * branch    : step 간 분기/연동
 * feedback  : 사용 최소화 (정답/오답 구조가 명확한 step만)
 * artifact  : submit.artifact.template
 * rubric    : axes 배열
 * aiCall    : 실시간 AI 호출 (C영역 전용)
 */
```

### scenario 필드 (카드 단위 필수)
```js
scenario: {
  role: "...",
  goal: "...",
  context: "...",
  artifactType: "...",
  image: "/images/c1l/scenario.png"   // ✅ 필수 — 아래 이미지 생성 규약 참조
}
```

### feedback 정책
- **기본: 비우거나 생략**한다. E-V4는 대부분 step에서 feedback을 제거했음.
- 예외: 정답/오답이 명확히 갈리는 step (C-2 `defect_select`, C-4 `disclosure` 등 일부).
- 드래프트의 "잘했어요!" 같은 격려성 `onCorrect`는 삭제.

### provider 필드
- `aiCall.provider`는 **실제 구현 기준**으로 명시한다.
  - 텍스트 생성 → `"gemini-text"` (Gemini 2.5 Flash Lite, `geminiTextService`)
  - 이미지 생성 → `"imagen"` (Imagen 4 Fast, `imagenService`)
- `"claude"` 같이 실제와 다른 provider 명은 쓰지 않는다.

### 필드 순서 표준
```
meta → grades.{lower|middle|upper} → {
  cardCode, performanceType, description,
  scenario, intro, coreUnderstanding,
  steps, submit, rubric
}
```

---

## 2. 시나리오 이미지 생성 규약

### 모델 & 저장 위치
- **모델**: `gemini-3.1-flash-image-preview`
- **저장 경로**: `public/images/{미션코드 소문자}/scenario.png`
  - 예: C-1-L → `public/images/c1l/scenario.png`
- **데이터 참조**: `scenario.image: "/images/c1l/scenario.png"` (선행 슬래시 포함)

### 생성 스크립트
- **파일**: `scripts/genScenarioImage{코드}.cjs`
  - 예: `genScenarioImageC1L.cjs`
- **패턴**: E영역 스크립트(`genScenarioImageE1L.cjs` 등)와 동일 구조 복제
- **프롬프트 필수 요소**:
  1. 스타일: `2D cartoon illustration for Korean {grade-band} elementary students, warm pastel colors, soft rounded shapes, friendly Korean animation style.`
  2. 학년 대상: L=grades 1-2, M=grades 3-4, H=grades 5-6
  3. 시나리오 요약: `scenario.role`, `scenario.goal`, `scenario.context`를 영어로 시각 묘사
  4. 산출물 암시: `scenario.artifactType`을 빈 상태의 소품으로 배치
  5. **ZERO text constraint** (아래 문단 그대로 복붙):
     > CRITICAL CONSTRAINT: the image must contain ZERO text of any kind. No English letters, no Korean Hangul, no numbers, no logos, no signs, no labels, no UI captions, no speech bubbles. Any screen, panel, or card must display ONLY abstract icons, shapes, or thumbnails. Purely visual storytelling with icons and imagery only.
  6. `Bright, inviting, safe, age-appropriate. Wide 16:9 aspect ratio composition.`

### 실행
```bash
node scripts/genScenarioImageC1L.cjs
```

---

## 3. 렌더러 등록 규약

- 신규 uiMode는 해당 도메인 Renderer의 `MODE_MAP`에만 추가 (E/C=`GCRenderer`, M=`TDRenderer`/`SJRenderer` 기존, D=별도 논의).
- **기존 MODE_MAP 항목은 절대 건드리지 않는다** (회귀 방지).
- 재활용 가능한 기존 uiMode가 있으면 신규 구현 금지 — `INTERFACE_SPEC_C.md`의 "기존 uiMode 재활용 목록" 먼저 참조.

---

## 4. AI 호출 서비스

### 텍스트: `src/services/geminiTextService.js` (신규)
- 모델: `gemini-2.5-flash-lite`
- 인터페이스:
  ```js
  export async function generateText({
    systemPrompt, userPrompt,
    mode = 'completion',   // 'completion' | 'options_list' | 'chat'
    maxTokens = 500, temperature = 0.8
  })
  ```
- `options_list`: 응답을 줄바꿈 split 후 배열 반환
- 실패 시 throw → 렌더러가 `aiCall.fallback` 적용

### 이미지(학생 런타임): `src/services/imagenService.js` (기존, 그대로 사용)
- 모델: `imagen-4.0-fast-generate-001`

### 시나리오 이미지(오프라인, 사전생성): `scripts/genScenarioImage*.cjs`
- 모델: `gemini-3.1-flash-image-preview`

---

## 5. uiMode 명명 — 스펙 vs 개발지침 충돌 정리

`INTERFACE_SPEC_C.md`의 명칭과 `DEVELOPER_GUIDE_C.md`의 명칭이 다를 때는 **개발지침(실제 구현에 쓰는 이름)**을 따른다. 데이터 파일도 이 이름으로 작성.

| 스펙 문서 명칭 | 실제 사용 명칭 (채택) |
|---|---|
| `image_defect_spotter` | `defect_select` |
| `prompt_revision` | `prompt_single_input` + `image_compare_ab` (조합) |
| `monitor_display` (C-2) | `image_view` |

신규 5종은 양쪽 이름이 일치: `ai_chat_turn`, `ai_option_picker`, `side_by_side_editor`, `edit_log`, `disclosure_builder`.

---

## 6. 회귀 방지 규칙

- E영역 12개 파일(`E-1.js`~`E-4.js`) 및 `TDRenderer`/`SJRenderer`는 **이번 작업에서 절대 변경하지 않는다**.
- `GCRenderer.jsx`는 `MODE_MAP`에 항목 추가만. 기존 import/항목 유지.
- 공용 컴포넌트(`MissionShell`, `StageRenderer`, `shared.jsx`)는 **수정 금지**. 필요 시 별도 논의 후 수정.

---

## 7. M영역·D영역 적용 시 확인 사항 (TODO)

- [ ] M영역 착수 시: 이 문서의 1·2·6절 그대로 적용 (export `M{n}_V4`, scenario.image 경로, 이미지 생성 스크립트)
- [ ] M영역이 요구하는 신규 uiMode가 있다면 이 문서 5절에 행 추가
- [ ] D영역도 동일
- [ ] 규약을 바꿔야 할 이유가 발견되면 **먼저 이 문서를 수정 → 커밋 → 그 다음 코드 변경**

---

*이 문서는 E영역 실제 구현(`src/data/missionsV4/E-*.js`, `scripts/genScenarioImageE*.cjs`, `src/services/imagenService.js`, `GCRenderer.jsx`)을 근거로 작성되었다.*
