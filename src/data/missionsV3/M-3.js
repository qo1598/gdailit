export const M3_V3 = {
  meta: {
    code: "M-3",
    title: "부탁을 잘하면 결과가 달라질까?",
    domain: "Managing",
    ksa: { K: ["K1.3", "K2.3"], S: ["Computational Thinking"], A: ["Adaptable"] }
  },
  grades: {
    upper: {
      cardCode: "M-3-H",
      performanceType: "GC",
      description: "같은 AI에게 어떻게 부탁하느냐에 따라 결과가 달라진다는 것을 직접 경험해보는 미션이에요.",
      intro: [
        { text: "같은 AI에게 부탁해도, 어떻게 말하느냐에 따라 결과가 달라질 때가 있어요.\n\"포스터 문구 만들어줘\"라고 짧게 말할 때와 조건을 자세히 말할 때의 결과는 같지 않을 수 있습니다." },
        { text: "AI는 사람처럼 내 마음을 알아서 이해하지 못하고,\n내가 입력한 말과 조건을 보고 결과를 만듭니다." },
        { text: "그래서 AI를 잘 쓰려면 막연하게 부탁하는 것이 아니라,\n목적에 맞게 분명하게 요청해야 해요." },
        { text: "오늘은 여러분이 직접 AI에게 부탁해 보고,\n어떤 프롬프트가 더 좋은 결과를 만드는지 비교해 볼 거예요!" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 내가 입력한 조건대로 결과를 만들기 때문입니다. 목적에 맞게 요청하는 힘은 AI를 똑똑하고 책임 있게 사용하는 데 꼭 필요합니다." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 프롬프트가 더 구체적인지, 필요한 조건이 들어 있는지, 그리고 생성된 결과가 내 목적에 잘 맞는지를 살펴보아야 합니다." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "너무 모호하게 부탁하면 엉뚱한 결과를 얻게 되어 다시 고쳐야 하거나, 잘못된 내용을 그대로 사용할 수도 있습니다." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 첫 번째 부탁",
          question: "주제를 하나 골라, 짧고 단순하게 AI에게 부탁해보세요.",
          hint: "지금은 일부러 짧고 단순하게 부탁하는 단계예요. '포스터 문구 만들어줘'처럼 조건 없이 간단하게 입력해 보세요. 결과가 어떻게 나오는지 확인하는 것이 목표예요!",
          uiMode: "task_and_prompt",
          taskOptions: [
            { id: "poster", label: "환경 보호 포스터 문구", desc: "환경을 지키자는 포스터에 쓸 문구를 만들어요" },
            { id: "event_notice", label: "학교 행사 안내문", desc: "학교 행사를 알리는 안내 문구를 만들어요" },
            { id: "book_intro", label: "책 소개 글", desc: "재미있게 읽은 책을 친구에게 소개하는 글을 만들어요" }
          ],
          promptPlaceholder: "짧고 단순하게 부탁해보세요.",
          promptHint: "예: \"포스터 문구 만들어줘\", \"행사 안내문 써줘\"",
          validation: { requiredFields: ["task_type", "prompt_initial", "output_initial"] }
        },
        {
          id: "step2",
          title: "STEP 2 · 자세한 부탁",
          question: "같은 주제로 대상, 형식, 분위기 등 조건을 더해 다시 부탁해보세요.",
          hint: "아래 칩(조건)을 눌러 프롬프트에 붙여보세요. 예: '초등학생을 대상으로, 밝은 분위기로, 3줄짜리 환경 보호 포스터 문구 만들어줘'처럼 조건이 많을수록 AI가 더 정확하게 만들어줘요.",
          uiMode: "prompt_with_conditions",
          conditionChips: [
            { label: "대상", example: "초등학생을 대상으로" },
            { label: "형식", example: "3줄로" },
            { label: "분위기", example: "밝고 친근하게" },
            { label: "길이", example: "50자 이내로" },
            { label: "꼭 넣을 단어", example: "\"함께\"를 꼭 넣어서" }
          ],
          promptPlaceholder: "조건을 포함해 자세하게 부탁해보세요.",
          promptHint: "예: \"초등학생이 이해하기 쉽게, 밝은 분위기로, 3줄짜리 환경 보호 포스터 문구 만들어줘\"",
          validation: { requiredFields: ["prompt_detailed", "output_detailed"] }
        },
        {
          id: "step3",
          title: "STEP 3 · 결과 비교",
          question: "두 결과를 나란히 비교해보세요. 어떤 것이 더 목적에 잘 맞나요?",
          hint: "어떤 결과가 내가 원하는 것에 더 가까운지 생각해 보세요. '목적에 맞는다'는 것은 포스터라면 한눈에 들어오고, 안내문이라면 꼭 필요한 내용이 다 들어있는 것을 말해요.",
          uiMode: "text_compare_ab",
          labelA: "처음 부탁 결과",
          labelB: "자세한 부탁 결과",
          reasonOptions: [
            { id: "more_specific", label: "더 구체적이에요" },
            { id: "better_fit", label: "목적에 더 맞아요" },
            { id: "better_format", label: "형식이 더 좋아요" },
            { id: "better_tone", label: "분위기가 더 적절해요" },
            { id: "easier_to_use", label: "바로 쓸 수 있어요" },
            { id: "other", label: "기타 (직접 쓰기)" }
          ],
          validation: { requiredFields: ["choice", "reasons"] }
        },
        {
          id: "step4",
          title: "STEP 4 · 나만의 프롬프트 설계",
          question: "앞에서 배운 요소들을 직접 활용해서 나만의 프롬프트 문장을 완성해보세요.",
          hint: "프롬프트에 넣으면 좋은 요소예요: 대상(누구에게?), 목적(왜 만드나요?), 형식(어떤 모습?), 분위기(밝게? 진지하게?), 꼭 넣을 내용, 길이. 이 요소들을 하나의 문장으로 자연스럽게 연결해보세요!",
          uiMode: "prompt_single_input",
          promptPlaceholder: "예: 초등학생이 이해하기 쉽게, 밝고 희망찬 분위기로, \"함께\"라는 단어를 꼭 넣어서, 3줄짜리 환경 보호 포스터 문구 만들어줘",
          reminderElements: ["대상", "목적", "형식", "분위기", "꼭 넣을 내용", "길이"],
          validation: { minLength: 20, requiredFields: ["prompt_revised", "output_revised"] }
        },
        {
          id: "step5",
          title: "STEP 5 · 최종 결과 선택",
          question: "세 가지 결과를 모두 비교하고, 가장 목적에 맞는 결과를 골라보세요.",
          uiMode: "result_compare_final",
          panels: [
            { key: "initial", label: "처음 결과" },
            { key: "detailed", label: "두 번째 결과" },
            { key: "revised", label: "내가 고친 결과" }
          ],
          selfCheckItems: [
            { id: "check1", label: "구체적인 프롬프트일수록 결과가 더 좋아졌나요?" },
            { id: "check2", label: "대상과 형식을 정하니 결과가 달라졌나요?" },
            { id: "check3", label: "내가 고친 프롬프트가 처음보다 나아졌나요?" }
          ],
          validation: { requiredFields: ["best"] }
        }
      ],
      submit: {
        title: "프롬프트 설계 완료!",
        message: "AI에게 더 잘 부탁하는 방법을 직접 비교하고 설계했어요.",
        summaryLabels: {
          step1: "처음 부탁과 결과",
          step2: "자세한 부탁과 결과",
          step3: "결과 비교 선택",
          step4: "내가 설계한 프롬프트",
          step5: "최종 선택"
        }
      }
    }
  }
};
