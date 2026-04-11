# Mission Data Skill

V3 미션 데이터(`src/data/missionsV3.js`) 수정 또는 신규 전환 시 적용되는 규칙이다.

## V3 미션 파일 위치
- **V3**: `src/data/missionsV3.js` (통합 파일, E-1 완성)
- **구버전**: `src/data/missions/{ID}.js` (레거시, 신규 수정 금지)

## 참고 패턴: E-1-L (V3 샘플 완성본)
새 미션 전환 시 `missionsV3.js`의 E-1.grades.lower 구조를 기준으로 한다.
상세 스펙: `V3_프론트엔드_디자인스펙_MissionRunner_E1L_실행예시.md` 4절

## V3 데이터 구조 요약
```js
"X-N": {
  meta: { code, title, domain, ksa },
  grades: {
    lower:  { cardCode: "X-N-L", performanceType, intro, coreUnderstanding, steps },
    middle: { cardCode: "X-N-M", ... },
    upper:  { cardCode: "X-N-H", ... }
  }
}
```

## steps 작성 규칙
- 각 step: `{ id, title, question, uiMode, options?, validation }`
- L 학년군: uiMode는 `choice_cards`, `single_select_buttons`, `photo_or_card_select` 중심
- H 학년군: `prompt_generate`, `result_compare`, `drag_rule_builder` 가능

## 수정 규칙
- `cardCode` 변경 절대 금지 (Supabase 연동)
- `coreUnderstanding`은 항상 3문항
- L 학년군에 자유 텍스트 입력 넣지 않기
- 초등학생 눈높이 언어 유지

## 새 미션 전환 체크리스트
1. `missionsV3.js` 에 미션 추가
2. performanceType 확인 → TD 외이면 Renderer 구현 필요
3. `App.jsx` INITIAL_MISSIONS 라우팅 확인
4. `public/` 썸네일 이미지 확인
