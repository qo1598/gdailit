# LearnAILIT V3 · E영역 공통 인터페이스 스펙

## 설계 원칙
- 기존 V3 코드 구조 (`meta/grades/intro/coreUnderstanding/steps/submit`) 완전 유지
- 새 uiMode 추가 금지 — 기존 uiMode의 prop 확장만 허용
- 커스텀 필드는 4개 카테고리로만 귀납: `scenario`, `branch`, `feedback`, `artifact`
- 렌더러가 모르는 필드는 무시(no-op)하므로, 필드 추가가 기존 동작을 깨지 않음

---

## 1. scenario (카드 단위 — steps 바깥)

```js
scenario: {
  role: string,          // 학생 역할명. 예: "AI 탐정단원"
  goal: string,          // 미션 목표 한 문장
  context: string,       // 상황 설명 (인트로 보완용)
  artifactType: string   // 최종 산출물 명칭. 예: "탐정 카드"
}
```

- `scenarioMeta`(meta 안)와 `scenarioContext`(step 안)는 제거하고 이것으로 통일
- step별 맥락 문장은 각 step의 `hint` 또는 `question`에 자연어로 흡수

---

## 2. branch (step 단위)

앞 step 결과가 현재 step의 표시 범위·옵션에 영향을 줄 때 사용.

```js
branch: {
  sourceStepId: string,           // 참조할 이전 step id (반드시 현재 step보다 앞선 step)
  filterBy: string,               // 참조할 응답 값 또는 판정 id
  mode: "filter" | "highlight" | "restrict",
  ruleMap?: Record<string, string[]>  // restrict 모드 전용: 응답 id → 활성화할 option id 목록
  // filter   : sourceStep에서 filterBy 값인 항목만 이 step에 표시
  // highlight: sourceStep 결과와 매칭되는 옵션을 상단 정렬 또는 강조
  // restrict : ruleMap 기준으로 비관련 옵션을 비활성화
}
```

**branch 사용 원칙**

- `sourceStepId`는 반드시 현재 step보다 **앞선** step id여야 한다. 현재 step이 자기 자신을 참조하는 것은 구조적 오류다.
- `mode`는 `filter | highlight | restrict` 세 가지만 허용한다. 이 외의 값(`generate` 등)은 스펙 위반이다.

**데이터 구동 분기 — branch를 쓰지 않는 경우**

`questionsByTopic`, `recommendationsByTopic`처럼 **데이터 구조 자체가 분기 키를 포함**하는 경우, `branch` 필드를 사용하지 않는다. 렌더러는 이전 step 응답 값을 키로 해당 데이터 세트를 직접 참조한다. 이 패턴을 억지로 `branch`로 표현하면 자기 참조 오류나 스펙 외 mode가 발생한다.

```js
// 올바른 예 — E-3-L step1/step2
// step1 응답 id("animal"|"cooking"|"vehicle")를 키로
// step2는 questionsByTopic[step1.response]를 렌더링
// step2 응답 패턴을 recommendationsByTopic의 matchRules와 대조해 step3 추천 산출
// → branch 필드 없이 데이터 구조만으로 처리
```

**이전 커스텀 필드 → branch 대응표**

| 이전 필드 | branch 변환 |
|---|---|
| `connectedToStep: "step1"` + `feedbackOnMatch` | `branch: { sourceStepId:"step1", mode:"highlight" }` |
| `carriedToStep: "step2"` | 다음 step에서 `branch: { sourceStepId:"step1", mode:"filter" }` |
| `sourceStepId + filterJudgments: ["revise","verify"]` | `branch: { sourceStepId:"step2", filterBy:["revise","verify"], mode:"filter" }` |
| `reasonToOptionMap: {...}` | `branch: { sourceStepId:"step3", mode:"restrict" }` + 옵션별 `visibleFor` |
| `showCriteriaFrom: "step2"` | `branch: { sourceStepId:"step2", mode:"highlight" }` |
| `showLinkedAnswers: true` | `branch: { sourceStepId:"step2", mode:"highlight" }` |
| `showComparison: true` + `saveInitialRec` | `branch: { sourceStepId:"step1", mode:"highlight" }` |
| `hintFromStep: "step2"` | hint 텍스트에 자연어로 흡수, branch 불필요 |

---

## 3. feedback (step 단위)

선택 결과에 따른 즉시 피드백. 하나의 객체로 통일.

```js
feedback: {
  onCorrect: string | null,   // 정답 또는 매칭 성공 시 메시지
  onWrong: string | null,     // 오답 선택 시 메시지
  onMiss: string | null       // 정답을 놓쳤을 때(넘어갈 때) 경고 메시지
}
```

**이전 커스텀 필드 → feedback 대응표**

| 이전 필드 | feedback 변환 |
|---|---|
| `feedbackOnWrong: "..."` | `feedback: { onWrong: "..." }` |
| `feedbackOnMiss: "..."` | `feedback: { onMiss: "..." }` |
| `feedbackOnMatch: "..."` | `feedback: { onCorrect: "..." }` |

---

## 4. artifact (카드 단위 — submit 안)

최종 산출물 문장 템플릿. `outputCard` 대신 통일.

```js
submit: {
  ...,
  artifact: {
    bindingKey: string,    // 저장 키. 예: "e_1_l_report"
    template: string       // 산출물 문장. {stepN} 으로 응답 참조
  }
}
```

---

## 5. 제거되는 필드 목록

| 제거 필드 | 이유 |
|---|---|
| `scenarioMeta` (meta 안) | `scenario`로 통합 |
| `scenarioContext` (step 안) | hint/question에 흡수 |
| `connectedToStep` | `branch`로 통합 |
| `carriedToStep` | `branch`로 통합 |
| `feedbackOnWrong` | `feedback.onWrong`으로 통합 |
| `feedbackOnMiss` | `feedback.onMiss`로 통합 |
| `feedbackOnMatch` | `feedback.onCorrect`로 통합 |
| `sourceStepId` + `filterJudgments` (step 최상위) | `branch`로 통합 |
| `reasonToOptionMap` | `branch: { mode:"restrict" }`로 통합 |
| `showLinkedAnswers` | `branch: { mode:"highlight" }`로 통합 |
| `showComparison` + `saveInitialRec` | `branch: { mode:"highlight" }`로 통합 |
| `hintFromStep` | hint 텍스트에 흡수 |
| `showCriteriaFrom` | `branch: { mode:"highlight" }`로 통합 |
| `outputCard` | `submit.artifact`로 통합 |
| `carriedLabel` | branch 내 불필요 |
| `isWrong: true` (option 안) | `feedback.onWrong` 트리거로 대체 |
| `isCorrect: true` (option 안) | `feedback.onCorrect` 트리거로 대체 |
