/**
 * LearnAILIT V4 · C-1 AI와 아이디어 만들기
 * 시나리오 기반 수행 평가 — C영역 공통 인터페이스 적용
 *
 * [공통 인터페이스]
 * scenario  : role / goal / context / artifactType
 * branch    : sourceStepId / filterBy / mode
 * feedback  : onCorrect / onWrong / onMiss
 * artifact  : bindingKey / template (submit 안)
 * rubric    : axes 배열
 * aiCall    : 실시간 AI 호출 (provider / mode / systemPrompt / userPromptTemplate)
 */

export const C1_V4_SCENARIO = {
  meta: {
    code: "C-1",
    title: "AI와 아이디어 만들기",
    domain: "Creating",
    ksa: { K: ["K1.3"], S: ["Creativity"], A: ["Innovative"] }
  },

  grades: {

    // =====================================================================
    // C-1-L | 저학년 (1~2학년)
    // 역할: 도서관 그림책 작가 | 산출물: 그림책 한 장면 초안
    // =====================================================================
    lower: {
      cardCode: "C-1-L",
      performanceType: "TD",
      description: "AI와 번갈아 문장을 이어 쓰며 그림책 한 장면을 완성하는 미션이에요.",

      scenario: {
        role: "도서관 그림책 작가",
        goal: "AI와 번갈아 문장을 이어 쓰며 그림책 한 장면 초안을 완성한다.",
        context: "학교 도서관에서 '우리 반 한 장 그림책' 전시를 열기로 했어요. 학생들은 각자 한 장면씩 맡아 짧은 이야기를 만들어야 해요. AI가 아이디어를 도와줄 수 있지만, 어떤 주인공이 나오고 어떤 일이 벌어지는지는 작가인 내가 정해야 해요.",
        artifactType: "그림책 한 장면 초안"
      },

      intro: [
        { text: "도서관에서 우리 반 그림책 전시를 열어요!\n여러분이 오늘 맡을 한 장면을 만들어볼 거예요.", emoji: "📖" },
        { text: "AI가 옆에서 아이디어를 도와줄 거예요.\n그런데 이야기의 주인공과 내용은 작가인 여러분이 정해야 해요!", emoji: "✍️" },
        { text: "AI와 번갈아 문장을 써서 한 장면을 완성해봅시다.\n마지막에 가장 마음에 드는 문장도 골라볼 거예요.", emoji: "🌟" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 쓰면 아이디어를 더 빨리 넓힐 수 있지만, 이야기를 어떻게 만들지 정하는 사람은 나라는 점을 경험하기 위해서예요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 도와준 문장 중에서도 내 이야기와 잘 맞는지, 주인공과 상황이 흔들리지 않는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 제안한 말을 그대로 따라가다 보면 이야기의 주인공과 흐름이 내 생각과 달라질 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 주인공 정하기",
          question: "어떤 주인공이 나오는 이야기를 쓸까요?",
          hint: "내가 좋아하는 동물이나 캐릭터를 떠올려 보세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "puppy",    label: "길 잃은 강아지",  emoji: "🐶" },
            { id: "bird",     label: "작은 새",         emoji: "🐦" },
            { id: "robot",    label: "친절한 로봇",     emoji: "🤖" },
            { id: "cat",      label: "호기심 많은 고양이", emoji: "🐱" },
            { id: "child",    label: "용감한 아이",     emoji: "🧒" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 장소 정하기",
          question: "이야기는 어디에서 벌어질까요?",
          hint: "주인공과 어울리는 장소를 골라보세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "playground", label: "비 오는 놀이터", emoji: "🎠" },
            { id: "forest",     label: "깊은 숲속",      emoji: "🌲" },
            { id: "beach",      label: "노을 지는 바다", emoji: "🌊" },
            { id: "school",     label: "아침의 학교",    emoji: "🏫" },
            { id: "city",       label: "밤의 도시",      emoji: "🌃" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 내가 첫 문장 쓰기",
          question: "이야기의 첫 문장을 직접 써보세요!",
          hint: "주인공이 어디에서 무엇을 하고 있는지 한 문장으로 써보세요. 예: \"비 오는 놀이터에서 작은 강아지가 벤치 밑에 숨어 있었어요.\"",
          uiMode: "free_text",
          placeholder: "예: 비 오는 놀이터에서 작은 강아지가 벤치 밑에 숨어 있었어요.",
          validation: { required: true, minLength: 10 }
        },
        {
          id: "step4",
          title: "STEP 4 · AI가 이어 준 문장 중 고르기",
          question: "AI가 다음 문장 후보 3개를 보여줘요. 마음에 드는 문장을 고르거나 다시 요청해보세요!",
          hint: "그대로 골라도 되고, 내 말로 다시 써도 돼요.",
          uiMode: "ai_option_picker",
          aiCall: {
            provider: "claude",
            mode: "completion",
            systemPrompt: "당신은 초등 저학년(1~2학년) 그림책 작가를 돕는 창작 파트너입니다. 학생이 쓴 첫 문장을 이어서 자연스럽게 전개되는 짧은 문장 3개를 제안하세요. 각 문장은 15자 이상 30자 이하로 쉽고 따뜻하게 써야 합니다. 학생의 문장 속 주인공·장소·분위기를 유지해야 합니다.",
            userPromptTemplate: "주인공: {step1}\n장소: {step2}\n첫 문장: {step3}\n\n이 문장에 이어질 자연스러운 다음 문장 3개를 제안해 주세요. 번호 없이 각 문장을 한 줄씩 작성해 주세요.",
            outputSchema: "options_list",
            maxTokens: 200,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "그때 따뜻한 손이 다가와 강아지를 꼭 안아 주었어요.",
                "작은 강아지는 고개를 들고 주위를 두리번거렸어요.",
                "멀리서 반가운 발소리가 점점 가까워졌어요."
              ]
            }
          },
          optionCount: 3,
          allowRegenerate: true,
          allowCustomInput: true,
          customInputLabel: "내 말로 직접 쓰기",
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · 장면 마무리 문장 쓰기",
          question: "장면을 마무리하는 마지막 문장을 써보세요.",
          hint: "주인공에게 어떤 일이 일어났는지, 어떤 기분이었는지 한 문장으로 써보세요.",
          uiMode: "free_text",
          placeholder: "예: 강아지는 따뜻한 품속에서 스르르 잠이 들었어요.",
          validation: { required: true, minLength: 10 }
        },
        {
          id: "step6",
          title: "STEP 6 · 가장 마음에 드는 문장 고르기",
          question: "완성된 장면에서 내가 가장 남기고 싶은 문장 하나를 고르고, 그 이유를 써보세요.",
          hint: "\"나는 ___ 문장을 남겼다. 왜냐하면 ___.\" 형식으로 써도 좋아요.",
          uiMode: "free_text",
          // step3, step4, step5 결과를 참조해 가장 인상적인 문장 선택
          branch: { sourceStepId: "step3", mode: "highlight" },
          placeholder: "예: 나는 \"강아지는 따뜻한 품속에서 스르르 잠이 들었어요\"를 남겼어요. 왜냐하면 강아지가 행복해진 느낌이 들어서예요.",
          validation: { required: true, minLength: 20 }
        }
      ],

      rubric: {
        axes: [
          { id: "intent",       label: "의도 설정", description: "주인공과 장소를 분명히 정했는가" },
          { id: "ai_use",       label: "AI 활용",   description: "AI 문장 중 이야기 흐름에 맞는 것을 골랐는가" },
          { id: "contribution", label: "자기 기여", description: "최종 장면에 학생의 의도가 반영되는가" }
        ]
      },

      submit: {
        title: "그림책 한 장면 완성!",
        message: "AI와 함께 아이디어를 넓히면서도, 이야기를 만드는 작가는 나라는 걸 경험했어요.",
        summaryLabels: {
          step1: "주인공",
          step2: "장소",
          step3: "내가 쓴 첫 문장",
          step4: "AI와 함께 고른 문장",
          step5: "내가 쓴 마무리 문장",
          step6: "가장 남기고 싶은 문장"
        },
        artifact: {
          bindingKey: "c_1_l_scene",
          template: "[{step1} / {step2}]\n{step3}\n{step4}\n{step5}\n\n— 내가 남긴 한 문장: {step6}"
        }
      }
    },

    // =====================================================================
    // C-1-M | 중학년 (3~4학년)
    // 역할: 학급 신문 이야기 코너 기자 | 산출물: 완성 이야기 초안
    // =====================================================================
    middle: {
      cardCode: "C-1-M",
      performanceType: "TD",
      description: "AI가 제안한 줄거리를 비교·선택하고, 내 말로 짧은 이야기를 완성하는 미션이에요.",

      scenario: {
        role: "학급 신문 이야기 코너 기자",
        goal: "AI가 낸 줄거리 후보를 비교해 채택안을 고르고, 내 말로 짧은 이야기 초안을 완성한다.",
        context: "학급 신문에 '이번 달 짧은 이야기' 코너를 넣으려고 해요. 독자는 우리 반 친구들이라 너무 어렵거나 엉뚱하면 안 돼요. AI는 줄거리 아이디어를 여러 개 줄 수 있지만, 어떤 분위기와 결말로 갈지는 기자인 내가 정해야 해요.",
        artifactType: "완성 이야기 초안"
      },

      intro: [
        { text: "학급 신문에 실을 짧은 이야기를 만들어봅시다!\n독자는 우리 반 친구들이에요.", emoji: "📰" },
        { text: "AI가 줄거리 아이디어를 여러 개 줄 거예요.\n그중에서 우리 반에 가장 어울리는 방향을 기자가 정해야 해요.", emoji: "🎯" },
        { text: "AI 줄거리를 그대로 복사하지 말고,\n내 말로 다시 정리해서 이야기 초안을 완성해봅시다!", emoji: "✨" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 아이디어를 풍부하게 줄 수 있어도, 독자와 목적에 맞는 방향을 잡는 일은 사람이 해야 해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 줄거리가 우리 반 친구들에게 이해하기 쉽고 재미있는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI 제안을 그대로 쓰면 독자와 맞지 않거나 이야기 흐름이 너무 복잡해질 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 독자와 주제 정하기",
          question: "어떤 독자를 위해, 어떤 주제의 이야기를 쓸까요?",
          hint: "우리 반 친구들이 공감할 수 있는 주제를 골라보세요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "friendship",   label: "친구를 돕는 용기" },
            { id: "mistake",      label: "실수로 배우는 이야기" },
            { id: "adventure",    label: "작은 모험" },
            { id: "kindness",     label: "따뜻한 마음" },
            { id: "curiosity",    label: "호기심과 발견" },
            { id: "overcome",     label: "두려움 이겨내기" }
          ],
          validation: { required: true, minSelections: 1, maxSelections: 2 }
        },
        {
          id: "step2",
          title: "STEP 2 · AI에게 줄거리 받기",
          question: "선택한 주제로 AI가 줄거리 후보 3개를 만들어줄 거예요.",
          hint: "각 후보는 시작-갈등-해결 구조로 나와요. 마음에 드는 것이 없으면 다시 요청할 수 있어요.",
          uiMode: "ai_option_picker",
          aiCall: {
            provider: "claude",
            mode: "completion",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학급 신문 기자를 돕는 창작 파트너입니다. 학생이 고른 주제로 우리 반 친구들이 읽기 좋은 짧은 이야기 줄거리 3개를 제안하세요. 각 줄거리는 '시작 → 갈등 → 해결' 3단계로 2~3문장씩, 총 80자 내외로 간결하게 써야 합니다. 폭력적이거나 무서운 내용은 피하고, 3~4학년이 이해할 수 있는 어휘를 쓰세요.",
            userPromptTemplate: "주제: {step1}\n\n이 주제로 우리 반 3~4학년 친구들이 읽을 짧은 이야기 줄거리 3개를 제안해 주세요. 각 후보는 아래 형식으로 작성해 주세요:\n\n[시작] ...\n[갈등] ...\n[해결] ...",
            outputSchema: "options_list",
            maxTokens: 500,
            temperature: 0.8,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "[시작] 민수는 새로 전학 온 친구 지호가 쉬는 시간에 혼자 앉아 있는 걸 봤다.\n[갈등] 같이 놀자고 말하고 싶지만 용기가 안 났다.\n[해결] 민수는 자신이 좋아하는 그림책을 지호에게 내밀며 \"같이 볼래?\"라고 말했다.",
                "[시작] 서연이는 그림 그리기 대회에 나가기로 했다.\n[갈등] 연습하다 실수로 도화지를 찢고 말았다.\n[해결] 찢어진 부분을 나비 모양으로 오려 붙여 더 멋진 작품을 완성했다.",
                "[시작] 준호는 학교 뒤뜰에서 본 적 없는 작은 새를 발견했다.\n[갈등] 새는 날개를 다친 것 같았다.\n[해결] 선생님과 함께 새를 동물 보호 센터로 보내주었다."
              ]
            }
          },
          optionCount: 3,
          allowRegenerate: true,
          allowCustomInput: false,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 후보 비교하기",
          question: "AI가 만든 줄거리 후보를 기준에 맞춰 점검해보세요.",
          hint: "각 후보마다 '우리 반에 어울리는지', '흐름이 자연스러운지', '결말이 분명한지' 판단해보세요.",
          uiMode: "per_case_judge",
          // step2 결과(AI 줄거리 3개)를 케이스로 가져옴
          branch: { sourceStepId: "step2", mode: "filter" },
          judgmentLabel: "이 줄거리는 어때요?",
          judgmentOptions: [
            { id: "good",    label: "딱 맞아요" },
            { id: "okay",    label: "괜찮아요" },
            { id: "not_fit", label: "우리 반엔 안 맞아요" }
          ],
          reasonLabel: "그렇게 판단한 이유는?",
          reasonOptions: [
            { id: "fits_class",   label: "우리 반 친구들이 공감할 만해요" },
            { id: "natural_flow", label: "이야기 흐름이 자연스러워요" },
            { id: "clear_end",    label: "결말이 분명해요" },
            { id: "too_complex",  label: "너무 복잡해요" },
            { id: "not_relatable",label: "우리 반 상황과 거리가 있어요" },
            { id: "weak_end",     label: "결말이 약해요" }
          ],
          reasonMulti: true,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 채택안 1개와 보류안 1개 정하기",
          question: "가장 좋은 채택안 하나와 아쉬운 보류안 하나를 고르고, 각각 이유를 짧게 써보세요.",
          hint: "STEP 3에서 '딱 맞아요'로 평가한 것이 채택 후보예요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          questions: [
            { id: "adopt",        text: "채택안 — 어떤 줄거리를 고르겠어요?" },
            { id: "adopt_reason", text: "채택 이유" },
            { id: "hold",         text: "보류안 — 어떤 줄거리를 보류하겠어요?" },
            { id: "hold_reason",  text: "보류 이유" }
          ],
          placeholders: [
            "예: 1번 줄거리 (민수와 지호 이야기)",
            "예: 우리 반 친구들도 비슷한 경험이 있어서 공감이 잘 될 것 같아요.",
            "예: 3번 줄거리 (새 이야기)",
            "예: 흥미롭지만 우리 반 일상과 거리가 있어서 나중에 쓰면 좋겠어요."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step5",
          title: "STEP 5 · 내 말로 이야기 초안 쓰기",
          question: "AI 줄거리를 그대로 쓰지 말고, 내 말로 정리해 5~7문장 이야기로 완성해보세요.",
          hint: "등장인물 이름을 바꾸거나, 장소를 우리 학교로 바꿔도 좋아요. AI의 아이디어를 바탕으로 내 이야기를 만들어봐요!",
          uiMode: "free_text",
          branch: { sourceStepId: "step4", mode: "highlight" },
          placeholder: "예: 우리 반에 새로 전학 온 지호는 쉬는 시간마다 혼자 창가에 앉아 있었다. 민수는 같이 놀자고 말하고 싶었지만 용기가 나지 않았다. ...",
          validation: { required: true, minLength: 80 }
        }
      ],

      rubric: {
        axes: [
          { id: "intent",       label: "의도 설정", description: "독자와 주제를 분명히 잡았는가" },
          { id: "ai_use",       label: "AI 활용",   description: "AI 후보를 기준으로 비교·선택했는가" },
          { id: "contribution", label: "자기 기여", description: "최종 초안이 AI 복사가 아닌 재구성인가" }
        ]
      },

      submit: {
        title: "짧은 이야기 초안 완성!",
        message: "AI 아이디어를 내 말로 재구성해 우리 반 독자에게 맞는 이야기를 만들었어요.",
        summaryLabels: {
          step1: "주제",
          step2: "AI 줄거리 후보",
          step3: "후보 평가",
          step4: "채택/보류 결정",
          step5: "내 말로 쓴 이야기 초안"
        },
        artifact: {
          bindingKey: "c_1_m_story",
          template: "주제: {step1}\n\n{step5}"
        }
      }
    },

    // =====================================================================
    // C-1-H | 고학년 (5~6학년)
    // 역할: 학교 축제 웹소설 부스 기획자 | 산출물: 웹소설 기획안 + 기여도 성찰
    // =====================================================================
    upper: {
      cardCode: "C-1-H",
      performanceType: "SJ",
      description: "AI와 플롯을 확장하되 작품의 주제와 판단은 내가 결정하고, AI 도움 범위와 자기 기여를 성찰하는 미션이에요.",

      scenario: {
        role: "학교 축제 웹소설 부스 기획자",
        goal: "AI와 협업해 플롯을 확장하되 기획자로서 최종 판단을 내리고, AI 도움 범위와 내 기여를 성찰한다.",
        context: "학교 축제에 '학생 창작 웹소설 기획 부스'를 운영해요. 짧은 웹소설 콘셉트, 등장인물, 갈등, 결말을 포스터로 전시해야 해요. AI는 플롯 확장을 도와줄 수 있지만, 작품의 주제와 반전은 기획자가 책임지고 정해야 해요.",
        artifactType: "웹소설 기획안 + 기여도 성찰"
      },

      intro: [
        { text: "학교 축제에 웹소설 기획 부스를 열어요!\n포스터에 작품 기획안을 전시해야 해요.", emoji: "📝" },
        { text: "AI와 여러 번 대화하면서 플롯을 확장할 수 있어요.\n하지만 작품의 핵심 주제와 반전은 기획자가 정해야 해요.", emoji: "🎭" },
        { text: "마지막에 AI가 어디까지 도왔고,\n내가 어떤 고유한 판단을 내렸는지 구체적으로 성찰해봅시다.", emoji: "💭" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI와 협업해도 작품의 핵심 의도, 메시지, 선택 책임은 인간에게 있다는 점을 경험하기 위해서예요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 낸 플롯이 흥미롭더라도 작품의 주제와 독자층에 맞는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI 아이디어가 많아질수록 오히려 작품의 방향성이 흐려질 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 작품 기획 기준 세우기",
          question: "작품의 기본 기준을 먼저 정해요. 독자, 장르, 포함할 요소와 피할 요소를 구체적으로 써보세요.",
          hint: "이 기준이 분명해야 AI 아이디어 중에서 선택할 때 흔들리지 않아요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "audience", text: "독자는 누구인가? (예: 초등 고학년 / 중학생 / 가족 관람객)" },
            { id: "genre",    text: "장르는 무엇인가? (예: 판타지, 미스터리, 성장물)" },
            { id: "include",  text: "꼭 포함할 요소 2~3개" },
            { id: "avoid",    text: "피할 요소 1~2개" }
          ],
          placeholders: [
            "예: 초등 고학년",
            "예: 성장 판타지",
            "예: 우정, 작은 모험, 따뜻한 결말",
            "예: 폭력적 장면, 너무 복잡한 세계관"
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · AI와 플롯 확장하기 (1차)",
          question: "STEP 1 기준에 맞는 작품 아이디어를 AI에게 요청해보세요.",
          hint: "AI에게 던질 구체적인 질문을 쓰세요. 예: \"초등 고학년 대상 성장 판타지인데, 주인공이 우정을 배우는 플롯을 3개 추천해줘\"",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "claude",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년(5~6학년) 학생의 웹소설 기획을 돕는 창작 파트너입니다. 학생이 세운 기획 기준(독자·장르·포함할 요소·피할 요소)을 엄격히 존중하면서, 흥미로운 플롯 후보와 갈등 구조를 제안하세요. 아이디어를 제안할 뿐이지 결정은 학생이 내린다는 태도를 유지하세요. 답변은 300자 이내로 간결하게 하세요.",
            userPromptTemplate: "[기획 기준]\n독자: {step1_audience}\n장르: {step1_genre}\n포함할 요소: {step1_include}\n피할 요소: {step1_avoid}\n\n[학생의 질문]\n{step2_input}",
            outputSchema: "text",
            maxTokens: 500,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "기준에 맞는 플롯 아이디어 3가지를 제안드릴게요. 1) 비밀 도서관에서 오래된 책 속 세계로 들어가는 주인공이 책 속 친구와 우정을 쌓는 이야기. 2) 평범한 학교에 나타난 신비한 전학생의 정체를 함께 찾아가는 미스터리. 3) 잃어버린 기억을 되찾기 위해 친구들과 모험을 떠나는 성장물. 어떤 방향이 끌리세요?"
              ]
            }
          },
          studentInputLabel: "AI에게 던질 질문",
          studentInputPlaceholder: "예: 초등 고학년 성장 판타지인데, 우정을 배우는 플롯 3개를 추천해주세요.",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · AI와 플롯 확장하기 (2차)",
          question: "이어서 갈등 구조나 반전 아이디어를 더 확장해보세요.",
          hint: "1차에서 받은 답변을 바탕으로, '이 플롯의 반전은 뭐가 좋을까?', '주인공의 가장 큰 갈등은?' 같은 추가 질문을 던져보세요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step2", mode: "highlight" },
          aiCall: {
            provider: "claude",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년 학생의 웹소설 기획을 돕는 창작 파트너입니다. 이전 대화의 맥락을 이어서, 학생의 추가 질문에 대해 구체적인 갈등 구조나 반전 아이디어를 2~3개 제안하세요. 답변은 300자 이내로 하세요.",
            userPromptTemplate: "[이전 대화 맥락]\n학생 질문: {step2_input}\nAI 답변: {step2_aiResponse}\n\n[학생의 새 질문]\n{step3_input}",
            outputSchema: "text",
            maxTokens: 500,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "반전 아이디어 2가지를 제안드려요. 1) 주인공이 도움을 주던 친구가 사실 같은 세계에서 온 또 다른 길잃은 여행자였다는 설정. 2) 모험을 이끌던 안내자가 주인공 자신의 미래 모습이었다는 반전. 어느 쪽이 작품 분위기에 맞을까요?"
              ]
            }
          },
          studentInputLabel: "추가 질문",
          studentInputPlaceholder: "예: 이 플롯에 어울리는 반전 아이디어를 제안해주세요.",
          allowRetry: true,
          maxRetries: 3,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 후보 평가표 작성",
          question: "지금까지 AI와 나눈 아이디어 중 마음에 드는 후보들을 4가지 기준으로 평가해보세요.",
          hint: "주제 적합성, 독자 적합성, 반전의 설득력, 전시용 요약 가능성을 고려하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          questions: [
            { id: "theme_fit",      text: "주제 적합성 — 내 기획 주제와 얼마나 잘 맞나요?" },
            { id: "audience_fit",   text: "독자 적합성 — 정한 독자층이 좋아할까요?" },
            { id: "twist_power",    text: "반전의 설득력 — 반전이 자연스럽고 설득력 있나요?" },
            { id: "poster_summary", text: "전시 요약 가능성 — 한두 줄로 요약할 수 있나요?" }
          ],
          placeholders: [
            "예: 주인공의 우정 성장이라는 핵심 주제와 잘 맞아요.",
            "예: 초등 고학년이 공감할 상황이에요.",
            "예: 반전이 인위적이지 않고 앞부분과 자연스럽게 연결돼요.",
            "예: '책 속 세계로 떠난 두 친구의 우정 이야기'로 요약 가능해요."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step5",
          title: "STEP 5 · 최종 기획안 작성",
          question: "작품 제목, 한 줄 소개, 주요 등장인물, 중심 갈등, 결말 방향을 정리해 포스터용 기획안을 완성하세요.",
          hint: "AI 아이디어를 참고하되, 내 판단으로 재구성해 쓰세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "title",       text: "작품 제목" },
            { id: "logline",     text: "한 줄 소개" },
            { id: "characters",  text: "주요 등장인물 (2~3명)" },
            { id: "conflict",    text: "중심 갈등" },
            { id: "ending",      text: "결말 방향" }
          ],
          placeholders: [
            "예: 도서관의 비밀 문",
            "예: 비 오는 날 도서관에서 발견한 문 너머의 친구, 그리고 우리만의 비밀.",
            "예: 주인공 은재(6학년, 책을 좋아함), 책 속에서 온 친구 하루",
            "예: 하루를 원래 세계로 돌려보내야 하는지, 함께 있을지 선택해야 함",
            "예: 은재가 스스로 이별을 선택하고 성장하는 열린 결말"
          ],
          validation: { required: true, minAnswered: 5 }
        },
        {
          id: "step6",
          title: "STEP 6 · AI 도움 범위 표시",
          question: "이번 작품에서 AI가 어느 영역을 도와줬고, 내가 어느 영역을 주도했는지 체크해보세요.",
          hint: "솔직하게 표시하는 것이 중요해요. 대부분 AI가 도운 영역과 내가 주도한 영역이 나뉘어 있어요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "ai_theme_idea",       label: "[AI] 주제 아이디어 확장" },
            { id: "ai_character",        label: "[AI] 등장인물 설정 제안" },
            { id: "ai_conflict",         label: "[AI] 갈등 구조 아이디어" },
            { id: "ai_twist",            label: "[AI] 반전 아이디어" },
            { id: "ai_phrasing",         label: "[AI] 문구 다듬기" },
            { id: "me_audience",         label: "[내가] 독자 결정" },
            { id: "me_theme_decision",   label: "[내가] 최종 주제 결정" },
            { id: "me_message",          label: "[내가] 작품 메시지 결정" },
            { id: "me_selection",        label: "[내가] 후보 중 선택" },
            { id: "me_restructure",      label: "[내가] 구성 재구성" },
            { id: "me_ending",           label: "[내가] 결말 방향 결정" }
          ],
          validation: { required: true, minSelections: 3 }
        },
        {
          id: "step7",
          title: "STEP 7 · 나의 고유한 판단 성찰",
          question: "이 작품에서 \"나의 고유한 판단\"이 가장 잘 드러난 부분은 어디인가요? 한 문장으로 써보세요.",
          hint: "AI가 도와줬지만, 결정적으로 내가 결정했다고 느끼는 부분을 떠올려보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step6", mode: "highlight" },
          placeholder: "예: 이 작품에서 나의 고유한 판단이 가장 잘 드러난 부분은 '이별을 택하는 열린 결말'이다. AI는 해피엔딩 여러 개를 제안했지만, 나는 주인공이 성장하려면 아쉬움이 남는 이별이 필요하다고 생각했다.",
          validation: { required: true, minLength: 40 }
        }
      ],

      rubric: {
        axes: [
          { id: "intent",         label: "의도 설정",      description: "작품 기획 기준이 분명한가" },
          { id: "ai_use",         label: "AI 활용",        description: "AI 제안을 기준에 따라 비교·선택했는가" },
          { id: "contribution",   label: "자기 기여",      description: "최종 기획안에 학생의 판단이 드러나는가" },
          { id: "responsibility", label: "책임 있는 공유", description: "AI 도움 범위와 자기 기여를 성찰적으로 구분했는가" }
        ]
      },

      submit: {
        title: "웹소설 기획안 완성!",
        message: "AI와 협업하면서도 작품의 핵심 판단은 내가 내린다는 것을 경험했어요.",
        summaryLabels: {
          step1: "기획 기준",
          step2: "AI 플롯 확장 1차",
          step3: "AI 플롯 확장 2차",
          step4: "후보 평가표",
          step5: "최종 기획안",
          step6: "AI 도움 범위",
          step7: "나의 고유한 판단"
        },
        artifact: {
          bindingKey: "c_1_h_novel_plan",
          template: "[작품 기획안]\n제목: {step5_title}\n한 줄 소개: {step5_logline}\n등장인물: {step5_characters}\n중심 갈등: {step5_conflict}\n결말 방향: {step5_ending}\n\n[성찰]\n{step7}"
        }
      }
    }
  }
};
