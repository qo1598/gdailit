export const MISSIONS_V3 = {
  "E-1": {
    meta: {
      code: "E-1",
      title: "생활 속 AI 찾기",
      domain: "Engaging",
      ksa: ["K1.4", "Self Awareness", "Curious"]
    },
    grades: {
      lower: {
        cardCode: "E-1-L",
        performanceType: "TD",
        intro: [
          { text: "우리 주변에는 똑똑한 기술들이 숨어 있어요.", image: "/assets/images/v3/E1/intro1.png" },
          { text: "로봇청소기나 말하는 핸드폰을 본 적 있나요?", image: "/assets/images/v3/E1/intro2.png" },
          { text: "오늘은 이런 똑똑한 AI를 직접 찾아볼 거예요.", image: "/assets/images/v3/E1/intro3.png" }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 AI를 찾아보는 걸까요?", answer: "우리 곁에 AI가 어디 있는지 알기 위해서예요." },
          { id: 2, question: "어디를 잘 살펴야 할까요?", answer: "사람처럼 스스로 일하는 기계를 찾아보세요." },
          { id: 3, question: "AI가 아니면 어떻게 될까요?", answer: "직접 손으로 움직여야 해서 불편할 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "보기",
            question: "AI가 들어 있을 것 같은 것은 무엇인가요?",
            uiMode: "choice_cards",
            options: [
              { id: "robot_vacuum", label: "로봇청소기", isAI: true },
              { id: "voice_assistant", label: "말하는 인형", isAI: true },
              { id: "calculator", label: "계산기", isAI: false },
              { id: "lamp", label: "전등", isAI: false }
            ],
            validation: { minSelections: 1 }
          }
        ],
        submit: {
          title: "미션 완료!",
          message: "다 찾았어요! 우리 주변에 AI가 정말 많네요."
        }
      }
    }
  }
};
