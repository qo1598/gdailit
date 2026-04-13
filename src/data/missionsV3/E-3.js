export const E3_V3 = {
  meta: {
    code: "E-3",
    title: "왜 나한테 이걸 보여줄까?",
    domain: "Engaging",
    ksa: { K: ["K1.1", "K5.1"], S: ["Self and Social Awareness"], A: ["Curious"] }
  },
  grades: {
    lower: {
      cardCode: "E-3-L",
      performanceType: "TD",
      description: "추천된 것과 내가 좋아하는 것 사이의 비슷한 점을 찾는 미션이에요.",
      intro: [
        { text: "영상 앱이나 쇼핑 앱은 내가 좋아할 것 같은 것을 먼저 보여줄 때가 있어요.\n그래서 어떤 것은 '어? 내가 좋아하는 거네!' 하고 느껴질 수 있어요." },
        { text: "이런 추천은 그냥 우연히 나오는 것이 아니라, 내가 본 것과 비슷한 것을 보여주는 경우가 많아요.\n추천은 편리하지만, 왜 이걸 보여주는지 생각해 보는 것도 중요해요." },
        { text: "오늘은 추천 화면을 보고 왜 이런 것이 나왔는지 생각해 볼 거예요.\n내가 좋아하는 것과 추천의 관계를 찾아봅시다!" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 우리 생활에서 자주 만나는 AI 기능이에요. 추천이 어떻게 보이는지 알아차리는 것은 AI를 이해하는 첫걸음이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 좋아하는 것과 추천된 것 사이에 비슷한 점이 있는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 그냥 우연이라고 생각하고, AI가 나에게 맞춰 보여주고 있다는 점을 놓칠 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 내 취향 고르기",
          question: "내가 좋아하는 것을 2개 골라보세요.",
          hint: "평소에 영상이나 책에서 자주 찾아보는 주제를 골라보세요. 내 취향이 추천에 영향을 준답니다!",
          uiMode: "choice_cards",
          options: [
            { id: "animals", label: "동물", emoji: "🐾", isAI: true },
            { id: "cars", label: "자동차", emoji: "🚗", isAI: true },
            { id: "dinosaurs", label: "공룡", emoji: "🦕", isAI: true },
            { id: "picture_books", label: "그림책", emoji: "📚", isAI: true },
            { id: "soccer", label: "축구", emoji: "⚽", isAI: true },
            { id: "cooking", label: "요리", emoji: "🍳", isAI: true }
          ],
          validation: { minSelections: 2 }
        },
        {
          id: "step2",
          title: "STEP 2 · 비슷한 추천 고르기",
          question: "어떤 추천이 내 취향과 비슷한가요?",
          hint: "앱이 나에게 추천한 카드들이에요. 내가 고른 취향과 비슷한 것이 있나요? 2개를 골라보세요!",
          uiMode: "choice_cards",
          options: [
            { id: "rec_dog_video", label: "귀여운 강아지 영상", emoji: "🐶", isAI: true },
            { id: "rec_race_car", label: "자동차 경주 영상", emoji: "🏎️", isAI: true },
            { id: "rec_dino_doc", label: "공룡 다큐멘터리", emoji: "🦖", isAI: true },
            { id: "rec_cooking_show", label: "어린이 요리 프로그램", emoji: "👨‍🍳", isAI: true },
            { id: "rec_math", label: "수학 풀기 영상", emoji: "📐", isAI: false },
            { id: "rec_news", label: "어른용 뉴스", emoji: "📺", isAI: false }
          ],
          validation: { minSelections: 2 }
        }
      ],
      submit: {
        title: "추천 비슷함을 잘 찾았어요!",
        message: "AI가 내 취향을 보고 추천한다는 걸 알았어요.",
        summaryLabels: { step1: "내 취향", step2: "고른 추천" }
      }
    },
    middle: {
      cardCode: "E-3-M",
      performanceType: "SJ",
      description: "추천 결과를 보고 왜 이런 추천이 나왔는지 추측하는 미션이에요.",
      intro: [
        { text: "영상 앱, 쇼핑 앱, 음악 앱은 내가 좋아할 만한 것을 추천해 줘요.\n어떤 추천은 마음에 들지만, 어떤 추천은 왜 나왔는지 궁금할 때도 있어요." },
        { text: "추천은 내가 본 것, 선택한 것, 머문 것과 비슷한 것을 바탕으로 나올 수 있어요.\n그래서 추천은 편리하지만, 내 관심이 한쪽으로 몰릴 수도 있어요." },
        { text: "오늘은 추천 화면을 보고 왜 이런 추천이 나왔을지 생각해 볼 거예요.\n추천이 어떻게 나를 따라오는지 살펴봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 우리가 자주 만나는 AI 기능이에요. 추천이 왜 나왔는지 생각해 볼 수 있어야 AI가 내 선택에 어떤 영향을 주는지 이해할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 전에 본 것과 지금 추천된 것이 어떻게 비슷한지, 어떤 흔적 때문에 이런 추천이 나왔는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 무심코 받아들이고, 비슷한 것만 계속 보게 되거나 생각이 한쪽으로 쏠릴 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 추천 이유 연결하기",
          question: "왜 이런 추천이 나왔을까요? 이전에 본 것과 연결해보세요.",
          hint: "추천은 보통 내가 전에 오래 본 것, 자주 선택한 것, 주제가 비슷한 것에서 나와요. 각 추천 카드가 어떤 이전 활동과 연결될지 골라보세요!",
          uiMode: "match_select",
          historyCards: [
            { id: "h1", label: "강아지 훈련 영상" },
            { id: "h2", label: "축구 하이라이트" },
            { id: "h3", label: "어린이 과학 실험" }
          ],
          recommendations: [
            { id: "rec1", label: "고양이 돌보기 영상", description: "반려동물 관련 콘텐츠예요." },
            { id: "rec2", label: "농구 경기 영상", description: "스포츠 관련 콘텐츠예요." },
            { id: "rec3", label: "자연 다큐멘터리", description: "동물과 자연 관련 콘텐츠예요." },
            { id: "rec4", label: "어린이 발명 대회", description: "과학·발명 관련 콘텐츠예요." }
          ],
          reasonOptions: [
            { id: "same_topic", label: "비슷한 주제" },
            { id: "same_character", label: "같은 등장인물/종류" },
            { id: "same_mood", label: "비슷한 분위기" },
            { id: "watched_long", label: "오래 본 것" },
            { id: "chosen_often", label: "자주 고른 것" }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "추천 이유 분석 완료!",
        message: "추천과 이전 활동의 관계를 찾는 힘이 생겼어요.",
        summaryLabels: { step1: "추천-이전기록 연결 결과" }
      }
    },
    upper: {
      cardCode: "E-3-H",
      performanceType: "SJ",
      description: "추천 기능의 장점과 한계를 비교하여 판단하는 미션이에요.",
      intro: [
        { text: "추천 기능은 내가 좋아할 만한 것을 빠르게 찾게 도와줘요.\n그래서 편리하지만, 비슷한 것만 계속 보여 줄 수도 있어요." },
        { text: "어떤 추천은 시간을 아껴 주지만, 어떤 추천은 새로운 것을 볼 기회를 줄일 수도 있어요.\n추천은 내 선택을 도와주기도 하고, 내 선택을 좁히기도 할 수 있어요." },
        { text: "오늘은 추천의 좋은 점과 아쉬운 점을 함께 살펴볼 거예요.\n추천을 받을 때 무엇을 조심해야 하는지 생각해 봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 편리하지만, 내가 보는 정보와 관심을 바꿀 수도 있어요. 추천의 좋은 점과 한계를 함께 생각할 수 있어야 더 주도적으로 AI를 사용할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "추천이 얼마나 편리한지뿐 아니라, 비슷한 것만 계속 보여 주는지, 새로운 선택을 막지는 않는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 무조건 좋은 것으로만 생각하고, 다양한 정보나 새로운 선택을 놓칠 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 좋은 점 고르기",
          question: "추천 기능의 좋은 점은 무엇인가요?",
          hint: "추천이 내 생활에서 어떤 도움을 주는지 생각해 보세요. 시간이 절약되거나, 관심 있는 것을 더 쉽게 찾을 수 있는 경험이 있었나요?",
          uiMode: "multi_select_chips",
          chips: [
            { id: "time_saving", label: "시간을 아껴줘요" },
            { id: "easy_to_find", label: "좋아하는 것 찾기 쉬워요" },
            { id: "continue_interest", label: "관심 있는 것을 계속 볼 수 있어요" },
            { id: "personalized", label: "나에게 맞춰줘요" }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step2",
          title: "STEP 2 · 아쉬운 점 고르기",
          question: "추천 기능의 아쉬운 점은 무엇인가요?",
          hint: "추천이 항상 좋은 것만은 아니에요. 비슷한 것만 계속 보게 되면 어떤 문제가 생길 수 있을까요?",
          uiMode: "multi_select_chips",
          chips: [
            { id: "similar_only", label: "비슷한 것만 보게 돼요" },
            { id: "miss_new", label: "새로운 것을 놓쳐요" },
            { id: "narrow_view", label: "생각이 좁아질 수 있어요" },
            { id: "too_much", label: "너무 많이 보게 돼요" }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 상황별 판단하기",
          question: "추천은 언제 도움이 되고, 언제 조심해야 할까요?",
          hint: "상황마다 추천이 도움이 될 수도, 오히려 방해가 될 수도 있어요. 각 상황을 보고 판단해 보세요.",
          uiMode: "per_case_judge",
          judgmentOptions: [
            { id: "helpful", label: "도움이 돼요" },
            { id: "careful", label: "조심해야 해요" }
          ],
          reasonOptions: [
            { id: "saves_time", label: "시간을 아껴줘요" },
            { id: "narrows_choices", label: "선택을 좁혀요" },
            { id: "increases_variety", label: "다양성을 높여요" },
            { id: "creates_habit", label: "습관이 생겨요" }
          ],
          cases: [
            { id: "s1", title: "좋아하는 가수 음악을 계속 찾을 때", description: "음악 앱이 같은 가수의 다른 음악을 추천해 줘요." },
            { id: "s2", title: "숙제 주제를 조사할 때", description: "검색하면 항상 내가 좋아하는 내용만 나와서 다른 시각은 보기 어려워요." },
            { id: "s3", title: "새로운 취미를 찾고 싶을 때", description: "늘 보던 것만 추천되어서 새로운 것을 발견하기 어려워요." }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "추천 판단 능력 완성!",
        message: "추천의 장점과 한계를 함께 생각하는 힘이 생겼어요.",
        summaryLabels: { step1: "추천의 좋은 점", step2: "추천의 아쉬운 점", step3: "상황별 판단" }
      }
    }
  }
};
