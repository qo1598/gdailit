/**
 * LearnAILIT V4 · M-4 AI와 함께 쓰는 약속
 * 시나리오 기반 수행 평가 — Managing AI
 *
 * [Managing 핵심]: 사용 거버넌스 수립 (governance)
 * 실제 AI를 써보면서 겪은 문제 경험을 바탕으로
 * 우리 반/학교의 AI 사용 규칙을 직접 만든다.
 */

export const M4_V4_SCENARIO = {
  meta: {
    code: "M-4",
    title: "AI와 함께 쓰는 약속",
    domain: "Managing"
  },

  grades: {

    // =====================================================================
    // M-4-L | 저학년 (1~2학년)
    // 역할: 우리 반 AI 규칙 지킴이 | 산출물: AI 약속 카드
    // =====================================================================
    lower: {
      cardCode: "M-4-L",
      performanceType: "TD",
      ksa: { K: ["K5.4"], S: ["Self and Social Awareness"], A: ["Responsible"] },
      description: "AI를 실제로 써보고, 지켜야 할 약속을 만드는 미션이에요.",

      scenario: {
        role: "우리 반 AI 규칙 지킴이",
        goal: "AI를 직접 써보면서 어떤 약속이 필요한지 발견하고, 우리 반 AI 약속 카드를 만든다.",
        context: "우리 반에서 AI를 쓸 수 있게 됐어요! 그런데 규칙 없이 쓰면 문제가 생길 수 있어요. AI를 직접 써보고, 어떤 약속이 필요한지 직접 찾아서 우리 반 AI 약속을 만들어봐요.",
        artifactType: "AI 약속 카드"
      },

      intro: [
        { text: "우리 반에서 AI를 쓸 수 있게 됐어요!\n그런데 규칙 없이 쓰면 어떻게 될까요?", emoji: "🤖" },
        { text: "AI를 직접 써보면서\n어떤 약속이 필요한지 찾아볼 거예요.", emoji: "🔍" },
        { text: "규칙 지킴이로서\n우리 반 AI 약속을 만들어봅시다!", emoji: "📜" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "규칙 없이 AI를 쓰면 잘못된 정보를 믿거나, 내 정보가 위험해질 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI를 쓸 때 불편하거나 이상한 점을 찾아야 해요. 그게 규칙이 필요한 이유예요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "다 맞다고 믿거나, 개인정보를 알려주거나, 다른 친구에게 피해를 줄 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI 체험하기",
          question: "AI에게 자유롭게 질문해보세요! 뭐든 물어봐도 돼요.",
          hint: "좋아하는 것, 궁금한 것을 자유롭게 물어보세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년(1~2학년) 학생과 자유롭게 대화하는 AI입니다. 친절하고 쉬운 말로 답변하세요. 3~4문장 이내. 때때로 일부러 약간 부정확한 정보를 섞어도 됩니다 (예: '강아지는 20시간씩 잔다' 같은 가벼운 오류). 한국어.",
            userPromptTemplate: "{step1_input}",
            outputSchema: "text",
            maxTokens: 150,
            temperature: 0.9,
            fallback: { options: ["좋은 질문이에요! 강아지는 하루에 약 12~14시간 자요. 아기 강아지는 더 많이 자기도 해요!"] }
          },
          studentInputLabel: "자유롭게 질문하기",
          studentInputPlaceholder: "예: 강아지는 하루에 몇 시간 자?",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 이상한 점 찾기",
          question: "AI 답변에서 이상하거나 걱정되는 점이 있었나요?",
          hint: "답이 틀린 것 같거나, AI가 이상한 말을 했거나, 내 정보를 물어봤거나 한 적이 있나요?",
          uiMode: "multi_select_chips",
          branch: { sourceStepId: "step1", mode: "highlight" },
          chips: [
            { id: "wrong_answer",  label: "답이 틀린 것 같았어요" },
            { id: "asked_info",    label: "내 개인정보를 물어봤어요" },
            { id: "too_long",      label: "말이 너무 길었어요" },
            { id: "hard_words",    label: "어려운 말을 썼어요" },
            { id: "felt_weird",    label: "뭔가 이상한 느낌이 들었어요" },
            { id: "nothing_wrong", label: "이상한 점 없었어요" }
          ],
          validation: { required: true, minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 약속 카드 고르기",
          question: "AI를 쓸 때 지켜야 할 약속을 골라보세요. 2개 이상 골라야 해요.",
          hint: "step2에서 찾은 이상한 점을 해결할 수 있는 약속을 골라보세요.",
          uiMode: "multi_select_chips",
          branch: { sourceStepId: "step2", mode: "highlight" },
          chips: [
            { id: "check_answer",  label: "AI 답을 그대로 믿지 않고 확인한다", emoji: "✅" },
            { id: "no_personal",   label: "이름, 전화번호, 주소는 알려주지 않는다", emoji: "🔒" },
            { id: "ask_adult",     label: "이상하면 어른에게 물어본다", emoji: "👨‍👩‍👧" },
            { id: "kind_use",      label: "나쁜 말이나 거짓말을 시키지 않는다", emoji: "💛" },
            { id: "my_think",      label: "생각은 내가 직접 한다", emoji: "🧠" },
            { id: "share_honest",  label: "AI가 도와줬으면 솔직하게 말한다", emoji: "🤝" }
          ],
          validation: { required: true, minSelections: 2 }
        },
        {
          id: "step4",
          title: "STEP 4 · 가장 중요한 약속 쓰기",
          question: "고른 약속 중 가장 중요한 것 하나를 내 말로 다시 써보세요.",
          hint: "왜 이 약속이 가장 중요한지도 한 문장으로 써보세요.",
          uiMode: "free_text",
          placeholder: "예: AI 답을 그대로 믿지 않고 확인해야 해요. 왜냐하면 AI도 틀릴 수 있으니까요.",
          validation: { required: true, minLength: 20 }
        }
      ],

      rubric: {
        axes: [
          { id: "execution",   label: "실행과 감독", description: "AI를 직접 써보고 문제를 발견했는가" },
          { id: "risk_mgmt",   label: "위험 관리",   description: "발견한 문제와 연결되는 약속을 골랐는가" },
          { id: "governance",  label: "규칙 수립",   description: "약속의 중요성을 자기 말로 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "AI 약속 카드 완성!",
        message: "AI를 직접 써보고 우리 반에 필요한 약속을 만들었어요.",
        summaryLabels: { step1: "AI 체험", step2: "발견한 문제", step3: "고른 약속", step4: "가장 중요한 약속" },
        artifact: {
          bindingKey: "m_4_l_promise",
          template: "[우리 반 AI 약속]\n가장 중요한 약속: {step4}"
        }
      }
    },

    // =====================================================================
    // M-4-M | 중학년 (3~4학년)
    // 역할: 학급 AI 사용 위원 | 산출물: 학급 AI 사용 규칙 초안
    // =====================================================================
    middle: {
      cardCode: "M-4-M",
      performanceType: "SJ",
      ksa: { K: ["K5.4", "K3.3"], S: ["Communication"], A: ["Responsible"] },
      description: "AI를 써보면서 겪은 문제 상황을 분석하고, 학급 AI 사용 규칙을 만드는 미션이에요.",

      scenario: {
        role: "학급 AI 사용 위원",
        goal: "AI 사용 중 겪을 수 있는 문제 상황을 실험으로 확인하고, 학급 AI 사용 규칙을 작성한다.",
        context: "학급에서 AI 활용이 많아지면서, AI 사용 규칙이 필요해졌어요. 위원으로서 실제 문제 상황을 확인하고, 친구들이 따를 수 있는 규칙을 만들어야 해요. 단순히 '조심하자'가 아닌, 구체적이고 실행 가능한 규칙이 필요해요.",
        artifactType: "학급 AI 사용 규칙 초안"
      },

      intro: [
        { text: "학급에서 AI를 많이 쓰게 됐어요.\n그런데 규칙이 없으면 문제가 생길 수 있어요.", emoji: "⚠️" },
        { text: "위원으로서 실제로 AI를 써보면서\n어떤 문제가 생길 수 있는지 확인할 거예요.", emoji: "🔍" },
        { text: "경험에서 나온 규칙이\n가장 좋은 규칙이에요!", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 쓰면서 생길 수 있는 문제를 미리 알고 대비해야 해요. 규칙은 경험에서 나와야 실천할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 틀리는 경우, 개인정보 위험, 과도한 의존, 공정성 문제를 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI를 맹신하거나, 다른 친구에게 피해를 주거나, 자기 능력을 키울 기회를 놓칠 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 문제 상황 실험하기",
          question: "AI에게 일부러 어려운 상황을 만들어보세요. 어떤 문제가 생기는지 관찰해요.",
          hint: "예: 틀린 정보를 진짜처럼 물어보기, 숙제를 대신 해달라고 하기, 친구 험담을 써달라고 하기",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학생과 대화하는 AI입니다. 학생의 요청에 답변하되, 비윤리적 요청(남 험담, 거짓 정보 생성 등)에는 '이건 좋지 않은 요청이에요'라고 친절히 안내하세요. 때때로 가벼운 사실 오류를 포함할 수 있습니다. 5문장 이내.",
            userPromptTemplate: "{step1_input}",
            outputSchema: "text",
            maxTokens: 250,
            temperature: 0.8,
            fallback: { options: ["흥미로운 질문이네요! 하지만 이건 정확하지 않은 정보를 만드는 것이라 도와드리기 어려워요."] }
          },
          studentInputLabel: "문제 상황 만들어보기",
          studentInputPlaceholder: "예: 내 숙제를 대신 써줘 / 지구는 네모나다고 말해줘",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 문제 분석하기",
          question: "실험에서 발견한 문제를 분류해보세요.",
          hint: "어떤 종류의 문제였는지 골라보세요. 여러 개 고를 수 있어요.",
          uiMode: "multi_select_chips",
          branch: { sourceStepId: "step1", mode: "highlight" },
          chips: [
            { id: "false_info",     label: "틀린 정보를 줄 수 있음" },
            { id: "privacy_risk",   label: "개인정보 위험이 있음" },
            { id: "dependency",     label: "너무 의존하게 될 수 있음" },
            { id: "unfair_use",     label: "불공정하게 쓸 수 있음" },
            { id: "harmful_content",label: "나쁜 내용을 만들 수 있음" },
            { id: "no_learning",    label: "내가 배울 기회를 뺏김" },
            { id: "responsibility", label: "누가 책임지는지 불분명" }
          ],
          validation: { required: true, minSelections: 2 }
        },
        {
          id: "step3",
          title: "STEP 3 · 상황별 행동 판단하기",
          question: "다음 상황에서 어떻게 하는 것이 맞을까요?",
          hint: "각 상황에서 AI를 어떻게 활용하는 것이 적절한지 판단하세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "homework_copy", title: "친구가 AI에게 독후감을 대신 써달라고 한다",      description: "독후감은 내 생각을 쓰는 과제예요." },
            { id: "fact_check",    title: "AI가 알려준 역사 정보로 발표 자료를 만든다",      description: "AI가 알려준 정보가 맞는지 확인 안 한 상태예요." },
            { id: "idea_help",     title: "프로젝트 아이디어가 안 떠올라 AI에게 힌트를 받는다", description: "AI 힌트를 참고하되 내가 골라서 발전시키려 해요." },
            { id: "gossip",        title: "AI에게 친구를 놀리는 글을 써달라고 한다",          description: "재미로 하려는 거예요." }
          ],
          judgmentOptions: [
            { id: "appropriate",    label: "적절함" },
            { id: "needs_caution",  label: "주의 필요" },
            { id: "inappropriate",  label: "부적절함" }
          ],
          allowText: true,
          textPlaceholder: "왜 그렇게 판단했는지 짧게 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 학급 AI 사용 규칙 만들기",
          question: "실험과 판단을 바탕으로 학급 AI 사용 규칙을 4개 이상 만들어보세요.",
          hint: "step2에서 발견한 문제와 step3에서 판단한 내용을 규칙으로 바꿔보세요. '~한다', '~하지 않는다' 형식으로 구체적으로.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "rule_1", text: "[규칙 1] 정보 확인에 관한 규칙" },
            { id: "rule_2", text: "[규칙 2] 개인정보 보호에 관한 규칙" },
            { id: "rule_3", text: "[규칙 3] 과제·학습에 관한 규칙" },
            { id: "rule_4", text: "[규칙 4] 다른 사람에 대한 배려 규칙" },
            { id: "rule_5", text: "[규칙 5] (선택) 추가 규칙" }
          ],
          placeholders: [
            "예: AI가 알려준 정보는 반드시 교과서나 선생님으로 한 번 더 확인한다.",
            "예: AI에게 내 이름, 전화번호, 주소, 비밀번호를 절대 알려주지 않는다.",
            "예: 내 생각을 써야 하는 과제(일기, 독후감, 편지)는 AI에게 맡기지 않는다.",
            "예: AI에게 다른 사람을 놀리거나 괴롭히는 내용을 만들라고 시키지 않는다.",
            ""
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step5",
          title: "STEP 5 · 규칙의 가장 중요한 이유",
          question: "만든 규칙 중 가장 중요한 것 하나를 고르고, 왜 중요한지 써보세요.",
          hint: "이 규칙이 없으면 어떤 문제가 생기는지 생각해보세요.",
          uiMode: "free_text",
          placeholder: "예: '정보 확인' 규칙이 가장 중요해요. 왜냐하면 AI가 틀린 정보를 주면 발표에서 잘못된 내용을 말하게 되고, 그건 결국 내 책임이니까요.",
          validation: { required: true, minLength: 40 }
        }
      ],

      rubric: {
        axes: [
          { id: "execution",   label: "실행과 감독", description: "문제 상황을 실험으로 직접 확인했는가" },
          { id: "risk_mgmt",   label: "위험 관리",   description: "문제 유형을 체계적으로 분류했는가" },
          { id: "governance",  label: "규칙 수립",   description: "경험 기반의 구체적·실행 가능한 규칙을 만들었는가" },
          { id: "reflection",  label: "판단 성찰",   description: "규칙의 필요성을 근거 있게 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "학급 AI 사용 규칙 완성!",
        message: "직접 실험하고 분석해서 경험 기반의 규칙을 만들었어요.",
        summaryLabels: { step1: "문제 실험", step2: "문제 분류", step3: "상황 판단", step4: "규칙 초안", step5: "가장 중요한 이유" },
        artifact: {
          bindingKey: "m_4_m_rules",
          template: "[학급 AI 사용 규칙]\n1. {step4_rule_1}\n2. {step4_rule_2}\n3. {step4_rule_3}\n4. {step4_rule_4}\n\n가장 중요한 이유: {step5}"
        }
      }
    },

    // =====================================================================
    // M-4-H | 고학년 (5~6학년)
    // 역할: 학교 AI 사용 규정 제정위원 | 산출물: AI 사용 규정 + 시행 계획
    // =====================================================================
    upper: {
      cardCode: "M-4-H",
      performanceType: "SJ",
      ksa: { K: ["K5.4", "K3.3", "K5.1"], S: ["Communication"], A: ["Empathetic"] },
      description: "다양한 이해관계자 관점을 반영한 학교 AI 사용 규정과 시행 계획을 수립하는 미션이에요.",

      scenario: {
        role: "학교 AI 사용 규정 제정위원",
        goal: "학생·교사·학부모 관점을 반영한 학교 AI 사용 규정을 만들고 시행 계획을 수립한다.",
        context: "학교에서 AI 사용에 관한 공식 규정을 만들기로 했어요. 제정위원으로서 학생만이 아니라 교사와 학부모의 입장도 고려해야 해요. AI를 직접 활용하면서 겪은 문제와 가능성을 모두 반영한 균형 잡힌 규정이 필요해요.",
        artifactType: "AI 사용 규정 + 시행 계획"
      },

      intro: [
        { text: "학교 AI 사용 규정을 만드는 위원에 선정됐어요!\n이 규정은 학교 전체에 적용돼요.", emoji: "🏫" },
        { text: "학생, 교사, 학부모 — 세 입장을 모두 고려해야 해요.\n한쪽 입장만 반영하면 좋은 규정이 아니에요.", emoji: "⚖️" },
        { text: "AI를 직접 써보고 문제를 경험한 뒤,\n균형 잡힌 규정을 만들어봅시다.", emoji: "📜" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 규정은 여러 사람에게 영향을 미치기 때문에, 다양한 관점을 반영해야 공정하고 실효성 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "같은 규칙이라도 학생·교사·학부모 입장에서 다르게 느껴질 수 있으므로 균형을 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "한쪽 입장만 반영하면 반발이 생기거나, 규정이 지켜지지 않을 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI 문제 체험",
          question: "제정위원으로서 AI의 문제점을 직접 체험해보세요. AI에게 여러 요청을 보내보고 문제를 발견해요.",
          hint: "사실 확인, 과제 대행, 민감한 주제 등 다양하게 시도해보세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년(5~6학년) 학생과 대화하는 AI입니다. 일반 요청에는 친절히 답변하되, 때때로 약간의 사실 오류를 포함하세요. 비윤리적 요청에는 부드럽게 거절하되 왜 어려운지 설명하세요. 5문장 이내.",
            userPromptTemplate: "{step1_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.8,
            fallback: { options: ["흥미로운 질문이에요! 하지만 이 주제는 정확한 정보가 중요해서, 선생님이나 교과서로 확인해보는 게 좋겠어요."] }
          },
          studentInputLabel: "문제 체험하기",
          studentInputPlaceholder: "예: 세종대왕이 한글을 만든 이유를 알려줘 / 내 숙제를 대신 써줘",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 이해관계자별 관점 분석",
          question: "AI 사용에 대해 학생·교사·학부모 각각의 관점에서 생각해보세요.",
          hint: "각 입장에서 '가장 걱정되는 점'과 '가장 기대하는 점'을 써보세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "student_concern", text: "[학생 관점] AI 사용에서 가장 걱정되는 점" },
            { id: "student_hope",    text: "[학생 관점] AI로 가장 기대되는 점" },
            { id: "teacher_concern", text: "[교사 관점] 학생 AI 사용에서 가장 걱정되는 점" },
            { id: "teacher_hope",    text: "[교사 관점] AI가 교육에 도움 될 점" },
            { id: "parent_concern",  text: "[학부모 관점] 자녀 AI 사용에서 가장 걱정되는 점" },
            { id: "parent_hope",     text: "[학부모 관점] AI가 자녀에게 도움 될 점" }
          ],
          placeholders: [
            "예: 틀린 정보를 그대로 믿을 수 있어요.",
            "예: 어려운 개념을 쉽게 알려줘서 공부에 도움 돼요.",
            "예: 학생이 AI에 의존해서 생각하는 힘이 약해질까 걱정돼요.",
            "예: 개별 학생에게 맞춤형 설명을 줄 수 있어요.",
            "예: 아이가 혼자 AI를 쓸 때 부적절한 내용에 노출될까 걱정돼요.",
            "예: 공부할 때 모르는 것을 바로 물어볼 수 있어서 좋아요."
          ],
          validation: { required: true, minAnswered: 6 }
        },
        {
          id: "step3",
          title: "STEP 3 · 규정 조항 만들기",
          question: "세 관점을 모두 반영해 학교 AI 사용 규정 5개 조항을 만들어보세요.",
          hint: "학생·교사·학부모 중 한쪽만 유리한 규정이 아닌, 모두가 동의할 수 있는 규정을 쓰세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "rule_1", text: "[1조] 정보 확인 및 검증에 관한 규정" },
            { id: "rule_2", text: "[2조] 개인정보 및 안전에 관한 규정" },
            { id: "rule_3", text: "[3조] 학습 및 과제에 관한 규정" },
            { id: "rule_4", text: "[4조] AI 사용의 투명성에 관한 규정" },
            { id: "rule_5", text: "[5조] 다른 사람 배려 및 공정성에 관한 규정" }
          ],
          placeholders: [
            "예: AI가 제공한 정보는 교과서, 백과사전, 또는 교사에게 확인한 후 사용한다.",
            "예: 이름, 연락처, 주소 등 개인정보를 AI에게 입력하지 않는다.",
            "예: 자기 생각·감정을 표현하는 과제에는 AI를 직접 사용하지 않되, 참고 자료 조사에는 활용할 수 있다.",
            "예: AI의 도움을 받은 부분은 과제 제출 시 명확히 표시한다.",
            "예: AI에게 다른 사람을 비방하거나 차별하는 내용을 요청하지 않는다."
          ],
          validation: { required: true, minAnswered: 5 }
        },
        {
          id: "step4",
          title: "STEP 4 · 시행 계획 수립",
          question: "이 규정이 실제로 지켜지려면 어떤 계획이 필요한가요?",
          hint: "누가, 어떻게 점검하고, 안 지켰을 때는 어떻게 할지 생각하세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "how_inform",   text: "[안내 방법] 이 규정을 어떻게 알릴 것인가" },
            { id: "how_monitor",  text: "[점검 방법] 규정 준수를 어떻게 확인할 것인가" },
            { id: "how_handle",   text: "[위반 대응] 규정을 어기면 어떻게 할 것인가" },
            { id: "how_update",   text: "[규정 개정] AI가 바뀌면 규정도 바꿔야 할 때 어떻게 할 것인가" }
          ],
          placeholders: [
            "예: 학기 초에 학급 회의에서 설명하고, 교실에 게시한다.",
            "예: 월 1회 자기 점검표를 작성하고, 교사와 함께 검토한다.",
            "예: 첫 번째는 안내, 두 번째는 교사 상담, 반복 시 학부모 알림.",
            "예: 학기마다 학급 회의에서 규정 개정 여부를 투표로 결정한다."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step5",
          title: "STEP 5 · 제정 위원 소감",
          question: "규정을 만들면서 가장 어려웠던 점과, 이 규정이 학교에 왜 필요한지 한 문단으로 써보세요.",
          hint: "여러 입장을 조율한 경험과, AI 규정의 사회적 의미를 연결해보세요.",
          uiMode: "free_text",
          placeholder: "예: 학생은 자유롭게 쓰고 싶고, 학부모는 걱정되고, 교사는 학습 효과를 중시해서 균형 잡기가 어려웠다. 하지만 규정이 있어야 모두가 안심하고 AI를 활용할 수 있고, 문제가 생겨도 해결할 기준이 있다는 점에서 꼭 필요하다고 생각한다.",
          validation: { required: true, minLength: 80 }
        }
      ],

      rubric: {
        axes: [
          { id: "execution",   label: "실행과 감독", description: "AI 문제를 직접 체험하고 근거를 확보했는가" },
          { id: "risk_mgmt",   label: "위험 관리",   description: "다양한 이해관계자 관점의 우려를 분석했는가" },
          { id: "governance",  label: "규칙 수립",   description: "균형 잡힌 규정과 실행 계획을 만들었는가" },
          { id: "strategy",    label: "전략 수립",   description: "시행·점검·개정까지 포함한 지속 가능 체계인가" },
          { id: "reflection",  label: "판단 성찰",   description: "규정의 사회적 의미와 자기 경험을 연결했는가" }
        ]
      },

      submit: {
        title: "학교 AI 사용 규정 완성!",
        message: "다양한 관점을 반영한 균형 잡힌 AI 사용 규정을 만들었어요.",
        summaryLabels: { step1: "문제 체험", step2: "관점 분석", step3: "규정 조항", step4: "시행 계획", step5: "제정 소감" },
        artifact: {
          bindingKey: "m_4_h_regulation",
          template: "[학교 AI 사용 규정]\n제1조 {step3_rule_1}\n제2조 {step3_rule_2}\n제3조 {step3_rule_3}\n제4조 {step3_rule_4}\n제5조 {step3_rule_5}\n\n[제정 위원 소감]\n{step5}"
        }
      }
    }
  }
};
