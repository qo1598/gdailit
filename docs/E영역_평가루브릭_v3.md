# E영역 평가 루브릭 v3 — 연구자 코딩 가이드

_기반 데이터: V4/E-1.js ~ E-4.js · 2026-04-22_

---

## 1. 설계 원칙

| 항목 | 내용 |
|---|---|
| **목적** | 연구자가 학생 응답 JSON을 직접 읽고 AI리터러시 역량 수준을 수동 코딩, 정량 분석에 활용 |
| **코딩 단위** | 미션 카드(E-1-L ~ E-4-H) × 준거 |
| **평가 척도** | 준거별 **0·1·2** (3점 척도) |
| **최종 수준** | 준거 합산 점수 → **0·1·2·3** (4수준) 변환 |
| **적용 시점** | 학생 수행 완료 후, `mission_submissions_v4` 테이블의 `answers` JSONB 열을 열람하여 사후 코딩 |
| **신뢰도 목표** | 전체 표본의 20% 이상 두 코더 독립 채점 → Cohen's κ ≥ 0.70 |

---

## 2. JSON 접근 규칙

`answers` 열의 최상위 키는 `step1`, `step2`, ... 이며, 각 값의 shape는 uiMode에 따라 다르다.

| uiMode | `stepN` 값 shape | 접근 예시 |
|---|---|---|
| `choice_cards` / `multi_select_chips` | `string[]` (선택 id 배열) | `step1` → `['robot_vacuum', 'face_unlock']` |
| `single_select_buttons` / `single_select_cards` | `string` (선택 id) | `step3` → `'home'` |
| `free_text` | `string` | `step4` → `'스스로 판단해서요'` |
| `photo_or_card_select` | `{value: string}` | `step2.value` → `'home_robot_cleaner'` |
| `classify_cards_carousel` | `{[cardId]: group}` | `step1['calculator']` → `'non_ai'` |
| `multi_select_chips` | `string[]` | `step2` → `['recognizes', 'learns']` |
| `judge_qa_carousel` | `{[qaId]: {judge, reason?}}` | `step1['q2'].judge` → `'strange'` |
| `bubble_select_correct` | `{[bubbleId]: {selected, reason?}}` | `step2['a3'].selected` → `true` |
| `followup_question_carousel` | `{[bubbleId]: string}` | `step3['a3']` → `'박쥐가 정말 새인가요?'` |
| `per_response_judge` | `{[sampleId]: string}` | `step2['s2']` → `'revise'` |
| `filtered_reason_select` | `{[sampleId]: string}` | `step3['s2']` → `'wrong_fact'` |
| `filtered_plan_text` | `{[sampleId]: string}` | `step4['s2']` → `'교과서로 확인하겠어요'` |
| `per_case_judge` / `card_drop_board` | `{[caseId]: {judgment?, reasons?, plans?, text?}}` | `step4['case_a'].judgment` → `'helpful'` |
| `case_judge_carousel` | `{[caseId]: {judgment?, fairness?, reasons?, text?}}` | `step1['face_recognition'].judgment` → `'user_b'` |
| `yesno_quiz` | `Array<{qId, answer: boolean}>` | `step2[0]` → `{qId:'q1', answer:true}` |
| `star_rating_carousel` | `{[clothId]: number}` | `step2['cloth_01']` → `4` |
| `multi_free_text` | `{[questionId]: string}` | `step4['q1']` → `'밝은색을 좋아해요'` |
| `person_reason_select` | `{person: string, reasons: string[]}` | `step3.person` → `'person_b'` |
| `recommendation_reveal` | truthy 값 (열람 확인) | `step3` → truthy 여부만 확인 |
| `case_carousel_reason` | `{[caseId]: reasonId}` | `step1['case_1']` → `'similar_topic'` |

---

## 3. 공통 코딩 척도

| 점수 | 명칭 | 기준 |
|---|---|---|
| **0** | 없음 | 응답 없음 / null / 무작위 / 과제와 무관한 내용 |
| **1** | 부분 | 해당 역량의 흔적이 보이나 불완전하거나 표면적 수준 |
| **2** | 명확 | 준거 충족 지표를 충분히 달성 |

> **객관형 준거**: JSON 값·개수·패턴으로 기계적 확인  
> **주관형 준거** (free text): 명시된 핵심어·개념 존재 여부로 확인 (동의어 포함)  
> **이진 준거** (⬩): 0 또는 2만 사용, 1 미사용

---

## 4. 최종 수준 변환

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

## 5. 코딩 절차

1. `mission_submissions_v4` 테이블에서 해당 학생·카드 row의 `answers` 열(JSONB)을 열람한다.
2. 코딩 시트의 준거를 위에서 아래 순서로 처리한다.
3. **JSON 필드** 열에 명시된 경로로 값을 확인한다.
4. 0/1/2 기준에 따라 점수를 기록한다. 기준이 모호하면 낮은 점수로 코딩한다.
5. 합산 → 변환표 적용 → 최종 수준 기록.
6. **inter-rater**: 20% 무작위 표본을 두 번째 코더가 독립 채점 후 κ 계산.

---

## 6. 미션 카드별 코딩 시트

---

### E-1-L · AI 탐정단원 (1–2학년)

**역량 축**: A(인식·식별) + B(근거·설명) | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | AI/비AI 판별 | `step1` (string[]) | 배열 없음 또는 비AI id(`calculator`, `lamp`) 포함 | AI id만 있으나 1–2개 | AI id 3개 이상 + 비AI id 미포함 | &nbsp; |
| A2 | 주변 AI 인식 | `step2.value` (string) | null 또는 없음 | 카드를 선택했으나 step1에서 고른 AI 종류와 무관한 항목 | step1에서 고른 AI 종류와 같은 범주 카드 선택 (예: step1에 `voice_assistant` → step2에 `voice_speaker`) | &nbsp; |
| B1 | 장소 연결 | `step3` (string) | null 또는 없음 | `'other'` 선택 | `step2.value` 카드의 통상 사용 장소와 일치하는 id 선택 | &nbsp; |
| B2 | 도움 기능 이해 | `step4` (string) | null 또는 없음 | `'other'` 선택 | `step2.value` 카드의 주요 기능과 부합하는 id 선택 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-1-M · AI 소개 기자 (3–4학년)

**역량 축**: A(인식·식별) + B(근거·설명) | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | AI/비AI 판별 | `step1` (string[]) | 배열 없음 또는 비AI id(`calculator`, `lamp`) 포함 | AI id만 1–2개 | AI id 3개 이상 + 비AI id 미포함 | &nbsp; |
| B1 | 하는 일 연결 | `step3` (string) | null 또는 없음 | `'other'` 선택 또는 step2 선택 항목과 무관 | step2 항목의 주요 기능과 일치하는 id | &nbsp; |
| B2 | AI인 이유 서술 | `step4` (string) | 빈칸 또는 무관 | 표면 특징만 ("빨라요", "편해요") | `'스스로 판단'`, `'추천'`, `'학습'` 관련 표현 1개 이상 | &nbsp; |
| B3 | 소개 문장 완성 | `step5` (string) | 빈칸 | 장소·도움 2요소 중 1개만 | 장소 + 도움 기능 2요소 모두 포함 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-1-H · AI 전시 큐레이터 (5–6학년)

**역량 축**: A + B + C + D | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 기본 분류 정확도 | `step1` (object) — 각 cardId의 값을 answerKey와 비교 | 미응답 또는 정답률 <50% | 정답률 50–74% | 정답률 ≥75% + 비AI(`calculator`,`auto_door`,`alarm_clock`) 전부 `non_ai` | &nbsp; |
| A2 | 경계 사례 판정 | `step3[caseId].judgment` (string, 4개) | 미응답 또는 4개 모두 같은 값 | 4개 중 2개 이상 구분 시도 | 학습형(`smart_thermostat`,`spam_filter`)=`ai`, 단순 센서형(`auto_door`)=`non_ai` 구분 | &nbsp; |
| B1 | 경계 사례 이유 | `step3[caseId].text` (string per case) | 모든 케이스 빈칸 | "스스로 움직여요" 수준 | `'학습'`, `'판단'`, `'데이터'` 관련 표현 1개 이상 | &nbsp; |
| C1 | 판단 기준 구성 | `step2` (string[]) | 빈 배열 또는 없음 | 1개만 | 2개 이상 + `'learns'`,`'predicts'`,`'adapts'`,`'recognizes'` 중 1개 이상 포함 | &nbsp; |
| D1 | 전시 기준 문장 | `step4` (string) | 빈칸 또는 템플릿만 복사 | 기준 1개만 언급 | 기준 2개 이상 + 판단 근거 명시 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

### E-2-L · AI 답 점검 도우미 (1–2학년)

**역량 축**: A(인식·식별) + B(근거·설명) + C(판단·적용) | **준거 4개 · 최대 8점**

> qaCard 정답: q2(고양이 다리), q4(강아지 날기), q5(태양 공전), q6(얼음 원래 뜨거움) = `strange` / q1(바나나), q3(사과) = `correct`

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 이상한 답 식별 | `step1[qId].judge` (6개) | 미응답 또는 정답 <3개 | 정답 3–4개 (50–66%) | 정답 5–6개 (≥83%) | &nbsp; |
| B1 | 이상 이유 선택 | `step1[qId].reason` (strange 판정 카드만) | strange 판정 카드에 reason 없음 | 모든 strange에 같은 reason | strange 카드별로 다른 reason 구분 선택 | &nbsp; |
| C1 | 확인 방법 판단 | `step2` (string[]) | 배열 없음 또는 없음 | `'ask_again'`(AI 그대로) 포함 | `'ask_again'` 미포함 + 안전한 방법 1개 이상 | &nbsp; |
| C2 | 게시판 결정 | `step3[caseId].judgment` (6개) | 미응답 또는 6개 모두 같은 값 | strange·correct 일부만 구분 | step1 `judge`와 결정 완전 일치 (`strange`→`skip` 또는 `verify`, `correct`→`post`) | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-2-M · AI 대화 검토자 (3–4학년)

**역량 축**: A + B + C | **준거 5개 · 최대 10점**

> 이상 말풍선: `a3`(박쥐=조류) · `a6`(개=흑백) → `selected: true` / 나머지 4개 → `selected: false`

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 의심 말풍선 식별 | `step2[bubbleId].selected` (6개) | 미응답 또는 정답 <3개 | a3·a6 중 1개만 `true` | a3·a6 모두 `true` + 나머지 4개 `false` 유지 | &nbsp; |
| B1 | 이상 이유 선택 | `step2[bubbleId].reason` (selected=true 항목) | reason 없음 | 1개에만 reason, 또는 두 항목 모두 같은 reason | a3·a6 각각 다른 reason (`wrong_fact` / `not_proven` 구분) | &nbsp; |
| B2 | 확인 질문 작성 | `step3[bubbleId]` (string, selected=true 항목) | 빈칸 | "맞아요?" 수준 또는 주장과 무관 | 해당 말풍선 구체 주장에 대응하는 질문 또는 근거·출처 요청 | &nbsp; |
| C1 | 사용/보류 결정 | `step4[caseId].judgment` (6개) | 미응답 또는 모두 같은 값 | 의심 말풍선 일부에만 `'hold'` 적용 | step2 `selected`와 결정 완전 일치 (`true`→`hold`, `false`→`use`) | &nbsp; |
| C2 | 유의 태도 선택 | `step5` (string[]) | 배열 없음 | `'ask_many'`(지칠 때까지) 또는 `'do_copy'`(그대로 써서) 포함 | 부적절 옵션 미포함 + 안전 태도 2개 이상 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

### E-2-H · 학급 신문 편집장 (5–6학년)

**역량 축**: A + B + C + D | **준거 4개 · 최대 8점**

> 정답 배치: s1(광합성)·s3(독도) = `use` / s2(세종컴퓨터)·s4(달 24시간)·s5(블랙홀) = `revise` 또는 `verify`

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 5개 기사 판정 | `step2[sampleId]` (string, 5개) | 미응답 또는 5개 모두 같은 값 | s1·s3만 `use`, 나머지 구분 없음 | s2·s4·s5 중 2개 이상 `revise` 또는 `verify` 정확 판정 | &nbsp; |
| B1 | 판정 이유 표시 | `step3[sampleId]` (string, revise/verify 항목) | reason 없음 또는 모두 `'other'` | 1개에만 reason | revise/verify 항목 모두에 reason + 항목별 다른 reason 구분 | &nbsp; |
| C1 | 편집 계획 서술 | `step4[sampleId]` (string, revise/verify 항목) | 빈칸 또는 "고친다" 수준 | 1개 항목만 구체적 | 2개 이상 항목에 확인 자원(교과서·전문가 등) 명시 | &nbsp; |
| D1 | 편집장 메모 | `step5` (string) | 빈칸 또는 무관 | AI 한계만 언급 (일반론) | AI 한계 + 인간 책임 또는 실천 태도 언급 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-3-L · 추천 탐험가 (1–2학년)

**역량 축**: A(인식·식별) + B(근거·설명) | **준거 4개 · 최대 8점**

> A1·B1은 **이진 준거** (⬩). A1=0이면 카드 전체 수준 0 처리.

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 ⬩ | 주제 선택 완료 | `step1` (string) | null 또는 없음 | — | `'animal'`·`'cooking'`·`'vehicle'` 중 1개 선택 | &nbsp; |
| A2 | 질문 응답 충실도 | `step2` (Array) — 배열 length 확인 | 0–2개 응답 | 3–6개 응답 | 7–10개 응답 | &nbsp; |
| B1 ⬩ | 추천 결과 열람 | `step3` (truthy 여부) | falsy | — | truthy (열람 완료) | &nbsp; |
| B2 | 추천 이유 서술 | `step4` (string) | 빈칸 또는 무관 | "좋아해서" 수준 (막연) | step2 응답 내용 1개 이상 인용 + 추천 결과 특징과 연결 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**  
*(⬩ 이진 준거: 0 또는 2만 사용)*

---

### E-3-M · 추천 시스템 테스터 (3–4학년)

**역량 축**: A + B + C | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 별점 평가 충실도 | `step2` (object) — `Object.keys().length` + 값 분포 확인 | 0–4개 평가 | 5–14개 평가 | 15–20개 평가 + 값 분포 다양 (≤3점과 ≥4점이 모두 존재) | &nbsp; |
| B1 | 취향 특징 인식 | `step4['q1']` (string) | 빈칸 또는 무관 | "예쁜 거 좋아해요" 수준 (막연) | 색·스타일·계절 중 1개 이상 구체 언급 | &nbsp; |
| B2 | 추천-별점 연결 설명 | `step4['q2']` (string) | 빈칸 또는 무관 | "비슷해요" 수준 | 공통 속성(색·스타일·계절 등) 1개 이상 명시하여 연결 설명 | &nbsp; |
| C1 | 추천 영향 예측 | `step4['q3']` (string) | 빈칸 또는 무관 | "편해요/좋아요" (긍정만) | 부정 영향 1개 이상 언급 (시야 좁아짐·새 선택 놓침 등) | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-3-H · 추천 분석 에디터 (5–6학년)

**역량 축**: A + C + D | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 추천 이유 분석 | `step1[caseId]` (string, 4개) — 각 값이 reasonOption id인지 확인 | 미응답 또는 모두 `'other'` | 4개 중 1–2개 reason 선택 | 4개 모두 reason 선택 + 케이스별로 다른 id 구분 | &nbsp; |
| C1 | 판단과 장·단점 연결 | `step2[caseId].judgment` + `.plans[]` / `.limitations[]` (4개) | 미응답 또는 모두 같은 judgment | helpful 또는 careful 한 방향으로만 판단 | 케이스별로 `helpful`·`careful`·`both` 논리적 구분 + plans/limitations 각각 부합 | &nbsp; |
| D1 | 주도적 활용 서술 | `step3` (string) | 빈칸 또는 "조심히 쓴다" 수준 | 일반 원칙 1개 | 특정 사례와 연결된 구체 전략 1개 이상 | &nbsp; |
| D2 | 3가지 원칙 작성 | `step4['p1']` · `step4['p2']` · `step4['p3']` (string 3개) | 0–1개 작성 | 2개 작성 또는 3개이나 중복 | 3개 서로 다른 관점으로 작성 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-4-L · AI 배려 관찰자 (1–2학년)

**역량 축**: A(인식·식별) + B(근거·설명) + C(판단·적용) | **준거 4개 · 최대 8점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 차이 인식 | `step2` (string[]) | 배열 없음 | 무관한 차이(`change_color`, `make_bigger` 등) 포함 | 관련 차이(`recognized_right_away`,`needs_retry`,`easy_use`,`no_response`) 2개 이상 + 무관 미포함 | &nbsp; |
| A2 | 어려움 대상 식별 | `step3.person` (string) | null 또는 없음 | `'person_a'` 선택 | `'person_b'` 선택 | &nbsp; |
| B1 | 어려움 이유 선택 | `step3.reasons` (string[]) | 빈 배열 또는 없음 | 무관한 이유 선택 | `'not_recognized'`·`'needs_retry'`·`'hard_to_use'`·`'system_not_fit'` 중 1개 이상 + step2 선택과 정합 | &nbsp; |
| C1 | 배려 방법 선택 | `step4` (string[]) | 배열 없음 | `'change_color'`·`'make_bigger'`(무관) 포함 | 무관 옵션 미포함 + step3.reasons와 연결되는 적절한 방법 1개 이상 | &nbsp; |

**합산: \_\_ / 8 → 수준 \_\_**

---

### E-4-M · 공정성 점검단원 (3–4학년)

**역량 축**: A + B + C + D | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 불리 학생 식별 | `step1[caseId].judgment` (3개) | 미응답 또는 모두 `'user_a'` | 1개만 `'user_b'` | 3개 모두 `'user_b'` | &nbsp; |
| C1 | 공정성 판단 | `step2[caseId].fairness` (3개) | 미응답 또는 모두 `'okay'` | 1개만 `'unfair'` | 2–3개 `'unfair'` + step3 reasons와 정합 | &nbsp; |
| B1 | 원인 분석 | `step3[caseId].reasons` (string[], 3개) | 모든 케이스 빈 배열 | 1개 케이스에만 reason | 모든 케이스에 reason + 케이스별로 다른 reason | &nbsp; |
| D1 | 개선 제안 | `step4[caseId].text` (string, 3개) | 모든 케이스 빈칸 | 1개만 구체적 | 2개 이상 케이스에 구체 대안 (`대체 입력`·`사람 확인`·`데이터 다양화` 관련) | &nbsp; |
| D2 | 종합 의견 | `step5` (string) | 빈칸 또는 무관 | 한 관점(제작자 또는 사용자)만 서술 | AI 설계·사용 양 관점 통합 언급 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

### E-4-H · AI 공정성 자문위원 (5–6학년)

**역량 축**: A + B + C + D | **준거 5개 · 최대 10점**

| # | 준거 | JSON 필드 | 0 | 1 | 2 | 점수 |
|---|---|---|---|---|---|---|
| A1 | 문제 신호 포착 | `step2[caseId].judgment` (string, 4개) | 미응답 또는 1개 이하 | 2개 케이스에서 적합 신호 선택 | 3–4개 케이스에서 케이스별 다른 신호 구분 선택 | &nbsp; |
| C1 | 영향 대상·종류 판단 | `step3[caseId].judgment` + `.reasons[]` (4개) | 미응답 또는 모두 `'user_a'` | `'user_b'` 2개 이하 + reasons 없음 | 4개 중 3개 이상 `'user_b'` + 케이스별 영향 id 1개 이상 | &nbsp; |
| B1 | 문제 이유 서술 | `step4[caseId].reasons` (string[], 4개) | 모든 케이스 빈 배열 | 1–2개 케이스에만 reasons | 4개 모두 reasons 2개 이상 + `'cumulative_harm'`·`'unequal_opportunity'` 중 1개 이상 | &nbsp; |
| C2 | AI 수용 판단 서술 | `step5[caseId].text` (string, 4개) | 모든 케이스 빈칸 | 1–2개만 서술 | 3개 이상 케이스 + 개선 절차 또는 조건 1개 이상 | &nbsp; |
| D1 | 최종 자문 의견서 | `step6` (string) | 빈칸 또는 1–2문장 일반론 | 3문장 이상이나 관점 1개 | 3문장 이상 + 제작자·사용자 양 관점 + 구조적 원인·개선·지속 점검 중 2개 이상 | &nbsp; |

**합산: \_\_ / 10 → 수준 \_\_**

---

## 7. 역량 축 × 미션 카드 대응표

| 카드 | 준거 수 | A | B | C | D | 기대 수준 |
|---|---|---|---|---|---|---|
| E-1-L | 4 | A1 A2 | B1 B2 | — | — | 수준 2 |
| E-1-M | 4 | A1 | B1 B2 B3 | — | — | 수준 2–3 |
| E-1-H | 5 | A1 A2 | B1 | C1 | D1 | 수준 3 |
| E-2-L | 4 | A1 | B1 | C1 C2 | — | 수준 2 |
| E-2-M | 5 | A1 | B1 B2 | C1 C2 | — | 수준 2–3 |
| E-2-H | 4 | A1 | B1 | C1 | D1 | 수준 3 |
| E-3-L | 4 | A1⬩ A2 | B1⬩ B2 | — | — | 수준 2 |
| E-3-M | 4 | A1 | B1 B2 | C1 | — | 수준 2–3 |
| E-3-H | 4 | A1 | — | C1 | D1 D2 | 수준 3 |
| E-4-L | 4 | A1 A2 | B1 | C1 | — | 수준 2 |
| E-4-M | 5 | A1 | B1 | C1 | D1 D2 | 수준 2–3 |
| E-4-H | 5 | A1 | B1 | C1 C2 | D1 | 수준 3 |

*(⬩ 이진 준거: 0 또는 2만 사용)*

---


## 부록. inter-rater 신뢰도 프로토콜

1. **표본 크기**: 전체 학생 수의 20% 또는 최소 30케이스 (두 수 중 큰 값)
2. **독립성**: 두 코더가 서로의 결과를 모르는 상태에서 채점
3. **지표**: 준거별 Cohen's κ 및 전체 카드 수준 Cohen's κ 산출
4. **기준**: κ ≥ 0.70 합격. 미달 준거는 코딩 기준 보완 후 재훈련
5. **조정**: 불일치 케이스는 두 코더 협의 + 제3자 결정으로 처리
6. **기록**: κ 값을 연구 보고서 부록에 표로 제시 (준거별)

---
