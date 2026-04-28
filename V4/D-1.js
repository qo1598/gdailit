/**
 * LearnAILIT V4 · D-1 끼리끼리 분류 놀이
 * 시나리오 기반 수행 평가 — Designing AI
 *
 * [Designing 핵심]: AI가 어떻게 작동하는지 이해하기 위해
 * 데이터 분류·라벨링을 직접 체험하고, 분류 규칙이
 * AI 결과에 미치는 영향을 탐색한다.
 *
 * [다른 영역과의 구분]
 * E = AI 결과를 평가 / C = AI와 창작 / M = AI에게 위임 판단
 * D = AI가 "어떻게 배우는지" 직접 설계·실험 (AI 제작자 관점)
 */

export const D1_V4_SCENARIO = {
  meta: {
    code: "D-1",
    title: "끼리끼리 분류 놀이",
    domain: "Designing"
  },

  grades: {

    // =====================================================================
    // D-1-L | 저학년 (1~2학년)
    // 역할: 동물 카드 분류 탐험가 | 산출물: 분류 규칙 카드
    // =====================================================================
    lower: {
      cardCode: "D-1-L",
      performanceType: "TD",
      ksa: { K: ["K1.2"], S: ["Computational Thinking"], A: ["Curious"] },
      description: "카드를 같은 특징끼리 묶어보고, 왜 그렇게 나눴는지 규칙을 만드는 미션이에요.",

      scenario: {
        role: "동물 카드 분류 탐험가",
        goal: "동물 카드를 특징별로 분류하고, 내가 만든 분류 규칙을 설명한다.",
        context: "과학 시간에 동물 카드를 정리하려고 해요. 같은 특징을 가진 동물끼리 묶으면 찾기도 쉽고, AI도 이렇게 분류를 배운대요! 탐험가로서 나만의 분류 규칙을 만들어봐요.",
        artifactType: "분류 규칙 카드"
      },

      intro: [
        { text: "동물 카드를 같은 특징끼리 묶어볼 거예요!\n사실 AI도 이렇게 분류를 배운답니다.", emoji: "🐾" },
        { text: "어떤 기준으로 나누느냐에 따라\n결과가 완전히 달라져요.", emoji: "🤔" },
        { text: "탐험가로서 나만의 분류 규칙을 만들고\nAI가 배우는 방식을 경험해봅시다!", emoji: "🔬" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 배우는 첫 번째 단계가 바로 분류예요. 분류 규칙을 직접 만들어보면 AI가 어떻게 배우는지 알 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "같은 카드도 어떤 기준으로 나누느냐에 따라 결과가 달라지는 점을 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "기준 없이 분류하면 엉뚱한 것이 같은 묶음에 들어가서 찾기 어려워져요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 동물 카드 분류하기",
          question: "동물 카드를 특징별로 나눠보세요. 기준은 내가 정해요!",
          hint: "사는 곳(물/땅/하늘), 다리 수(2개/4개/없음), 크기(크다/작다) 등 여러 기준이 있어요.",
          uiMode: "classify_cards_carousel",
          groups: [
            { id: "group_a", label: "묶음 A" },
            { id: "group_b", label: "묶음 B" },
            { id: "group_c", label: "묶음 C" }
          ],
          cards: [
            { id: "dog",       label: "강아지",   emoji: "🐶" },
            { id: "goldfish",  label: "금붕어",   emoji: "🐟" },
            { id: "eagle",     label: "독수리",   emoji: "🦅" },
            { id: "cat",       label: "고양이",   emoji: "🐱" },
            { id: "whale",     label: "고래",     emoji: "🐋" },
            { id: "sparrow",   label: "참새",     emoji: "🐦" },
            { id: "turtle",    label: "거북이",   emoji: "🐢" },
            { id: "ant",       label: "개미",     emoji: "🐜" }
          ],
          validation: { required: true, allRequired: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 내 규칙 설명하기",
          question: "왜 이렇게 나눴나요? 어떤 기준(규칙)으로 분류했는지 써보세요.",
          hint: "예: '사는 곳으로 나눴어요. 묶음 A는 땅, 묶음 B는 물, 묶음 C는 하늘'",
          uiMode: "free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          placeholder: "예: 사는 곳으로 나눴어요. A는 땅, B는 물, C는 하늘에 사는 동물이에요.",
          validation: { required: true, minLength: 15 }
        },
        {
          id: "step3",
          title: "STEP 3 · 새 카드 분류하기",
          question: "새로운 동물이 나타났어요! 내 규칙대로라면 어디에 넣어야 할까요?",
          hint: "step2에서 만든 규칙을 적용해보세요.",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step2", mode: "highlight" },
          cases: [
            { id: "penguin",   title: "펭귄 🐧",     description: "날지 못하는 새. 바다에서 수영을 잘해요." },
            { id: "frog",      title: "개구리 🐸",   description: "물과 땅 모두에서 살아요." },
            { id: "bat",       title: "박쥐 🦇",     description: "하늘을 날지만 새가 아니라 포유류예요." }
          ],
          judgmentOptions: [
            { id: "group_a", label: "묶음 A" },
            { id: "group_b", label: "묶음 B" },
            { id: "group_c", label: "묶음 C" },
            { id: "hard",    label: "넣기 어려워요" }
          ],
          allowText: true,
          textPlaceholder: "왜 그 묶음에 넣었는지, 또는 왜 넣기 어려운지 써보세요.",
          validation: { required: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 규칙의 한계 발견하기",
          question: "넣기 어려운 동물이 있었나요? 내 규칙을 고치면 더 잘 분류할 수 있을까요?",
          hint: "펭귄은 새인데 날지 못하고, 개구리는 물과 땅 모두에 살아요. 규칙이 완벽하지 않을 수 있어요!",
          uiMode: "free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          placeholder: "예: 펭귄은 새인데 물에서도 살아서 넣기 어려웠어요. '주로 사는 곳'으로 규칙을 고치면 좋겠어요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "데이터를 일관된 기준으로 분류했는가" },
          { id: "test",       label: "실험·검증", description: "새 데이터에 규칙을 적용하고 결과를 확인했는가" },
          { id: "reflection", label: "성찰·개선", description: "규칙의 한계를 발견하고 개선 방향을 제시했는가" }
        ]
      },

      submit: {
        title: "분류 규칙 카드 완성!",
        message: "나만의 분류 규칙을 만들고, AI가 배우는 방식을 경험했어요.",
        summaryLabels: { step1: "분류 결과", step2: "분류 규칙", step3: "새 카드 분류", step4: "규칙 한계·개선" },
        artifact: {
          bindingKey: "d_1_l_classify",
          template: "[분류 규칙] {step2}\n[한계 발견] {step4}"
        }
      }
    },

    // =====================================================================
    // D-1-M | 중학년 (3~4학년)
    // 역할: 박물관 유물 분류 연구원 | 산출물: 분류 체계 보고서
    // =====================================================================
    middle: {
      cardCode: "D-1-M",
      performanceType: "DS",
      ksa: { K: ["K1.1", "K1.2"], S: ["Computational Thinking"], A: ["Curious"] },
      description: "데이터의 특징을 분석해 분류 규칙을 만들고, 규칙의 정확도를 테스트하는 미션이에요.",

      scenario: {
        role: "박물관 유물 분류 연구원",
        goal: "유물 데이터를 분석해 분류 규칙을 만들고, 새 유물로 규칙의 정확도를 테스트한다.",
        context: "박물관에 새로운 유물이 많이 들어왔어요. 연구원으로서 유물의 특징(시대, 재질, 용도)을 보고 분류 체계를 만들어야 해요. AI도 이런 식으로 데이터를 분류하는 규칙을 배운답니다.",
        artifactType: "분류 체계 보고서"
      },

      intro: [
        { text: "박물관에 유물이 잔뜩 들어왔어요!\n연구원으로서 분류 체계를 만들어야 해요.", emoji: "🏛️" },
        { text: "유물의 특징을 보고 규칙을 만들면\nAI도 이렇게 분류를 배우는 거예요.", emoji: "🤖" },
        { text: "규칙을 만들고 → 새 유물로 테스트 → 규칙 수정\n이 과정이 AI 학습의 핵심이에요!", emoji: "🔁" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 데이터에서 패턴을 찾아 규칙을 만드는 과정을 직접 경험할 수 있어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 특징이 분류에 가장 유용한지, 규칙이 새 데이터에도 잘 맞는지 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "규칙이 훈련 데이터에만 맞고 새 데이터에서 틀리는 '과적합' 문제가 생겨요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 유물 특징 분석",
          question: "유물 카드를 보고 분류에 쓸 수 있는 특징을 골라보세요.",
          hint: "시대, 재질(돌/금속/나무/종이), 용도(도구/장식/기록), 크기 등을 생각해보세요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "era",       label: "시대 (고대/중세/근대)" },
            { id: "material",  label: "재질 (돌/금속/나무/종이)" },
            { id: "purpose",   label: "용도 (도구/장식/기록/무기)" },
            { id: "size",      label: "크기 (크다/보통/작다)" },
            { id: "origin",    label: "출토 지역 (한국/중국/일본)" },
            { id: "condition", label: "상태 (완전/파손)" }
          ],
          validation: { required: true, minSelections: 2 }
        },
        {
          id: "step2",
          title: "STEP 2 · 분류 규칙 만들기",
          question: "선택한 특징으로 분류 규칙을 만들어보세요. 'IF ~이면 → ~이다' 형식으로요.",
          hint: "예: 'IF 재질이 돌이고 용도가 도구이면 → 석기시대 도구로 분류'",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "rule_1", text: "[규칙 1] IF ___이면 → ___로 분류한다" },
            { id: "rule_2", text: "[규칙 2] IF ___이면 → ___로 분류한다" },
            { id: "rule_3", text: "[규칙 3] (선택) IF ___이면 → ___로 분류한다" }
          ],
          placeholders: [
            "예: IF 재질이 돌이고 크기가 작으면 → 석기시대 도구로 분류",
            "예: IF 재질이 금속이고 용도가 장식이면 → 장신구로 분류",
            ""
          ],
          validation: { required: true, minAnswered: 2 }
        },
        {
          id: "step3",
          title: "STEP 3 · 새 유물로 규칙 테스트",
          question: "새로운 유물이 발견됐어요! 내 규칙으로 분류해보세요.",
          hint: "규칙대로 분류하되, 규칙이 안 맞는 경우도 솔직하게 표시하세요.",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step2", mode: "highlight" },
          cases: [
            { id: "artifact_1", title: "청동 거울",     description: "재질: 금속(청동). 용도: 장식/의례. 크기: 작음. 시대: 삼국시대." },
            { id: "artifact_2", title: "나무 빗",       description: "재질: 나무. 용도: 도구(생활). 크기: 작음. 시대: 고려시대." },
            { id: "artifact_3", title: "돌 화살촉",     description: "재질: 돌. 용도: 무기. 크기: 매우 작음. 시대: 선사시대." },
            { id: "artifact_4", title: "종이 두루마리", description: "재질: 종이. 용도: 기록. 크기: 큼. 시대: 조선시대." }
          ],
          judgmentOptions: [
            { id: "match",     label: "규칙대로 분류 가능" },
            { id: "partial",   label: "일부만 맞음" },
            { id: "not_match", label: "규칙으로 분류 안 됨" }
          ],
          allowText: true,
          textPlaceholder: "어떤 규칙을 적용했는지, 또는 왜 안 맞는지 써보세요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step4",
          title: "STEP 4 · 규칙 수정하기",
          question: "테스트 결과를 보고 규칙을 수정하세요. 안 맞았던 부분을 어떻게 고치면 될까요?",
          hint: "규칙이 너무 단순하면 예외가 많고, 너무 복잡하면 쓰기 어려워요. 균형을 찾아보세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          questions: [
            { id: "problem",  text: "안 맞았던 유물과 이유" },
            { id: "fix",      text: "규칙을 어떻게 수정할지" },
            { id: "insight",  text: "이 경험으로 AI 학습에 대해 알게 된 점" }
          ],
          placeholders: [
            "예: 청동 거울은 '장식'이면서 '의례'에도 쓰여서 하나로 분류가 어려웠어요.",
            "예: '주된 용도'를 기준으로 하고, 부가 용도는 따로 표시하는 규칙으로 바꾸면 좋겠어요.",
            "예: AI도 처음 만든 규칙이 완벽하지 않아서 새 데이터를 보고 계속 수정하는 것 같아요."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "분류에 유의미한 특징을 선택하고 일관된 규칙을 만들었는가" },
          { id: "test",       label: "실험·검증", description: "새 데이터에 규칙을 적용하고 정확도를 판단했는가" },
          { id: "iteration",  label: "반복·개선", description: "테스트 결과를 바탕으로 규칙을 수정했는가" },
          { id: "connection", label: "AI 연결",   description: "분류 경험을 AI 학습 방식과 연결해 이해했는가" }
        ]
      },

      submit: {
        title: "분류 체계 보고서 완성!",
        message: "분류 규칙을 만들고 테스트하며 AI가 배우는 과정을 직접 경험했어요.",
        summaryLabels: { step1: "선택한 특징", step2: "분류 규칙", step3: "테스트 결과", step4: "규칙 수정·AI 학습 통찰" },
        artifact: {
          bindingKey: "d_1_m_classify",
          template: "[분류 규칙]\n{step2_rule_1}\n{step2_rule_2}\n\n[수정]\n{step4_fix}\n\n[AI 학습 통찰]\n{step4_insight}"
        }
      }
    },

    // =====================================================================
    // D-1-H | 고학년 (5~6학년)
    // 역할: 데이터 라벨링 전문가 | 산출물: 라벨링 가이드라인 + 품질 보고서
    // =====================================================================
    upper: {
      cardCode: "D-1-H",
      performanceType: "DS",
      ksa: { K: ["K1.1", "K1.2", "K2.4"], S: ["Computational Thinking"], A: ["Curious"] },
      description: "데이터 라벨링 가이드라인을 설계하고, 라벨 품질이 AI 학습에 미치는 영향을 분석하는 미션이에요.",

      scenario: {
        role: "데이터 라벨링 전문가",
        goal: "라벨링 가이드라인을 설계하고, 라벨 품질이 AI 분류 성능에 미치는 영향을 실험·분석한다.",
        context: "AI 회사에서 이미지 분류 AI를 개발하려면, 먼저 사람이 데이터에 라벨(정답 표시)을 붙여야 해요. 라벨링 전문가로서 '어떤 기준으로 라벨을 붙일지' 가이드라인을 만들고, 라벨 품질이 AI 성능에 어떤 영향을 주는지 실험해봐요.",
        artifactType: "라벨링 가이드라인 + 품질 보고서"
      },

      intro: [
        { text: "AI가 잘 배우려면 먼저 사람이\n데이터에 정확한 라벨을 붙여야 해요.", emoji: "🏷️" },
        { text: "하지만 사람마다 기준이 다르면\nAI는 혼란스러워해요.", emoji: "🤔" },
        { text: "라벨링 전문가로서 누구나 같은 기준으로\n라벨을 붙일 수 있는 가이드라인을 만들어봅시다!", emoji: "📋" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI의 학습 품질은 사람이 붙인 라벨의 품질에 직접 달려 있어요. 잘못된 라벨은 잘못된 AI를 만들어요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "라벨링 기준의 명확성, 애매한 사례에 대한 처리 방법, 사람 간 일치도를 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "라벨이 일관되지 않으면 AI가 잘못된 패턴을 학습하고, 실제 사용에서 오류가 많아져요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 라벨링 가이드라인 설계",
          question: "감정 표현 이미지를 분류하는 AI를 만든다고 해요. 어떤 카테고리로 나눌지, 각 카테고리의 기준은 무엇인지 가이드라인을 만들어보세요.",
          hint: "카테고리가 너무 적으면 구분이 안 되고, 너무 많으면 혼란스러워요. 각 카테고리의 경계를 명확히 쓰세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "categories", text: "카테고리 목록 (3~5개)" },
            { id: "criteria",   text: "각 카테고리의 판단 기준" },
            { id: "boundary",   text: "애매한 경우의 처리 규칙" },
            { id: "examples",   text: "각 카테고리의 대표 예시" }
          ],
          placeholders: [
            "예: 기쁨, 슬픔, 놀람, 화남, 무표정",
            "예: 기쁨 = 입꼬리가 올라가고 눈이 가늘어짐. 슬픔 = 입꼬리가 내려가고 눈썹이 처짐.",
            "예: 두 감정이 섞여 보이면 '더 강하게 느껴지는 쪽'으로 라벨링한다. 판단이 안 되면 '애매함'으로 표시한다.",
            "예: 기쁨 → 활짝 웃는 얼굴. 슬픔 → 눈물 흘리는 얼굴."
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · 실제 라벨링 수행",
          question: "가이드라인에 따라 아래 감정 표현을 분류해보세요.",
          hint: "step1에서 만든 기준을 정확히 따르세요. 애매하면 경계 규칙을 적용하세요.",
          uiMode: "per_case_judge",
          branch: { sourceStepId: "step1", mode: "highlight" },
          cases: [
            { id: "face_1", title: "표정 1: 활짝 웃음",           description: "입꼬리가 크게 올라가고 눈이 반달 모양" },
            { id: "face_2", title: "표정 2: 찡그림",               description: "눈썹이 가운데로 모이고 입이 꾹 다물어짐" },
            { id: "face_3", title: "표정 3: 입을 벌리고 눈이 큼",   description: "눈이 크게 뜨이고 입이 동그래짐" },
            { id: "face_4", title: "표정 4: 눈물+미소",            description: "눈가에 눈물이 있지만 입꼬리가 올라감" },
            { id: "face_5", title: "표정 5: 무표정",               description: "입꼬리가 평평하고 눈썹이 자연스러움" },
            { id: "face_6", title: "표정 6: 살짝 미소",            description: "입꼬리가 아주 살짝만 올라감" }
          ],
          judgmentOptions: [
            { id: "happy",     label: "기쁨" },
            { id: "sad",       label: "슬픔" },
            { id: "surprised", label: "놀람" },
            { id: "angry",     label: "화남" },
            { id: "neutral",   label: "무표정" },
            { id: "ambiguous", label: "애매함" }
          ],
          allowText: true,
          textPlaceholder: "어떤 기준을 적용했는지 써보세요. 애매한 경우 경계 규칙을 어떻게 적용했는지도요.",
          validation: { required: true, textRequired: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 라벨 품질 분석",
          question: "만약 다른 사람이 같은 가이드라인으로 라벨링했다면, 나와 같은 결과가 나올까요? 어떤 것이 불일치할 가능성이 높고, 왜 그럴까요?",
          hint: "표정 4(눈물+미소)처럼 애매한 것은 사람마다 다르게 라벨링할 수 있어요. 이게 AI에게 어떤 영향을 줄지 생각해보세요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          questions: [
            { id: "agree",       text: "다른 사람과 같은 결과가 나올 것 같은 항목과 이유" },
            { id: "disagree",    text: "다른 사람과 다를 수 있는 항목과 이유" },
            { id: "impact_on_ai", text: "불일치가 AI 학습에 미치는 영향" }
          ],
          placeholders: [
            "예: 표정 1(활짝 웃음)과 표정 5(무표정)는 누가 봐도 같은 라벨을 붙일 거예요.",
            "예: 표정 4(눈물+미소)와 표정 6(살짝 미소)은 사람마다 다르게 판단할 수 있어요. 기준이 주관적이라서요.",
            "예: 같은 표정에 다른 라벨이 붙으면 AI가 혼란스러워서 잘못 학습해요."
          ],
          validation: { required: true, minAnswered: 3 }
        },
        {
          id: "step4",
          title: "STEP 4 · 가이드라인 개선 + 최종 보고서",
          question: "분석 결과를 바탕으로 가이드라인을 어떻게 개선하면 사람 간 일치도가 높아질까요?",
          hint: "애매한 사례에 대한 기준을 더 구체화하거나, 예시를 추가하는 방법을 생각해보세요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "improvement",   text: "가이드라인 개선 사항" },
            { id: "lesson",        text: "데이터 라벨링이 AI에게 중요한 이유 (핵심 정리)" },
            { id: "human_role",    text: "AI 학습에서 사람의 역할은?" }
          ],
          placeholders: [
            "예: 애매한 표정에 대해 '더 강하게 느껴지는 감정' 기준을 구체적 신체 부위(입, 눈, 눈썹)별로 나눠 정의한다.",
            "예: AI는 사람이 붙인 라벨로 배우기 때문에, 라벨이 일관되지 않으면 AI도 일관되지 않은 결과를 내요.",
            "예: 사람이 분류 기준을 정하고 라벨을 붙이는 역할을 해요. AI는 그 라벨에서 패턴을 찾을 뿐이에요."
          ],
          validation: { required: true, minAnswered: 3 }
        }
      ],

      rubric: {
        axes: [
          { id: "design",     label: "설계·구성", description: "라벨링 가이드라인이 체계적이고 명확한가" },
          { id: "test",       label: "실험·검증", description: "가이드라인에 따라 실제 라벨링을 수행하고 일관성을 확인했는가" },
          { id: "iteration",  label: "반복·개선", description: "품질 분석 결과로 가이드라인을 구체적으로 개선했는가" },
          { id: "connection", label: "AI 연결",   description: "라벨 품질이 AI 학습에 미치는 영향을 이해하고 인간의 역할을 설명했는가" },
          { id: "fairness",   label: "공정성 인식", description: "주관적 판단이 라벨에 반영될 수 있음을 인식했는가" }
        ]
      },

      submit: {
        title: "라벨링 가이드라인 + 품질 보고서 완성!",
        message: "AI의 학습 품질이 사람의 라벨링에 달려 있음을 직접 경험했어요.",
        summaryLabels: { step1: "가이드라인", step2: "라벨링 결과", step3: "품질 분석", step4: "개선 + 핵심 정리" },
        artifact: {
          bindingKey: "d_1_h_labeling",
          template: "[라벨링 가이드라인]\n카테고리: {step1_categories}\n기준: {step1_criteria}\n경계 규칙: {step1_boundary}\n\n[핵심 정리]\n{step4_lesson}\n\n[인간의 역할]\n{step4_human_role}"
        }
      }
    }
  }
};
