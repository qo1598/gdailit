export const E4_V3 = {
  meta: {
    code: "E-4",
    title: "모두에게 똑같이 잘할까?",
    domain: "Engaging",
    ksa: { K: ["K2.5", "K5.4"], S: ["Critical Thinking"], A: ["Empathetic"] }
  },
  grades: {
    lower: {
      cardCode: "E-4-L",
      performanceType: "TD",
      description: "같은 AI 기술도 사람에 따라 다르게 느껴질 수 있음을 알아보는 미션이에요.",
      intro: [
        { text: "어떤 AI는 사람의 얼굴이나 목소리를 알아보기도 해요.\n그런데 어떤 사람은 잘 되고, 어떤 사람은 잘 안 될 때도 있어요." },
        { text: "그래서 같은 기술이라도 모두에게 똑같이 편한 것은 아닐 수 있어요.\n누군가에게는 쉬운 것이 다른 사람에게는 어려울 수도 있어요." },
        { text: "오늘은 같은 기술을 서로 다른 사람이 사용할 때 어떤 점이 다를지 살펴볼 거예요.\n누가 더 불편할 수 있을지 생각해 봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 모두에게 똑같이 잘 맞는다고 생각하면 안 돼요. 사람마다 느끼는 편리함과 불편함이 다를 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "같은 기술을 써도 누군가는 편하고 누군가는 불편할 수 있다는 점을 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "어떤 사람은 사용하기 어려운 기술인데도 모두에게 괜찮다고 생각할 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 다른 점 찾기",
          question: "두 사람 사이에서 어떤 점이 다를까요?",
          hint: "AI 얼굴 인식 기술을 두 사람이 사용하고 있어요. 어떤 차이가 있을 때 한 사람은 잘 인식되고 다른 사람은 잘 안 될 수 있을까요?",
          uiMode: "choice_cards",
          options: [
            { id: "voice_lang", label: "말하는 언어가 달라요", emoji: "🗣️", isAI: true },
            { id: "face_differ", label: "얼굴 모습이 달라요", emoji: "👤", isAI: true },
            { id: "usage_freq", label: "사용 경험이 달라요", emoji: "📱", isAI: true },
            { id: "wearing_glasses", label: "안경을 쓰거나 안 써요", emoji: "👓", isAI: true },
            { id: "same_age", label: "나이가 같아요", emoji: "🎂", isAI: false },
            { id: "same_device", label: "같은 기기를 써요", emoji: "📱", isAI: false },
            { id: "other", label: "기타", emoji: "📌" }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step2",
          title: "STEP 2 · 불편한 사람 고르기",
          question: "더 불편할 것 같은 사람은 어느 쪽인가요?",
          hint: "AI가 더 많은 데이터를 학습한 유형의 사람은 잘 인식되는 경우가 많아요. 반면 데이터가 적은 유형의 사람은 잘 인식되지 않을 수 있어요.",
          uiMode: "single_select_buttons",
          options: [
            { id: "person_a", label: "많이 학습된 사람과 비슷한 사람", emoji: "😊" },
            { id: "person_b", label: "학습 데이터가 적은 유형의 사람", emoji: "😟" }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "차이를 잘 찾았어요!",
        message: "AI가 모두에게 똑같지 않을 수 있다는 걸 알았어요.",
        summaryLabels: { step1: "찾은 차이점", step2: "더 불편한 사람" }
      }
    },
    middle: {
      cardCode: "E-4-M",
      performanceType: "SJ",
      description: "AI 사용 사례를 보고 누가 더 불편할 수 있는지 찾고 이유를 설명하는 미션이에요.",
      intro: [
        { text: "어떤 AI는 사람을 도와주지만, 모든 사람에게 똑같이 편하지 않을 수 있어요.\n얼굴을 알아보는 기술, 목소리를 알아듣는 기술, 글을 읽어 주는 기술도 사람마다 다르게 느껴질 수 있어요." },
        { text: "누군가에게는 잘 맞지만 다른 사람에게는 덜 편하거나 잘 작동하지 않을 수 있어요.\n그래서 AI를 볼 때는 '잘 된다'뿐 아니라 '누가 불편할 수 있는가'도 생각해야 해요." },
        { text: "오늘은 사례를 보고 누가 더 불편할 수 있는지 찾아볼 거예요.\n그리고 왜 그런지 생각해 봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 편리한 기술이어도 누군가에게는 잘 맞지 않을 수 있어요. 누구에게 불편할 수 있는지 생각하는 것은 더 공정한 AI를 이해하는 데 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "기술이 어떤 사람에게는 왜 더 어렵거나 덜 잘 작동할 수 있는지, 사용자의 차이를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "모든 사람에게 똑같이 괜찮다고 생각해서, 누군가가 겪는 불편을 놓칠 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 누가 더 불편할까요?",
          question: "각 사례에서 누가 더 불편할 수 있는지 찾고, 이유를 골라보세요.",
          hint: "AI가 학습한 데이터에 어떤 사람들이 많이 포함되었는지가 중요해요. 데이터에 없는 유형의 사람은 잘 인식되지 않거나 불편할 수 있어요.",
          uiMode: "per_case_judge",
          judgmentOptions: [
            { id: "elderly", label: "어르신" },
            { id: "non_native", label: "외국어 사용자" },
            { id: "disability", label: "신체 차이가 있는 사람" },
            { id: "child", label: "어린이" }
          ],
          reasonOptions: [
            { id: "not_recognized", label: "잘 알아듣지 못할 수 있어요" },
            { id: "hard_to_see_or_use", label: "보기 어렵거나 쓰기 어려워요" },
            { id: "not_reflected", label: "내 모습·상황이 반영 안 됐어요" },
            { id: "too_complex", label: "사용하기 복잡해요" }
          ],
          allowText: true,
          cases: [
            { id: "c1", title: "얼굴 인식 출입 시스템", description: "회사 출입구에서 직원 얼굴을 인식해 문을 열어주는 시스템이에요. 특정 외모나 조명 환경에서는 잘 작동하지 않을 수 있어요." },
            { id: "c2", title: "음성 인식 안내 서비스", description: "병원에서 음성으로 예약을 안내해 주는 시스템이에요. 다양한 억양이나 목소리 특성에 따라 인식률이 달라질 수 있어요." },
            { id: "c3", title: "자동 자막 생성 서비스", description: "영상 콘텐츠에 자동으로 자막을 만들어 주는 서비스예요. 특수한 발음이나 배경 소음이 있으면 정확도가 낮아질 수 있어요." }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "공정성 탐색 완료!",
        message: "AI가 누구에게 불편할 수 있는지 생각하는 힘이 생겼어요.",
        summaryLabels: { step1: "사례별 판단 결과" }
      }
    },
    upper: {
      cardCode: "E-4-H",
      performanceType: "SJ",
      description: "AI의 편향 가능성을 판단하고, 더 공정한 개선 방향을 제안하는 미션이에요.",
      intro: [
        { text: "AI는 사람을 도와주는 기술이지만, 어떤 사람에게는 더 잘 맞고 어떤 사람에게는 덜 잘 맞을 수 있어요.\n이런 차이는 데이터, 설계, 사용 환경 때문에 생길 수 있어요." },
        { text: "그래서 AI를 평가할 때는 '정확한가?'뿐 아니라 '누구에게 불공정할 수 있는가?'도 함께 봐야 해요.\n문제가 보인다면 그냥 멈추는 것이 아니라 더 공정하게 바꾸는 방법도 생각해야 해요." },
        { text: "오늘은 AI 사례를 보고 어떤 편향 가능성이 있는지 판단해 볼 거예요.\n그리고 더 공정하게 만들려면 무엇이 필요할지 제안해 봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 누군가에게 불공정하게 작동할 수 있다는 점을 이해해야, 더 나은 기술을 생각하고 책임 있게 사용할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 사용자가 불리할 수 있는지, 왜 그런 차이가 생기는지, 그리고 어떻게 하면 더 공정하게 만들 수 있을지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 편리하다는 이유만으로 문제를 그냥 넘기게 되고, 누군가의 불편이나 불공정을 계속하게 될 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 편향 가능성 분석하기",
          question: "누가 불리할 수 있는지, 왜 그런지, 어떻게 개선할 수 있는지 판단해보세요.",
          hint: "AI 편향은 대부분 데이터 문제에서 시작해요. 어떤 사람들이 학습 데이터에 적게 포함되어 있으면 AI가 그 사람들에게 잘 맞지 않을 수 있어요. 원인과 개선 방향을 함께 생각해 보세요.",
          uiMode: "per_case_judge",
          judgmentOptions: [
            { id: "women", label: "여성" },
            { id: "elderly", label: "어르신" },
            { id: "dark_skin", label: "피부색이 어두운 사람" },
            { id: "non_native", label: "비영어권 사용자" },
            { id: "disability", label: "장애가 있는 사용자" }
          ],
          reasonOptions: [
            { id: "limited_data", label: "데이터가 충분하지 않아요" },
            { id: "not_diverse", label: "다양한 사용자가 반영 안 됐어요" },
            { id: "single_standard", label: "한쪽 기준만 적용됐어요" },
            { id: "simple_design", label: "설계가 단순해요" }
          ],
          reasonMulti: true,
          planOptions: [
            { id: "more_diverse_data", label: "더 다양한 데이터 넣기" },
            { id: "test_more_users", label: "여러 사용자로 시험하기" },
            { id: "human_review", label: "사람이 다시 확인하기" },
            { id: "multi_option_support", label: "다른 방식도 함께 제공하기" }
          ],
          planMulti: true,
          cases: [
            { id: "c1", title: "AI 얼굴 인식 보안 카메라", description: "공공장소 보안 카메라가 AI로 사람을 식별해요. 하지만 특정 피부색에서 오인식률이 높다는 보고가 있어요." },
            { id: "c2", title: "AI 채용 서류 심사", description: "기업이 AI로 지원서를 심사해요. 과거 채용 데이터를 학습했는데, 그 데이터에서 특정 집단이 불이익을 받은 경우가 있어요." },
            { id: "c3", title: "AI 음성 번역 서비스", description: "음성을 실시간으로 번역해 주는 서비스예요. 표준어 발음은 잘 인식하지만 지역 방언이나 억양에서 정확도가 크게 떨어져요." }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "AI 공정성 탐구 완료!",
        message: "편향 가능성을 판단하고 개선 방향을 제안하는 힘이 생겼어요.",
        summaryLabels: { step1: "사례별 편향 분석 결과" }
      }
    }
  }
};
