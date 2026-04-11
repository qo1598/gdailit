# Architecture

## 프로젝트 개요
초등학생 대상 AI 리터러시 교육 플랫폼. 16개 미션 × 3개 학년군 = **48개 카드**를 통해 AI 인식·창의적 활용·윤리·원리를 학습한다.

## 기술 스택
- **프론트엔드**: React 19 + Vite
- **라우팅**: react-router-dom v7
- **백엔드/DB/Auth**: Supabase
- **AI**: Google Generative AI (Gemini, `@google/genai`)
- **UI**: lucide-react, canvas-confetti, @dnd-kit (드래그앤드롭)
- **배포**: Vercel (`vercel.json`)
- **설계 레퍼런스**: `V3_프론트엔드_디자인스펙_MissionRunner_E1L_실행예시.md`, `LearnAILIT v3 개선(안).pdf`

---

## V3 마이그레이션 현황 (★ 최우선 맥락)
- 현재 **V3 업그레이드 진행 중**이다.
- **E-1-L (E-1 lower grade)** 이 V3 최초 완성 샘플 — 나머지 47개 카드는 이 패턴을 기준으로 전환한다.
- V3 데이터: `src/data/missionsV3.js` (현재 E-1만 있음)
- 구버전 데이터: `src/data/missions/*.js` (E-1~4, C-1~4, M-1~4, D-1~4, 레거시)
- **새 작업 시 E-1-L을 참고 패턴으로 사용**

---

## V3 핵심 개념

### 미션 카드 코드 체계
```
{영역}-{번호}-{학년군}
예: E-1-L (Engaging 1번, Lower)
    C-3-M (Creating 3번, Middle)
    D-2-H (Designing 2번, High)
```

### 학년군 (gradeBand)
- `lower` (L) — 1~2학년: 선택 중심, 큰 버튼, 자유입력 최소화
- `middle` (M) — 3~4학년: 선택 + 간단 입력 혼합
- `upper` (H) — 5~6학년: 판단·설계, AI 생성 기능 활용

### 수행 유형 (performanceType)
- `TD` — 탐색·구별형: 찾기, 고르기, 구분하기 (E-1-L이 TD)
- `SJ` — 서술·판단형: 이유 설명, 판단 기준 적용
- `GC` — 생성·개선형: 프롬프트 입력, 결과 생성, 수정
- `DS` — 데이터·설계형: 분류, 규칙 만들기, 드래그앤드롭

### Stage 흐름 (모든 미션 공통)
```
start → intro → core → task(step1..n) → submit → complete
```

---

## V3 데이터 구조 (`src/data/missionsV3.js`)
```js
MISSIONS_V3 = {
  "E-1": {
    meta: { code, title, domain, ksa },
    grades: {
      lower: {
        cardCode: "E-1-L",
        performanceType: "TD",
        description: "...",
        intro: [{ text, emoji }],          // 도입 슬라이드 배열
        coreUnderstanding: [{ id, question, answer }], // 핵심 이해 3문항
        steps: [{ id, title, question, uiMode, options, validation }]
      },
      middle: { ... },
      upper:  { ... }
    }
  }
}
```

### steps의 uiMode 종류
- `choice_cards` — 카드 다중 선택
- `single_select_buttons` — 버튼 단일 선택
- `photo_or_card_select` — 사진 업로드 or 카드 선택
- `prompt_generate` — 프롬프트 입력 + AI 생성
- `result_compare` — 결과 비교
- `drag_rule_builder` — 드래그앤드롭

---

## 라우팅
- `/mission/:missionId/:gradeBand` → V3 MissionRunner
  - 예: `/mission/E-1/lower` → E-1-L 실행
- `/` → Dashboard (미션 도감)
- `/minigame` → MiniGame
- `/discussion` → Discussion
- `/admin` → Admin (교사 관리자)

---

## 컴포넌트 구조
```
MissionRunner
└── MissionShell (TopBar, ProgressHeader, BottomNav, ModalLayer)
    └── StageRenderer
        ├── start  → MissionStartCard
        ├── intro  → MissionIntroSlides
        ├── core   → CoreUnderstandingPanel
        ├── task   → TaskStepRenderer
        │           ├── TDRenderer (TD 수행형)
        │           ├── SJRenderer (미구현)
        │           ├── GCRenderer (미구현)
        │           └── DSRenderer (미구현)
        ├── submit → SubmitSummary
        └── complete → CompletionCard
```

### 영역별 컬러
- Engaging (E): 파랑
- Creating (C): 보라
- Managing (M): 초록
- Designing (D): 주황

---

## 디렉터리 역할
```
src/
  App.jsx              # 앱 진입점, 라우팅, INITIAL_MISSIONS 상수
  supabaseClient.js    # Supabase 인스턴스
  components/
    mission/v3/        # ★ V3 MissionRunner 엔진 (현재 핵심)
    mission/d1/        # 레거시
    mission/d2/        # 레거시
    missions/          # 구버전 개별 미션 컴포넌트 (레거시)
    common/            # ModerationModal
    modes/             # 구버전 인터랙션 모드 (레거시)
    Dashboard.jsx      # 미션 도감
    Login.jsx / Admin.jsx / MiniGame.jsx / Discussion.jsx
  hooks/
    useFormHandling.js
    useGradeLogic.js
    useModeration.js
  data/
    missionsV3.js      # ★ V3 미션 데이터 (E-1 완성, 나머지 추가 예정)
    missions/          # 구버전 미션 데이터 (레거시)
  utils/
    dictionary.js / moderation.js
public/                # 미션 썸네일 이미지
```

---

## 제출 데이터 공통 JSON 구조
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
