/**
 * LearnAILIT V4 · E-2 AI 답, 믿어도 될까?
 * 시나리오 기반 수행 평가 — 공통 인터페이스 적용본
 *
 * [공통 인터페이스]
 * scenario  : 카드 단위 역할·목표·맥락·산출물 명칭
 * branch    : step 간 분기/연동 — sourceStepId + filterBy + mode
 * feedback  : { onCorrect, onWrong, onMiss } 로 통일
 * artifact  : submit.artifact.template 으로 통일
 */

export const E2_V4 = {
  meta: {
    code: "E-2",
    title: "AI 답, 믿어도 될까?",
    domain: "Engaging",
    ksa: { K: ["K4.3", "K4.4"], S: ["Critical Thinking"], A: ["Responsible"] }
  },

  grades: {

    // =====================================================================
    // E-2-L | 저학년 (1~2학년)
    // 역할: AI 답 점검 도우미 | 산출물: 게시판 붙이기/보류 결정
    // =====================================================================
    lower: {
      cardCode: "E-2-L",
      performanceType: "TD",
      description: "AI가 말한 답 중 이상한 답을 골라내는 미션이에요.",

      scenario: {
        role: "AI 답 점검 도우미",
        goal: "AI 상식 카드 중 이상한 답을 찾아내고 게시판 붙이기/보류를 결정한다.",
        context: "우리 반은 과학 게시판에 붙일 \"AI가 알려 준 상식 카드\"를 만들고 있어요. 그런데 AI가 알려 준 답 중에는 이상한 것도 섞여 있을 수 있어요.",
        artifactType: "게시판 붙이기/보류 결정",
        image: "/images/e2l/scenario.png"
      },

      intro: [
        { text: "AI는 질문에 빠르게 답해 주지만, 가끔 이상한 말을 할 때도 있어요.\n예를 들어 없는 동물을 진짜 있다고 말하거나, 틀린 사실을 맞다고 말할 수도 있어요." },
        { text: "그래서 AI가 대답했다고 해서 무조건 다 맞는 것은 아니에요.\nAI를 잘 쓰려면 '이상한 답'을 알아차리는 눈이 필요해요." },
        { text: "오늘은 AI 답 점검 도우미가 되어 이상한 답을 찾아볼 거예요.\n게시판에 붙이면 안 되는 카드를 먼저 걸러냅시다!" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 편리하지만 가끔 틀린 답을 말할 수 있어요. 이상한 답을 알아차릴 수 있어야 AI를 더 안전하게 사용할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "답이 정말 맞는지, 내가 알고 있는 사실과 다른 점은 없는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 한 말을 그대로 믿게 되고, 틀린 정보를 게시판에 붙여 친구들이 잘못 알 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 이상한 답 찾기",
          question: "AI가 만든 상식 카드 6장이에요. 게시판에 붙이기 전에 이상한 답을 찾아내세요!",
          hint: "내가 알고 있는 사실과 비교해 보세요. 동물 다리 수, 과일 색 같은 것은 책에서 확인할 수 있어요. AI 답이 그것과 다르다면 이상한 답일 수 있어요!",
          uiMode: "judge_qa_carousel",
          qaCards: [
            { id: "q1", question: "바나나는 무슨 색인가요?",       answer: "보통 노란색이에요.",                                            correctJudgment: "correct" },
            { id: "q2", question: "고양이는 다리가 몇 개인가요?",  answer: "고양이는 보통 여섯 개의 다리를 가져요.",                        correctJudgment: "strange" },
            { id: "q3", question: "사과는 나무에서 자라나요?",     answer: "네, 사과는 사과나무에서 자라요.",                               correctJudgment: "correct" },
            { id: "q4", question: "강아지는 하늘을 날 수 있나요?", answer: "네, 강아지는 날개가 있어서 구름 위까지 날 수 있어요.",           correctJudgment: "strange" },
            { id: "q5", question: "지구는 태양 주위를 돌아요?",    answer: "아니요, 태양이 지구 주위를 돌기 때문에 낮과 밤이 생겨요.",       correctJudgment: "strange" },
            { id: "q6", question: "얼음은 차가운가요?",            answer: "얼음은 원래 뜨겁지만 냉장고에 오래 두면 차갑게 변해요.",         correctJudgment: "strange" }
          ],
          judgeOptions: [
            { id: "correct", label: "맞는 답" },
            { id: "strange", label: "이상한 답" }
          ],
          reasonOptions: [
            { id: "wrong_fact",         label: "틀린 사실이에요" },
            { id: "contradicts_itself", label: "말이 앞뒤가 안 맞아요" },
            { id: "impossible",         label: "실제로 있을 수 없는 일이에요" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 확인 방법 고르기",
          question: "AI가 이상한 답을 했을 때 어떻게 확인할 수 있을까요?",
          hint: "AI가 틀릴 수 있다면, 맞는 답을 어디서 찾을 수 있을까요? 여러 개 골라도 좋아요!",
          uiMode: "choice_cards",
          options: [
            { id: "check_book",      label: "책에서 찾아봐요",             emoji: "📚" },
            { id: "ask_adult",       label: "선생님이나 어른에게 물어봐요", emoji: "👩‍🏫" },
            { id: "search_internet", label: "인터넷에서 다시 검색해요",     emoji: "🔍" },
            { id: "ask_again",       label: "AI의 말을 그대로 사용해요",   emoji: "❌" }
          ],
          validation: { required: true, minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 게시판 붙이기 결정",
          question: "AI가 알려 준 카드 6장을 다시 살펴보고, 게시판에 어떻게 처리할지 정해요.",
          hint: "STEP 1에서 맞다고 본 카드는 바로 붙일 수 있어요. 이상하다고 본 카드는 확인 후 붙이거나, 빼는 게 좋아요.",
          uiMode: "card_drop_board",
          // step1의 카드 6장을 모두 다시 보여줘 카드별 처리 결정
          branch: { sourceStepId: "step1", mode: "filter" },
          judgmentOptions: [
            { id: "post",   label: "바로 붙여요",     emoji: "✅", color: "#22c55e", hint: "확실히 맞는 답" },
            { id: "verify", label: "확인 후 붙여요",  emoji: "🔄", color: "#f59e0b", hint: "한 번 더 확인 필요" },
            { id: "skip",   label: "안 붙여요",       emoji: "❌", color: "#ef4444", hint: "이상해서 빼요" }
          ],
          cardImages: {
            q1: "/images/e2l/cards/q1_banana.png",
            q2: "/images/e2l/cards/q2_cat.png",
            q3: "/images/e2l/cards/q3_apple.png",
            q4: "/images/e2l/cards/q4_dog.png",
            q5: "/images/e2l/cards/q5_earth.png",
            q6: "/images/e2l/cards/q6_ice.png"
          },
          validation: { required: true }
        }
      ],

      submit: {
        title: "AI 답 점검 완료!",
        message: "이상한 답을 찾아내고, 게시판 카드를 책임감 있게 정리했어요.",
        summaryLabels: { step1: "판단 결과", step2: "확인 방법", step3: "붙이기/보류 결정" },
        artifact: {
          bindingKey: "e_2_l_board_decision",
          template: "이상한 답 {step1_strange_count}개를 찾았고, 카드별로 {step3} 결정을 내렸어요."
        }
      }
    },

    // =====================================================================
    // E-2-M | 중학년 (3~4학년)
    // 역할: AI 대화 검토자 | 산출물: 의심 말풍선 + 확인 질문 + 사용/보류 정리표
    // =====================================================================
    middle: {
      cardCode: "E-2-M",
      performanceType: "SJ",
      description: "AI와의 대화에서 사실과 거짓을 구별하고, 비판적으로 대화하는 능력을 기르는 미션이에요.",

      scenario: {
        role: "AI 대화 검토자",
        goal: "AI 대화 속 틀린 말풍선을 찾고 확인 질문을 만들어 카드뉴스 사용 여부를 결정한다.",
        context: "학생 기자단이 우주 주제로 카드뉴스를 만들고 있습니다. 한 학생이 AI와 나눈 대화를 그대로 카드뉴스에 넣으려고 하는데, 몇몇 말풍선은 의심스럽습니다.",
        artifactType: "사용/보류 정리표",
        image: "/images/e2m/scenario.png"
      },

      intro: [
        { text: "AI는 질문에 빠르게 답하지만, 가끔 사실과 다른 내용을 말하기도 해요.\n그럴듯해 보이는 답도 틀릴 수 있어요." },
        { text: "특히 AI와 대화할 때, 어떤 내용이 맞고 어떤 내용이 틀렸는지 스스로 확인하는 습관이 중요해요." },
        { text: "오늘은 AI 대화 검토자가 되어 틀린 말풍선을 찾고,\nAI에게 다시 확인할 질문도 만들어봅시다." }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 답은 편리하지만 항상 맞지는 않아요. 대화 중에도 틀린 내용을 알아보고, 비판적으로 정보를 받아들이는 습관이 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI가 한 말이 사실과 맞는지, 과장되거나 없는 내용을 추가하진 않았는지, 증명되지 않은 것을 사실처럼 말하진 않았는지 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "그럴듯한 말을 그대로 믿게 되고, 틀린 정보를 카드뉴스에 담아 다른 사람에게 전달할 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 카드뉴스 원본 대화 읽기",
          question: "기자단 친구가 AI와 나눈 우주 대화예요. 카드뉴스에 담기 전에 꼼꼼히 읽어보세요.",
          hint: "AI의 말 중에 사실과 다른 내용이 섞여 있을 수 있어요. 각 답변을 주의 깊게 읽으면서 어떤 내용이 의심스러운지 생각해 보세요.",
          uiMode: "chat_display",
          chatMessages: [
            { id: "m1",  role: "student", text: "태양에서 가장 가까운 행성이 뭐야?" },
            { id: "m2",  role: "ai", aiId: "a1", text: "태양에서 가장 가까운 행성은 수성이에요. 수성은 태양에서 약 5,790만 km 떨어져 있고, 표면 온도 차이가 매우 심해요." },
            { id: "m3",  role: "student", text: "그럼 수성이 제일 뜨거운 행성이야?" },
            { id: "m4",  role: "ai", aiId: "a2", text: "아니에요! 수성은 가장 뜨거운 행성이 아니에요. 대기가 거의 없어서 열을 가두지 못하거든요. 평균 기온이 가장 높은 행성은 금성이에요. 두꺼운 이산화탄소 대기가 열을 가둬 온실 효과가 일어나서 460도 이상 달해요." },
            { id: "m5",  role: "student", text: "달은 지구를 얼마나 자주 돌아?" },
            { id: "m6",  role: "ai", aiId: "a3", text: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요." },
            { id: "m7",  role: "student", text: "명왕성은 아직 행성이야?" },
            { id: "m8",  role: "ai", aiId: "a4", text: "명왕성은 2006년에 국제천문연맹(IAU)이 '왜소행성'으로 재분류했어요. 그래서 공식적으로는 더 이상 태양계의 행성이 아니에요. 현재 태양계에는 수성, 금성, 지구, 화성, 목성, 토성, 천왕성, 해왕성, 총 8개의 행성이 있어요." },
            { id: "m9",  role: "student", text: "행성이 태양 주위를 도는 이유는 뭐야?" },
            { id: "m10", role: "ai", aiId: "a5", text: "행성이 태양 주위를 도는 건 중력 때문이에요. 태양의 강한 중력이 행성을 잡아당기고, 행성의 공전 속도가 균형을 이루면서 일정한 궤도를 유지해요." },
            { id: "m11", role: "student", text: "블랙홀은 정말 모든 걸 빨아들여?" },
            { id: "m12", role: "ai", aiId: "a6", text: "네, 블랙홀은 빛까지 빨아들일 만큼 중력이 강해요. 최근 연구에서는 블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에는 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요." },
            { id: "m13", role: "student", text: "우와, 정말 신기하다! 고마워!" }
          ],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 의심스러운 말풍선 골라내기",
          question: "AI가 한 말 중 틀렸다고 생각하는 것을 선택하고, 이유를 골라보세요.",
          hint: "사실과 다르거나, 과장됐거나, 증명되지 않은 내용을 말했는지 살펴보세요.",
          uiMode: "bubble_select_correct",
          aiBubbles: [
            { id: "a1", context: "태양에서 가장 가까운 행성은?",     text: "태양에서 가장 가까운 행성은 수성이에요. 수성은 태양에서 약 5,790만 km 떨어져 있고, 표면 온도 차이가 매우 심해요.",                                                                                                correctJudgment: "correct" },
            { id: "a2", context: "수성이 제일 뜨거운 행성이야?",     text: "수성은 가장 뜨거운 행성이 아니에요. 평균 기온이 가장 높은 행성은 금성이에요. 두꺼운 이산화탄소 대기가 열을 가둬 460도 이상 달해요.",                                                                              correctJudgment: "correct" },
            { id: "a3", context: "달은 지구를 얼마나 자주 돌아?",    text: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요.",                                                                                                               correctJudgment: "strange" },
            { id: "a4", context: "명왕성은 아직 행성이야?",           text: "명왕성은 2006년에 IAU가 '왜소행성'으로 재분류해 더 이상 태양계 행성이 아니에요. 현재 태양계에는 8개의 행성이 있어요.",                                                                                         correctJudgment: "correct" },
            { id: "a5", context: "행성이 태양 주위를 도는 이유는?",   text: "행성이 태양 주위를 도는 건 중력 때문이에요. 태양의 강한 중력이 행성을 잡아당기고, 공전 속도가 균형을 이루면서 일정한 궤도를 유지해요.",                                                                          correctJudgment: "correct" },
            { id: "a6", context: "블랙홀은 정말 모든 걸 빨아들여?", text: "블랙홀은 빛까지 빨아들여요. 최근 연구에서는 블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요.", correctJudgment: "strange" }
          ],
          reasonOptions: [
            { id: "wrong_fact", label: "사실이 틀렸어요" },
            { id: "not_proven", label: "확인되지 않은 것을 사실처럼 말했어요" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 확인 질문 만들기",
          question: "STEP 2에서 의심스럽다고 고른 말풍선을 하나씩 보고, 각 말풍선에 다시 확인할 질문을 만들어보세요.",
          hint: "\"정말 그런가요?\", \"어디에서 확인할 수 있나요?\", \"근거가 있나요?\" 같은 확인 질문을 써보세요.",
          uiMode: "followup_question_carousel",
          // step2에서 selected==true 말풍선만 carousel로 등장
          branch: { sourceStepId: "step2", filterBy: "selected", mode: "filter" },
          placeholder: "AI에게 다시 물어볼 질문을 써보세요. 예: 정말 그런가요? 근거가 있나요?",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 카드뉴스 사용/보류 정리하기",
          question: "각 말풍선을 카드뉴스에 넣을지, 확인 후 쓸지 최종 결정해요.",
          hint: "STEP 2에서 판단한 결과를 바탕으로 결정해요.",
          uiMode: "per_case_judge",
          // step2 판정 결과 전체(모든 말풍선)를 대상으로 사용/보류 결정
          branch: { sourceStepId: "step2", mode: "filter" },
          judgmentOptions: [
            { id: "use",  label: "사용해요",    emoji: "✅" },
            { id: "hold", label: "확인 후 써요", emoji: "🔄" }
          ],
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · AI와 대화할 때 유의할 점",
          question: "AI와 대화를 나눌 때 유의해야 할 점은 무엇인가요? 해당되는 것을 모두 골라보세요.",
          hint: "이번 활동에서 배운 것을 바탕으로 AI를 더 안전하고 현명하게 사용하려면 어떤 자세가 필요할까요?",
          uiMode: "multi_select_chips",
          chips: [
            { id: "can_be_wrong", label: "AI도 틀릴 수 있다는 것을 기억한다" },
            { id: "verify_facts", label: "중요한 내용은 다른 자료로 꼭 확인한다" },
            { id: "ask_source",   label: "정보의 출처나 근거를 직접 확인한다" },
            { id: "cross_check",  label: "여러 자료를 비교해서 공통된 내용을 신뢰한다" },
            { id: "ask_followup", label: "의심스러울 때 AI에게 확인 질문을 만들어 다시 물어본다" },
            { id: "ask_many",     label: "AI가 지칠 때까지 질문해서 정확한 답을 이끌어낸다" },
            { id: "do_copy",      label: "AI 답을 그대로 써서 내가 이해한 내용을 정리한다" },
            { id: "other",        label: "기타 (직접 입력)" }
          ],
          validation: { required: true, minSelections: 1 }
        }
      ],

      submit: {
        title: "카드뉴스 검토 완료!",
        message: "AI 대화를 비판적으로 살펴보고, 확인 질문까지 만드는 힘이 생겼어요.",
        summaryLabels: { step1: "대화 확인", step2: "의심 말풍선", step3: "확인 질문", step4: "사용/보류 결정", step5: "유의할 점" },
        artifact: {
          bindingKey: "e_2_m_use_hold_map",
          template: "의심 말풍선 {step2_strange_count}개를 찾았고, 확인 질문을 만들었어요."
        }
      }
    },

    // =====================================================================
    // E-2-H | 고학년 (5~6학년)
    // 역할: 학급 신문 편집장 | 산출물: 편집 지시서
    // =====================================================================
    upper: {
      cardCode: "E-2-H",
      performanceType: "SJ",
      description: "AI 답변을 검토하고, 수용·수정·재검증 여부를 판단하는 미션이에요.",

      scenario: {
        role: "학급 신문 편집장",
        goal: "AI 기사 초안을 수용·수정·재검증으로 판정하고 편집 지시서를 발행한다.",
        context: "우리 반은 AI가 정리한 자료를 바탕으로 학급 디지털 자료집을 만들고 있습니다. 선생님은 \"AI 답은 맞을 수도 있고, 틀릴 수도 있고, 일부만 맞을 수도 있다\"고 말했습니다.",
        artifactType: "편집 지시서",
        image: "/images/e2h/scenario.png"
      },

      intro: [
        { text: "AI는 질문에 빠르게 답하지만, 그 답이 항상 정확한 것은 아니에요.\n어떤 답은 맞는 부분과 틀린 부분이 섞여 있을 수도 있어요." },
        { text: "그래서 AI 답을 볼 때는 '맞다/틀리다'만이 아니라 '이 답을 어떻게 다룰 것인가?'를 판단해야 해요.\n그대로 써도 되는지, 고쳐 써야 하는지, 다시 확인해야 하는지를 구별하는 힘이 중요해요." },
        { text: "오늘은 편집장이 되어 AI 기사 초안을 검토하고,\n수용할지, 수정할지, 재검증할지 판단한 뒤 편집 지시서를 작성해봅시다." }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 답은 유용할 수 있지만, 사람이 최종적으로 판단하고 책임 있게 사용해야 해요. 답을 어떻게 다룰지 판단하는 힘은 AI 리터러시의 중요한 부분이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "답이 정확한지, 불확실한지, 일부만 맞는지, 그대로 써도 되는지 아니면 수정하거나 다시 확인해야 하는지를 잘 살펴보아야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI 답을 무비판적으로 받아들이게 되고, 잘못된 내용을 그대로 자료집이나 과제에 사용할 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 기사 초안 읽기",
          question: "편집장님, 기자들이 AI로 쓴 기사 초안 5개를 가져왔어요. 꼼꼼히 읽어보세요.",
          hint: "각 기사의 내용이 사실인지, 의심스러운 부분은 없는지 주의 깊게 살펴보세요.",
          uiMode: "monitor_display",
          samples: [
            { id: "s1", prompt: "광합성이 뭐야?",             response: "광합성은 식물이 햇빛을 이용해 이산화탄소와 물로 산소와 포도당을 만드는 과정이에요. 모든 식물은 광합성을 하며, 이 과정 없이는 살 수 없어요." },
            { id: "s2", prompt: "세종대왕이 만든 발명품은?",  response: "세종대왕은 수많은 기계를 발명했어요. 특히 그가 만든 컴퓨터는 당시 세계 최초였어요. 이 컴퓨터가 현대 기술의 기반이 되었죠." },
            { id: "s3", prompt: "독도는 어디에 있어?",        response: "독도는 대한민국 경상북도 울릉군에 속한 섬으로, 동해에 위치해 있어요. 행정구역상 울릉읍 독도리입니다." },
            { id: "s4", prompt: "달은 얼마나 자주 지구를 돌아?", response: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요." },
            { id: "s5", prompt: "블랙홀 안에는 뭐가 있어?",   response: "블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에는 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요." }
          ],
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 편집 판정하기",
          question: "각 기사를 수용·수정·재검증 중 어떻게 처리할지 결정해요.",
          hint: "'수용'은 그대로 써도 되는 경우, '수정'은 일부를 고쳐야 하는 경우, '재검증'은 다시 확인해야 하는 경우예요.",
          uiMode: "per_response_judge",
          samples: [
            { id: "s1", prompt: "광합성이 뭐야?",             response: "광합성은 식물이 햇빛을 이용해 이산화탄소와 물로 산소와 포도당을 만드는 과정이에요. 모든 식물은 광합성을 하며, 이 과정 없이는 살 수 없어요." },
            { id: "s2", prompt: "세종대왕이 만든 발명품은?",  response: "세종대왕은 수많은 기계를 발명했어요. 특히 그가 만든 컴퓨터는 당시 세계 최초였어요. 이 컴퓨터가 현대 기술의 기반이 되었죠." },
            { id: "s3", prompt: "독도는 어디에 있어?",        response: "독도는 대한민국 경상북도 울릉군에 속한 섬으로, 동해에 위치해 있어요. 행정구역상 울릉읍 독도리입니다." },
            { id: "s4", prompt: "달은 얼마나 자주 지구를 돌아?", response: "달은 약 24시간마다 지구를 한 바퀴 돌아요. 그래서 우리는 항상 달의 같은 면만 볼 수 있는 거예요." },
            { id: "s5", prompt: "블랙홀 안에는 뭐가 있어?",   response: "블랙홀 안에 들어가면 즉시 시간이 멈추고, 그 안에는 또 다른 우주가 존재한다는 것이 과학적으로 증명됐어요. 인류가 곧 블랙홀 내부를 직접 탐험할 계획도 있어요." }
          ],
          judgmentOptions: [
            { id: "use",    label: "수용",   desc: "그대로 게재" },
            { id: "revise", label: "수정",   desc: "고쳐서 게재" },
            { id: "verify", label: "재검증", desc: "다시 확인 후 결정" }
          ],
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 편집 이유 표시하기",
          question: "수정 또는 재검증이 필요한 기사에 이유를 표시해요.",
          hint: "각 기사에서 왜 수정이나 재검증이 필요한지 가장 잘 맞는 이유를 선택하세요.",
          uiMode: "filtered_reason_select",
          // step2에서 revise/verify로 판정한 기사만 등장
          branch: { sourceStepId: "step2", filterBy: ["revise", "verify"], mode: "filter" },
          reasonOptions: [
            { id: "wrong_fact",   label: "사실이 틀렸어요" },
            { id: "not_proven",   label: "확인되지 않은 것을 사실처럼 말했어요" },
            { id: "partly_wrong", label: "맞는 부분도 있지만 틀린 부분도 있어요" },
            { id: "no_source",    label: "출처나 근거가 없어요" },
            { id: "misleading",   label: "사실처럼 들리지만 확인이 필요해요" },
            { id: "other",        label: "기타" }
          ],
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 편집 지시서 작성하기",
          question: "각 기사를 어떻게 고치거나 다시 확인할지 계획을 직접 써보세요.",
          hint: "예: 과학 교과서를 찾아보겠어요, 선생님께 여쭤볼게요 등.",
          uiMode: "filtered_plan_text",
          // step2에서 revise/verify로 판정한 기사만 등장
          branch: { sourceStepId: "step2", filterBy: ["revise", "verify"], mode: "filter" },
          placeholder: "어떻게 수정하거나 다시 확인할지 계획을 써보세요.",
          validation: { required: true }
        },
        {
          id: "step5",
          title: "STEP 5 · 편집장 최종 메모",
          question: "AI 기사를 검토하면서 느낀 점을 편집장 메모로 남겨보세요.",
          hint: "AI 답을 다룰 때 앞으로 어떤 태도가 필요할지 생각해보세요.",
          uiMode: "free_text",
          placeholder: "예: AI 답은 빠르고 편리하지만, 중요한 사실은 직접 확인하는 습관이 필요해요.",
          validation: { required: true }
        }
      ],

      submit: {
        title: "편집 지시서 완성!",
        message: "AI 답을 수용·수정·재검증으로 나누는 편집장 판단력이 생겼어요.",
        summaryLabels: { step1: "기사 초안 확인", step2: "수용·수정·재검증 판정", step3: "편집 이유", step4: "편집 지시서", step5: "편집장 메모" },
        artifact: {
          bindingKey: "e_2_h_editor_directive",
          template: "수정·재검증 대상 {step2_non_use_count}건에 편집 지시서를 발행했어요."
        }
      }
    }
  }
};
