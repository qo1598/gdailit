/**
 * LearnAILIT V4 · D-4 사람을 돕는 AI 설계하기
 * 시나리오 기반 수행 평가 — Designing AI
 *
 * [Designing 핵심]: 사용자·공정성·안전을 고려해 AI 서비스를 처음부터 설계
 * 학생이 AI 설계자 관점에서 요구 분석 → 기능 설계 → 데이터 계획 → 공정성 검토까지 수행
 */

export const D4_V4_SCENARIO = {
  meta: {
    code: "D-4",
    title: "사람을 돕는 AI 설계하기",
    domain: "Designing"
  },

  grades: {

    // =====================================================================
    // D-4-L | 저학년 (1~2학년)
    // 역할: 우리 반 친구 돕기 기획자 | 산출물: AI 도우미 기획 카드
    // =====================================================================
    lower: {
      cardCode: "D-4-L",
      performanceType: "TD",
      ksa: { K: ["K2.1"], S: ["Self and Social Awareness"], A: ["Empathetic"] },
      description: "우리 반 친구를 도와줄 AI를 상상하고, 누구를 어떻게 도울지 기획하는 미션이에요.",

      scenario: {
        role: "우리 반 친구 돕기 기획자",
        goal: "우리 반에서 도움이 필요한 친구를 떠올리고, 그 친구를 도와줄 AI 도우미를 기획한다.",
        context: "우리 반에는 도움이 필요한 친구가 있어요. 안경을 자주 잃어버리는 친구, 급식 알레르기가 걱정인 친구, 집에서 혼자 공부하는 친구 등이요. 기획자로서 어떤 AI가 있으면 좋을지 상상하고 기획 카드를 만들어봐요.",
        artifactType: "AI 도우미 기획 카드"
      },

      intro: [
        { text: "우리 반 친구를 도와줄 AI를 만들어봐요!\n어떤 도움이 필요할까요?", emoji: "🤝" },
        { text: "AI를 만들려면 먼저\n'누구를 어떻게 도울지' 생각해야 해요.", emoji: "🤔" },
        { text: "기획자로서\nAI 도우미 기획 카드를 만들어봅시다!", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 만드는 사람이 '누구를 도울지' 정하기 때문에, 설계자의 생각이 AI에 담겨요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "도움이 필요한 사람의 마음을 이해하고, 어떤 AI가 진짜 도움이 될지 생각해야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "사용하는 사람이 원하지 않는 AI를 만들게 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 도움이 필요한 친구 고르기",
          question: "어떤 친구를 도와줄 AI를 만들까요?",
          hint: "주변에서 도움이 필요한 상황을 떠올려보세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "lost_things",   label: "물건을 자주 잃어버리는 친구", emoji: "🔍" },
            { id: "allergy",       label: "음식 알레르기가 있는 친구",   emoji: "🍽️" },
            { id: "lonely",        label: "혼자 공부하는 친구",          emoji: "📚" },
            { id: "new_student",   label: "전학 와서 낯선 친구",        emoji: "🏫" },
            { id: "disability",    label: "눈이 잘 안 보이는 친구",     emoji: "👓" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · AI 도우미가 할 일 정하기",
          question: "이 친구를 위해 AI가 어떤 일을 해주면 좋을까요?",
          hint: "친구가 불편한 점을 떠올리고, AI가 어떻게 도와줄 수 있을지 생각해보세요.",
          uiMode: "multi_select_chips",
          branch: { sourceStepId: "step1", mode: "highlight" },
          chips: [
            { id: "remind",      label: "잊지 않게 알려주기" },
            { id: "find",        label: "물건이나 정보 찾아주기" },
            { id: "read_aloud",  label: "글을 읽어주기" },
            { id: "translate",   label: "다른 나라 말을 번역해주기" },
            { id: "check_safe",  label: "안전한지 확인해주기" },
            { id: "study_help",  label: "공부 도와주기" },
            { id: "friend_match",label: "친구 찾아주기" }
          ],
          validation: { required: true, minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · AI 도우미 이름과 설명 짓기",
          question: "내가 기획한 AI 도우미의 이름을 짓고, 한 문장으로 소개해보세요.",
          hint: "예: '잃지마! AI' — 물건을 잃어버리면 어디 있는지 알려주는 AI예요.",
          uiMode: "free_text",
          placeholder: "예: '잃지마! AI' — 물건을 잃어버리면 마지막으로 본 곳을 알려주는 AI예요.",
          validation: { required: true, minLength: 15 }
        },
        {
          id: "step4",
          title: "STEP 4 · 이 AI가 모두에게 좋을까?",
          question: "내가 기획한 AI가 혹시 다른 친구에게는 불편할 수 있을까요?",
          hint: "AI가 특정 친구만 도와주면 다른 친구가 소외될 수 있어요. 모두에게 좋은 AI인지 생각해보세요.",
          uiMode: "free_text",
          placeholder: "예: 눈이 잘 안 보이는 친구만 도와주면, 귀가 안 좋은 친구는 못 쓸 수도 있어요. 글자 크게 + 소리로 모두 알려주면 좋겠어요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "사용자의 필요를 파악하고 AI 기능을 기획했는가" },
          { id: "empathy",    label: "공감·배려", description: "도움이 필요한 사람의 관점에서 생각했는가" },
          { id: "fairness",   label: "공정성 인식", description: "다른 사용자에게 미칠 영향을 고려했는가" }
        ]
      },

      submit: {
        title: "AI 도우미 기획 카드 완성!",
        message: "친구를 도와줄 AI를 상상하고 기획했어요.",
        summaryLabels: { step1: "도울 친구", step2: "AI 기능", step3: "AI 이름·소개", step4: "모두를 위한 고려" },
        artifact: {
          bindingKey: "d_4_l_plan",
          template: "[{step3}]\n도울 친구: {step1}\n할 일: {step2}\n모두를 위한 고려: {step4}"
        }
      }
    },

    // =====================================================================
    // D-4-M | 중학년 (3~4학년)
    // 역할: 학교 도움 AI 설계자 | 산출물: AI 서비스 설계서
    // =====================================================================
    middle: {
      cardCode: "D-4-M",
      performanceType: "DS",
      ksa: { K: ["K2.1", "K2.2"], S: ["Problem Solving"], A: ["Innovative"] },
      description: "학교에서 필요한 AI 서비스를 기획하고, 필요한 기능과 데이터를 설계하는 미션이에요.",

      scenario: {
        role: "학교 도움 AI 설계자",
        goal: "학교에서 필요한 AI 서비스를 기획하고, 기능·데이터·사용 흐름을 설계한다.",
        context: "학교에서 학생들을 도와줄 AI 서비스를 만들기로 했어요. 설계자로서 '어떤 문제를 풀 것인지', '어떤 데이터가 필요한지', '사용자가 어떻게 쓸 것인지' 설계해야 해요.",
        artifactType: "AI 서비스 설계서"
      },

      intro: [
        { text: "학교에서 필요한 AI 서비스를 만들어요!\n먼저 설계부터 해야 해요.", emoji: "🏫" },
        { text: "좋은 AI는 '무엇을 풀 것인가'부터 시작해요.\n기술보다 문제가 먼저예요.", emoji: "💡" },
        { text: "설계자로서 문제 정의 → 기능 설계 → 데이터 계획\n순서로 진행합니다!", emoji: "📐" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 만들기 전에 '어떤 문제를 푸는 AI인지' 명확히 해야 쓸모 있는 AI가 돼요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "사용자가 누구인지, 어떤 데이터가 필요한지, AI가 못하는 것은 무엇인지 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "아무도 쓰지 않는 AI를 만들거나, 필요한 데이터 없이 잘못 작동하는 AI가 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 해결할 문제 정의",
          question: "학교에서 AI가 풀면 좋을 문제를 고르세요.",
          hint: "학생, 교사, 학부모 중 누구의 어떤 불편을 해결할지 생각하세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "library",     label: "도서관 책 추천",           emoji: "📚" },
            { id: "schedule",    label: "시간표·준비물 안내",       emoji: "📅" },
            { id: "translation", label: "다문화 학생 번역 지원",   emoji: "🌍" },
            { id: "learning",    label: "개인별 학습 도우미",       emoji: "🎓" },
            { id: "safety",      label: "등하교 안전 알림",         emoji: "🚸" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 사용자와 기능 설계",
          question: "이 AI를 누가 쓰고, 어떤 기능이 필요한지 설계하세요.",
          hint: "사용자, 핵심 기능 3가지, AI가 하면 안 되는 것을 정리하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "user",         text: "주 사용자는 누구인가?" },
            { id: "function_1",   text: "[기능 1] 핵심 기능" },
            { id: "function_2",   text: "[기능 2] 보조 기능" },
            { id: "function_3",   text: "[기능 3] 편의 기능" },
            { id: "not_do",       text: "이 AI가 하면 안 되는 것" }
          ],
          placeholders: [
            "예: 3~6학년 학생",
            "예: 내가 읽은 책과 비슷한 책을 추천해준다",
            "예: 읽기 어려운 책은 쉬운 요약을 보여준다",
            "예: 친구가 읽은 책 목록을 비교해서 함께 읽을 책을 알려준다",
            "예: 학생의 독서 기록을 다른 사람에게 공유하면 안 된다"
          ],
          validation: { required: true, minAnswered: 5 }
        },
        {
          id: "step3",
          title: "STEP 3 · 데이터 계획",
          question: "이 AI가 잘 작동하려면 어떤 데이터가 필요할까요?",
          hint: "AI가 배워야 할 데이터, 사용자에게 받을 데이터, 수집하면 안 되는 데이터를 구분하세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "train_data",   text: "AI가 배워야 할 데이터 (훈련 데이터)" },
            { id: "user_data",    text: "사용자에게 받을 데이터 (입력)" },
            { id: "no_collect",   text: "절대 수집하면 안 되는 데이터" }
          ],
          placeholders: [
            "예: 수천 권의 책 목록, 장르, 줄거리, 추천 연령, 인기도",
            "예: 학생이 읽은 책 목록, 좋아하는 장르, 읽기 수준",
            "예: 학생 이름, 주소, 성적"
          ],
          validation: { required: true, minAnswered: 3 }
        },
        {
          id: "step4",
          title: "STEP 4 · 사용 흐름 설계",
          question: "학생이 이 AI를 어떻게 쓰는지 3단계로 설명해보세요.",
          hint: "'시작 → 사용 → 결과' 순서로 쓰세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "flow_start",  text: "[1단계] 시작 — 학생이 처음에 무엇을 하는가" },
            { id: "flow_use",    text: "[2단계] 사용 — AI가 어떻게 반응하는가" },
            { id: "flow_result", text: "[3단계] 결과 — 학생이 얻는 것" }
          ],
          placeholders: [
            "예: 학생이 앱을 열고 '최근 읽은 책'을 선택한다.",
            "예: AI가 비슷한 장르·수준의 책 3권을 추천하고 이유를 알려준다.",
            "예: 학생이 마음에 드는 책을 골라 '읽을 책 목록'에 추가한다."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성",   description: "문제 정의가 명확하고 기능이 체계적인가" },
          { id: "data_plan",  label: "데이터 계획", description: "필요한 데이터와 수집 금지 데이터를 구분했는가" },
          { id: "empathy",    label: "공감·배려",   description: "사용자의 필요를 반영한 설계인가" },
          { id: "connection", label: "AI 연결",     description: "AI의 작동에 데이터가 필요하다는 것을 이해했는가" }
        ]
      },

      submit: {
        title: "AI 서비스 설계서 완성!",
        message: "학교에 필요한 AI를 문제 정의부터 사용 흐름까지 설계했어요.",
        summaryLabels: { step1: "해결할 문제", step2: "사용자·기능", step3: "데이터 계획", step4: "사용 흐름" },
        artifact: {
          bindingKey: "d_4_m_design",
          template: "[문제] {step1}\n[사용자] {step2_user}\n[기능 1] {step2_function_1}\n[기능 2] {step2_function_2}\n[금지] {step2_not_do}\n[사용 흐름]\n1. {step4_flow_start}\n2. {step4_flow_use}\n3. {step4_flow_result}"
        }
      }
    },

    // =====================================================================
    // D-4-H | 고학년 (5~6학년)
    // 역할: 접근성 AI 서비스 설계자 | 산출물: AI 설계 명세서 (접근성·공정성·안전 포함)
    // =====================================================================
    upper: {
      cardCode: "D-4-H",
      performanceType: "DS",
      ksa: { K: ["K2.1", "K2.2", "K3.2", "K5.2"], S: ["Problem Solving", "Communication"], A: ["Innovative"] },
      description: "접근성·공정성·안전을 모두 고려한 AI 서비스를 처음부터 설계하는 미션이에요.",

      scenario: {
        role: "접근성 AI 서비스 설계자",
        goal: "다양한 사용자의 접근성·공정성·안전을 고려한 AI 서비스 설계 명세서를 완성한다.",
        context: "학교에서 모든 학생이 쓸 수 있는 AI 학습 도우미를 만들려고 해요. 설계자로서 장애가 있는 학생, 다문화 학생, 저학년 학생까지 모두 접근 가능하고 공정하며 안전한 AI를 설계해야 해요. 또한 이 AI에 대한 규제와 감독 체계도 함께 제안해야 해요.",
        artifactType: "AI 설계 명세서 (접근성·공정성·안전 포함)"
      },

      intro: [
        { text: "모든 학생이 쓸 수 있는 AI를 설계해요!\n한 명도 소외되면 안 돼요.", emoji: "🌈" },
        { text: "좋은 AI는 빠른 AI가 아니라\n공정하고 안전한 AI예요.", emoji: "⚖️" },
        { text: "설계 → 접근성 → 공정성 → 안전 → 규제\n모든 측면을 고려합니다.", emoji: "📐" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 설계자의 선택이 누가 AI를 쓸 수 있고 누가 못 쓰는지를 결정해요. 설계 단계에서 공정성을 고려하지 않으면 나중에 바꾸기 매우 어려워요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "다양한 사용자의 필요, 데이터 편향 가능성, 개인정보 보호, 그리고 감독·규제 체계를 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "일부 학생만 쓸 수 있거나, 편향된 학습 지원을 하거나, 개인정보가 유출되는 AI가 될 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 사용자 다양성 분석",
          question: "이 AI를 쓸 다양한 학생들의 특성과 필요를 분석하세요.",
          hint: "일반 학생뿐 아니라 특수한 필요가 있는 학생도 생각하세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "user_general",    text: "[일반 학생] 어떤 도움이 필요한가" },
            { id: "user_disability", text: "[장애 학생] 시각·청각·지체 장애 학생은 어떻게 쓸 수 있는가" },
            { id: "user_multicul",   text: "[다문화 학생] 한국어가 어려운 학생은 어떻게 쓸 수 있는가" },
            { id: "user_young",      text: "[저학년 학생] 1~2학년이 쓸 수 있는가" }
          ],
          placeholders: [
            "예: 모르는 개념을 쉽게 설명해주고, 맞춤 문제를 내주는 도움이 필요해요.",
            "예: 시각 장애 학생은 화면 읽기(TTS) 기능, 청각 장애 학생은 자막이 필요해요.",
            "예: 다국어 지원이나 쉬운 한국어 모드가 필요해요.",
            "예: 그림 중심 UI, 음성 입력, 큰 버튼이 필요해요."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · 기능 및 데이터 설계",
          question: "AI의 핵심 기능과 필요한 데이터를 설계하세요.",
          hint: "기능은 '무엇을 하는가', 데이터는 '무엇을 알아야 하는가'를 정리하세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "core_functions",  text: "핵심 기능 3가지" },
            { id: "accessibility",   text: "접근성 기능 (장애·다문화·저학년 대응)" },
            { id: "training_data",   text: "AI가 학습해야 할 데이터" },
            { id: "user_input",      text: "사용자로부터 받을 데이터" },
            { id: "prohibited_data", text: "수집하면 안 되는 데이터" }
          ],
          placeholders: [
            "예: 1) 학습 수준 진단, 2) 맞춤 설명 제공, 3) 연습 문제 추천",
            "예: TTS 읽기 기능, 다국어 지원, 큰 글씨 모드, 음성 입력",
            "예: 교과서 내용, 학년별 학습 수준, 문제 유형별 난이도",
            "예: 현재 학년, 선호하는 설명 방식, 학습 진도",
            "예: 학생 이름, 가정 환경, 성적 원점수, 건강 정보"
          ],
          validation: { required: true, minAnswered: 5 }
        },
        {
          id: "step3",
          title: "STEP 3 · 공정성·편향 검토",
          question: "이 AI가 공정하지 않을 수 있는 상황을 검토하세요.",
          hint: "특정 학년·성별·문화에 유리하거나 불리한 점이 없는지 점검하세요.",
          uiMode: "per_case_judge",
          cases: [
            { id: "gender_bias",   title: "성별 편향",     description: "AI가 '여자는 문학, 남자는 과학' 같은 고정관념을 학습했다면?" },
            { id: "culture_bias",  title: "문화 편향",     description: "한국 문화 사례만 학습해서 다문화 학생의 배경을 이해 못 한다면?" },
            { id: "level_bias",    title: "수준 편향",     description: "평균 수준 학생만 잘 도와주고, 너무 쉬운/어려운 수준은 대응 못 한다면?" },
            { id: "access_bias",   title: "접근성 편향",   description: "마우스·키보드만 쓸 수 있어서 지체 장애 학생이 못 쓴다면?" }
          ],
          judgmentOptions: [
            { id: "critical",   label: "심각한 문제" },
            { id: "fixable",    label: "개선 가능" },
            { id: "minor",      label: "사소한 문제" }
          ],
          allowText: true,
          textPlaceholder: "이 문제를 어떻게 해결할 수 있는지 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 안전 및 규제 체계 설계",
          question: "이 AI를 안전하게 운영하려면 어떤 규칙과 감독이 필요할까요?",
          hint: "개인정보 보호, 오류 발생 시 대응, 정기 점검, 책임 소재를 생각하세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "privacy_rules",  text: "[개인정보] 학생 데이터 보호 규칙" },
            { id: "error_handling", text: "[오류 대응] AI가 잘못된 정보를 줬을 때 처리 방법" },
            { id: "monitoring",     text: "[감독] 누가, 얼마나 자주 이 AI를 점검할 것인가" },
            { id: "responsibility", text: "[책임] AI의 판단으로 문제가 생겼을 때 누가 책임지는가" }
          ],
          placeholders: [
            "예: 학생 데이터는 학교 서버에만 저장, 학기 끝나면 삭제, 외부 유출 금지.",
            "예: 학생이 '이 답이 이상해요' 신고 버튼 → 교사에게 알림 → 교사가 확인 후 수정.",
            "예: 월 1회 교사가 AI 추천 결과 샘플 점검, 학기 1회 외부 전문가 감사.",
            "예: AI의 추천은 참고 자료일 뿐, 최종 학습 판단은 교사와 학생이 한다."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step5",
          title: "STEP 5 · 설계 철학 정리",
          question: "설계자로서 '좋은 AI란 무엇인가'를 한 문단으로 정리하세요.",
          hint: "접근성·공정성·안전·규제를 모두 아우르는 설계 철학을 써보세요.",
          uiMode: "free_text",
          placeholder: "예: 좋은 AI는 빠른 AI가 아니라, 모든 사람이 쓸 수 있고, 편향 없이 공정하며, 문제가 생겨도 바로잡을 수 있는 AI이다. 설계자는 기술뿐 아니라 사용자와 사회에 대한 책임을 함께 져야 한다.",
          validation: { required: true, minLength: 80 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성",   description: "사용자 다양성을 반영한 체계적 설계인가" },
          { id: "data_plan",  label: "데이터 계획", description: "훈련 데이터와 수집 금지 데이터를 구분했는가" },
          { id: "fairness",   label: "공정성 인식", description: "편향을 체계적으로 검토하고 대응책을 제시했는가" },
          { id: "safety",     label: "안전·규제",   description: "안전 규칙과 감독 체계를 구체적으로 설계했는가" },
          { id: "connection", label: "AI 연결",     description: "설계자의 선택이 AI에 반영됨을 이해하고 설계 철학을 표현했는가" }
        ]
      },

      submit: {
        title: "AI 설계 명세서 완성!",
        message: "접근성·공정성·안전을 모두 고려한 AI 설계를 완료했어요.",
        summaryLabels: { step1: "사용자 분석", step2: "기능·데이터", step3: "공정성 검토", step4: "안전·규제", step5: "설계 철학" },
        artifact: {
          bindingKey: "d_4_h_spec",
          template: "[설계 철학]\n{step5}\n\n[핵심 기능] {step2_core_functions}\n[접근성] {step2_accessibility}\n[안전·규제]\n개인정보: {step4_privacy_rules}\n감독: {step4_monitoring}\n책임: {step4_responsibility}"
        }
      }
    }
  }
};
