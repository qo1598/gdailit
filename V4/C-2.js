/**
 * LearnAILIT V4 · C-2 AI 결과가 잘 나오게 요청하고 고치기
 * 시나리오 기반 수행 평가 — C영역 공통 인터페이스 적용
 *
 * [주요 uiMode]
 * - prompt_builder      : 슬롯 채우기식 프롬프트 작성 + 이미지 생성
 * - image_defect_spotter: 이미지 위 오류 포인트 클릭 표시
 * - prompt_revision     : 기존 프롬프트 수정 + 재생성 + 나란히 비교
 *
 * [이미지 자산]
 * - /c2m_picnic_good.png (원본 — 오류 없음)
 * - /c2m_picnic_defect.png (오류 주입본 — 태양 2개, 뜬 강아지, 녹는 로봇 다리 등)
 */

export const C2_V4_SCENARIO = {
  meta: {
    code: "C-2",
    title: "AI 결과가 잘 나오게 요청하고 고치기",
    domain: "Creating",
    ksa: { K: ["K4.1"], S: ["Creativity"], A: ["Adaptable"] }
  },

  grades: {

    // =====================================================================
    // C-2-L | 저학년 (1~2학년)
    // 역할: 행사 그림 의뢰자 | 산출물: 그림 요청 카드
    // =====================================================================
    lower: {
      cardCode: "C-2-L",
      performanceType: "TD",
      description: "AI에게 원하는 그림을 구체적으로 부탁하는 요청 카드를 만드는 미션이에요.",

      scenario: {
        role: "행사 그림 의뢰자",
        goal: "행사 안내문에 쓸 그림을 AI에게 구체적으로 요청하고, 실제로 그림을 받아본다.",
        context: "반 소풍 안내문에 넣을 그림이 필요해요. AI에게 그림을 부탁할 수 있지만, 막연하게 말하면 엉뚱한 그림이 나올 수 있어요. 꼭 들어갈 요소와 빼야 할 요소를 정리해서 요청해야 해요.",
        artifactType: "그림 요청 카드 + 완성된 그림"
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
          title: "STEP 2 · 슬롯을 채워 요청 만들기",
          question: "AI에게 보낼 그림 요청을 슬롯에 하나씩 채워보세요.",
          hint: "각 슬롯에서 원하는 것을 고르면 자동으로 요청 문장이 만들어져요. 마지막에 AI가 실제로 그림을 그려줄 거예요!",
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

      rubric: {
        axes: [
          { id: "intent",  label: "의도 설정",   description: "그림 목적이 분명한가" },
          { id: "ai_use",  label: "AI 활용",     description: "필요한 요소와 제외 요소를 구분했는가" },
          { id: "revision",label: "수정과 개선", description: "결과를 보고 요청의 적절성을 판단했는가" }
        ]
      },

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
          template: "[{step1}용 그림 요청]\n{step2_promptText}\n\n소감: {step3}"
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
      description: "AI 그림의 이상한 점을 찾고, 더 나은 그림을 얻기 위한 수정 요청문을 작성하는 미션이에요.",

      scenario: {
        role: "환경 캠페인 포스터 디자이너",
        goal: "AI가 만든 포스터 초안의 오류를 진단하고, 수정 요청문으로 더 나은 결과를 받아낸다.",
        context: "학교 환경 캠페인 포스터에 쓸 AI 그림이 나왔는데, 자세히 보니 이상한 부분이 있어요. 그냥 버리지 말고, 무엇이 문제인지 짚은 뒤 더 나은 그림을 다시 요청해야 해요.",
        artifactType: "오류 진단표 + 수정 요청문 + 재생성 결과"
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
          imageUrl: "/c2m_picnic_defect.png",
          imageLabel: "AI가 만든 포스터 초안",
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 어색한 점 표시하기",
          question: "그림에서 어색한 부분을 클릭해서 표시하고, 왜 어색한지 이유를 골라보세요.",
          hint: "자연 현상(태양이 2개?), 물체 위치(공중에 뜬 동물?), 인체 구조, 장면 구성 등을 살펴보세요. 2개 이상 찾아야 해요.",
          uiMode: "defect_select",
          imageUrl: "/c2m_picnic_defect.png",
          defectCategories: [
            { id: "nature",   label: "자연 현상 오류",   description: "해·달·날씨 등이 이상함" },
            { id: "physics",  label: "물리 법칙 오류",   description: "공중에 떠 있거나 그림자가 이상함" },
            { id: "anatomy",  label: "인체·형태 오류",   description: "손가락·팔다리가 이상함" },
            { id: "scene",    label: "장면 구성 오류",   description: "전체적으로 어울리지 않음" }
          ],
          minMarkers: 2,
          maxMarkers: 6,
          allowText: true,
          textPlaceholder: "어떤 점이 어색한지 짧게 써보세요",
          feedback: {
            onCorrect: null,
            onWrong: null,
            onMiss: "더 찾아볼 수 있어요! 하늘, 동물 위치, 로봇의 다리 부분 등을 자세히 살펴보세요."
          },
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 수정 요청문 다시 쓰기",
          question: "찾은 오류를 바탕으로, 더 나은 그림을 받기 위한 수정 요청문을 써보세요.",
          hint: "무엇을 바꿔야 할지 구체적으로 쓰세요. 예: \"태양은 하나만, 강아지는 땅에 서 있게, 로봇 다리는 자연스럽게\"",
          uiMode: "prompt_single_input",
          branch: { sourceStepId: "step2", mode: "highlight" },
          originalPrompt: "아이들과 로봇이 공원에서 피크닉하는 그림을 그려줘",
          originalImageUrl: "/c2m_picnic_defect.png",
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
              imageUrl: "/c2m_picnic_good.png"
            }
          },
          placeholder: "예: 공원에서 두 아이와 로봇이 피크닉을 하는 밝은 그림. 해는 하늘에 하나만, 강아지는 잔디 위에 서 있고, 로봇은 자연스러운 금속 다리로. 손가락은 다섯 개로 자연스럽게.",
          validation: { required: true, minLength: 50 }
        },
        {
          id: "step4",
          title: "STEP 4 · 개선 여부 판단",
          question: "재생성된 그림이 이전보다 나아졌나요? 무엇이 개선됐는지 써보세요.",
          hint: "비교해서 좋아진 점과 여전히 아쉬운 점을 솔직하게 써보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          placeholder: "예: 태양이 하나로 바뀌었고 강아지가 땅에 서 있어서 훨씬 자연스러워졌어요. 로봇 손가락도 다섯 개가 됐어요. 다만 표정은 이전이 더 밝았던 것 같아요.",
          validation: { required: true, minLength: 30 }
        }
      ],

      rubric: {
        axes: [
          { id: "intent",   label: "의도 설정",   description: "그림 목적을 염두에 두고 평가했는가" },
          { id: "ai_use",   label: "AI 활용",     description: "이미지의 문제를 구체적으로 발견했는가" },
          { id: "revision", label: "수정과 개선", description: "수정 요청문이 이전보다 구체적이고 효과적인가" }
        ]
      },

      submit: {
        title: "포스터 개선 완료!",
        message: "AI 그림의 오류를 찾아내고, 더 나은 결과를 이끌어냈어요.",
        summaryLabels: {
          step1: "포스터 초안",
          step2: "찾아낸 오류",
          step3: "수정 요청문 + 재생성",
          step4: "개선 판단"
        },
        artifact: {
          bindingKey: "c_2_m_diagnosis",
          template: "[오류 진단]\n{step2}\n\n[수정 요청문]\n{step3_revisedPrompt}\n\n[개선 판단]\n{step4}"
        }
      }
    },

    // =====================================================================
    // C-2-H | 고학년 (5~6학년)
    // 역할: 전시 홍보물 아트디렉터 | 산출물: 오류 분석서 + 잘못된 프롬프트 추정 + 개선 프롬프트
    // =====================================================================
    upper: {
      cardCode: "C-2-H",
      performanceType: "SJ",
      description: "실패한 AI 이미지의 원인을 분석하고, 잘못된 프롬프트를 역추정한 뒤 개선 프롬프트를 설계하는 미션이에요.",

      scenario: {
        role: "전시 홍보물 아트디렉터",
        goal: "실패한 이미지의 원인을 역추정하고, 목적·대상·스타일을 담은 개선 프롬프트를 설계한다.",
        context: "학교 전시 홍보 배너 이미지를 AI로 만들었는데, 행사 목적과 맞지 않거나 시각적 오류가 섞여 있어요. 아트디렉터는 단순히 '이상하다'고 끝내지 않고, 어떤 잘못된 요청이 이런 결과를 만들었을지 추정하고, 더 정확한 프롬프트를 설계해야 해요.",
        artifactType: "오류 분석서 + 프롬프트 추정 + 개선 프롬프트"
      },

      intro: [
        { text: "전시 홍보 배너 이미지가 나왔는데\n문제가 여러 개 있어요.", emoji: "🎨" },
        { text: "아트디렉터는 결과만 보고 끝내지 않아요.\n어떤 잘못된 요청이 이런 결과를 만들었는지 역추정해야 해요.", emoji: "🔎" },
        { text: "그다음, 목적·대상·스타일을 모두 담은\n더 정확한 프롬프트를 설계합니다.", emoji: "📝" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "생성형 AI 결과를 잘 쓰려면 결과를 보고 다시 프롬프트를 설계하는 역량이 필요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "목적 적합성, 시각적 오류, 스타일 일관성, 정보 전달 적합성을 모두 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "결과가 왜 잘못되었는지 모르기 때문에 같은 실수를 반복하게 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 문제 이미지 분석",
          question: "이 이미지의 문제점을 클릭으로 표시하고, 각 유형을 분류하세요.",
          hint: "시각적 오류만 보지 말고, 전달 목적 측면(행사 정보가 전달되는지)도 함께 점검하세요. 3개 이상 찾아야 해요.",
          uiMode: "defect_select",
          imageUrl: "/c2m_picnic_defect.png",
          defectCategories: [
            { id: "visual_error",   label: "시각적 오류",       description: "인체·자연·물리 오류" },
            { id: "style_issue",    label: "스타일 일관성 문제", description: "요소 간 스타일이 다름" },
            { id: "purpose_gap",    label: "목적 부합성 문제",   description: "행사 목적과 거리가 있음" },
            { id: "info_delivery",  label: "정보 전달 문제",     description: "핵심 정보가 불분명함" }
          ],
          minMarkers: 3,
          maxMarkers: 8,
          allowText: true,
          textPlaceholder: "문제의 구체적 이유를 짧게 써보세요",
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 잘못된 프롬프트 역추정",
          question: "이런 결과가 나오게 된 원래 프롬프트는 어떤 모습이었을까요? 4가지 관점에서 추정해보세요.",
          hint: "프롬프트가 너무 막연했는지, 스타일 조건이 빠졌는지, 제외 조건이 없었는지 등을 생각하며 추정하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "vagueness",     text: "[추정 1] 요청이 얼마나 막연했을까?" },
            { id: "missing_style", text: "[추정 2] 어떤 스타일 조건이 빠졌을까?" },
            { id: "no_exclude",   text: "[추정 3] 어떤 제외 조건이 없었을까?" },
            { id: "inferred_prompt", text: "[종합 추정] 원래 프롬프트를 한 문장으로 복원하면?" }
          ],
          placeholders: [
            "예: \"아이들이 로봇이랑 노는 그림\" 정도로 아주 막연했을 것 같아요.",
            "예: '그림자는 자연스럽게', '비례는 현실적으로' 같은 조건이 없었을 거예요.",
            "예: '태양은 하나만', '공중에 뜬 물체 없이' 같은 제외 조건이 빠졌을 거예요.",
            "예: \"아이들과 로봇이 공원에서 피크닉하는 그림\" 정도였을 것 같아요."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step3",
          title: "STEP 3 · 개선 기준 세우기",
          question: "아트디렉터로서 새 프롬프트가 갖춰야 할 기준을 세워요.",
          hint: "대상, 분위기, 필수 요소, 제외 요소를 분명히 쓰세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "audience",     text: "누구를 위한 홍보물인가?" },
            { id: "mood",         text: "어떤 분위기여야 하는가?" },
            { id: "must_include", text: "꼭 들어가야 할 요소 3가지" },
            { id: "must_exclude", text: "절대 피해야 할 요소 2가지" }
          ],
          placeholders: [
            "예: 초등학생과 학부모 관람객",
            "예: 밝고 따뜻하며 안전한 느낌",
            "예: 자연스러운 인체 비례, 일관된 그림자, 행사 주제(환경 보호) 연상 요소",
            "예: 공중에 뜬 물체, 손가락 수 오류"
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
          originalPrompt: "아이들이 로봇이랑 노는 그림 그려줘",
          originalImageUrl: "/c2m_picnic_defect.png",
          conditionFields: [
            { id: "target",   label: "대상",         placeholder: "예: 초등학생과 가족" },
            { id: "mood",     label: "분위기",       placeholder: "예: 밝고 따뜻한" },
            { id: "include",  label: "필수 요소",    placeholder: "예: 자연스러운 인체 비례, 환경 보호 연상 요소" },
            { id: "exclude",  label: "제외 요소",    placeholder: "예: 공중에 뜬 물체, 손가락 수 오류" }
          ],
          showSideBySide: true,
          aiCall: {
            provider: "gemini-image",
            mode: "image_gen",
            systemPrompt: "Create a professional, child-friendly poster illustration for an elementary school exhibition. Ensure anatomical accuracy, consistent lighting, and realistic physics. Style: clean vector cartoon, warm colors, clear composition.",
            userPromptTemplate: "{revisedPrompt}",
            outputSchema: "image_url",
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              imageUrl: "/c2m_picnic_good.png"
            }
          },
          placeholder: "예: 초등학생과 가족이 관람할 환경 보호 전시 홍보 포스터. 공원에서 두 아이와 친근한 로봇이 함께 피크닉을 하는 장면. 스타일은 밝은 색의 벡터 카툰, 인체 비례 자연스럽게, 태양은 하늘에 하나, 동물과 사물은 모두 땅이나 자연스러운 위치에 있을 것. 손가락은 다섯 개로 정확히. 공중에 뜬 물체, 녹는 듯한 형태, 중복된 자연 요소는 제외.",
          validation: { required: true, minLength: 100 }
        },
        {
          id: "step5",
          title: "STEP 5 · 개선 효과 분석",
          question: "재생성된 결과가 STEP 3 기준을 얼마나 만족했는지 분석해보세요.",
          hint: "기준별로 '충족 / 부분 충족 / 미충족'을 판단하고 짧게 근거를 써보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step4", mode: "highlight" },
          placeholder: "예: 대상 적합성은 충족(초등학생이 공감할 친근한 장면), 분위기도 충족(밝고 따뜻함), 시각적 오류는 대부분 해결됨(손가락·태양·비례). 다만 환경 보호 주제가 더 선명히 드러나면 좋겠음 — 다음 반복에서 '분리수거함'이나 '나무 심기' 요소를 추가할 수 있겠음.",
          validation: { required: true, minLength: 60 }
        }
      ],

      rubric: {
        axes: [
          { id: "intent",   label: "의도 설정",   description: "오류 분석이 목적 적합성까지 포함하는가" },
          { id: "ai_use",   label: "AI 활용",     description: "추정한 원래 프롬프트가 결과 문제와 연결되는가" },
          { id: "revision", label: "수정과 개선", description: "개선 프롬프트가 목적·대상·스타일을 분명히 담고 있는가" }
        ]
      },

      submit: {
        title: "개선 프롬프트 설계 완료!",
        message: "아트디렉터로서 결과를 역추정하고, 체계적인 개선 프롬프트를 설계했어요.",
        summaryLabels: {
          step1: "오류 분석",
          step2: "프롬프트 역추정",
          step3: "개선 기준",
          step4: "최종 프롬프트 + 재생성",
          step5: "개선 효과 분석"
        },
        artifact: {
          bindingKey: "c_2_h_prompt_design",
          template: "[오류 분석]\n{step1}\n\n[역추정 프롬프트]\n{step2_inferred_prompt}\n\n[개선 프롬프트]\n{step4_revisedPrompt}\n\n[효과 분석]\n{step5}"
        }
      }
    }
  }
};
