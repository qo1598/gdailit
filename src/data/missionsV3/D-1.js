export const D1_V3 = {
  meta: {
    code: "D-1",
    title: "끼리끼리 분류 놀이",
    domain: "Designing",
    ksa: { K: ["K1.1", "K1.2", "K2.4"], S: ["Computational Thinking"], A: ["Curious"] }
  },
  grades: {
    upper: {
      cardCode: "D-1-H",
      performanceType: "DS",
      description: "예시 데이터를 보고 분류 규칙을 만들고, 새 데이터를 분류·검토·수정하며 AI의 학습 원리를 이해하는 미션이에요.",
      intro: [
        { text: "이메일 앱은 스팸 메일을 자동으로 걸러주고,\n쇼핑 앱은 비슷한 상품을 묶어 추천해 줘요.\n이런 일이 가능한 건 AI가 많은 예시를 보고 규칙을 찾기 때문이에요." },
        { text: "AI는 처음부터 모든 걸 아는 게 아니라,\n데이터를 보고 규칙을 만들고, 틀리면 다시 고치면서 점점 나아져요." },
        { text: "오늘은 여러분이 직접 AI가 되어\n예시를 보고 규칙을 만들고 새로운 데이터를 분류해 볼 거예요.\n내 규칙은 얼마나 잘 맞을까요? 직접 시험해 봅시다!" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 데이터를 그냥 외우는 것이 아니라, 여러 예시에서 공통된 특징을 찾고 규칙을 만들어 새로운 것을 분류하거나 예측해요. 이 활동은 AI가 어떻게 학습하고 판단하는지 이해하는 데 도움이 돼요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "주어진 예시들 사이에 어떤 공통점과 차이가 있는지, 내가 만든 규칙이 새로운 데이터에도 잘 맞는지, 틀렸다면 어떤 부분을 고쳐야 하는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 왜 그런 결과를 냈는지 이해하지 못하면, 틀린 분류 결과를 그대로 받아들이게 될 수 있어요. 그러면 잘못된 판단이 왜 생겼는지 알기 어렵고, 더 좋은 방법으로 고칠 지점을 찾기도 힘들어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 예시 데이터 살펴보기",
          question: "훈련 데이터 카드 6장을 읽고, 스팸/정상 메일의 공통 특징을 찾아 눌러보세요.",
          hint: "A 그룹(스팸)에 자주 나오는 단어, B 그룹(정상)에는 없는 단어를 찾아보세요. 반복되는 단어가 분류의 핵심 단서예요!",
          uiMode: "ds_training_cards",
          labelNames: { A: "스팸", B: "정상" },
          cards: [
            { id: "t1", label: "A", text: "축하합니다! 무료 상품에 당첨됐습니다. 지금 클릭하세요!" },
            { id: "t2", label: "A", text: "오늘 한정! 무료 이벤트 참여하고 경품 받으세요" },
            { id: "t3", label: "A", text: "무료 쿠폰 증정! 클릭하면 바로 적용돼요" },
            { id: "t4", label: "B", text: "내일 수학 시험 범위는 3단원까지예요" },
            { id: "t5", label: "B", text: "저녁 모임 장소가 도서관으로 바뀌었어요" },
            { id: "t6", label: "B", text: "독후감 제출 기한이 이번 주 금요일이에요" }
          ],
          featureChips: ["무료", "클릭", "당첨", "이벤트", "쿠폰", "경품", "시험", "모임", "제출"],
          validation: { minHighlights: 2 }
        },
        {
          id: "step2",
          title: "STEP 2 · 규칙 만들기",
          question: "찾아낸 특징 블록을 조합해 나만의 분류 규칙을 만들어보세요.",
          hint: "규칙 예시: '무료'가 포함되면 → 스팸. 블록을 눌러 규칙 조건에 추가해보세요. 조건은 OR 관계예요 (하나라도 맞으면 스팸).",
          uiMode: "ds_rule_builder",
          labelNames: { A: "스팸", B: "정상" },
          availableFeatures: ["무료", "클릭", "당첨", "이벤트", "쿠폰", "경품"],
          targetLabel: "A",
          validation: { minConditions: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 새 데이터 분류하기",
          question: "새로운 메일 3개를 보고, 내가 만든 규칙으로 분류해보세요.",
          hint: "내가 만든 규칙의 조건이 포함되어 있으면 스팸(A), 없으면 정상(B)으로 분류해보세요.",
          uiMode: "ds_classify",
          labelNames: { A: "스팸", B: "정상" },
          newCards: [
            { id: "n1", text: "무료 이벤트! 지금 참여하면 선물이 있어요", answer: "A" },
            { id: "n2", text: "오늘 체육 수업이 강당으로 변경됐어요", answer: "B" },
            { id: "n3", text: "클릭하면 당첨! 경품 이벤트 지금 확인하세요", answer: "A" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 결과 비교하기",
          question: "실제 정답과 내 분류 결과를 비교해보세요.",
          hint: "틀린 카드가 있다면 왜 틀렸는지 생각해보세요. 내 규칙에 어떤 조건이 빠졌을까요?",
          uiMode: "ds_result_check",
          labelNames: { A: "스팸", B: "정상" },
          newCards: [
            { id: "n1", text: "무료 이벤트! 지금 참여하면 선물이 있어요", answer: "A" },
            { id: "n2", text: "오늘 체육 수업이 강당으로 변경됐어요", answer: "B" },
            { id: "n3", text: "클릭하면 당첨! 경품 이벤트 지금 확인하세요", answer: "A" }
          ],
          validation: { required: false }
        },
        {
          id: "step5",
          title: "STEP 5 · 규칙 수정하기",
          question: "틀린 결과를 바탕으로 조건을 추가하거나 바꿔 더 정확한 규칙을 만들어보세요.",
          hint: "n3 카드에는 '무료'가 없지만 '클릭', '당첨', '경품'이 있어요. 이 단어들을 규칙에 추가해보세요!",
          uiMode: "ds_rule_revise",
          labelNames: { A: "스팸", B: "정상" },
          availableFeatures: ["무료", "클릭", "당첨", "이벤트", "쿠폰", "경품"],
          targetLabel: "A",
          refStepId: "step2",
          validation: { minConditions: 1 }
        },
        {
          id: "step6",
          title: "STEP 6 · 최종 규칙 저장하기",
          question: "처음 규칙과 수정한 규칙 중 더 좋은 것을 골라 저장해보세요.",
          hint: "어떤 규칙이 새로운 데이터를 더 잘 맞혔나요? 더 많은 조건을 담은 규칙이 더 정확할 수 있어요.",
          uiMode: "ds_rule_save",
          labelNames: { A: "스팸", B: "정상" },
          refStepIds: { v1: "step2", v2: "step5" },
          validation: { required: true }
        }
      ],
      submit: {
        title: "분류 규칙 완성!",
        message: "데이터를 보고 규칙을 만들고 수정하는 AI 학습 원리를 직접 경험했어요.",
        summaryLabels: {
          step1: "찾아낸 특징",
          step2: "처음 규칙 (v1)",
          step3: "내 분류 결과",
          step4: "정답 비교",
          step5: "수정된 규칙 (v2)",
          step6: "최종 선택 규칙"
        }
      }
    }
  }
};
