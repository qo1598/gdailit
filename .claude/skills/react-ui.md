# React UI Skill

이 프로젝트의 React UI 수정 시 적용되는 규칙이다.

## 공통 규칙
- 수정 전 공통 컴포넌트(`src/components/common/`, `src/components/modes/`) 사용 여부 먼저 확인
- 스타일은 `index.css` 또는 인라인 스타일 (별도 CSS 모듈 없음)
- 미션 화면 수정 시 V3 엔진 파일 흐름 파악 선행: `MissionShell → StageRenderer → TaskStepRenderer`

## 미션 UI 수정 시
- 레이아웃/배경/헤더 → `MissionShell.jsx`
- 스테이지 단계 표시 → `StageRenderer.jsx`
- 개별 태스크 UI → `TaskStepRenderer.jsx`
- 인터랙션 타입 UI → `src/components/modes/{type}Mode.jsx`

## 대시보드 UI 수정 시
- `src/components/Dashboard.jsx` 만 수정
- 미션 카드 레이아웃, 이미지, 상태 표시 관련

## 욕설 모달 관련
- `src/components/common/ModerationModal.jsx` 중복 구현 금지
- 훅은 `src/hooks/useModeration.js` 사용

## 금지 사항
- 레거시 파일(`Mission_backup.jsx` 등) 건드리지 않기
- 같은 UI 패턴을 여러 곳에 중복 구현하지 않기
