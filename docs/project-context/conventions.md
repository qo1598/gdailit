# Conventions

## 파일명 규칙
- 컴포넌트: PascalCase (`MissionRunner.jsx`, `TDRenderer.jsx`)
- 훅: camelCase + `use` 접두사 (`useGradeLogic.js`)
- V3 데이터: `missionsV3.js` (통합), 구버전은 `missions/*.js`
- 유틸: camelCase (`dictionary.js`, `moderation.js`)

## V3 미션 데이터 스키마 (`missionsV3.js`)
```js
"E-1": {
  meta: {
    code: "E-1",
    title: "생활 속 AI 찾기",
    domain: "Engaging",           // Engaging | Creating | Managing | Designing
    ksa: { K: [...], S: [...], A: [...] }
  },
  grades: {
    lower: {                       // gradeBand: lower | middle | upper
      cardCode: "E-1-L",           // {영역}-{번호}-{L/M/H}
      performanceType: "TD",       // TD | SJ | GC | DS
      description: "...",
      intro: [
        { text: "...", emoji: "🔍" }  // 도입 슬라이드
      ],
      coreUnderstanding: [
        { id: 1, question: "...", answer: "..." }  // 핵심 이해 3문항
      ],
      steps: [
        {
          id: "step1",
          title: "보기",
          question: "...",
          uiMode: "choice_cards",  // uiMode 목록 아래 참고
          options: [...],
          validation: { minSelections: 1 }
        }
      ]
    }
  }
}
```

## uiMode 목록 (steps에서 사용)
| uiMode | 설명 | 학년 |
|--------|------|------|
| `choice_cards` | 카드 다중 선택 | L/M/H |
| `single_select_buttons` | 버튼 단일 선택 | L/M/H |
| `photo_or_card_select` | 사진 업로드 or 카드 선택 | L/M |
| `prompt_generate` | 프롬프트 입력 + AI 생성 | H |
| `result_compare` | 결과 비교 패널 | M/H |
| `drag_rule_builder` | 드래그앤드롭 | M/H |

## performanceType별 Renderer
- `TD` → `TDRenderer.jsx` (현재 구현됨, E-1-L 기준)
- `SJ` → `SJRenderer` (미구현)
- `GC` → `GCRenderer` (미구현)
- `DS` → `DSRenderer` (미구현)

## 학년군별 UI 원칙
- **L (lower)**: 자유입력 금지, 선택 중심, 화면당 1개 행동, 큰 버튼
- **M (middle)**: 선택 + 짧은 입력 혼합, 비교 패널 가능
- **H (upper)**: AI 생성 활용 가능, 프롬프트 입력, 드래그, 복수 패널

## 컴포넌트 규칙
- 파일 1개 = 컴포넌트 1개 (기본)
- React 함수형 컴포넌트만 사용
- Props는 구조분해(destructuring)로 받는다

## 반드시 지킬 것
- 기존 `cardCode` (E-1-L 등) 변경 금지 — Supabase에 저장됨
- 구버전 파일(`Mission_backup.jsx` 등) 수정 금지
- V3 신규 작업은 `missionsV3.js` 에만 추가
- AI 프롬프트: 초등학생(1~6학년) 맥락 유지, 학년군에 맞는 언어 수준

## UI 스타일 규칙 (사용자 피드백)
- **이미지**: 이모지(`🔍` 등) 대신 AI 생성 이미지 파일 사용. 데이터 필드는 `emoji` 대신 `imageUrl`/`imageAlt`로 작성, 파일은 `public/`에 배치
- **카드 디자인 금지 패턴**: `border-left`만 색으로 강조하는 스타일 사용 금지. 카드 구분은 전체 테두리·배경색·box-shadow로 표현

## 권장 사항
- 새 performanceType renderer는 `src/components/mission/v3/` 에 추가
- 재사용 로직은 `src/hooks/`에 커스텀 훅으로 분리
- 스타일: `index.css` 또는 인라인 스타일 (별도 CSS 모듈 없음)
- 영역별 컬러: Engaging=파랑, Creating=보라, Managing=초록, Designing=주황
