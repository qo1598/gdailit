# Common Tasks

## 1. V3 미션 전환 (핵심 작업)
구버전 미션을 V3 스키마로 전환할 때:
1. `V3_프론트엔드_디자인스펙_MissionRunner_E1L_실행예시.md` 참고
2. `src/data/missionsV3.js` 에서 E-1 구조를 참고 패턴으로 사용
3. 해당 미션의 구버전 파일(`src/data/missions/{ID}.js`) 내용 참고
4. `missionsV3.js` 에 새 미션 추가 (grades.lower/middle/upper 순서)
5. performanceType 결정 (TD/SJ/GC/DS) → 미구현 type이면 Renderer 구현 필요

## 2. V3 미션 데이터 수정
기존 V3 미션(현재 E-1) 데이터 수정 시:
1. `src/data/missionsV3.js` 에서 해당 grades.{gradeBand}.steps 구간만 읽기
2. uiMode 변경 시 `TDRenderer.jsx` (또는 해당 Renderer) 처리 확인
3. cardCode는 절대 변경 금지

## 3. 새 performanceType Renderer 추가
TD 외 다른 수행 유형(SJ/GC/DS) 구현 시:
1. E-1-L의 `TDRenderer.jsx` 를 참고 패턴으로 사용
2. `src/components/mission/v3/{Type}Renderer.jsx` 신규 생성
3. `TaskStepRenderer.jsx` 에 새 type 분기 추가

## 4. V3 엔진 수정
stage 흐름, 상태 관리, validation 수정 시:
- 전체 흐름 → `MissionRunner.jsx`
- 스테이지 분기 → `StageRenderer.jsx`
- 개별 태스크 → `TaskStepRenderer.jsx`
- UI 레이아웃 → `MissionShell.jsx`

수정 전 `V3_프론트엔드_디자인스펙_MissionRunner_E1L_실행예시.md` 3절(MissionRunner 구조) 참고

## 5. 학년군 추가 (E-1의 middle/upper 추가 등)
1. `missionsV3.js` 해당 미션의 `grades.middle` or `grades.upper` 블록 추가
2. L 기준 → M은 선택+입력 혼합, H는 AI 생성/드래그 포함 가능
3. 새 uiMode가 필요하면 Renderer 확장

## 6. 버그 수정
1. 어느 stage/step에서 발생인지 먼저 특정
2. V3 엔진 흐름: `MissionRunner → StageRenderer → TaskStepRenderer → TDRenderer`
3. 데이터 관련이면 `missionsV3.js` 해당 구간 확인
4. 최소 수정, 같은 구조 다른 step에 영향 없는지 확인

## 7. UI 수정
- TopBar/ProgressHeader/BottomNav → `MissionShell.jsx`
- stage별 화면 → `StageRenderer.jsx`
- TD 카드/버튼 UI → `TDRenderer.jsx`
- 대시보드/도감 → `Dashboard.jsx`
- 공통 욕설 모달 → `ModerationModal.jsx` (중복 구현 금지)

## 8. Supabase 관련
- 클라이언트: `src/supabaseClient.js`
- 인증: `src/components/Login.jsx`
- 관리자(교사) 화면: `src/components/Admin.jsx`
- 미션 결과 저장: 제출 payload는 공통 JSON 구조 (cardCode 기준)

## 9. 코드 리뷰
1. V3 스펙 준수 여부 (stage 흐름, uiMode, performanceType) 먼저 확인
2. 학년군 UI 규칙 준수 여부 (L=선택 중심, H=AI 생성 가능)
3. cardCode·gradeBand 변경 여부 확인 (DB 연동 위험)
4. 레거시 파일 수정 여부 확인

## 10. 이미지 사용 정책 (AI 이미지 자동 생성)
미션 콘텐츠를 구현할 때 맥락에 맞는 이미지가 프로젝트에 없으면,
**생성형 AI(Imagen 등)를 통해 이미지를 직접 생성하여 삽입한다.**

- 실제 서비스용 정적 이미지 → `/public/` 에 저장 후 경로 참조
- 런타임 생성 이미지 → `src/services/imagenService.js` 활용
- 생성 프롬프트는 초등학생 교육용 스타일(밝고 평평한 일러스트)로 작성
- 이미지 생성 전 `docs/claude-rules/image-api-template.md` 절차 참고
