/**
 * LearnAILIT V4 · D-2 AI에게 어떤 예시를 줄까?
 * 시나리오 기반 수행 평가 — Designing AI
 *
 * [Designing 핵심]: 훈련 데이터의 구성이 AI 결과에 미치는 영향을 직접 탐색
 * 학생이 AI에게 줄 예시 데이터를 직접 구성·조작하고,
 * 데이터 품질이 AI 성능에 어떤 차이를 만드는지 실험한다.
 */

export const D2_V4_SCENARIO = {
  meta: {
    code: "D-2",
    title: "AI에게 어떤 예시를 줄까?",
    domain: "Designing"
  },

  grades: {

    // =====================================================================
    // D-2-L | 저학년 (1~2학년)
    // 역할: AI 선생님 도우미 | 산출물: 좋은 예시 모음 카드
    // =====================================================================
    lower: {
      cardCode: "D-2-L",
      performanceType: "TD",
      ksa: { K: ["K2.2"], S: ["Problem Solving"], A: ["Curious"] },
      description: "AI에게 가르쳐줄 좋은 예시와 이상한 예시를 구분하는 미션이에요.",

      scenario: {
        role: "AI 선생님 도우미",
        goal: "AI에게 가르쳐줄 좋은 예시와 이상한 예시를 구분하고, 좋은 예시 모음을 만든다.",
        context: "AI에게 '과일'을 가르치려고 해요. 그런데 아무 사진이나 보여주면 AI가 헷갈릴 수 있어요. AI 선생님 도우미로서 좋은 예시만 골라서 AI가 잘 배울 수 있게 도와줘요.",
        artifactType: "좋은 예시 모음 카드"
      },

      intro: [
        { text: "AI에게 '과일'이 뭔지 가르치려고 해요!\n어떤 예시를 보여줘야 잘 배울까요?", emoji: "🍎" },
        { text: "사과만 잔뜩 보여주면\nAI는 바나나를 과일이라고 못 알아볼 수 있어요.", emoji: "🤔" },
        { text: "AI 선생님 도우미로서\n좋은 예시를 골라봅시다!", emoji: "👩‍🏫" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 보여준 예시로 배우기 때문에, 어떤 예시를 주느냐가 AI의 실력을 결정해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "예시가 다양한지, 정확한지, 헷갈리는 것은 없는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "한쪽으로 치우친 예시를 주면 AI가 편향되게 배워요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 예시 카드 분류하기",
          question: "AI에게 '과일'을 가르칠 때 좋은 예시와 이상한 예시를 나눠보세요.",
          hint: "진짜 과일 사진, 다양한 종류의 과일이 좋은 예시예요. 과일이 아닌 것이나 너무 이상한 것은 나쁜 예시예요.",
          uiMode: "classify_cards_carousel",
          groups: [
            { id: "good",    label: "좋은 예시" },
            { id: "bad",     label: "이상한 예시" }
          ],
          cards: [
            { id: "apple",       label: "빨간 사과",       emoji: "🍎", answerKey: "good" },
            { id: "banana",      label: "노란 바나나",     emoji: "🍌", answerKey: "good" },
            { id: "grape",       label: "보라색 포도",     emoji: "🍇", answerKey: "good" },
            { id: "watermelon",  label: "수박",           emoji: "🍉", answerKey: "good" },
            { id: "carrot",      label: "당근",           emoji: "🥕", answerKey: "bad" },
            { id: "ball",        label: "빨간 공",         emoji: "🔴", answerKey: "bad" },
            { id: "flower",      label: "꽃",             emoji: "🌸", answerKey: "bad" },
            { id: "apple_only",  label: "사과만 10개",     emoji: "🍎🍎🍎", answerKey: "bad" }
          ],
          validation: { required: true, allRequired: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 왜 이상한 예시인지 설명하기",
          question: "이상한 예시로 분류한 것은 왜 AI에게 보여주면 안 될까요?",
          hint: "과일이 아닌 것, 한 종류만 너무 많은 것이 왜 문제인지 생각해보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          placeholder: "예: 당근은 채소라서 과일이 아니에요. 빨간 공은 과일이랑 비슷하게 생겨서 AI가 헷갈릴 수 있어요. 사과만 10개 보여주면 다른 과일을 못 알아봐요.",
          validation: { required: true, minLength: 20 }
        },
        {
          id: "step3",
          title: "STEP 3 · 더 좋은 예시 추가하기",
          question: "AI가 과일을 더 잘 배우려면 어떤 예시를 더 추가하면 좋을까요?",
          hint: "아직 없는 종류의 과일, 다른 색깔이나 모양의 과일을 생각해보세요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "orange",    label: "오렌지 (주황)" },
            { id: "kiwi",      label: "키위 (갈색 바깥, 초록 안)" },
            { id: "mango",     label: "망고 (노란색, 큰 씨)" },
            { id: "blueberry", label: "블루베리 (작고 파란)" },
            { id: "coconut",   label: "코코넛 (딱딱한 껍질)" },
            { id: "tomato",    label: "토마토 (과일? 채소?)" }
          ],
          validation: { required: true, minSelections: 2 }
        },
        {
          id: "step4",
          title: "STEP 4 · 좋은 예시의 비결",
          question: "AI에게 줄 좋은 예시의 조건을 한 문장으로 써보세요.",
          hint: "다양하고, 정확하고, 헷갈리지 않는 예시가 좋은 예시예요.",
          uiMode: "free_text",
          placeholder: "예: 좋은 예시는 여러 종류가 섞여 있고, 진짜 과일만 들어있고, 비슷하게 생긴 다른 것은 빠져 있어요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "좋은 예시와 이상한 예시를 정확히 구분했는가" },
          { id: "test",       label: "실험·검증", description: "부족한 예시를 발견하고 추가할 수 있었는가" },
          { id: "reflection", label: "성찰·개선", description: "좋은 예시의 조건을 자기 말로 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "좋은 예시 모음 카드 완성!",
        message: "AI에게 좋은 예시를 골라주는 도우미가 되었어요.",
        summaryLabels: { step1: "예시 분류", step2: "이상한 이유", step3: "추가 예시", step4: "좋은 예시 비결" },
        artifact: {
          bindingKey: "d_2_l_examples",
          template: "[좋은 예시 비결] {step4}"
        }
      }
    },

    // =====================================================================
    // D-2-M | 중학년 (3~4학년)
    // 역할: AI 훈련 자료 큐레이터 | 산출물: 데이터셋 품질 진단서
    // =====================================================================
    middle: {
      cardCode: "D-2-M",
      performanceType: "DS",
      ksa: { K: ["K2.2", "K2.4"], S: ["Problem Solving"], A: ["Curious"] },
      description: "훈련 데이터셋의 빈틈과 편향을 찾고, 개선 계획을 세우는 미션이에요.",

      scenario: {
        role: "AI 훈련 자료 큐레이터",
        goal: "AI가 배울 데이터셋의 빈틈과 편향을 찾아내고, 데이터셋 품질 진단서를 작성한다.",
        context: "AI가 '동물'을 분류하도록 훈련 데이터를 준비하고 있어요. 큐레이터로서 기존 데이터셋에 빠진 예시나 치우친 부분이 없는지 점검하고, 더 좋은 데이터셋으로 개선해야 해요.",
        artifactType: "데이터셋 품질 진단서"
      },

      intro: [
        { text: "AI 훈련 자료 큐레이터로 일하게 됐어요!\n데이터셋의 품질을 점검해야 해요.", emoji: "🔍" },
        { text: "데이터가 한쪽으로 치우쳐 있거나\n빠진 부분이 있으면 AI가 편향되게 배워요.", emoji: "⚠️" },
        { text: "빈틈을 찾고 → 원인을 분석하고 → 개선 계획을 세워봅시다!", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 배우는 데이터의 품질이 곧 AI의 품질이에요. 빈틈과 편향을 아는 것이 좋은 AI를 만드는 첫걸음이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 종류가 많고 어떤 종류가 적은지, 특정 특성이 빠져 있진 않은지 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "자주 나오는 예시는 잘 맞히지만 드문 예시는 못 맞히는 AI가 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 데이터셋 현황 분석",
          question: "동물 분류 AI의 현재 훈련 데이터셋이에요. 어떤 문제가 있는지 찾아보세요.",
          hint: "종류별 개수, 다양성, 빠진 항목을 살펴보세요.",
          uiMode: "monitor_display",
          displayText: "현재 훈련 데이터셋:\n• 강아지 사진: 200장 (다양한 품종)\n• 고양이 사진: 180장 (다양한 품종)\n• 새 사진: 30장 (참새만)\n• 물고기 사진: 15장 (금붕어만)\n• 파충류 사진: 5장 (도마뱀만)\n• 곤충 사진: 0장\n\n※ 모든 사진이 밝은 배경에서 촬영됨",
          displayLabel: "훈련 데이터셋 현황",
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 빈틈과 편향 진단",
          question: "이 데이터셋의 문제점을 모두 찾아 체크하세요.",
          hint: "종류별 수량 차이, 다양성 부족, 완전히 빠진 카테고리, 촬영 조건의 편향을 살펴보세요.",
          uiMode: "multi_select_chips",
          branch: { sourceStepId: "step1", mode: "highlight" },
          chips: [
            { id: "imbalance",     label: "강아지·고양이만 너무 많고 나머지가 적음" },
            { id: "missing_insect",label: "곤충 데이터가 아예 없음" },
            { id: "bird_only_one", label: "새가 참새 한 종류뿐" },
            { id: "fish_only_one", label: "물고기가 금붕어 한 종류뿐" },
            { id: "reptile_few",   label: "파충류가 5장뿐이고 도마뱀만" },
            { id: "bright_only",   label: "모든 사진이 밝은 배경 (어두운 환경 없음)" },
            { id: "no_problem",    label: "문제 없음" }
          ],
          validation: { required: true, minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 이 편향이 AI에게 미치는 영향 예측",
          question: "이 데이터셋으로 AI를 훈련시키면 어떤 문제가 생길까요?",
          hint: "각 문제점이 AI 분류 결과에 어떤 영향을 줄지 구체적으로 예측해보세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "rare_animal",  title: "잘 모르는 새(독수리)를 보여주면?",    description: "참새만 배운 AI에게 독수리 사진을 보여줌" },
            { id: "insect",       title: "나비 사진을 보여주면?",              description: "곤충 데이터가 없는 AI에게 나비를 보여줌" },
            { id: "dark_photo",   title: "어두운 곳의 고양이 사진을 보여주면?", description: "밝은 사진만 배운 AI에게 어두운 사진을 보여줌" }
          ],
          judgmentOptions: [
            { id: "correct",   label: "잘 맞힐 것 같다" },
            { id: "confused",  label: "헷갈려할 것 같다" },
            { id: "wrong",     label: "틀릴 것 같다" }
          ],
          allowText: true,
          textPlaceholder: "왜 그렇게 예측했는지 이유를 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 데이터셋 개선 계획",
          question: "큐레이터로서 이 데이터셋을 어떻게 개선할지 계획을 세워보세요.",
          hint: "어떤 데이터를 얼마나 추가할지, 어떤 조건의 사진을 넣을지 구체적으로 쓰세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "add_what",      text: "추가해야 할 데이터 종류와 수량" },
            { id: "add_diversity", text: "다양성을 높이기 위한 방법" },
            { id: "add_condition", text: "촬영 조건의 편향을 줄이는 방법" }
          ],
          placeholders: [
            "예: 곤충 사진 최소 50장 추가 (나비, 무당벌레, 잠자리 등). 새도 독수리, 비둘기, 까마귀 등 5종 이상.",
            "예: 각 동물 카테고리당 최소 3종류 이상의 품종/종을 포함한다.",
            "예: 밝은 배경뿐 아니라 어두운 배경, 자연환경 배경 사진도 30% 이상 포함한다."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "데이터셋의 빈틈과 편향을 체계적으로 발견했는가" },
          { id: "test",       label: "실험·검증", description: "편향이 AI 결과에 미치는 영향을 논리적으로 예측했는가" },
          { id: "iteration",  label: "반복·개선", description: "구체적이고 실행 가능한 개선 계획을 세웠는가" },
          { id: "connection", label: "AI 연결",   description: "데이터 품질과 AI 성능의 관계를 이해했는가" }
        ]
      },

      submit: {
        title: "데이터셋 품질 진단서 완성!",
        message: "데이터 큐레이터로서 편향을 찾고 개선 계획을 세웠어요.",
        summaryLabels: { step1: "데이터셋 현황", step2: "발견한 문제", step3: "영향 예측", step4: "개선 계획" },
        artifact: {
          bindingKey: "d_2_m_diagnosis",
          template: "[발견한 문제]\n{step2}\n\n[개선 계획]\n추가: {step4_add_what}\n다양성: {step4_add_diversity}\n조건: {step4_add_condition}"
        }
      }
    },

    // =====================================================================
    // D-2-H | 고학년 (5~6학년)
    // 역할: 데이터셋 설계 연구원 | 산출물: 데이터셋 설계 명세서
    // =====================================================================
    upper: {
      cardCode: "D-2-H",
      performanceType: "DS",
      ksa: { K: ["K2.2", "K2.4", "K2.5"], S: ["Problem Solving"], A: ["Responsible"] },
      description: "특정 목적의 AI를 위한 데이터셋을 처음부터 설계하고, 편향·공정성까지 고려한 명세서를 작성하는 미션이에요.",

      scenario: {
        role: "데이터셋 설계 연구원",
        goal: "학교 급식 만족도 예측 AI를 위한 데이터셋을 설계하고, 편향·공정성을 분석한 명세서를 작성한다.",
        context: "학교에서 급식 만족도를 예측하는 AI를 만들려고 해요. 연구원으로서 어떤 데이터를 수집할지, 어떤 항목을 포함할지, 편향은 없는지 처음부터 설계해야 해요. 데이터 설계가 곧 AI의 성격을 결정한다는 점을 기억하세요.",
        artifactType: "데이터셋 설계 명세서"
      },

      intro: [
        { text: "학교 급식 만족도를 예측하는 AI를 만들어요!\n먼저 데이터셋을 설계해야 해요.", emoji: "🍽️" },
        { text: "어떤 데이터를 모을지, 어떤 항목을 넣을지,\n편향은 없는지 처음부터 설계하는 거예요.", emoji: "📊" },
        { text: "데이터 설계가 곧 AI의 성격을 결정해요.\n공정하고 다양한 데이터셋을 만들어봅시다!", emoji: "⚖️" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "데이터셋 설계 단계에서 편향이 들어가면 AI가 불공정한 결과를 내요. 설계자의 선택이 AI의 공정성을 좌우해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "수집 항목의 적절성, 대표성(모든 학년·성별·식습관 포함), 개인정보 보호를 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "특정 그룹의 의견만 반영되거나, 개인정보가 노출되거나, AI 예측이 한쪽으로 치우칠 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 수집 항목 설계",
          question: "급식 만족도를 예측하려면 어떤 데이터를 모아야 할까요? 수집 항목을 설계하세요.",
          hint: "급식 메뉴, 학생 특성, 환경 요인 등을 생각해보세요. 개인정보가 포함되면 주의가 필요해요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "menu_name",    label: "메뉴 이름" },
            { id: "menu_type",    label: "메뉴 유형 (한식/양식/중식)" },
            { id: "nutrition",    label: "영양 성분" },
            { id: "student_grade",label: "학년" },
            { id: "student_gender",label: "성별" },
            { id: "allergy",      label: "알레르기 여부" },
            { id: "weather",      label: "날씨" },
            { id: "day_of_week",  label: "요일" },
            { id: "previous_score",label: "이전 만족도 점수" },
            { id: "student_name", label: "학생 이름 (주의!)" },
            { id: "food_preference",label: "음식 취향 (채식/비채식)" }
          ],
          validation: { required: true, minSelections: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · 편향 위험 분석",
          question: "선택한 항목 중 편향을 만들 수 있는 것은 무엇인가요?",
          hint: "특정 학년이나 성별만 설문에 참여하면? 특정 메뉴 유형만 많으면? 개인정보 항목은?",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "bias_risk_1",  text: "[편향 1] 대표성 문제 — 누구의 의견이 빠질 수 있는가" },
            { id: "bias_risk_2",  text: "[편향 2] 항목 편향 — 어떤 항목이 결과를 왜곡할 수 있는가" },
            { id: "privacy_risk", text: "[개인정보] 민감한 항목과 대처 방법" },
            { id: "mitigation",   text: "[대책] 편향을 줄이기 위한 구체적 방법" }
          ],
          placeholders: [
            "예: 저학년은 설문 응답이 적을 수 있어서 고학년 의견만 반영될 위험이 있어요.",
            "예: 성별 항목이 있으면 '남학생은 이런 메뉴를 좋아한다'는 고정관념이 AI에 학습될 수 있어요.",
            "예: '학생 이름'은 개인정보라 수집하면 안 돼요. 알레르기도 민감 정보라 익명 처리가 필요해요.",
            "예: 학년별 최소 50명 이상 수집, 성별 대신 익명 번호 사용, 다양한 메뉴 유형 균등 포함."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step3",
          title: "STEP 3 · 데이터 수집 시뮬레이션",
          question: "실제로 어떤 데이터가 모일지 시뮬레이션해봅시다. 아래 가상 데이터에서 문제를 찾아보세요.",
          hint: "학년별 응답 수, 메뉴 유형별 비율, 결측치(빈 칸)를 확인하세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "data_1", title: "1~2학년 응답: 15건 / 5~6학년 응답: 120건",   description: "학년별 응답 수 차이가 큼" },
            { id: "data_2", title: "한식 메뉴: 80건 / 양식: 10건 / 중식: 5건",    description: "메뉴 유형별 편중" },
            { id: "data_3", title: "알레르기 항목: 40%가 빈 칸",                   description: "결측치(빈 데이터)가 많음" },
            { id: "data_4", title: "만족도 5점(최고)이 전체의 70%",                description: "응답 분포가 한쪽으로 쏠림" }
          ],
          judgmentOptions: [
            { id: "critical", label: "심각한 문제" },
            { id: "moderate", label: "개선 필요" },
            { id: "minor",    label: "사소한 문제" }
          ],
          allowText: true,
          textPlaceholder: "이 문제가 AI 예측에 어떤 영향을 줄지 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 데이터셋 설계 명세서 작성",
          question: "분석 결과를 종합해 최종 데이터셋 설계 명세서를 작성하세요.",
          hint: "수집 항목, 목표 수량, 편향 방지 규칙, 개인정보 처리 방침을 모두 포함하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "final_items",     text: "[수집 항목] 최종 확정 항목 목록과 이유" },
            { id: "target_quantity", text: "[목표 수량] 학년별·메뉴 유형별 최소 수량" },
            { id: "bias_rules",      text: "[편향 방지] 구체적 규칙 2가지 이상" },
            { id: "privacy_policy",  text: "[개인정보] 민감 항목 처리 방침" },
            { id: "quality_check",   text: "[품질 점검] 데이터 수집 후 확인할 사항" }
          ],
          placeholders: [
            "예: 메뉴 이름, 메뉴 유형, 학년, 요일, 날씨, 이전 만족도, 만족도 점수. 학생 이름은 제외.",
            "예: 학년별 최소 50건, 메뉴 유형별 최소 20건.",
            "예: 1) 학년별 수집 비율을 실제 학생 수에 맞춘다. 2) 만족도 분포가 치우치면 추가 수집한다.",
            "예: 학생 이름 수집 안 함. 알레르기는 유/무만 기록(구체적 알레르기 미기재).",
            "예: 결측치가 30% 이상인 항목은 제외. 학년별 응답 비율을 확인."
          ],
          validation: { required: true, minAnswered: 5 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성",   description: "수집 항목이 목적에 맞고 체계적인가" },
          { id: "test",       label: "실험·검증",   description: "가상 데이터에서 문제를 논리적으로 발견했는가" },
          { id: "iteration",  label: "반복·개선",   description: "분석 결과를 반영해 설계를 구체적으로 수정했는가" },
          { id: "fairness",   label: "공정성 인식", description: "편향과 개인정보 위험을 인식하고 대책을 세웠는가" },
          { id: "connection", label: "AI 연결",     description: "데이터 설계가 AI 성능과 공정성에 미치는 영향을 이해했는가" }
        ]
      },

      submit: {
        title: "데이터셋 설계 명세서 완성!",
        message: "편향과 공정성까지 고려한 체계적인 데이터셋 설계를 완료했어요.",
        summaryLabels: { step1: "수집 항목", step2: "편향 분석", step3: "시뮬레이션", step4: "설계 명세서" },
        artifact: {
          bindingKey: "d_2_h_spec",
          template: "[수집 항목] {step4_final_items}\n[목표 수량] {step4_target_quantity}\n[편향 방지] {step4_bias_rules}\n[개인정보] {step4_privacy_policy}\n[품질 점검] {step4_quality_check}"
        }
      }
    }
  }
};
