# LearnAILIT V4 · C영역 공통 인터페이스 스펙

## 설계 원칙

- 기존 V3 카드 구조 (`meta/grades/intro/coreUnderstanding/steps/submit`) 유지
- E영역 공통 인터페이스(`scenario`/`branch`/`feedback`/`artifact`/`rubric`)를 그대로 계승
- C영역 특성상 실시간 AI 호출이 필요하므로 `aiCall` 필드 신규 추가
- 창작·편집·이미지 생성 등 기존 uiMode로 표현 불가능한 상호작용을 위해 신규 uiMode 8종 추가
- 렌더러가 모르는 필드는 무시(no-op) — 필드 추가가 기존 E영역 동작을 깨지 않음

---

## 1. scenario (카드 단위 — E영역과 동일)

```js
scenario: {
  role: string,          // 학생 역할명. 예: "도서관 그림책 작가"
  goal: string,          // 미션 목표 한 문장
  context: string,       // 상황 설명
  artifactType: string   // 최종 산출물 명칭. 예: "그림책 한 장면 초안"
}
```

---

## 2. branch (step 단위 — E영역과 동일)

```js
branch: {
  sourceStepId: string,           // 참조할 이전 step id (현재 step보다 앞선 step만)
  filterBy: string,               // 참조할 응답 값
  mode: "filter" | "highlight" | "restrict",
  ruleMap?: Record<string, string[]>
}
```

**branch 원칙**
- `sourceStepId`는 반드시 현재 step보다 앞선 step이어야 함
- `mode`는 세 가지만 허용 (`generate` 등 스펙 외 값 금지)
- 데이터 구조 자체가 분기 키를 포함하는 경우(`questionsByTopic` 등)는 branch 불필요

---

## 3. feedback (step 단위 — E영역과 동일)

```js
feedback: {
  onCorrect: string | null,
  onWrong: string | null,
  onMiss: string | null
}
```

C영역은 정답/오답 구조가 적으므로 feedback 사용 빈도는 낮음. 주로 이미지 오류 찾기(C-2)나 공개 문장 점검(C-4)에서 사용.

---

## 4. artifact (카드 단위 — submit 안, E영역과 동일)

```js
submit: {
  ...,
  artifact: {
    bindingKey: string,    // 저장 키. 예: "c_1_l_scene"
    template: string       // 산출물 문장 템플릿. {stepN} 참조
  }
}
```

---

## 5. rubric (카드 단위 — C영역 공통 5축)

```js
rubric: {
  axes: [
    { id: "intent",        label: "의도 설정",       description: "..." },
    { id: "ai_use",        label: "AI 활용 적절성",   description: "..." },
    { id: "revision",      label: "수정과 개선",      description: "..." },
    { id: "contribution",  label: "자기 기여",        description: "..." },
    { id: "responsibility",label: "책임 있는 공유",   description: "..." }
  ]
}
```

카드별로 5축 전체를 쓰거나, 주축 3~4개만 쓸 수 있음.
- C-1: intent / ai_use / contribution
- C-2: intent / ai_use / revision
- C-3: ai_use / revision / contribution
- C-4: contribution / responsibility

---

## 6. aiCall (step 단위 — C영역 신규)

실시간 AI 호출이 필요한 step에 사용.

```js
aiCall: {
  provider: "claude" | "gemini-image",
  mode: "chat" | "completion" | "image_gen",
  systemPrompt: string,
  userPromptTemplate: string,     // {stepN_field} 치환 지원
  outputSchema: "text" | "options_list" | "image_url",
  maxTokens?: number,
  temperature?: number,
  retryPolicy?: {
    maxRetries: number,
    onFail: "show_fallback" | "show_error"
  },
  fallback?: {
    // API 실패 시 미리 준비된 응답
    options?: string[],
    imageUrl?: string
  }
}
```

**provider별 사용 구분**
- `claude` — 텍스트 생성, 대화, 옵션 제안
- `gemini-image` — 이미지 생성 (Gemini 3.1 Flash Image)

**outputSchema별 렌더러 해석**
- `text` — 단일 텍스트를 그대로 표시
- `options_list` — AI가 반환한 문장 목록을 선택 카드로 표시
- `image_url` — 생성된 이미지를 뷰어로 표시

**fallback 원칙**
C영역 미션은 AI 호출이 핵심이므로, API 실패 시에도 수업이 멈추지 않도록 반드시 fallback 준비. 이미지 생성은 사전 제작 이미지로, 텍스트는 2~3개 후보 문장으로.

---

## 7. 기존 uiMode 재활용 목록

E영역 원본 렌더러 25개 중 C영역에서 재사용 가능한 것:

```
choice_cards          — 선택 카드
single_select_buttons — 단일 선택 버튼
single_select_cards   — 단일 선택 카드
multi_select_chips    — 복수 선택 칩
free_text             — 자유 서술
multi_free_text       — 여러 칸 자유 서술
per_case_judge        — 사례별 판정
monitor_display       — 화면 표시 (대화/이미지 조회)
```

---

## 8. C영역 신규 uiMode 8종

### 8-1. `ai_chat_turn`
AI와 한 턴씩 주고받는 대화형 입력. 학생 입력 → AI 응답 → 학생 확인/재요청.

```js
{
  uiMode: "ai_chat_turn",
  aiCall: { ... },
  studentInputLabel: "내가 쓴 문장",
  studentInputPlaceholder: "첫 문장을 써보세요",
  aiResponseLabel: "AI가 이어 쓴 문장",
  allowRetry: true,
  maxRetries: 3
}
```

### 8-2. `ai_option_picker`
AI가 생성한 후보 목록 중 선택 + 재요청 가능.

```js
{
  uiMode: "ai_option_picker",
  aiCall: { ..., outputSchema: "options_list" },
  optionCount: 3,
  allowRegenerate: true,
  allowCustomInput: true,        // "내 말로 다시 쓰기" 옵션
  customInputLabel: "내가 직접 쓰기"
}
```

### 8-3. `prompt_builder`
슬롯 채우기식 프롬프트 작성 + 완성된 프롬프트로 실제 이미지/텍스트 생성.

```js
{
  uiMode: "prompt_builder",
  slots: [
    { id: "subject", label: "무엇을", type: "chips", options: [...] },
    { id: "place",   label: "어디에서", type: "chips", options: [...] },
    { id: "mood",    label: "어떤 분위기로", type: "chips", options: [...] },
    { id: "exclude", label: "빼고 싶은 것", type: "chips", options: [...] }
  ],
  promptTemplate: "{place}에서 {subject}가 {mood} 장면. 단, {exclude}는 제외.",
  aiCall: { ..., provider: "gemini-image" },
  showGeneratedResult: true
}
```

### 8-4. `image_defect_spotter`
이미지 위에 오류 포인트를 클릭해 표시. 각 표시마다 이유 선택/서술.

```js
{
  uiMode: "image_defect_spotter",
  imageUrl: "/c2m_defect_image.png",
  defectCategories: [
    { id: "anatomy",  label: "인체 구조 오류" },
    { id: "physics",  label: "물리 법칙 오류" },
    { id: "scene",    label: "장면 구성 오류" },
    { id: "nature",   label: "자연 현상 오류" }
  ],
  minMarkers: 2,
  maxMarkers: 6,
  allowText: true
}
```

### 8-5. `prompt_revision`
기존 프롬프트를 보고 수정본 작성 + 실제 재생성해서 비교.

```js
{
  uiMode: "prompt_revision",
  originalPrompt: "...",
  originalResult: { type: "image", url: "..." },
  revisionGuide: "더 구체적으로 써보세요. 목적·대상·스타일·제외 요소를 포함하세요.",
  aiCall: { ... },
  showSideBySide: true             // 원본 결과 vs 수정 결과 나란히
}
```

### 8-6. `side_by_side_editor`
원문과 수정문을 나란히 편집. 수정 위치를 자동 하이라이트.

```js
{
  uiMode: "side_by_side_editor",
  originalText: "...",             // AI 초안
  originalLabel: "AI 초안",
  revisedLabel: "내가 다듬은 글",
  revisionTagOptions: [            // 무엇을 바꿨는지 태그
    { id: "tone",      label: "말투를 바꿈" },
    { id: "clarity",   label: "더 쉽게 바꿈" },
    { id: "emotion",   label: "감정이 느껴지게 바꿈" }
  ],
  showDiff: true
}
```

### 8-7. `edit_log`
반복 편집 과정을 타임라인으로 기록.

```js
{
  uiMode: "edit_log",
  initialDraft: "...",             // 또는 이전 step 참조
  maxIterations: 3,
  eachIterationFields: [
    { id: "revision", label: "수정본" },
    { id: "reason",   label: "왜 바꿨는가" }
  ],
  allowAiRegenerate: true,         // AI에게 다시 생성 요청 가능
  aiCall: { ... }
}
```

### 8-8. `disclosure_builder`
체크리스트로 AI 도움 영역을 선택 → 공개 문장 초안 자동 생성 → 학생이 다듬기.

```js
{
  uiMode: "disclosure_builder",
  helpAreaOptions: [               // AI 도움 영역 체크
    { id: "idea",   label: "아이디어" },
    { id: "text",   label: "문구 작성" },
    { id: "image",  label: "이미지 생성" },
    { id: "edit",   label: "편집·다듬기" }
  ],
  riskOptions: [                   // 숨기면 생길 문제
    { id: "overstate",  label: "실제 실력보다 커 보임" },
    { id: "mislead",    label: "제작 과정 오해" },
    { id: "unfair",     label: "다른 학생과 비교가 불공정해짐" }
  ],
  autoDraftTemplate: "이 작품의 {helpAreas} 부분은 AI의 도움을 받았습니다.",
  allowEdit: true                  // 자동 초안을 학생이 다듬을 수 있음
}
```

---

## 9. 필수/권장 필드

### 필수
```
meta.code / meta.title / meta.domain / meta.ksa
grades.{L|M|H}.cardCode / scenario / performanceType / description
grades.*.intro / coreUnderstanding / steps / submit / rubric
steps[].id / title / question / uiMode / validation
submit.title / message / summaryLabels / artifact
```

### 권장
```
steps[].hint
steps[].branch  (step 간 연동이 있을 때)
steps[].feedback  (정답/오답 피드백이 있을 때)
steps[].aiCall  (실시간 AI 호출이 필요할 때)
```

---

## 10. 카드별 권장 uiMode 조합

| 카드 | 주요 uiMode |
|---|---|
| C-1-L | `single_select_cards` → `free_text` → `ai_option_picker` → `free_text` |
| C-1-M | `multi_select_chips` → `ai_option_picker` → `per_case_judge` → `free_text` |
| C-1-H | `multi_free_text` → `ai_chat_turn` → `per_case_judge` → `multi_select_chips` (기여도) |
| C-2-L | `single_select_cards` → `multi_select_chips` → `prompt_builder` |
| C-2-M | `monitor_display` → `image_defect_spotter` → `prompt_revision` |
| C-2-H | `image_defect_spotter` → `free_text` (프롬프트 역추정) → `prompt_revision` |
| C-3-L | `ai_option_picker` → `free_text` |
| C-3-M | `monitor_display` → `side_by_side_editor` → `free_text` |
| C-3-H | `multi_select_chips` (기준) → `edit_log` |
| C-4-L | `free_text` → `free_text` → `disclosure_builder` |
| C-4-M | `multi_select_chips` → `disclosure_builder` |
| C-4-H | `multi_select_chips` → `multi_free_text` → `disclosure_builder` (정직 선언문) |

---

## 11. 구현 체크리스트

렌더러 구현 시 확인할 것:

- [ ] `aiCall` 필드 처리 로직 (provider별 분기, fallback 적용)
- [ ] 신규 8개 uiMode 렌더러 구현
- [ ] `branch` mode 3종(filter/highlight/restrict) 처리
- [ ] `feedback` 3종(onCorrect/onWrong/onMiss) 표시
- [ ] `artifact.template` 변수 치환 엔진
- [ ] AI 호출 실패 시 fallback 자동 적용
- [ ] 생성된 이미지/텍스트의 세션 내 캐싱 (재조회 방지)
