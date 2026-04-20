# C영역 V4 개발 지침서

> 이 문서는 Claude Code로 C영역 12개 미션을 구현하기 위한 **최소 실행 지침**이다.
> 프로젝트 CLAUDE.md 원칙(토큰 절약·범위 최소화·계획→실행→검증→요약)을 따른다.

---

## 1. 작업 범위

C영역 4개 카드 × L/M/H = 총 12개 미션을 다음 파일들로 추가한다.

```
src/data/missionsV4/C-1.js   (3학년군)
src/data/missionsV4/C-2.js
src/data/missionsV4/C-3.js
src/data/missionsV4/C-4.js
src/data/missionsV4/index.js (기존 파일에 C-1~C-4 등록)
```

렌더러 코드는 대부분 **이미 존재하는 것을 재활용**한다. 신규 구현은 5개 uiMode뿐이다.

---

## 2. 기존 자산 재활용 목록

v4 `GCRenderer`에 이미 있는 uiMode는 그대로 쓴다. 신규 제작 금지.

| 기존 uiMode | 위치 | C영역 사용처 |
|---|---|---|
| `prompt_builder` | `gc/promptSteps.jsx` | C-2-L STEP 2 |
| `defect_select` | `gc/imageSteps.jsx` | C-2-M STEP 2, C-2-H STEP 1 |
| `image_compare_ab` | `gc/imageSteps.jsx` | C-2-M/H 재생성 비교 |
| `prompt_with_conditions` | `gc/promptSteps.jsx` | C-2-H STEP 4 |
| `prompt_single_input` | `gc/promptSteps.jsx` | C-2-M STEP 3 |
| `text_compare_ab` | `gc/compareSteps.jsx` | C-3-M STEP 2 |
| `result_compare_final` | `gc/compareSteps.jsx` | C-3-M/H 마무리 |
| `single_select_buttons` | (공통) | 전 영역 |

기존 E영역 `TDRenderer`/`SJRenderer`의 uiMode도 재활용 가능하다. `single_select_cards`, `multi_select_chips`, `free_text`, `multi_free_text`, `per_case_judge`, `monitor_display`는 그대로 쓴다.

---

## 3. 신규 구현 대상 (5개만)

### 3-1. `ai_chat_turn`
학생 입력 → Gemini 텍스트 호출 → AI 응답 표시 → 재요청 가능.

**구현 위치**: `src/components/Mission/v4/gc/aiChatSteps.jsx` (신규 파일)
**참고 파일**: `gc/promptSteps.jsx`의 `TaskAndPromptStep` 패턴
**사용**: C-1-H STEP 2, 3

### 3-2. `ai_option_picker`
Gemini에 "후보 N개 주세요" 요청 → 목록으로 표시 → 선택 또는 재생성 또는 커스텀 입력.

**구현 위치**: `src/components/Mission/v4/gc/aiChatSteps.jsx` (같은 파일)
**참고 파일**: `gc/promptSteps.jsx`의 `PromptSingleInputStep`
**사용**: C-1-L STEP 4, C-1-M STEP 2, C-3-L STEP 2, C-3-H STEP 2

### 3-3. `side_by_side_editor`
원문(읽기 전용) + 수정문(편집 가능) 2열 배치 + 수정 태그 칩 선택.

**구현 위치**: `src/components/Mission/v4/gc/editSteps.jsx` (신규 파일)
**참고 파일**: `gc/compareSteps.jsx`의 `TextCompareABStep`
**사용**: C-3-M STEP 2

### 3-4. `edit_log`
반복 편집 타임라인. 회차마다 {수정본, 이유} 추가. AI 재생성 버튼 포함.

**구현 위치**: `src/components/Mission/v4/gc/editSteps.jsx` (같은 파일)
**참고 파일**: 없음 (신규 패턴이지만 단순 — 배열 state + 추가 버튼)
**사용**: C-3-H STEP 3

### 3-5. `disclosure_builder`
체크리스트 → 자동 초안 생성 → 학생 편집 가능한 textarea.

**구현 위치**: `src/components/Mission/v4/gc/disclosureSteps.jsx` (신규 파일)
**참고 파일**: 없음 (가장 단순 — chips + template string + textarea)
**사용**: C-4-M STEP 3, C-4-H STEP 4

---

## 4. 텍스트 생성 서비스

기존 `services/imagenService.js`(이미지)는 그대로 둔다. 텍스트용 서비스를 신규 추가한다.

**파일**: `src/services/geminiTextService.js` (신규)

**핵심 인터페이스**:
```js
export async function generateText({ systemPrompt, userPrompt, mode = 'completion', maxTokens = 500, temperature = 0.8 }) {
  // Gemini 2.5 Flash Lite 호출
  // mode: 'completion' | 'options_list' | 'chat'
  // options_list는 응답을 줄바꿈으로 split해서 배열 반환
  // 실패 시 throw — 호출자가 fallback 처리
}
```

**모델명**: `gemini-2.5-flash-lite`
**API 키**: 기존 `.env`의 `VITE_GEMINI_API_KEY` 재사용

---

## 5. 파일별 uiMode 매핑 (최종)

내 C-*.js 초안에서 v4 호환 uiMode로 정정된 매핑이다.

### C-1
| 단계 | 내 초안 uiMode | 실제 사용할 uiMode | 비고 |
|---|---|---|---|
| C-1-L step4 | `ai_option_picker` | `ai_option_picker` (신규) | 그대로 |
| C-1-M step2 | `ai_option_picker` | `ai_option_picker` (신규) | 그대로 |
| C-1-M step3 | `per_case_judge` | `per_case_judge` (기존) | 재활용 |
| C-1-H step2-3 | `ai_chat_turn` | `ai_chat_turn` (신규) | 그대로 |

### C-2 — **대부분 기존 uiMode 재활용**
| 단계 | 내 초안 uiMode | 실제 사용할 uiMode |
|---|---|---|
| C-2-L step2 | `prompt_builder` | `prompt_builder` (기존) |
| C-2-M step1 | `monitor_display` | `image_view` (기존 GC) |
| C-2-M step2 | `image_defect_spotter` | `defect_select` (기존) |
| C-2-M step3 | `prompt_revision` | `prompt_single_input` + `image_compare_ab` (기존 조합) |
| C-2-H step1 | `image_defect_spotter` | `defect_select` (기존) |
| C-2-H step4 | `prompt_revision` | `prompt_with_conditions` + `image_compare_ab` (기존) |

### C-3
| 단계 | 내 초안 uiMode | 실제 사용할 uiMode |
|---|---|---|
| C-3-L step2 | `ai_option_picker` | `ai_option_picker` (신규) |
| C-3-M step2 | `side_by_side_editor` | `side_by_side_editor` (신규) |
| C-3-H step2 | `ai_option_picker` | `ai_option_picker` (신규) |
| C-3-H step3 | `edit_log` | `edit_log` (신규) |

### C-4
| 단계 | 내 초안 uiMode | 실제 사용할 uiMode |
|---|---|---|
| C-4-M step3 | `disclosure_builder` | `disclosure_builder` (신규) |
| C-4-H step4 | `disclosure_builder` | `disclosure_builder` (신규) |

**정리**: 신규 구현은 5개(`ai_chat_turn`, `ai_option_picker`, `side_by_side_editor`, `edit_log`, `disclosure_builder`). 나머지는 모두 기존 uiMode 재활용.

---

## 6. GCRenderer.jsx 수정 지침

신규 uiMode 5개를 MODE_MAP에 추가한다. **기존 항목은 건드리지 않는다.**

```jsx
// src/components/Mission/v4/GCRenderer.jsx
import { AiChatTurnStep, AiOptionPickerStep } from './gc/aiChatSteps';
import { SideBySideEditorStep, EditLogStep } from './gc/editSteps';
import { DisclosureBuilderStep } from './gc/disclosureSteps';

const MODE_MAP = {
  // ... 기존 항목 유지 ...

  // C영역 신규
  ai_chat_turn: AiChatTurnStep,
  ai_option_picker: AiOptionPickerStep,
  side_by_side_editor: SideBySideEditorStep,
  edit_log: EditLogStep,
  disclosure_builder: DisclosureBuilderStep,
};
```

---

## 7. aiCall 필드 처리 규약

C-*.js 데이터 파일에서 `aiCall` 필드를 쓴다. 렌더러에서 이 필드를 읽어 호출한다.

**규약**:
1. `provider: "claude"` → `geminiTextService.generateText` 호출 (모델명만 Gemini)
2. `provider: "gemini-image"` → 기존 `imagenService.generateImage` 호출
3. `userPromptTemplate`의 `{stepN_field}` 토큰은 `answers`에서 치환
4. API 실패 시 `fallback.options` 또는 `fallback.imageUrl` 사용
5. 같은 step 안에서 같은 프롬프트면 결과 캐싱 (재조회 방지)

**참고**: "provider가 claude"인데 실제로는 Gemini를 쓰는 이유 — C-*.js 데이터 파일은 이식성을 위해 추상적으로 작성됐고, 실제 provider 매핑은 렌더러가 담당한다. 나중에 Claude API로 바꾸고 싶으면 렌더러만 고치면 된다.

---

## 8. 마일스톤 (권장 순서)

CLAUDE.md 원칙대로 한 작업 단위씩 진행한다.

### 마일스톤 1: 서비스 레이어
- [ ] `src/services/geminiTextService.js` 작성
- [ ] 간단한 테스트 (콘솔에서 호출 확인)
- 예상 범위: 단일 파일, 100줄 이내

### 마일스톤 2: 데이터 파일 (C-1, C-2만)
- [ ] `src/data/missionsV4/C-1.js` 작성
- [ ] `src/data/missionsV4/C-2.js` 작성
- [ ] `index.js`에 등록
- 예상 범위: 2개 데이터 파일. 렌더러 수정 없음.

### 마일스톤 3: 신규 uiMode 구현 (C-1 쓰이는 것부터)
- [ ] `gc/aiChatSteps.jsx` 작성 (`ai_option_picker`, `ai_chat_turn`)
- [ ] `GCRenderer.jsx`에 등록
- [ ] C-1-L 동작 확인 → C-1-M → C-1-H 순
- 예상 범위: 1개 신규 파일 + GCRenderer 수정

### 마일스톤 4: C-2 미션 확인
- [ ] 기존 uiMode만 쓰므로 데이터 파일만으로 동작해야 함
- [ ] C-2-L/M/H 순 동작 확인

### 마일스톤 5: C-3, C-4 데이터 파일
- [ ] `C-3.js`, `C-4.js` 작성 및 등록

### 마일스톤 6: C-3, C-4 신규 uiMode
- [ ] `gc/editSteps.jsx` 작성 (`side_by_side_editor`, `edit_log`)
- [ ] `gc/disclosureSteps.jsx` 작성 (`disclosure_builder`)
- [ ] `GCRenderer.jsx`에 등록

### 마일스톤 7: 통합 점검
- [ ] 12개 미션 L/M/H 각 한 번씩 플레이 테스트
- [ ] Supabase에 submission 저장 확인

---

## 9. 코딩 규약 (기존 v4 스타일에 맞춤)

**파일 상단 주석**: 기존 `gc/*.jsx`와 동일 스타일
```jsx
import React, { useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { StepHeader } from './shared';
```

**state 패턴**: `answers[step.id]`에 객체로 저장, `patch({ ... })` 헬퍼 사용
```jsx
const data = answers[step.id] || {};
const patch = (updates) =>
  setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));
```

**스타일**: inline style + `clamp()` 반응형, `domainColor` 활용 (기존 패턴 유지)

**Korean 변수명 금지**: 데이터 키는 영문 snake_case

---

## 10. 주의사항

- E영역 12개는 이미 동작 중 → 건드리지 말 것
- `TDRenderer`, `SJRenderer`는 변경하지 않음. 모든 신규는 `GCRenderer`에 등록
- 기존 `GCRenderer.jsx`의 MODE_MAP에 5개만 추가 (기존 10개는 유지)
- 데이터 파일의 `branch`, `feedback`, `artifact`, `rubric` 필드는 기존 v4 규약 그대로 사용
- `scenario` 필드도 기존 `ScenarioHeader`(StageRenderer.jsx)가 자동 처리

---

## 11. 체크리스트 (개발 전 확인)

- [ ] `.env`에 `VITE_GEMINI_API_KEY` 있는지 확인
- [ ] 기존 `services/imagenService.js` 동작 확인 (C-2가 의존)
- [ ] 기존 E영역이 정상 동작하는지 확인 (회귀 방지 기준선)

---

*이 지침서는 CLAUDE.md 운영 원칙(범위 최소·토큰 절약)에 맞춰 작성되었다. 세부 UI 디자인은 기존 `gc/*.jsx` 파일을 기준으로 Claude Code가 패턴을 모방해 작성한다.*
