export const C2_V3 = {
  meta: {
    code: "C-2",
    title: "AI 그림, 어디가 이상할까?",
    domain: "Creating",
    ksa: { K: ["K4.1", "K4.3"], S: ["Creativity"], A: ["Adaptable"] }
  },
  grades: {
    middle: {
      cardCode: "C-2-M",
      performanceType: "GC",
      description: "AI가 그린 그림에서 이상한 부분을 찾고, 왜 그런 실수를 했는지 분석해봐요.",
      intro: [
        { text: "AI는 동화 그림, 포스터, 캐릭터 등 멋진 그림을 아주 빠르게 만들 수 있어요.\n하지만 자세히 보면 손가락 개수가 이상하거나, 그림자가 엉뚱한 곳에 있는 경우도 있어요." },
        { text: "이것은 AI가 실제 세상의 원리를 완벽하게 이해하지 못하고\n'그럴듯하게'만 만들기 때문이에요." },
        { text: "오늘은 여러분이 AI 그림 검사관이 되어\n그림 속 이상한 부분을 찾고, AI가 왜 그런 실수를 했는지 분석해봅시다!" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 만든 그림이 항상 정답은 아니라는 것을 알고, 결과를 스스로 비판적으로 판단하는 힘을 기르기 위해서예요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 사물의 모양이나 사물 간의 관계(그림자, 위치, 크기 등)를 실제와 다르게 표현한 부분을 찾아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI의 결과물을 무조건 믿게 되어 잘못된 정보나 왜곡된 표현을 그대로 받아들일 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "그림 보기",
          question: "AI가 그린 소풍 그림을 자세히 살펴보세요.",
          uiMode: "image_view",
          imageUrl: "/c2_picnic_defect_v5.png",
          description: "이 그림은 AI가 그린 소풍 장면이에요. 자세히 보면 실제와 다른 이상한 부분이 숨어 있어요!",
          validation: { required: false }
        },
        {
          id: "step2",
          title: "이상한 부분 찾기",
          question: "그림에서 이상한 부분을 모두 찾아 선택해보세요.",
          uiMode: "defect_select",
          imageUrl: "/c2_picnic_defect_v5.png",
          defectTypes: [
            { id: "hand_error", label: "손/발 모양이 이상해요", icon: "✋" },
            { id: "shadow_error", label: "그림자가 이상해요", icon: "🌑" },
            { id: "position_error", label: "물건 위치가 이상해요", icon: "📦" },
            { id: "size_error", label: "크기가 이상해요", icon: "📏" },
            { id: "overlap_error", label: "겹치는 게 이상해요", icon: "🔀" },
            { id: "other_error", label: "기타 이상한 부분", icon: "❓" }
          ],
          validation: { minSelections: 1 }
        },
        {
          id: "step3",
          title: "이유 생각하기",
          question: "AI가 왜 이런 실수를 했을까요? 가장 적절한 이유를 골라보세요.",
          uiMode: "single_select_buttons",
          options: [
            { id: "shape_confusion", label: "비슷한 모양을 헷갈렸어요" },
            { id: "position_error", label: "물체 위치를 잘못 계산했어요" },
            { id: "scene_mix", label: "여러 장면을 섞어버렸어요" },
            { id: "no_physics", label: "물리 법칙을 이해 못했어요" },
            { id: "other", label: "기타" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "더 나은 그림 고르기",
          question: "수정된 두 그림 중 더 자연스러운 것을 골라보세요.",
          uiMode: "image_compare_ab",
          imageA: { url: "/c2_picnic_defect_v5.png", label: "그림 A" },
          imageB: { url: "/c2_picnic_defect_v5_compare.png", label: "그림 B" },
          reasonOptions: [
            { id: "natural_hand", label: "손 모양이 더 자연스러워요" },
            { id: "correct_shadow", label: "그림자가 올바른 방향이에요" },
            { id: "right_position", label: "물건 위치가 맞아요" },
            { id: "no_weird_shape", label: "이상한 모양이 없어요" },
            { id: "overall_better", label: "전체적으로 더 자연스러워요" },
            { id: "other", label: "기타 (직접 쓰기)" }
          ],
          validation: { required: true }
        }
      ],
      submit: {
        title: "AI 그림 검사 완료!",
        message: "AI 그림의 오류를 찾고 분석하는 능력이 생겼어요.",
        summaryLabels: {
          step1: "관찰한 그림",
          step2: "찾은 오류",
          step3: "오류 원인",
          step4: "선택한 그림"
        }
      }
    }
  }
};
