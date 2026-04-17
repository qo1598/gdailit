export const E1_V3 = {
  meta: {
    code: "E-1",
    title: "생활 속 AI 찾기",
    domain: "Engaging",
    ksa: { K: ["K1.4"], S: ["Self Awareness"], A: ["Curious"] }
  },
  grades: {
    lower: {
      cardCode: "E-1-L",
      performanceType: "TD",
      description: "생활 속에서 AI가 들어 있는 것을 찾아보는 미션이에요.",
      intro: [
        { text: "집에서 로봇청소기가 움직이거나, 휴대전화가 내 얼굴을 알아보는 것을 본 적이 있나요?\n어떤 앱은 내가 좋아할 만한 영상을 골라 보여주기도 해요.", emoji: "🤔" },
        { text: "이렇게 우리 주변에는 사람을 도와주는 똑똑한 기술이 숨어 있어요.\n이런 기술 가운데에는 AI가 들어 있는 것도 있어요.", emoji: "🌟" },
        { text: "오늘은 내가 직접 AI 찾기 탐정이 되어 생활 속 AI를 찾아볼 거예요.\n과연 어디에 AI가 숨어 있을까요? 하나씩 찾아봅시다!", emoji: "🔍" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "우리 곁에 AI가 어디 있는지 알기 위해서예요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "사람처럼 스스로 일하는 기계를 찾아보세요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "직접 손으로 움직여야 해서 불편할 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "보기",
          question: "AI가 들어 있을 것 같은 것은 무엇인가요?",
          hint: "AI는 스스로 생각하거나 판단하는 기계예요. 내가 직접 버튼을 누르지 않아도 혼자서 움직이거나 결정하면 AI일 가능성이 높아요!",
          uiMode: "choice_cards",
          options: [
            { id: "robot_vacuum", label: "로봇청소기", emoji: "🤖", isAI: true },
            { id: "voice_assistant", label: "음성 비서", emoji: "🎙️", isAI: true },
            { id: "recommend_feed", label: "추천 영상", emoji: "📱", isAI: true },
            { id: "face_unlock", label: "얼굴 인식", emoji: "👁️", isAI: true },
            { id: "calculator", label: "계산기", emoji: "🔢", isAI: false },
            { id: "lamp", label: "전등", emoji: "💡", isAI: false }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step2",
          title: "찾기",
          question: "내 주변에서 비슷한 것을 찾을 수 있나요?",
          hint: "집에서 가장 찾기 쉬운 AI는 스마트폰이에요! 내 얼굴을 알아보거나 말을 알아듣는 기능이 있으면 AI가 들어 있는 거예요.",
          uiMode: "photo_or_card_select",
          cardOptions: [
            { id: "home_robot_cleaner", label: "집 로봇청소기", emoji: "🤖" },
            { id: "navigation_app", label: "길 안내 앱", emoji: "🗺️" },
            { id: "voice_speaker", label: "AI 스피커", emoji: "🔊" },
            { id: "face_camera", label: "얼굴 인식 카메라", emoji: "📷" },
            { id: "recommend_app", label: "추천 앱", emoji: "📱" },
            { id: "auto_door", label: "자동문", emoji: "🚪" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "장소 고르기",
          question: "어디에서 찾았나요?",
          hint: "내가 찾은 AI가 있는 장소를 떠올려 보세요. 집 거실, 학교 도서관, 마트 등 어디서 자주 보이나요?",
          uiMode: "single_select_buttons",
          options: [
            { id: "home", label: "집", emoji: "🏠" },
            { id: "school", label: "학교", emoji: "🏫" },
            { id: "street", label: "길", emoji: "🛣️" },
            { id: "car", label: "자동차", emoji: "🚗" },
            { id: "store", label: "가게", emoji: "🏪" },
            { id: "other", label: "기타", emoji: "📌" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "도움 고르기",
          question: "이것은 어떤 도움을 주나요?",
          hint: "내가 찾은 AI가 사람 대신 무엇을 해주는지 생각해 보세요. 예를 들어 로봇청소기는 직접 청소를 해주고, 음성 비서는 질문에 대답을 해줘요.",
          uiMode: "single_select_buttons",
          options: [
            { id: "recognize", label: "알아보기", emoji: "🔍" },
            { id: "recommend", label: "추천하기", emoji: "⭐" },
            { id: "speak", label: "말해주기", emoji: "💬" },
            { id: "clean", label: "청소하기", emoji: "🧹" },
            { id: "navigate", label: "길 알려주기", emoji: "🗺️" },
            { id: "other", label: "기타", emoji: "📌" }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "생활 속 AI를 잘 찾았어요!",
        message: "이제 주변의 AI를 더 잘 알아볼 수 있어요.",
        summaryLabels: { step1: "내가 고른 AI 예시", step2: "내가 찾은 AI", step3: "찾은 장소", step4: "하는 일" }
      }
    },
    middle: {
      cardCode: "E-1-M",
      performanceType: "TD",
      description: "생활 속에서 AI가 들어 있는 기기나 앱을 찾고, 어떤 일을 하는지 설명하는 미션이에요.",
      intro: [
        { text: "휴대전화는 내 얼굴을 알아보기도 하고, 영상 앱은 내가 좋아할 만한 영상을 먼저 보여주기도 해요.\n내비게이션은 길을 알려주고, 번역 앱은 말이나 글을 다른 언어로 바꿔 주기도 해요." },
        { text: "이렇게 우리 생활 속에는 사람을 도와주는 여러 기술이 숨어 있어요.\n그런데 모든 전자기기가 다 AI인 것은 아니고, 어떤 것은 그냥 정해진 대로만 움직여요." },
        { text: "오늘은 생활 속에서 AI가 들어 있는 것을 찾고, 그것이 어떤 일을 하는지 살펴볼 거예요.\n내가 찾은 기술은 사람을 어떻게 돕는지 생각해 봅시다!" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 이미 우리 생활 곳곳에서 사용되고 있어요. 생활 속 AI를 알아차릴 수 있어야 AI가 어떤 도움을 주는지 생각하고, 필요할 때 더 잘 활용할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 찾은 기기나 앱이 어떤 일을 하는지, 그리고 그 일이 단순한 작동인지 아니면 알아보거나 추천하거나 판단하는 것인지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 있는 기술을 그냥 편리한 도구로만 여기게 되고, 내가 이미 어떤 AI를 사용하고 있는지조차 잘 모를 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 예시 살펴보기",
          question: "어떤 것이 AI가 들어 있는 것 같나요?",
          hint: "AI는 스스로 생각하거나 판단하는 기계예요. 사용자가 직접 버튼을 누르지 않아도 혼자 알아보거나 추천하거나 결정한다면 AI일 가능성이 높아요!",
          uiMode: "choice_cards",
          options: [
            { id: "robot_vacuum", label: "로봇청소기", emoji: "🤖", isAI: true },
            { id: "face_unlock", label: "얼굴 인식 잠금", emoji: "👁️", isAI: true },
            { id: "translate_app", label: "번역 앱", emoji: "🌐", isAI: true },
            { id: "recommend_feed", label: "추천 영상", emoji: "📱", isAI: true },
            { id: "calculator", label: "계산기", emoji: "🔢", isAI: false },
            { id: "lamp", label: "전등", emoji: "💡", isAI: false }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step2",
          title: "STEP 2 · 내 주변에서 찾기",
          question: "내 주변에서 비슷한 것을 찾을 수 있나요?",
          hint: "스마트폰, 집 안 AI 스피커, 학교에서 쓰는 번역 앱, 추천 영상 앱 등을 떠올려 보세요. 사진을 찍거나 카드에서 골라도 돼요!",
          uiMode: "photo_or_card_select",
          cardOptions: [
            { id: "home_robot_cleaner", label: "집 로봇청소기", emoji: "🤖" },
            { id: "navigation_app", label: "길 안내 앱", emoji: "🗺️" },
            { id: "translate_app2", label: "번역 앱", emoji: "🌐" },
            { id: "voice_speaker", label: "AI 스피커", emoji: "🔊" },
            { id: "face_camera", label: "얼굴 인식 카메라", emoji: "📷" },
            { id: "recommend_app", label: "추천 앱", emoji: "📱" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 어떤 일을 하는지 고르기",
          question: "이 기술은 사람을 어떻게 도와주나요?",
          hint: "내가 찾은 AI가 어떤 일을 대신 해주는지 생각해 보세요. 사람 대신 알아보거나, 추천하거나, 말을 알아듣거나, 길을 안내하거나, 언어를 바꿔 주거나, 스스로 움직이기도 해요.",
          uiMode: "single_select_buttons",
          options: [
            { id: "recognize", label: "알아보기", emoji: "🔍" },
            { id: "recommend", label: "추천하기", emoji: "⭐" },
            { id: "listen", label: "말 알아듣기", emoji: "🎙️" },
            { id: "navigate", label: "길 알려주기", emoji: "🗺️" },
            { id: "translate", label: "번역하기", emoji: "🌐" },
            { id: "auto_act", label: "자동으로 움직이기", emoji: "⚙️" },
            { id: "other", label: "기타", emoji: "📌" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 짧게 설명하기",
          question: "왜 이걸 AI라고 생각했나요?",
          hint: "어떤 점 때문에 AI라고 생각했는지 짧게 한 문장으로 써보세요!",
          uiMode: "free_text",
          placeholder: "예: 내가 누르지 않아도 알아서 추천해 줘요.",
          validation: { required: true }
        }
      ],
      submit: {
        title: "생활 속 AI를 잘 찾았어요!",
        message: "AI가 하는 일을 설명하는 힘이 생겼어요.",
        summaryLabels: { step1: "고른 AI 예시", step2: "내가 찾은 AI", step3: "하는 일", step4: "AI라고 생각한 이유" }
      }
    },
    upper: {
      cardCode: "E-1-H",
      performanceType: "SJ",
      description: "생활 속 여러 기술을 AI가 있는지 없는지 구별하고, 판단 기준을 설명하는 미션이에요.",
      intro: [
        { text: "요즘은 추천 앱, 번역 앱, 음성 비서, 내비게이션처럼 AI가 들어 있는 기술을 자주 만날 수 있어요.\n하지만 겉으로 보기엔 비슷해 보여도, 어떤 기기는 단순히 정해진 대로만 작동해요." },
        { text: "그래서 '전자기기 = AI'라고 생각하면 정확하지 않을 수 있어요.\nAI를 알아본다는 것은 단순히 이름을 맞히는 것이 아니라, 어떤 기준으로 판단하는지 생각하는 일이에요." },
        { text: "오늘은 생활 속 여러 기술을 보고, 무엇이 AI인지 아닌지 구별해 볼 거예요.\n그리고 내가 세운 기준이 왜 맞는지 설명해 봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 제대로 이해하려면 단순히 '편리한 기계'라고 보는 것이 아니라, 어떤 특징 때문에 AI라고 할 수 있는지 생각할 수 있어야 해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "기술이 사람을 대신해 알아보거나 추천하거나 판단하는지, 아니면 정해진 명령만 그대로 실행하는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "모든 똑똑한 기계를 다 AI라고 여기거나, 반대로 AI를 써도 AI인지 모른 채 지나갈 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI 분류하기",
          question: "어떤 것은 AI가 있고, 어떤 것은 AI가 없을까요?",
          hint: "AI는 스스로 데이터를 보고 판단하거나 추천해요. 정해진 버튼만 실행하거나 사람이 직접 조작해야 하는 것은 AI가 없을 수 있어요.",
          uiMode: "classify_cards_carousel",
          groups: [{ id: "ai", label: "AI 있음" }, { id: "non_ai", label: "AI 없음" }],
          cards: [
            { id: "calculator", label: "계산기", emoji: "🔢" },
            { id: "face_unlock", label: "얼굴 인식 잠금", emoji: "🔓" },
            { id: "robot_vacuum", label: "로봇청소기", emoji: "🤖" },
            { id: "recommend_video", label: "추천 영상 앱", emoji: "📺" },
            { id: "auto_door", label: "자동문", emoji: "🚪" },
            { id: "navigation", label: "내비게이션 앱", emoji: "🗺️" },
            { id: "translate_app", label: "번역 앱", emoji: "🌐" },
            { id: "alarm_clock", label: "알람 시계", emoji: "⏰" }
          ],
          validation: { required: true, allRequired: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 기준 고르기",
          question: "AI와 AI가 아닌 것을 나누는 기준은 무엇이었나요?",
          hint: "AI와 AI가 아닌 것을 구분하는 핵심 차이는 '스스로 판단하는가'예요. 데이터를 보고 결정하거나, 상황에 따라 다르게 반응하면 AI에 가깝습니다.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "recognizes", label: "사람·사물을 알아본다" },
            { id: "recommends", label: "추천해 준다" },
            { id: "adapts", label: "상황에 따라 다르게 반응한다" },
            { id: "fixed_rule", label: "정해진 버튼만 실행한다" },
            { id: "predicts", label: "데이터를 보고 예측한다" },
            { id: "learns", label: "스스로 학습한다" },
            { id: "no_learning", label: "학습하지 않는다" },
            { id: "sensor_only", label: "센서로만 반응한다" },
            { id: "context_aware", label: "내 상황을 파악한다" },
            { id: "other", label: "기타" }
          ],
          validation: { minSelections: 2 }
        },
        {
          id: "step3",
          title: "STEP 3 · 경계 사례 판단하기",
          question: "AI인지 아닌지 애매한 사례는 어떻게 판단할까요?",
          hint: "자동문은 센서로 움직이지만 학습하지는 않아요. 검색 엔진은 키워드를 찾지만, 일부는 맥락을 학습하기도 해요. '학습하는가?'를 기준으로 판단해 보세요.",
          uiMode: "per_case_judge",
          judgmentOptions: [{ id: "ai", label: "AI 있음" }, { id: "non_ai", label: "AI 없음" }],
          allowText: true,
          textPlaceholder: "AI인지 아닌지 어떻게 판단했는지 이유를 적어보세요.",
          cases: [
            { id: "auto_door", title: "자동문", description: "사람이 가까이 오면 문이 열려요. 하지만 사람을 직접 알아보지는 않아요." },
            { id: "basic_search", title: "단순 검색 엔진", description: "키워드를 입력하면 저장된 목록에서 결과를 찾아줘요. 내 검색 습관을 학습하지는 않아요." },
            { id: "smart_thermostat", title: "스마트 온도 조절기", description: "집 안의 온도를 감지해 자동으로 냉·난방을 켜요. 내 생활 패턴을 일부 기억하기도 해요." },
            { id: "spam_filter", title: "스팸 메일 필터", description: "받은 이메일 중 광고나 위험한 메일을 자동으로 걸러요. 어떤 필터는 사용자의 피드백으로 학습해요." }
          ],
          validation: { required: true, textRequired: true }
        }
      ],
      submit: {
        title: "AI 구별 능력 완성!",
        message: "AI와 AI가 아닌 것을 기준으로 판단하는 힘이 생겼어요.",
        summaryLabels: { step1: "분류 결과", step2: "판단 기준", step3: "경계 사례 판단" }
      }
    }
  }
};
