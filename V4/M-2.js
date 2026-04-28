/**
 * LearnAILIT V4 · M-2 내 정보는 어디까지 줄까?
 * 시나리오 기반 수행 평가 — Managing AI
 *
 * [Managing 핵심]: 위임 시 위험 관리 (risk assessment in delegation)
 * AI에게 과제를 맡길 때 어떤 정보를 주어야 하고 어떤 정보는 빼야 하는지
 * 실험하고 전략을 수립한다.
 */

export const M2_V4_SCENARIO = {
  meta: {
    code: "M-2",
    title: "내 정보는 어디까지 줄까?",
    domain: "Managing"
  },

  grades: {

    // =====================================================================
    // M-2-L | 저학년 (1~2학년)
    // 역할: 개인정보 안전 지킴이 | 산출물: 안전 정보 카드
    // =====================================================================
    lower: {
      cardCode: "M-2-L",
      performanceType: "TD",
      ksa: { K: ["K5.4"], S: ["Critical Thinking"], A: ["Responsible"] },
      description: "AI에게 부탁할 때 말해도 되는 것과 말하면 안 되는 것을 구분하는 미션이에요.",

      scenario: {
        role: "개인정보 안전 지킴이",
        goal: "AI에게 부탁할 때 알려줘도 되는 정보와 알려주면 안 되는 정보를 구분한다.",
        context: "AI에게 여러 가지를 물어보거나 부탁할 수 있어요. 그런데 AI에게 내 이름, 전화번호, 집 주소 같은 것을 알려주면 위험할 수 있어요. 안전 지킴이로서 어떤 정보는 줘도 되고 어떤 정보는 절대 주면 안 되는지 배워봐요.",
        artifactType: "안전 정보 카드"
      },

      intro: [
        { text: "AI에게 여러 가지를 물어볼 수 있어요!\n그런데 뭐든지 다 말해도 될까요?", emoji: "🤔" },
        { text: "내 이름이나 전화번호 같은 건\nAI에게 알려주면 위험할 수 있어요.", emoji: "⚠️" },
        { text: "안전 지킴이가 되어서\n줘도 되는 정보와 안 되는 정보를 구분해봐요!", emoji: "🛡️" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI에게 개인정보를 주면 다른 사람에게 알려질 수 있어서 조심해야 해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "나만 아는 정보(이름, 주소, 전화번호)와 누구나 아는 정보(날씨, 동물 이름)를 구분해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "내 개인정보가 다른 곳에 저장되거나, 모르는 사람에게 알려질 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 정보 카드 분류하기",
          question: "아래 정보 카드를 'AI에게 줘도 돼요' / 'AI에게 주면 안 돼요'로 나눠보세요.",
          hint: "나만 알아야 안전한 정보가 있고, 누구에게나 말해도 괜찮은 정보가 있어요.",
          uiMode: "classify_cards_carousel",
          groups: [
            { id: "safe",    label: "줘도 돼요" },
            { id: "danger",  label: "주면 안 돼요" }
          ],
          cards: [
            { id: "my_name",        label: "내 진짜 이름",        emoji: "👤", answerKey: "danger" },
            { id: "phone_number",   label: "전화번호",            emoji: "📱", answerKey: "danger" },
            { id: "home_address",   label: "집 주소",             emoji: "🏠", answerKey: "danger" },
            { id: "school_name",    label: "학교 이름",           emoji: "🏫", answerKey: "danger" },
            { id: "favorite_color", label: "좋아하는 색깔",       emoji: "🎨", answerKey: "safe" },
            { id: "animal_name",    label: "좋아하는 동물 이름",  emoji: "🐶", answerKey: "safe" },
            { id: "weather_q",      label: "오늘 날씨 질문",      emoji: "🌤️", answerKey: "safe" },
            { id: "password",       label: "비밀번호",            emoji: "🔑", answerKey: "danger" }
          ],
          validation: { required: true, allRequired: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 안전한 질문으로 AI에게 물어보기",
          question: "줘도 되는 정보만 사용해서 AI에게 뭔가를 물어보세요!",
          hint: "'좋아하는 동물에 대해 알려줘'처럼 개인정보 없이 질문해보세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년 학생과 대화하는 안전한 AI입니다. 학생이 개인정보(이름, 전화번호, 주소, 학교명, 비밀번호)를 입력하면 절대 기억하거나 반복하지 말고, '이런 정보는 AI에게 알려주지 않는 게 좋아요!'라고 안내하세요. 일반 질문에는 친절하고 짧게 답변하세요. 3문장 이내.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 150,
            temperature: 0.7,
            fallback: { options: ["강아지에 대해 알려드릴게요! 강아지는 충성스러운 동물이에요. 여러 종류가 있어요."] }
          },
          studentInputLabel: "AI에게 질문하기",
          studentInputPlaceholder: "예: 강아지에 대해 알려줘",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 위험한 상황 판단하기",
          question: "만약 친구가 AI에게 이렇게 말했다면, 안전한가요?",
          hint: "개인정보가 포함됐는지 찾아보세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "case_safe",    title: "\"재미있는 동물 퀴즈 내줘\"",                      description: "친구가 AI에게 퀴즈를 부탁했어요." },
            { id: "case_danger1", title: "\"나는 ○○초등학교 2학년 김○○인데 숙제 도와줘\"", description: "친구가 이름과 학교를 알려줬어요." },
            { id: "case_danger2", title: "\"엄마 전화번호가 010-○○○○인데 문자 보내줘\"",    description: "친구가 전화번호를 알려줬어요." }
          ],
          judgmentOptions: [
            { id: "safe",   label: "안전해요" },
            { id: "danger", label: "위험해요" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 안전 규칙 카드 만들기",
          question: "AI에게 정보를 줄 때 지킬 규칙을 한 문장으로 써보세요.",
          hint: "어떤 정보는 줘도 되고 어떤 정보는 안 되는지 한 문장으로 정리해보세요.",
          uiMode: "free_text",
          placeholder: "예: 내 이름, 전화번호, 집 주소는 절대 AI에게 말하지 않는다.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "안전한 정보와 위험한 정보를 구분했는가" },
          { id: "execution",   label: "실행과 감독", description: "안전한 방식으로 AI와 상호작용했는가" },
          { id: "risk_mgmt",   label: "위험 관리",   description: "위험 상황을 인식하고 규칙을 만들었는가" }
        ]
      },

      submit: {
        title: "안전 정보 카드 완성!",
        message: "AI에게 줘도 되는 정보와 안 되는 정보를 구분하는 지킴이가 되었어요.",
        summaryLabels: { step1: "정보 분류", step2: "안전한 질문", step3: "위험 판단", step4: "안전 규칙" },
        artifact: {
          bindingKey: "m_2_l_safety",
          template: "[안전 규칙] {step4}"
        }
      }
    },

    // =====================================================================
    // M-2-M | 중학년 (3~4학년)
    // 역할: 학급 정보 보안 담당자 | 산출물: 정보 관리 전략표
    // =====================================================================
    middle: {
      cardCode: "M-2-M",
      performanceType: "SJ",
      ksa: { K: ["K5.4"], S: ["Critical Thinking"], A: ["Responsible"] },
      description: "AI에게 과제를 맡길 때 정보 수준을 달리해서 실험하고, 개인정보 관리 전략을 세우는 미션이에요.",

      scenario: {
        role: "학급 정보 보안 담당자",
        goal: "AI에게 주는 정보의 수준을 달리해 실험하고, 정보 관리 전략을 수립한다.",
        context: "학급에서 AI를 활용해 과제를 할 수 있게 되었어요. 그런데 AI에게 정보를 많이 줄수록 결과는 좋아질 수 있지만, 위험도 커져요. 보안 담당자로서 '어디까지 줘야 하고 어디서 멈춰야 하는지' 실험해서 기준을 만들어야 해요.",
        artifactType: "정보 관리 전략표"
      },

      intro: [
        { text: "AI에게 정보를 많이 줄수록 더 좋은 답을 줄 수 있어요.\n하지만 위험도 함께 커져요!", emoji: "⚖️" },
        { text: "같은 질문을 정보를 적게 줄 때와 많이 줄 때,\n결과가 어떻게 달라지는지 실험해봐요.", emoji: "🔬" },
        { text: "보안 담당자로서 '정보를 어디까지 줄지'\n전략을 세워봅시다!", emoji: "🛡️" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI에게 정보를 줄 때 편리함과 안전 사이에서 균형을 찾아야 해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "정보를 더 줬을 때 결과가 얼마나 좋아지는지, 그에 따른 위험은 뭔지 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "좋은 결과를 얻으려다 개인정보가 유출되거나 다른 곳에 저장될 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 정보 수준 실험: 최소 정보",
          question: "AI에게 개인정보 없이 간단하게 질문해보세요.",
          hint: "'여행 계획을 세워줘'처럼 일반적으로 질문하세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학생과 대화하는 AI입니다. 학생의 일반적인 질문에 친절하고 간결하게 답변하세요. 5문장 이내.",
            userPromptTemplate: "{step1_input}",
            outputSchema: "text",
            maxTokens: 250,
            temperature: 0.7,
            fallback: { options: ["제주도 여행을 추천해요! 한라산, 성산일출봉, 만장굴 등 볼거리가 많아요."] }
          },
          studentInputLabel: "최소 정보로 질문하기",
          studentInputPlaceholder: "예: 재미있는 여행지를 추천해줘",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 정보 수준 실험: 추가 정보",
          question: "이번에는 취미나 관심사 같은 안전한 추가 정보를 넣어 질문해보세요.",
          hint: "'나는 바다를 좋아하고 자전거 타기를 좋아해. 여행지 추천해줘'처럼요. 단, 이름·주소·전화번호는 넣지 마세요!",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년 학생과 대화하는 AI입니다. 학생이 추가 정보(취미, 관심사)를 주면 그에 맞게 더 맞춤화된 답변을 하세요. 개인정보(이름, 주소, 전화번호)가 포함되면 '이 정보는 빼고 질문해도 좋아요!'라고 안내하세요.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.7,
            fallback: { options: ["바다를 좋아하시군요! 제주도 해안도로 자전거 코스를 추천해요. 바다 바람을 맞으며 달릴 수 있어요."] }
          },
          studentInputLabel: "추가 정보 넣어 질문하기",
          studentInputPlaceholder: "예: 나는 바다를 좋아하고 자전거 타기를 좋아해. 여행지 추천해줘",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 결과 비교 분석",
          question: "정보를 적게 줬을 때(STEP 1)와 많이 줬을 때(STEP 2), 결과가 어떻게 달라졌나요?",
          hint: "맞춤화 정도, 유용성, 그리고 내가 준 정보의 위험성을 함께 생각하세요.",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step1", mode: "highlight" },
          cases: [
            { id: "usefulness",    title: "유용성",         description: "결과가 나에게 더 도움이 된 쪽은?" },
            { id: "customization", title: "맞춤화 정도",    description: "내 상황에 더 맞는 답을 준 쪽은?" },
            { id: "safety",        title: "정보 안전성",    description: "내가 준 정보가 더 안전한 쪽은?" }
          ],
          judgmentOptions: [
            { id: "step1_better", label: "STEP 1 (최소 정보)" },
            { id: "step2_better", label: "STEP 2 (추가 정보)" },
            { id: "similar",      label: "비슷함" }
          ],
          allowText: true,
          textPlaceholder: "왜 그렇게 판단했는지 짧게 써보세요.",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 정보 관리 전략표 작성",
          question: "실험 결과를 바탕으로, AI에게 정보를 줄 때 지킬 전략 3가지를 만들어보세요.",
          hint: "줘도 되는 정보, 주의해서 줄 정보, 절대 주면 안 되는 정보를 구분해보세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "safe_info",    text: "[안전] AI에게 줘도 되는 정보와 이유" },
            { id: "caution_info", text: "[주의] 줄 수는 있지만 조심할 정보와 이유" },
            { id: "danger_info",  text: "[금지] 절대 주면 안 되는 정보와 이유" }
          ],
          placeholders: [
            "예: 좋아하는 색, 관심사, 일반 질문 → 개인을 특정할 수 없어서 안전해요.",
            "예: 학년, 사는 지역(시·도 수준) → 이것만으로는 나를 못 찾지만 여러 개 합치면 위험할 수 있어요.",
            "예: 이름, 전화번호, 집 주소, 비밀번호, 가족 정보 → 나를 직접 찾을 수 있어서 절대 안 돼요."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "정보 수준별 차이를 인식했는가" },
          { id: "execution",   label: "실행과 감독", description: "안전한 방식으로 실험을 수행했는가" },
          { id: "risk_mgmt",   label: "위험 관리",   description: "정보 유형별 위험을 체계적으로 분류했는가" },
          { id: "strategy",    label: "전략 수립",   description: "실험 근거에 기반한 관리 전략을 세웠는가" }
        ]
      },

      submit: {
        title: "정보 관리 전략표 완성!",
        message: "AI에게 줄 정보의 범위를 실험으로 확인하고 전략을 세웠어요.",
        summaryLabels: { step1: "최소 정보 결과", step2: "추가 정보 결과", step3: "비교 분석", step4: "관리 전략" },
        artifact: {
          bindingKey: "m_2_m_info_strategy",
          template: "[안전] {step4_safe_info}\n[주의] {step4_caution_info}\n[금지] {step4_danger_info}"
        }
      }
    },

    // =====================================================================
    // M-2-H | 고학년 (5~6학년)
    // 역할: 사이버 안전 교육 컨설턴트 | 산출물: 개인정보 위험 분석서 + 대응 매뉴얼
    // =====================================================================
    upper: {
      cardCode: "M-2-H",
      performanceType: "SJ",
      ksa: { K: ["K5.4", "K3.3"], S: ["Critical Thinking"], A: ["Responsible"] },
      description: "AI 활용 시 개인정보 위험 시나리오를 분석하고, 단계별 대응 매뉴얼을 작성하는 미션이에요.",

      scenario: {
        role: "사이버 안전 교육 컨설턴트",
        goal: "AI 활용 시 개인정보 위험을 분석하고, 학생들이 따를 수 있는 대응 매뉴얼을 작성한다.",
        context: "학교에서 AI 활용이 늘면서 학생들의 개인정보 관리가 중요해졌어요. 사이버 안전 교육 컨설턴트로서 실제 위험 시나리오를 분석하고, 학생들이 AI를 안전하게 쓸 수 있는 대응 매뉴얼을 만들어야 해요.",
        artifactType: "위험 분석서 + 대응 매뉴얼"
      },

      intro: [
        { text: "AI를 많이 쓸수록 개인정보 관리가 중요해져요.\n어떤 위험이 있는지 알아야 대비할 수 있어요.", emoji: "🔒" },
        { text: "사이버 안전 컨설턴트로서\n실제 위험 사례를 분석하고 대응책을 만들 거예요.", emoji: "🛡️" },
        { text: "분석 → 실험 → 대응 매뉴얼 작성 순서로 진행합니다.", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI에게 준 정보는 저장되거나 학습에 활용될 수 있어요. 어떤 위험이 있는지 알아야 스스로 보호할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "정보의 민감도, 결합 가능성, AI 서비스의 데이터 저장 방식을 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "사소해 보이는 정보도 여러 개 합치면 개인을 특정할 수 있고, AI 회사가 데이터를 어떻게 쓰는지 모르면 통제할 수 없어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 위험 시나리오 분석",
          question: "다음 상황에서 어떤 위험이 있는지 판단해보세요.",
          hint: "각 상황에서 어떤 정보가 노출되는지, 그 정보로 무엇을 알아낼 수 있는지 생각하세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "scenario1", title: "학생이 AI에게 '○○초 5학년 김○○인데 수학 숙제 도와줘'라고 입력", description: "이름과 학교 정보를 함께 제공한 경우" },
            { id: "scenario2", title: "학생이 AI에게 가족 사진을 보여주며 '우리 가족을 소개하는 글 써줘'라고 요청", description: "가족의 얼굴 이미지와 관계 정보를 제공한 경우" },
            { id: "scenario3", title: "학생이 AI 챗봇에 매일 일기를 써달라고 하면서 그날 있었던 일을 자세히 알려줌", description: "일상 패턴과 위치 정보가 축적되는 경우" },
            { id: "scenario4", title: "학생이 AI에게 '엄마 생일 선물 추천해줘. 엄마는 ○○에서 일하고 ○○을 좋아해'라고 입력", description: "가족의 직장과 취미 정보를 제공한 경우" }
          ],
          judgmentOptions: [
            { id: "low_risk",    label: "위험 낮음" },
            { id: "medium_risk", label: "위험 중간" },
            { id: "high_risk",   label: "위험 높음" }
          ],
          allowText: true,
          textPlaceholder: "어떤 정보가 위험한지, 왜 위험한지 구체적으로 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 안전한 대안 실험",
          question: "위험 시나리오 중 하나를 골라, 개인정보를 빼고 같은 목적을 달성할 수 있는 질문을 만들어 AI에게 보내보세요.",
          hint: "예: '○○초 5학년 김○○'이라고 안 하고 '초등학교 5학년 학생인데'로 바꿔보세요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년 학생과 대화하는 AI입니다. 학생의 요청에 친절하게 답변하세요. 개인정보가 포함되면 '이 정보는 빼도 좋은 답을 드릴 수 있어요'라고 안내하세요.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.7,
            fallback: { options: ["초등학교 5학년 수학 과제를 도와드릴게요! 어떤 단원인가요?"] }
          },
          studentInputLabel: "안전한 질문으로 바꿔 보내기",
          studentInputPlaceholder: "예: 초등학교 5학년인데 수학 숙제 도와줘",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 대응 매뉴얼 작성",
          question: "분석과 실험 결과를 종합해 학생들을 위한 대응 매뉴얼을 작성하세요.",
          hint: "상황별로 '이럴 때 → 이렇게 하세요' 형식으로 구체적으로 쓰세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "rule_before",  text: "[사전 점검] AI에게 입력하기 전에 확인할 사항" },
            { id: "rule_during",  text: "[사용 중] AI와 대화할 때 지킬 규칙" },
            { id: "rule_after",   text: "[사용 후] AI 사용 후 점검할 사항" },
            { id: "rule_emergency", text: "[비상 대응] 실수로 개인정보를 입력했을 때 대처법" }
          ],
          placeholders: [
            "예: 입력 전에 '이 정보로 나를 찾을 수 있는가?' 한 번 생각한다.",
            "예: 이름·주소·전화번호·비밀번호는 절대 입력하지 않는다. 가명이나 별명을 쓴다.",
            "예: 대화 기록 삭제가 가능하면 삭제한다. 어떤 정보를 줬는지 기록해둔다.",
            "예: 즉시 대화를 종료하고, 선생님이나 부모님에게 알린다. 해당 AI 서비스의 데이터 삭제 기능을 사용한다."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step4",
          title: "STEP 4 · 최종 판단",
          question: "컨설턴트로서 '왜 AI에게 정보를 줄 때 신중해야 하는가'를 한 문단으로 정리하세요.",
          hint: "위험 분석과 실험 결과를 근거로 써보세요. 단순히 '조심해야 한다'가 아닌 구체적 이유를 담아야 해요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          placeholder: "예: AI에게 준 정보는 삭제해도 완전히 사라지지 않을 수 있다. 사소한 정보도 여러 개 합치면 개인을 특정할 수 있다. 따라서...",
          validation: { required: true, minLength: 80 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "위험 시나리오의 정보 민감도를 적절히 분석했는가" },
          { id: "execution",   label: "실행과 감독", description: "안전한 대안을 실제로 실험하고 검증했는가" },
          { id: "risk_mgmt",   label: "위험 관리",   description: "상황별 대응 매뉴얼이 구체적이고 실행 가능한가" },
          { id: "strategy",    label: "전략 수립",   description: "정보 관리의 필요성을 근거 있게 설명할 수 있는가" },
          { id: "reflection",  label: "판단 성찰",   description: "정보 제공의 책임이 사용자에게 있음을 이해하는가" }
        ]
      },

      submit: {
        title: "위험 분석서 + 대응 매뉴얼 완성!",
        message: "사이버 안전 컨설턴트로서 체계적인 정보 관리 대응책을 만들었어요.",
        summaryLabels: { step1: "위험 분석", step2: "안전 대안 실험", step3: "대응 매뉴얼", step4: "최종 판단" },
        artifact: {
          bindingKey: "m_2_h_manual",
          template: "[대응 매뉴얼]\n사전: {step3_rule_before}\n사용 중: {step3_rule_during}\n사용 후: {step3_rule_after}\n비상: {step3_rule_emergency}\n\n[최종 판단]\n{step4}"
        }
      }
    }
  }
};
