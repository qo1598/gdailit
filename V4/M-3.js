/**
 * LearnAILIT V4 · M-3 부탁을 잘하면 결과가 달라질까?
 * 시나리오 기반 수행 평가 — Managing AI
 *
 * [Managing 핵심]: 위임 지시의 정교화 (instruction refinement for delegation)
 * AI에게 같은 과제를 지시 수준을 달리해 맡기고, "어떻게 지시하면 더 잘 수행하는가"를
 * 관리자 관점에서 실험·비교·전략화한다.
 * Creating과의 차이: 목적이 "결과물 창작"이 아닌 "위임 지시 최적화"
 */

export const M3_V4_SCENARIO = {
  meta: {
    code: "M-3",
    title: "부탁을 잘하면 결과가 달라질까?",
    domain: "Managing"
  },

  grades: {

    // =====================================================================
    // M-3-L | 저학년 (1~2학년)
    // 역할: AI 부탁 견습생 | 산출물: 좋은 부탁 vs 나쁜 부탁 비교 카드
    // =====================================================================
    lower: {
      cardCode: "M-3-L",
      performanceType: "TD",
      ksa: { K: ["K1.3"], S: ["Computational Thinking"], A: ["Adaptable"] },
      description: "AI에게 같은 것을 막연하게 부탁했을 때와 구체적으로 부탁했을 때 결과가 어떻게 달라지는지 비교하는 미션이에요.",

      scenario: {
        role: "AI 부탁 견습생",
        goal: "막연한 부탁과 구체적인 부탁을 각각 해보고, 어떤 부탁이 더 좋은 결과를 내는지 비교한다.",
        context: "AI에게 같은 것을 부탁해도, 어떻게 말하느냐에 따라 결과가 달라져요. 견습생으로서 '좋은 부탁'과 '나쁜 부탁'의 차이를 직접 실험해봐요.",
        artifactType: "좋은 부탁 vs 나쁜 부탁 비교 카드"
      },

      intro: [
        { text: "AI에게 같은 것을 부탁해도\n말하는 방식에 따라 결과가 달라져요!", emoji: "🗣️" },
        { text: "\"그림 그려줘\"와 \"빨간 사과를 그려줘\"는\n같은 부탁이지만 결과가 다를 거예요.", emoji: "🍎" },
        { text: "어떤 부탁이 더 좋은 결과를 내는지\n직접 실험해봅시다!", emoji: "🔬" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI에게 명확하게 말해야 내가 원하는 결과를 받을 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "막연한 부탁과 구체적인 부탁의 결과가 어떻게 다른지 비교해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 엉뚱한 결과를 줘서 다시 부탁해야 하고, 시간도 낭비돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 막연한 부탁 보내기",
          question: "AI에게 아주 간단하고 막연하게 부탁해보세요!",
          hint: "'이야기 만들어줘', '동물 알려줘'처럼 아주 짧게만 말해보세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년 학생과 대화하는 AI입니다. 학생의 요청에 짧게 답변하세요. 3~4문장 이내. 한국어.",
            userPromptTemplate: "{step1_input}",
            outputSchema: "text",
            maxTokens: 150,
            temperature: 0.9,
            fallback: { options: ["이야기를 만들어볼게요! 옛날 옛적에 작은 토끼가 살았어요. 토끼는 숲에서 모험을 떠났어요."] }
          },
          studentInputLabel: "막연하게 부탁하기",
          studentInputPlaceholder: "예: 이야기 만들어줘",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 구체적인 부탁 보내기",
          question: "이번에는 같은 주제를 구체적으로 부탁해보세요!",
          hint: "누가, 어디서, 무엇을, 어떤 분위기로 — 하나씩 더 넣어보세요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년 학생과 대화하는 AI입니다. 학생의 구체적 요청에 맞춰 답변하세요. 3~5문장 이내.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 200,
            temperature: 0.7,
            fallback: { options: ["바닷가에서 게를 만난 용감한 강아지 이야기를 만들어볼게요! 강아지는 파도를 무서워했지만 용기를 냈어요."] }
          },
          studentInputLabel: "구체적으로 부탁하기",
          studentInputPlaceholder: "예: 바닷가에서 게를 만난 용감한 강아지 이야기를 만들어줘",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 두 결과 비교하기",
          question: "막연한 부탁(STEP 1)과 구체적인 부탁(STEP 2)의 결과를 비교해보세요. 어떤 쪽이 더 마음에 드나요?",
          hint: "내가 원했던 것과 더 가까운 쪽을 골라보세요.",
          uiMode: "single_select_cards",
          branch: { sourceStepId: "step1", mode: "highlight" },
          options: [
            { id: "vague_better",    label: "막연한 부탁이 더 좋았어요", emoji: "1️⃣" },
            { id: "specific_better", label: "구체적인 부탁이 더 좋았어요", emoji: "2️⃣" },
            { id: "similar",         label: "비슷했어요", emoji: "🤷" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 좋은 부탁의 비결 쓰기",
          question: "좋은 부탁을 하려면 어떻게 말해야 할까요? 비결을 한 문장으로 써보세요.",
          hint: "구체적으로 말하면 어떤 점이 좋았는지 생각해보세요.",
          uiMode: "free_text",
          placeholder: "예: 누가, 어디서, 무엇을 하는지 자세히 말하면 내가 원하는 답이 나와요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "막연한 부탁과 구체적 부탁의 차이를 인식했는가" },
          { id: "execution",   label: "실행과 감독", description: "두 가지 부탁을 실제로 보내고 결과를 확인했는가" },
          { id: "reflection",  label: "판단 성찰",   description: "좋은 부탁의 조건을 자기 말로 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "비교 카드 완성!",
        message: "막연한 부탁과 구체적 부탁의 차이를 직접 실험해봤어요.",
        summaryLabels: { step1: "막연한 부탁", step2: "구체적 부탁", step3: "비교 결과", step4: "좋은 부탁 비결" },
        artifact: {
          bindingKey: "m_3_l_compare",
          template: "[막연한 부탁] {step1_input}\n[구체적 부탁] {step2_input}\n[비교] {step3}\n[비결] {step4}"
        }
      }
    },

    // =====================================================================
    // M-3-M | 중학년 (3~4학년)
    // 역할: 프롬프트 실험실 연구원 | 산출물: 프롬프트 개선 실험 보고서
    // =====================================================================
    middle: {
      cardCode: "M-3-M",
      performanceType: "GC",
      ksa: { K: ["K1.3", "K2.3"], S: ["Computational Thinking"], A: ["Adaptable"] },
      description: "같은 과제에 조건을 하나씩 추가해가며 AI 결과가 어떻게 바뀌는지 체계적으로 실험하는 미션이에요.",

      scenario: {
        role: "프롬프트 실험실 연구원",
        goal: "같은 과제에 조건을 단계적으로 추가하며 AI 결과 변화를 실험하고, 프롬프트 개선 원칙을 도출한다.",
        context: "프롬프트 실험실에서 'AI에게 어떻게 지시하면 더 좋은 결과를 얻을 수 있는가'를 연구하고 있어요. 연구원으로서 조건을 하나씩 바꿔가며 결과가 어떻게 달라지는지 기록하고, 개선 원칙을 발견해야 해요.",
        artifactType: "프롬프트 개선 실험 보고서"
      },

      intro: [
        { text: "프롬프트 실험실에 오신 걸 환영해요!\n여기서는 AI에게 주는 지시를 연구해요.", emoji: "🔬" },
        { text: "같은 과제에 조건을 하나씩 추가하면\nAI 결과가 어떻게 달라지는지 실험할 거예요.", emoji: "📊" },
        { text: "실험 → 관찰 → 원칙 발견\n연구원의 방법으로 진행합니다!", emoji: "📝" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI에게 지시하는 방법에 따라 결과의 질이 크게 달라져요. 좋은 지시의 원칙을 알면 AI를 더 효과적으로 관리할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "조건을 추가할 때마다 결과가 '어떻게' 달라지는지, 그리고 '왜' 달라지는지를 관찰해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "무작정 길게 쓴다고 좋은 게 아니라, 어떤 조건이 결과에 영향을 주는지 모르면 비효율적이에요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 실험 과제 선택",
          question: "어떤 과제로 실험할지 골라요.",
          hint: "결과가 확실히 달라질 수 있는 과제를 골라보세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "story",      label: "짧은 이야기 만들기",   emoji: "📖" },
            { id: "explain",    label: "어려운 개념 설명하기",  emoji: "💡" },
            { id: "recommend",  label: "추천 목록 만들기",     emoji: "⭐" },
            { id: "plan",       label: "일정 계획 세우기",     emoji: "📅" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 실험 1단계: 기본 지시",
          question: "선택한 과제를 가장 기본적인 지시로 AI에게 보내보세요.",
          hint: "조건 없이 기본만 써보세요. 예: '이야기 만들어줘'",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학생의 과제를 돕는 AI입니다. 학생의 지시에 정확히 따르세요. 5문장 이내.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 250,
            temperature: 0.8,
            fallback: { options: ["이야기를 만들어볼게요. 어느 날 작은 마을에 신비한 상자가 나타났어요. 아이들은 상자를 열어보기로 했어요."] }
          },
          studentInputLabel: "기본 지시",
          studentInputPlaceholder: "예: 이야기 만들어줘",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 실험 2단계: 조건 1개 추가",
          question: "같은 과제에 조건을 1개 추가해서 다시 보내보세요.",
          hint: "대상, 분위기, 길이 등 하나만 추가해보세요. 예: '초등학생이 읽을 수 있는 이야기 만들어줘'",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step2", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년 학생의 과제를 돕는 AI입니다. 학생이 추가한 조건을 반영하여 답변하세요. 5문장 이내.",
            userPromptTemplate: "{step3_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.7,
            fallback: { options: ["초등학생이 읽기 좋은 이야기를 만들어볼게요! 민수는 방과 후 비밀 정원을 발견했어요."] }
          },
          studentInputLabel: "조건 1개 추가 지시",
          studentInputPlaceholder: "예: 초등학생이 읽을 수 있는 이야기 만들어줘",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 실험 3단계: 조건 2~3개 추가",
          question: "이번에는 조건을 2~3개 넣어서 보내보세요.",
          hint: "대상 + 분위기 + 길이처럼 여러 조건을 함께 써보세요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step3", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년 학생의 과제를 돕는 AI입니다. 학생이 제시한 여러 조건을 모두 반영하여 답변하세요. 7문장 이내.",
            userPromptTemplate: "{step4_input}",
            outputSchema: "text",
            maxTokens: 400,
            temperature: 0.7,
            fallback: { options: ["초등학생이 읽기 좋은 따뜻한 이야기를 5문장으로 만들어볼게요! 봄날, 은지는 학교 뒤뜰에서 다친 새를 발견했어요..."] }
          },
          studentInputLabel: "조건 2~3개 추가 지시",
          studentInputPlaceholder: "예: 초등학생이 읽을 수 있는 따뜻한 분위기의 5문장 이야기 만들어줘",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · 실험 결과 비교",
          question: "3단계 실험 결과를 비교해보세요. 조건이 추가될수록 결과가 어떻게 변했나요?",
          hint: "정확성, 내 의도 반영도, 유용성 관점에서 비교하세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "exp1", title: "실험 1: 기본 지시",        description: "조건 없이 보냈을 때" },
            { id: "exp2", title: "실험 2: 조건 1개 추가",    description: "조건 1개 넣었을 때" },
            { id: "exp3", title: "실험 3: 조건 2~3개 추가",  description: "조건 여러 개 넣었을 때" }
          ],
          judgmentOptions: [
            { id: "poor",   label: "내 의도와 거리가 멀다" },
            { id: "okay",   label: "대체로 맞지만 아쉽다" },
            { id: "good",   label: "내 의도에 잘 맞는다" }
          ],
          allowText: true,
          textPlaceholder: "어떤 조건이 가장 큰 변화를 만들었는지 써보세요.",
          validation: { required: true }
        },
        {
          id: "step6",
          title: "STEP 6 · 프롬프트 개선 원칙 작성",
          question: "실험으로 발견한 '좋은 지시의 원칙'을 2~3개 정리하세요.",
          hint: "어떤 조건이 효과적이었는지, 왜 효과적이었는지를 정리하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step5", mode: "highlight" },
          questions: [
            { id: "principle_1", text: "[원칙 1] 가장 효과적이었던 조건과 이유" },
            { id: "principle_2", text: "[원칙 2] 두 번째로 효과적이었던 조건과 이유" },
            { id: "principle_3", text: "[원칙 3] (선택) 발견한 추가 원칙" }
          ],
          placeholders: [
            "예: 대상을 정해주면('초등학생용') AI가 수준에 맞는 답을 줘요.",
            "예: 분위기를 정해주면('따뜻한') 전체 톤이 통일돼요.",
            ""
          ],
          validation: { required: true, minAnswered: 2 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "조건 수준별 차이를 체계적으로 실험했는가" },
          { id: "execution",   label: "실행과 감독", description: "3단계를 각각 실행하고 결과를 비교 관찰했는가" },
          { id: "strategy",    label: "전략 수립",   description: "실험 근거에 기반한 프롬프트 원칙을 도출했는가" },
          { id: "reflection",  label: "판단 성찰",   description: "조건과 결과의 관계를 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "실험 보고서 완성!",
        message: "조건을 단계적으로 추가하며 프롬프트 개선 원칙을 발견했어요.",
        summaryLabels: { step1: "실험 과제", step2: "기본 지시", step3: "조건 1개", step4: "조건 2~3개", step5: "비교 결과", step6: "개선 원칙" },
        artifact: {
          bindingKey: "m_3_m_experiment",
          template: "[실험 과제] {step1}\n[원칙 1] {step6_principle_1}\n[원칙 2] {step6_principle_2}"
        }
      }
    },

    // =====================================================================
    // M-3-H | 고학년 (5~6학년)
    // 역할: AI 프롬프트 엔지니어 | 산출물: 프롬프트 설계 가이드라인
    // =====================================================================
    upper: {
      cardCode: "M-3-H",
      performanceType: "GC",
      ksa: { K: ["K1.3", "K2.3", "K4.2"], S: ["Computational Thinking"], A: ["Adaptable"] },
      description: "프롬프트를 체계적으로 설계·실험·비교·개선하고, 재사용 가능한 프롬프트 가이드라인을 작성하는 미션이에요.",

      scenario: {
        role: "AI 프롬프트 엔지니어",
        goal: "프롬프트 설계 원칙을 수립하고, 실험을 통해 검증한 뒤 재사용 가능한 가이드라인을 작성한다.",
        context: "학교에서 여러 학급이 AI를 활용하게 되면서, '어떻게 지시하면 좋은 결과를 얻을 수 있는지' 가이드라인이 필요해졌어요. 프롬프트 엔지니어로서 체계적인 실험을 하고, 누구나 따라 할 수 있는 가이드라인을 만들어야 해요.",
        artifactType: "프롬프트 설계 가이드라인"
      },

      intro: [
        { text: "여러 학급이 AI를 활용하는데\n좋은 결과를 얻는 방법이 제각각이에요.", emoji: "🏫" },
        { text: "프롬프트 엔지니어로서\n체계적으로 실험하고 가이드라인을 만들 거예요.", emoji: "⚙️" },
        { text: "설계 → 실험 → 비교 → 가이드라인 작성\n순서로 진행합니다.", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "좋은 프롬프트 설계는 AI 활용의 효율성과 품질을 모두 높여요. 체계적인 원칙이 있으면 누구나 좋은 결과를 얻을 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "프롬프트의 구성 요소(목표·대상·형식·제약)가 결과에 미치는 영향을 관찰해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "시행착오만 반복하게 되고, 불필요한 AI 호출로 시간과 에너지가 낭비돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 프롬프트 구성 요소 설계",
          question: "좋은 프롬프트에 들어가야 할 요소를 먼저 정리하세요.",
          hint: "프롬프트를 '목표', '대상', '형식', '제약', '예시' 관점에서 분해해보세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "goal",        text: "목표 — AI에게 무엇을 시키려 하는가" },
            { id: "audience",    text: "대상 — 누구를 위한 결과인가" },
            { id: "format",      text: "형식 — 어떤 형태로 받고 싶은가 (문장 수, 구조)" },
            { id: "constraint",  text: "제약 — 반드시 포함할 것과 빼야 할 것" }
          ],
          placeholders: [
            "예: 환경 보호를 주제로 캠페인 문구를 만들기",
            "예: 초등학교 5~6학년 학생",
            "예: 20자 이내의 짧은 슬로건 3개",
            "예: 어려운 한자어 금지, 긍정적 톤 유지"
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · 실험 A: 요소 없는 프롬프트",
          question: "목표만 넣고 나머지 요소 없이 AI에게 보내보세요.",
          hint: "예: '환경 보호 캠페인 문구 만들어줘'만 보내세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년(5~6학년) 학생의 과제를 돕는 AI입니다. 학생의 지시에 따라 답변하세요. 한국어.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.8,
            fallback: { options: ["환경을 지켜요! 지구를 살려요! 우리 모두 함께 실천해요!"] }
          },
          studentInputLabel: "요소 없는 프롬프트",
          studentInputPlaceholder: "예: 환경 보호 캠페인 문구 만들어줘",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 실험 B: 모든 요소 포함 프롬프트",
          question: "STEP 1에서 정리한 목표·대상·형식·제약을 모두 넣어 보내보세요.",
          hint: "STEP 1의 4가지를 모두 한 문장에 담아보세요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년 학생의 과제를 돕는 AI입니다. 학생의 구체적 지시를 정확히 따르세요. 한국어.",
            userPromptTemplate: "{step3_input}",
            outputSchema: "text",
            maxTokens: 400,
            temperature: 0.6,
            fallback: { options: ["1. 작은 실천, 큰 변화!\n2. 오늘 분리수거, 내일 푸른 지구\n3. 한 걸음부터, 함께 시작해요"] }
          },
          studentInputLabel: "모든 요소 포함 프롬프트",
          studentInputPlaceholder: "예: 초등 5~6학년을 대상으로, 환경 보호 캠페인 슬로건 3개를 20자 이내로 만들어줘. 어려운 한자어는 빼고 긍정적 톤으로.",
          allowRetry: false,
          maxRetries: 0,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 실험 A vs B 비교 분석",
          question: "두 프롬프트의 결과를 비교하세요. 어떤 요소가 가장 큰 차이를 만들었나요?",
          hint: "구체성, 목적 부합도, 대상 적합성, 형식 준수 등을 기준으로 비교하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "comparison",    text: "실험 A(기본)와 B(전체 요소)의 핵심 차이" },
            { id: "most_impact",   text: "가장 큰 변화를 만든 요소와 그 이유" },
            { id: "efficiency",    text: "AI 호출 효율성 측면 (몇 번 만에 원하는 결과를 얻었나)" }
          ],
          placeholders: [
            "예: A는 너무 일반적이고 B는 내 의도에 정확히 맞았어요.",
            "예: '대상(초등 5~6학년)'을 넣자 어려운 말이 사라졌어요. 대상 지정이 가장 효과적이었어요.",
            "예: A는 원하는 결과가 안 나와서 여러 번 해야 할 것 같지만, B는 1번에 쓸 만한 결과가 나왔어요."
          ],
          validation: { required: true, minAnswered: 3 }
        },
        {
          id: "step5",
          title: "STEP 5 · 프롬프트 설계 가이드라인 작성",
          question: "실험 결과를 종합해 다른 학생이 따라 할 수 있는 가이드라인을 작성하세요.",
          hint: "각 원칙에 '왜 이렇게 해야 하는지'를 근거와 함께 쓰세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "guide_1", text: "[가이드 1] 목표를 명확히 쓰는 방법" },
            { id: "guide_2", text: "[가이드 2] 대상과 형식을 지정하는 방법" },
            { id: "guide_3", text: "[가이드 3] 제약 조건을 효과적으로 넣는 방법" },
            { id: "guide_4", text: "[가이드 4] (선택) 에너지·효율 관점 — 불필요한 AI 호출을 줄이는 방법" }
          ],
          placeholders: [
            "예: '~만들어줘' 대신 '~을 목적으로 ~을 만들어줘'로 시작한다. 목적이 명확해야 AI가 방향을 잡을 수 있다.",
            "예: '초등학생용', '3문장으로', '표로 정리'처럼 결과의 형태를 미리 정한다. 그래야 사후 수정이 줄어든다.",
            "예: '~은 포함하고 ~은 빼줘'로 경계를 정한다. 특히 '빼야 할 것'을 쓰면 결과가 확 좋아진다.",
            "예: 구체적 프롬프트 1번이 막연한 프롬프트 3번보다 에너지와 시간을 아낀다."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "criteria",    label: "기준 수립",   description: "프롬프트 구성 요소를 체계적으로 분해했는가" },
          { id: "delegation",  label: "위임 판단",   description: "요소별 영향을 통제된 실험으로 비교했는가" },
          { id: "execution",   label: "실행과 감독", description: "실험을 계획대로 수행하고 결과를 관찰했는가" },
          { id: "strategy",    label: "전략 수립",   description: "실험 근거에 기반한 재사용 가능한 가이드라인을 만들었는가" },
          { id: "reflection",  label: "판단 성찰",   description: "효율성·에너지 관점까지 고려했는가" }
        ]
      },

      submit: {
        title: "프롬프트 설계 가이드라인 완성!",
        message: "체계적 실험으로 검증된 프롬프트 설계 원칙을 만들었어요.",
        summaryLabels: { step1: "구성 요소", step2: "실험 A", step3: "실험 B", step4: "비교 분석", step5: "가이드라인" },
        artifact: {
          bindingKey: "m_3_h_guideline",
          template: "[프롬프트 설계 가이드라인]\n{step5_guide_1}\n{step5_guide_2}\n{step5_guide_3}"
        }
      }
    }
  }
};
