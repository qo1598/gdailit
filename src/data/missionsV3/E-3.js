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
      description: "추천 화면을 보고, 내 대답과 추천 결과의 관계를 생각하는 미션이에요.",
      intro: [
        { text: "앱을 보다 보면 내가 좋아할 만한 동영상, 음식, 장난감이나 물건이 먼저 보일 때가 있어요.\n어떤 때는 \"어? 이거 내가 좋아할 것 같은데?\" 하고 느끼기도 하지요." },
        { text: "이런 추천은 그냥 아무 이유 없이 나오는 것이 아니라,\n내가 고른 것과 내가 답한 내용에서 비슷한 점을 찾아 보여주는 경우가 많아요." },
        { text: "오늘은 내가 좋아하는 주제를 하나 고르고, 질문에 답한 뒤,\n나에게 나온 추천을 보며 왜 이런 추천이 나왔는지 생각해 볼 거예요." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 우리가 자주 만나는 AI 기능이에요. 추천이 어떻게 나오는지 생각해 보는 것은 AI가 내가 준 정보에서 힌트를 얻어 결과를 보여줄 수 있다는 점을 이해하는 첫걸음이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 무엇을 골랐는지, 어떤 질문에 어떻게 대답했는지, 그리고 마지막 추천 결과와 어떤 점이 이어지는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 그냥 우연이라고 생각해서, AI가 내 선택과 대답을 바탕으로 비슷한 것을 보여줄 수 있다는 점을 놓칠 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 주제 고르기",
          question: "오늘 탐색할 주제를 하나 골라보세요.",
          hint: "내가 좋아하는 주제를 하나 고르면, 그 주제에 맞는 질문이 나와요.",
          uiMode: "single_select_cards",
          options: [
            { id: "animal", label: "동물" },
            { id: "cooking", label: "요리" },
            { id: "vehicle", label: "탈것" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 질문에 답하기",
          question: "질문을 읽고 예 또는 아니오로 답해주세요.",
          hint: "솔직하게 대답해야 나에게 잘 맞는 추천이 나와요!",
          uiMode: "yesno_quiz",
          questionsByTopic: {
            animal: [
              { id: "q1", text: "귀여운 동물을 좋아하나요?" },
              { id: "q2", text: "큰 동물을 좋아하나요?" },
              { id: "q3", text: "빠르게 움직이는 동물을 좋아하나요?" },
              { id: "q4", text: "무서운 동물은 싫나요?" },
              { id: "q5", text: "털이 복슬복슬한 동물을 좋아하나요?" },
              { id: "q6", text: "물에서 사는 동물을 좋아하나요?" },
              { id: "q7", text: "날아다니는 동물을 좋아하나요?" },
              { id: "q8", text: "집에서 키울 수 있는 동물을 좋아하나요?" },
              { id: "q9", text: "조용한 동물을 좋아하나요?" },
              { id: "q10", text: "특별하고 신기한 동물을 좋아하나요?" }
            ],
            cooking: [
              { id: "q1", text: "달콤한 음식을 좋아하나요?" },
              { id: "q2", text: "따뜻한 음식을 좋아하나요?" },
              { id: "q3", text: "차갑고 시원한 음식을 좋아하나요?" },
              { id: "q4", text: "바삭한 식감을 좋아하나요?" },
              { id: "q5", text: "부드러운 식감을 좋아하나요?" },
              { id: "q6", text: "손으로 집어먹기 쉬운 음식을 좋아하나요?" },
              { id: "q7", text: "알록달록한 음식을 좋아하나요?" },
              { id: "q8", text: "과일이 들어간 음식을 좋아하나요?" },
              { id: "q9", text: "배부르게 먹을 수 있는 음식을 좋아하나요?" },
              { id: "q10", text: "만들 때 재미있는 음식을 좋아하나요?" }
            ],
            vehicle: [
              { id: "q1", text: "빠르게 달리는 것을 좋아하나요?" },
              { id: "q2", text: "아주 큰 탈것을 좋아하나요?" },
              { id: "q3", text: "하늘을 나는 탈것을 좋아하나요?" },
              { id: "q4", text: "물에서 움직이는 탈것을 좋아하나요?" },
              { id: "q5", text: "시끄러운 소리가 나는 탈것을 좋아하나요?" },
              { id: "q6", text: "사람을 도와주는 탈것을 좋아하나요?" },
              { id: "q7", text: "공사할 때 쓰는 탈것을 좋아하나요?" },
              { id: "q8", text: "바퀴가 많은 탈것을 좋아하나요?" },
              { id: "q9", text: "멀리 여행 가는 탈것을 좋아하나요?" },
              { id: "q10", text: "멋지고 특별해 보이는 탈것을 좋아하나요?" }
            ]
          },
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 추천 결과 보기",
          question: "내 대답을 바탕으로 추천 결과가 나왔어요!",
          hint: "내가 한 대답들이 모여서 이 결과가 나왔어요. 잘 살펴보세요.",
          uiMode: "recommendation_reveal",
          recommendationsByTopic: {
            animal: {
              items: [
                { id: "rabbit", label: "토끼", reasonTags: ["cute", "small", "pet", "quiet", "not_scary"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q2", answer: false }, { qId: "q4", answer: true }, { qId: "q8", answer: true }, { qId: "q9", answer: true }] },
                { id: "dog", label: "강아지", reasonTags: ["cute", "active", "fluffy", "pet"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q3", answer: true }, { qId: "q5", answer: true }, { qId: "q8", answer: true }] },
                { id: "cat", label: "고양이", reasonTags: ["cute", "fluffy", "pet", "quiet"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q5", answer: true }, { qId: "q8", answer: true }, { qId: "q9", answer: true }] },
                { id: "dolphin", label: "돌고래", reasonTags: ["water", "special"],
                  matchRules: [{ qId: "q6", answer: true }, { qId: "q10", answer: true }] },
                { id: "eagle", label: "독수리", reasonTags: ["flying", "fast", "special"],
                  matchRules: [{ qId: "q7", answer: true }, { qId: "q3", answer: true }, { qId: "q10", answer: true }] },
                { id: "penguin", label: "펭귄", reasonTags: ["cute", "water", "special"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q6", answer: true }, { qId: "q10", answer: true }] },
                { id: "tiger", label: "호랑이", reasonTags: ["big", "fast", "special"],
                  matchRules: [{ qId: "q2", answer: true }, { qId: "q3", answer: true }, { qId: "q10", answer: true }] },
                { id: "giraffe", label: "기린", reasonTags: ["big", "not_scary", "quiet", "special"],
                  matchRules: [{ qId: "q2", answer: true }, { qId: "q4", answer: true }, { qId: "q9", answer: true }, { qId: "q10", answer: true }] }
              ]
            },
            cooking: {
              items: [
                { id: "cookie", label: "쿠키", reasonTags: ["sweet", "crispy", "fun_to_make"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q4", answer: true }, { qId: "q10", answer: true }] },
                { id: "pizza", label: "피자", reasonTags: ["warm", "handheld", "filling"],
                  matchRules: [{ qId: "q2", answer: true }, { qId: "q6", answer: true }, { qId: "q9", answer: true }] },
                { id: "fruit_skewer", label: "과일꼬치", reasonTags: ["colorful", "fruity", "fun_to_make"],
                  matchRules: [{ qId: "q7", answer: true }, { qId: "q8", answer: true }, { qId: "q10", answer: true }] },
                { id: "gimbap", label: "김밥", reasonTags: ["handheld", "colorful", "filling"],
                  matchRules: [{ qId: "q6", answer: true }, { qId: "q7", answer: true }, { qId: "q9", answer: true }] },
                { id: "icecream", label: "아이스크림", reasonTags: ["sweet", "cold", "soft"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q3", answer: true }, { qId: "q5", answer: true }] },
                { id: "sandwich", label: "샌드위치", reasonTags: ["soft", "handheld", "filling"],
                  matchRules: [{ qId: "q5", answer: true }, { qId: "q6", answer: true }, { qId: "q9", answer: true }] },
                { id: "pancake", label: "팬케이크", reasonTags: ["sweet", "warm", "soft", "fun_to_make"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q2", answer: true }, { qId: "q5", answer: true }, { qId: "q10", answer: true }] },
                { id: "riceball", label: "주먹밥", reasonTags: ["warm", "filling", "fun_to_make"],
                  matchRules: [{ qId: "q2", answer: true }, { qId: "q9", answer: true }, { qId: "q10", answer: true }] }
              ]
            },
            vehicle: {
              items: [
                { id: "sports_car", label: "스포츠카", reasonTags: ["fast", "special"],
                  matchRules: [{ qId: "q1", answer: true }, { qId: "q10", answer: true }] },
                { id: "train", label: "기차", reasonTags: ["big", "many_wheels", "travel_far"],
                  matchRules: [{ qId: "q2", answer: true }, { qId: "q8", answer: true }, { qId: "q9", answer: true }] },
                { id: "airplane", label: "비행기", reasonTags: ["flying", "travel_far", "big"],
                  matchRules: [{ qId: "q3", answer: true }, { qId: "q9", answer: true }, { qId: "q2", answer: true }] },
                { id: "ship", label: "배", reasonTags: ["water", "big", "travel_far"],
                  matchRules: [{ qId: "q4", answer: true }, { qId: "q2", answer: true }, { qId: "q9", answer: true }] },
                { id: "fire_truck", label: "소방차", reasonTags: ["helpful", "loud", "special"],
                  matchRules: [{ qId: "q6", answer: true }, { qId: "q5", answer: true }, { qId: "q10", answer: true }] },
                { id: "police_car", label: "경찰차", reasonTags: ["helpful", "fast", "loud"],
                  matchRules: [{ qId: "q6", answer: true }, { qId: "q1", answer: true }, { qId: "q5", answer: true }] },
                { id: "excavator", label: "굴착기", reasonTags: ["construction", "big", "special"],
                  matchRules: [{ qId: "q7", answer: true }, { qId: "q2", answer: true }, { qId: "q10", answer: true }] },
                { id: "bus", label: "버스", reasonTags: ["big", "many_wheels", "helpful"],
                  matchRules: [{ qId: "q2", answer: true }, { qId: "q8", answer: true }, { qId: "q6", answer: true }] }
              ]
            }
          },
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 추천 이유 생각하기",
          question: "왜 이런 추천이 나왔다고 생각하나요?",
          hint: "내가 어떤 질문에 어떻게 답했는지 떠올려 보세요.",
          uiMode: "free_text",
          placeholder: "예: 귀엽고 집에서 키울 수 있는 동물을 좋아해서요.",
          validation: { required: true }
        }
      ],
      submit: {
        title: "추천 탐색 완료!",
        message: "내 대답과 추천 결과의 관계를 찾아냈어요.",
        summaryLabels: { step1: "선택한 주제", step2: "질문 응답", step3: "추천 결과", step4: "추천 이유" }
      }
    },
    middle: {
      cardCode: "E-3-M",
      performanceType: "SJ",
      description: "쇼핑몰 옷에 별점을 주고, 내 평가가 추천 결과에 어떻게 반영되는지 살펴보는 미션이에요.",
      intro: [
        { text: "쇼핑몰이나 앱을 보다 보면 내가 좋아할 것 같은 옷이나 물건이 먼저 보일 때가 있어요.\n이런 추천은 그냥 아무 이유 없이 나오는 것이 아니라, 내가 클릭한 것, 오래 본 것, 높게 평가한 것을 바탕으로 달라질 수 있어요." },
        { text: "오늘은 작은 쇼핑몰 화면에서 여러 옷을 보고 별점을 매겨 볼 거예요.\n그리고 내가 준 별점을 바탕으로 추천 옷이 어떻게 바뀌는지 살펴볼 거예요." },
        { text: "\"왜 자꾸 이런 옷을 추천할까?\", \"이 추천이 내 선택에 어떤 영향을 줄까?\"를 함께 생각해 봐요." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 추천은 사람의 반응과 선택을 바탕으로 바뀔 수 있어요. 이 활동은 AI가 내가 준 정보를 보고 비슷한 특징을 찾을 수 있다는 점과, 그 추천이 다시 내 선택에 영향을 줄 수 있다는 점을 이해하는 데 도움이 돼요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 어떤 옷에 높은 별점을 주었는지, 그 뒤에 추천 옷이 어떤 특징으로 바뀌었는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천이 그냥 우연히 나온다고 생각할 수 있고, AI가 내 선택을 바탕으로 결과를 바꾸며 내 생각과 선택에도 영향을 줄 수 있다는 점을 놓칠 수 있어요." }
      ],
      clothingItems: [
        { id: "cloth_01", name: "노란 줄무늬 티셔츠",      colorHex: "#fbbf24", emoji: "👕", tags: ["bright_color", "cute_style",   "tshirt", "summer"] },
        { id: "cloth_02", name: "검정 트레이닝 바지",      colorHex: "#334155", emoji: "👖", tags: ["dark_color",   "sporty_style", "pants",  "allseason"] },
        { id: "cloth_03", name: "민트 후드티",             colorHex: "#6ee7b7", emoji: "🧥", tags: ["pastel_color", "cute_style",   "hoodie", "allseason"] },
        { id: "cloth_04", name: "빨간 원피스 치마",        colorHex: "#ef4444", emoji: "👗", tags: ["vivid_color",  "fancy_style",  "skirt",  "summer"] },
        { id: "cloth_05", name: "하늘색 청바지",           colorHex: "#7dd3fc", emoji: "👖", tags: ["pastel_color", "clean_style",  "pants",  "allseason"] },
        { id: "cloth_06", name: "회색 맨투맨",             colorHex: "#94a3b8", emoji: "🧥", tags: ["dark_color",   "clean_style",  "hoodie", "winter"] },
        { id: "cloth_07", name: "연분홍 모자",             colorHex: "#f9a8d4", emoji: "🧢", tags: ["pastel_color", "cute_style",   "hat",    "allseason"] },
        { id: "cloth_08", name: "흰색 운동화",             colorHex: "#e2e8f0", emoji: "👟", tags: ["bright_color", "sporty_style", "shoes",  "allseason"] },
        { id: "cloth_09", name: "레몬 민소매 티",          colorHex: "#fde047", emoji: "👕", tags: ["bright_color", "cute_style",   "tshirt", "summer"] },
        { id: "cloth_10", name: "네이비 패딩 조끼",        colorHex: "#1e3a8a", emoji: "🧥", tags: ["dark_color",   "sporty_style", "hoodie", "winter"] },
        { id: "cloth_11", name: "라벤더 플리츠 치마",      colorHex: "#c4b5fd", emoji: "👗", tags: ["pastel_color", "cute_style",   "skirt",  "summer"] },
        { id: "cloth_12", name: "오렌지 스트라이프 후드",  colorHex: "#fb923c", emoji: "🧥", tags: ["vivid_color",  "sporty_style", "hoodie", "winter"] },
        { id: "cloth_13", name: "파란 스트라이프 티셔츠",  colorHex: "#60a5fa", emoji: "👕", tags: ["bright_color", "clean_style",  "tshirt", "summer"] },
        { id: "cloth_14", name: "베이지 카디건",           colorHex: "#d4b896", emoji: "🧥", tags: ["pastel_color", "clean_style",  "hoodie", "allseason"] },
        { id: "cloth_15", name: "초록 반바지",             colorHex: "#4ade80", emoji: "👖", tags: ["vivid_color",  "sporty_style", "pants",  "summer"] },
        { id: "cloth_16", name: "흰 레이스 치마",          colorHex: "#f1f5f9", emoji: "👗", tags: ["bright_color", "fancy_style",  "skirt",  "summer"] },
        { id: "cloth_17", name: "블랙 스키니진",           colorHex: "#1e293b", emoji: "👖", tags: ["dark_color",   "clean_style",  "pants",  "allseason"] },
        { id: "cloth_18", name: "보라 볼캡",               colorHex: "#a855f7", emoji: "🧢", tags: ["vivid_color",  "cute_style",   "hat",    "allseason"] },
        { id: "cloth_19", name: "분홍 스니커즈",           colorHex: "#f472b6", emoji: "👟", tags: ["pastel_color", "cute_style",   "shoes",  "allseason"] },
        { id: "cloth_20", name: "블랙 후드집업",           colorHex: "#0f172a", emoji: "🧥", tags: ["dark_color",   "sporty_style", "hoodie", "winter"] }
      ],
      recommendationRules: {
        bright_color:  { label: "밝은 색 옷을 자주 높게 평가했어요",   items: ["cloth_01", "cloth_08", "cloth_09", "cloth_13", "cloth_16"] },
        dark_color:    { label: "어두운 색 옷을 자주 높게 평가했어요",  items: ["cloth_02", "cloth_06", "cloth_10", "cloth_17", "cloth_20"] },
        pastel_color:  { label: "파스텔 색 옷을 자주 높게 평가했어요",  items: ["cloth_03", "cloth_05", "cloth_07", "cloth_11", "cloth_14", "cloth_19"] },
        vivid_color:   { label: "원색 옷을 자주 높게 평가했어요",       items: ["cloth_04", "cloth_12", "cloth_15", "cloth_18"] },
        cute_style:    { label: "귀여운 스타일을 좋아하는 것 같아요",   items: ["cloth_01", "cloth_03", "cloth_07", "cloth_09", "cloth_11", "cloth_18", "cloth_19"] },
        sporty_style:  { label: "스포티한 스타일을 좋아하는 것 같아요", items: ["cloth_02", "cloth_08", "cloth_10", "cloth_12", "cloth_15", "cloth_20"] },
        clean_style:   { label: "깔끔한 스타일을 좋아하는 것 같아요",   items: ["cloth_05", "cloth_06", "cloth_13", "cloth_14", "cloth_17"] },
        fancy_style:   { label: "화려한 스타일을 좋아하는 것 같아요",   items: ["cloth_04", "cloth_12", "cloth_16"] },
        summer:        { label: "여름 옷을 자주 높게 평가했어요",       items: ["cloth_01", "cloth_04", "cloth_09", "cloth_11", "cloth_13", "cloth_15", "cloth_16"] },
        winter:        { label: "겨울 옷을 자주 높게 평가했어요",       items: ["cloth_06", "cloth_10", "cloth_12", "cloth_20"] },
        allseason:     { label: "사계절 옷을 자주 높게 평가했어요",     items: ["cloth_02", "cloth_03", "cloth_05", "cloth_07", "cloth_08", "cloth_14", "cloth_17", "cloth_18", "cloth_19"] }
      },
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 옷 보기",
          question: "쇼핑몰에 옷 20개가 있어요. 어떤 옷이 있는지 살펴보세요.",
          hint: "상단에 AI 추천 TOP 3가 있고, 아래에 전체 20개 옷이 있어요. 다음 단계에서 별점을 줄 거예요.",
          uiMode: "clothing_grid_with_rec",
          initialRecommendedIds: ["cloth_01", "cloth_03", "cloth_11"],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 별점 주기",
          question: "각 옷을 하나씩 보면서 별점 1~5점을 주세요.",
          hint: "솔직하게 평가할수록 나에게 맞는 추천이 나와요! 별점 4~5점을 주면 취향이 나타나요.",
          uiMode: "star_rating_carousel",
          ratingMin: 1,
          ratingMax: 5,
          validation: { required: true, minRated: 10 }
        },
        {
          id: "step3",
          title: "STEP 3 · 추천 결과 보기",
          question: "내 별점을 바탕으로 AI가 옷 TOP 3를 추천해요!",
          hint: "내가 높게 평가한 옷의 특징을 바탕으로 추천이 나왔어요.",
          uiMode: "recommendation_grid",
          recommendationCount: 3,
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 생각해 보기",
          question: "추천 결과를 보고 아래 질문에 답해 보세요.",
          hint: "정답이 없어요. 솔직하게 생각을 써보세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "q1", text: "내가 어떤 특징의 옷을 좋아한 것 같나요?" },
            { id: "q2", text: "AI가 추천한 옷은 내가 높게 평가한 옷과 무엇이 비슷한가요?" },
            { id: "q3", text: "AI가 추천한 것을 고르면 나의 다음 선택에 어떤 영향을 줄 수 있을까요?" }
          ],
          placeholders: [
            "예: 밝은색이고 귀여운 스타일의 옷을 좋아한 것 같아요.",
            "예: 비슷한 색깔이나 스타일의 옷이 추천됐어요.",
            "예: 비슷한 옷만 계속 보게 되어서 새로운 스타일을 놓칠 수 있어요."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],
      submit: {
        title: "추천 탐색 완료!",
        message: "내 평가가 추천에 어떤 영향을 주는지 살펴봤어요.",
        summaryLabels: {
          step1: "옷 둘러보기",
          step2: "별점 평가",
          step3: "AI 추천 결과",
          step4: "생각 정리"
        }
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
            { id: "personalized", label: "나에게 맞춰줘요" },
            { id: "other", label: "기타" }
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
            { id: "too_much", label: "너무 많이 보게 돼요" },
            { id: "other", label: "기타" }
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
