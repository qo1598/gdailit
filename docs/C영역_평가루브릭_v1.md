# C영역 평가 루브릭 v1 — 연구자 코딩 가이드

_기반 데이터: V4/C-1.js ~ C-4.js · 2026-04-22_

---

## 1. 설계 원칙

| 항목 | 내용 |
|---|---|
| **목적** | 연구자가 학생 응답 JSON을 직접 읽고 AI 협업 창작 역량 수준을 수동 코딩, 정량 분석에 활용 |
| **코딩 단위** | 미션 카드(C-1-L ~ C-4-H) × 준거 |
| **평가 척도** | 준거별 **0·1·2** (3점 척도) |
| **최종 수준** | 준거 합산 점수 → **0·1·2·3** (4수준) 변환 |
| **적용 시점** | 학생 수행 완료 후, `mission_submissions_v4` 테이블의 `answers` JSONB 열 + `ai_interactions` 테이블을 열람하여 사후 코딩 |
| **신뢰도 목표** | 전체 표본의 20% 이상 두 코더 독립 채점 → Cohen's κ ≥ 0.70 |

### E영역과의 차이점

| 구분 | E영역 | C영역 |
|---|---|---|
| **영역 특성** | AI 출력물을 관찰·평가·판단 | AI와 협업해 결과물 생성·정제 |
| **공통 축** | 인식/근거/판단/제안 | 의도/협업/정제/기여/공유 |
| **AI 상호작용** | 없음 (관찰 중심) | 실시간 AI 호출 포함 (C-1, C-2, C-3) |
| **추가 참조 테이블** | `answers`만 | `answers` + `ai_interactions` |

---

## 2. JSON 접근 규칙

### 2-1. `answers` 열 (E영역과 동일 + C영역 추가 uiMode)

| uiMode | `stepN` 값 shape | 접근 예시 |
|---|---|---|
| `single_select_cards` | `string` | `step1` → `'puppy'` |
| `multi_select_chips` | `string[]` | `step1` → `['friendship', 'adventure']` |
| `free_text` | `string` | `step3` → `'비 오는 놀이터에서...'` |
| `multi_free_text` | `{[questionId]: string}` | `step1['audience']` → `'초등 고학년'` |
| `per_case_judge` | `{[caseId]: {judgment, reasons?, text?}}` | `step3['case1'].judgment` → `'good'` |
| `monitor_display` / `image_view` | truthy (열람 확인) | `step1` → truthy 여부만 확인 |
| `ai_option_picker` | `{chosen: string, customInput?: string, regenerateCount: number}` | `step4.chosen` → AI 후보 텍스트 또는 커스텀 입력 |
| `ai_chat_turn` | `{input: string, aiResponse: string, retryCount: number}` | `step2.input` → 학생 질문, `step2.aiResponse` → AI 응답 |
| `prompt_builder` | `{slots: {[slotId]: string}, promptText: string, resultUrl?: string}` | `step2.slots.place` → `'park'` |
| `prompt_single_input` | `{revisedPrompt: string, resultUrl?: string}` | `step3.revisedPrompt` → 수정 프롬프트 |
| `prompt_with_conditions` | `{conditions: {[fieldId]: string}, fullPrompt: string, resultUrl?: string}` | `step4.conditions.target` → `'초등학생'` |
| `defect_select` | `{markers: [{x, y, category, text?}]}` | `step2.markers[0].category` → `'nature'` |
| `side_by_side_editor` | `{revised: string, tags: string[]}` | `step2.revised` → 수정 텍스트 |
| `edit_log` | `{iterations: [{revision: string, reason: string}]}` | `step3.iterations[0].reason` → `'톤 통일'` |
| `disclosure_builder` | `{helpAreas: string[], draft: string, edited: string}` | `step3.edited` → 최종 공개 문장 |

### 2-2. `ai_interactions` 테이블 (C영역 전용)

코딩 시 `ai_interactions`에서 해당 session의 기록을 참조하면 다음을 확인할 수 있음:

| 필드 | 확인 내용 |
|---|---|
| `attempt` | 같은 step에서 몇 번 호출했는가 (재생성 횟수) |
| `student_action` | accepted / modified / rejected / regenerated |
| `user_prompt` | 학생이 실제로 보낸 프롬프트 원문 |
| `fallback_used` | API 실패로 대체 응답을 받았는가 |

---

## 3. 공통 평가 축 (C영역)

C영역은 OECD AILit "Creating with AI" 정의에 기반한 5개 평가 축을 사용한다. E영역(인식/근거/판단/제안)과 완전히 독립적이다.

| 축 | 이름 | 핵심 질문 | 측정 대상 |
|---|---|---|---|
| **A** | **의도 설정** | 창작 목표·기준·대상을 명확히 세웠는가? | 목표 지향성, 사전 기획력 |
| **B** | **AI 협업** | AI와의 상호작용에서 적절한 판단을 했는가? | 프롬프트 구성, 후보 비교·선택, 재요청 전략 |
| **C** | **정제와 개선** | AI 결과를 기준에 맞게 수정·발전시켰는가? | 수정 행위, 반복 개선, 오류 진단 |
| **D** | **자기 기여** | 최종 결과물에 학생 고유의 의도·판단이 드러나는가? | 재구성, 창의적 변형, AI 복사 거부 |
| **E** | **책임 있는 공유** | AI 도움 범위를 투명하게 밝히고 책임지는가? | 출처·기여 구분, 공개 문장, 정직 선언 |

### 축 적용 원칙

- 학년 올라갈수록 축 수 증가: L은 A+B(+D), M은 A+B+C+D, H는 A+B+C+D+E
- C-4(책임 공유)는 E축 중심, C-1~C-3은 A+B+C+D 중심
- 미션별로 3~5개 준거 사용

---

## 4. 공통 코딩 척도

| 점수 | 명칭 | 기준 |
|---|---|---|
| **0** | 없음 | 응답 없음 / null / 무작위 / 과제와 무관한 내용 |
| **1** | 부분 | 해당 역량의 흔적이 보이나 불완전하거나 표면적 수준 |
| **2** | 명확 | 준거 충족 지표를 충분히 달성 |

> **객관형 준거**: JSON 값·개수·패턴으로 기계적 확인
> **주관형 준거** (free text / edit_log): 명시된 핵심어·개념 존재 여부로 확인
> **AI 상호작용 준거**: `ai_interactions` 테이블의 attempt·student_action 참조
> **이진 준거** (⬩): 0 또는 2만 사용, 1 미사용

---

## 5. 최종 수준 변환

### 준거 3개 카드 (최대 6점)
| 합산 | 최종 수준 |
|---|---|
| 0–1 | **수준 0** — 미달 |
| 2–3 | **수준 1** — 시작 |
| 4–5 | **수준 2** — 기초 |
| 6 | **수준 3** — 도달 |

### 준거 4개 카드 (최대 8점)
| 합산 | 최종 수준 |
|---|---|
| 0–2 | **수준 0** — 미달 |
| 3–4 | **수준 1** — 시작 |
| 5–6 | **수준 2** — 기초 |
| 7–8 | **수준 3** — 도달 |

### 준거 5개 카드 (최대 10점)
| 합산 | 최종 수준 |
|---|---|
| 0–2 | **수준 0** — 미달 |
| 3–5 | **수준 1** — 시작 |
| 6–7 | **수준 2** — 기초 |
| 8–10 | **수준 3** — 도달 |

> **학년군별 기대 수준**: L군 수준 2 이상 · M군 수준 2–3 · H군 수준 3

---

## 6. 코딩 절차

1. `mission_submissions_v4` 테이블에서 해당 학생·카드 row의 `answers` 열(JSONB)을 열람한다.
2. C영역(C-1, C-2, C-3)은 `ai_interactions` 테이블에서 같은 `session_id`의 AI 호출 기록도 함께 열람한다.
3. 코딩 시트의 준거를 위에서 아래 순서로 처리한다.
4. **JSON 필드** 열에 명시된 경로로 값을 확인한다.
5. 0/1/2 기준에 따라 점수를 기록한다. 기준이 모호하면 낮은 점수로 코딩한다.
6. 합산 → 변환표 적용 → 최종 수준 기록.
7. **inter-rater**: 20% 무작위 표본을 두 번째 코더가 독립 채점 후 κ 계산.

---

## 7. 미션 카드별 코딩 시트

---

### C-1-L · 도서관 그림책 작가 (1–2학년)

**역량 축**: A(의도 설정) + B(AI 협업) + D(자기 기여) | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 창작 방향 설정 | `step1` (string) + `step2` (string) | 둘 다 null 또는 없음 | 하나만 선택 | 주인공 + 장소 모두 선택 | &nbsp; |
| B1 | AI 후보 선택 판단 | `step4` (ai_option_picker) | null 또는 없음 | AI 후보 중 선택했으나 regenerate 0회 + customInput 미사용 (무비판 수용) | AI 후보 중 선택 또는 customInput 사용 + step3 첫 문장의 주인공·장소와 일관 | &nbsp; |
| D1 | 첫 문장 자기 작성 | `step3` (string) | 빈칸 또는 10자 미만 | 10자 이상이나 step1·step2 선택과 무관 | 10자 이상 + step1(주인공)·step2(장소) 요소가 문장에 반영 | &nbsp; |
| D2 | 마무리 문장 자기 작성 | `step5` (string) + `step6` (string) | step5·step6 모두 빈칸 | step5만 작성, step6 빈칸 또는 "모르겠다" | step5(마무리 문장) + step6(남기고 싶은 문장 + 이유) 모두 작성 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### C-1-M · 학급 신문 이야기 코너 기자 (3–4학년)

**역량 축**: A + B + C + D | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 독자·주제 설정 | `step1` (string[]) | 빈 배열 또는 없음 | 1개만 선택 | 1~2개 선택 + 주제 키워드가 step5 초안에 반영됨 | &nbsp; |
| B1 | AI 줄거리 비교·선택 | `step3` (per_case_judge) + `step4` (multi_free_text) | step3 미응답 또는 모두 같은 판정 | step3에서 구분 시도했으나 step4 채택 이유 빈칸 | step3에서 차등 판정 + step4에 채택 이유·보류 이유 모두 기술 | &nbsp; |
| C1 | 후보 기준 적용 | `step3[caseId].judgment` + `.reasons[]` | 모두 같은 judgment | judgment는 다르나 reason 미선택 | 후보별 다른 judgment + reason 1개 이상 (fits_class·natural_flow·clear_end 등) | &nbsp; |
| D1 | 내 말로 재구성 | `step5` (string) | 빈칸 또는 80자 미만 | 80자 이상이나 step2 AI 줄거리와 80% 이상 동일 (복사) | 80자 이상 + AI 줄거리와 명확히 다른 표현·구조 (이름 변경, 장소 변경, 문장 재배열 등) | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### C-1-H · 학교 축제 웹소설 부스 기획자 (5–6학년)

**역량 축**: A + B + D + E | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 기획 기준 수립 | `step1` (multi_free_text) — audience·genre·include·avoid | 0~1개 작성 | 2~3개 작성 | 4개 모두 작성 + include와 avoid가 서로 모순 없음 | &nbsp; |
| B1 | AI 대화 전략 | `step2` + `step3` (ai_chat_turn) — `ai_interactions`의 attempt 수 참조 | step2·step3 모두 input 빈칸 | input 있으나 step1 기준과 무관한 질문 | input이 step1 기준을 명시적으로 참조 + 2차(step3)가 1차(step2) 결과를 발전 | &nbsp; |
| B2 | 후보 평가 체계 | `step4` (multi_free_text) — theme_fit·audience_fit·twist_power·poster_summary | 0~1개 작성 | 2~3개 작성 | 4개 모두 작성 + step1 기준과 일관된 평가 | &nbsp; |
| D1 | 최종 기획안 고유성 | `step5` (multi_free_text) — title·logline·characters·conflict·ending | 0~2개 작성 | 3~4개 작성 | 5개 모두 작성 + AI 제안과 다른 고유 요소 1개 이상 (독자적 반전·결말) | &nbsp; |
| E1 | AI 기여·자기 기여 구분 | `step6` (string[]) + `step7` (string) | step6 미선택 + step7 빈칸 | step6 선택만 (3개 미만) 또는 step7 "AI가 도와줬다" 수준 | step6에서 [AI]·[내가] 양쪽 3개 이상 선택 + step7에 구체적 판단 사례 1개 이상 (40자 이상) | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

### C-2-L · 행사 그림 의뢰자 (1–2학년)

**역량 축**: A(의도 설정) + B(AI 협업) + C(정제와 개선) | **준거 3개 · 최대 6점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 그림 목적 설정 | `step1` (string) | null 또는 없음 | 선택했으나 step2 슬롯과 무관한 주제 | step1 선택 + step2 슬롯이 step1 맥락과 일관 (예: picnic → park/eating) | &nbsp; |
| B1 | 프롬프트 구성 | `step2` (prompt_builder) — slots 객체 확인 | slots 미입력 또는 1개만 | 2~3개 슬롯 입력 | 4~5개 슬롯 모두 입력 (place + subject + action + mood + exclude) | &nbsp; |
| C1 | 결과 확인·평가 | `step3` (string) | 빈칸 또는 15자 미만 | "예쁘다" / "좋다" 수준 (감상만) | 요청한 요소가 결과에 반영됐는지 1개 이상 구체 언급 | &nbsp; |

**합산: \_\_ / 6 → 수준 \_\_**

---

### C-2-M · 환경 캠페인 포스터 디자이너 (3–4학년)

**역량 축**: A + B + C | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 ⬩ | 초안 열람 | `step1` (image_view) | falsy | — | truthy (열람 완료) | &nbsp; |
| B1 | 오류 발견 | `step2` (defect_select) — markers 배열 | markers 없음 또는 0개 | 1개 marker | 2개 이상 marker + category가 2종 이상 다름 | &nbsp; |
| C1 | 수정 요청문 작성 | `step3` (prompt_single_input) — revisedPrompt | 빈칸 또는 50자 미만 | 50자 이상이나 step2 오류와 무관한 일반 요청 | 50자 이상 + step2에서 발견한 오류 1개 이상 구체 반영 | &nbsp; |
| C2 | 개선 판단 | `step4` (string) | 빈칸 또는 30자 미만 | "좋아졌다" 수준 (근거 없음) | 구체적 개선점 1개 이상 + 남은 아쉬운 점 언급 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**
*(⬩ 이진 준거: 0 또는 2만 사용)*

---

### C-2-H · 전시 홍보물 아트디렉터 (5–6학년)

**역량 축**: A + B + C | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| B1 | 문제 분석 범위 | `step1` (defect_select) — markers 배열 | 0~1개 marker | 2개 marker | 3개 이상 marker + category 3종 이상 (visual_error·style_issue·purpose_gap·info_delivery) | &nbsp; |
| B2 | 프롬프트 역추정 | `step2` (multi_free_text) — vagueness·missing_style·no_exclude·inferred_prompt | 0~1개 작성 | 2~3개 작성 | 4개 모두 작성 + inferred_prompt가 step1 오류와 논리적 연결 | &nbsp; |
| A1 | 개선 기준 수립 | `step3` (multi_free_text) — audience·mood·must_include·must_exclude | 0~1개 작성 | 2~3개 작성 | 4개 모두 작성 + must_exclude가 step1 오류 카테고리와 대응 | &nbsp; |
| C1 | 최종 프롬프트 설계 | `step4` (prompt_with_conditions) — fullPrompt | 빈칸 또는 100자 미만 | 100자 이상이나 step3 기준 중 1개 이하 반영 | 100자 이상 + step3 기준 3개 이상 명시적 반영 | &nbsp; |
| C2 | 개선 효과 분석 | `step5` (string) | 빈칸 또는 60자 미만 | "좋아졌다" 수준 | 기준별 충족 여부 1개 이상 구체 판단 + 잔여 과제 언급 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

### C-3-L · 포스터 문구 디자이너 (1–2학년)

**역량 축**: A(의도 설정) + B(AI 협업) + D(자기 기여) | **준거 3개 · 최대 6점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 주제 선택 | `step1` (string) | null 또는 없음 | 선택함 | 선택 + step3에서 해당 주제와 연결된 이유 서술 | &nbsp; |
| B1 | AI 문구 선택 판단 | `step2` (ai_option_picker) | null 또는 없음 | AI 후보 중 선택 (기본 수용) | AI 후보 선택 또는 customInput 사용 + step1 주제와 일관 | &nbsp; |
| D1 | 선택 이유 설명 | `step3` (string) | 빈칸 또는 15자 미만 | "좋아서" / "예뻐서" 수준 | 주제 적합성·기억 용이성 등 기준 1개 이상 명시 | &nbsp; |

**합산: \_\_ / 6 → 수준 \_\_**

---

### C-3-M · 학교 방송부 카피라이터 (3–4학년)

**역량 축**: B + C + D | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| B1 ⬩ | AI 초안 열람 | `step1` (monitor_display) | falsy | — | truthy (열람 완료) | &nbsp; |
| C1 | 수정 행위 | `step2` (side_by_side_editor) — revised + tags | revised 빈칸 또는 원문과 동일 | revised가 원문과 다르나 tags 미선택 | revised가 원문과 다름 + tags 1개 이상 선택 (tone·clarity·emotion 등) | &nbsp; |
| C2 | 수정 질적 수준 | `step2.revised` 내용 vs 원문 비교 | 단어 1~2개만 변경 | 문장 구조 변경이나 의미 동일 | 말투·공감·전달력 중 1개 이상 실질 개선 | &nbsp; |
| D1 | 수정 이유 설명 | `step3` (string) | 빈칸 또는 30자 미만 | "바꿨다" 수준 | 구체적 변경 부분 + 변경 이유 + 효과 중 2개 이상 언급 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**
*(⬩ 이진 준거: 0 또는 2만 사용)*

---

### C-3-H · 학생 잡지 편집장 (5–6학년)

**역량 축**: A + B + C + D | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 편집 기준 수립 | `step1` (string[]) | 빈 배열 또는 없음 | 1개 선택 | 2~4개 선택 + 상충되지 않는 조합 | &nbsp; |
| B1 | AI 초안 선택 | `step2` (ai_option_picker) | null 또는 없음 | AI 후보 선택 (기본 수용) | 선택 + step1 기준과 연결 가능한 후보 (또는 재생성 1회 이상) | &nbsp; |
| C1 | 반복 편집 과정 | `step3` (edit_log) — iterations 배열 | iterations 0~1회 | 2회이나 이유 빈칸 또는 "고쳤다" 수준 | 2~3회 + 매 회차 이유가 step1 기준과 연결 | &nbsp; |
| C2 | 최종본 완성도 | `step4` (string) | 빈칸 또는 10자 미만 | 10자 이상이나 step3 최종 iteration과 동일 (무수정) | 10~60자 + step3 마지막 수정본에서 추가 다듬기 흔적 | &nbsp; |
| D1 | 편집 성찰 | `step5` (string) | 빈칸 또는 40자 미만 | "수정했다" 수준 (과정 미언급) | 가장 중요한 결정 1개 + 반복 수정의 필요성 언급 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

### C-4-L · 작품 전시 큐레이터 (1–2학년)

**역량 축**: D(자기 기여) + E(책임 있는 공유) | **준거 3개 · 최대 6점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| D1 | 내 일 구분 | `step2` (string) | 빈칸 또는 10자 미만 | "그림 그렸다" 수준 (구체성 부족) | 구체적 행위 1개 이상 (예: "주인공을 정했다", "색칠했다") | &nbsp; |
| E1 | AI 도움 구분 | `step3` (string) | 빈칸 또는 10자 미만 | "AI가 도와줬다" 수준 | 구체적 도움 영역 1개 이상 (예: "제목을 추천해줬다") | &nbsp; |
| E2 | 라벨 완성 | `step4` (string) | 빈칸 또는 25자 미만 | step2·step3 내용 중 하나만 반영 | step2(내 일) + step3(AI 도움) 모두 포함한 자연스러운 문장 | &nbsp; |

**합산: \_\_ / 6 → 수준 \_\_**

---

### C-4-M · 학교 신문 편집 기자 (3–4학년)

**역량 축**: D + E | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| D1 | AI 도움 영역 인식 | `step1` (string[]) | 빈 배열 또는 없음 | 1개 선택 | 2개 이상 선택 | &nbsp; |
| E1 | 숨김 위험 인식 | `step2` (string[]) | 빈 배열 또는 없음 | 1개 선택 | 2개 이상 선택 + step1과 논리적 연결 (예: draft 선택 → mislead 선택) | &nbsp; |
| E2 | 공개 문장 작성 | `step3` (disclosure_builder) — edited | 빈칸 또는 25자 미만 | 자동 생성 초안 그대로 (무수정) | 초안에서 1곳 이상 수정 + step1 영역이 문장에 구체적으로 반영 | &nbsp; |
| E3 | 공개 문장 구체성 | `step3.edited` 내용 확인 | "AI를 썼다" 수준 (무차별) | 영역은 언급하나 범위 불명확 | 어떤 영역에 어떤 수준의 도움을 받았는지 구분 명시 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### C-4-H · 공모전 제출 담당자 (5–6학년)

**역량 축**: A + D + E | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | AI 활용 범위 정리 | `step1` (multi_free_text) — idea_area·text_area·image_area·edit_area | 0~1개 작성 | 2~3개 작성 | 4개 모두 작성 + "AI 주도/함께/인간 주도" 수준 구분 시도 | &nbsp; |
| E1 | 표기 원칙 수립 | `step2` (multi_free_text) — rule_1·rule_2·rule_3(+4,5) | 0~1개 작성 | 2개 작성 | 3개 이상 작성 + 실행 가능한 구체적 동사 포함 (예: "캡션에 표기한다") | &nbsp; |
| E2 | 점검 기준 선택 | `step3` (string[]) | 빈 배열 또는 없음 | 1~2개 선택 | 3개 이상 선택 + step2 원칙과 대응되는 항목 포함 | &nbsp; |
| D1 | 정직 선언문 작성 | `step4` (disclosure_builder) — edited | 빈칸 또는 80자 미만 | 자동 초안 그대로 (무수정) | 80자 이상 + 초안에서 1곳 이상 수정 + 자기만의 원칙 1개 이상 추가 | &nbsp; |
| D2 | 선언문 실천 가능성 | `step4.edited` 내용 확인 | 추상적 선언만 ("잘 쓰겠다") | 원칙은 있으나 구체적 행동 미명시 | "나는 ~할 때 ~하겠다" 형식의 실천 가능한 행동 2개 이상 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

## 8. 역량 축 × 미션 카드 대응표

| 카드 | 준거 수 | A 의도 | B 협업 | C 정제 | D 기여 | E 공유 | 기대 수준 |
|---|---|---|---|---|---|---|---|
| C-1-L | 4 | A1 | B1 | — | D1 D2 | — | 수준 2 |
| C-1-M | 4 | A1 | B1 | C1 | D1 | — | 수준 2–3 |
| C-1-H | 5 | A1 | B1 B2 | — | D1 | E1 | 수준 3 |
| C-2-L | 3 | A1 | B1 | C1 | — | — | 수준 2 |
| C-2-M | 4 | A1⬩ | B1 | C1 C2 | — | — | 수준 2–3 |
| C-2-H | 5 | A1 | B1 B2 | C1 C2 | — | — | 수준 3 |
| C-3-L | 3 | A1 | B1 | — | D1 | — | 수준 2 |
| C-3-M | 4 | — | B1⬩ | C1 C2 | D1 | — | 수준 2–3 |
| C-3-H | 5 | A1 | B1 | C1 C2 | D1 | — | 수준 3 |
| C-4-L | 3 | — | — | — | D1 | E1 E2 | 수준 2 |
| C-4-M | 4 | — | — | — | D1 | E1 E2 E3 | 수준 2–3 |
| C-4-H | 5 | A1 | — | — | D1 D2 | E1 E2 | 수준 3 |

*(⬩ 이진 준거: 0 또는 2만 사용)*

---

## 부록. inter-rater 신뢰도 프로토콜

1. **표본 크기**: 전체 학생 수의 20% 또는 최소 30케이스 (두 수 중 큰 값)
2. **독립성**: 두 코더가 서로의 결과를 모르는 상태에서 채점
3. **지표**: 준거별 Cohen's κ 및 전체 카드 수준 Cohen's κ 산출
4. **기준**: κ ≥ 0.70 합격. 미달 준거는 코딩 기준 보완 후 재훈련
5. **조정**: 불일치 케이스는 두 코더 협의 + 제3자 결정으로 처리
6. **기록**: κ 값을 연구 보고서 부록에 표로 제시 (준거별)
7. **C영역 특수 사항**: `ai_interactions`의 `student_action` 필드를 참조하는 준거는 코더 간 해석 일치를 위해 사전 훈련 세션에서 5개 이상 예시 공유

---
