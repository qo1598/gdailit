/**
 * LearnAILIT V4 · D-3 시험해 보고 고쳐 보는 AI
 * 시나리오 기반 수행 평가 — Designing AI
 *
 * [Designing 핵심]: AI 모델의 성능을 테스트하고 약점을 발견해 개선안을 제시
 * 학생이 AI 평가자/테스터 관점에서 체계적으로 테스트 케이스를 설계하고 실행한다.
 */

export const D3_V4_SCENARIO = {
  meta: {
    code: "D-3",
    title: "시험해 보고 고쳐 보는 AI",
    domain: "Designing"
  },

  grades: {

    // =====================================================================
    // D-3-L | 저학년 (1~2학년)
    // 역할: AI 품질 점검원 | 산출물: 맞힘/틀림 기록 카드
    // =====================================================================
    lower: {
      cardCode: "D-3-L",
      performanceType: "TD",
      ksa: { K: ["K4.1"], S: ["Critical Thinking"], A: ["Curious"] },
      description: "AI가 맞힌 것과 틀린 것을 직접 확인하고, AI의 강점과 약점을 기록하는 미션이에요.",

      scenario: {
        role: "AI 품질 점검원",
        goal: "AI에게 여러 가지를 물어보고, 맞힌 것과 틀린 것을 기록해 AI의 강점과 약점을 발견한다.",
        context: "새로 나온 AI가 잘 작동하는지 점검해야 해요. 품질 점검원으로서 AI에게 다양한 질문을 던져보고, 잘 맞히는 것과 틀리는 것을 기록해봐요.",
        artifactType: "맞힘/틀림 기록 카드"
      },

      intro: [
        { text: "새로 나온 AI를 점검할 거예요!\n잘 작동하는지 확인해야 해요.", emoji: "🔍" },
        { text: "AI에게 여러 가지를 물어보고\n맞히는지 틀리는지 기록해봐요.", emoji: "📝" },
        { text: "품질 점검원이 되어\nAI의 강점과 약점을 찾아봅시다!", emoji: "✅" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI도 틀릴 수 있어요. 어떤 것을 잘하고 못하는지 알아야 안심하고 쓸 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 어떤 종류의 질문에 잘 답하고, 어떤 질문에 틀리는지 패턴을 찾아봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 항상 맞다고 믿으면 틀린 답을 그대로 쓰게 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 쉬운 질문 던지기",
          question: "AI에게 쉬운 사실 질문을 물어보세요!",
          hint: "예: '사과는 무슨 색이야?', '1+1은?', '강아지는 동물이야?'",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년 학생이 테스트하는 AI입니다. 간단한 사실 질문에 정확히 답변하세요. 2~3문장 이내. 한국어.",
            userPromptTemplate: "{step1_input}",
            outputSchema: "text",
            maxTokens: 100,
            temperature: 0.3,
            fallback: { options: ["사과는 빨간색이에요! 초록 사과도 있어요."] }
          },
          studentInputLabel: "쉬운 질문",
          studentInputPlaceholder: "예: 사과는 무슨 색이야?",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 어려운 질문 던지기",
          question: "이번에는 AI가 틀릴 수 있는 어려운 질문을 던져보세요!",
          hint: "예: '내 마음은 어떤 색이야?', '내일 날씨는?', '가장 맛있는 과일은?' 같이 답이 없거나 주관적인 질문이요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 저학년 학생이 테스트하는 AI입니다. 주관적 질문이나 알 수 없는 질문에도 답변을 시도하세요. 때로는 확실하지 않은 답을 말할 수 있습니다. 2~3문장 이내.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 100,
            temperature: 0.9,
            fallback: { options: ["음, 내일 날씨는... 맑을 것 같아요! (사실 정확히는 모르겠어요)"] }
          },
          studentInputLabel: "어려운 질문",
          studentInputPlaceholder: "예: 내일 날씨는 어떨까?",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 맞힘/틀림 기록",
          question: "AI가 쉬운 질문과 어려운 질문에 각각 어떻게 답했나요?",
          hint: "쉬운 질문은 맞혔나요? 어려운 질문은 어떠나요?",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step1", mode: "highlight" },
          cases: [
            { id: "easy_q",  title: "쉬운 질문 결과", description: "STEP 1에서 물어본 쉬운 질문에 대한 AI 답" },
            { id: "hard_q",  title: "어려운 질문 결과", description: "STEP 2에서 물어본 어려운 질문에 대한 AI 답" }
          ],
          judgmentOptions: [
            { id: "correct",    label: "잘 맞혔어요" },
            { id: "partly",     label: "조금 맞았어요" },
            { id: "wrong",      label: "틀렸어요" },
            { id: "cant_judge", label: "맞는지 모르겠어요" }
          ],
          allowText: true,
          textPlaceholder: "왜 그렇게 판단했는지 짧게 써보세요.",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · AI의 강점과 약점 쓰기",
          question: "점검 결과를 정리해보세요. AI가 잘하는 것과 못하는 것은 무엇인가요?",
          hint: "사실 질문에는 잘 답하는데, 느낌이나 미래 같은 건 잘 모르지 않았나요?",
          uiMode: "free_text",
          placeholder: "예: AI는 사실을 물어보면 잘 답해요. 그런데 내 기분이나 미래는 잘 모르는 것 같아요.",
          validation: { required: true, minLength: 20 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "다양한 유형의 질문을 설계했는가" },
          { id: "test",       label: "실험·검증", description: "AI 답변의 정확성을 판단했는가" },
          { id: "reflection", label: "성찰·개선", description: "AI의 강점과 약점을 구분해 설명했는가" }
        ]
      },

      submit: {
        title: "점검 기록 카드 완성!",
        message: "AI의 강점과 약점을 직접 발견했어요.",
        summaryLabels: { step1: "쉬운 질문", step2: "어려운 질문", step3: "맞힘/틀림", step4: "강점과 약점" },
        artifact: {
          bindingKey: "d_3_l_test",
          template: "[AI 점검 결과]\n{step4}"
        }
      }
    },

    // =====================================================================
    // D-3-M | 중학년 (3~4학년)
    // 역할: AI 테스트 연구원 | 산출물: 테스트 결과 보고서
    // =====================================================================
    middle: {
      cardCode: "D-3-M",
      performanceType: "DS",
      ksa: { K: ["K1.2", "K4.1"], S: ["Problem Solving"], A: ["Adaptable"] },
      description: "AI가 어떤 상황에서 틀리는지 체계적으로 테스트하고, 약점 패턴을 분석하는 미션이에요.",

      scenario: {
        role: "AI 테스트 연구원",
        goal: "AI의 약점을 찾기 위한 테스트 케이스를 설계하고, 결과를 분석해 패턴을 발견한다.",
        context: "AI 연구소에서 새 AI의 성능 테스트를 맡았어요. 단순히 '잘되나 안 되나'가 아니라, '어떤 상황에서 왜 틀리는지' 패턴을 찾아야 해요. 연구원으로서 체계적인 테스트 계획을 세우고 실행해봐요.",
        artifactType: "테스트 결과 보고서"
      },

      intro: [
        { text: "AI 연구소에서 새 AI를 테스트해요!\n그냥 물어보는 게 아니라 체계적으로요.", emoji: "🔬" },
        { text: "어떤 상황에서 잘하고, 어떤 상황에서 틀리는지\n패턴을 찾는 게 목표예요.", emoji: "📊" },
        { text: "테스트 계획 → 실행 → 분석 → 보고\n연구원의 방법으로 진행합니다!", emoji: "📝" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI의 약점을 알아야 언제 믿을 수 있고 언제 조심해야 하는지 판단할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "단순히 맞고 틀리고가 아니라, '왜 틀렸는지', '어떤 유형에서 틀리는지' 패턴을 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 잘하는 영역에서만 쓰면 되는데, 약점을 모르면 틀릴 수 있는 영역에서도 믿게 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 테스트 영역 선택",
          question: "어떤 영역에서 AI를 테스트할지 고르세요. 서로 다른 유형 2개 이상.",
          hint: "사실 확인, 수학, 상식, 감정, 창의성, 최근 뉴스 등 다양한 영역이 있어요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "fact",      label: "사실 확인 (역사, 과학)" },
            { id: "math",      label: "수학 계산" },
            { id: "common",    label: "일상 상식" },
            { id: "emotion",   label: "감정·공감" },
            { id: "creative",  label: "창의적 생각" },
            { id: "recent",    label: "최근 소식" },
            { id: "opinion",   label: "의견·가치 판단" }
          ],
          validation: { required: true, minSelections: 2 }
        },
        {
          id: "step2",
          title: "STEP 2 · 테스트 실행: 영역 A",
          question: "첫 번째 선택한 영역에서 AI를 테스트하세요.",
          hint: "정답을 알고 있는 질문을 던져야 AI가 맞았는지 확인할 수 있어요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학생이 성능 테스트하는 AI입니다. 요청에 정직하게 답변하세요. 틀릴 수 있는 영역에서는 확신 없이 답해도 됩니다. 5문장 이내.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 250,
            temperature: 0.7,
            fallback: { options: ["흥미로운 질문이에요! 제가 알기로는..."] }
          },
          studentInputLabel: "영역 A 테스트",
          studentInputPlaceholder: "예: 세종대왕은 몇 년에 태어났어?",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 테스트 실행: 영역 B",
          question: "두 번째 선택한 영역에서 AI를 테스트하세요.",
          hint: "영역 A와 다른 유형의 질문을 던져보세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 중학년 학생이 성능 테스트하는 AI입니다. 감정, 의견, 창의성 관련 질문에도 답변을 시도하되, 불확실한 부분은 솔직히 표현하세요.",
            userPromptTemplate: "{step3_input}",
            outputSchema: "text",
            maxTokens: 250,
            temperature: 0.8,
            fallback: { options: ["이건 좀 어려운 질문이네요. 제 생각에는..."] }
          },
          studentInputLabel: "영역 B 테스트",
          studentInputPlaceholder: "예: 친구가 슬퍼하면 어떻게 위로해야 해?",
          allowRetry: true,
          maxRetries: 2,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 테스트 결과 분석",
          question: "두 영역의 테스트 결과를 비교하세요. AI는 어떤 영역에서 더 잘하고, 어떤 영역에서 약한가요?",
          hint: "정확성, 자신감, 답변의 깊이를 비교해보세요.",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step1", mode: "highlight" },
          cases: [
            { id: "area_a", title: "영역 A 테스트 결과", description: "첫 번째 영역에서 AI가 보인 성능" },
            { id: "area_b", title: "영역 B 테스트 결과", description: "두 번째 영역에서 AI가 보인 성능" }
          ],
          judgmentOptions: [
            { id: "strong",   label: "강점 (잘함)" },
            { id: "moderate", label: "보통" },
            { id: "weak",     label: "약점 (못함)" }
          ],
          allowText: true,
          textPlaceholder: "왜 그렇게 판단했는지, 어떤 패턴을 발견했는지 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step5",
          title: "STEP 5 · 테스트 보고서 작성",
          question: "연구원으로서 테스트 결과 보고서를 작성하세요.",
          hint: "강점, 약점, 약점의 원인 추정, 사용자에게 권장 사항을 포함하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step4", mode: "highlight" },
          questions: [
            { id: "strengths",     text: "[강점] AI가 잘하는 영역과 이유" },
            { id: "weaknesses",    text: "[약점] AI가 못하는 영역과 이유" },
            { id: "why_weak",      text: "[원인 추정] 왜 그 영역에서 약한지 추정" },
            { id: "recommendation",text: "[권장 사항] 이 AI를 쓸 때 주의할 점" }
          ],
          placeholders: [
            "예: 사실 확인(역사 연도, 과학 용어)에서 정확하고 빨랐어요.",
            "예: 감정이나 공감이 필요한 질문에서는 표면적인 답만 했어요.",
            "예: AI는 데이터로 배우는데, 감정은 데이터로 배우기 어려워서 그런 것 같아요.",
            "예: 사실 확인에는 활용하되, 감정이나 판단이 필요한 상황에서는 사람에게 물어보세요."
          ],
          validation: { required: true, minAnswered: 4 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "서로 다른 유형의 테스트를 체계적으로 설계했는가" },
          { id: "test",       label: "실험·검증", description: "테스트를 실행하고 결과를 정확히 관찰했는가" },
          { id: "iteration",  label: "반복·개선", description: "약점의 원인을 추정하고 권장 사항을 제시했는가" },
          { id: "connection", label: "AI 연결",   description: "AI의 학습 방식과 약점의 관계를 이해했는가" }
        ]
      },

      submit: {
        title: "테스트 보고서 완성!",
        message: "AI의 강점과 약점을 체계적으로 분석했어요.",
        summaryLabels: { step1: "테스트 영역", step2: "영역 A 결과", step3: "영역 B 결과", step4: "비교 분석", step5: "보고서" },
        artifact: {
          bindingKey: "d_3_m_report",
          template: "[강점] {step5_strengths}\n[약점] {step5_weaknesses}\n[원인] {step5_why_weak}\n[권장] {step5_recommendation}"
        }
      }
    },

    // =====================================================================
    // D-3-H | 고학년 (5~6학년)
    // 역할: AI 모델 평가 엔지니어 | 산출물: 평가 기준표 + 성능 분석 보고서
    // =====================================================================
    upper: {
      cardCode: "D-3-H",
      performanceType: "DS",
      ksa: { K: ["K1.2", "K4.1"], S: ["Problem Solving", "Critical Thinking"], A: ["Adaptable"] },
      description: "AI 모델의 성능을 평가할 기준을 설계하고, 체계적 테스트로 성능을 분석하는 미션이에요.",

      scenario: {
        role: "AI 모델 평가 엔지니어",
        goal: "평가 기준표를 설계하고, 체계적 테스트로 AI 성능을 분석해 개선 제언을 담은 보고서를 작성한다.",
        context: "AI 회사에서 새 모델의 성능 평가를 맡았어요. 엔지니어로서 '무엇을, 어떤 기준으로, 어떻게 테스트할지' 평가 체계를 설계하고, 실제 테스트를 진행해 성능 보고서를 완성해야 해요.",
        artifactType: "평가 기준표 + 성능 분석 보고서"
      },

      intro: [
        { text: "AI 회사에서 새 모델의 성능 평가를 맡았어요!\n체계적인 평가 기준이 필요해요.", emoji: "⚙️" },
        { text: "단순히 '잘된다/안 된다'가 아니라\n기준별로 점수를 매기는 평가를 할 거예요.", emoji: "📊" },
        { text: "기준 설계 → 테스트 실행 → 성능 분석 → 개선 제언\n순서로 진행합니다.", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 개선하려면 어디가 약한지 객관적으로 측정할 수 있어야 해요. 평가 기준이 있어야 비교·개선이 가능해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "평가 기준이 공정한지, 테스트가 다양한 상황을 포함하는지, 결과 해석이 논리적인지 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "쉬운 테스트만 하면 AI가 잘한다고 착각하고, 실제 사용에서 문제가 터져요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 평가 기준표 설계",
          question: "AI를 어떤 기준으로 평가할지 기준표를 먼저 설계하세요.",
          hint: "정확성, 응답 속도, 어려운 질문 대처, 편향 여부, 모르는 것 인정 등을 고려하세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "criterion_1", text: "[기준 1] 평가 항목과 측정 방법" },
            { id: "criterion_2", text: "[기준 2] 평가 항목과 측정 방법" },
            { id: "criterion_3", text: "[기준 3] 평가 항목과 측정 방법" },
            { id: "criterion_4", text: "[기준 4] (선택) 평가 항목과 측정 방법" }
          ],
          placeholders: [
            "예: 정확성 — 사실 질문 10개 중 몇 개를 맞히는지 (정답률)",
            "예: 불확실성 인정 — 모르는 질문에 '모르겠다'고 답하는지 아닌지",
            "예: 공정성 — 같은 질문을 다른 관점(남자 주인공 vs 여자 주인공)으로 바꿨을 때 답이 달라지는지",
            ""
          ],
          validation: { required: true, minAnswered: 3 }
        },
        {
          id: "step2",
          title: "STEP 2 · 테스트 실행 1: 정확성 테스트",
          question: "정답을 알고 있는 질문 3개를 AI에게 물어보세요.",
          hint: "역사, 과학, 수학 등 정답이 명확한 질문을 3번 나눠서 물어보세요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년 학생이 성능 테스트하는 AI입니다. 정직하게 답변하세요. 가끔 약간의 오류를 포함할 수 있습니다. 5문장 이내.",
            userPromptTemplate: "{step2_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.5,
            fallback: { options: ["좋은 질문이에요! 제가 알기로는..."] }
          },
          studentInputLabel: "정확성 테스트",
          studentInputPlaceholder: "예: 대한민국의 첫 번째 대통령은 누구야?",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 테스트 실행 2: 한계 테스트",
          question: "AI가 어려워할 만한 질문을 던져보세요. 감정, 최신 정보, 윤리적 판단 등.",
          hint: "AI가 잘 못할 것 같은 영역을 공략해보세요. 이게 약점을 찾는 핵심이에요.",
          uiMode: "ai_chat_turn",
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 성능 테스트 대상 AI입니다. 어려운 질문에도 답변을 시도하되, 불확실한 부분은 솔직히 표현하세요. 때로는 자신 있게 틀린 답을 할 수도 있습니다.",
            userPromptTemplate: "{step3_input}",
            outputSchema: "text",
            maxTokens: 300,
            temperature: 0.8,
            fallback: { options: ["이건 정말 어려운 질문이네요. 제가 생각하기에는... 하지만 확실하지 않아요."] }
          },
          studentInputLabel: "한계 테스트",
          studentInputPlaceholder: "예: 이 상황에서 가장 윤리적인 선택은 뭐야?",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 기준별 성능 평가",
          question: "STEP 1에서 세운 기준으로 테스트 결과를 평가하세요.",
          hint: "각 기준에 대해 AI가 어떤 수준인지 구체적으로 평가하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "eval_1", text: "[기준 1 평가] 결과와 점수/수준" },
            { id: "eval_2", text: "[기준 2 평가] 결과와 점수/수준" },
            { id: "eval_3", text: "[기준 3 평가] 결과와 점수/수준" },
            { id: "overall", text: "[종합 평가] 전체적인 성능 수준" }
          ],
          placeholders: [
            "예: 정확성 — 사실 질문 3개 중 2개 정답 (67%). 한 개는 연도를 틀림.",
            "예: 불확실성 인정 — 어려운 질문에 '확실하지 않다'고 한 번 말함. 하지만 다른 질문에서는 확신 있게 틀렸음.",
            "예: 공정성 — 이번 테스트에서는 확인 못함 (추가 테스트 필요).",
            "예: 사실 확인은 양호하나, 윤리적 판단과 불확실성 인정은 부족. 보완 필요."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step5",
          title: "STEP 5 · 개선 제언 작성",
          question: "평가 결과를 바탕으로, 이 AI를 어떻게 개선하면 좋을지 제언하세요.",
          hint: "데이터 보강, 안전장치 추가, 사용자 안내 개선 등을 생각해보세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "improve_data",   text: "[데이터 측면] 어떤 데이터를 더 학습시키면 좋을지" },
            { id: "improve_safety", text: "[안전 측면] 어떤 안전장치를 추가하면 좋을지" },
            { id: "improve_user",   text: "[사용자 측면] 사용자에게 어떤 안내가 필요한지" }
          ],
          placeholders: [
            "예: 최신 정보와 감정 관련 대화 데이터를 더 학습시키면 약점이 보완될 것 같아요.",
            "예: 확실하지 않은 답에는 자동으로 '확인이 필요해요' 표시를 붙이는 기능.",
            "예: '이 AI는 감정 상담에는 적합하지 않습니다' 같은 사용 범위 안내."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성",   description: "평가 기준이 체계적이고 다양한 관점을 포함하는가" },
          { id: "test",       label: "실험·검증",   description: "정확성 테스트와 한계 테스트를 모두 수행했는가" },
          { id: "iteration",  label: "반복·개선",   description: "기준별 평가가 구체적이고 근거가 있는가" },
          { id: "connection", label: "AI 연결",     description: "약점의 원인을 AI 학습 방식과 연결해 이해했는가" },
          { id: "fairness",   label: "공정성 인식", description: "공정성·안전성 관점의 평가를 시도했는가" }
        ]
      },

      submit: {
        title: "성능 분석 보고서 완성!",
        message: "체계적 평가 기준으로 AI 성능을 분석하고 개선 제언까지 완성했어요.",
        summaryLabels: { step1: "평가 기준", step2: "정확성 테스트", step3: "한계 테스트", step4: "기준별 평가", step5: "개선 제언" },
        artifact: {
          bindingKey: "d_3_h_evaluation",
          template: "[평가 기준]\n{step1}\n\n[종합 평가]\n{step4_overall}\n\n[개선 제언]\n데이터: {step5_improve_data}\n안전: {step5_improve_safety}\n사용자: {step5_improve_user}"
        }
      }
    }
  }
};
