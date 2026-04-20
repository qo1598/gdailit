/**
 * LearnAILIT V4 · C-3 AI 결과를 비교·수정·정제하기
 * 시나리오 기반 수행 평가 — C영역 공통 인터페이스 적용
 *
 * [주요 uiMode]
 * - ai_option_picker    : AI가 생성한 후보 중 선택 + 재요청
 * - side_by_side_editor : 원문 ↔ 수정문 나란히 편집 + 수정 태그
 * - edit_log            : 반복 편집 타임라인 기록
 */

export const C3_V4_SCENARIO = {
  meta: {
    code: "C-3",
    title: "AI 결과를 비교·수정·정제하기",
    domain: "Creating",
    ksa: { K: ["K5.3"], S: ["Creativity"], A: ["Responsible"] }
  },

  grades: {

    // =====================================================================
    // C-3-L | 저학년 (1~2학년)
    // 역할: 포스터 문구 디자이너 | 산출물: 선택 문구 + 이유 한 문장
    // =====================================================================
    lower: {
      cardCode: "C-3-L",
      performanceType: "TD",
      description: "AI가 제안한 여러 포스터 문구 중 포스터 주제에 가장 잘 맞는 것을 고르는 미션이에요.",

      scenario: {
        role: "포스터 문구 디자이너",
        goal: "AI가 낸 여러 문구 중 포스터 주제에 가장 잘 맞는 것을 고르고, 이유를 설명한다.",
        context: "학교 복도에 붙일 '지구를 지키자' 포스터를 만들고 있어요. AI가 포스터에 어울릴 만한 단어와 짧은 표현을 여러 개 추천해 주었는데, 어떤 말을 포스터에 넣을지는 디자이너인 내가 정해야 해요.",
        artifactType: "선택한 문구 + 이유"
      },

      intro: [
        { text: "학교 복도에 붙일 포스터 문구를 고를 거예요!", emoji: "📌" },
        { text: "AI가 여러 문구를 추천해주지만,\n포스터에 가장 잘 어울리는 말은 디자이너인 내가 골라요.", emoji: "🎨" },
        { text: "왜 그 문구를 골랐는지도 함께 설명해봅시다!", emoji: "💭" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 여러 아이디어를 주어도, 그중에서 목적에 맞는 것을 고르는 능력이 필요해요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "포스터 주제와 어울리는지, 짧고 기억하기 쉬운지 살펴봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "멋져 보여도 주제와 맞지 않는 문구를 넣게 될 수 있어요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 포스터 주제 고르기",
          question: "어떤 주제의 포스터를 만들까요?",
          hint: "내가 전하고 싶은 메시지를 골라보세요.",
          uiMode: "single_select_cards",
          options: [
            { id: "earth",       label: "지구 사랑",      emoji: "🌍" },
            { id: "recycling",   label: "분리수거",       emoji: "♻️" },
            { id: "save_water",  label: "물 아끼기",      emoji: "💧" },
            { id: "save_energy", label: "전기 아끼기",    emoji: "💡" },
            { id: "tree",        label: "나무 심기",      emoji: "🌳" }
          ],
          validation: { required: true }
        },
        {
          id: "step2",
          title: "STEP 2 · AI가 문구를 추천해줄 거예요",
          question: "선택한 주제에 맞는 포스터 문구 후보 4개를 AI가 만들어줘요. 마음에 드는 것을 골라보세요!",
          hint: "짧고 기억에 남는 말, 주제가 잘 드러나는 말을 골라보세요. 마음에 안 들면 다시 요청할 수 있어요.",
          uiMode: "ai_option_picker",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "claude",
            mode: "completion",
            systemPrompt: "당신은 초등 저학년(1~2학년)을 위한 포스터 문구 작가입니다. 학생이 고른 주제로 포스터에 넣을 짧고 기억하기 쉬운 문구 4개를 제안하세요. 각 문구는 5~10자 내외로 간결하고, 따뜻하거나 힘 있는 느낌을 주어야 합니다.",
            userPromptTemplate: "포스터 주제: {step1}\n\n이 주제로 포스터에 넣을 짧은 문구 4개를 제안해 주세요. 한 줄에 하나씩, 설명 없이 문구만 써주세요.",
            outputSchema: "options_list",
            maxTokens: 150,
            temperature: 0.9,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: ["푸른 지구, 우리의 약속", "깨끗한 오늘, 맑은 내일", "함께 지키는 내일", "작은 실천, 큰 변화"]
            }
          },
          optionCount: 4,
          allowRegenerate: true,
          allowCustomInput: true,
          customInputLabel: "내 말로 직접 쓰기",
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 고른 이유 쓰기",
          question: "왜 이 문구를 골랐나요?",
          hint: "\"짧고 기억하기 쉬워서\", \"주제가 잘 느껴져서\" 같이 짧게 써도 좋아요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          placeholder: "예: 짧아서 기억하기 쉽고, 지구를 지키자는 느낌이 잘 들어서 골랐어요.",
          validation: { required: true, minLength: 15 }
        }
      ],

      rubric: {
        axes: [
          { id: "ai_use",       label: "AI 활용",   description: "목적에 맞는 문구를 골랐는가" },
          { id: "contribution", label: "자기 기여", description: "선택 이유가 포스터 목적과 연결되는가" }
        ]
      },

      submit: {
        title: "포스터 문구 선택 완료!",
        message: "AI 제안 중 주제에 가장 잘 맞는 문구를 골랐어요.",
        summaryLabels: {
          step1: "포스터 주제",
          step2: "고른 문구",
          step3: "고른 이유"
        },
        artifact: {
          bindingKey: "c_3_l_slogan",
          template: "[{step1} 포스터]\n\"{step2}\"\n\n— 이 문구를 고른 이유: {step3}"
        }
      }
    },

    // =====================================================================
    // C-3-M | 중학년 (3~4학년)
    // 역할: 학교 방송부 카피라이터 | 산출물: 원문-수정문 비교표 + 수정 이유
    // =====================================================================
    middle: {
      cardCode: "C-3-M",
      performanceType: "SJ",
      description: "AI 초안 멘트를 우리 학교 학생에게 맞는 말투로 다듬고, 무엇을 왜 바꿨는지 정리하는 미션이에요.",

      scenario: {
        role: "학교 방송부 카피라이터",
        goal: "AI 초안 멘트를 대상에 맞게 다듬고, 수정 내용과 이유를 정리한다.",
        context: "학교 방송부에서 아침 캠페인 방송 멘트를 준비하고 있어요. AI가 만든 문구는 내용은 맞지만 말투가 딱딱해서 학생들에게 잘 와닿지 않아요. 카피라이터로서 더 자연스럽고 공감 가는 말로 다듬어야 해요.",
        artifactType: "원문-수정문 비교표 + 수정 이유"
      },

      intro: [
        { text: "학교 방송부 아침 캠페인 멘트를 준비해요!", emoji: "📢" },
        { text: "AI가 만든 문구는 내용은 맞지만\n말투가 딱딱해서 학생들에게 잘 와닿지 않아요.", emoji: "🤔" },
        { text: "카피라이터로서 대상에 맞는 말로 다듬고,\n무엇을 왜 바꿨는지 정리해봅시다!", emoji: "✍️" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 초안을 그대로 쓰는 것보다, 대상에 맞게 다듬는 것이 더 중요한 창작 과정이에요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "대상 적합성, 말투, 공감도, 전달력을 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "틀리진 않지만 듣는 사람에게 와닿지 않는 결과물이 돼요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · AI 초안 멘트 확인하기",
          question: "방송부에 전달된 AI 초안 멘트예요. 먼저 천천히 읽어보세요.",
          hint: "딱딱한 표현, 어려운 단어, 공감이 덜 가는 부분을 찾아보세요.",
          uiMode: "monitor_display",
          displayText: "에너지를 절약하는 행동은 환경 보호에 기여합니다. 전등을 끄고 사용하지 않는 전자기기의 전원을 차단하는 것이 권장됩니다. 이러한 행동은 지구 환경 개선에 중요한 역할을 수행합니다.",
          displayLabel: "AI 초안 멘트",
          validation: { required: false }
        },
        {
          id: "step2",
          title: "STEP 2 · 우리 학교 말투로 다듬기",
          question: "AI 초안을 우리 학교 학생에게 와닿는 말로 다시 써보세요.",
          hint: "말투를 바꾸고, 공감 가는 표현을 넣고, 감정이 느껴지게 바꿔보세요. 바꾼 부분을 태그로 표시해요.",
          uiMode: "side_by_side_editor",
          originalText: "에너지를 절약하는 행동은 환경 보호에 기여합니다. 전등을 끄고 사용하지 않는 전자기기의 전원을 차단하는 것이 권장됩니다. 이러한 행동은 지구 환경 개선에 중요한 역할을 수행합니다.",
          originalLabel: "AI 초안",
          revisedLabel: "내가 다듬은 멘트",
          revisionTagOptions: [
            { id: "tone",    label: "말투를 바꿈" },
            { id: "clarity", label: "더 쉽게 바꿈" },
            { id: "emotion", label: "감정이 느껴지게 바꿈" },
            { id: "relatable", label: "공감 가게 바꿈" },
            { id: "shorter", label: "더 짧게 줄임" }
          ],
          showDiff: true,
          placeholder: "예: 오늘 교실 전등 하나 끄는 작은 실천이 지구를 더 시원하게 만들어요. 쓰지 않는 전자기기는 콘센트도 함께 빼보는 건 어때요?",
          validation: { required: true, minLength: 40 }
        },
        {
          id: "step3",
          title: "STEP 3 · 수정 이유 쓰기",
          question: "왜 이렇게 바꿨나요? 가장 중요한 수정 이유 하나를 설명해보세요.",
          hint: "어떤 부분을 왜 바꿨는지, 바꾸니 어떤 점이 좋아졌는지 써보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step2", mode: "highlight" },
          placeholder: "예: \"~합니다\" 같은 딱딱한 말투를 \"~어때요?\"로 바꿨어요. 방송은 친구에게 말하는 느낌이 더 와닿고, 학생들이 실천하고 싶어질 것 같아서요.",
          validation: { required: true, minLength: 30 }
        }
      ],

      rubric: {
        axes: [
          { id: "ai_use",       label: "AI 활용",     description: "AI 초안의 한계를 파악했는가" },
          { id: "revision",     label: "수정과 개선", description: "단순 치환이 아니라 의미와 전달력을 개선했는가" },
          { id: "contribution", label: "자기 기여",   description: "수정 이유를 설명할 수 있는가" }
        ]
      },

      submit: {
        title: "방송 멘트 수정 완료!",
        message: "AI 초안을 우리 학교 학생에게 맞는 말로 다듬었어요.",
        summaryLabels: {
          step1: "AI 초안",
          step2: "내가 다듬은 멘트",
          step3: "수정 이유"
        },
        artifact: {
          bindingKey: "c_3_m_copy_compare",
          template: "[AI 초안]\n{step1}\n\n[내가 다듬은 멘트]\n{step2_revised}\n\n[수정 이유]\n{step3}"
        }
      }
    },

    // =====================================================================
    // C-3-H | 고학년 (5~6학년)
    // 역할: 학생 잡지 편집장 | 산출물: 최종 문구 + 편집 로그 + 수정 기준표
    // =====================================================================
    upper: {
      cardCode: "C-3-H",
      performanceType: "SJ",
      description: "편집 기준을 세우고 AI 초안을 여러 차례 다듬어 최종 문구를 완성하며, 편집 로그를 남기는 미션이에요.",

      scenario: {
        role: "학생 잡지 편집장",
        goal: "편집 기준을 세우고 반복 수정으로 최종 문구를 완성하며, 편집 과정을 로그로 남긴다.",
        context: "학생 잡지의 표지 문구와 안내 문구를 AI로 초안 작성했는데, 대상 독자와 잡지 분위기에 딱 맞지는 않아요. 편집장으로서 정확성·설득력·독자 적합성·진정성을 기준으로 초안을 여러 번 다듬어야 해요.",
        artifactType: "최종 문구 + 편집 로그 + 수정 기준표"
      },

      intro: [
        { text: "학생 잡지 표지 문구를 완성해요!", emoji: "📖" },
        { text: "좋은 결과물은 한 번에 나오지 않아요.\n기준을 가지고 반복적으로 다듬는 과정에서 완성돼요.", emoji: "🔁" },
        { text: "편집 기준을 세우고, 최소 2번 이상 수정하면서\n편집 로그를 남겨봅시다!", emoji: "📝" }
      ],

      coreUnderstanding: [
        { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "좋은 결과물은 한 번에 나오지 않고, 기준을 가지고 반복적으로 다듬는 과정에서 완성돼요." },
        { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "독자 적합성, 톤 일관성, 진정성, 정확성을 함께 봐야 해요." },
        { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 낸 첫 결과를 그대로 쓰게 되어 내 의도와 잡지의 성격이 흐려져요." }
      ],

      steps: [
        {
          id: "step1",
          title: "STEP 1 · 편집 기준 정하기",
          question: "편집장으로서 이번 잡지 문구가 갖춰야 할 기준을 2~4개 정해보세요.",
          hint: "대상·톤·분량·정직성 등 여러 관점에서 기준을 세워요.",
          uiMode: "multi_select_chips",
          chips: [
            { id: "friendly_tone",   label: "친근한 톤" },
            { id: "no_exaggeration", label: "과장 금지" },
            { id: "age_fit",         label: "초등 고학년 이해 가능" },
            { id: "school_context",  label: "학교 맥락 반영" },
            { id: "concise",         label: "간결하게 (30자 이내)" },
            { id: "authentic",       label: "진정성 있게" },
            { id: "accurate",        label: "정확한 정보만" },
            { id: "inviting",        label: "읽고 싶게 만들기" }
          ],
          validation: { required: true, minSelections: 2, maxSelections: 4 }
        },
        {
          id: "step2",
          title: "STEP 2 · AI 초안 받기",
          question: "이번 잡지 표지에 쓸 문구 후보 3개를 AI에게 받아보세요.",
          hint: "STEP 1에서 정한 기준을 언급하며 요청하면 더 좋은 초안을 받을 수 있어요.",
          uiMode: "ai_option_picker",
          branch: { sourceStepId: "step1", mode: "highlight" },
          aiCall: {
            provider: "claude",
            mode: "completion",
            systemPrompt: "당신은 초등 고학년(5~6학년) 학생 잡지 편집장을 돕는 카피라이터입니다. 학생이 세운 편집 기준을 충실히 반영하여 잡지 표지에 쓸 문구 후보 3개를 제안하세요. 각 문구는 15~40자 사이로, 서로 다른 접근(감성적/실용적/호기심 유발)을 시도하세요.",
            userPromptTemplate: "[편집 기준]\n{step1}\n\n우리 학교 학생 잡지의 표지 문구 후보 3개를 제안해 주세요. 각 문구는 한 줄씩, 설명 없이 문구만 써주세요.",
            outputSchema: "options_list",
            maxTokens: 200,
            temperature: 0.8,
            retryPolicy: { maxRetries: 2, onFail: "show_fallback" },
            fallback: {
              options: [
                "우리 학교의 작은 이야기, 함께 펼쳐보는 이번 호",
                "친구가 건네준 이야기 한 장, 지금 펼쳐보세요",
                "이번 달 우리 반이 가장 많이 말한 것은?"
              ]
            }
          },
          optionCount: 3,
          allowRegenerate: true,
          allowCustomInput: false,
          validation: { required: true }
        },
        {
          id: "step3",
          title: "STEP 3 · 반복 편집하기 (편집 로그)",
          question: "AI 초안을 기준에 맞게 최소 2번 이상 다듬어보세요. 매 회차마다 수정본과 이유를 기록해요.",
          hint: "각 회차에서 무엇을 왜 바꿨는지 구체적으로 써야 편집 로그가 의미 있어요. 필요하면 AI에게 재생성을 요청할 수도 있어요.",
          uiMode: "edit_log",
          branch: { sourceStepId: "step2", mode: "highlight" },
          initialDraftLabel: "AI 초안 (STEP 2에서 고른 문구)",
          maxIterations: 3,
          minIterations: 2,
          eachIterationFields: [
            { id: "revision", label: "수정본", type: "text", placeholder: "이 회차의 수정본" },
            { id: "reason",   label: "왜 바꿨는가", type: "text", placeholder: "예: 친근한 톤 기준에 맞추기 위해 경어체를 반말로 바꿈" }
          ],
          allowAiRegenerate: true,
          aiCall: {
            provider: "claude",
            mode: "completion",
            systemPrompt: "당신은 학생 편집장의 요청에 따라 기존 문구를 개선해주는 카피라이터입니다. 학생이 지정한 수정 방향을 충실히 따라 새 문구 1개를 제안하세요.",
            userPromptTemplate: "[기존 문구]\n{currentDraft}\n\n[수정 방향]\n{reason}\n\n위 방향을 반영한 수정 문구를 하나만 제안해 주세요. 문구만 한 줄로 답해주세요.",
            outputSchema: "text",
            maxTokens: 100,
            temperature: 0.7,
            retryPolicy: { maxRetries: 1, onFail: "show_error" }
          },
          validation: { required: true, minIterations: 2 }
        },
        {
          id: "step4",
          title: "STEP 4 · 최종본 확정",
          question: "마지막으로 최종 표지 문구를 확정해보세요.",
          hint: "편집 로그의 마지막 수정본을 그대로 쓰거나, 한 번 더 손봐도 좋아요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          placeholder: "예: 친구가 건네준 이야기 한 장, 오늘 펼쳐보자.",
          validation: { required: true, minLength: 10, maxLength: 60 }
        },
        {
          id: "step5",
          title: "STEP 5 · 편집 성찰",
          question: "이번 편집 과정에서 가장 중요했던 결정은 무엇이었나요? 한두 문장으로 써보세요.",
          hint: "어떤 기준이 가장 크게 작용했는지, 반복 수정이 왜 필요했는지 성찰해보세요.",
          uiMode: "free_text",
          branch: { sourceStepId: "step3", mode: "highlight" },
          placeholder: "예: 처음 AI 초안은 멋져 보였지만 우리 학교 학생에게는 멀게 느껴졌다. '학교 맥락 반영' 기준을 적용하면서 '우리'라는 단어를 넣자 훨씬 와닿았다. 반복 수정이 없었다면 초안 그대로 썼을 것 같다.",
          validation: { required: true, minLength: 40 }
        }
      ],

      rubric: {
        axes: [
          { id: "ai_use",       label: "AI 활용",     description: "편집 기준이 명확하고 AI 활용이 그 기준에 맞았는가" },
          { id: "revision",     label: "수정과 개선", description: "수정 과정이 기준에 따라 이루어졌는가" },
          { id: "contribution", label: "자기 기여",   description: "최종 문구가 목적과 독자에 더 잘 맞게 개선되었는가" }
        ]
      },

      submit: {
        title: "편집 로그 완성!",
        message: "편집 기준을 세우고 반복 수정으로 최종 문구를 완성했어요.",
        summaryLabels: {
          step1: "편집 기준",
          step2: "AI 초안 (선택)",
          step3: "편집 로그",
          step4: "최종 문구",
          step5: "편집 성찰"
        },
        artifact: {
          bindingKey: "c_3_h_editing_log",
          template: "[편집 기준]\n{step1}\n\n[최종 표지 문구]\n\"{step4}\"\n\n[편집 로그]\n{step3}\n\n[성찰]\n{step5}"
        }
      }
    }
  }
};
