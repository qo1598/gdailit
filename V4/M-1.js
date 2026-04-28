/**
 * LearnAILIT V4 · M-1 AI를 언제 쓰면 좋을까?
 * 시나리오 기반 수행 평가 — Managing AI
 *
 * [Managing 핵심]: 위임 판단 (delegation decision)
 * 학생은 "관리자"로서 같은 과제를 AI에게 맡긴 것과 직접 한 것을 비교하고
 * 어떤 일에 AI가 적합한지 전략적으로 판단한다.
 */

export const M1_V4_SCENARIO = {
  meta: {
    code: "M-1",
    title: "AI를 언제 쓰면 좋을까?",
    domain: "Managing"
  },

  grades: {

    // =====================================================================
    // M-1-L | 저학년 (1~2학년)
    // 역할: 우리 반 숙제 도우미 | 산출물: AI 도움 판단 카드
    // =====================================================================
    lower: {
      cardCode: "M-1-L",
      performanceType: "TD",
      ksa: { K: ["K3.1"], S: ["Problem Solving"], A: ["Responsible"] },
      description: "여러 가지 과제를 보고 AI에게 맡겨도 되는 일과 내가 직접 해야 하는 일을 구분하는 미션이에요.",

      scenario: {
        role: "우리 반 숙제 도우미",
        goal: "과제 카드를 보고 AI에게 맡길 수 있는 일과 내가 직접 해야 하는 일을 나눈다.",
        context: "선생님이 여러 가지 숙제를 내주셨어요. 그런데 모든 숙제를 AI에게 맡기면 안 되는 것도 있고, AI가 도와주면 더 잘할 수 있는 것도 있어요. 숙제 도우미로서 어떤 숙제는 AI에게 맡기고 어떤 숙제는 직접 해야 할지 정해봐요.",
        artifactType: "AI 도움 판단 카드"
      },

      intro: [
        { text: "선생님이 여러 가지 숙제를 내주셨어요!\n그런데 모든 숙제를 AI에게 맡겨도 될까요?", emoji: "📝" },
        { text: "어떤 일은 AI가 잘하고,\n어떤 일은 내가 직접 해야 더 잘할 수 있어요.", emoji: "🤔" },
        { text: "숙제 도우미가 되어서\nAI에게 맡길 일과 내가 할 일을 나눠봅시다!", emoji: "✋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI에게 다 맡기면 내가 배울 기회를 놓칠 수 있어요. 어떤 일에 AI를 쓸지 정하는 것이 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 잘하는 일(자료 찾기, 계산)과 내가 직접 해야 하는 일(느낌 쓰기, 그림 그리기)을 구분해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "직접 해봐야 배우는 일까지 AI에게 맡기면 실력이 늘지 않아요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 숙제 카드 나누기",
          question: "숙제 카드를 보고 'AI에게 맡기기' / '내가 직접 하기' / '함께 하기'로 나눠보세요.",
          hint: "느낌이나 생각을 써야 하는 건 내가 직접, 자료를 찾거나 정리하는 건 AI가 도울 수 있어요.",
          uiMode: "classify_cards_carousel",
          groups: [
            { id: "ai_do",     label: "AI에게 맡기기" },
            { id: "me_do",     label: "내가 직접 하기" },
            { id: "together",  label: "함께 하기" }
          ],
          cards: [
            { id: "find_info",      label: "공룡 이름 3개 찾기",          emoji: "🦕", answerKey: "ai_do" },
            { id: "draw_feeling",   label: "오늘 기분을 그림으로 그리기",   emoji: "🎨", answerKey: "me_do" },
            { id: "math_drill",     label: "구구단 연습하기",              emoji: "🔢", answerKey: "me_do" },
            { id: "translate_word", label: "영어 단어 뜻 찾기",           emoji: "🌐", answerKey: "ai_do" },
            { id: "diary_write",    label: "오늘 일기 쓰기",              emoji: "📖", answerKey: "me_do" },
            { id: "story_idea",     label: "이야기 아이디어 떠올리기",     emoji: "💡", answerKey: "together" }
          ],
          validation: { required: true, allRequired: true }
        },
        {
          id: "step2",
          title: "STEP 2 · AI에게 실제로 맡겨보기",
          question: "AI에게 맡겨도 된다고 생각한 숙제 하나를 골라서 실제로 AI에게 부탁해보세요!",
          hint: "step1에서 'AI에게 맡기기'로 분류한 카드 중 하나를 골라요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", filterBy: "ai_do", mode: "filter" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년(1~2학년) 학생의 숙제를 돕는 AI입니다. 학생이 요청한 과제를 간단하고 정확하게 수행하세요. 답변은 3~5문장 이내로 짧게. 한국어로 답변하세요.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 200,
            temperature: 0.7,
            fallback: { options: ["공룡 이름 3개: 티라노사우루스, 트리케라톱스, 브라키오사우루스예요!"] }
          },
          studentInputLabel: "AI에게 부탁하기",
          studentInputPlaceholder: "예: 공룡 이름 3개를 알려줘",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · AI 결과 확인하기",
          question: "AI가 해준 것을 보고, 잘했는지 확인해보세요. 이 숙제는 AI에게 맡기는 게 맞았나요?",
          hint: "AI가 정확하게 했나요? 내가 직접 했으면 어땠을까요?",
          uiMode: "single_select_cards",
          branch: { sourceStepId: "step2", mode: "highlight" },
          options: [
            { id: "good_match",  label: "AI에게 맡기길 잘했어요", emoji: "👍" },
            { id: "not_sure",    label: "잘 모르겠어요",          emoji: "🤔" },
            { id: "should_self", label: "내가 직접 할 걸 그랬어요", emoji: "✋" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 판단 이유 쓰기",
          question: "왜 그렇게 생각했나요? 짧게 써보세요.",
          hint: "AI가 잘한 점이나 아쉬운 점을 떠올려 보세요.",
          uiMode: "free_text",
          placeholder: "예: AI가 공룡 이름을 빨리 찾아줘서 좋았어요. 하지만 그림은 내가 직접 그려야 해요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "AI에게 맡길 일과 직접 할 일을 적절히 구분했는가" },
          { id: "execution",   label: "실행과 감독", description: "AI에게 실제로 맡기고 결과를 확인했는가" },
          { id: "reflection",  label: "판단 성찰",   description: "위임 결과를 돌아보고 이유를 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "AI 도움 판단 카드 완성!",
        message: "AI에게 맡길 일과 내가 할 일을 구분하는 숙제 도우미가 되었어요.",
        summaryLabels: {
          step1: "숙제 분류 결과",
          step2: "AI에게 맡긴 결과",
          step3: "위임 판단",
          step4: "판단 이유"
        },
        artifact: {
          bindingKey: "m_1_l_delegation",
          template: "나는 {step2_task}를 AI에게 맡겼어요. 결과: {step3}. 이유: {step4}"
        }
      }
    },

    // =====================================================================
    // M-1-M | 중학년 (3~4학년)
    // 역할: 학급 과제 도움 코디네이터 | 산출물: AI 위임 전략표
    // =====================================================================
    middle: {
      cardCode: "M-1-M",
      performanceType: "SJ",
      ksa: { K: ["K3.1", "K3.2"], S: ["Problem Solving"], A: ["Responsible"] },
      description: "같은 과제를 AI와 사람이 각각 해본 뒤 비교하고, 어떤 과제에 AI가 적합한지 전략을 세우는 미션이에요.",

      scenario: {
        role: "학급 과제 도움 코디네이터",
        goal: "같은 과제를 AI와 직접 수행한 결과를 비교하고, AI 위임 전략표를 완성한다.",
        context: "학급에서 다양한 과제를 할 때 AI를 활용할 수 있게 되었어요. 하지만 아무 과제나 AI에게 맡기면 안 돼요. 코디네이터로서 '어떤 과제에 AI가 적합한지' 기준을 세워야 해요. 실제로 AI에게 맡겨보고, 직접 해본 것과 비교해서 전략을 만들어봅시다.",
        artifactType: "AI 위임 전략표"
      },

      intro: [
        { text: "학급에서 AI를 활용할 수 있게 됐어요!\n그런데 모든 과제에 AI를 쓰면 좋을까요?", emoji: "🤖" },
        { text: "어떤 과제는 AI가 빨리 해주지만,\n어떤 과제는 내가 직접 해야 의미가 있어요.", emoji: "⚖️" },
        { text: "코디네이터로서 직접 비교해보고\nAI 위임 전략을 세워봅시다!", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 빠르게 해줄 수 있어도, 내가 직접 해야 배울 수 있는 과제가 있어요. 어디에 AI를 쓸지 전략적으로 정하는 게 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 한 결과와 내가 한 결과의 질, 정확성, 나에게 남는 배움을 비교해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "편하다고 모두 AI에게 맡기면 생각하는 힘이 약해지고, AI가 틀린 것도 모르고 넘어갈 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 비교 과제 선택",
          question: "코디네이터로서 AI와 비교 실험할 과제 유형을 고르세요.",
          hint: "서로 다른 성격의 과제를 골라야 비교가 의미 있어요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "fact_search",     label: "사실 자료 찾기 (예: 수도 이름)" },
            { id: "summary",         label: "긴 글 요약하기" },
            { id: "opinion_write",   label: "내 생각 쓰기 (예: 독후감)" },
            { id: "math_solve",      label: "수학 문제 풀기" },
            { id: "creative_idea",   label: "아이디어 브레인스토밍" },
            { id: "empathy_letter",  label: "위로 편지 쓰기" }
          ],
          validation: { required: true, minSelections: 2, maxSelections: 3 }
        },
        {
          id: "step2",
          title: "STEP 2 · AI에게 맡겨보기",
          question: "선택한 과제 중 하나를 AI에게 실제로 맡겨보세요.",
          hint: "AI에게 구체적으로 부탁하세요. 예: '한국의 수도는 어디야?', '이 글을 3줄로 요약해줘'",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학생의 학습 과제를 돕는 AI입니다. 학생이 요청한 과제를 정확하고 간결하게 수행하세요. 5문장 이내로 답변. 한국어로 답변하세요.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.7,
            fallback: { options: ["대한민국의 수도는 서울입니다. 서울은 한반도 중앙에 위치한 도시예요."] }
          },
          studentInputLabel: "AI에게 과제 맡기기",
          studentInputPlaceholder: "예: 한국의 수도를 알려줘",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 내가 직접 해보기",
          question: "같은 과제를 이번에는 AI 없이 직접 해보세요.",
          hint: "AI가 해준 것과 비교할 수 있도록 같은 과제를 내 힘으로 해보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          placeholder: "예: 한국의 수도는 서울이에요. 서울에는 경복궁과 남산타워가 있어요.",
          validation: { required: true, minLength: 20 }
        },
        {
          id: "step4",
          title: "STEP 4 · AI vs 나 비교 판정",
          question: "AI가 한 것과 내가 한 것을 비교해보세요. 각 기준에서 누가 더 잘했나요?",
          hint: "정확성, 속도, 나에게 남는 배움 등을 생각해보세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "accuracy",   title: "정확성",     description: "내용이 더 정확한 쪽은?" },
            { id: "speed",      title: "속도",       description: "더 빨리 끝낸 쪽은?" },
            { id: "learning",   title: "배움",       description: "내가 더 많이 배운 쪽은?" },
            { id: "creativity", title: "독창성",     description: "더 독특한 결과를 낸 쪽은?" }
          ],
          judgmentOptions: [
            { id: "ai_better",  label: "AI가 더 잘함" },
            { id: "me_better",  label: "내가 더 잘함" },
            { id: "similar",    label: "비슷함" }
          ],
          allowText: true,
          textPlaceholder: "왜 그렇게 판단했는지 짧게 써보세요.",
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · AI 위임 전략표 작성",
          question: "비교 결과를 바탕으로, STEP 1에서 고른 과제들에 대해 AI 활용 전략을 세우세요.",
          hint: "'AI에게 맡기기', '내가 직접 하기', '함께 하기' 중 선택하고 이유를 써보세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "strategy",   text: "과제별 AI 활용 전략 (AI 맡기기 / 직접 하기 / 함께 하기)" },
            { id: "reason",     text: "그렇게 정한 이유" },
            { id: "rule",       text: "앞으로 AI를 쓸 때 내가 지킬 기준 한 가지" }
          ],
          placeholders: [
            "예: 사실 자료 찾기 → AI 맡기기, 독후감 → 직접 하기, 아이디어 → 함께 하기",
            "예: 자료 찾기는 AI가 빠르고 정확한데, 내 생각을 쓰는 건 AI가 대신 못 해서요.",
            "예: AI가 해준 것도 한 번 더 확인하고, 내 생각은 직접 쓴다."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "delegation",  label: "위임 판단",   description: "과제 유형별로 AI 적합성을 비교 판단했는가" },
          { id: "execution",   label: "실행과 감독", description: "AI에게 실제로 맡기고 결과를 비교·검증했는가" },
          { id: "strategy",    label: "전략 수립",   description: "비교 경험에 기반한 실행 가능한 전략을 세웠는가" },
          { id: "reflection",  label: "판단 성찰",   description: "AI와 인간의 역할 차이를 이해하고 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "AI 위임 전략표 완성!",
        message: "AI와 직접 비교해보고, 과제별 AI 활용 전략을 세웠어요.",
        summaryLabels: {
          step1: "비교 과제",
          step2: "AI 수행 결과",
          step3: "내가 직접 한 결과",
          step4: "비교 판정",
          step5: "위임 전략표"
        },
        artifact: {
          bindingKey: "m_1_m_strategy",
          template: "[위임 전략]\n{step5_strategy}\n\n[이유]\n{step5_reason}\n\n[나의 기준]\n{step5_rule}"
        }
      }
    },

    // =====================================================================
    // M-1-H | 고학년 (5~6학년)
    // 역할: 학생 AI 사용 가이드 편찬자 | 산출물: AI 사용 가이드 초안
    // =====================================================================
    upper: {
      cardCode: "M-1-H",
      performanceType: "SJ",
      ksa: { K: ["K3.1", "K3.2", "K4.1"], S: ["Problem Solving"], A: ["Responsible"] },
      description: "다양한 학습 상황에서 AI 활용의 적합성을 체계적으로 평가하고, 학교 AI 사용 가이드를 작성하는 미션이에요.",

      scenario: {
        role: "학생 AI 사용 가이드 편찬자",
        goal: "다양한 학습 상황에서 AI 활용 적합성을 실험·평가하고 가이드 초안을 작성한다.",
        context: "학교에서 학생들을 위한 'AI 사용 가이드'를 만들기로 했어요. 어떤 학습 상황에서 AI를 쓰면 효과적이고, 어떤 상황에서는 오히려 방해가 되는지 체계적으로 정리해야 해요. 편찬자로서 직접 실험하고 기준을 세워 가이드를 만들어봅시다.",
        artifactType: "AI 사용 가이드 초안"
      },

      intro: [
        { text: "학교에서 학생들을 위한 AI 사용 가이드를 만들어요!\n어떤 때 AI를 쓰면 좋고, 언제 주의해야 할까요?", emoji: "📖" },
        { text: "편찬자로서 직접 실험해보고,\n근거 있는 가이드를 만들어야 해요.", emoji: "🔬" },
        { text: "실험 → 비교 → 기준 수립 → 가이드 작성\n순서로 진행합니다.", emoji: "📝" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 효과적으로 쓰려면 상황별로 판단할 수 있어야 해요. 체계적인 기준 없이 쓰면 학습 효과가 오히려 떨어질 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "과제의 성격(사실 확인 vs 사고력 발휘), AI의 역량과 한계, 학습 목표와의 부합성을 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI에 의존하면 비판적 사고력이 약해지고, AI가 틀린 것도 그대로 받아들이게 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 평가 기준 수립",
          question: "AI 활용 적합성을 판단할 기준을 먼저 세워보세요. 3개 이상 고르세요.",
          hint: "정확성, 학습 효과, 창의성, 효율성, 윤리성 등 다양한 관점을 생각하세요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "accuracy",     label: "정확성 — AI가 정확한 답을 주는가" },
            { id: "learning",     label: "학습 효과 — 내가 배울 수 있는가" },
            { id: "creativity",   label: "독창성 — 나만의 생각이 필요한가" },
            { id: "efficiency",   label: "효율성 — 시간을 아낄 수 있는가" },
            { id: "ethics",       label: "윤리성 — AI를 쓰는 게 정당한가" },
            { id: "verification", label: "검증 가능성 — 결과를 확인할 수 있는가" },
            { id: "human_needed", label: "인간 판단 필요성 — 사람만의 판단이 필요한가" }
          ],
          validation: { required: true, minSelections: 3 }
        },
        {
          id: "step2",
          title: "STEP 2 · AI 실험 1: 사실 확인 과제",
          question: "사실을 확인하는 과제를 AI에게 맡겨보세요.",
          hint: "예: '대한민국 광역시 7개를 알려줘', '광합성의 과정을 설명해줘'",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년(5~6학년) 학생의 학습 과제를 돕는 AI입니다. 학생이 요청한 사실 확인 과제를 정확하고 간결하게 수행하세요. 5~7문장 이내. 한국어로 답변.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 400,
            temperature: 0.5,
            fallback: { options: ["대한민국의 7대 광역시는 부산, 대구, 인천, 광주, 대전, 울산, 세종입니다."] }
          },
          studentInputLabel: "사실 확인 과제 맡기기",
          studentInputPlaceholder: "예: 대한민국 광역시 7개를 알려줘",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · AI 실험 2: 의견·판단 과제",
          question: "이번에는 의견이나 판단이 필요한 과제를 AI에게 맡겨보세요.",
          hint: "예: '학교에서 핸드폰을 써도 될까? 찬반 의견을 써줘', '가장 좋은 친구란 어떤 친구일까?'",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년 학생의 의견 과제를 돕는 AI입니다. 학생이 요청한 주제에 대해 균형 잡힌 의견을 제시하세요. 5~7문장 이내. 한국어로.",
            userPromptTemplate: "{step3_input}",
            outputSchema: "text",
            maxTokens: 400,
            temperature: 0.8,
            fallback: { options: ["학교에서 핸드폰 사용에 대해 찬성과 반대 의견이 있습니다. 찬성 측은 비상 연락과 학습 도구 활용을, 반대 측은 집중력 저하와 사이버 문제를 이야기합니다."] }
          },
          studentInputLabel: "의견·판단 과제 맡기기",
          studentInputPlaceholder: "예: 학교에서 핸드폰을 써도 될까?",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 실험 결과 비교 평가",
          question: "두 실험 결과를 STEP 1에서 세운 기준으로 평가해보세요.",
          hint: "같은 기준으로 실험 1(사실 확인)과 실험 2(의견·판단)를 각각 평가하세요.",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step1", mode: "highlight" },
          cases: [
            { id: "exp1", title: "실험 1: 사실 확인 과제", description: "AI가 수행한 사실 확인 결과를 기준으로 평가" },
            { id: "exp2", title: "실험 2: 의견·판단 과제", description: "AI가 수행한 의견·판단 결과를 기준으로 평가" }
          ],
          judgmentOptions: [
            { id: "appropriate",   label: "AI 맡기기 적합" },
            { id: "with_caution",  label: "조건부 활용" },
            { id: "not_suitable",  label: "직접 수행 권장" }
          ],
          allowText: true,
          textPlaceholder: "이 판단의 근거를 step1 기준과 연결해 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step5",
          title: "STEP 5 · AI 사용 가이드 작성",
          question: "실험 결과를 종합해서 학교 AI 사용 가이드 3~5개 조항을 작성하세요.",
          hint: "각 조항은 '~할 때는 AI를 ~하게 활용한다' 형식으로 구체적으로 쓰세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step4", mode: "highlight" },
          questions: [
            { id: "rule_1", text: "[1조항] AI 맡기기 적합한 상황" },
            { id: "rule_2", text: "[2조항] 주의하며 활용할 상황" },
            { id: "rule_3", text: "[3조항] 직접 수행해야 하는 상황" },
            { id: "rule_4", text: "[4조항] (선택) 추가 원칙" },
            { id: "rule_5", text: "[5조항] (선택) 추가 원칙" }
          ],
          placeholders: [
            "예: 사실 확인(수도·인구·과학 용어 등)은 AI에게 맡기고, 결과를 교과서로 한 번 더 확인한다.",
            "예: 아이디어가 필요할 때 AI의 제안을 참고하되, 최종 선택과 정리는 내가 한다.",
            "예: 내 생각·감정·경험을 써야 하는 과제(일기·독후감·편지)는 반드시 직접 쓴다.",
            "",
            ""
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "criteria",    label: "기준 수립",   description: "AI 활용 판단 기준을 체계적으로 세웠는가" },
          { id: "delegation",  label: "위임 판단",   description: "과제 유형별 AI 적합성을 실험으로 비교 평가했는가" },
          { id: "execution",   label: "실행과 감독", description: "AI에게 실제로 맡기고 결과를 검증했는가" },
          { id: "strategy",    label: "전략 수립",   description: "실험 근거에 기반한 실행 가능한 가이드를 작성했는가" },
          { id: "reflection",  label: "판단 성찰",   description: "AI의 역량·한계와 인간의 역할 차이를 이해하고 있는가" }
        ]
      },

      submit: {
        title: "AI 사용 가이드 완성!",
        message: "직접 실험하고 비교해서, 근거 있는 AI 사용 가이드를 만들었어요.",
        summaryLabels: {
          step1: "평가 기준",
          step2: "실험 1 결과",
          step3: "실험 2 결과",
          step4: "비교 평가",
          step5: "가이드 조항"
        },
        artifact: {
          bindingKey: "m_1_h_guide",
          template: "[AI 사용 가이드]\n{step5_rule_1}\n{step5_rule_2}\n{step5_rule_3}"
        }
      }
    }
  }
};
