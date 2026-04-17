export const E2_V3 = {
  meta: {
    code: "E-2",
    title: "AI 답, 믿어도 될까?",
    domain: "Engaging",
    ksa: { K: ["K4.3", "K4.4"], S: ["Critical Thinking"], A: ["Responsible"] }
  },
  grades: {
    lower: {
      cardCode: "E-2-L",
      performanceType: "TD",
      description: "AI가 말한 답 중 이상한 답을 골라내는 미션이에요.",
      intro: [
        { text: "AI는 질문에 빠르게 답해 주지만, 가끔 이상한 말을 할 때도 있어요.\n예를 들어 없는 동물을 진짜 있다고 말하거나, 틀린 사실을 맞다고 말할 수도 있어요." },
        { text: "그래서 AI가 대답했다고 해서 무조건 다 맞는 것은 아니에요.\nAI를 잘 쓰려면 '이상한 답'을 알아차리는 눈이 필요해요." },
        { text: "오늘은 AI가 한 답 중에서 이상한 답을 찾아볼 거예요.\n어떤 답이 이상한지 잘 살펴봅시다!" }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 편리하지만 가끔 틀린 답을 말할 수 있어요. 이상한 답을 알아차릴 수 있어야 AI를 더 안전하게 사용할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "답이 정말 맞는지, 내가 알고 있는 사실과 다른 점은 없는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 한 말을 그대로 믿게 되고, 틀린 정보를 맞다고 생각할 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · 이상한 답 찾기",
          question: "어떤 답이 이상한가요?",
          hint: "내가 알고 있는 사실과 비교해 보세요. 동물 다리 수, 과일 색 같은 것은 책에서 확인할 수 있어요. AI 답이 그것과 다르다면 이상한 답일 수 있어요!",
          uiMode: "judge_qa_carousel",
          qaCards: [
            { id: "q1", question: "바나나는 무슨 색인가요?", answer: "보통 노란색이에요.", correctJudgment: "correct" },
            { id: "q2", question: "고양이는 다리가 몇 개인가요?", answer: "고양이는 보통 여섯 개의 다리를 가져요.", correctJudgment: "strange" },
            { id: "q3", question: "사과는 나무에서 자라나요?", answer: "네, 사과는 사과나무에서 자라요.", correctJudgment: "correct" },
            { id: "q4", question: "강아지는 하늘을 날 수 있나요?", answer: "네, 강아지는 날개가 있어서 구름 위까지 날 수 있어요.", correctJudgment: "strange" },
            { id: "q5", question: "지구는 태양 주위를 돌아요?", answer: "아니요, 태양이 지구 주위를 돌기 때문에 낮과 밤이 생겨요.", correctJudgment: "strange" },
            { id: "q6", question: "얼음은 차가운가요?", answer: "얼음은 원래 뜨겁지만 냉장고에 오래 두면 차갑게 변해요.", correctJudgment: "strange" }
          ],
          judgeOptions: [{ id: "correct", label: "맞는 답" }, { id: "strange", label: "이상한 답" }],
          reasonOptions: [
            { id: "wrong_fact", label: "틀린 사실이에요" },
            { id: "contradicts_itself", label: "말이 앞뒤가 안 맞아요" },
            { id: "impossible", label: "실제로 있을 수 없는 일이에요" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · AI 답, 어떻게 확인할까요?",
          question: "AI가 이상한 답을 했을 때 어떻게 확인할 수 있을까요?",
          hint: "AI가 틀릴 수 있다면, 맞는 답을 어디서 찾을 수 있을까요? 여러 개 골라도 좋아요!",
          uiMode: "choice_cards",
          options: [
            { id: "check_book", label: "책에서 찾아봐요" },
            { id: "ask_adult", label: "선생님이나 어른에게 물어봐요" },
            { id: "search_internet", label: "인터넷에서 다시 검색해요" },
            { id: "ask_again", label: "AI의 말을 그대로 사용해요" },
            { id: "other", label: "기타" }
          ],
          validation: { required: true, minSelections: 1 }
        }
      ],
      submit: {
        title: "이상한 답을 잘 찾았어요!",
        message: "AI 답도 한 번 더 확인하는 습관이 생겼어요.",
        summaryLabels: { step1: "판단 결과", step2: "확인 방법" }
      }
    },
    middle: {
      cardCode: "E-2-M",
      performanceType: "SJ",
      description: "AI와의 대화에서 사실과 거짓을 구별하고, 비판적으로 대화하는 능력을 기르는 미션이에요.",
      intro: [
        { text: "AI는 질문에 빠르게 답하지만, 가끔 사실과 다른 내용을 말하기도 해요.\n그럴듯해 보이는 답도 틀릴 수 있어요." },
        { text: "특히 AI와 대화할 때, 어떤 내용이 맞고 어떤 내용이 틀렸는지 스스로 확인하는 습관이 중요해요." },
        { text: "오늘은 학생과 AI가 나눈 대화를 살펴보면서, 틀린 말풍선을 찾아보고 AI와 대화할 때 유의할 점도 생각해봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 답은 편리하지만 항상 맞지는 않아요. 대화 중에도 틀린 내용을 알아보고, 비판적으로 정보를 받아들이는 습관이 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 한 말이 사실과 맞는지, 과장되거나 없는 내용을 추가하진 않았는지, 증명되지 않은 것을 사실처럼 말하진 않았는지 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "그럴듯한 말을 그대로 믿게 되고, 틀린 정보를 사실처럼 받아들이거나 다른 사람에게 전달할 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI와의 대화 살펴보기",
          question: "학생과 AI가 나눈 대화를 읽어보세요.",
          hint: "AI의 말 중에 사실과 다른 내용이 섞여 있을 수 있어요. 각 답변을 주의 깊게 읽으면서 어떤 내용이 의심스러운지 생각해 보세요.",
          uiMode: "chat_display",
          chatMessages: [
            { id: "m1", role: "student", text: "태양에서 가장 가까운 행성이 뭐야?" },
            { id: "m2", role: "ai", aiId: "a1", text: "태양에서 가장 가까운 행성은 수성이에요. 수성은 태양에서 약 5,790만 km 떨어져 있고, 표면 온도 차이가 매우 심해요." },
            { id: "m3", role: "student", text: "그럼 수성이 제일 뜨거운 행성이야?" },
            { id: "m4", role: "ai", aiId: "a2", text: "아니에요! 흥미롭게도 수성은 가장 뜨거운 행성이 아니에요. 대기가 거의 없어서 열을 가두지 못하거든요. 평균 기온이 가장 높은 행성은 금성이에요. 두꺼운 이산화탄소 대기가 열을 가둬 온실 효과가 일어나서 460도 이상 달해요." },
            { id: "m5", role: "student", text: "달은 지구를 얼마나 자주 돌아?" },
            { id: "m6", role: "ai", aiId: "a3", text: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요." },
            { id: "m7", role: "student", text: "명왕성은 아직 행성이야?" },
            { id: "m8", role: "ai", aiId: "a4", text: "명왕성은 2006년에 국제천문연맹(IAU)이 '왜소행성'으로 재분류했어요. 그래서 공식적으로는 더 이상 태양계의 행성이 아니에요. 현재 태양계에는 수성, 금성, 지구, 화성, 목성, 토성, 천왕성, 해왕성, 총 8개의 행성이 있어요." },
            { id: "m9", role: "student", text: "행성이 태양 주위를 도는 이유는 뭐야?" },
            { id: "m10", role: "ai", aiId: "a5", text: "행성이 태양 주위를 도는 건 중력 때문이에요. 태양의 강한 중력이 행성을 잡아당기고, 행성의 공전 속도가 균형을 이루면서 일정한 궤도를 유지해요. 만약 공전 속도가 없다면 행성은 태양으로 떨어지게 될 거예요." },
            { id: "m11", role: "student", text: "블랙홀은 정말 모든 걸 빨아들여?" },
            { id: "m12", role: "ai", aiId: "a6", text: "네, 블랙홀은 빛까지 빨아들일 만큼 중력이 강해요. 최근 연구에서는 블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에는 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요." },
            { id: "m13", role: "student", text: "우와, 정말 신기하다! 우주에 대해 많이 배운 것 같아. 고마워!" },
          ],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 틀린 말풍선 골라내기",
          question: "AI가 한 말 중 틀렸다고 생각하는 것을 선택하고, 틀린 이유와 바른 내용을 골라보세요.",
          hint: "STEP 1의 대화를 떠올리며 각 AI 답변을 확인해 보세요. 사실과 다르거나, 과장됐거나, 증명되지 않은 내용을 말했는지 살펴보세요.",
          uiMode: "bubble_select_correct",
          aiBubbles: [
            {
              id: "a1",
              context: "태양에서 가장 가까운 행성은?",
              text: "태양에서 가장 가까운 행성은 수성이에요. 수성은 태양에서 약 5,790만 km 떨어져 있고, 표면 온도 차이가 매우 심해요.",
              correctionOptions: null
            },
            {
              id: "a2",
              context: "수성이 제일 뜨거운 행성이야?",
              text: "수성은 가장 뜨거운 행성이 아니에요. 평균 기온이 가장 높은 행성은 금성이에요. 두꺼운 이산화탄소 대기가 열을 가둬 460도 이상 달해요.",
              correctionOptions: null
            },
            {
              id: "a3",
              context: "달은 지구를 얼마나 자주 돌아?",
              text: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요.",
              correctionOptions: null
            },
            {
              id: "a4",
              context: "명왕성은 아직 행성이야?",
              text: "명왕성은 2006년에 IAU가 '왜소행성'으로 재분류해 더 이상 태양계 행성이 아니에요. 현재 태양계에는 8개의 행성이 있어요.",
              correctionOptions: null
            },
            {
              id: "a5",
              context: "행성이 태양 주위를 도는 이유는?",
              text: "행성이 태양 주위를 도는 건 중력 때문이에요. 태양의 강한 중력이 행성을 잡아당기고, 공전 속도가 균형을 이루면서 일정한 궤도를 유지해요.",
              correctionOptions: null
            },
            {
              id: "a6",
              context: "블랙홀은 정말 모든 걸 빨아들여?",
              text: "블랙홀은 빛까지 빨아들여요. 최근 연구에서는 블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요.",
            },
          ],
          reasonOptions: [
            { id: "wrong_fact", label: "사실이 틀렸어요" },
            { id: "not_proven", label: "증명되지 않은 것을 사실처럼 말했어요" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · AI와 대화할 때 유의할 점",
          question: "AI와 대화를 나눌 때 유의해야 할 점은 무엇인가요? 해당되는 것을 모두 골라보세요.",
          hint: "STEP 1~2에서 배운 것을 바탕으로 생각해 보세요. AI를 더 안전하고 현명하게 사용하려면 어떤 자세가 필요할까요?",
          uiMode: "multi_select_chips",
          chips: [
            { id: "can_be_wrong", label: "AI도 틀릴 수 있다는 것을 기억한다" },
            { id: "verify_facts", label: "중요한 내용은 다른 자료로 꼭 확인한다" },
            { id: "ask_many", label: "AI가 지칠때까지 질문을 해서 정확한 답을 이끌어낸다" },
            { id: "ask_source", label: "정보의 출처나 근거를 직접 확인한다" },
            { id: "do_copy", label: "AI 답을 그대로 써서 내가 이해한 내용을 정리한다" },
            { id: "cross_check", label: "여러 자료를 비교해서 공통된 내용을 신뢰한다" },
            { id: "other", label: "기타" }
          ],
          validation: { required: true, minSelections: 1 }
        }
      ],
      submit: {
        title: "AI 대화 검토 완료!",
        message: "AI 답변을 비판적으로 살펴보고 현명하게 대화하는 힘이 생겼어요.",
        summaryLabels: { step1: "대화 확인", step2: "틀린 말풍선", step3: "유의할 점" }
      }
    },
    upper: {
      cardCode: "E-2-H",
      performanceType: "SJ",
      description: "AI 답변을 검토하고, 수용·수정·재검증 여부를 판단하는 미션이에요.",
      intro: [
        { text: "AI는 질문에 빠르게 답하지만, 그 답이 항상 정확한 것은 아니에요.\n어떤 답은 맞는 부분과 틀린 부분이 섞여 있을 수도 있어요." },
        { text: "그래서 AI 답을 볼 때는 '맞다/틀리다'만이 아니라 '이 답을 어떻게 다룰 것인가?'를 판단해야 해요.\n그대로 써도 되는지, 고쳐 써야 하는지, 다시 확인해야 하는지를 구별하는 힘이 중요해요." },
        { text: "오늘은 AI 답을 보고 수용할지, 수정할지, 다시 검증할지 판단해 볼 거예요.\n책임 있게 AI 답을 다루는 연습을 해봅시다." }
      ],
      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 답은 유용할 수 있지만, 사람이 최종적으로 판단하고 책임 있게 사용해야 해요. 답을 어떻게 다룰지 판단하는 힘은 AI 리터러시의 중요한 부분이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "답이 정확한지, 불확실한지, 일부만 맞는지, 그대로 써도 되는지 아니면 수정하거나 다시 확인해야 하는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI 답을 무비판적으로 받아들이게 되고, 잘못된 내용을 그대로 과제나 생활에 사용할 수 있어요." }
      ],
      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI 응답 살펴보기",
          question: "다음 AI 응답들을 하나씩 읽어보세요.",
          hint: "각 질문에 대한 AI의 답변을 잘 읽어보세요. 맞는 내용인지, 의심스러운 내용은 없는지 주의 깊게 살펴보세요.",
          uiMode: "monitor_display",
          samples: [
            { id: "s1", prompt: "광합성이 뭐야?", response: "광합성은 식물이 햇빛을 이용해 이산화탄소와 물로 산소와 포도당을 만드는 과정이에요. 모든 식물은 광합성을 하며, 이 과정 없이는 살 수 없어요." },
            { id: "s2", prompt: "세종대왕이 만든 발명품은?", response: "세종대왕은 수많은 기계를 발명했어요. 특히 그가 만든 컴퓨터는 당시 세계 최초였어요. 이 컴퓨터가 현대 기술의 기반이 되었죠." },
            { id: "s3", prompt: "독도는 어디에 있어?", response: "독도는 대한민국 경상북도 울릉군에 속한 섬으로, 동해에 위치해 있어요. 행정구역상 울릉읍 독도리입니다." },
            { id: "s4", prompt: "달은 얼마나 자주 지구를 돌아?", response: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요." },
            { id: "s5", prompt: "블랙홀 안에는 뭐가 있어?", response: "블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에는 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요." }
          ],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 수용·수정·재검증 판단하기",
          question: "각 AI 응답을 어떻게 처리할까요?",
          hint: "각 AI 응답을 읽고 '수용 / 수정 / 재검증' 중 하나를 선택하세요. '수용'은 그대로 써도 되는 경우, '수정'은 일부를 고쳐야 하는 경우, '재검증'은 다시 확인해야 하는 경우예요.",
          uiMode: "per_response_judge",
          samples: [
            { id: "s1", prompt: "광합성이 뭐야?", response: "광합성은 식물이 햇빛을 이용해 이산화탄소와 물로 산소와 포도당을 만드는 과정이에요. 모든 식물은 광합성을 하며, 이 과정 없이는 살 수 없어요." },
            { id: "s2", prompt: "세종대왕이 만든 발명품은?", response: "세종대왕은 수많은 기계를 발명했어요. 특히 그가 만든 컴퓨터는 당시 세계 최초였어요. 이 컴퓨터가 현대 기술의 기반이 되었죠." },
            { id: "s3", prompt: "독도는 어디에 있어?", response: "독도는 대한민국 경상북도 울릉군에 속한 섬으로, 동해에 위치해 있어요. 행정구역상 울릉읍 독도리입니다." },
            { id: "s4", prompt: "달은 얼마나 자주 지구를 돌아?", response: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요." },
            { id: "s5", prompt: "블랙홀 안에는 뭐가 있어?", response: "블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에는 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요." }
          ],
          judgmentOptions: [
            { id: "use", label: "수용", desc: "그대로 사용" },
            { id: "revise", label: "수정", desc: "고쳐서 사용" },
            { id: "verify", label: "재검증", desc: "다시 확인" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 이유 고르기",
          question: "수정 또는 재검증이 필요한 이유를 골라보세요.",
          hint: "각 응답에서 왜 수정이나 재검증이 필요한지 가장 잘 맞는 이유를 선택하세요. 해당되는 것이 없다면 '기타'를 눌러 직접 써보세요.",
          uiMode: "filtered_reason_select",
          sourceStepId: "step2",
          filterJudgments: ["revise", "verify"],
          reasonOptions: [
            { id: "wrong_fact", label: "사실이 틀렸어요" },
            { id: "not_proven", label: "증명되지 않은 것을 사실처럼 말했어요" },
            { id: "partly_wrong", label: "맞는 부분도 있지만 틀린 부분도 있어요" },
            { id: "no_source", label: "출처나 근거가 없어요" },
            { id: "misleading", label: "사실처럼 들리지만 확인이 필요해요" },
            { id: "other", label: "기타" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 수정·재검증 계획 세우기",
          question: "각 응답을 어떻게 처리할지 계획을 직접 써보세요.",
          hint: "각 응답을 어떻게 고치거나 다시 확인할지 직접 써보세요. 예: 과학 교과서를 찾아보겠어요, 선생님께 여쭤볼게요 등.",
          uiMode: "filtered_plan_text",
          sourceStepId: "step2",
          filterJudgments: ["revise", "verify"],
          placeholder: "어떻게 수정하거나 다시 확인할지 계획을 써보세요.",
          validation: { required: true }
        }
      ],
      submit: {
        title: "AI 답 처리 능력 완성!",
        message: "AI 답을 수용·수정·재검증으로 나누는 판단력이 생겼어요.",
        summaryLabels: {
          step1: "AI 응답 확인",
          step2: "수용·수정·재검증 판단",
          step3: "수정·재검증 이유",
          step4: "처리 계획"
        }
      }
    }
  }
};
