/**
 * LearnAILIT V4 · C-1 AI와 아이디어 만들기
 * 시나리오 기반 수행 평가 — C영역 공통 인터페이스 적용
 *
 * [공통 인터페이스]
 * scenario  : role / goal / context / artifactType / image
 * branch    : sourceStepId / filterBy / mode
 * feedback  : 사용 최소화 (정답/오답 구조가 있는 step만)
 * artifact  : submit.artifact.template (stepN, stepN_field 치환 지원)
 * rubric    : axes 배열
 * aiCall    : 실시간 AI 호출 (provider: gemini-text / imagen)
 */

export const C1_V4 = {
  meta: {
    code: "C-1",
    title: "AI와 아이디어 만들기",
    domain: "Creating",
  },

  grades: {

    // =====================================================================
    // C-1-L | 저학년 (1~2학년)
    // 역할: 도서관 그림책 작가 | 산출물: 그림책 한 장면 초안
    // =====================================================================
    lower: {
      cardCode: "C-1-L",
      performanceType: "GC",
      ksa: { K: ["K1.3"], S: ["Creativity"], A: ["Innovative"] },
      description: "AI와 번갈아 문장을 이어 쓰며 그림책 한 장면을 완성하는 미션이에요.",

      scenario: {
        role: "도서관 그림책 작가",
        goal: "AI와 번갈아 문장을 이어 쓰며 그림책 한 장면 초안을 완성한다.",
        context: "학교 도서관에서 '우리 반 한 장 그림책' 전시를 열기로 했어요. 학생들은 각자 한 장면씩 맡아 짧은 이야기를 만들어야 해요. AI가 아이디어를 도와줄 수 있지만, 어떤 주인공이 나오고 어떤 일이 벌어지는지는 작가인 내가 정해야 해요.",
        artifactType: "그림책 한 장면 초안",
        image: "/images/c1l/scenario.png"
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
            { id: "puppy",    label: "길 잃은 강아지",    emoji: "🐶" },
            { id: "bird",     label: "작은 새",           emoji: "🐦" },
            { id: "robot",    label: "친절한 로봇",       emoji: "🤖" },
            { id: "cat",      label: "호기심 많은 고양이", emoji: "🐱" },
            { id: "child",    label: "용감한 아이",       emoji: "🧒" }
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
          hint: "주인공이 어디에서 무엇을 하고 있는지 한 문장으로 써보세요.",
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
            provider: "gemini-text",
            mode: "completion",
            systemPrompt: "당신은 초등 저학년(1~2학년) 그림책 작가를 돕는 창작 파트너입니다. 다음 원칙을 반드시 지키세요.\n\n1) 주인공: 학생이 고른 주인공이 '반드시' 다음 문장의 행동이나 감정의 주체여야 합니다. 주인공을 다른 인물로 바꾸지 마세요.\n2) 장소: 학생이 고른 장소의 분위기(예: 비 오는 놀이터의 눅눅함, 깊은 숲속의 고요함, 노을 지는 바다의 따뜻함, 아침 학교의 산뜻함, 밤 도시의 불빛)를 문장 속 감각 묘사로 한 가지만 살짝 녹여 주세요.\n3) 이어짐: 학생이 쓴 첫 문장의 상황에서 '바로 다음에 일어나는 일'이 되어야 합니다. 장면 전환(시간 점프, 장소 이동)을 하지 마세요.\n4) 어휘: 1~2학년이 읽을 수 있는 쉬운 단어만 사용하세요. 한자어·외래어·어려운 말은 피하세요.\n5) 분위기: 따뜻하고 안전한 톤을 유지하세요. 폭력적이거나 무서운 전개는 만들지 마세요.\n6) 길이: 각 문장은 15~35자 사이, 하나의 문장(종결어미 하나)으로 끝내세요.\n7) 출력 형식: 번호·기호·설명 없이 문장 3개만 줄바꿈으로 구분해 출력하세요.",
            userPromptTemplate: "주인공: {step1}\n장소: {step2}\n학생이 쓴 첫 문장: \"{step3}\"\n\n위 주인공이 위 장소에서 이 첫 문장 바로 다음에 할 법한 행동이나 겪을 일을 담은 자연스러운 한국어 문장 3개를 제안해 주세요. 각 문장마다 분위기나 강약을 조금씩 다르게 해서 학생이 고를 수 있도록 해 주세요.",
            outputSchema: "options_list",
            maxTokens: 200,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "그때 따뜻한 손이 다가와 주인공을 꼭 안아 주었어요.",
                "주인공은 고개를 들고 주위를 두리번거렸어요.",
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
          question: "앞에 쓴 두 문장에 이어, 장면을 마무리하는 마지막 문장을 써보세요.",
          hint: "주인공에게 어떤 일이 일어났는지, 어떤 기분이었는지 한 문장으로 써보세요.",
          uiMode: "free_text_with_refs",
          refs: [
            { stepId: "step3", label: "내가 쓴 첫 문장" },
            { stepId: "step4", label: "AI와 함께 고른 문장" }
          ],
          placeholder: "예: 강아지는 따뜻한 품속에서 스르르 잠이 들었어요.",
          validation: { required: true, minLength: 10 }
        },
        {
          id: "step6",
          title: "STEP 6 · 가장 남기고 싶은 문장 고르기",
          question: "완성된 세 문장 중 내가 가장 남기고 싶은 문장 하나를 고르고, 그 이유를 써보세요.",
          hint: "가장 마음에 남는 장면을 떠올려 보세요. 왜 그 문장이 특별한지도 설명해 주세요.",
          uiMode: "sentence_pick_with_reason",
          sources: [
            { stepId: "step3", label: "내가 쓴 첫 문장" },
            { stepId: "step4", label: "AI와 함께 고른 문장" },
            { stepId: "step5", label: "내가 쓴 마무리 문장" }
          ],
          placeholder: "예: 이 문장을 읽으면 강아지가 얼마나 행복해졌는지 내 마음에 그려져서예요.",
          validation: { required: true, minLength: 15 }
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
          template: "— {step1}의 이야기, {step2}에서 —\n\n{step3}\n{step4}\n{step5}\n\n✨ 작가가 가장 남기고 싶은 문장은 \"{step6_pickedText}\" 입니다.\n 왜냐하면 {step6_reason}"
        }
      }
    },

    // =====================================================================
    // C-1-M | 중학년 (3~4학년)
    // 역할: 학급 신문 이야기 코너 기자 | 산출물: 완성 이야기 초안
    // =====================================================================
    middle: {
      cardCode: "C-1-M",
      performanceType: "GC",
      ksa: { K: ["K1.3"], S: ["Creativity", "Collaboration"], A: ["Innovative"] },
      description: "AI가 제안한 줄거리를 비교·선택하고, 내 말로 짧은 이야기를 완성하는 미션이에요.",

      scenario: {
        role: "학급 신문 이야기 코너 기자",
        goal: "AI가 낸 줄거리 후보를 비교해 채택안을 고르고, 내 말로 짧은 이야기 초안을 완성한다.",
        context: "학급 신문에 '이번 달 짧은 이야기' 코너를 넣으려고 해요. 독자는 우리 반 친구들이라 너무 어렵거나 엉뚱하면 안 돼요. AI는 줄거리 아이디어를 여러 개 줄 수 있지만, 어떤 분위기와 결말로 갈지는 기자인 내가 정해야 해요.",
        artifactType: "완성 이야기 초안",
        image: "/images/c1m/scenario.png"
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
          question: "선택한 주제로 AI가 줄거리 후보 3개를 만들어줄 거예요. 각 후보를 천천히 읽어보세요.",
          hint: "각 후보는 하나의 완성된 짧은 이야기예요. 마음에 드는 것이 없으면 다시 요청할 수 있어요.",
          uiMode: "ai_option_picker",
          selectable: false,
          aiCall: {
            provider: "gemini-text",
            mode: "completion",
            systemPrompt: "당신은 초등 중학년(3~4학년) 학급 신문 기자를 돕는 창작 파트너입니다. 학생이 고른 주제로 서로 다른 완성된 짧은 이야기 3편을 제안합니다.\n\n엄격한 출력 규칙:\n1) 인사말·서두·설명·안내·제목·꼬리말을 절대 쓰지 마세요. 이야기 본문만 출력합니다.\n2) 각 이야기는 '시작(도입) → 전개(갈등) → 해결(결말)' 흐름이 담긴 7문장 이상의 하나의 완결된 짧은 이야기입니다.\n3) 인물의 이름·학년·장소 등 구체적인 디테일을 넣어 생생하게 쓰세요.\n4) 어휘는 3~4학년 수준으로 쉽게, 폭력적·무서운 내용은 금지합니다.\n5) [시작]·[갈등]·[해결] 같은 꺽쇠 라벨이나 번호를 절대 쓰지 마세요. 그냥 자연스러운 문장으로만 쓰세요.\n6) 이야기 사이 구분자는 반드시 한 줄에 '===' 세 글자만 있는 줄을 사용합니다.\n\n출력 형식 예시:\n민준이는 새 학년 첫 발표를 준비하며 …. (7문장 이상)\n===\n서연이는 그림 대회를 앞두고 …. (7문장 이상)\n===\n… (총 3편)",
            userPromptTemplate: "주제: {step1}\n\n위 주제로 3~4학년 친구들이 읽을 만한 완성된 짧은 이야기 3편을 규칙에 맞게 써 주세요. 각 이야기는 서로 다른 인물·상황이어야 하며, 7문장 이상이어야 합니다. 이야기 사이는 반드시 '===' 구분자로 나누고, 인사말/서두/라벨 없이 본문만 출력하세요.",
            outputSchema: "options_block",
            maxTokens: 2400,
            temperature: 0.85,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "민준이는 새 학년이 되어 처음으로 반 친구들 앞에서 발표를 하게 되었다. 연습은 많이 했지만, 교실에 들어서자 심장이 두근거리기 시작했다. 차례가 되어 앞에 서자 준비한 말이 머릿속에서 사라지고 말았다. 잠깐 눈을 감고 크게 숨을 들이쉬었을 때, 맨 앞줄 친구가 살짝 고개를 끄덕여 주었다. 민준이는 종이를 내려놓고, 기억나는 첫 문장부터 천천히 이야기하기 시작했다. 목소리가 조금씩 또렷해지고, 친구들도 고개를 끄덕이며 들어 주었다. 발표를 마친 민준이는 얼굴이 빨개졌지만, 끝까지 해냈다는 뿌듯함으로 자리에 돌아와 앉았다.",
                "서연이는 학교 그림 그리기 대회에 나가기로 마음먹고 매일 연습을 했다. 대회 전날, 도화지에 색을 칠하다가 실수로 물감 통을 엎질러 그림이 망가져 버렸다. 서연이는 속상해서 눈물이 날 것 같았지만, 찢어진 부분을 가만히 바라보며 생각에 잠겼다. 그러다 물감이 번진 자국을 나비 날개 모양으로 오려 붙이면 어떨까 하는 아이디어가 떠올랐다. 가위와 색종이를 가져와 조심스럽게 나비와 꽃잎을 덧붙였다. 다 완성된 그림은 원래 계획과 많이 달랐지만, 오히려 더 생동감 있어 보였다. 다음 날 대회장에서 친구들은 서연이의 그림을 보고 '살아 있는 것 같아!'라고 말해 주었다.",
                "준호는 학교 뒤뜰에서 낯선 작은 새 한 마리를 발견했다. 새는 풀숲에 주저앉아 날개를 제대로 펴지 못하고 있었다. 준호는 놀라지 않게 천천히 다가가 가까이에서 새를 살펴보았다. 곁에 있던 친구 지우와 함께 선생님께 달려가 이 상황을 알렸다. 선생님은 작은 상자에 부드러운 천을 깔고 새를 조심스럽게 옮겨 담아 주셨다. 수업을 마친 뒤 준호와 지우는 선생님과 함께 근처 동물 보호 센터까지 새를 데려다주었다. 며칠 뒤 센터에서 '새가 다시 날 수 있게 되었다'는 소식이 학교로 전해졌고, 준호는 그날 배운 것을 오래도록 잊지 않기로 했다.",
                "예린이는 전학 온 지 얼마 되지 않아 쉬는 시간마다 창가에 혼자 앉아 있었다. 같은 반 하준이는 그 모습이 마음에 걸렸지만, 말을 걸 용기가 쉽게 나지 않았다. 어느 날 하준이는 자신이 가장 아끼는 만화책을 가방에서 꺼내 예린이 책상 위에 슬며시 올려놓았다. 예린이는 눈을 동그랗게 뜨고 하준이를 쳐다보다가 천천히 웃음을 지었다. 두 사람은 그날부터 점심시간마다 같이 책을 보며 이야기를 나누기 시작했다. 며칠이 지나자 다른 친구들도 자연스럽게 그 자리에 모여들었다. 예린이는 하준이에게 '네가 먼저 와 줘서 정말 고마웠어'라고 조용히 말했다."
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
          title: "STEP 3 · 채택안과 보류안 정하기",
          question: "AI가 만든 이야기 중 가장 좋은 채택안 하나와, 아쉬운 보류안 하나를 고르고 각각의 이유를 써보세요.",
          hint: "우리 반 친구들이 공감할지, 이야기 흐름이 자연스러운지, 결말이 분명한지 등을 생각하며 고르세요.",
          uiMode: "option_adopt_hold",
          branch: { sourceStepId: "step2", mode: "highlight" },
          adoptPlaceholder: "예: 우리 반에도 발표를 어려워하는 친구가 많아서 공감이 잘 될 것 같아요.",
          holdPlaceholder: "예: 흥미롭지만 주제와 살짝 거리가 있어서 다음 호에 쓰면 좋겠어요.",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 내 말로 이야기 초안 쓰기",
          question: "채택한 AI 줄거리를 참고하되, 그대로 쓰지 말고 내 말로 정리해 짧은 이야기로 완성해보세요.",
          hint: "등장인물 이름을 바꾸거나 장소를 우리 학교로 바꿔도 좋아요. AI의 아이디어를 바탕으로 내 이야기를 만들어봐요!",
          uiMode: "free_text_with_refs",
          refs: [
            { stepId: "step3", field: "adopt_text", label: "내가 채택한 AI 줄거리" }
          ],
          placeholder: "예: 우리 반에 새로 전학 온 지호는 쉬는 시간마다 혼자 창가에 앉아 있었다. ...",
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
          step3: "채택/보류 결정",
          step4: "내 말로 쓴 이야기 초안"
        },
        artifact: {
          bindingKey: "c_1_m_story",
          template: "나는 '{step1}'를 주제로 한 짧은 이야기를 AI와 함께 만들었다. AI는 이야기를 멋지게 만들어 주었다. 그리고 나는 그 이야기를 나만의 언어로 바꾸어\n\n{step4}\n\n로 바꾸어 보았다."
        }
      }
    },

    // =====================================================================
    // C-1-H | 고학년 (5~6학년)
    // 역할: 학교 축제 웹소설 부스 기획자 | 산출물: 웹소설 기획안 + 기여도 성찰
    // =====================================================================
    upper: {
      cardCode: "C-1-H",
      performanceType: "GC",
      ksa: { K: ["K1.3", "K5.3"], S: ["Creativity", "Collaboration"], A: ["Responsible"] },
      description: "AI와 플롯을 확장하되 작품의 주제와 판단은 내가 결정하고, AI 도움 범위와 자기 기여를 성찰하는 미션이에요.",

      scenario: {
        role: "학교 축제 웹소설 부스 기획자",
        goal: "AI와 협업해 이야기 흐름을 넓히되, 기획자로서 최종 판단을 내리고 AI 도움 범위와 내 기여를 구분해 기록한다.",
        context: "학교 축제에 '학생 창작 웹소설 기획 부스'를 운영해요. 짧은 웹소설 콘셉트, 등장인물, 갈등, 결말을 포스터로 전시해야 해요. AI는 이야기 흐름을 넓혀 주지만, 작품의 주제와 반전은 기획자가 책임지고 정해야 해요.",
        artifactType: "웹소설 기획안 + 역할 기록",
        image: "/images/c1h/scenario.png"
      },

      intro: [
        { text: "학교 축제에 웹소설 기획 부스를 열어요!\n포스터에 작품 기획안을 전시해야 해요.", emoji: "📝" },
        { text: "AI와 두 번 대화하면서 이야기 흐름을 넓혀볼 거예요.\n하지만 작품의 핵심 주제와 반전은 기획자가 정해야 해요.", emoji: "🎭" },
        { text: "마지막에 AI가 도와준 부분과 내가 직접 한 부분을\n각각 문장으로 정리해 기록해봅시다.", emoji: "💭" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI와 협업해도 작품의 핵심 의도, 메시지, 선택 책임은 인간에게 있다는 점을 경험하기 위해서예요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 낸 이야기 흐름이 흥미롭더라도 작품의 주제와 독자층에 맞는지 살펴봐야 해요." },
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
          title: "STEP 2 · AI와 이야기 흐름 넓히기 (1차)",
          question: "STEP 1 기준에 맞는 이야기 아이디어를 AI에게 요청해보세요.",
          hint: "아래 입력창에 예시 질문이 미리 들어 있어요. 그대로 보내도 되고, 내 작품에 맞게 고쳐 쓰거나 새로 써도 돼요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년(5~6학년) 학생의 웹소설 기획을 돕는 창작 파트너입니다. 학생이 세운 기획 기준(독자·장르·꼭 포함할 요소·피할 요소)을 엄격히 존중하세요. 아이디어 후보를 제안하되 결정은 학생의 몫이라는 태도를 유지합니다.\n\n엄격한 출력 규칙:\n1) 이야기 아이디어 3가지를 제시합니다. 각 아이디어는 '번호. 아이디어 제목' 한 줄 뒤에 2~3문장의 설명이 이어지도록 씁니다.\n2) 별표(*), 대시(-), 물결(~), 해시(#) 등 마크다운 기호를 절대 사용하지 마세요. 굵게·기울임 표시 금지.\n3) 말미에 '어떤 이야기가 마음에 드세요?' 같은 되물음을 넣지 마세요. 마지막은 세 번째 아이디어의 설명으로 끝냅니다.\n4) 아이디어 사이에는 빈 줄 하나를 둡니다.\n5) 초등 고학년이 이해할 수 있는 쉬운 문장을 씁니다.",
            userPromptTemplate: "[기획 기준]\n독자: {step1_audience}\n장르: {step1_genre}\n꼭 포함할 요소: {step1_include}\n피할 요소: {step1_avoid}\n\n[학생의 질문]\n{step2_input}",
            outputSchema: "text",
            maxTokens: 700,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              text: "1. 비밀 도서관과 책 속 친구\n비 오는 날 도서관 서가 끝에서 오래된 책의 한 페이지가 열리고, 그 안에서 온 친구 '하루'와 주인공이 일주일 동안만 함께 지내게 됩니다. 우정과 이별이 동시에 흐르는 따뜻한 이야기입니다.\n\n2. 전학생의 비밀\n평범한 6학년 교실에 온 전학생이 사실은 다른 시간에서 온 아이라는 설정입니다. 주인공은 전학생의 정체를 눈치채지만, 고발 대신 함께 비밀을 지키기로 결정합니다.\n\n3. 잃어버린 기억 지도\n할머니 댁 다락방에서 찾은 낡은 지도를 따라 친구들과 학교 곳곳을 탐험합니다. 주인공은 잊고 있던 어린 시절의 약속을 하나씩 되찾아 갑니다."
            }
          },
          studentInputLabel: "AI에게 던질 질문",
          studentInputDefault: "초등 고학년이 읽을 성장 판타지를 구상 중이에요. 우정을 배우는 이야기 흐름 3가지를 추천해주세요.",
          studentInputPlaceholder: "예: 초등 고학년 성장 판타지인데, 우정을 배우는 이야기 흐름 3가지를 추천해주세요.",
          aiResponseLabel: "AI의 제안",
          allowRetry: true,
          maxRetries: 3,
          applyInputLabel: "AI의 제안을 어떻게 반영할까요?",
          applyInputPlaceholder: "예: 1번 '비밀 도서관과 책 속 친구'가 마음에 들어요. 다만 이별 장면은 독자에게 너무 무거울 수 있어서 열린 결말로 바꿔볼 생각이에요.",
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · AI와 이야기 흐름 넓히기 (2차)",
          question: "STEP 2에서 고른 방향을 바탕으로, 이번에는 갈등이나 반전 아이디어를 요청해보세요.",
          hint: "위에 보이는 STEP 2의 내용과 내가 반영할 방향을 참고해, 더 구체적인 갈등이나 반전을 물어보세요.",
          uiMode: "ai_chat_turn",
          branch: { sourceStepId: "step2", mode: "highlight" },
          aiCall: {
            provider: "gemini-text",
            mode: "chat",
            systemPrompt: "당신은 초등 고학년 학생의 웹소설 기획을 돕는 창작 파트너입니다. 이전 대화 맥락을 이어서 학생이 부탁한 갈등이나 반전 아이디어를 2~3개 제안하세요.\n\n엄격한 출력 규칙:\n1) 아이디어마다 '번호. 아이디어 제목' 한 줄 뒤에 2~3문장 설명이 이어지도록 씁니다.\n2) 별표(*), 대시(-), 기타 마크다운 기호를 절대 사용하지 마세요.\n3) 말미에 되물음을 넣지 말고 마지막 아이디어의 설명으로 끝냅니다.\n4) 아이디어 사이에는 빈 줄을 하나 둡니다.\n5) 학생이 1차에서 반영하기로 한 방향을 존중하세요.",
            userPromptTemplate: "[1차 대화 맥락]\n학생의 질문: {step2_input}\nAI의 제안: {step2_aiResponse}\n학생이 반영한 방향: {step2_apply}\n\n[이번 학생의 질문]\n{step3_input}",
            outputSchema: "text",
            maxTokens: 700,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              text: "1. 거울 반전\n주인공이 줄곧 도와주고 있던 친구가 사실은 원래 세계로 돌아가지 못한 과거의 또 다른 주인공이었다는 설정입니다. 주인공은 그 친구를 도우면서 자기 자신의 미래를 바꾸는 선택을 하게 됩니다.\n\n2. 선택의 무게\n주인공이 친구를 원래 세계로 돌려보내면 그 순간 친구에 대한 자신의 기억도 사라진다는 설정입니다. 친구를 기억 속에서 잃을지, 곁에 붙잡아 둘지 선택해야 하는 갈등입니다.\n\n3. 숨은 공모자\n사건의 원인이 줄곧 도와주던 선생님이었다는 사실이 드러나지만, 그것은 악의가 아니라 주인공을 성장시키기 위한 의도였다는 반전입니다. 주인공은 분노와 이해 사이에서 자기 입장을 정해야 합니다."
            }
          },
          studentInputLabel: "AI에게 던질 추가 질문",
          studentInputDefault: "이 이야기 흐름에 어울리는 갈등이나 반전 아이디어를 제안해주세요.",
          studentInputPlaceholder: "예: 이 이야기에서 주인공이 겪을 가장 큰 갈등은 무엇이 좋을까요?",
          aiResponseLabel: "AI의 제안",
          allowRetry: true,
          maxRetries: 3,
          applyInputLabel: "AI의 갈등/반전 아이디어를 내 작품에 어떻게 반영할까요?",
          applyInputPlaceholder: "예: 2번 '선택의 무게'를 채택하고 싶어요. 다만 기억이 사라지는 설정 대신, 친구의 얼굴만 희미해지는 형태로 순화하려고 해요.",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 최종 기획안 작성",
          question: "이제까지 정리한 기준과 아이디어, 반영 방향을 바탕으로 포스터용 기획안 5칸을 채워보세요.",
          hint: "긴 문단 대신 핵심만 한두 문장으로 간결하게 쓰세요. 위쪽에 이전 단계의 내용이 함께 보여요.",
          uiMode: "multi_free_text",
          contextStepIds: ["step1", "step2", "step3"],
          rowsPerField: 2,
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
            "예: 하루를 원래 세계로 돌려보내야 할지 함께 있을지 선택해야 함",
            "예: 은재가 스스로 이별을 선택하고 성장하는 열린 결말"
          ],
          validation: { required: true, minAnswered: 5 }
        },
        {
          id: "step5",
          title: "STEP 5 · AI와 나의 역할 기록하기",
          question: "이번 작품에서 AI가 도와준 부분과 내가 직접 한 부분을 각각 문장으로 적어보세요.",
          hint: "위쪽 이전 단계 내용을 다시 살펴보면서, AI의 역할과 내 역할을 구체적으로 구분해 적어요. 두 칸 모두 채워야 해요.",
          uiMode: "multi_free_text",
          contextStepIds: ["step2", "step3", "step4"],
          rowsPerField: 4,
          questions: [
            { id: "ai_help", text: "AI가 도와준 것 — AI가 없었다면 떠올리기 어려웠던 점을 적어보세요." },
            { id: "my_work", text: "내가 직접 한 것 — 내가 판단해 고르거나 바꾸거나 새로 만든 점을 적어보세요." }
          ],
          placeholders: [
            "예: AI는 비밀 도서관, 거울 반전 같은 이야기 흐름과 갈등 구조 후보를 3개씩 제안해 주었다. 나 혼자서는 이렇게 다양한 방향을 한 번에 떠올리기 어려웠을 것이다.",
            "예: 나는 그 중 '비밀 도서관'을 우리 반 독자에 맞게 골랐고, 무거운 이별을 열린 결말로 바꾸었다. 등장인물 이름과 '도서관의 비밀 문'이라는 제목은 직접 지었다."
          ],
          validation: { required: true, minAnswered: 2 }
        }
      ],

      rubric: {
        axes: [
          { id: "intent",         label: "의도 설정",      description: "작품 기획 기준이 분명한가" },
          { id: "ai_use",         label: "AI 활용",        description: "AI 제안을 기준에 따라 비교·선택했는가" },
          { id: "contribution",   label: "자기 기여",      description: "최종 기획안에 학생의 판단이 드러나는가" },
          { id: "responsibility", label: "책임 있는 공유", description: "AI 도움 범위와 자기 기여를 구분해 기록했는가" }
        ]
      },

      submit: {
        title: "웹소설 기획안 완성!",
        message: "AI와 협업하면서도 작품의 핵심 판단은 내가 내린다는 것을 경험했어요.",
        summaryLabels: {
          step1: "기획 기준",
          step2: "이야기 흐름 넓히기 1차",
          step3: "이야기 흐름 넓히기 2차",
          step4: "최종 기획안",
          step5: "AI와 나의 역할"
        },
        artifact: {
          bindingKey: "c_1_h_novel_plan",
          template: "나는 {step1_audience} 독자를 위한 {step1_genre} 웹소설을 AI와 함께 기획했다. AI는 이야기 흐름과 갈등·반전 아이디어를 여러 개 제안해 주었지만, 그중에서 고르고 우리만의 방향으로 다듬은 것은 나의 몫이었다.\n\n작품 제목은 《{step4_title}》이고, 한 줄 소개는 \"{step4_logline}\"이다. 주요 등장인물은 {step4_characters}이며, 이야기의 중심 갈등은 {step4_conflict}. 결말은 {step4_ending} 방향으로 마무리하려 한다.\n\n이번 작업에서 AI는 {step5_ai_help}\n반면에 나는 {step5_my_work}"
        }
      }
    }
  }
};
