# V3 공통 프론트엔드 디자인 스펙 + MissionRunner 구조 초안 + E-1-L 실행 예시

## 문서 목적

이 문서는 V3 미션 시스템을 **바이브코딩 AI가 바로 구현·개선 작업에 활용할 수 있도록** 정리한 개발 지시서형 문서이다.

이 문서는 다음 3가지를 함께 제공한다.

1. **48개 카드 공통 프론트엔드 디자인 스펙 구조**
2. **MissionRunner(Mission.jsx) 구조 초안**
3. **E-1-L을 기준으로 V3 스키마가 실제 화면에서 어떻게 렌더링되는지에 대한 단계별 실행 예시**

이 문서의 목표는 48개 미션이 내용은 달라도 **같은 제품, 같은 플랫폼, 같은 UX 시스템 안에서 동작하는 것처럼 보이게 하는 것**이다.

---

# 1. 전체 방향 요약

## 1-1. 핵심 원칙
- 48개 카드 모두 **같은 플랫폼 프레임** 안에서 동작해야 한다.
- 통일되어야 하는 것은 **내용**이 아니라 **형식, 흐름, 구성, 레이아웃, 상태 처리 방식**이다.
- 미션별 차이는 **데이터 스키마**로 표현하고, UI는 공통 러너가 해석해서 렌더링한다.
- 각 카드에는 최소 **K 1개 이상 / S 1개 이상 / A 1개 이상**이 들어간다.
- 실제 AI 상호작용, 프롬프트 입력·결과 생성, 조작형 활동은 **필요한 미션에만** 반영한다.
- 모든 결과는 **JSON 구조**로 저장 가능해야 한다.

## 1-2. 구조 개념
```txt
V3 Mission Schema
→ MissionRunner
→ StageRenderer
→ Performance Renderer
→ Design System Components
```

즉,
- **미션 파일**은 무엇을 보여줄지 정의하고
- **MissionRunner**는 이를 해석하고
- **Renderer**는 수행 유형에 맞는 UI를 고르고
- **공통 디자인 시스템**은 모든 미션을 같은 제품처럼 보이게 만든다.

---

# 2. 공통 프론트엔드 디자인 스펙 구조

## 2-1. 디자인 시스템 목표
V3 프론트엔드는 아래 4가지를 동시에 만족해야 한다.

- **통일성**: 48개 카드가 같은 플랫폼처럼 보일 것
- **가변성**: 미션별 차이를 수용할 것
- **학년성**: L/M/H에 따라 난이도와 UI 밀도를 조절할 것
- **구현성**: 바이브코딩 AI가 바로 컴포넌트로 만들 수 있을 것

---

## 2-2. 공통 페이지 셸 구조

모든 미션은 기본적으로 같은 페이지 셸을 사용한다.

## `MissionShell`
구성:
- `TopBar`
- `ProgressHeader`
- `ContentStage`
- `BottomNav`
- `ModalLayer`

### A. TopBar
역할:
- 뒤로가기
- 영역명
- 학년군 표시
- 미션 코드/제목 축약 표시

표시 예시:
- `Engaging | E-1-L`
- `생활 속 AI 찾기`

### B. ProgressHeader
역할:
- 현재 stage 표시
- 전체 진행도 표시
- 현재 단계 번호 표시

표시 예시:
- `도입 1/2`
- `수행 2/4`

### C. ContentStage
역할:
- 현재 stage의 실제 콘텐츠를 렌더링
- intro / core / task / submit / complete를 바꿔 끼움

### D. BottomNav
역할:
- 이전 버튼
- 다음 버튼
- 제출 버튼

규칙:
- 버튼 위치는 항상 고정
- L은 버튼 라벨 단순화
- 제출 버튼은 submit stage에서만 강조

### E. ModalLayer
역할:
- 도움말
- 경고
- AI 응답 오류
- 제출 확인
- 힌트 팝업

---

## 2-3. 공통 stage 구조

모든 미션은 아래 stage 흐름을 공유한다.

```txt
start → intro → core → task(step1..n) → submit → complete
```

### start
- 미션 제목
- 짧은 소개
- 시작 버튼

### intro
- 실생활과 연결된 5~6개의 도입 문장
- 슬라이드형 또는 카드형 표시

### core
- 핵심 이해 3문항 표시
- 문항은 공통 질문 사용

### task
- STEP 1 ~ STEP N 실제 수행
- 수행 유형에 따라 내부 UI 달라짐

### submit
- 학생이 선택/입력한 내용 요약
- 제출 버튼
- 최종 검토

### complete
- 완료 메시지
- 필요시 배지/피드백 표시

---

## 2-4. 공통 문서 구조

모든 카드 문서는 아래 순서를 유지한다.

1. 기본 정보
2. 미션 도입
3. 핵심 이해
4. 수행 과제
5. 학생 질문
6. 학생 활동
7. 제공 자료
8. 입력/조작 방식
9. 제출 방법
10. 수집 데이터(JSON)
11. 평가 포인트
12. 설계 메모

이 순서는 48개 전부 동일하게 간다.

---

## 2-5. 학년군별 UI 규칙

## L (1–2학년)
원칙:
- 한 화면에 한 가지 행동
- 큰 버튼
- 적은 선택지
- 긴 글 금지
- 자유입력 최소화

UI 규칙:
- 선택지는 최대 4~6개
- 문장 1~2줄 이내
- 이미지/아이콘 비중 높게
- 카드 크기 크게
- 단계 수 짧게

권장 흐름:
- 보기 → 고르기 → 해보기 → 제출

## M (3–4학년)
원칙:
- 비교와 짧은 설명 가능
- 선택 + 간단 입력 혼합 가능

UI 규칙:
- 결과 비교 패널 가능
- 이유 태그/짧은 입력 가능
- 4~5단계 흐름 가능

권장 흐름:
- 보기 → 찾기 → 이유 생각하기 → 비교/수정하기 → 제출

## H (5–6학년)
원칙:
- 판단, 개선, 설계 가능
- 복수 패널 허용
- 실제 AI 생성 기능 적극 활용 가능

UI 규칙:
- 결과 비교 2~3패널 가능
- 프롬프트 입력창 가능
- 드래그/조합 UI 가능
- 체크리스트와 기준표 가능

권장 흐름:
- 분석하기 → 판단하기 → 수정/설계하기 → 비교하기 → 제출

---

## 2-6. 수행 유형별 공통 패턴

### TD 탐색·구별형
핵심 경험:
- 찾기, 고르기, 구분하기

주요 UI:
- 카드 선택
- 이미지 클릭
- 체크 버튼
- 비교 카드

기본 흐름:
- 보기 → 찾기 → 선택하기 → 제출

### SJ 서술·판단형
핵심 경험:
- 이유 설명, 판단 기준 적용, 선택 정당화

주요 UI:
- 선택지
- 짧은 입력칸
- 이유 태그
- 사례 비교

기본 흐름:
- 사례 보기 → 판단하기 → 이유 선택/입력 → 제출

### GC 생성·개선형
핵심 경험:
- 프롬프트 입력, 결과 생성, 결과 수정

주요 UI:
- 프롬프트 입력창
- 생성 버튼
- 결과 비교창
- 수정 버튼/조건 선택칩

기본 흐름:
- 입력하기 → 결과 보기 → 바꿔보기 → 다시 생성하기 → 제출

### DS 데이터·설계형
핵심 경험:
- 분류, 규칙 만들기, 데이터 선택, 테스트, 설계

주요 UI:
- 드래그 앤 드롭
- 블록 조합
- 분류 버튼
- 테스트 화면
- 설계 캔버스

기본 흐름:
- 예시 보기 → 규칙/설계 만들기 → 적용하기 → 수정하기 → 제출

---

## 2-7. 영역별 시각 규칙

레이아웃은 같고, **시각적 구분만 영역별로 준다.**

- **Engaging**: 파랑 계열
- **Creating**: 보라 계열
- **Managing**: 초록 계열
- **Designing**: 주황 계열

공통 규칙:
- 색은 header / step badge / button accent에만 반영
- 본문 카드 구조는 동일
- 버튼 모양, 여백, 타이포는 공통

---

## 2-8. 공통 디자인 토큰(예시)

```js
const designTokens = {
  radius: {
    card: 20,
    button: 16,
    chip: 999
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    title: "text-2xl font-bold",
    subtitle: "text-lg font-semibold",
    body: "text-base leading-relaxed",
    small: "text-sm"
  },
  gradeDensity: {
    L: "comfortable",
    M: "balanced",
    H: "dense"
  }
}
```

---

## 2-9. 공통 상태 설계

모든 미션 공통 상태:
- `idle`
- `in_progress`
- `step_complete`
- `validation_error`
- `ready_to_submit`
- `submitted`
- `completed`

AI 기능이 있는 미션 추가 상태:
- `generating`
- `generation_error`

조작형 미션 추가 상태:
- `dragging`
- `rule_updated`
- `test_run_complete`

---

## 2-10. 공통 JSON 골격

모든 카드 제출 데이터는 아래 공통 필드를 먼저 가진다.

```json
{
  "mission_code": "E-1-L",
  "mission_base_code": "E-1",
  "domain": "Engaging",
  "grade_band": "L",
  "performance_type": "TD",
  "started_at": "",
  "submitted_at": "",
  "completed": false,
  "step_trace": []
}
```

그 위에 미션별 필드를 추가한다.

---

# 3. MissionRunner(Mission.jsx) 구조 초안

## 3-1. MissionRunner의 역할
MissionRunner는 아래 일을 한다.

1. `missionId`, `gradeBand`를 읽는다
2. V3 미션 객체에서 해당 학년군 데이터를 찾는다
3. 공통 stage 흐름을 만든다
4. 각 stage에 맞는 UI 컴포넌트를 렌더링한다
5. 입력 상태를 관리한다
6. validation 후 JSON을 제출한다

즉, MissionRunner는 **UI를 직접 하드코딩하지 않고, 스키마를 해석해서 화면을 조립하는 엔진**이다.

---

## 3-2. 추천 컴포넌트 구조

```txt
MissionPage
└── MissionRunner
    ├── MissionShell
    │   ├── TopBar
    │   ├── ProgressHeader
    │   ├── StageRenderer
    │   └── BottomNav
    └── ModalLayer
```

---

## 3-3. V3 스키마 읽는 방식

예시:
```js
const mission = MISSIONS_V3[missionId];
const gradeSpec = mission.grades[gradeBand];
```

MissionRunner는 여기서 아래를 사용한다.
- `mission.meta`
- `mission.platform`
- `gradeSpec.performanceType`
- `gradeSpec.intro`
- `gradeSpec.coreUnderstanding`
- `gradeSpec.steps`
- `gradeSpec.interactionModel`
- `gradeSpec.submit`
- `gradeSpec.jsonSchema`

---

## 3-4. MissionRunner 의사코드

```js
function MissionRunner({ missionId, gradeBand }) {
  const mission = MISSIONS_V3[missionId];
  const gradeSpec = mission.grades[gradeBand];

  const [stage, setStage] = useState("start");
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState({});
  const [generatedState, setGeneratedState] = useState({});
  const [uiState, setUiState] = useState({
    loading: false,
    validationError: null
  });

  const steps = gradeSpec.steps;
  const currentStep = steps[stepIndex];

  return (
    <MissionShell
      meta={mission.meta}
      gradeBand={gradeBand}
      stage={stage}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <StageRenderer
        stage={stage}
        mission={mission}
        gradeSpec={gradeSpec}
        currentStep={currentStep}
        formState={formState}
        generatedState={generatedState}
        uiState={uiState}
        onChange={setFormState}
        onGenerate={handleGenerate}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
      />
    </MissionShell>
  );
}
```

---

## 3-5. StageRenderer 구조

```js
function StageRenderer({ stage, mission, gradeSpec, currentStep, ...props }) {
  switch (stage) {
    case "start":
      return <MissionStartCard mission={mission} gradeSpec={gradeSpec} {...props} />;
    case "intro":
      return <MissionIntroSlides slides={gradeSpec.intro} {...props} />;
    case "core":
      return <CoreUnderstandingPanel data={gradeSpec.coreUnderstanding} {...props} />;
    case "task":
      return (
        <TaskStepRenderer
          step={currentStep}
          performanceType={gradeSpec.performanceType}
          {...props}
        />
      );
    case "submit":
      return <SubmitSummary mission={mission} gradeSpec={gradeSpec} {...props} />;
    case "complete":
      return <CompletionCard mission={mission} gradeSpec={gradeSpec} {...props} />;
    default:
      return null;
  }
}
```

---

## 3-6. TaskStepRenderer 구조

```js
function TaskStepRenderer({ step, performanceType, ...props }) {
  if (performanceType === "TD") {
    return <TDRenderer step={step} {...props} />;
  }
  if (performanceType === "SJ") {
    return <SJRenderer step={step} {...props} />;
  }
  if (performanceType === "GC") {
    return <GCRenderer step={step} {...props} />;
  }
  if (performanceType === "DS") {
    return <DSRenderer step={step} {...props} />;
  }
  return null;
}
```

각 renderer는 `step.uiMode`를 보고 더 세부적으로 렌더링한다.

예:
- `choice_cards`
- `single_select_buttons`
- `photo_or_card_select`
- `prompt_generate`
- `result_compare`
- `drag_rule_builder`

---

## 3-7. 상태 관리 원칙

MissionRunner 상태는 세 층으로 나눈다.

### A. 공통 상태
- `stage`
- `stepIndex`
- `completed`

### B. 입력 상태
- 각 step의 선택값
- 텍스트 입력값
- 업로드 파일
- 태그 선택값

### C. 확장 상태
- AI 생성 결과
- 결과 비교 기록
- 규칙 버전
- 테스트 결과

예시:
```js
const [submissionState, setSubmissionState] = useState({
  common: {
    mission_code: "",
    grade_band: "",
    completed: false
  },
  answers: {},
  generated: {},
  analytics: {}
});
```

---

## 3-8. Validation 구조

각 step은 validation 규칙을 가진다.

예시:
```js
validation: {
  requiredFields: ["location", "ai_help_type"],
  minSelections: 1
}
```

MissionRunner는 다음 버튼을 누를 때 이를 검사한다.

```js
function validateStep(step, formState) {
  // requiredFields, minSelections 등 확인
}
```

---

## 3-9. 제출 구조

MissionRunner는 마지막에 공통 JSON + 미션별 JSON을 합쳐 제출한다.

```js
function buildSubmissionPayload(mission, gradeSpec, formState, generatedState) {
  return {
    mission_code: gradeSpec.cardCode,
    mission_base_code: mission.meta.code,
    domain: mission.meta.domain,
    grade_band: gradeSpec.cardCode.split("-").pop(),
    performance_type: gradeSpec.performanceType,
    ...formState,
    ...generatedState,
    completed: true
  };
}
```

---

## 3-10. 실제 AI 연동 방식

기존 V2의 `ChatInterface.jsx` 또는 Gemini 연동은 **서비스 계층**으로 분리한다.

예:
- `aiService.generate(prompt, config)`
- `aiService.chat(messages, config)`

MissionRunner는 AI 구현 상세를 직접 알 필요가 없다.  
단지 현재 step이 **생성형인지, 채팅형인지**만 알고 있으면 된다.

예시:
```js
async function handleGenerate(promptText, config) {
  setUiState(prev => ({ ...prev, loading: true }));
  const output = await aiService.generate({
    prompt: promptText,
    mode: config.mode
  });
  setGeneratedState(prev => ({ ...prev, [config.outputKey]: output }));
  setUiState(prev => ({ ...prev, loading: false }));
}
```

---

# 4. E-1-L 기준 실제 렌더링 실행 예시

이 섹션은 **E-1-L 미션이 V3 스키마를 통해 화면에서 어떻게 실제로 렌더링되는지**를 단계별로 보여주는 예시이다.

---

## 4-1. E-1-L 핵심 설정

```js
meta.code = "E-1"
meta.title = "생활 속 AI 찾기"
gradeSpec.cardCode = "E-1-L"
gradeSpec.performanceType = "TD"
gradeSpec.ksa = {
  K: ["K1.4"],
  S: ["Self and Social Awareness"],
  A: ["Curious"]
}
```

핵심 의미:
- 영역: Engaging
- 학년군: L
- 수행 유형: TD
- 상호작용: 실제 AI 생성 없음, 조작형 선택 중심

---

## 4-2. start stage 렌더링

### 목적
학생이 부담 없이 미션을 시작하도록 한다.

### 화면 구성
- TopBar: `Engaging | E-1-L`
- 제목: `생활 속 AI 찾기`
- 짧은 소개:
  - “생활 속에서 AI가 들어 있는 것을 찾아보는 미션이에요.”
- 시작 버튼: `시작하기`

### UI 컴포넌트
- `MissionStartCard`
- `PrimaryButton`

### 상태 변화
- 버튼 클릭 시 `stage = "intro"`

---

## 4-3. intro stage 렌더링

### 목적
실생활 맥락과 연결된 도입 스토리를 제공한다.

### 데이터 원본
`gradeSpec.intro`

### 표시 방식
- 슬라이드형 카드 2~3장
- 각 카드에 도입 문장 2개씩 배치 가능
- 관련 이미지 1개 삽입 가능

### 화면 예시
슬라이드 1:
- “집에서 로봇청소기가 움직이거나, 휴대전화가 내 얼굴을 알아보는 것을 본 적이 있나요?”
- “어떤 앱은 내가 좋아할 만한 영상을 골라 보여주기도 해요.”

슬라이드 2:
- “이렇게 우리 주변에는 사람을 도와주는 똑똑한 기술이 숨어 있어요.”
- “이런 기술 가운데에는 AI가 들어 있는 것도 있어요.”

슬라이드 3:
- “오늘은 내가 직접 AI 찾기 탐정이 되어 생활 속 AI를 찾아볼 거예요.”
- “과연 어디에 AI가 숨어 있을까요? 하나씩 찾아봅시다!”

### UI 컴포넌트
- `MissionIntroSlides`
- `IllustrationCard`
- `BottomNav`

### 상태 변화
- 마지막 intro 슬라이드에서 다음 버튼 클릭 시 `stage = "core"`

---

## 4-4. core stage 렌더링

### 목적
핵심 이해 3문항을 통해 활동의 의미를 인식하게 한다.

### 데이터 원본
`gradeSpec.coreUnderstanding`

### 공통 질문 표시
1. **왜 이런 활동을 해보는 것이 중요할까요?**
2. **이 활동에서는 어떤 점을 잘 살펴보아야 할까요?**
3. **이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?**

### 화면 방식
- 질문 3개가 세로 카드로 배치
- L 학년군이므로 한 카드에 한 질문
- 간단한 아이콘 표시

### UI 컴포넌트
- `CoreUnderstandingPanel`
- `QuestionCard`

### 상태 변화
- 다음 버튼 클릭 시 `stage = "task"`, `stepIndex = 0`

---

## 4-5. task stage: STEP 1 렌더링

### STEP 1 제목
`보기`

### 목적
AI가 들어 있을 것 같은 예시를 살펴본다.

### 질문
“AI가 들어 있을 것 같은 것은 무엇인가요?”

### uiMode
`choice_cards`

### 화면 구성
- 예시 카드 4~6장 표시
  - 로봇청소기
  - 추천 영상 화면
  - 음성 비서
  - 얼굴 인식 화면
  - 계산기
  - 전등
- 학생은 AI가 들어 있을 것 같은 카드 1개 이상 선택

### UI 컴포넌트
- `ChoiceCardGrid`
- `ChoiceCard`
- `BottomNav`

### validation
- 최소 1개 선택

### 저장 예시
```json
{
  "example_choice": ["robot_vacuum", "voice_assistant"]
}
```

### 상태 변화
- 조건 만족 후 다음 버튼 클릭 → `stepIndex = 1`

---

## 4-6. task stage: STEP 2 렌더링

### STEP 2 제목
`찾기`

### 목적
내 주변에서 비슷한 AI를 하나 찾는다.

### 질문
“내 주변에서 비슷한 것을 찾을 수 있나요?”

### uiMode
`photo_or_card_select`

### 화면 구성
선택 방법 두 가지 제공:
1. 사진 올리기
2. 준비된 카드에서 고르기

### UI 컴포넌트
- `PhotoUploader`
- `ImageChoiceGrid`

### validation
- 사진 업로드 또는 카드 선택 중 하나 필수

### 저장 예시
```json
{
  "evidence_type": "photo",
  "selected_ai_item": "home_robot_cleaner"
}
```

또는

```json
{
  "evidence_type": "card",
  "selected_ai_item": "navigation_app"
}
```

### 상태 변화
- 다음 버튼 클릭 → `stepIndex = 2`

---

## 4-7. task stage: STEP 3 렌더링

### STEP 3 제목
`장소 고르기`

### 목적
AI를 어디에서 찾았는지 기록한다.

### 질문
“어디에서 찾았나요?”

### uiMode
`single_select_buttons`

### 선택지
- 집
- 학교
- 길
- 자동차
- 가게
- 기타

### UI 컴포넌트
- `SingleSelectButtons`

### validation
- 단일 선택 필수

### 저장 예시
```json
{
  "location": "home"
}
```

### 상태 변화
- 다음 버튼 클릭 → `stepIndex = 3`

---

## 4-8. task stage: STEP 4 렌더링

### STEP 4 제목
`도움 고르기`

### 목적
그 AI가 어떤 도움을 주는지 고른다.

### 질문
“이것은 어떤 도움을 주나요?”

### uiMode
`single_select_buttons`

### 선택지
- 알아보기
- 추천하기
- 말해주기
- 청소하기
- 길 알려주기
- 기타

### UI 컴포넌트
- `SingleSelectButtons`

### validation
- 단일 선택 필수

### 저장 예시
```json
{
  "ai_help_type": "clean"
}
```

### 상태 변화
- 마지막 step 완료 후 `stage = "submit"`

---

## 4-9. submit stage 렌더링

### 목적
학생이 선택한 결과를 요약해서 보여주고 제출하게 한다.

### 요약 카드 내용
- 내가 고른 예시 카드
- 내가 찾은 AI
- 장소
- 도움 종류

### 화면 예시
- “내가 찾은 AI: 로봇청소기”
- “찾은 장소: 집”
- “하는 일: 청소하기”

### UI 컴포넌트
- `SubmitSummary`
- `SummaryRow`
- `PrimaryButton`

### 제출 동작
- 제출 버튼 클릭 시 payload 생성
- `submitted_at` 기록
- `completed = true`
- `stage = "complete"`

---

## 4-10. complete stage 렌더링

### 목적
학생이 미션을 끝냈다는 경험을 제공한다.

### 화면 요소
- 완료 메시지
- 간단한 칭찬 문구
- 다음 미션 가기 버튼(선택)
- 다시 보기 버튼(선택)

예시 문구:
- “생활 속 AI를 잘 찾았어요!”
- “이제 주변의 AI를 더 잘 알아볼 수 있어요.”

### UI 컴포넌트
- `CompletionCard`
- `PrimaryButton`
- `SecondaryButton`

---

## 4-11. E-1-L 최종 제출 payload 예시

```json
{
  "mission_code": "E-1-L",
  "mission_base_code": "E-1",
  "domain": "Engaging",
  "grade_band": "L",
  "performance_type": "TD",
  "started_at": "2026-04-10T10:00:00Z",
  "submitted_at": "2026-04-10T10:03:10Z",
  "example_choice": ["robot_vacuum"],
  "evidence_type": "photo",
  "selected_ai_item": "home_robot_cleaner",
  "location": "home",
  "ai_help_type": "clean",
  "step_trace": [
    { "step": "step1", "completed": true },
    { "step": "step2", "completed": true },
    { "step": "step3", "completed": true },
    { "step": "step4", "completed": true }
  ],
  "completed": true
}
```

---

# 5. 바이브코딩 AI에 전달할 구현 포인트 요약

## 5-1. 반드시 지켜야 할 것
- 모든 미션은 공통 셸(`MissionShell`)을 사용한다.
- stage 흐름은 `start → intro → core → task → submit → complete`를 기본으로 한다.
- 수행 유형은 `TD / SJ / GC / DS` 중 하나를 기준으로 renderer를 선택한다.
- 학년군별로 UI 밀도와 인터랙션 수준을 다르게 한다.
- 공통 JSON 필드는 모든 미션에 동일하게 유지한다.

## 5-2. E-1-L에서 특별히 지켜야 할 것
- 저학년용이므로 자유입력 최소화
- 버튼, 카드, 이미지 크게
- 한 화면에 한 가지 행동
- AI 생성 기능 넣지 않음
- 선택 중심, 요약 제출 중심

## 5-3. 구현 우선순위
1. `MissionShell` 구현
2. `StageRenderer` 구현
3. `TDRenderer` 구현
4. `SubmitSummary` / `CompletionCard` 구현
5. `E-1-L` 연결
6. 이후 `SJ / GC / DS Renderer` 확장

---

# 6. 결론

이 문서의 핵심은 다음이다.

- **공통 프론트엔드 디자인 스펙**은 48개 카드의 통일감을 보장한다.
- **MissionRunner 구조**는 V3 미션 스키마를 해석해 공통 stage 흐름으로 렌더링한다.
- **E-1-L 실행 예시**는 이 구조가 실제 화면에서 어떻게 작동하는지 보여준다.

즉, 앞으로는 미션을 하나씩 하드코딩하는 것이 아니라,  
**미션 스키마를 입력하면 공통 러너가 화면을 조립하는 구조**로 가는 것이 V3에 가장 적합하다.
