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
              image: "/images/e4l/e4l_case_a.png",
              description: "두 아이가 같은 AI 장난감에 말을 걸고 있어요.",
              personA: { label: "어린이 A", status: "✅ 바로 반응해요!" },
              personB: { label: "어린이 B", status: "❓ 여러 번 말해야 해요." }
            },
            {
              id: "case_b",
              title: "사례 B — 얼굴을 보고 문이 열리는 장치",
              image: "/images/e4l/e4l_case_b.png",
              description: "두 사람이 얼굴 인식으로 문을 열려고 해요.",
              personA: { label: "사람 A", status: "✅ 문이 열려요!" },
              personB: { label: "사람 B", status: "❓ 잘 인식이 안 돼요." }
            },
            {
              id: "case_c",
              title: "사례 C — 목소리를 듣고 노래를 틀어 주는 AI 스피커",
              image: "/images/e4l/e4l_case_c.png",
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
      description: "AI 사용 사례를 보고 누가 더 어렵거나 불리할 수 있는지 찾고, 이유와 공정성을 생각해보는 미션이에요.",
      intro: [
        { text: "어떤 AI는 사람을 도와주지만, 모든 사람에게 똑같이 편하거나 똑같이 잘 작동하지 않을 수 있어요.\n얼굴을 알아보는 기술, 목소리를 알아듣는 기술, 글을 읽어 주는 기술도 사람마다 다르게 느껴질 수 있어요." },
        { text: "누군가에게는 잘 맞지만, 다른 사람에게는 덜 편하거나 잘 안 될 수도 있어요.\n그래서 AI를 볼 때는 '잘 된다'만 보는 것이 아니라, 누구에게 더 어렵거나 불리할 수 있는지도 함께 생각해야 해요." },
        { text: "오늘은 여러 사례를 보고 누가 더 어렵거나 불리할 수 있는지, 왜 그런지, 그리고 그 결과가 공정한지 생각해 볼 거예요." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 편리한 기술이어도 모든 사람에게 똑같이 잘 맞는 것은 아닐 수 있어요. AI에는 편향이 존재할 수 있고, 누군가에게 더 불리한 결과가 생길 수도 있어요. 누구에게 어려움이 생길 수 있는지 생각하는 것은 AI를 더 비판적으로 이해하는 데 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "기술이 누구에게 더 잘 작동하고, 누구에게는 덜 잘 작동하는지 살펴보아야 해요. 또 그 차이가 단순한 우연인지, 아니면 어떤 사람의 모습·말하기 방식·상황이 충분히 반영되지 않아서 그런지 생각해 보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "모든 사람에게 똑같이 괜찮다고 생각해서, 누군가가 겪는 어려움이나 불리함을 놓칠 수 있어요. 그러면 AI의 결과를 공정한 것처럼 받아들이게 될 수도 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 누가 더 불편함을 겪고 있나요?",
          question: "각 사례에서 누가 더 불리한 결과를 겪고 있는지 골라보세요.",
          hint: "두 학생이 같은 기술을 쓰는데 결과가 달라요. 누가 원하는 결과를 얻지 못하고 있나요?",
          uiMode: "case_judge_carousel",
          judgmentLabel: "누가 더 불편함을 겪고 있나요?",
          judgmentOptions: [
            { id: "user_a", label: "학생 A" },
            { id: "user_b", label: "학생 B" }
          ],
          cases: [
            {
              id: "face_recognition",
              title: "사례 1 · 학교 출입 얼굴 인식",
              image: "/images/e4m/e4m_case1_face.png",
              description: "학교 출입구에 얼굴을 보고 문을 열어주는 AI 장치가 있어요. 학생 A는 바로 들어가지만, 학생 B는 여러 번 시도해야 해서 늦게 들어가요.",
              userA: { id: "user_a", label: "학생 A", status: "얼굴이 바로 인식돼서 문이 열려요." },
              userB: { id: "user_b", label: "학생 B", status: "여러 번 시도해야 문이 열려요." }
            },
            {
              id: "voice_recognition",
              title: "사례 2 · 숙제 찾기 학습 앱",
              image: "/images/e4m/e4m_case2_voice.png",
              description: "학습 앱에 말로 숙제를 찾을 수 있어요. 학생 A는 바로 원하는 숙제를 찾지만, 학생 B는 말이 다르게 인식되어 엉뚱한 화면이 나와요.",
              userA: { id: "user_a", label: "학생 A", status: "말하면 바로 원하는 숙제를 찾아줘요." },
              userB: { id: "user_b", label: "학생 B", status: "말이 다르게 인식되어 엉뚱한 화면이 나와요." }
            },
            {
              id: "auto_reading",
              title: "사례 3 · 글을 읽어 주는 앱",
              image: "/images/e4m/e4m_case3_reading.png",
              description: "글을 읽어 주는 앱이 있어요. 학생 A는 내용을 편하게 듣지만, 학생 B는 속도가 맞지 않아 중요한 내용을 놓쳐요.",
              userA: { id: "user_a", label: "학생 A", status: "내용을 편하게 따라가며 들을 수 있어요." },
              userB: { id: "user_b", label: "학생 B", status: "속도가 맞지 않아 중요한 내용을 놓쳐요." }
            }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 이 결과는 공정한가요?",
          question: "각 사례의 결과가 모두에게 공정한지 판단해보세요.",
          hint: "같은 기술인데 한 학생만 자주 실패하거나 불편하다면, 그 결과는 공정할까요?",
          uiMode: "case_judge_carousel",
          fairnessLabel: "이 결과는 공정한가요?",
          fairnessOptions: [
            { id: "okay", label: "공정하다" },
            { id: "unfair", label: "공정하지 않다" },
          ],
          cases: [
            {
              id: "face_recognition",
              title: "사례 1 · 학교 출입 얼굴 인식",
              image: "/images/e4m/e4m_case1_face.png",
              description: "같은 출입 장치인데 학생 A는 바로 들어가고, 학생 B는 여러 번 시도해야 해요.",
              userA: { id: "user_a", label: "학생 A", status: "바로 들어가요." },
              userB: { id: "user_b", label: "학생 B", status: "여러 번 시도해야 해요." }
            },
            {
              id: "voice_recognition",
              title: "사례 2 · 숙제 찾기 학습 앱",
              image: "/images/e4m/e4m_case2_voice.png",
              description: "같은 앱인데 학생 A의 말은 바로 인식되고, 학생 B의 말은 자주 다르게 인식돼요.",
              userA: { id: "user_a", label: "학생 A", status: "바로 찾아줘요." },
              userB: { id: "user_b", label: "학생 B", status: "엉뚱한 화면이 나와요." }
            },
            {
              id: "auto_reading",
              title: "사례 3 · 글을 읽어 주는 앱",
              image: "/images/e4m/e4m_case3_reading.png",
              description: "같은 읽기 앱인데 학생 A는 편하게 듣고, 학생 B는 속도가 안 맞아 내용을 놓쳐요.",
              userA: { id: "user_a", label: "학생 A", status: "편하게 들어요." },
              userB: { id: "user_b", label: "학생 B", status: "내용을 놓쳐요." }
            }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 왜 그런 결과가 생겼을까요?",
          question: "각 사례에서 왜 이런 결과 차이가 생겼는지 이유를 골라보세요.",
          hint: "AI가 어떤 사람의 모습이나 말하기 방식, 상황을 충분히 반영하지 못했을 수 있어요.",
          uiMode: "case_judge_carousel",
          reasonLabel: "왜 그런 결과가 생겼을까요?",
          reasonOptions: [
            { id: "not_recognized", label: "기계가 한 사람을 잘 알아보지 못했어요" },
            { id: "not_reflected", label: "어떤 사람의 말이나 모습이 잘 반영되지 않았을 수 있어요" },
            { id: "same_way_not_fit", label: "모두에게 같은 방식이 잘 맞지는 않을 수 있어요" },
            { id: "not_considered", label: "사용자의 상황을 충분히 고려하지 않았을 수 있어요" }
          ],
          reasonMulti: true,
          cases: [
            {
              id: "face_recognition",
              title: "사례 1 · 학교 출입 얼굴 인식",
              image: "/images/e4m/e4m_case1_face.png",
              description: "학생 B는 여러 번 시도해야 문이 열려요.",
              userA: { id: "user_a", label: "학생 A", status: "얼굴이 바로 인식돼서 문이 열려요." },
              userB: { id: "user_b", label: "학생 B", status: "여러 번 시도해야 문이 열려요." }
            },
            {
              id: "voice_recognition",
              title: "사례 2 · 숙제 찾기 학습 앱",
              image: "/images/e4m/e4m_case2_voice.png",
              description: "학생 B는 말이 다르게 인식되어 엉뚱한 화면이 나와요.",
              userA: { id: "user_a", label: "학생 A", status: "말하면 바로 원하는 숙제를 찾아줘요." },
              userB: { id: "user_b", label: "학생 B", status: "말이 다르게 인식되어 엉뚱한 화면이 나와요." }
            },
            {
              id: "auto_reading",
              title: "사례 3 · 글을 읽어 주는 앱",
              image: "/images/e4m/e4m_case3_reading.png",
              description: "학생 B는 속도가 맞지 않아 중요한 내용을 놓쳐요.",
              userA: { id: "user_a", label: "학생 A", status: "내용을 편하게 따라가며 들을 수 있어요." },
              userB: { id: "user_b", label: "학생 B", status: "속도가 맞지 않아 중요한 내용을 놓쳐요." }
            }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 내 생각 정리하기",
          question: "AI가 모두에게 공정한 기술이 되기 위해서는 어떻게 해야 할까요?",
          hint: "AI를 만드는 사람, 사용하는 사람 모두의 역할을 생각해 보세요. 정해진 답은 없어요.",
          uiMode: "free_text",
          placeholder: "내 생각을 자유롭게 써보세요.\n예) 다양한 사람들의 목소리와 얼굴을 AI가 더 많이 학습해야 한다고 생각해요.",
          validation: { required: true }
        }
      ],
      submit: {
        title: "공정성 탐구 완료!",
        message: "AI 결과가 누구에게 더 불리할 수 있는지, 그리고 어떻게 공정하게 만들 수 있을지 직접 생각해봤어요.",
        summaryLabels: {
          step1: "누가 더 불리한지",
          step2: "공정성 판단",
          step3: "이유",
          step4: "내 생각"
        }
      }
    },
    upper: {
      cardCode: "E-4-H",
      performanceType: "SJ",
      description: "놀이공원 AI 장면을 보며 누가 불리한 결과를 겪는지, 그 영향과 공정성을 비판적으로 판단하는 미션이에요.",
      intro: [
        { text: "놀이공원에는 사람들을 더 편하게 도와주는 여러 AI가 있어요.\n입장을 빠르게 도와주기도 하고, 놀이기구를 추천해 주기도 하고, 길을 안내해 주거나 공연을 더 잘 볼 수 있게 도와주기도 해요." },
        { text: "그런데 같은 AI라도 모든 사람에게 똑같이 잘 작동하지 않을 수 있어요.\n어떤 사람은 바로 도움을 받지만, 어떤 사람은 자꾸 기다리거나, 필요한 정보를 놓치거나, 같은 기회를 얻지 못할 수도 있어요." },
        { text: "오늘은 놀이공원에서 벌어진 여러 장면을 보면서\n누가 더 불리한 결과를 겪는지, 왜 그게 문제인지, 그 영향이 얼마나 클 수 있는지, 그 결과를 그대로 믿어도 되는지 함께 생각해 볼 거예요." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 편리하지만, 그 결과가 모두에게 똑같이 나타나지 않을 수 있어요. AI에는 편향이 존재할 수 있고, 어떤 사람의 모습·말하기 방식·상황이 충분히 반영되지 않으면 누군가에게 더 불리한 결과가 생길 수 있어요. 그래서 AI 결과를 그냥 당연하게 받아들이지 않고 한 번 더 따져 보는 태도가 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "같은 AI인데도 누가 더 오래 기다리는지, 누가 덜 즐기게 되는지, 누가 필요한 정보를 덜 받는지, 누가 기회를 덜 얻게 되는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "겉으로는 모두가 같은 서비스를 쓰는 것처럼 보여도, 실제로는 누군가가 계속 손해를 보거나 덜 즐기고 있어도 그 문제를 놓칠 수 있어요. 그러면 AI 결과를 공정한 것처럼 믿게 될 수도 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 놀이공원에서 벌어진 AI 장면 보기",
          question: "놀이공원에서 AI가 사용되는 4가지 장면을 살펴보세요. 두 사람의 경험이 어떻게 다른지 주목해보세요.",
          hint: "한 사람은 쉽게 도움을 받지만, 다른 사람은 어떤가요?",
          uiMode: "case_judge_carousel",
          cases: [
            {
              id: "scene1_gate",
              title: "장면 1 · 입장 확인 게이트",
              image: "/images/e4h/e4h_scene1_gate.png",
              description: "얼굴을 확인해 빠르게 입장하는 AI 게이트가 있어요.",
              userA: { id: "user_a", label: "방문객 A", status: "얼굴이 바로 인식돼서 게이트가 열려요." },
              userB: { id: "user_b", label: "방문객 B", status: "여러 번 멈추고 다시 확인해야 해요." }
            },
            {
              id: "scene2_recommendation",
              title: "장면 2 · 놀이기구 추천 화면",
              image: "/images/e4h/e4h_scene2_recommendation.png",
              description: "공원 앱이 '지금 너에게 잘 맞는 놀이기구'를 추천해 줘요.",
              userA: { id: "user_a", label: "방문객 A", status: "다양한 놀이기구가 추천돼요." },
              userB: { id: "user_b", label: "방문객 B", status: "비슷한 것만 계속 추천돼요." }
            },
            {
              id: "scene3_kiosk",
              title: "장면 3 · 길찾기 안내 키오스크",
              image: "/images/e4h/e4h_scene3_kiosk.png",
              description: "AI 길찾기 키오스크가 가장 빠른 길을 알려줘요.",
              userA: { id: "user_a", label: "방문객 A", status: "원하는 장소를 쉽게 찾아요." },
              userB: { id: "user_b", label: "방문객 B", status: "질문했는데 엉뚱한 안내를 받아 더 돌아가게 돼요." }
            },
            {
              id: "scene4_performance",
              title: "장면 4 · 공연 자막·음성 안내",
              image: "/images/e4h/e4h_scene4_performance.png",
              description: "공연장에 AI 자막과 음성 안내 서비스가 있어요.",
              userA: { id: "user_a", label: "방문객 A", status: "내용을 잘 따라가며 즐길 수 있어요." },
              userB: { id: "user_b", label: "방문객 B", status: "자막이 이상하게 나오거나 음성 안내가 잘 맞지 않아 내용을 놓쳐요." }
            }
          ],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 문제 신호 찾기",
          question: "각 장면에서 공정이나 영향의 문제가 보이는 신호를 찾아보세요.",
          hint: "한 사람만 더 손해를 보거나 불편을 겪고 있다면, 그건 그냥 넘기면 안 될 신호예요.",
          uiMode: "case_judge_carousel",
          judgmentLabel: "이 장면의 문제 신호는?",
          judgmentOptions: [
            { id: "wait_longer", label: "한 사람만 더 오래 기다림" },
            { id: "worse_result", label: "한 사람만 원하는 결과를 잘 얻지 못함" },
            { id: "fewer_choices", label: "한 사람만 선택의 폭이 좁아짐" },
            { id: "less_enjoyment", label: "한 사람만 내용을 충분히 즐기지 못함" }
          ],
          cases: [
            {
              id: "scene1_gate",
              title: "장면 1 · 입장 확인 게이트",
              image: "/images/e4h/e4h_scene1_gate.png",
              description: "방문객 B는 여러 번 멈추고 다시 확인해야 해요.",
              userA: { id: "user_a", label: "방문객 A", status: "바로 입장해요." },
              userB: { id: "user_b", label: "방문객 B", status: "여러 번 시도해야 해요." }
            },
            {
              id: "scene2_recommendation",
              title: "장면 2 · 놀이기구 추천 화면",
              image: "/images/e4h/e4h_scene2_recommendation.png",
              description: "방문객 B에게는 비슷한 것만 계속 추천돼요.",
              userA: { id: "user_a", label: "방문객 A", status: "다양하게 추천받아요." },
              userB: { id: "user_b", label: "방문객 B", status: "비슷한 추천만 반복돼요." }
            },
            {
              id: "scene3_kiosk",
              title: "장면 3 · 길찾기 안내 키오스크",
              image: "/images/e4h/e4h_scene3_kiosk.png",
              description: "방문객 B는 엉뚱한 안내를 받아 더 돌아가요.",
              userA: { id: "user_a", label: "방문객 A", status: "정확한 안내를 받아요." },
              userB: { id: "user_b", label: "방문객 B", status: "엉뚱한 안내를 받아요." }
            },
            {
              id: "scene4_performance",
              title: "장면 4 · 공연 자막·음성 안내",
              image: "/images/e4h/e4h_scene4_performance.png",
              description: "방문객 B는 자막이나 안내가 맞지 않아 내용을 놓쳐요.",
              userA: { id: "user_a", label: "방문객 A", status: "내용을 잘 따라가요." },
              userB: { id: "user_b", label: "방문객 B", status: "내용을 놓쳐요." }
            }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 누가 어떤 영향을 받나요?",
          question: "각 장면에서 더 불리한 결과를 겪는 사람이 받을 수 있는 영향을 골라보세요.",
          hint: "그 사람 입장이 되어 생각해 보세요. 여러 영향이 겹칠 수 있어요.",
          uiMode: "case_judge_carousel",
          judgmentLabel: "더 불리한 결과를 겪는 사람은?",
          judgmentOptions: [
            { id: "user_a", label: "방문객 A" },
            { id: "user_b", label: "방문객 B" }
          ],
          reasonLabel: "어떤 영향을 받을 수 있나요?",
          reasonOptions: [
            { id: "wait_longer", label: "기다리는 시간이 더 길어짐" },
            { id: "less_play_time", label: "같은 놀이 시간을 덜 가지게 됨" },
            { id: "less_variety", label: "새로운 놀이기구를 덜 경험하게 됨" },
            { id: "late_arrival", label: "필요한 장소를 늦게 찾게 됨" },
            { id: "miss_performance", label: "공연 내용을 충분히 즐기지 못함" },
            { id: "feel_bad", label: "속상하거나 민망할 수 있음" }
          ],
          reasonMulti: true,
          cases: [
            {
              id: "scene1_gate",
              title: "장면 1 · 입장 확인 게이트",
              image: "/images/e4h/e4h_scene1_gate.png",
              description: "AI 게이트가 한 방문객은 바로 통과시키고, 다른 방문객은 여러 번 확인하게 해요.",
              userA: { id: "user_a", label: "방문객 A", status: "바로 입장해요." },
              userB: { id: "user_b", label: "방문객 B", status: "여러 번 시도해야 해요." }
            },
            {
              id: "scene2_recommendation",
              title: "장면 2 · 놀이기구 추천 화면",
              image: "/images/e4h/e4h_scene2_recommendation.png",
              description: "같은 앱인데 한 방문객에게는 다양하게, 다른 방문객에게는 비슷하게만 추천해요.",
              userA: { id: "user_a", label: "방문객 A", status: "다양하게 추천받아요." },
              userB: { id: "user_b", label: "방문객 B", status: "비슷한 추천만 반복돼요." }
            },
            {
              id: "scene3_kiosk",
              title: "장면 3 · 길찾기 안내 키오스크",
              image: "/images/e4h/e4h_scene3_kiosk.png",
              description: "같은 키오스크인데 한 방문객은 정확한 안내를, 다른 방문객은 엉뚱한 안내를 받아요.",
              userA: { id: "user_a", label: "방문객 A", status: "정확한 안내를 받아요." },
              userB: { id: "user_b", label: "방문객 B", status: "엉뚱한 안내를 받아요." }
            },
            {
              id: "scene4_performance",
              title: "장면 4 · 공연 자막·음성 안내",
              image: "/images/e4h/e4h_scene4_performance.png",
              description: "같은 공연인데 한 방문객은 자막이 잘 맞고, 다른 방문객은 자막이나 안내가 잘 맞지 않아요.",
              userA: { id: "user_a", label: "방문객 A", status: "내용을 잘 따라가요." },
              userB: { id: "user_b", label: "방문객 B", status: "내용을 놓쳐요." }
            }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 왜 문제인지 고르기",
          question: "각 장면의 결과가 왜 문제인지 이유를 골라보세요. 여러 개 선택할 수 있어요.",
          hint: "이 차이가 한 번만 생기는 게 아니라 반복된다면 어떨까요?",
          uiMode: "case_judge_carousel",
          reasonLabel: "왜 이 결과가 문제일까요?",
          reasonOptions: [
            { id: "same_service_diff_result", label: "같은 서비스인데 결과가 다르게 나와서" },
            { id: "repeat_failure", label: "어떤 사람만 자주 실패해서" },
            { id: "unequal_opportunity", label: "같은 기회를 얻지 못할 수 있어서" },
            { id: "less_info_fun", label: "필요한 정보나 즐길 거리를 덜 얻게 돼서" },
            { id: "cumulative_harm", label: "반복되면 계속 손해를 볼 수 있어서" }
          ],
          reasonMulti: true,
          cases: [
            {
              id: "scene1_gate",
              title: "장면 1 · 입장 확인 게이트",
              image: "/images/e4h/e4h_scene1_gate.png",
              description: "방문객 B는 같은 게이트에서 계속 더 오래 기다려야 해요.",
              userA: { id: "user_a", label: "방문객 A", status: "바로 입장해요." },
              userB: { id: "user_b", label: "방문객 B", status: "여러 번 시도해야 해요." }
            },
            {
              id: "scene2_recommendation",
              title: "장면 2 · 놀이기구 추천 화면",
              image: "/images/e4h/e4h_scene2_recommendation.png",
              description: "방문객 B는 새로운 놀이기구를 추천받을 기회가 적어요.",
              userA: { id: "user_a", label: "방문객 A", status: "다양하게 추천받아요." },
              userB: { id: "user_b", label: "방문객 B", status: "비슷한 추천만 반복돼요." }
            },
            {
              id: "scene3_kiosk",
              title: "장면 3 · 길찾기 안내 키오스크",
              image: "/images/e4h/e4h_scene3_kiosk.png",
              description: "방문객 B는 잘못된 안내 때문에 시간을 낭비하게 돼요.",
              userA: { id: "user_a", label: "방문객 A", status: "정확한 안내를 받아요." },
              userB: { id: "user_b", label: "방문객 B", status: "엉뚱한 안내를 받아요." }
            },
            {
              id: "scene4_performance",
              title: "장면 4 · 공연 자막·음성 안내",
              image: "/images/e4h/e4h_scene4_performance.png",
              description: "방문객 B는 공연 내용을 충분히 즐기지 못하게 돼요.",
              userA: { id: "user_a", label: "방문객 A", status: "내용을 잘 따라가요." },
              userB: { id: "user_b", label: "방문객 B", status: "내용을 놓쳐요." }
            }
          ],
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · AI 결과를 그대로 믿어도 될까?",
          question: "각 장면에서 AI가 올바르게 활용되기 위해서는 어떤 과정이 필요할지 생각하고, 짧게 이유를 적어보세요.",
          hint: "AI가 틀릴 수 있다는 걸 알면, 어떻게 행동해야 할까요?",
          uiMode: "case_judge_carousel",
          judgmentLabel: "이 AI 결과를 어떻게 봐야 할까요?",
          allowText: true,
          textPlaceholder: "예) 다양한 성별과 연령의 얼굴 데이터를 수집하여 학습시켜야 합니다. 등",
          cases: [
            {
              id: "scene1_gate",
              title: "장면 1 · 입장 확인 게이트",
              image: "/images/e4h/e4h_scene1_gate.png",
              description: "AI 게이트가 방문객마다 다른 결과를 보여줘요.",

            },
            {
              id: "scene2_recommendation",
              title: "장면 2 · 놀이기구 추천 화면",
              image: "/images/e4h/e4h_scene2_recommendation.png",
              description: "앱이 방문객마다 다른 범위로 추천해줘요.",

            },
            {
              id: "scene3_kiosk",
              title: "장면 3 · 길찾기 안내 키오스크",
              image: "/images/e4h/e4h_scene3_kiosk.png",
              description: "키오스크가 방문객마다 다른 정확도의 안내를 해줘요.",

            },
            {
              id: "scene4_performance",
              title: "장면 4 · 공연 자막·음성 안내",
              image: "/images/e4h/e4h_scene4_performance.png",
              description: "AI 자막·안내 서비스가 방문객마다 다르게 작동해요.",

            }
          ],
          validation: { required: true }
        },
        {
          id: "step6",
          title: "STEP 6 · 오늘의 판단 정리하기",
          question: "모두를 위한 AI 기술이 되기 위해서는 어떤 과정이 필요할지 여러분의 생각을 적어봅시다.",
          hint: "오늘 본 장면들에서 공통으로 중요했던 점은 무엇이었나요?",
          uiMode: "free_text",
          placeholder: "예) AI가 편리해 보여도 모두에게 똑같이 공정한지 생각해야 해요.\n예) 나에게는 편리한 AI가 다른 사람에게는 불편할 수 있다는 것을 알아야해요.",
          validation: { required: true }
        }
      ],
      submit: {
        title: "AI 공정성 탐구 완료!",
        message: "놀이공원 AI 장면에서 누가 더 불리한 결과를 겪는지, 그 영향과 공정성을 직접 판단해봤어요.",
        summaryLabels: {
          step1: "살펴본 장면",
          step2: "문제 신호",
          step3: "영향받는 사람과 영향",
          step4: "문제 이유",
          step5: "AI 결과 수용 판단",
          step6: "오늘의 판단"
        }
      }
    }
  }
};
