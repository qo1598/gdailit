/**
 * LearnAILIT V4 · C-4 책임 있게 완성하고 공개하기
 * 시나리오 기반 수행 평가 — C영역 공통 인터페이스 적용
 *
 * [주요 uiMode]
 * - disclosure_builder : AI 도움 체크 → 공개 문장 자동 초안 생성 → 학생 다듬기
 * - multi_free_text    : 구조화된 서술
 * - multi_select_chips : 영역·위험 체크
 */

export const C4_V4_SCENARIO = {
  meta: {
    code: "C-4",
    title: "책임 있게 완성하고 공개하기",
    domain: "Creating",
    ksa: { K: ["K5.3"], S: ["Communication"], A: ["Responsible"] }
  },

  grades: {

    // =====================================================================
    // C-4-L | 저학년 (1~2학년)
    // 역할: 작품 전시 큐레이터 | 산출물: 전시 라벨 카드
    // =====================================================================
    lower: {
      cardCode: "C-4-L",
      performanceType: "TD",
      description: "내 작품과 AI가 도와준 부분을 구분해서 전시 라벨을 만드는 미션이에요.",

      scenario: {
        role: "작품 전시 큐레이터",
        goal: "내가 한 일과 AI가 도와준 일을 구분해서 전시 라벨을 만든다.",
        context: "반 작품 전시회에서 그림이나 글을 전시하려고 해요. 내 작품은 내가 만들었지만, 제목이나 배경 아이디어는 AI가 조금 도와주었어요. 관람객이 오해하지 않도록 작품 옆에 간단한 설명 라벨을 붙여야 해요.",
        artifactType: "전시 라벨 카드"
      },

      intro: [
        { text: "반 작품 전시회를 열어요!\n내 작품 옆에 설명 라벨을 붙여야 해요.", emoji: "🖼️" },
        { text: "내가 한 일과 AI가 도와준 일을\n구분해서 솔직하게 적어야 해요.", emoji: "🤝" },
        { text: "그래야 친구들이 작품을 볼 때\n오해하지 않고 정확하게 이해할 수 있어요!", emoji: "✨" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 도움을 받았더라도 내가 한 일과 AI가 도와준 일을 구분해 말하는 것은 정직한 창작 태도예요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어디까지 내 생각이고, 어디서 AI가 도움을 주었는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "친구나 선생님이 작품 제작 과정을 오해할 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 작품 종류 고르기",
          question: "전시할 작품은 어떤 종류예요?",
          hint: "내가 만든 작품을 떠올려 보세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "drawing", label: "그림",       emoji: "🎨" },
            { id: "story",   label: "짧은 이야기", emoji: "📖" },
            { id: "poster",  label: "포스터",     emoji: "📋" },
            { id: "poem",    label: "시",         emoji: "📝" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · 내가 한 일 쓰기",
          question: "이 작품에서 \"내가 한 일\"을 한 문장으로 써보세요.",
          hint: "내가 직접 생각하고 만든 부분을 써요.",
          uiMode: "free_text",
          placeholder: "예: 주인공을 정하고 색칠을 했어요.",
          validation: { required: true, minLength: 10 }
        },
        {
          id: "step3",
          title: "STEP 3 · AI가 도와준 일 쓰기",
          question: "이 작품에서 \"AI가 도와준 일\"을 한 문장으로 써보세요.",
          hint: "AI가 제안해준 것, 추천해준 것을 솔직하게 써요.",
          uiMode: "free_text",
          placeholder: "예: 제목 아이디어를 여러 개 추천해 주었어요.",
          validation: { required: true, minLength: 10 }
        },
        {
          id: "step4",
          title: "STEP 4 · 전시 라벨 완성하기",
          question: "STEP 2, 3을 합쳐서 전시 라벨이 완성돼요. 확인하고 필요하면 다듬어보세요.",
          hint: "관람객이 읽기 좋게 자연스러운 문장으로 써요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          placeholder: "예: 이 작품은 제가 주인공을 정하고 색칠했어요. 제목 아이디어는 AI가 추천해준 것 중에서 골랐어요.",
          validation: { required: true, minLength: 25 }
        }
      ],

      rubric: {
        axes: [
          { id: "contribution",   label: "자기 기여",      description: "인간과 AI의 역할을 구분하는가" },
          { id: "responsibility", label: "책임 있는 공유", description: "전시 라벨이 간단하지만 분명한가" }
        ]
      },

      submit: {
        title: "전시 라벨 완성!",
        message: "내가 한 일과 AI가 도와준 일을 구분해서 정직한 라벨을 만들었어요.",
        summaryLabels: {
          step1: "작품 종류",
          step2: "내가 한 일",
          step3: "AI가 도와준 일",
          step4: "완성한 라벨"
        },
        artifact: {
          bindingKey: "c_4_l_label",
          template: "[{step1} 작품 라벨]\n{step4}"
        }
      }
    },

    // =====================================================================
    // C-4-M | 중학년 (3~4학년)
    // 역할: 학교 신문 편집 기자 | 산출물: 공개 문장 + 숨겼을 때 생길 문제 정리
    // =====================================================================
    middle: {
      cardCode: "C-4-M",
      performanceType: "SJ",
      description: "AI 도움을 숨겼을 때 생길 문제를 이해하고, 독자에게 투명하게 밝히는 공개 문장을 쓰는 미션이에요.",

      scenario: {
        role: "학교 신문 편집 기자",
        goal: "AI 도움을 숨기면 생길 문제를 정리하고, 기사 하단에 붙일 공개 문장을 쓴다.",
        context: "학교 신문에 실을 기사나 포스터를 준비했는데, 일부 아이디어와 문구는 AI의 도움을 받았어요. 독자에게 이 사실을 숨기면 오해가 생길 수 있어요. 편집 기자로서 공개가 필요한 이유를 정리하고, 실제 안내 문장을 작성해야 해요.",
        artifactType: "공개 문장 + 숨겼을 때 생길 문제 정리"
      },

      intro: [
        { text: "학교 신문에 실을 기사를 준비했어요.\n일부 아이디어는 AI 도움을 받았어요.", emoji: "📰" },
        { text: "이 사실을 숨기면 독자에게 오해가 생길 수 있어요.\nAI 사용 여부를 투명하게 밝히는 건 신뢰를 지키는 일이에요.", emoji: "🤝" },
        { text: "편집 기자로서 공개 문장을 써봅시다!", emoji: "✍️" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 사용 여부를 투명하게 밝히는 것은 독자와의 신뢰를 지키는 일이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 도움을 받았는지, 독자가 무엇을 오해할 수 있는지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "학생의 실제 기여와 AI 도움 범위가 왜곡되어 보일 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI가 도와준 영역 체크",
          question: "이번 기사에서 AI가 어떤 부분을 도와줬나요? 해당하는 것을 모두 고르세요.",
          hint: "솔직하게 표시하는 것이 중요해요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "idea",       label: "아이디어 브레인스토밍" },
            { id: "title",      label: "제목 제안" },
            { id: "draft",      label: "초안 문구 작성" },
            { id: "revision",   label: "문장 다듬기" },
            { id: "image",      label: "이미지 생성" },
            { id: "summary",    label: "내용 요약" },
            { id: "translation",label: "번역 또는 쉬운 말로 바꾸기" }
          ],
          validation: { required: true, minSelections: 1 }
        },
        {
          id: "step2",
          title: "STEP 2 · 숨겼을 때 생길 문제 고르기",
          question: "AI 도움을 숨기면 어떤 문제가 생길 수 있을까요? 해당하는 것을 모두 골라보세요.",
          hint: "독자의 입장에서 생각해보세요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "overstate",    label: "내 실력을 실제보다 크게 보이게 함" },
            { id: "mislead",      label: "독자가 제작 과정을 오해함" },
            { id: "unfair",       label: "AI 안 쓴 친구와 비교가 불공정해짐" },
            { id: "trust_broken", label: "독자의 신뢰를 잃을 수 있음" },
            { id: "hard_to_verify", label: "정보의 출처를 확인하기 어려워짐" }
          ],
          validation: { required: true, minSelections: 1 }
        },
        {
          id: "step3",
          title: "STEP 3 · 공개 문장 만들기",
          question: "기사 하단에 붙일 공개 문장을 써보세요. 어떤 도움을 받았는지 구체적으로 밝혀요.",
          hint: "STEP 1에서 체크한 영역을 포함해서 써요. 너무 길 필요 없어요. 한두 문장으로.",
          uiMode: "disclosure_builder",
          branch: { sourceStepId: "step1", mode: "highlight" },
          helpAreaOptions: [
            { id: "idea",       label: "아이디어" },
            { id: "title",      label: "제목 제안" },
            { id: "draft",      label: "초안 문구" },
            { id: "revision",   label: "문장 다듬기" },
            { id: "image",      label: "이미지 생성" },
            { id: "summary",    label: "내용 요약" },
            { id: "translation",label: "쉬운 말로 바꾸기" }
          ],
          autoDraftTemplate: "이 기사의 {helpAreas} 부분은 AI의 도움을 받았습니다. 최종 내용은 기자가 직접 검토하고 작성했습니다.",
          allowEdit: true,
          placeholder: "자동으로 만들어진 초안을 자연스럽게 다듬어보세요.",
          validation: { required: true, minLength: 25 }
        }
      ],

      rubric: {
        axes: [
          { id: "responsibility", label: "책임 있는 공유", description: "숨겼을 때의 문제를 이해하는가" },
          { id: "contribution",   label: "자기 기여",      description: "공개 문장이 구체적이고 정직한가" }
        ]
      },

      submit: {
        title: "공개 문장 완성!",
        message: "AI 도움을 투명하게 밝히는 기자로서의 태도를 경험했어요.",
        summaryLabels: {
          step1: "AI 도움 영역",
          step2: "숨겼을 때 문제",
          step3: "공개 문장"
        },
        artifact: {
          bindingKey: "c_4_m_disclosure",
          template: "[기사 하단 공개 문장]\n{step3}\n\n— AI 도움 영역: {step1}"
        }
      }
    },

    // =====================================================================
    // C-4-H | 고학년 (5~6학년)
    // 역할: 공모전 제출 담당자 | 산출물: AI 활용 표기 가이드 + 정직 선언문
    // =====================================================================
    upper: {
      cardCode: "C-4-H",
      performanceType: "SJ",
      description: "공모전 제출용 AI 활용 표기 가이드를 만들고, 앞으로의 AI 사용 원칙을 담은 정직 선언문을 작성하는 미션이에요.",

      scenario: {
        role: "공모전 제출 담당자",
        goal: "AI 활용 표기 가이드 3~5조항과 정직 선언문을 완성한다.",
        context: "학교 대표로 작품을 공모전에 제출하려고 해요. 작품 제작에 AI가 어느 정도 관여했는지, 어디까지가 학생의 아이디어인지, 어떻게 표기해야 하는지 분명히 하지 않으면 공정성 논란이 생길 수 있어요. 제출 담당자로서 표기 원칙을 정리하고 정직 선언문을 써야 해요.",
        artifactType: "AI 활용 표기 가이드 3~5조항 + 정직 선언문"
      },

      intro: [
        { text: "학교 대표로 공모전에 작품을 제출해요!", emoji: "🏆" },
        { text: "AI가 어느 정도 관여했는지,\n어디까지가 학생의 기여인지 분명히 해야 해요.", emoji: "⚖️" },
        { text: "제출 담당자로서 표기 가이드를 만들고,\n정직 선언문도 작성해봅시다.", emoji: "📜" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 협업 창작에서는 결과물 못지않게 창작 과정의 투명성과 책임이 중요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "AI 도움의 범위, 인간의 기여, 표기 방식, 공개 기준을 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "독창성, 공정성, 신뢰성과 관련된 문제를 만들 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI 활용 범위 정리",
          question: "이번 공모전 작품에서 AI는 어떤 영역에 얼마나 쓰였나요?",
          hint: "영역별로 'AI 주도 / 함께 작업 / 인간 주도' 중 선택해요.",
          uiMode: "multi_free_text",
          questions: [
            { id: "idea_area",  text: "아이디어 — AI 활용 정도와 구체적 내용" },
            { id: "text_area",  text: "문구·글쓰기 — AI 활용 정도와 구체적 내용" },
            { id: "image_area", text: "이미지·디자인 — AI 활용 정도와 구체적 내용" },
            { id: "edit_area",  text: "편집·다듬기 — AI 활용 정도와 구체적 내용" }
          ],
          placeholders: [
            "예: 함께 작업 — AI가 낸 10개 아이디어 중 2개를 내가 선택해 재구성함",
            "예: 인간 주도 — 내가 직접 썼고, AI는 오탈자 검토만 도움",
            "예: AI 주도 — AI 생성 이미지를 그대로 사용했으나 여러 번 프롬프트 수정함",
            "예: 인간 주도 — 내가 직접 편집함"
          ],
          validation: { required: true, minAnswered: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · 표기 원칙 만들기",
          question: "AI 활용을 어떻게 표기할지 구체적인 원칙을 3~5조항으로 만들어보세요.",
          hint: "어디에, 어떻게, 무엇을 표기할지 실행 가능한 수준으로 써야 해요.",
          uiMode: "multi_free_text",
          branch: { sourceStepId: "step1", mode: "highlight" },
          questions: [
            { id: "rule_1", text: "[1조항] AI 도움받은 부분을 어디에 표기하는가" },
            { id: "rule_2", text: "[2조항] 이미지 생성 여부를 어떻게 표시하는가" },
            { id: "rule_3", text: "[3조항] AI 결과 그대로 제출은 어떻게 처리하는가" },
            { id: "rule_4", text: "[4조항] (선택) 추가 원칙 1" },
            { id: "rule_5", text: "[5조항] (선택) 추가 원칙 2" }
          ],
          placeholders: [
            "예: 작품 하단 '제작 노트'에 AI 도움 영역과 구체적 방식을 명시한다.",
            "예: AI 생성 이미지는 캡션에 '(AI 생성, 프롬프트 작성 및 선별은 본인)'을 덧붙인다.",
            "예: AI 결과를 1회 이상 수정·재구성하지 않은 경우 작품으로 제출하지 않는다.",
            "예: 타인의 저작물이 포함된 경우 별도로 표기한다.",
            "예: 제출 전 지도 교사에게 AI 활용 내역을 공유한다."
          ],
          validation: { required: true, minAnswered: 3 }
        },
        {
          id: "step3",
          title: "STEP 3 · 제출 전 점검 기준 만들기",
          question: "실제 제출 직전에 확인할 체크리스트를 만들어요.",
          hint: "실무에서 쓸 수 있게 구체적인 동사로 쓰세요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "check_attribution",  label: "모든 AI 도움 영역이 표기되었는가" },
            { id: "check_plagiarism",   label: "타인 저작물을 모방하지 않았는가" },
            { id: "check_revision",     label: "AI 결과물을 1회 이상 수정·재구성했는가" },
            { id: "check_caption",      label: "AI 생성 이미지에 캡션이 붙었는가" },
            { id: "check_human_role",   label: "인간 기여 영역이 분명히 드러나는가" },
            { id: "check_teacher",      label: "지도 교사에게 AI 활용 내역을 공유했는가" },
            { id: "check_original",     label: "최종 제출본이 내 의도를 반영하는가" }
          ],
          validation: { required: true, minSelections: 3 }
        },
        {
          id: "step4",
          title: "STEP 4 · 정직 선언문 작성",
          question: "앞으로 AI를 쓸 때 지킬 나의 원칙을 정직 선언문으로 써보세요.",
          hint: "3~5문장으로, 구체적이고 실천 가능한 원칙을 써요. \"나는 ~하겠다\" 형식으로.",
          uiMode: "disclosure_builder",
          branch: { sourceStepId: "step2", mode: "highlight" },
          helpAreaOptions: [
            { id: "idea",   label: "아이디어" },
            { id: "text",   label: "글쓰기" },
            { id: "image",  label: "이미지 생성" },
            { id: "edit",   label: "편집·다듬기" }
          ],
          autoDraftTemplate: "나는 AI를 활용한 창작에서 다음 원칙을 지킨다.\n하나, AI의 도움을 받은 부분을 숨기지 않고 투명하게 밝힌다.\n둘, AI 결과를 그대로 제출하지 않고 반드시 내 판단으로 수정·재구성한다.\n셋, 최종 결과에 대한 판단과 책임을 스스로 진다.",
          allowEdit: true,
          placeholder: "위 초안을 자신의 말로 다듬고, 추가하고 싶은 원칙이 있으면 덧붙이세요.",
          validation: { required: true, minLength: 80 }
        }
      ],

      rubric: {
        axes: [
          { id: "ai_use",         label: "AI 활용",        description: "AI 활용 범위와 인간 기여를 구분하는가" },
          { id: "responsibility", label: "책임 있는 공유", description: "표기 원칙이 실제 제출 상황에 적용 가능하도록 구체적인가" },
          { id: "contribution",   label: "자기 기여",      description: "정직 선언문이 책임 있는 창작 태도를 드러내는가" }
        ]
      },

      submit: {
        title: "AI 활용 표기 가이드 + 정직 선언문 완성!",
        message: "공모전 제출 담당자로서 투명하고 책임 있는 창작 원칙을 세웠어요.",
        summaryLabels: {
          step1: "AI 활용 범위",
          step2: "표기 원칙",
          step3: "제출 전 체크리스트",
          step4: "정직 선언문"
        },
        artifact: {
          bindingKey: "c_4_h_honesty_declaration",
          template: "[AI 활용 표기 가이드]\n{step2}\n\n[제출 전 체크리스트]\n{step3}\n\n[정직 선언문]\n{step4}"
        }
      }
    }
  }
};
