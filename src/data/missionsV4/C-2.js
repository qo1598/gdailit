/**
 * LearnAILIT V4 · C-2 AI 결과가 잘 나오게 요청하고 고치기
 * 시나리오 기반 수행 평가 — C영역 공통 인터페이스 적용
 *
 * [주요 uiMode]
 * - prompt_builder      : 빈칸 채우기식 프롬프트 작성 + 이미지 생성
 * - defect_select       : 이미지 위 오류 포인트 클릭 표시
 * - prompt_single_input : 기존 프롬프트 수정 + 재생성 + 나란히 비교
 * - prompt_with_conditions : 조건 기반 프롬프트 설계 + 재생성
 */

export const C2_V4 = {
  meta: {
    code: "C-2",
    title: "AI 결과가 잘 나오게 요청하고 고치기",
    domain: "Creating",
  },

  grades: {

    // =====================================================================
    // C-2-L | 저학년 (1~2학년)
    // 역할: 행사 그림 의뢰자 | 산출물: 그림 요청 카드
    // =====================================================================
    lower: {
      cardCode: "C-2-L",
      performanceType: "TD",
      ksa: { K: ["K4.1"], S: ["Creativity"], A: ["Adaptable"] },
      description: "AI에게 원하는 그림을 구체적으로 부탁하는 요청 카드를 만드는 미션이에요.",

      scenario: {
        role: "행사 그림 의뢰자",
        goal: "행사 안내문에 쓸 그림을 AI에게 구체적으로 요청하고, 실제로 그림을 받아본다.",
        context: "반 소풍 안내문에 넣을 그림이 필요해요. AI에게 그림을 부탁할 수 있지만, 막연하게 말하면 엉뚱한 그림이 나올 수 있어요. 꼭 들어갈 요소와 빼야 할 요소를 정리해서 요청해야 해요.",
        artifactType: "그림 요청 카드 + 완성된 그림",
        image: "/images/c2l/scenario.png"
      },

      intro: [
        { text: "반 소풍 안내문에 넣을 그림을 AI에게 부탁할 거예요!", emoji: "🎨" },
        { text: "그런데 \"소풍 그림 그려줘\"라고만 하면\nAI가 엉뚱한 그림을 그릴 수도 있어요.", emoji: "🤔" },
        { text: "꼭 들어갈 것과 빼고 싶은 것을\n구체적으로 말하면 더 좋은 그림이 나와요!", emoji: "✨" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 결과가 더 목적에 맞게 나오려면, 내가 원하는 조건을 구체적으로 말해야 해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "그림의 주제, 배경, 표정, 필요한 물건이 분명히 들어 있는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "\"소풍 그림 그려줘\"처럼 막연하게 요청하면 너무 다른 장면이 나올 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 그림의 쓰임 정하기",
          question: "어떤 행사에 쓸 그림이에요?",
          hint: "그림의 쓰임새를 정하면 방향이 뚜렷해져요.",
          uiMode: "single_select_cards",
          options: [
            { id: "picnic",      label: "반 소풍 안내문",   emoji: "🧺" },
            { id: "poster",      label: "반 환경 포스터",   emoji: "🌍" },
            { id: "birthday",    label: "생일 축하 카드",   emoji: "🎂" },
            { id: "sports_day",  label: "운동회 안내문",    emoji: "🏃" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 빈칸을 채워 요청 만들기",
          question: "AI에게 보낼 그림 요청을 빈칸에 하나씩 채워보세요.",
          hint: "각 빈칸에서 원하는 것을 고르면 자동으로 요청 문장이 만들어져요. 마지막에 AI가 실제로 그림을 그려줄 거예요!",
          uiMode: "prompt_builder",
          slots: [
            {
              id: "place",
              label: "어디에서",
              type: "chips",
              options: [
                { id: "park",       label: "봄날 공원" },
                { id: "schoolyard", label: "학교 운동장" },
                { id: "classroom",  label: "교실" },
                { id: "beach",      label: "바닷가" },
                { id: "mountain",   label: "산" }
              ]
            },
            {
              id: "subject",
              label: "누가 / 무엇을",
              type: "chips",
              options: [
                { id: "three_friends", label: "친구 세 명이" },
                { id: "whole_class",   label: "우리 반 친구들이" },
                { id: "family",        label: "가족이" },
                { id: "two_kids",      label: "두 친구가" }
              ]
            },
            {
              id: "action",
              label: "무엇을 하고 있는지",
              type: "chips",
              options: [
                { id: "eating",   label: "도시락을 먹고" },
                { id: "playing",  label: "놀이를 하고" },
                { id: "cleaning", label: "청소를 하고" },
                { id: "running",  label: "뛰놀고" },
                { id: "singing",  label: "노래하고" }
              ]
            },
            {
              id: "mood",
              label: "어떤 분위기로",
              type: "chips",
              options: [
                { id: "bright", label: "밝고 즐겁게" },
                { id: "warm",   label: "따뜻하게" },
                { id: "fun",    label: "재미있게" },
                { id: "cozy",   label: "아늑하게" }
              ]
            },
            {
              id: "exclude",
              label: "빼고 싶은 것",
              type: "chips",
              options: [
                { id: "rain",       label: "비 오는 날씨" },
                { id: "scary_face", label: "무서운 표정" },
                { id: "night",      label: "밤 배경" },
                { id: "alone",      label: "혼자 있는 모습" }
              ]
            }
          ],
          promptTemplate: "{place}에서 {subject} {action} 있는 {mood} 그림을 그려줘. 단, {exclude}는 빼줘.",
          aiCall: {
            provider: "gemini-image",
            mode: "image_gen",
            systemPrompt: "Create a cheerful, child-friendly cartoon illustration suitable for an elementary school event poster. Style: bright colors, simple shapes, clear outlines, no text.",
            userPromptTemplate: "{promptText}",
            outputSchema: "image_url",
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              imageUrl: "/c2l_fallback_picnic.png"
            }
          },
          showGeneratedResult: true,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 결과 확인하고 마무리하기",
          question: "AI가 그려준 그림이 내 요청과 잘 맞았나요? 한 문장으로 소감을 써보세요.",
          hint: "그림에서 어떤 요소가 잘 들어갔는지, 아쉬운 점이 있다면 무엇인지 짧게 써보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          placeholder: "예: 친구 세 명이 도시락을 먹는 모습은 잘 나왔는데, 표정이 조금 어색했어요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      submit: {
        title: "그림 요청 카드 완성!",
        message: "AI에게 구체적으로 요청해서 원하는 그림을 받아봤어요.",
        summaryLabels: {
          step1: "그림의 쓰임",
          step2: "요청 카드 + 받은 그림",
          step3: "결과 확인 소감"
        },
        artifact: {
          bindingKey: "c_2_l_request_card",
          template: "오늘은 AI한테 {step1}에 쓸 그림을 만들기 위해, {step2_prompt} (이)라고 요청했어요. 나는 AI가 만들어준 그림을 보고 {step3}(이)라고 느꼈어요."
        }
      }
    },

    // =====================================================================
    // C-2-M | 중학년 (3~4학년)
    // 역할: 환경 캠페인 포스터 디자이너 | 산출물: 문제 진단표 + 수정 요청문
    // =====================================================================
    middle: {
      cardCode: "C-2-M",
      performanceType: "SJ",
      ksa: { K: ["K4.1"], S: ["Creativity", "Critical Thinking"], A: ["Adaptable"] },
      description: "AI 그림의 이상한 점을 찾고, 더 나은 그림을 얻기 위한 수정 요청문을 작성하는 미션이에요.",

      scenario: {
        role: "환경 캠페인 포스터 디자이너",
        goal: "AI가 만든 포스터 초안의 오류를 진단하고, 수정 요청문으로 더 나은 결과를 받아낸다.",
        context: "학교 환경 캠페인 포스터에 쓸 AI 그림이 나왔는데, 자세히 보니 이상한 부분이 있어요. 그냥 버리지 말고, 무엇이 문제인지 짚은 뒤 더 나은 그림을 다시 요청해야 해요.",
        artifactType: "오류 진단표 + 수정 요청문 + 재생성 결과",
        image: "/images/c2m/scenario.png"
      },

      intro: [
        { text: "환경 캠페인 포스터 초안이 나왔어요.\n그런데 자세히 보면 이상한 부분이 있어요!", emoji: "🔍" },
        { text: "AI가 만든 그림은 그럴듯해 보여도\n논리적 오류를 포함할 수 있어요.", emoji: "⚠️" },
        { text: "디자이너로서 문제를 짚어내고,\n더 나은 그림을 요청해봅시다!", emoji: "✏️" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 만든 결과물은 그럴듯해 보여도 실제로는 논리적 오류를 포함할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "손, 눈, 그림자, 물체 위치, 자연 현상 같은 세부 요소를 자세히 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "완성도가 떨어지는 이미지를 그대로 쓰게 되고, 전달력도 약해져요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 포스터 초안 살펴보기",
          question: "환경 캠페인 포스터 초안이에요. 먼저 전체적으로 천천히 살펴보세요.",
          hint: "어디가 이상한지 바로 찾지 말고, 그림 전체를 먼저 훑어보세요.",
          uiMode: "image_view",
          imageUrl: "/images/c2m/picnic_defect.png",
          imageLabel: "AI가 만든 포스터 초안",
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 어색한 부분 찾기",
          question: "그림에서 이상한 부분을 터치해서 표시하고, 오류 유형을 골라보세요.",
          hint: "자연 현상(태양이 2개?), 물체 위치(공중에 뜬 동물?), 인체 구조, 장면 구성 등을 살펴보세요. 2개 이상 찾아야 해요.",
          uiMode: "defect_select",
          imageUrl: "/images/c2m/picnic_defect.png",
          defectCategories: [
            { id: "nature",   label: "자연 현상 오류",   description: "해·달·날씨 등이 이상함" },
            { id: "physics",  label: "물리 법칙 오류",   description: "공중에 떠 있거나 그림자가 이상함" },
            { id: "anatomy",  label: "인체·형태 오류",   description: "손가락·팔다리가 이상함" },
            { id: "scene",    label: "장면 구성 오류",   description: "전체적으로 어울리지 않음" }
          ],
          minMarkers: 2,
          maxMarkers: 6,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 왜 이상한지 이유 쓰기",
          question: "표시한 오류 각각에 대해, 왜 이상하다고 생각했는지 이유를 써보세요.",
          hint: "예: \"하늘에 태양이 두 개 있으면 현실에서는 있을 수 없어요\" 처럼 구체적으로 써보세요.",
          uiMode: "defect_reason",
          branch: { sourceStepId: "step2", mode: "highlight" },
          placeholder: "이 부분이 왜 이상한지 이유를 써보세요.",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 수정 요청문 쓰기",
          question: "찾은 오류를 바탕으로, 더 나은 그림을 받기 위한 수정 요청문을 써보세요.",
          hint: "무엇을 바꿔야 할지 구체적으로 쓰세요. 예: \"태양은 하나만, 강아지는 땅에 서 있게, 로봇 다리는 자연스럽게\"",
          uiMode: "prompt_single_input",
          branch: { sourceStepId: "step3", mode: "highlight" },
          originalPrompt: "아이들과 로봇이 공원에서 피크닉하는 그림을 그려줘",
          originalImageUrl: "/images/c2m/picnic_defect.png",
          revisionGuide: "찾은 오류를 고치는 구체적인 지시를 포함하세요. 배경·인물·자연 요소를 분명히 지정하세요.",
          showSideBySide: true,
          aiCall: {
            provider: "gemini-image",
            mode: "image_gen",
            systemPrompt: "Create a cheerful, physically realistic cartoon illustration for an elementary school environmental campaign poster. Ensure: one sun in sky, animals on the ground (not floating), anatomically correct hands with five fingers, consistent shadows and proportions.",
            userPromptTemplate: "{revisedPrompt}",
            outputSchema: "image_url",
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              imageUrl: "/images/c2m/picnic_good.png"
            }
          },
          placeholder: "예: 공원에서 두 아이와 로봇이 피크닉을 하는 밝은 그림. 해는 하늘에 하나만, 강아지는 잔디 위에 서 있고, 로봇은 자연스러운 금속 다리로.",
          validation: { required: true, minLength: 50 }
        },
        {
          id: "step5",
          title: "STEP 5 · 개선 여부 판단",
          question: "재생성된 그림이 이전보다 나아졌나요? 무엇이 개선됐는지 써보세요.",
          hint: "비교해서 좋아진 점과 여전히 아쉬운 점을 솔직하게 써보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step4", mode: "highlight" },
          placeholder: "예: 태양이 하나로 바뀌었고 강아지가 땅에 서 있어서 훨씬 자연스러워졌어요. 로봇 손가락도 다섯 개가 됐어요. 다만 표정은 이전이 더 밝았던 것 같아요.",
          validation: { required: true, minLength: 30 }
        }
      ],

      submit: {
        title: "포스터 개선 완료!",
        message: "AI 그림의 오류를 찾아내고, 더 나은 결과를 이끌어냈어요.",
        summaryLabels: {
          step1: "포스터 초안",
          step2: "찾아낸 오류",
          step3: "이유 분석",
          step4: "수정 요청문 + 재생성",
          step5: "개선 판단"
        },
        artifact: {
          bindingKey: "c_2_m_diagnosis",
          template: "AI가 만든 포스터 초안에서 {step2} 오류를 찾았어요. 이상한 이유는 {step3}이에요. 이를 바탕으로 {step4}(이)라고 수정 요청했더니 새 그림이 나왔고, {step5}(이)가 개선되었다고 생각했어요."
        }
      }
    },

    // =====================================================================
    // C-2-H | 고학년 (5~6학년)
    // 역할: 전시 홍보물 아트디렉터 | 산출물: 오류 분석서 + 프롬프트 역추정 + 개선 프롬프트
    // =====================================================================
    upper: {
      cardCode: "C-2-H",
      performanceType: "SJ",
      ksa: { K: ["K4.1", "K5.3"], S: ["Creativity", "Critical Thinking"], A: ["Adaptable", "Responsible"] },
      description: "실패한 AI 이미지의 원인을 분석하고, 잘못된 프롬프트를 역추정한 뒤 개선 프롬프트를 설계하는 미션이에요.",

      scenario: {
        role: "전시 홍보물 아트디렉터",
        goal: "실패한 이미지의 원인을 역추정하고, 목적·대상·스타일을 담은 개선 프롬프트를 설계한다.",
        context: "학교 전시 홍보 배너 이미지를 AI로 만들었는데, 행사 목적과 맞지 않거나 시각적 오류가 섞여 있어요. 아트디렉터는 단순히 '이상하다'고 끝내지 않고, 어떤 잘못된 요청이 이런 결과를 만들었을지 추정하고, 더 정확한 프롬프트를 설계해야 해요.",
        artifactType: "오류 분석서 + 프롬프트 역추정 + 개선 프롬프트",
        image: "/images/c2h/scenario.png"
      },

      intro: [
        { text: "학교 전시 홍보 배너 이미지가 나왔는데\n문제가 여러 개 섞여 있어요.", emoji: "🎨" },
        { text: "아트디렉터는 결과만 보고 끝내지 않아요.\n어떤 잘못된 요청이 이런 결과를 만들었는지 역추정해야 해요.", emoji: "🔎" },
        { text: "그다음, 목적·대상·스타일을 모두 담은\n더 정확한 프롬프트를 설계합니다.", emoji: "📝" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 결과를 잘 쓰려면 '왜 이렇게 나왔을까'를 분석하고 프롬프트를 다시 설계하는 역량이 필요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "시각적 오류뿐 아니라 행사 목적에 맞는지, 정보 전달이 되는지, 스타일이 일관적인지도 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "결과가 왜 잘못되었는지 모르기 때문에 같은 실수를 반복하고, 더 나은 결과를 얻을 수 없어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 홍보 배너 오류 분석",
          question: "AI가 만든 전시 홍보 배너에서 문제점을 클릭으로 표시하고, 유형을 분류하세요.",
          hint: "시각적 오류, 스타일 불일치, 행사 목적과의 거리, 핵심 정보 전달 문제를 모두 살펴보세요. 3개 이상 찾아야 해요.",
          uiMode: "defect_select",
          imageUrl: "/images/c2h/banner_defect.png",
          defectCategories: [
            { id: "visual_error",   label: "시각적 오류",       description: "인체·자연·물리 법칙 오류" },
            { id: "style_issue",    label: "스타일 불일치",     description: "요소 간 화풍·톤이 다름" },
            { id: "purpose_gap",    label: "목적 부합성 문제",   description: "전시 행사 목적과 거리가 있음" },
            { id: "info_delivery",  label: "정보 전달 문제",     description: "핵심 정보가 불분명하거나 누락됨" }
          ],
          minMarkers: 3,
          maxMarkers: 8,
          allowText: true,
          textPlaceholder: "이 부분이 왜 문제인지 짧게 써보세요",
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 잘못된 프롬프트 역추정",
          question: "이 그림을 보면서, AI에게 어떤 요청을 했길래 이런 결과가 나왔을지 추정해보세요.",
          hint: "그림의 문제점을 하나씩 떠올리면서 '어떤 말이 빠졌길래 이렇게 됐을까?'를 생각해보세요.",
          uiMode: "image_carousel_text",
          imageUrl: "/images/c2h/banner_defect.png",
          questions: [
            { id: "vagueness",      text: "AI에게 요청할 때, 어떻게 말했길래 이런 그림이 나왔을까요? 빠진 정보가 무엇인지 생각해보세요." },
            { id: "missing_style",  text: "그림의 스타일이나 분위기에 대해 어떤 말을 안 해줬길래 이렇게 됐을까요? (예: 그림체, 색감, 톤)" },
            { id: "no_exclude",     text: "'이건 넣지 마'라고 말해줬어야 할 것들이 있나요? 안 넣었으면 좋았을 것들을 떠올려보세요." },
            { id: "inferred_prompt", text: "그렇다면 원래 AI에게 한 요청은 어떤 문장이었을 것 같나요? 한 문장으로 추정해서 써보세요." }
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step3",
          title: "STEP 3 · 개선 기준 세우기",
          question: "아트디렉터로서, 새 프롬프트가 갖춰야 할 기준을 항목별로 정리하세요.",
          hint: "대상, 분위기, 필수 요소, 제외 요소를 분명히 구분해서 쓰세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "audience",     text: "누구를 위한 홍보물인가?" },
            { id: "mood",         text: "어떤 분위기·색감이어야 하는가?" },
            { id: "must_include", text: "꼭 들어가야 할 요소 3가지" },
            { id: "must_exclude", text: "절대 피해야 할 요소 2가지" }
          ],
          placeholders: [
            "예: 초등학생과 학부모 관람객",
            "예: 밝고 따뜻하며, 전시 주제가 느껴지는 색감",
            "예: 자연스러운 인체 비례, 일관된 일러스트 화풍, 전시 주제(과학·환경 등) 연상 요소",
            "예: 공중에 뜬 물체, 손가락 수 오류, AI가 넣은 깨진 텍스트"
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step4",
          title: "STEP 4 · 최종 프롬프트 설계 + 재생성",
          question: "STEP 3 기준을 모두 담아 최종 프롬프트를 설계하고, 실제로 재생성해보세요.",
          hint: "대상·장면·스타일·금지 조건이 모두 들어가야 해요. 구체적이고 검증 가능하게 쓰세요.",
          uiMode: "prompt_with_conditions",
          branch: { sourceStepId: "step3", mode: "highlight" },
          originalPrompt: "학교 전시회 포스터 그려줘",
          originalImageUrl: "/images/c2h/banner_defect.png",
          conditionFields: [
            { id: "target",   label: "대상"},
            { id: "mood",     label: "분위기·스타일"},
            { id: "include",  label: "필수 요소"},
            { id: "exclude",  label: "제외 요소"}
          ],
          showSideBySide: true,
          aiCall: {
            provider: "gemini-image",
            mode: "image_gen",
            systemPrompt: "Create a professional, child-friendly banner illustration for an elementary school exhibition. Ensure anatomical accuracy, consistent art style, realistic lighting and physics. Style: clean vector illustration, warm inviting colors, clear composition, no text or letters in image.",
            userPromptTemplate: "{revisedPrompt}",
            outputSchema: "image_url",
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              imageUrl: "/images/c2h/banner_good.png"
            }
          },
          placeholder: "예: 초등학생과 학부모가 관람할 학교 과학 전시 홍보 배너. 넓은 전시장 안에서 아이 둘이 로봇 전시물을 신기하게 구경하는 장면. 스타일은 밝은 파스텔 톤의 벡터 일러스트, 인체 비례 자연스럽게, 그림자 방향 일관되게, 전시 소품(망원경·지구본 등)이 바닥이나 선반 위에 자연스럽게 놓여 있을 것. 손가락은 다섯 개로 정확히. 이미지 안에 글자 삽입 금지, 공중에 뜬 물체 금지, 사실적 인물 사진 스타일 금지.",
          validation: { required: true, minLength: 100 }
        },
        {
          id: "step5",
          title: "STEP 5 · 개선 효과 분석",
          question: "AI가 새로 만든 그림이 내가 세운 기준에 얼마나 잘 맞는지, 별점으로 평가하고 이유를 써보세요.",
          hint: "각 기준을 하나씩 살펴보면서, 잘 된 점과 아쉬운 점을 떠올려보세요.",
          uiMode: "criteria_star_rating",
          branch: { sourceStepId: "step4", mode: "highlight" },
          criteria: [
            { id: "audience_fit",    label: "보는 사람에게 맞는 그림인가요?",    placeholder: "예: 초등학생이 좋아할 밝고 친근한 장면이어서 잘 맞아요." },
            { id: "mood_style",      label: "분위기와 스타일이 잘 됐나요?",      placeholder: "예: 따뜻한 파스텔 톤인데, 일부 색이 너무 진해서 조금 아쉬워요." },
            { id: "visual_accuracy", label: "그림에 이상한 부분은 없나요?",       placeholder: "예: 손가락 수는 맞는데, 그림자 방향이 아직 조금 어색해요." },
            { id: "theme_delivery",  label: "전시 주제가 잘 느껴지나요?",         placeholder: "예: 과학 전시 느낌이 약해서, 실험 도구나 별자리 요소가 더 있으면 좋겠어요." }
          ],
          validation: { required: true }
        }
      ],

      submit: {
        title: "개선 프롬프트 설계 완료!",
        message: "아트디렉터로서 AI 결과의 원인을 역추정하고, 체계적인 개선 프롬프트를 설계해 실제로 더 나은 결과를 이끌어냈어요.",
        summaryLabels: {
          step1: "오류 분석",
          step2: "프롬프트 역추정",
          step3: "개선 기준",
          step4: "최종 프롬프트 + 재생성",
          step5: "개선 효과 분석"
        },
        artifact: {
          bindingKey: "c_2_h_prompt_design",
          template: "AI가 만든 전시 홍보 배너에서 {step1} 등의 문제를 발견했어요. 원래 프롬프트는 \"{step2_inferred_prompt}\" 정도였을 것으로 추정했어요. 아트디렉터로서 기준을 세운 뒤 \"{step4_revisedPrompt}\"(으)로 개선 프롬프트를 설계해 AI에게 다시 요청했어요."
        }
      }
    }
  }
};
