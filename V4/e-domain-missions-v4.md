# E영역 V4 미션 카드 묶음 (E-1-L ~ E-4-H)

시나리오 기반 수행평가 버전. 각 카드는 `src/data/missionsV4/E-*.js`에서 추출한 것으로, 학생이 실제로 수행하는 흐름과 Supabase(`mission_submissions_v4` 테이블)에 저장되는 응답 JSON 구조를 함께 수록한다.

**공통 저장 스키마** — `mission_submissions_v4` 테이블:
```
user_id          text
mission_code     text   (e.g. 'E-1-L')
grade_band       text   ('L' | 'M' | 'H')
domain           text   ('Engaging')
performance_type text   ('TD' | 'SJ')
answers          jsonb  ← 카드별 예시에 수록
started_at       timestamptz
submitted_at     timestamptz
completed        boolean
```

`answers` jsonb의 공통 필드: `step1…stepN`(원천 응답), `stepN_other_text`(기타 자유입력), `step_schema`(step 해석 메타), `step_trace`(완료/힌트/체류시간), `hint_used`, `time_spent_sec`, `artifact`(치환 산출 문장), `artifact_binding_key`.

---

## E-1 | 생활 속 AI 찾기

### E-1-L (1–2학년) · AI 탐정단원

**AI 리터러시 역량 매칭 (KSA)**
- K1.4 · 목적에 따른 작동 방식의 차이 — AI가 창작·예측·추천·응답 등 목적에 따라 다르게 작동함을 구별
- S · Self and Social Awareness (자기 및 사회적 인식) — AI가 일상에 미치는 영향을 알아차림
- A · Curious (호기심) — 주변에서 AI를 찾는 탐구 태도

**측정 목표** — 생활 속 사물·앱 중에서 **"스스로 알아보거나 판단·반응하는 것이 AI"**라는 기초 분별 능력을 갖추고, 최소 1개의 AI를 자기 맥락(집/학교 등)에서 찾아 기능과 장소를 기록할 수 있는가.

**시나리오** — 역할: AI 탐정단원 / 목표: 생활 장면에서 AI를 직접 찾아 탐정 카드를 완성 / 맥락: 우리 반이 "생활 속 AI 지도"를 만든다 / 산출물: 탐정 카드

**수행 절차**
- STEP 1 · 예시 살펴보기 (`choice_cards`): 로봇청소기·음성비서·추천영상·얼굴인식·계산기·전등 중 AI로 보이는 것 고르기 (복수 선택)
- STEP 2 · 내 주변에서 찾기 (`photo_or_card_select`, step1 하이라이트): 사진 촬영 또는 6종 카드 중 선택
- STEP 3 · 장소 기록 (`single_select_buttons`): 집/학교/길/자동차/가게/기타
- STEP 4 · 도움 기능 기록 (`single_select_buttons`): 알아보기/추천/말해주기/청소/길안내/기타

**산출 문장** — `"나는 {step3}에서 {step2}를 찾았어요. 이 AI는 {step4}를 해줘요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": ["robot_vacuum", "voice_assistant", "face_unlock"],
  "step2": "home_robot_cleaner",
  "step3": "home",
  "step4": "clean",
  "step_schema": [
    {"step_id":"step1","title":"STEP 1 · 예시 살펴보기","ui_mode":"choice_cards","question":"AI가 들어 있을 것 같은 것은 무엇인가요?","hint":"..."},
    {"step_id":"step2","title":"STEP 2 · 내 주변에서 찾기","ui_mode":"photo_or_card_select"},
    {"step_id":"step3","title":"STEP 3 · 장소 기록하기","ui_mode":"single_select_buttons"},
    {"step_id":"step4","title":"STEP 4 · 도움 기능 기록하기","ui_mode":"single_select_buttons"}
  ],
  "step_trace":[{"step":"step1","completed":true,"hint_used":false,"time_spent_sec":22}],
  "hint_used": {"step1": false, "step2": true},
  "time_spent_sec": {"step1": 22, "step2": 41, "step3": 8, "step4": 11},
  "artifact": "나는 집에서 home_robot_cleaner를 찾았어요. 이 AI는 clean를 해줘요.",
  "artifact_binding_key": "e_1_l_report"
}
```

---

### E-1-M (3–4학년) · AI 소개 기자

**KSA 매칭**
- K1.4 · 목적에 따른 작동 방식의 차이 — 기기마다 알아보기/추천/번역 등 서로 다른 AI 작동 방식 식별
- S · Self and Social Awareness — 우리 생활 속 AI 역할을 설명
- A · Curious — 직접 취재하며 AI를 탐구

**측정 목표** — 일상 기기·앱 가운데 **AI가 "어떤 일"(인식/추천/번역/자동 움직임 등)을 수행하는지 구분**하고, "왜 AI라 판단했는지"를 자기 언어로 1~2문장 설명할 수 있는가.

**시나리오** — 역할: AI 소개 기자 / 목표: AI 기기·앱을 취재해 소개 기사 카드를 완성 / 맥락: 학교 홈페이지 "우리 주변의 AI 소개판" 제작 / 산출물: AI 소개 기사 카드

**수행 절차**
- STEP 1 · 취재 대상 선정 (`choice_cards`): 6종 중 AI 후보 고르기
- STEP 2 · 현장 취재 (`photo_or_card_select`, step1 하이라이트)
- STEP 3 · AI가 하는 일 (`single_select_buttons`): 알아보기/추천/말 알아듣기/길 안내/번역/자동 움직임/기타
- STEP 4 · AI인 이유 한 문장 (`free_text`)
- STEP 5 · 소개 문장 완성 (`free_text`): "이 기술은 ___에서 쓰이고, 사람을 ___ 도와줘요."

**산출 문장** — `"{step2}는 {step3}를 해주는 AI예요. {step4} {step5}"`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": ["robot_vacuum", "translate_app", "recommend_feed"],
  "step2": "translate_app2",
  "step3": "translate",
  "step4": "내가 말한 한국어를 바로 영어로 바꿔주기 때문에 AI라고 생각해요.",
  "step5": "이 기술은 스마트폰에서 쓰이고, 사람을 외국어로 대화하도록 도와줘요.",
  "step_schema": [{"step_id":"step1","ui_mode":"choice_cards"}, "..."],
  "artifact": "translate_app2는 translate를 해주는 AI예요. 내가 말한 한국어를 바로 영어로 바꿔주기 때문에 AI라고 생각해요. 이 기술은 스마트폰에서 쓰이고, 사람을 외국어로 대화하도록 도와줘요.",
  "artifact_binding_key": "e_1_m_article"
}
```

---

### E-1-H (5–6학년) · AI 전시 큐레이터

**KSA 매칭**
- K1.4 · 목적에 따른 작동 방식의 차이 — AI/비AI 구별 기준 수립
- S · Self and Social Awareness — 겉보기 유사하지만 다른 기술을 자기 기준으로 판정
- A · Curious — 경계 사례를 탐구

**측정 목표** — "전자기기 = AI"라는 오개념을 넘어 **학습·예측·추천·상황 적응 등 판단 기준을 명시적으로 세우고**, 자동문·스팸 필터 같은 경계 사례에 적용·설명할 수 있는가.

**시나리오** — 역할: AI 전시 큐레이터 / 목표: 기술을 AI/비AI/애매함으로 분류하고 전시 기준 카드 완성 / 맥락: 학교 디지털 전시 "이것도 AI일까?" / 산출물: 전시 기준 카드

**수행 절차**
- STEP 1 · 기술 카드 분류 (`classify_cards_carousel`): 8개 기술(계산기·얼굴인식·로봇청소기·추천영상·자동문·내비·번역·알람시계)을 AI있음/AI없음/애매함
- STEP 2 · 전시 기준 세우기 (`multi_select_chips`, 최소 2개): 알아본다/추천/상황 반응/정해진 실행/예측/학습/학습 안함/센서 반응/맥락 파악/기타
- STEP 3 · 경계 사례 심사 (`per_case_judge`, step2 기준 참조 고정): 자동문·단순 검색·스마트 온도조절기·스팸 필터에 대한 AI/비AI/애매 + 이유 서술
- STEP 4 · 전시 기준 카드 문장화 (`free_text`)

**산출 문장** — `"우리는 AI를 {step4}할 때 AI라고 본다."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": {
    "calculator": "non_ai", "face_unlock": "ai", "robot_vacuum": "ai",
    "recommend_video": "ai", "auto_door": "unclear", "navigation": "ai",
    "translate_app": "ai", "alarm_clock": "non_ai"
  },
  "step2": ["learns", "predicts", "adapts"],
  "step3": {
    "auto_door":        {"judgment":"non_ai", "text":"센서로 열리기만 하고 학습하지 않아서요."},
    "basic_search":     {"judgment":"non_ai", "text":"내 습관을 학습하지 않으니까요."},
    "smart_thermostat": {"judgment":"unclear","text":"패턴을 일부 기억하지만 완전히 학습하는지 모르겠어서요."},
    "spam_filter":      {"judgment":"ai",     "text":"사용자 피드백으로 학습하니까요."}
  },
  "step4": "스스로 데이터를 학습하고 상황에 따라 다르게 판단",
  "artifact": "우리는 AI를 스스로 데이터를 학습하고 상황에 따라 다르게 판단할 때 AI라고 본다.",
  "artifact_binding_key": "e_1_h_criteria_card"
}
```

---

## E-2 | AI 답, 믿어도 될까?

### E-2-L (1–2학년) · AI 답 점검 도우미

**KSA 매칭**
- K4.3 · 생성형 AI로 인한 사실과 허구의 혼동 위험 — AI 답 중 틀린 사실 식별
- K4.4 · (프로젝트 확장 코드) AI 답의 불확실성 이해 *※ 원본 K4는 K4.1–K4.3. K4.4는 본 커리큘럼에서 "AI 답을 무조건 믿지 않는 태도"를 지칭하는 확장 코드로 사용*
- S · Critical Thinking (비판적 사고) — AI 답과 내가 아는 사실을 대조
- A · Responsible (책임감) — 틀린 답을 그대로 공유하지 않음

**측정 목표** — AI가 내놓은 단순 상식 답을 **그대로 받아들이지 않고 "맞다/이상하다"로 판단**한 뒤, 책/어른/검색 등 **외부 확인 수단을 선택**해 검증 후 공개 여부를 결정할 수 있는가 (환각 현상의 초보적 인지).

**시나리오** — 역할: AI 답 점검 도우미 / 목표: AI 상식 카드 중 이상한 답을 찾아 게시판 붙이기/보류 결정 / 맥락: 과학 게시판 "AI가 알려 준 상식 카드" / 산출물: 게시판 붙이기/보류 결정

**수행 절차**
- STEP 1 · 이상한 답 찾기 (`judge_qa_carousel`): 6장의 Q/A 카드(바나나/고양이 다리/사과 나무/강아지 날개/지구 공전/얼음 온도) — 맞는 답/이상한 답 + 이유(틀린 사실/앞뒤 안맞음/불가능)
- STEP 2 · 확인 방법 고르기 (`choice_cards`): 책/어른/인터넷/그대로 사용(오답)
- STEP 3 · 게시판 붙이기 결정 (`card_drop_board`, step1 카드 전체): 바로/확인 후/안 붙임

**산출 문장** — `"이상한 답 {step1_strange_count}개를 찾았고, 카드별로 {step3} 결정을 내렸어요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": {
    "q1": {"judge":"correct"},
    "q2": {"judge":"strange", "reason":"wrong_fact"},
    "q3": {"judge":"correct"},
    "q4": {"judge":"strange", "reason":"impossible"},
    "q5": {"judge":"strange", "reason":"wrong_fact"},
    "q6": {"judge":"strange", "reason":"contradicts_itself"}
  },
  "step2": ["check_book", "ask_adult", "search_internet"],
  "step3": {
    "q1": {"judgment":"post"},
    "q2": {"judgment":"skip"},
    "q3": {"judgment":"post"},
    "q4": {"judgment":"skip"},
    "q5": {"judgment":"verify"},
    "q6": {"judgment":"skip"}
  },
  "artifact": "이상한 답 4개를 찾았고, 카드별로 2개 바로 붙여요, 1개 확인 후 붙여요, 3개 안 붙여요 결정을 내렸어요.",
  "artifact_binding_key": "e_2_l_board_decision"
}
```

---

### E-2-M (3–4학년) · AI 대화 검토자

**KSA 매칭**
- K4.3 · 생성형 AI의 사실/허구 혼동 위험 — AI 대화 속 환각 식별
- K4.4 · AI 답의 불확실성 이해 (확장)
- S · Critical Thinking — 과장·미증명 주장 식별, 확인 질문 생성
- A · Responsible — 틀린 정보를 그대로 전파하지 않음

**측정 목표** — AI 대화의 말풍선에서 **사실 오류·미증명 주장을 구분**하고, 의심 부분에 대해 **"정말 그런가요?/근거가 있나요?" 같은 확인(재질문) 질문을 스스로 생성**한 뒤 사용/보류를 판정할 수 있는가.

**시나리오** — 역할: AI 대화 검토자 / 목표: 대화 속 틀린 말풍선을 찾고 확인 질문 생성 후 사용/보류 결정 / 맥락: 학생 기자단의 우주 카드뉴스 / 산출물: 사용/보류 정리표

**수행 절차**
- STEP 1 · 대화 읽기 (`chat_display`): 학생-AI 13개 말풍선(수성·금성·달 공전·명왕성·중력·블랙홀)
- STEP 2 · 의심 말풍선 선택 + 이유 (`bubble_select_correct`): 사실이 틀렸어요 / 확인되지 않은 것을 사실처럼 말했어요
- STEP 3 · 확인 질문 만들기 (`followup_question_carousel`, step2 의심분만 필터)
- STEP 4 · 사용/보류 결정 (`per_case_judge`, step2 전체): 사용/확인 후 사용
- STEP 5 · 유의할 점 정리 (`multi_select_chips`)

**산출 문장** — `"의심 말풍선 {step2_strange_count}개를 찾았고, 확인 질문을 만들었어요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step2": {
    "a1": {"selected":false},
    "a2": {"selected":false},
    "a3": {"selected":true,  "reason":"wrong_fact"},
    "a4": {"selected":false},
    "a5": {"selected":false},
    "a6": {"selected":true,  "reason":"not_proven"}
  },
  "step3": {
    "a3": "달이 지구를 한 바퀴 도는 데 정확히 몇 시간이 걸리는지 과학 교과서에서 확인할 수 있나요?",
    "a6": "블랙홀 안에 또 다른 우주가 존재한다는 것이 어떤 연구에서 증명됐는지 출처를 알려줄 수 있나요?"
  },
  "step4": {
    "a1":{"judgment":"use"}, "a2":{"judgment":"use"},
    "a3":{"judgment":"hold"},"a4":{"judgment":"use"},
    "a5":{"judgment":"use"}, "a6":{"judgment":"hold"}
  },
  "step5": ["can_be_wrong","verify_facts","ask_source","ask_followup"],
  "artifact": "의심 말풍선 2개를 찾았고, 확인 질문을 만들었어요.",
  "artifact_binding_key": "e_2_m_use_hold_map"
}
```

---

### E-2-H (5–6학년) · 학급 신문 편집장

**KSA 매칭**
- K4.3 · 사실/허구 혼동 위험
- K4.4 · AI 답 불확실성 (확장)
- S · Critical Thinking — 수용/수정/재검증 3단 판정
- A · Responsible — 최종 게재 책임은 사람에게

**측정 목표** — AI 답을 "맞다/틀리다"를 넘어 **수용·수정·재검증의 3단계로 판정**하고, 각 판정에 **근거(사실 오류/미증명/부분 오류/출처 없음/오해 소지)와 실행 계획(무엇으로 어떻게 확인할지)을 명시**해 독립적 사실 확인을 수행할 수 있는가.

**시나리오** — 역할: 학급 신문 편집장 / 목표: AI 기사 초안을 수용·수정·재검증으로 판정하고 편집 지시서 발행 / 맥락: 학급 디지털 자료집 / 산출물: 편집 지시서

**수행 절차**
- STEP 1 · 기사 초안 읽기 (`monitor_display`): 5건(광합성·세종대왕·독도·달 공전·블랙홀)
- STEP 2 · 편집 판정 (`per_response_judge`): 수용/수정/재검증
- STEP 3 · 편집 이유 표시 (`filtered_reason_select`, revise/verify만): 틀림/미증명/부분오류/출처없음/오해소지/기타
- STEP 4 · 편집 지시서 작성 (`filtered_plan_text`): 사례별 수정·확인 계획
- STEP 5 · 편집장 최종 메모 (`free_text`)

**산출 문장** — `"수정·재검증 대상 {step2_non_use_count}건에 편집 지시서를 발행했어요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step2": {
    "s1":{"judgment":"use"},
    "s2":{"judgment":"revise"},
    "s3":{"judgment":"use"},
    "s4":{"judgment":"verify"},
    "s5":{"judgment":"revise"}
  },
  "step3": {
    "s2": {"reason":"wrong_fact"},
    "s4": {"reason":"partly_wrong"},
    "s5": {"reason":"not_proven"}
  },
  "step4": {
    "s2":"세종대왕이 만든 발명품은 측우기·앙부일구 등으로 바로잡고 '컴퓨터 발명' 주장은 삭제한다.",
    "s4":"달의 공전 주기(약 27.3일)를 과학 교과서에서 확인해 수정한다.",
    "s5":"블랙홀 내부에 관한 주장을 빼고 '아직 관측 불가' 문장으로 대체한다."
  },
  "step5":"AI 답은 빠르지만 사실 여부는 반드시 교과서·공식 자료로 확인하고 출처가 없는 주장은 게재하지 않는다.",
  "artifact":"수정·재검증 대상 3건에 편집 지시서를 발행했어요.",
  "artifact_binding_key":"e_2_h_editor_directive"
}
```

---

## E-3 | 왜 나한테 이걸 보여줄까?

### E-3-L (1–2학년) · AI 추천 탐험가

**KSA 매칭**
- K1.1 · 알고리즘과 통계적 추론의 결합 — 내 응답에서 패턴을 찾아 추천이 나옴을 체험
- K5.1 · 사회적 의사결정에서의 널리 쓰이는 역할 — 추천이 일상 곳곳에 쓰임
- S · Self and Social Awareness — 추천이 내 선택과 연결됨을 자각
- A · Curious — "왜 이게 나왔지?"를 탐험

**측정 목표** — 추천이 **우연이 아니라 내 선택·응답에서 비롯된 결과**임을 알아차리고, 내 예/아니오 응답과 추천 결과 사이의 **공통 특징(귀여움·빠름·물에서 사는 등)을 자기 말로 연결**할 수 있는가.

**시나리오** — 역할: AI 추천 탐험가 / 목표: 주제·응답 → 추천 결과의 연결을 찾아 탐험 카드 기록 / 맥락: 작은 추천 화면 체험 / 산출물: 추천 탐험 카드

**수행 절차**
- STEP 1 · 주제 고르기 (`single_select_cards`): 동물/요리/탈것
- STEP 2 · 예/아니오 질문 10개 답변 (`yesno_quiz`, 주제별 분기)
- STEP 3 · 추천 결과 확인 (`recommendation_reveal`, 매칭 규칙 기반)
- STEP 4 · 추천 이유 쓰기 (`free_text`)

**산출 문장** — `"주제 "{step1}"를 골라 질문 {step2_answered_count}개에 답하고, 추천 결과에 대한 내 이유를 적었어요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": "animal",
  "step2": {
    "q1": true,  "q2": false, "q3": false, "q4": true,  "q5": true,
    "q6": false, "q7": false, "q8": true,  "q9": true,  "q10": false
  },
  "step3": {
    "recommended": [
      {"id":"rabbit","label":"토끼","matchedTags":["cute","small","pet","quiet","not_scary"]},
      {"id":"cat",   "label":"고양이","matchedTags":["cute","fluffy","pet","quiet"]}
    ]
  },
  "step4": "귀엽고 집에서 키울 수 있고 조용한 동물을 좋아한다고 답해서 토끼랑 고양이가 추천된 것 같아요.",
  "artifact":"주제 \"animal\"를 골라 질문 10개에 답하고, 추천 결과에 대한 내 이유를 적었어요.",
  "artifact_binding_key":"e_3_l_recommendation_card"
}
```

---

### E-3-M (3–4학년) · 쇼핑몰 취향 분석가

**KSA 매칭**
- K1.1 · 알고리즘과 통계적 추론 — 별점 데이터 → 태그 가중치 → 추천
- K2.3 · 상호작용을 통한 실시간 데이터 수집 — 내 별점이 추천을 즉시 바꿈
- K5.1 · 사회적 의사결정에서의 역할 — 추천이 내 구매 선택에 영향
- S · Self and Social Awareness — 내 행동이 알고리즘에 반영됨을 인식
- A · Curious — 내 별점이 추천을 바꾸는 과정 탐구

**측정 목표** — 내 **평가(별점) 패턴이 추천 결과를 실시간으로 바꾼다**는 것을 체감하고, 높게 평가한 옷과 추천 TOP 3의 **공통 속성(색/스타일/계절)을 언어화**하며 **추천이 다음 선택에 미치는 영향(필터 버블)을 예견**할 수 있는가.

**시나리오** — 역할: 쇼핑몰 취향 분석가 / 목표: 옷 20종 별점 → 추천 TOP 3 변화 분석 / 맥락: 작은 쇼핑몰 앱 / 산출물: 취향 분석 리포트

**수행 절차**
- STEP 1 · 옷 20종 둘러보기 (`clothing_grid_with_rec`, 초기 추천 TOP 3)
- STEP 2 · 별점 주기 (`star_rating_carousel`, 1–5점, 최소 10개)
- STEP 3 · AI 추천 TOP 3 확인 (`recommendation_grid`, 태그 매칭)
- STEP 4 · 3개 질문 자유 서술 (`multi_free_text`): 좋아한 특징 / 추천과의 공통점 / 다음 선택에 미칠 영향

**산출 문장** — `"옷 {step2_rated_count}개에 별점을 주고, AI 추천 TOP 3의 이유와 영향을 분석했어요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step2": {
    "cloth_01":5,"cloth_03":5,"cloth_07":4,"cloth_09":5,"cloth_11":5,
    "cloth_13":3,"cloth_14":4,"cloth_18":5,"cloth_19":5,
    "cloth_02":1,"cloth_06":2,"cloth_17":2
  },
  "step3": {
    "top3": [
      {"id":"cloth_11","label":"라벤더 플리츠 치마","reasons":["cute_style","pastel_color"]},
      {"id":"cloth_07","label":"연분홍 모자","reasons":["cute_style","pastel_color"]},
      {"id":"cloth_19","label":"분홍 스니커즈","reasons":["cute_style","pastel_color"]}
    ],
    "topTags":["cute_style","pastel_color"]
  },
  "step4": {
    "q1":"파스텔·밝은 색에 귀여운 스타일의 옷을 주로 좋아했어요.",
    "q2":"추천 TOP 3도 모두 파스텔 색에 귀여운 스타일이라는 공통점이 있었어요.",
    "q3":"비슷한 색·스타일만 계속 추천되어 스포티한 옷 같은 다른 종류를 놓칠 수 있어요."
  },
  "artifact":"옷 12개에 별점을 주고, AI 추천 TOP 3의 이유와 영향을 분석했어요.",
  "artifact_binding_key":"e_3_m_taste_report"
}
```

---

### E-3-H (5–6학년) · 추천 사용 컨설턴트

**KSA 매칭**
- K1.1 · 알고리즘과 통계적 추론
- K5.1 · 사회적 의사결정에서의 역할 — 뉴스·쇼핑·영상 추천의 사회적 영향
- S · Self and Social Awareness + Critical Thinking — 추천의 장단점을 사례별로 비판
- A · Curious / Responsible — 주도적 활용 원칙 수립

**측정 목표** — 4개 사례(학습·게임 루프·쇼핑·뉴스 에코챔버)에서 **추천이 이어진 원인**을 분석하고, **도움/조심/둘 다**를 판별해 **장점과 한계를 모두 언급**하며, **자기 주도적 사용 원칙 3가지**를 세울 수 있는가 (필터 버블·에코챔버 인식).

**시나리오** — 역할: 추천 사용 컨설턴트 / 목표: 추천 사례 4개 분석 + 사용 원칙 가이드 / 맥락: 영상·쇼핑·뉴스 앱 추천 / 산출물: 추천 사용 가이드

**수행 절차**
- STEP 1 · 추천 사례 분석 (`case_carousel_reason`): 과학 발표·게임 루프·운동화 쇼핑·뉴스 에코챔버 — 이유 고르기
- STEP 2 · 판단 + 장단점 (`per_case_judge`, step1 이어짐): 도움/조심/둘 다 + 장점/아쉬운 점
- STEP 3 · 주도적 활용 방법 (`free_text`)
- STEP 4 · 나의 사용 원칙 3가지 (`multi_free_text`)

**산출 문장** — `"추천 사례 {step1_case_count}개를 분석하고, 주도적 사용 원칙 3가지를 가이드에 담았어요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": {
    "case_1":{"reason":"similar_topic"},
    "case_2":{"reason":"frequency_time"},
    "case_3":{"reason":"selection_pattern"},
    "case_4":{"reason":"selection_pattern"}
  },
  "step2": {
    "case_1":{"judgment":"helpful","plan":["find_fast","collect_easy"]},
    "case_2":{"judgment":"careful","limitation":["similar_only","miss_new"]},
    "case_3":{"judgment":"both","plan":["find_fast"],"limitation":["similar_only"]},
    "case_4":{"judgment":"careful","limitation":["narrow_view","miss_new"]}
  },
  "step3":"추천은 빠르게 참고하되, 다른 관점의 자료를 내가 직접 찾아 비교한 뒤에 결정하겠어요.",
  "step4": {
    "p1":"추천은 참고만 하고, 새로운 것도 스스로 찾아본다.",
    "p2":"한쪽으로 쏠린다 싶으면 반대 관점의 자료를 일부러 찾아본다.",
    "p3":"추천받은 것만 고르지 않고 여러 개를 비교해 결정한다."
  },
  "artifact":"추천 사례 4개를 분석하고, 주도적 사용 원칙 3가지를 가이드에 담았어요.",
  "artifact_binding_key":"e_3_h_recommendation_guide"
}
```

---

## E-4 | 모두에게 똑같이 잘할까?

### E-4-L (1–2학년) · AI 배려 관찰자

**KSA 매칭**
- K2.5 · AI에 내재된 편향성 — 같은 AI도 사람에 따라 다르게 작동함을 목격
- K5.4 · 윤리적인 AI 설계 원칙 — 공정성·대체 방법의 필요
- S · Critical Thinking — "왜 한쪽만 불편한가"를 판단
- A · Empathetic (공감) — 다른 사람의 경험을 살핌

**측정 목표** — 같은 AI 기술이라도 **누군가에게는 더 어렵게 작동할 수 있음(편향의 초보적 체감)**을 알아차리고, 이유를 골라내어 **모두가 잘 쓰기 위한 배려 방법(대체 입력·재시도 등)**을 제안할 수 있는가.

**시나리오** — 역할: AI 배려 관찰자 / 목표: 두 사람의 AI 경험 차이를 관찰하고 배려 방법 찾기 / 맥락: 학교 체험관 / 산출물: 배려 관찰 기록

**수행 절차**
- STEP 1 · 두 사람 장면 보기 (`case_view_carousel`): AI 장난감·얼굴 인식 문·AI 스피커
- STEP 2 · 다른 점 찾기 (`choice_cards`): 반응 속도/재시도/기계 차이/쉬움/어려움/장소/반응 없음/옷 색깔
- STEP 3 · 더 어려운 사람 + 이유 (`person_reason_select`, 이유 랜덤)
- STEP 4 · 배려 방법 (`choice_cards`, step3 이유에 따라 우선 표시)

**산출 문장** — `"저는 {step3_person} 쪽이 이 기술을 쓰기 더 어렵다고 생각했어요. 왜냐하면 {step3_reasons}라고 생각했기 때문이에요. 그래서 {step4}."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": ["case_a","case_b","case_c"],
  "step2": ["recognized_right_away","needs_retry","hard_use","no_response"],
  "step3": {"person":"person_b","reasons":["not_recognized","needs_retry"]},
  "step4": ["button_option","different_way_to_use"],
  "artifact":"저는 여러 번 시도한 사람 쪽이 이 기술을 쓰기 더 어렵다고 생각했어요. 왜냐하면 기계가 잘 알아듣지 못해서, 여러 번 해도 잘 안 돼서라고 생각했기 때문이에요. 그래서 버튼도 같이 있으면 좋겠어요, 말하기 말고 다른 방법도 있으면 좋겠어요.",
  "artifact_binding_key":"e_4_l_support_log"
}
```

---

### E-4-M (3–4학년) · 공정성 점검단원

**KSA 매칭**
- K2.5 · AI에 내재된 편향성 — 학교 AI 서비스의 불평등한 결과 식별
- K5.4 · 윤리적인 AI 설계 원칙 — 공정성 판단
- S · Critical Thinking — 결과의 공정성 판정
- A · Empathetic — 불리한 학생의 입장에서 생각

**측정 목표** — 학교 AI 서비스 3개(얼굴 인식 출입·음성 숙제 찾기·읽어주기)에서 **누가 불리한지, 결과가 공정한지, 왜 그런 차이가 생기는지**를 사례별로 판단하고, **구체적인 개선 제안을 사례별로 서술**할 수 있는가.

**시나리오** — 역할: 공정성 점검단원 / 목표: 학교 AI 서비스 사례에서 불리한 학생을 찾고 개선 제안 작성 / 맥락: 학교 AI 서비스 / 산출물: 공정성 의견서

**수행 절차**
- STEP 1 · 불리한 학생 찾기 (`case_judge_carousel`): 3개 사례에서 학생 A/B 중 선택
- STEP 2 · 공정성 판단 (`case_judge_carousel`, step1 이어짐): 공정/불공정
- STEP 3 · 이유 (`case_judge_carousel`, 다중): 인식 부족/반영 부족/동일 방식 부적합/상황 미고려
- STEP 4 · 개선 제안 작성 (`case_judge_carousel` + `allowText`): 사례별 텍스트
- STEP 5 · 내 생각 정리 (`free_text`)

**산출 문장** — `"학교에서 쓰는 AI 서비스 3개를 살펴보니, 그중 {step2_unfair_count}개가 공정하지 않다고 느꼈어요. 더 공정하게 바꾸려면 {step4_proposals}처럼 바뀌면 좋겠다고 생각했습니다. 그래서 저는 AI가 모두에게 공정한 기술이 되기 위해서는 {step5}라고 생각해요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step1": {
    "face_recognition":{"judgment":"user_b"},
    "voice_recognition":{"judgment":"user_b"},
    "auto_reading":{"judgment":"user_b"}
  },
  "step2": {
    "face_recognition":{"judgment":"unfair"},
    "voice_recognition":{"judgment":"unfair"},
    "auto_reading":{"judgment":"okay"}
  },
  "step3": {
    "face_recognition":{"reasons":["not_recognized","not_reflected"]},
    "voice_recognition":{"reasons":["not_reflected","same_way_not_fit"]},
    "auto_reading":{"reasons":["not_considered"]}
  },
  "step4": {
    "face_recognition":{"text":"얼굴이 인식되지 않을 때 학생증 카드로도 입장할 수 있게 대체 방법을 제공한다."},
    "voice_recognition":{"text":"음성 인식 실패 시 텍스트 입력으로 숙제를 검색할 수 있게 한다."},
    "auto_reading":{"text":"읽기 속도를 학생이 직접 조절할 수 있도록 설정을 제공한다."}
  },
  "step5":"AI는 다양한 목소리·얼굴·상황을 학습해야 하고, 대체 방법도 함께 제공해 누구도 배제되지 않게 만들어야 해요.",
  "artifact":"학교에서 쓰는 AI 서비스 3개를 살펴보니, 그중 2개가 공정하지 않다고 느꼈어요. 더 공정하게 바꾸려면 ...처럼 바뀌면 좋겠다고 생각했습니다. 그래서 저는 AI가 모두에게 공정한 기술이 되기 위해서는 ...라고 생각해요.",
  "artifact_binding_key":"e_4_m_fairness_opinion"
}
```

---

### E-4-H (5–6학년) · AI 공정성 자문위원

**KSA 매칭**
- K2.5 · AI에 내재된 편향성
- K5.4 · 윤리적인 AI 설계 원칙 — 공정성·투명성·대체 수단
- S · Critical Thinking — 4개 장면에서 영향·원인·해결을 종합 판단
- A · Empathetic — 반복되는 불이익의 누적적 영향 고려

**측정 목표** — 4개 놀이공원 AI 장면에서 **문제 신호, 영향받는 사람과 영향, 문제 이유**를 구조적으로 판별하고, **개선 과정과 최종 자문 의견서(3–5문장)**를 작성해 **편향이 누적되면 기회 불평등으로 이어질 수 있음**을 설명할 수 있는가.

**시나리오** — 역할: AI 공정성 자문위원 / 목표: 4개 장면 점검 후 자문 의견서 제출 / 맥락: 놀이공원 운영팀 자문 요청 / 산출물: 최종 자문 의견서

**수행 절차**
- STEP 1 · 4개 장면 보기 (`case_view_carousel`): 입장 게이트·놀이기구 추천·길찾기 키오스크·공연 자막
- STEP 2 · 문제 신호 찾기 (`case_judge_carousel`, step1 이어짐): 대기/결과/선택폭/즐거움
- STEP 3 · 영향받는 사람 + 영향(다중) (`case_judge_carousel`)
- STEP 4 · 왜 문제인지 (`case_judge_carousel`, 다중): 같은 서비스 다른 결과/반복 실패/기회 불평등/정보·즐길 거리 부족/누적 손해
- STEP 5 · 개선 과정 서술 (`case_judge_carousel` + `allowText`)
- STEP 6 · 최종 자문 의견서 (`free_text`, 3–5문장)

**산출 문장** — `"놀이공원의 AI 서비스 4개 장면을 살펴본 결과, 방문객마다 같은 서비스에서도 다른 결과를 겪고 있다는 것을 확인했어요. 더 공정한 AI가 되려면 {step5_proposals}처럼 개선되어야 한다고 생각합니다. 그래서 자문위원으로서 저는 {step6}라고 제안해요."`

**Supabase `answers` 예시 JSON**
```json
{
  "step2": {
    "scene1_gate":{"judgment":"wait_longer"},
    "scene2_recommendation":{"judgment":"fewer_choices"},
    "scene3_kiosk":{"judgment":"worse_result"},
    "scene4_performance":{"judgment":"less_enjoyment"}
  },
  "step3": {
    "scene1_gate":{"judgment":"user_b","reasons":["wait_longer","feel_bad"]},
    "scene2_recommendation":{"judgment":"user_b","reasons":["less_variety"]},
    "scene3_kiosk":{"judgment":"user_b","reasons":["late_arrival","less_play_time"]},
    "scene4_performance":{"judgment":"user_b","reasons":["miss_performance","feel_bad"]}
  },
  "step4": {
    "scene1_gate":{"reasons":["same_service_diff_result","cumulative_harm"]},
    "scene2_recommendation":{"reasons":["unequal_opportunity","less_info_fun"]},
    "scene3_kiosk":{"reasons":["same_service_diff_result","repeat_failure"]},
    "scene4_performance":{"reasons":["less_info_fun","unequal_opportunity"]}
  },
  "step5": {
    "scene1_gate":{"text":"다양한 얼굴 데이터를 학습시키고, 실패 시 카드·번호 입력 등 대체 수단을 제공한다."},
    "scene2_recommendation":{"text":"다양한 장르의 놀이기구를 섞어 추천하고, 새로운 경험을 권하는 옵션을 제공한다."},
    "scene3_kiosk":{"text":"안내 정확도를 지속 점검하고, 직원 도움 요청 버튼을 함께 둔다."},
    "scene4_performance":{"text":"자막·음성·수어 등 다양한 안내 방식을 동시에 제공한다."}
  },
  "step6":"AI는 편리해 보여도 누군가에게는 반복적으로 불리하게 작동할 수 있습니다. 운영팀은 다양한 사용자 데이터를 학습시키고, 실패 시 대체 수단을 반드시 함께 제공해야 합니다. 같은 서비스라도 결과가 사람마다 다른 점을 꾸준히 감사·개선할 것을 자문합니다.",
  "artifact":"놀이공원의 AI 서비스 4개 장면을 살펴본 결과, ... 더 공정한 AI가 되려면 ...처럼 개선되어야 한다고 생각합니다. 그래서 자문위원으로서 저는 ...라고 제안해요.",
  "artifact_binding_key":"e_4_h_advisory_opinion"
}
```

---

## 공통 인터페이스 주석

- `scenario`: 역할·목표·맥락·산출물 명칭
- `branch`: step 간 데이터 연동 — `sourceStepId` + `filterBy` + `mode`(filter/highlight/restrict)
- `uiMode`: 렌더러가 해석하는 UI 타입(`choice_cards`, `case_judge_carousel`, `free_text`, `star_rating_carousel` 등)
- `submit.artifact.template`: 학생 응답을 토큰으로 조립해 산출 문장 생성. `{stepN_<judge>_count}` 같은 계산 토큰 지원
- 라우팅: `/mission/E-{n}/{lower|middle|upper}` (V4 등록 미션은 자동으로 V4 러너로 진입)
- 저장 위치: `mission_submissions_v4` (user_id × mission_code upsert)
