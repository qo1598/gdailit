/**
 * LearnAILIT V4 · E-4 모두에게 똑같이 잘할까?
 * 시나리오 기반 수행 평가 — 공통 인터페이스 적용본
 *
 * [공통 인터페이스]
 * scenario  : 카드 단위 역할·목표·맥락·산출물 명칭
 * branch    : step 간 분기/연동 — sourceStepId + filterBy + mode
 * artifact  : submit.artifact.template 으로 통일 (학생 응답이 그대로 반영되도록 토큰 설계)
 *
 * [주요 개선점]
 * - scenario.image 경로 추가 (e4l/e4m/e4h 시나리오 파노라마)
 * - artifact.template 이 실제 학생 응답(step3 person+reason, step5 자유서술 등)을 문장으로 반영
 * - M step4 uiMode를 case_judge_carousel(+allowText)로 정비하여 사례별 개선 제안 텍스트가 실제로 수집·표시되도록 수정
 */

// 반복되는 사례 기본 정보 (id/title/image) — step별로 description만 덮어써서 재사용
const E4L_BASE_CASES = [
  { id: "case_a", title: "사례 1 — 말하면 반응하는 AI 장난감",         image: "/images/e4l/e4l_case_a.png" },
  { id: "case_b", title: "사례 2 — 얼굴을 보고 문이 열리는 장치",       image: "/images/e4l/e4l_case_b.png" },
  { id: "case_c", title: "사례 3 — 목소리를 듣고 노래를 틀어 주는 AI 스피커", image: "/images/e4l/e4l_case_c.png" },
];

const E4M_BASE_CASES = [
  { id: "face_recognition",  title: "사례 1 · 학교 출입 얼굴 인식", image: "/images/e4m/e4m_case1_face.png" },
  { id: "voice_recognition", title: "사례 2 · 숙제 찾기 학습 앱",   image: "/images/e4m/e4m_case2_voice.png" },
  { id: "auto_reading",      title: "사례 3 · 글을 읽어 주는 앱",   image: "/images/e4m/e4m_case3_reading.png" },
];

const E4H_BASE_CASES = [
  { id: "scene1_gate",          title: "장면 1 · 입장 확인 게이트",    image: "/images/e4h/e4h_scene1_gate.png" },
  { id: "scene2_recommendation", title: "장면 2 · 놀이기구 추천 화면",  image: "/images/e4h/e4h_scene2_recommendation.png" },
  { id: "scene3_kiosk",         title: "장면 3 · 길찾기 안내 키오스크", image: "/images/e4h/e4h_scene3_kiosk.png" },
  { id: "scene4_performance",   title: "장면 4 · 공연 자막·음성 안내", image: "/images/e4h/e4h_scene4_performance.png" },
];

const withDesc = (base, descMap) => base.map(c => ({ ...c, description: descMap[c.id] }));

export const E4_V4 = {
  meta: {
    code: "E-4",
    title: "모두에게 똑같이 잘할까?",
    domain: "Engaging",
    ksa: { K: ["K2.5", "K5.4"], S: ["Critical Thinking"], A: ["Empathetic"] }
  },

  grades: {

    // =====================================================================
    // E-4-L | 저학년 (1~2학년)
    // 역할: AI 배려 관찰자 | 산출물: 배려 관찰 기록
    // =====================================================================
    lower: {
      cardCode: "E-4-L",
      performanceType: "TD",
      description: "같은 AI 기술도 사람에 따라 다르게 느껴질 수 있음을 알아보는 미션이에요.",

      scenario: {
        role: "AI 배려 관찰자",
        goal: "두 사람의 AI 사용 경험 차이를 관찰하고 배려 방법을 찾는다.",
        context: "학교 체험관에서 여러 친구가 같은 AI 기술을 써 보고 있어요. 어떤 친구는 바로 잘 되고, 어떤 친구는 여러 번 해도 잘 안 되기도 합니다.",
        artifactType: "배려 관찰 기록",
        image: "/images/e4l/scenario.png"
      },

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
          title: "STEP 1 · 두 사람 장면 보기",
          question: "두 사람이 같은 AI 기술을 쓰고 있어요. 어떤 점이 눈에 띄나요?",
          hint: "한 사람은 잘 되고, 다른 사람은 잘 안 되는 것 같기도 해요. 천천히 살펴보세요.",
          uiMode: "case_view_carousel",
          cases: withDesc(E4L_BASE_CASES, {
            case_a: "두 아이가 같은 AI 장난감에 말을 걸고 있어요.",
            case_b: "두 사람이 얼굴 인식으로 문을 열려고 해요.",
            case_c: "두 사람이 AI 스피커에 노래를 틀어 달라고 해요."
          }),
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 다른 점 찾기",
          question: "두 사람의 기술 사용 경험에서 어떤 점이 다를까요?",
          hint: "그림에서 한 사람은 쉽게 되고, 다른 사람은 어렵게 느끼는 부분을 찾아보세요.",
          uiMode: "choice_cards",
          options: [
            { id: "recognized_right_away", label: "한 사람은 바로 반응이 됐어요",       emoji: "⚡" },
            { id: "needs_retry",           label: "한 사람은 여러 번 해야 했어요",       emoji: "🔁" },
            { id: "same_device",           label: "두 사람이 서로 다른 기계를 사용했어요", emoji: "📱" },
            { id: "easy_use",              label: "한 사람은 쉽게 사용했어요",           emoji: "😊" },
            { id: "hard_use",              label: "한 사람은 다시 시도하고 있었어요",     emoji: "😟" },
            { id: "same_place",            label: "두 사람이 서로 다른 장소에 있었어요",  emoji: "📍" },
            { id: "no_response",           label: "기계가 한 사람에게는 반응하지 않았어요", emoji: "❌" },
            { id: "clothes_differ",        label: "두 사람의 옷 색깔이 달랐어요",        emoji: "👕" }
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
            { id: "not_recognized",    label: "기계가 잘 알아듣지 못해서" },
            { id: "needs_retry",       label: "여러 번 해도 잘 안 돼서" },
            { id: "hard_to_use",       label: "사용하는 방법이 더 불편해 보여서" },
            { id: "system_not_fit",    label: "한 사람에게는 더 잘 맞지 않는 것 같아서" },
            { id: "different_place",   label: "두 사람이 다른 장소에 있어서" },
            { id: "clothes_different", label: "두 사람의 옷이 달라서" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 배려 방법 고르기",
          question: "어떻게 하면 두 사람 모두 더 잘 쓸 수 있을까요?",
          hint: "한 가지 방법만 말고 다른 방법도 있으면 좋을까요?",
          uiMode: "choice_cards",
          randomize: true,
          // step3에서 고른 이유에 따라 관련 배려 옵션을 우선 표시 (렌더러가 restrict 모드 미지원 시 기본 전체 표시)
          branch: {
            sourceStepId: "step3",
            filterBy: "id",
            mode: "restrict",
            ruleMap: {
              "not_recognized":  ["button_option", "different_way_to_use"],
              "needs_retry":     ["easy_retry", "fit_everyone"],
              "hard_to_use":     ["different_way_to_use", "fit_everyone"],
              "system_not_fit":  ["fit_everyone", "button_option"]
            }
          },
          options: [
            { id: "button_option",        label: "버튼도 같이 있으면 좋겠어요",                emoji: "🔘" },
            { id: "different_way_to_use", label: "말하기 말고 다른 방법도 있으면 좋겠어요",    emoji: "✋" },
            { id: "fit_everyone",         label: "여러 사람에게 잘 맞게 만들면 좋겠어요",      emoji: "👥" },
            { id: "easy_retry",           label: "잘 안 되는 사람도 쉽게 다시 해 볼 수 있으면 좋겠어요", emoji: "🔄" },
            { id: "change_color",         label: "기계 색깔을 바꾸면 좋겠어요",               emoji: "🎨" },
            { id: "make_bigger",          label: "기계를 더 크게 만들면 좋겠어요",             emoji: "📦" }
          ],
          validation: { minSelections: 1 }
        }
      ],

      submit: {
        title: "배려 관찰 완료!",
        message: "AI가 모두에게 똑같이 잘 맞지 않을 수 있다는 걸 알았어요.",
        summaryLabels: {
          step1: "살펴본 사례",
          step2: "찾은 다른 점",
          step3: "더 어려운 사람과 이유",
          step4: "모두를 위한 방법"
        },
        artifact: {
          bindingKey: "e_4_l_support_log",
          // step3_person → "여러 번 시도한 사람", step3_reasons → 이유 라벨들, step4 → 배려 방법
          template: "저는 {step3_person} 쪽이 이 기술을 쓰기 더 어렵다고 생각했어요. 왜냐하면 {step3_reasons}라고 생각했기 때문이에요. 그래서 {step4}."
        }
      }
    },

    // =====================================================================
    // E-4-M | 중학년 (3~4학년)
    // 역할: 공정성 점검단원 | 산출물: 공정성 의견서
    // =====================================================================
    middle: {
      cardCode: "E-4-M",
      performanceType: "SJ",
      description: "AI 사용 사례를 보고 누가 더 어렵거나 불리할 수 있는지 찾고, 이유와 공정성을 생각해보는 미션이에요.",

      scenario: {
        role: "공정성 점검단원",
        goal: "학교 AI 서비스 사례에서 불리한 학생을 찾고 개선 제안을 작성한다.",
        context: "학교에서 얼굴 인식 출입·숙제 찾기 음성 앱·글 읽어 주기 앱을 쓰고 있습니다. 같은 서비스인데 학생마다 결과가 달라 공정성 점검이 필요해요.",
        artifactType: "공정성 의견서",
        image: "/images/e4m/scenario.png"
      },

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
          cases: withDesc(E4M_BASE_CASES, {
            face_recognition: "학교 출입구에 얼굴을 보고 문을 열어주는 AI 장치가 있어요. 학생 A는 바로 들어가지만, 학생 B는 여러 번 시도해야 해서 늦게 들어가요.",
            voice_recognition: "학습 앱에 말로 숙제를 찾을 수 있어요. 학생 A는 바로 원하는 숙제를 찾지만, 학생 B는 말이 다르게 인식되어 엉뚱한 화면이 나와요.",
            auto_reading: "글을 읽어 주는 앱이 있어요. 학생 A는 내용을 편하게 듣지만, 학생 B는 속도가 맞지 않아 중요한 내용을 놓쳐요."
          }),
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 이 결과는 공정한가요?",
          question: "각 사례의 결과가 모두에게 공정한지 판단해보세요.",
          hint: "같은 기술인데 한 학생만 자주 실패하거나 불편하다면, 그 결과는 공정할까요?",
          uiMode: "case_judge_carousel",
          // step1 사례를 그대로 이어서 판단
          branch: { sourceStepId: "step1", mode: "filter" },
          fairnessLabel: "이 결과는 공정한가요?",
          fairnessOptions: [
            { id: "okay",   label: "공정하다"      },
            { id: "unfair", label: "공정하지 않다" }
          ],
          cases: withDesc(E4M_BASE_CASES, {
            face_recognition: "같은 출입 장치인데 학생 A는 바로 들어가고, 학생 B는 여러 번 시도해야 해요.",
            voice_recognition: "같은 앱인데 학생 A의 말은 바로 인식되고, 학생 B의 말은 자주 다르게 인식돼요.",
            auto_reading: "같은 읽기 앱인데 학생 A는 편하게 듣고, 학생 B는 속도가 안 맞아 내용을 놓쳐요."
          }),
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 왜 그런 결과가 생겼을까요?",
          question: "각 사례에서 왜 이런 결과 차이가 생겼는지 이유를 골라보세요.",
          hint: "AI가 어떤 사람의 모습이나 말하기 방식, 상황을 충분히 반영하지 못했을 수 있어요.",
          uiMode: "case_judge_carousel",
          branch: { sourceStepId: "step1", mode: "filter" },
          reasonLabel: "왜 그런 결과가 생겼을까요?",
          reasonOptions: [
            { id: "not_recognized",    label: "기계가 한 사람을 잘 알아보지 못했어요" },
            { id: "not_reflected",     label: "어떤 사람의 말이나 모습이 잘 반영되지 않았을 수 있어요" },
            { id: "same_way_not_fit",  label: "모두에게 같은 방식이 잘 맞지는 않을 수 있어요" },
            { id: "not_considered",    label: "사용자의 상황을 충분히 고려하지 않았을 수 있어요" }
          ],
          reasonMulti: true,
          cases: withDesc(E4M_BASE_CASES, {
            face_recognition: "학생 B는 여러 번 시도해야 문이 열려요.",
            voice_recognition: "학생 B는 말이 다르게 인식되어 엉뚱한 화면이 나와요.",
            auto_reading: "학생 B는 속도가 맞지 않아 중요한 내용을 놓쳐요."
          }),
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 더 공정하게 바꾸는 방법 쓰기",
          question: "각 사례에서 AI 서비스를 더 공정하게 바꾸려면 어떻게 해야 할까요?",
          hint: "대체 입력, 사람 확인, 다양한 사례 반영, 안내 개선 등을 한두 문장으로 써보세요.",
          // case_judge_carousel + allowText → 사례별 개선 제안이 카드 단위로 실제 저장/표시됨
          uiMode: "case_judge_carousel",
          branch: { sourceStepId: "step1", mode: "filter" },
          allowText: true,
          textPlaceholder: "예: 얼굴 인식이 안 될 때 카드나 번호로도 입장할 수 있게 하면 좋겠어요.",
          cases: withDesc(E4M_BASE_CASES, {
            face_recognition: "학생 B는 여러 번 시도해야 문이 열려요.",
            voice_recognition: "학생 B는 말이 다르게 인식되어 엉뚱한 화면이 나와요.",
            auto_reading: "학생 B는 속도가 맞지 않아 중요한 내용을 놓쳐요."
          }),
          validation: { required: true, textRequired: true }
        },
        {
          id: "step5",
          title: "STEP 5 · 내 생각 정리하기",
          question: "AI가 모두에게 공정한 기술이 되기 위해서는 어떻게 해야 할까요?",
          hint: "AI를 만드는 사람, 사용하는 사람 모두의 역할을 생각해 보세요. 정해진 답은 없어요.",
          uiMode: "free_text",
          placeholder: "내 생각을 자유롭게 써보세요.\n예) 다양한 사람들의 목소리와 얼굴을 AI가 더 많이 학습해야 한다고 생각해요.",
          validation: { required: true }
        }
      ],

      submit: {
        title: "공정성 점검 완료!",
        message: "AI 결과가 누구에게 더 불리할 수 있는지, 그리고 어떻게 공정하게 만들 수 있을지 직접 생각해봤어요.",
        summaryLabels: {
          step1: "누가 더 불리한지",
          step2: "공정성 판단",
          step3: "이유",
          step4: "개선 제안",
          step5: "내 생각"
        },
        artifact: {
          bindingKey: "e_4_m_fairness_opinion",
          // step2 unfair 개수 + step4 사례별 개선 제안(proposals) + step5 자유서술을 문장형으로 연결
          template: "학교에서 쓰는 AI 서비스 3개를 살펴보니, 그중 {step2_unfair_count}개가 공정하지 않다고 느꼈어요. 더 공정하게 바꾸려면 {step4_proposals}처럼 바뀌면 좋겠다고 생각했습니다. 그래서 저는 AI가 모두에게 공정한 기술이 되기 위해서는 {step5}라고 생각해요."
        }
      }
    },

    // =====================================================================
    // E-4-H | 고학년 (5~6학년)
    // 역할: AI 공정성 자문위원 | 산출물: 최종 자문 의견서
    // =====================================================================
    upper: {
      cardCode: "E-4-H",
      performanceType: "SJ",
      description: "놀이공원 AI 장면을 보며 누가 불리한 결과를 겪는지, 그 영향과 공정성을 비판적으로 판단하는 미션이에요.",

      scenario: {
        role: "AI 공정성 자문위원",
        goal: "놀이공원 AI 4개 장면을 점검하고 최종 자문 의견서를 제출한다.",
        context: "놀이공원 운영팀이 학생 자문단의 의견을 요청했습니다. 입장 게이트·놀이기구 추천·길찾기 키오스크·공연 자막 안내에서 사람마다 결과가 다르게 나타나요.",
        artifactType: "최종 자문 의견서",
        image: "/images/e4h/scenario.png"
      },

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
          uiMode: "case_view_carousel",
          cases: withDesc(E4H_BASE_CASES, {
            scene1_gate: "얼굴을 확인해 빠르게 입장하는 AI 게이트가 있어요.",
            scene2_recommendation: "공원 앱이 '지금 너에게 잘 맞는 놀이기구'를 추천해 줘요.",
            scene3_kiosk: "AI 길찾기 키오스크가 가장 빠른 길을 알려줘요.",
            scene4_performance: "공연장에 AI 자막과 음성 안내 서비스가 있어요."
          }),
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 문제 신호 찾기",
          question: "각 장면에서 공정이나 영향의 문제가 보이는 신호를 찾아보세요.",
          hint: "한 사람만 더 손해를 보거나 불편을 겪고 있다면, 그건 그냥 넘기면 안 될 신호예요.",
          uiMode: "case_judge_carousel",
          branch: { sourceStepId: "step1", mode: "filter" },
          judgmentLabel: "이 장면의 문제 신호는?",
          judgmentOptions: [
            { id: "wait_longer",     label: "한 사람만 더 오래 기다림" },
            { id: "worse_result",    label: "한 사람만 원하는 결과를 잘 얻지 못함" },
            { id: "fewer_choices",   label: "한 사람만 선택의 폭이 좁아짐" },
            { id: "less_enjoyment",  label: "한 사람만 내용을 충분히 즐기지 못함" }
          ],
          cases: withDesc(E4H_BASE_CASES, {
            scene1_gate: "방문객 B는 여러 번 멈추고 다시 확인해야 해요.",
            scene2_recommendation: "방문객 B에게는 비슷한 것만 계속 추천돼요.",
            scene3_kiosk: "방문객 B는 엉뚱한 안내를 받아 더 돌아가요.",
            scene4_performance: "방문객 B는 자막이나 안내가 맞지 않아 내용을 놓쳐요."
          }),
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 누가 어떤 영향을 받나요?",
          question: "각 장면에서 더 불리한 결과를 겪는 사람이 받을 수 있는 영향을 골라보세요.",
          hint: "그 사람 입장이 되어 생각해 보세요. 여러 영향이 겹칠 수 있어요.",
          uiMode: "case_judge_carousel",
          branch: { sourceStepId: "step1", mode: "filter" },
          judgmentLabel: "더 불리한 결과를 겪는 사람은?",
          judgmentOptions: [
            { id: "user_a", label: "방문객 A" },
            { id: "user_b", label: "방문객 B" }
          ],
          reasonLabel: "어떤 영향을 받을 수 있나요?",
          reasonOptions: [
            { id: "wait_longer",      label: "기다리는 시간이 더 길어짐" },
            { id: "less_play_time",   label: "같은 놀이 시간을 덜 가지게 됨" },
            { id: "less_variety",     label: "새로운 놀이기구를 덜 경험하게 됨" },
            { id: "late_arrival",     label: "필요한 장소를 늦게 찾게 됨" },
            { id: "miss_performance", label: "공연 내용을 충분히 즐기지 못함" },
            { id: "feel_bad",         label: "속상하거나 민망할 수 있음" }
          ],
          reasonMulti: true,
          cases: withDesc(E4H_BASE_CASES, {
            scene1_gate: "AI 게이트가 한 방문객은 바로 통과시키고, 다른 방문객은 여러 번 확인하게 해요.",
            scene2_recommendation: "같은 앱인데 한 방문객에게는 다양하게, 다른 방문객에게는 비슷하게만 추천해요.",
            scene3_kiosk: "같은 키오스크인데 한 방문객은 정확한 안내를, 다른 방문객은 엉뚱한 안내를 받아요.",
            scene4_performance: "같은 공연인데 한 방문객은 자막이 잘 맞고, 다른 방문객은 자막이나 안내가 잘 맞지 않아요."
          }),
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 왜 문제인지 고르기",
          question: "각 장면의 결과가 왜 문제인지 이유를 골라보세요. 여러 개 선택할 수 있어요.",
          hint: "이 차이가 한 번만 생기는 게 아니라 반복된다면 어떨까요?",
          uiMode: "case_judge_carousel",
          branch: { sourceStepId: "step1", mode: "filter" },
          reasonLabel: "왜 이 결과가 문제일까요?",
          reasonOptions: [
            { id: "same_service_diff_result", label: "같은 서비스인데 결과가 다르게 나와서" },
            { id: "repeat_failure",           label: "어떤 사람만 자주 실패해서" },
            { id: "unequal_opportunity",      label: "같은 기회를 얻지 못할 수 있어서" },
            { id: "less_info_fun",            label: "필요한 정보나 즐길 거리를 덜 얻게 돼서" },
            { id: "cumulative_harm",          label: "반복되면 계속 손해를 볼 수 있어서" }
          ],
          reasonMulti: true,
          cases: withDesc(E4H_BASE_CASES, {
            scene1_gate: "방문객 B는 같은 게이트에서 계속 더 오래 기다려야 해요.",
            scene2_recommendation: "방문객 B는 새로운 놀이기구를 추천받을 기회가 적어요.",
            scene3_kiosk: "방문객 B는 잘못된 안내 때문에 시간을 낭비하게 돼요.",
            scene4_performance: "방문객 B는 공연 내용을 충분히 즐기지 못하게 돼요."
          }),
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · AI 결과를 그대로 믿어도 될까?",
          question: "각 장면에서 AI가 올바르게 활용되기 위해서는 어떤 과정이 필요할지 짧게 적어보세요.",
          hint: "AI가 틀릴 수 있다는 걸 알면, 어떻게 행동해야 할까요?",
          uiMode: "case_judge_carousel",
          branch: { sourceStepId: "step1", mode: "filter" },
          allowText: true,
          textPlaceholder: "예) 다양한 성별과 연령의 얼굴 데이터를 수집하여 학습시켜야 합니다.",
          cases: withDesc(E4H_BASE_CASES, {
            scene1_gate: "AI 게이트가 방문객마다 다른 결과를 보여줘요.",
            scene2_recommendation: "앱이 방문객마다 다른 범위로 추천해줘요.",
            scene3_kiosk: "키오스크가 방문객마다 다른 정확도의 안내를 해줘요.",
            scene4_performance: "AI 자막·안내 서비스가 방문객마다 다르게 작동해요."
          }),
          validation: { required: true, textRequired: true }
        },
        {
          id: "step6",
          title: "STEP 6 · 최종 자문 의견서 작성하기",
          question: "모두를 위한 AI 기술이 되기 위해서는 어떤 과정이 필요할지 최종 의견을 3~5문장으로 정리해봐요.",
          hint: "오늘 본 장면들에서 공통으로 중요했던 점은 무엇이었나요? 자문위원으로서 운영팀에게 어떤 조언을 하겠어요?",
          uiMode: "free_text",
          placeholder: "예) AI가 편리해 보여도 모두에게 똑같이 공정한지 생각해야 해요.\n예) 나에게는 편리한 AI가 다른 사람에게는 불편할 수 있다는 것을 알아야해요.\n예) 다양한 사람들의 데이터로 학습하고, 대안 방법도 함께 제공해야 해요.",
          validation: { required: true }
        }
      ],

      submit: {
        title: "AI 공정성 자문 완료!",
        message: "놀이공원 AI 장면에서 누가 더 불리한 결과를 겪는지, 그 영향과 공정성을 직접 판단하고 자문 의견서까지 완성했어요.",
        summaryLabels: {
          step1: "살펴본 장면",
          step2: "문제 신호",
          step3: "영향받는 사람과 영향",
          step4: "문제 이유",
          step5: "AI 결과 수용 판단",
          step6: "최종 자문 의견서"
        },
        artifact: {
          bindingKey: "e_4_h_advisory_opinion",
          // step5 사례별 개선 제안(proposals)을 문장형으로 이어 붙이고, step6 자유 서술을 자연스럽게 연결
          template: "놀이공원의 AI 서비스 4개 장면을 살펴본 결과, 방문객마다 같은 서비스에서도 다른 결과를 겪고 있다는 것을 확인했어요. 더 공정한 AI가 되려면 {step5_proposals}처럼 개선되어야 한다고 생각합니다. 그래서 자문위원으로서 저는 {step6}라고 제안해요."
        }
      }
    }
  }
};
