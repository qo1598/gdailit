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
        { text: "어떤 AI는 사람의 얼굴이나 목소리, 말하기 방법을 알아보고 반응해요.\n그런데 같은 기술을 써도 어떤 사람에게는 잘 되고, 어떤 사람에게는 잘 안 될 때가 있어요." },
        { text: "그래서 같은 AI 기술이라도 모두에게 똑같이 편하거나 똑같이 잘 맞는 것은 아닐 수 있어요.\n누군가에게는 쉬운 기술이 다른 사람에게는 어렵게 느껴질 수도 있어요." },
        { text: "오늘은 같은 기술을 서로 다른 사람이 사용할 때 어떤 점이 다를지 살펴볼 거예요.\n그리고 누가 더 어려울 수 있는지, 왜 그렇게 생각하는지, 어떻게 하면 둘 다 더 잘 쓸 수 있을지 생각해 볼 거예요." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 모두에게 똑같이 잘 맞는다고 생각하면 안 돼요. 같은 기술도 사람마다 다르게 느껴질 수 있고, 어떤 사람에게는 더 어렵게 작동할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "같은 기술을 써도 누가 더 쉽게 쓰는지, 누가 더 어렵게 느끼는지, 그리고 그 차이가 어디에서 오는지 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "어떤 사람에게는 사용하기 어려운 기술인데도 '모두에게 괜찮다'고 생각할 수 있어요. 그러면 누군가는 계속 불편하거나 어려움을 겪는데도 그 문제가 잘 보이지 않을 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 같은 기술을 쓰는 두 사람 보기",
          question: "두 사람이 같은 AI 기술을 쓰고 있어요. 어떤 점이 눈에 띄나요?",
          hint: "한 사람은 잘 되고, 다른 사람은 잘 안 되는 것 같기도 해요. 천천히 살펴보세요.",
          uiMode: "case_view_carousel",
          cases: [
            {
              id: "case_a",
              title: "사례 A — 말하면 반응하는 AI 장난감",
              image: "/e4l_case_a.png",
              description: "두 아이가 같은 AI 장난감에 말을 걸고 있어요.",
              personA: { label: "어린이 A", status: "✅ 바로 반응해요!" },
              personB: { label: "어린이 B", status: "❓ 여러 번 말해야 해요." }
            },
            {
              id: "case_b",
              title: "사례 B — 얼굴을 보고 문이 열리는 장치",
              image: "/e4l_case_b.png",
              description: "두 사람이 얼굴 인식으로 문을 열려고 해요.",
              personA: { label: "사람 A", status: "✅ 문이 열려요!" },
              personB: { label: "사람 B", status: "❓ 잘 인식이 안 돼요." }
            },
            {
              id: "case_c",
              title: "사례 C — 목소리를 듣고 노래를 틀어 주는 AI 스피커",
              image: "/e4l_case_c.png",
              description: "두 사람이 AI 스피커에 노래를 틀어 달라고 해요.",
              personA: { label: "사람 A", status: "✅ 바로 노래가 나와요!" },
              personB: { label: "사람 B", status: "❓ 잘 알아듣지 못해요." }
            }
          ],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 다른 점 찾기",
          question: "두 사람의 기술 사용 경험에서 어떤 점이 다를까요?",
          hint: "그림에서 한 사람은 쉽게 되고, 다른 사람은 어렵게 느끼는 부분을 찾아보세요.",
          uiMode: "choice_cards",
          options: [
            { id: "recognized_right_away", label: "한 사람은 바로 반응이 됐어요", emoji: "⚡" },
            { id: "needs_retry", label: "한 사람은 여러 번 해야 했어요", emoji: "🔁" },
            { id: "same_device", label: "두 사람이 서로 다른 기계를 사용했어요", emoji: "📱" },
            { id: "easy_use", label: "한 사람은 쉽게 사용했어요", emoji: "😊" },
            { id: "hard_use", label: "한 사람은 다시 시도하고 있었어요", emoji: "😟" },
            { id: "same_place", label: "두 사람이 서로 다른 장소에 있었어요", emoji: "📍" },
            { id: "no_response", label: "기계가 한 사람에게는 반응하지 않았어요", emoji: "❌" },
            { id: "clothes_differ", label: "두 사람의 옷 색깔이 달랐어요", emoji: "👕" }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 누가 더 어려울지 고르기",
          question: "두 사람 중 누가 이 기술을 쓰기 더 어려울까요?",
          hint: "어떤 이유로 그 사람이 더 어렵다고 생각했나요?",
          uiMode: "person_reason_select",
          personOptions: [
            { id: "person_a", label: "A", description: "바로 반응이 된 사람" },
            { id: "person_b", label: "B", description: "여러 번 시도한 사람" }
          ],
          randomizeReasons: true,
          reasonOptions: [
            { id: "not_recognized", label: "기계가 잘 알아듣지 못해서" },
            { id: "needs_retry", label: "여러 번 해도 잘 안 돼서" },
            { id: "hard_to_use", label: "사용하는 방법이 더 불편해 보여서" },
            { id: "system_not_fit", label: "한 사람에게는 더 잘 맞지 않는 것 같아서" },
            { id: "different_place", label: "두 사람이 다른 장소에 있어서" },
            { id: "clothes_different", label: "두 사람의 옷이 달라서" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 모두가 더 잘 쓰려면?",
          question: "어떻게 하면 두 사람 모두 더 잘 쓸 수 있을까요?",
          hint: "한 가지 방법만 말고 다른 방법도 있으면 좋을까요?",
          uiMode: "choice_cards",
          randomize: true,
          options: [
            { id: "button_option", label: "버튼도 같이 있으면 좋겠어요", emoji: "🔘" },
            { id: "different_way_to_use", label: "말하기 말고 다른 방법도 있으면 좋겠어요", emoji: "✋" },
            { id: "fit_everyone", label: "여러 사람에게 잘 맞게 만들면 좋겠어요", emoji: "👥" },
            { id: "easy_retry", label: "잘 안 되는 사람도 쉽게 다시 해 볼 수 있으면 좋겠어요", emoji: "🔄" },
            { id: "change_color", label: "기계 색깔을 바꾸면 좋겠어요", emoji: "🎨" },
            { id: "make_bigger", label: "기계를 더 크게 만들면 좋겠어요", emoji: "📦" }
          ],
          validation: { minSelections: 1 }
        }
      ],
      submit: {
        title: "잘 살펴봤어요!",
        message: "AI가 모두에게 똑같이 잘 맞지 않을 수 있다는 걸 알았어요.",
        summaryLabels: {
          step1: "살펴본 사례",
          step2: "찾은 다른 점",
          step3: "더 어려운 사람과 이유",
          step4: "모두를 위한 방법"
        }
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
