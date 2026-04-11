export const MISSIONS_V3 = {
  "M-3": {
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
          {
            text: "같은 AI에게 부탁해도, 어떻게 말하느냐에 따라 결과가 달라질 때가 있어요.\n\"포스터 문구 만들어줘\"라고 짧게 말할 때와 조건을 자세히 말할 때의 결과는 같지 않을 수 있습니다."
          },
          {
            text: "AI는 사람처럼 내 마음을 알아서 이해하지 못하고,\n내가 입력한 말과 조건을 보고 결과를 만듭니다."
          },
          {
            text: "그래서 AI를 잘 쓰려면 막연하게 부탁하는 것이 아니라,\n목적에 맞게 분명하게 요청해야 해요."
          },
          {
            text: "오늘은 여러분이 직접 AI에게 부탁해 보고,\n어떤 프롬프트가 더 좋은 결과를 만드는지 비교해 볼 거예요!"
          }
        ],
        coreUnderstanding: [
          {
            id: 1,
            question: "왜 이런 활동을 해보는 것이 중요할까요?",
            answer: "AI는 내가 입력한 조건대로 결과를 만들기 때문입니다. 목적에 맞게 요청하는 힘은 AI를 똑똑하고 책임 있게 사용하는 데 꼭 필요합니다."
          },
          {
            id: 2,
            question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?",
            answer: "어떤 프롬프트가 더 구체적인지, 필요한 조건이 들어 있는지, 그리고 생성된 결과가 내 목적에 잘 맞는지를 살펴보아야 합니다."
          },
          {
            id: 3,
            question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?",
            answer: "너무 모호하게 부탁하면 엉뚱한 결과를 얻게 되어 다시 고쳐야 하거나, 잘못된 내용을 그대로 사용할 수도 있습니다."
          }
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
              { id: "easier_to_use", label: "바로 쓸 수 있어요" }
            ],
            validation: { requiredFields: ["choice", "reasons"] }
          },
          {
            id: "step4",
            title: "STEP 4 · 프롬프트 고치기",
            question: "요소를 직접 조합해서 더 좋은 프롬프트를 직접 설계해보세요.",
            uiMode: "prompt_builder",
            fields: [
              { id: "audience", label: "대상", placeholder: "예: 초등학생, 선생님, 친구들" },
              { id: "goal", label: "목적", placeholder: "예: 환경 보호를 알리려고" },
              { id: "format", label: "형식", placeholder: "예: 3줄 시, 슬로건 3개" },
              { id: "tone", label: "분위기", placeholder: "예: 밝고 희망차게, 진지하게" },
              { id: "must_include", label: "꼭 넣을 내용", placeholder: "예: 재활용, 탄소 중립" },
              { id: "length", label: "길이", placeholder: "예: 50자 이내, 3문장" }
            ],
            validation: { minFields: 3, requiredFields: ["full_text", "output_revised"] }
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
  },
  "C-2": {
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
          {
            text: "AI는 동화 그림, 포스터, 캐릭터 등 멋진 그림을 아주 빠르게 만들 수 있어요.\n하지만 자세히 보면 손가락 개수가 이상하거나, 그림자가 엉뚱한 곳에 있는 경우도 있어요."
          },
          {
            text: "이것은 AI가 실제 세상의 원리를 완벽하게 이해하지 못하고\n'그럴듯하게'만 만들기 때문이에요."
          },
          {
            text: "오늘은 여러분이 AI 그림 검사관이 되어\n그림 속 이상한 부분을 찾고, AI가 왜 그런 실수를 했는지 분석해봅시다!"
          }
        ],
        coreUnderstanding: [
          {
            id: 1,
            question: "왜 이런 활동을 해보는 것이 중요할까요?",
            answer: "AI가 만든 그림이 항상 정답은 아니라는 것을 알고, 결과를 스스로 비판적으로 판단하는 힘을 기르기 위해서예요."
          },
          {
            id: 2,
            question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?",
            answer: "AI가 사물의 모양이나 사물 간의 관계(그림자, 위치, 크기 등)를 실제와 다르게 표현한 부분을 찾아야 해요."
          },
          {
            id: 3,
            question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?",
            answer: "AI의 결과물을 무조건 믿게 되어 잘못된 정보나 왜곡된 표현을 그대로 받아들일 수 있어요."
          }
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
              { id: "no_physics", label: "물리 법칙을 이해 못했어요" }
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
              { id: "overall_better", label: "전체적으로 더 자연스러워요" }
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
  },
  "D-1": {
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
          {
            text: "이메일 앱은 스팸 메일을 자동으로 걸러주고,\n쇼핑 앱은 비슷한 상품을 묶어 추천해 줘요.\n이런 일이 가능한 건 AI가 많은 예시를 보고 규칙을 찾기 때문이에요."
          },
          {
            text: "AI는 처음부터 모든 걸 아는 게 아니라,\n데이터를 보고 규칙을 만들고, 틀리면 다시 고치면서 점점 나아져요."
          },
          {
            text: "오늘은 여러분이 직접 AI가 되어\n예시를 보고 규칙을 만들고 새로운 데이터를 분류해 볼 거예요.\n내 규칙은 얼마나 잘 맞을까요? 직접 시험해 봅시다!"
          }
        ],
        coreUnderstanding: [
          {
            id: 1,
            question: "왜 이런 활동을 해보는 것이 중요할까요?",
            answer: "AI는 데이터를 그냥 외우는 것이 아니라, 여러 예시에서 공통된 특징을 찾고 규칙을 만들어 새로운 것을 분류하거나 예측해요. 이 활동은 AI가 어떻게 학습하고 판단하는지 이해하는 데 도움이 돼요."
          },
          {
            id: 2,
            question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?",
            answer: "주어진 예시들 사이에 어떤 공통점과 차이가 있는지, 내가 만든 규칙이 새로운 데이터에도 잘 맞는지, 틀렸다면 어떤 부분을 고쳐야 하는지를 잘 살펴보아야 해요."
          },
          {
            id: 3,
            question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?",
            answer: "AI가 왜 그런 결과를 냈는지 이해하지 못하면, 틀린 분류 결과를 그대로 받아들이게 될 수 있어요. 그러면 잘못된 판단이 왜 생겼는지 알기 어렵고, 더 좋은 방법으로 고칠 지점을 찾기도 힘들어요."
          }
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
  },
  "E-1": {
    meta: {
      code: "E-1",
      title: "생활 속 AI 찾기",
      domain: "Engaging",
      ksa: { K: ["K1.4"], S: ["Self Awareness"], A: ["Curious"] }
    },
    grades: {
      lower: {
        cardCode: "E-1-L",
        performanceType: "TD",
        description: "생활 속에서 AI가 들어 있는 것을 찾아보는 미션이에요.",
        intro: [
          {
            text: "집에서 로봇청소기가 움직이거나, 휴대전화가 내 얼굴을 알아보는 것을 본 적이 있나요?\n어떤 앱은 내가 좋아할 만한 영상을 골라 보여주기도 해요.",
            emoji: "🤔"
          },
          {
            text: "이렇게 우리 주변에는 사람을 도와주는 똑똑한 기술이 숨어 있어요.\n이런 기술 가운데에는 AI가 들어 있는 것도 있어요.",
            emoji: "🌟"
          },
          {
            text: "오늘은 내가 직접 AI 찾기 탐정이 되어 생활 속 AI를 찾아볼 거예요.\n과연 어디에 AI가 숨어 있을까요? 하나씩 찾아봅시다!",
            emoji: "🔍"
          }
        ],
        coreUnderstanding: [
          {
            id: 1,
            question: "왜 이런 활동을 해보는 것이 중요할까요?",
            answer: "우리 곁에 AI가 어디 있는지 알기 위해서예요."
          },
          {
            id: 2,
            question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?",
            answer: "사람처럼 스스로 일하는 기계를 찾아보세요."
          },
          {
            id: 3,
            question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?",
            answer: "직접 손으로 움직여야 해서 불편할 수 있어요."
          }
        ],
        steps: [
          {
            id: "step1",
            title: "보기",
            question: "AI가 들어 있을 것 같은 것은 무엇인가요?",
            hint: "AI는 스스로 생각하거나 판단하는 기계예요. 내가 직접 버튼을 누르지 않아도 혼자서 움직이거나 결정하면 AI일 가능성이 높아요!",
            uiMode: "choice_cards",
            options: [
              { id: "robot_vacuum", label: "로봇청소기", emoji: "🤖", isAI: true },
              { id: "voice_assistant", label: "음성 비서", emoji: "🎙️", isAI: true },
              { id: "recommend_feed", label: "추천 영상", emoji: "📱", isAI: true },
              { id: "face_unlock", label: "얼굴 인식", emoji: "👁️", isAI: true },
              { id: "calculator", label: "계산기", emoji: "🔢", isAI: false },
              { id: "lamp", label: "전등", emoji: "💡", isAI: false }
            ],
            validation: { minSelections: 1 }
          },
          {
            id: "step2",
            title: "찾기",
            question: "내 주변에서 비슷한 것을 찾을 수 있나요?",
            hint: "집에서 가장 찾기 쉬운 AI는 스마트폰이에요! 내 얼굴을 알아보거나 말을 알아듣는 기능이 있으면 AI가 들어 있는 거예요.",
            uiMode: "photo_or_card_select",
            cardOptions: [
              { id: "home_robot_cleaner", label: "집 로봇청소기", emoji: "🤖" },
              { id: "navigation_app", label: "길 안내 앱", emoji: "🗺️" },
              { id: "voice_speaker", label: "AI 스피커", emoji: "🔊" },
              { id: "face_camera", label: "얼굴 인식 카메라", emoji: "📷" },
              { id: "recommend_app", label: "추천 앱", emoji: "📱" },
              { id: "auto_door", label: "자동문", emoji: "🚪" }
            ],
            validation: { required: true }
          },
          {
            id: "step3",
            title: "장소 고르기",
            question: "어디에서 찾았나요?",
            hint: "내가 찾은 AI가 있는 장소를 떠올려 보세요. 집 거실, 학교 도서관, 마트 등 어디서 자주 보이나요?",
            uiMode: "single_select_buttons",
            options: [
              { id: "home", label: "집", emoji: "🏠" },
              { id: "school", label: "학교", emoji: "🏫" },
              { id: "street", label: "길", emoji: "🛣️" },
              { id: "car", label: "자동차", emoji: "🚗" },
              { id: "store", label: "가게", emoji: "🏪" },
              { id: "other", label: "기타", emoji: "📌" }
            ],
            validation: { required: true }
          },
          {
            id: "step4",
            title: "도움 고르기",
            question: "이것은 어떤 도움을 주나요?",
            hint: "내가 찾은 AI가 사람 대신 무엇을 해주는지 생각해 보세요. 예를 들어 로봇청소기는 직접 청소를 해주고, 음성 비서는 질문에 대답을 해줘요.",
            uiMode: "single_select_buttons",
            options: [
              { id: "recognize", label: "알아보기", emoji: "🔍" },
              { id: "recommend", label: "추천하기", emoji: "⭐" },
              { id: "speak", label: "말해주기", emoji: "💬" },
              { id: "clean", label: "청소하기", emoji: "🧹" },
              { id: "navigate", label: "길 알려주기", emoji: "🗺️" },
              { id: "other", label: "기타", emoji: "📌" }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "생활 속 AI를 잘 찾았어요!",
          message: "이제 주변의 AI를 더 잘 알아볼 수 있어요.",
          summaryLabels: {
            step1: "내가 고른 AI 예시",
            step2: "내가 찾은 AI",
            step3: "찾은 장소",
            step4: "하는 일"
          }
        }
      },
      middle: {
        cardCode: "E-1-M",
        performanceType: "TD",
        description: "생활 속에서 AI가 들어 있는 기기나 앱을 찾고, 어떤 일을 하는지 설명하는 미션이에요.",
        intro: [
          { text: "휴대전화는 내 얼굴을 알아보기도 하고, 영상 앱은 내가 좋아할 만한 영상을 먼저 보여주기도 해요.\n내비게이션은 길을 알려주고, 번역 앱은 말이나 글을 다른 언어로 바꿔 주기도 해요." },
          { text: "이렇게 우리 생활 속에는 사람을 도와주는 여러 기술이 숨어 있어요.\n그런데 모든 전자기기가 다 AI인 것은 아니고, 어떤 것은 그냥 정해진 대로만 움직여요." },
          { text: "오늘은 생활 속에서 AI가 들어 있는 것을 찾고, 그것이 어떤 일을 하는지 살펴볼 거예요.\n내가 찾은 기술은 사람을 어떻게 돕는지 생각해 봅시다!" }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI는 이미 우리 생활 곳곳에서 사용되고 있어요. 생활 속 AI를 알아차릴 수 있어야 AI가 어떤 도움을 주는지 생각하고, 필요할 때 더 잘 활용할 수 있어요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 찾은 기기나 앱이 어떤 일을 하는지, 그리고 그 일이 단순한 작동인지 아니면 알아보거나 추천하거나 판단하는 것인지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 있는 기술을 그냥 편리한 도구로만 여기게 되고, 내가 이미 어떤 AI를 사용하고 있는지조차 잘 모를 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 예시 살펴보기",
            question: "어떤 것이 AI가 들어 있는 것 같나요?",
            hint: "AI는 스스로 생각하거나 판단하는 기계예요. 사용자가 직접 버튼을 누르지 않아도 혼자 알아보거나 추천하거나 결정한다면 AI일 가능성이 높아요!",
            uiMode: "choice_cards",
            options: [
              { id: "robot_vacuum", label: "로봇청소기", emoji: "🤖", isAI: true },
              { id: "face_unlock", label: "얼굴 인식 잠금", emoji: "👁️", isAI: true },
              { id: "translate_app", label: "번역 앱", emoji: "🌐", isAI: true },
              { id: "recommend_feed", label: "추천 영상", emoji: "📱", isAI: true },
              { id: "calculator", label: "계산기", emoji: "🔢", isAI: false },
              { id: "lamp", label: "전등", emoji: "💡", isAI: false }
            ],
            validation: { minSelections: 2 }
          },
          {
            id: "step2",
            title: "STEP 2 · 내 주변에서 찾기",
            question: "내 주변에서 비슷한 것을 찾을 수 있나요?",
            hint: "스마트폰, 집 안 AI 스피커, 학교에서 쓰는 번역 앱, 추천 영상 앱 등을 떠올려 보세요. 사진을 찍거나 카드에서 골라도 돼요!",
            uiMode: "photo_or_card_select",
            cardOptions: [
              { id: "home_robot_cleaner", label: "집 로봇청소기", emoji: "🤖" },
              { id: "navigation_app", label: "길 안내 앱", emoji: "🗺️" },
              { id: "translate_app2", label: "번역 앱", emoji: "🌐" },
              { id: "voice_speaker", label: "AI 스피커", emoji: "🔊" },
              { id: "face_camera", label: "얼굴 인식 카메라", emoji: "📷" },
              { id: "recommend_app", label: "추천 앱", emoji: "📱" }
            ],
            validation: { required: true }
          },
          {
            id: "step3",
            title: "STEP 3 · 어떤 일을 하는지 고르기",
            question: "이 기술은 사람을 어떻게 도와주나요?",
            hint: "내가 찾은 AI가 어떤 일을 대신 해주는지 생각해 보세요. 사람 대신 알아보거나, 추천하거나, 말을 알아듣거나, 길을 안내하거나, 언어를 바꿔 주거나, 스스로 움직이기도 해요.",
            uiMode: "single_select_buttons",
            options: [
              { id: "recognize", label: "알아보기", emoji: "🔍" },
              { id: "recommend", label: "추천하기", emoji: "⭐" },
              { id: "listen", label: "말 알아듣기", emoji: "🎙️" },
              { id: "navigate", label: "길 알려주기", emoji: "🗺️" },
              { id: "translate", label: "번역하기", emoji: "🌐" },
              { id: "auto_act", label: "자동으로 움직이기", emoji: "⚙️" }
            ],
            validation: { required: true }
          },
          {
            id: "step4",
            title: "STEP 4 · 짧게 설명하기",
            question: "왜 이걸 AI라고 생각했나요?",
            hint: "아래 태그 중에서 가장 맞는 것을 골라보세요. 직접 한 문장으로 써도 괜찮아요!",
            uiMode: "tag_select",
            tags: [
              { id: "recognize_people", label: "사람을 알아봐요" },
              { id: "recommend_content", label: "내가 좋아할 것을 추천해요" },
              { id: "understand_voice", label: "말을 알아들어요" },
              { id: "react_to_context", label: "상황에 따라 다르게 반응해요" }
            ],
            allowText: true,
            validation: { required: true }
          }
        ],
        submit: {
          title: "생활 속 AI를 잘 찾았어요!",
          message: "AI가 하는 일을 설명하는 힘이 생겼어요.",
          summaryLabels: { step1: "고른 AI 예시", step2: "내가 찾은 AI", step3: "하는 일", step4: "AI라고 생각한 이유" }
        }
      },
      upper: {
        cardCode: "E-1-H",
        performanceType: "SJ",
        description: "생활 속 여러 기술을 AI/비AI로 구별하고, 판단 기준을 설명하는 미션이에요.",
        intro: [
          { text: "요즘은 추천 앱, 번역 앱, 음성 비서, 내비게이션처럼 AI가 들어 있는 기술을 자주 만날 수 있어요.\n하지만 겉으로 보기엔 비슷해 보여도, 어떤 기기는 단순히 정해진 대로만 작동해요." },
          { text: "그래서 '전자기기 = AI'라고 생각하면 정확하지 않을 수 있어요.\nAI를 알아본다는 것은 단순히 이름을 맞히는 것이 아니라, 어떤 기준으로 판단하는지 생각하는 일이에요." },
          { text: "오늘은 생활 속 여러 기술을 보고, 무엇이 AI인지 아닌지 구별해 볼 거예요.\n그리고 내가 세운 기준이 왜 맞는지 설명해 봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI를 제대로 이해하려면 단순히 '편리한 기계'라고 보는 것이 아니라, 어떤 특징 때문에 AI라고 할 수 있는지 생각할 수 있어야 해요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "기술이 사람을 대신해 알아보거나 추천하거나 판단하는지, 아니면 정해진 명령만 그대로 실행하는지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "모든 똑똑한 기계를 다 AI라고 여기거나, 반대로 AI를 써도 AI인지 모른 채 지나갈 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · AI / 비AI 분류하기",
            question: "어떤 것은 AI이고, 어떤 것은 AI가 아닐까요?",
            hint: "AI는 스스로 데이터를 보고 판단하거나 추천해요. 정해진 버튼만 실행하거나 사람이 직접 조작해야 하는 것은 AI가 아닐 수 있어요.",
            uiMode: "classify_cards",
            groups: [{ id: "ai", label: "AI" }, { id: "non_ai", label: "비AI" }],
            cards: [
              { id: "calculator", label: "계산기" },
              { id: "face_unlock", label: "얼굴 인식 잠금" },
              { id: "robot_vacuum", label: "로봇청소기" },
              { id: "recommend_video", label: "추천 영상 앱" },
              { id: "auto_door", label: "자동문" },
              { id: "navigation", label: "내비게이션 앱" },
              { id: "translate_app", label: "번역 앱" },
              { id: "alarm_clock", label: "알람 시계" }
            ],
            validation: { required: true }
          },
          {
            id: "step2",
            title: "STEP 2 · 기준 고르기",
            question: "어떤 기준으로 그렇게 나누었나요?",
            hint: "AI와 비AI를 구분하는 핵심 차이는 '스스로 판단하는가'예요. 데이터를 보고 결정하거나, 상황에 따라 다르게 반응하면 AI에 가깝습니다.",
            uiMode: "multi_select_chips",
            chips: [
              { id: "recognizes", label: "사람을 알아본다" },
              { id: "recommends", label: "추천해 준다" },
              { id: "adapts", label: "상황에 따라 다르게 반응한다" },
              { id: "fixed_rule", label: "정해진 버튼만 실행한다" },
              { id: "predicts", label: "데이터를 보고 예측한다" }
            ],
            validation: { minSelections: 2 }
          },
          {
            id: "step3",
            title: "STEP 3 · 경계 사례 판단하기",
            question: "애매한 사례는 어떻게 판단할까요?",
            hint: "자동문은 센서로 움직이지만 학습하지는 않아요. 검색 엔진은 키워드를 찾지만, 일부는 맥락을 학습하기도 해요. '학습하는가?'를 기준으로 판단해 보세요.",
            uiMode: "per_case_judge",
            judgmentOptions: [{ id: "ai", label: "AI" }, { id: "non_ai", label: "비AI" }],
            reasonOptions: [
              { id: "recognizes", label: "사람·사물을 알아봐요" },
              { id: "adapts", label: "상황에 따라 달라져요" },
              { id: "fixed_only", label: "정해진 규칙만 실행해요" },
              { id: "no_learning", label: "학습하지 않아요" }
            ],
            cases: [
              { id: "auto_door", title: "자동문", description: "사람이 가까이 오면 문이 열려요. 하지만 사람을 직접 알아보지는 않아요." },
              { id: "basic_search", title: "단순 검색 엔진", description: "키워드를 입력하면 저장된 목록에서 결과를 찾아줘요. 내 검색 습관을 학습하지는 않아요." }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "AI 구별 능력 완성!",
          message: "AI와 비AI를 기준으로 판단하는 힘이 생겼어요.",
          summaryLabels: { step1: "분류 결과", step2: "판단 기준", step3: "경계 사례 판단" }
        }
      }
    }
  },
  "E-2": {
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
            uiMode: "judge_qa_cards",
            qaCards: [
              { id: "q1", question: "바나나는 무슨 색인가요?", answer: "보통 노란색이에요.", correctJudgment: "correct" },
              { id: "q2", question: "고양이는 다리가 몇 개인가요?", answer: "고양이는 보통 여섯 개의 다리를 가져요.", correctJudgment: "strange" },
              { id: "q3", question: "사과는 나무에서 자라나요?", answer: "네, 사과는 사과나무에서 자라요.", correctJudgment: "correct" },
              { id: "q4", question: "물고기는 하늘을 날 수 있나요?", answer: "네, 물고기는 날개가 있어서 하늘을 날 수 있어요.", correctJudgment: "strange" }
            ],
            judgeOptions: [{ id: "correct", label: "맞는 답" }, { id: "strange", label: "이상한 답" }],
            validation: { required: true }
          },
          {
            id: "step2",
            title: "STEP 2 · 왜 이상한지 고르기",
            question: "왜 이상하다고 생각했나요?",
            hint: "이상한 답을 고른 이유를 태그에서 골라보세요. 여러 개가 맞을 수도 있어요!",
            uiMode: "single_select_buttons",
            options: [
              { id: "different_from_what_i_know", label: "내가 아는 것과 달라요", emoji: "🤔" },
              { id: "sounds_odd", label: "말이 이상해요", emoji: "❓" },
              { id: "not_fact", label: "사실이 아닌 것 같아요", emoji: "❌" }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "이상한 답을 잘 찾았어요!",
          message: "AI 답도 한 번 더 확인하는 습관이 생겼어요.",
          summaryLabels: { step1: "판단 결과", step2: "이상하다고 생각한 이유" }
        }
      },
      middle: {
        cardCode: "E-2-M",
        performanceType: "SJ",
        description: "AI 답변의 문제를 찾고, 왜 다시 확인해야 하는지 설명하는 미션이에요.",
        intro: [
          { text: "AI는 질문에 빨리 답하지만, 가끔 사실과 다른 내용을 말하기도 해요.\n어떤 답은 얼핏 그럴듯해 보여서 더 헷갈릴 수 있어요." },
          { text: "그래서 AI를 사용할 때는 답을 그냥 믿지 말고, 한 번 더 살펴보는 습관이 중요해요.\n틀린 답을 찾는 것뿐 아니라, 왜 문제가 되는지도 생각해야 해요." },
          { text: "오늘은 AI 답을 보고 무엇이 문제인지 찾아볼 거예요.\n그리고 왜 다시 확인해야 하는지도 생각해 봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI 답은 편리하지만 항상 맞지는 않아요. 틀린 답을 알아보고 다시 확인하는 습관은 AI를 책임 있게 사용하는 데 중요해요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "답이 사실과 맞는지, 문장이 그럴듯해 보여도 틀린 내용은 없는지, 다시 확인이 필요한지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "그럴듯한 말을 그대로 믿게 되고, 틀린 정보를 다른 사람에게 다시 말할 수도 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 문제 찾고 대처하기",
            question: "어떤 부분이 이상하거나 틀렸나요? 그리고 어떻게 해야 할까요?",
            hint: "각 AI 답을 꼼꼼히 읽고, 문제점과 대처 방법을 함께 골라보세요. 사실이 틀렸는지, 없는 정보를 만든 건지, 근거 없이 확실하게 말한 건지 살펴보세요.",
            uiMode: "per_card_tags",
            cards: [
              { id: "c1", question: "세종대왕은 언제 태어났나요?", answer: "세종대왕은 1397년에 태어났고, 한글을 만들었어요. 그는 조선 최초의 왕이에요." },
              { id: "c2", question: "독도는 어느 나라 땅인가요?", answer: "독도는 대한민국의 영토로, 경상북도 울릉군에 속해 있어요." },
              { id: "c3", question: "에펠탑은 어디에 있나요?", answer: "에펠탑은 영국 런던에 있는 유명한 건축물이에요." },
              { id: "c4", question: "광합성은 무엇인가요?", answer: "광합성은 식물이 햇빛과 이산화탄소를 이용해 산소와 에너지를 만드는 과정이에요." }
            ],
            problemOptions: [
              { id: "wrong_fact", label: "사실이 틀린 것 같아요" },
              { id: "made_up_info", label: "없는 정보를 만든 것 같아요" },
              { id: "no_evidence", label: "근거 없이 확실하게 말했어요" }
            ],
            actionOptions: [
              { id: "search_again", label: "다시 검색하기" },
              { id: "ask_adult", label: "어른에게 확인하기" },
              { id: "compare_sources", label: "다른 자료와 비교하기" },
              { id: "do_not_use", label: "그대로 쓰지 않기" }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "AI 답 검토 완료!",
          message: "AI 답변의 문제를 찾고 대처하는 힘이 생겼어요.",
          summaryLabels: { step1: "카드별 문제 및 대처" }
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
            title: "STEP 1 · AI 답 처리 방식 판단하기",
            question: "이 답은 그대로 써도 될까요, 고쳐야 할까요, 다시 확인해야 할까요?",
            hint: "각 AI 응답을 읽고 '수용 / 수정 / 재검증' 중 하나를 고르세요. 그 다음 왜 그렇게 판단했는지 이유와 계획을 함께 골라보세요.",
            uiMode: "per_case_judge",
            judgmentOptions: [
              { id: "use", label: "수용 (그대로 사용)" },
              { id: "revise", label: "수정 (고쳐서 사용)" },
              { id: "verify", label: "재검증 (다시 확인 필요)" }
            ],
            reasonOptions: [
              { id: "uncertain_fact", label: "사실이 불확실해요" },
              { id: "partly_correct", label: "일부만 맞아요" },
              { id: "no_evidence", label: "근거가 없어요" },
              { id: "unclear_expression", label: "표현이 애매해요" },
              { id: "mostly_correct", label: "거의 맞아요" }
            ],
            reasonMulti: true,
            planOptions: [
              { id: "search_more", label: "더 찾아보기" },
              { id: "compare_sources", label: "다른 자료 비교" },
              { id: "rewrite", label: "내 말로 다시 쓰기" },
              { id: "ask_human", label: "전문가·어른에게 확인" },
              { id: "remove_uncertain_part", label: "불확실한 부분 빼기" }
            ],
            cases: [
              { id: "r1", title: "AI 응답 1", description: "광합성은 식물이 햇빛을 이용해 이산화탄소와 물로 산소와 포도당을 만드는 과정이에요. 모든 식물은 광합성을 하며, 이 과정 없이는 살 수 없어요." },
              { id: "r2", title: "AI 응답 2", description: "조선시대의 과학기술은 매우 발달했으며, 세종대왕이 발명한 수많은 기계들이 현대 기술의 기반이 되었어요. 특히 그가 만든 컴퓨터는 당시 세계 최초였어요." },
              { id: "r3", title: "AI 응답 3", description: "독도는 대한민국 경상북도 울릉군에 속한 섬으로, 동해에 위치해 있어요. 행정구역상 울릉읍 독도리입니다." }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "AI 답 처리 능력 완성!",
          message: "AI 답을 수용·수정·재검증으로 나누는 판단력이 생겼어요.",
          summaryLabels: { step1: "응답별 판단 결과" }
        }
      }
    }
  },
  "E-3": {
    meta: {
      code: "E-3",
      title: "왜 나한테 이걸 보여줄까?",
      domain: "Engaging",
      ksa: { K: ["K1.1", "K5.1"], S: ["Self and Social Awareness"], A: ["Curious"] }
    },
    grades: {
      lower: {
        cardCode: "E-3-L",
        performanceType: "TD",
        description: "추천된 것과 내가 좋아하는 것 사이의 비슷한 점을 찾는 미션이에요.",
        intro: [
          { text: "영상 앱이나 쇼핑 앱은 내가 좋아할 것 같은 것을 먼저 보여줄 때가 있어요.\n그래서 어떤 것은 '어? 내가 좋아하는 거네!' 하고 느껴질 수 있어요." },
          { text: "이런 추천은 그냥 우연히 나오는 것이 아니라, 내가 본 것과 비슷한 것을 보여주는 경우가 많아요.\n추천은 편리하지만, 왜 이걸 보여주는지 생각해 보는 것도 중요해요." },
          { text: "오늘은 추천 화면을 보고 왜 이런 것이 나왔는지 생각해 볼 거예요.\n내가 좋아하는 것과 추천의 관계를 찾아봅시다!" }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 우리 생활에서 자주 만나는 AI 기능이에요. 추천이 어떻게 보이는지 알아차리는 것은 AI를 이해하는 첫걸음이에요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 좋아하는 것과 추천된 것 사이에 비슷한 점이 있는지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 그냥 우연이라고 생각하고, AI가 나에게 맞춰 보여주고 있다는 점을 놓칠 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 내 취향 고르기",
            question: "내가 좋아하는 것을 2개 골라보세요.",
            hint: "평소에 영상이나 책에서 자주 찾아보는 주제를 골라보세요. 내 취향이 추천에 영향을 준답니다!",
            uiMode: "choice_cards",
            options: [
              { id: "animals", label: "동물", emoji: "🐾", isAI: true },
              { id: "cars", label: "자동차", emoji: "🚗", isAI: true },
              { id: "dinosaurs", label: "공룡", emoji: "🦕", isAI: true },
              { id: "picture_books", label: "그림책", emoji: "📚", isAI: true },
              { id: "soccer", label: "축구", emoji: "⚽", isAI: true },
              { id: "cooking", label: "요리", emoji: "🍳", isAI: true }
            ],
            validation: { minSelections: 2 }
          },
          {
            id: "step2",
            title: "STEP 2 · 비슷한 추천 고르기",
            question: "어떤 추천이 내 취향과 비슷한가요?",
            hint: "앱이 나에게 추천한 카드들이에요. 내가 고른 취향과 비슷한 것이 있나요? 2개를 골라보세요!",
            uiMode: "choice_cards",
            options: [
              { id: "rec_dog_video", label: "귀여운 강아지 영상", emoji: "🐶", isAI: true },
              { id: "rec_race_car", label: "자동차 경주 영상", emoji: "🏎️", isAI: true },
              { id: "rec_dino_doc", label: "공룡 다큐멘터리", emoji: "🦖", isAI: true },
              { id: "rec_cooking_show", label: "어린이 요리 프로그램", emoji: "👨‍🍳", isAI: true },
              { id: "rec_math", label: "수학 풀기 영상", emoji: "📐", isAI: false },
              { id: "rec_news", label: "어른용 뉴스", emoji: "📺", isAI: false }
            ],
            validation: { minSelections: 2 }
          }
        ],
        submit: {
          title: "추천 비슷함을 잘 찾았어요!",
          message: "AI가 내 취향을 보고 추천한다는 걸 알았어요.",
          summaryLabels: { step1: "내 취향", step2: "고른 추천" }
        }
      },
      middle: {
        cardCode: "E-3-M",
        performanceType: "SJ",
        description: "추천 결과를 보고 왜 이런 추천이 나왔는지 추측하는 미션이에요.",
        intro: [
          { text: "영상 앱, 쇼핑 앱, 음악 앱은 내가 좋아할 만한 것을 추천해 줘요.\n어떤 추천은 마음에 들지만, 어떤 추천은 왜 나왔는지 궁금할 때도 있어요." },
          { text: "추천은 내가 본 것, 선택한 것, 머문 것과 비슷한 것을 바탕으로 나올 수 있어요.\n그래서 추천은 편리하지만, 내 관심이 한쪽으로 몰릴 수도 있어요." },
          { text: "오늘은 추천 화면을 보고 왜 이런 추천이 나왔을지 생각해 볼 거예요.\n추천이 어떻게 나를 따라오는지 살펴봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 우리가 자주 만나는 AI 기능이에요. 추천이 왜 나왔는지 생각해 볼 수 있어야 AI가 내 선택에 어떤 영향을 주는지 이해할 수 있어요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "내가 전에 본 것과 지금 추천된 것이 어떻게 비슷한지, 어떤 흔적 때문에 이런 추천이 나왔는지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 무심코 받아들이고, 비슷한 것만 계속 보게 되거나 생각이 한쪽으로 쏠릴 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 추천 이유 연결하기",
            question: "왜 이런 추천이 나왔을까요? 이전에 본 것과 연결해보세요.",
            hint: "추천은 보통 내가 전에 오래 본 것, 자주 선택한 것, 주제가 비슷한 것에서 나와요. 각 추천 카드가 어떤 이전 활동과 연결될지 골라보세요!",
            uiMode: "match_select",
            historyCards: [
              { id: "h1", label: "강아지 훈련 영상" },
              { id: "h2", label: "축구 하이라이트" },
              { id: "h3", label: "어린이 과학 실험" }
            ],
            recommendations: [
              { id: "rec1", label: "고양이 돌보기 영상", description: "반려동물 관련 콘텐츠예요." },
              { id: "rec2", label: "농구 경기 영상", description: "스포츠 관련 콘텐츠예요." },
              { id: "rec3", label: "자연 다큐멘터리", description: "동물과 자연 관련 콘텐츠예요." },
              { id: "rec4", label: "어린이 발명 대회", description: "과학·발명 관련 콘텐츠예요." }
            ],
            reasonOptions: [
              { id: "same_topic", label: "비슷한 주제" },
              { id: "same_character", label: "같은 등장인물/종류" },
              { id: "same_mood", label: "비슷한 분위기" },
              { id: "watched_long", label: "오래 본 것" },
              { id: "chosen_often", label: "자주 고른 것" }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "추천 이유 분석 완료!",
          message: "추천과 이전 활동의 관계를 찾는 힘이 생겼어요.",
          summaryLabels: { step1: "추천-이전기록 연결 결과" }
        }
      },
      upper: {
        cardCode: "E-3-H",
        performanceType: "SJ",
        description: "추천 기능의 장점과 한계를 비교하여 판단하는 미션이에요.",
        intro: [
          { text: "추천 기능은 내가 좋아할 만한 것을 빠르게 찾게 도와줘요.\n그래서 편리하지만, 비슷한 것만 계속 보여 줄 수도 있어요." },
          { text: "어떤 추천은 시간을 아껴 주지만, 어떤 추천은 새로운 것을 볼 기회를 줄일 수도 있어요.\n추천은 내 선택을 도와주기도 하고, 내 선택을 좁히기도 할 수 있어요." },
          { text: "오늘은 추천의 좋은 점과 아쉬운 점을 함께 살펴볼 거예요.\n추천을 받을 때 무엇을 조심해야 하는지 생각해 봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "추천은 편리하지만, 내가 보는 정보와 관심을 바꿀 수도 있어요. 추천의 좋은 점과 한계를 함께 생각할 수 있어야 더 주도적으로 AI를 사용할 수 있어요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "추천이 얼마나 편리한지뿐 아니라, 비슷한 것만 계속 보여 주는지, 새로운 선택을 막지는 않는지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "추천을 무조건 좋은 것으로만 생각하고, 다양한 정보나 새로운 선택을 놓칠 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 좋은 점 고르기",
            question: "추천 기능의 좋은 점은 무엇인가요?",
            hint: "추천이 내 생활에서 어떤 도움을 주는지 생각해 보세요. 시간이 절약되거나, 관심 있는 것을 더 쉽게 찾을 수 있는 경험이 있었나요?",
            uiMode: "multi_select_chips",
            chips: [
              { id: "time_saving", label: "시간을 아껴줘요" },
              { id: "easy_to_find", label: "좋아하는 것 찾기 쉬워요" },
              { id: "continue_interest", label: "관심 있는 것을 계속 볼 수 있어요" },
              { id: "personalized", label: "나에게 맞춰줘요" }
            ],
            validation: { minSelections: 1 }
          },
          {
            id: "step2",
            title: "STEP 2 · 아쉬운 점 고르기",
            question: "추천 기능의 아쉬운 점은 무엇인가요?",
            hint: "추천이 항상 좋은 것만은 아니에요. 비슷한 것만 계속 보게 되면 어떤 문제가 생길 수 있을까요?",
            uiMode: "multi_select_chips",
            chips: [
              { id: "similar_only", label: "비슷한 것만 보게 돼요" },
              { id: "miss_new", label: "새로운 것을 놓쳐요" },
              { id: "narrow_view", label: "생각이 좁아질 수 있어요" },
              { id: "too_much", label: "너무 많이 보게 돼요" }
            ],
            validation: { minSelections: 1 }
          },
          {
            id: "step3",
            title: "STEP 3 · 상황별 판단하기",
            question: "추천은 언제 도움이 되고, 언제 조심해야 할까요?",
            hint: "상황마다 추천이 도움이 될 수도, 오히려 방해가 될 수도 있어요. 각 상황을 보고 판단해 보세요.",
            uiMode: "per_case_judge",
            judgmentOptions: [
              { id: "helpful", label: "도움이 돼요" },
              { id: "careful", label: "조심해야 해요" }
            ],
            reasonOptions: [
              { id: "saves_time", label: "시간을 아껴줘요" },
              { id: "narrows_choices", label: "선택을 좁혀요" },
              { id: "increases_variety", label: "다양성을 높여요" },
              { id: "creates_habit", label: "습관이 생겨요" }
            ],
            cases: [
              { id: "s1", title: "좋아하는 가수 음악을 계속 찾을 때", description: "음악 앱이 같은 가수의 다른 음악을 추천해 줘요." },
              { id: "s2", title: "숙제 주제를 조사할 때", description: "검색하면 항상 내가 좋아하는 내용만 나와서 다른 시각은 보기 어려워요." },
              { id: "s3", title: "새로운 취미를 찾고 싶을 때", description: "늘 보던 것만 추천되어서 새로운 것을 발견하기 어려워요." }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "추천 판단 능력 완성!",
          message: "추천의 장점과 한계를 함께 생각하는 힘이 생겼어요.",
          summaryLabels: { step1: "추천의 좋은 점", step2: "추천의 아쉬운 점", step3: "상황별 판단" }
        }
      }
    }
  },
  "E-4": {
    meta: {
      code: "E-4",
      title: "모두에게 똑같이 잘할까?",
      domain: "Engaging",
      ksa: { K: ["K2.5", "K5.4"], S: ["Critical Thinking"], A: ["Empathetic"] }
    },
    grades: {
      lower: {
        cardCode: "E-4-L",
        performanceType: "TD",
        description: "같은 AI 기술도 사람에 따라 다르게 느껴질 수 있음을 알아보는 미션이에요.",
        intro: [
          { text: "어떤 AI는 사람의 얼굴이나 목소리를 알아보기도 해요.\n그런데 어떤 사람은 잘 되고, 어떤 사람은 잘 안 될 때도 있어요." },
          { text: "그래서 같은 기술이라도 모두에게 똑같이 편한 것은 아닐 수 있어요.\n누군가에게는 쉬운 것이 다른 사람에게는 어려울 수도 있어요." },
          { text: "오늘은 같은 기술을 서로 다른 사람이 사용할 때 어떤 점이 다를지 살펴볼 거예요.\n누가 더 불편할 수 있을지 생각해 봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 모두에게 똑같이 잘 맞는다고 생각하면 안 돼요. 사람마다 느끼는 편리함과 불편함이 다를 수 있어요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "같은 기술을 써도 누군가는 편하고 누군가는 불편할 수 있다는 점을 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "어떤 사람은 사용하기 어려운 기술인데도 모두에게 괜찮다고 생각할 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 다른 점 찾기",
            question: "두 사람 사이에서 어떤 점이 다를까요?",
            hint: "AI 얼굴 인식 기술을 두 사람이 사용하고 있어요. 어떤 차이가 있을 때 한 사람은 잘 인식되고 다른 사람은 잘 안 될 수 있을까요?",
            uiMode: "choice_cards",
            options: [
              { id: "voice_lang", label: "말하는 언어가 달라요", emoji: "🗣️", isAI: true },
              { id: "face_differ", label: "얼굴 모습이 달라요", emoji: "👤", isAI: true },
              { id: "usage_freq", label: "사용 경험이 달라요", emoji: "📱", isAI: true },
              { id: "wearing_glasses", label: "안경을 쓰거나 안 써요", emoji: "👓", isAI: true },
              { id: "same_age", label: "나이가 같아요", emoji: "🎂", isAI: false },
              { id: "same_device", label: "같은 기기를 써요", emoji: "📱", isAI: false }
            ],
            validation: { minSelections: 1 }
          },
          {
            id: "step2",
            title: "STEP 2 · 불편한 사람 고르기",
            question: "더 불편할 것 같은 사람은 어느 쪽인가요?",
            hint: "AI가 더 많은 데이터를 학습한 유형의 사람은 잘 인식되는 경우가 많아요. 반면 데이터가 적은 유형의 사람은 잘 인식되지 않을 수 있어요.",
            uiMode: "single_select_buttons",
            options: [
              { id: "person_a", label: "많이 학습된 사람과 비슷한 사람", emoji: "😊" },
              { id: "person_b", label: "학습 데이터가 적은 유형의 사람", emoji: "😟" }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "차이를 잘 찾았어요!",
          message: "AI가 모두에게 똑같지 않을 수 있다는 걸 알았어요.",
          summaryLabels: { step1: "찾은 차이점", step2: "더 불편한 사람" }
        }
      },
      middle: {
        cardCode: "E-4-M",
        performanceType: "SJ",
        description: "AI 사용 사례를 보고 누가 더 불편할 수 있는지 찾고 이유를 설명하는 미션이에요.",
        intro: [
          { text: "어떤 AI는 사람을 도와주지만, 모든 사람에게 똑같이 편하지 않을 수 있어요.\n얼굴을 알아보는 기술, 목소리를 알아듣는 기술, 글을 읽어 주는 기술도 사람마다 다르게 느껴질 수 있어요." },
          { text: "누군가에게는 잘 맞지만 다른 사람에게는 덜 편하거나 잘 작동하지 않을 수 있어요.\n그래서 AI를 볼 때는 '잘 된다'뿐 아니라 '누가 불편할 수 있는가'도 생각해야 해요." },
          { text: "오늘은 사례를 보고 누가 더 불편할 수 있는지 찾아볼 거예요.\n그리고 왜 그런지 생각해 봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 편리한 기술이어도 누군가에게는 잘 맞지 않을 수 있어요. 누구에게 불편할 수 있는지 생각하는 것은 더 공정한 AI를 이해하는 데 중요해요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "기술이 어떤 사람에게는 왜 더 어렵거나 덜 잘 작동할 수 있는지, 사용자의 차이를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "모든 사람에게 똑같이 괜찮다고 생각해서, 누군가가 겪는 불편을 놓칠 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 누가 더 불편할까요?",
            question: "각 사례에서 누가 더 불편할 수 있는지 찾고, 이유를 골라보세요.",
            hint: "AI가 학습한 데이터에 어떤 사람들이 많이 포함되었는지가 중요해요. 데이터에 없는 유형의 사람은 잘 인식되지 않거나 불편할 수 있어요.",
            uiMode: "per_case_judge",
            judgmentOptions: [
              { id: "elderly", label: "어르신" },
              { id: "non_native", label: "외국어 사용자" },
              { id: "disability", label: "신체 차이가 있는 사람" },
              { id: "child", label: "어린이" }
            ],
            reasonOptions: [
              { id: "not_recognized", label: "잘 알아듣지 못할 수 있어요" },
              { id: "hard_to_see_or_use", label: "보기 어렵거나 쓰기 어려워요" },
              { id: "not_reflected", label: "내 모습·상황이 반영 안 됐어요" },
              { id: "too_complex", label: "사용하기 복잡해요" }
            ],
            allowText: true,
            cases: [
              { id: "c1", title: "얼굴 인식 출입 시스템", description: "회사 출입구에서 직원 얼굴을 인식해 문을 열어주는 시스템이에요. 특정 외모나 조명 환경에서는 잘 작동하지 않을 수 있어요." },
              { id: "c2", title: "음성 인식 안내 서비스", description: "병원에서 음성으로 예약을 안내해 주는 시스템이에요. 다양한 억양이나 목소리 특성에 따라 인식률이 달라질 수 있어요." },
              { id: "c3", title: "자동 자막 생성 서비스", description: "영상 콘텐츠에 자동으로 자막을 만들어 주는 서비스예요. 특수한 발음이나 배경 소음이 있으면 정확도가 낮아질 수 있어요." }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "공정성 탐색 완료!",
          message: "AI가 누구에게 불편할 수 있는지 생각하는 힘이 생겼어요.",
          summaryLabels: { step1: "사례별 판단 결과" }
        }
      },
      upper: {
        cardCode: "E-4-H",
        performanceType: "SJ",
        description: "AI의 편향 가능성을 판단하고, 더 공정한 개선 방향을 제안하는 미션이에요.",
        intro: [
          { text: "AI는 사람을 도와주는 기술이지만, 어떤 사람에게는 더 잘 맞고 어떤 사람에게는 덜 잘 맞을 수 있어요.\n이런 차이는 데이터, 설계, 사용 환경 때문에 생길 수 있어요." },
          { text: "그래서 AI를 평가할 때는 '정확한가?'뿐 아니라 '누구에게 불공정할 수 있는가?'도 함께 봐야 해요.\n문제가 보인다면 그냥 멈추는 것이 아니라 더 공정하게 바꾸는 방법도 생각해야 해요." },
          { text: "오늘은 AI 사례를 보고 어떤 편향 가능성이 있는지 판단해 볼 거예요.\n그리고 더 공정하게 만들려면 무엇이 필요할지 제안해 봅시다." }
        ],
        coreUnderstanding: [
          { id: 1, question: "왜 이런 활동을 해보는 것이 중요할까요?", answer: "AI가 누군가에게 불공정하게 작동할 수 있다는 점을 이해해야, 더 나은 기술을 생각하고 책임 있게 사용할 수 있어요." },
          { id: 2, question: "이 활동에서는 어떤 점을 잘 살펴보아야 할까요?", answer: "어떤 사용자가 불리할 수 있는지, 왜 그런 차이가 생기는지, 그리고 어떻게 하면 더 공정하게 만들 수 있을지를 잘 살펴보아야 해요." },
          { id: 3, question: "이 점을 생각하지 않으면 어떤 문제가 생길 수 있을까요?", answer: "AI가 편리하다는 이유만으로 문제를 그냥 넘기게 되고, 누군가의 불편이나 불공정을 계속하게 될 수 있어요." }
        ],
        steps: [
          {
            id: "step1",
            title: "STEP 1 · 편향 가능성 분석하기",
            question: "누가 불리할 수 있는지, 왜 그런지, 어떻게 개선할 수 있는지 판단해보세요.",
            hint: "AI 편향은 대부분 데이터 문제에서 시작해요. 어떤 사람들이 학습 데이터에 적게 포함되어 있으면 AI가 그 사람들에게 잘 맞지 않을 수 있어요. 원인과 개선 방향을 함께 생각해 보세요.",
            uiMode: "per_case_judge",
            judgmentOptions: [
              { id: "women", label: "여성" },
              { id: "elderly", label: "어르신" },
              { id: "dark_skin", label: "피부색이 어두운 사람" },
              { id: "non_native", label: "비영어권 사용자" },
              { id: "disability", label: "장애가 있는 사용자" }
            ],
            reasonOptions: [
              { id: "limited_data", label: "데이터가 충분하지 않아요" },
              { id: "not_diverse", label: "다양한 사용자가 반영 안 됐어요" },
              { id: "single_standard", label: "한쪽 기준만 적용됐어요" },
              { id: "simple_design", label: "설계가 단순해요" }
            ],
            reasonMulti: true,
            planOptions: [
              { id: "more_diverse_data", label: "더 다양한 데이터 넣기" },
              { id: "test_more_users", label: "여러 사용자로 시험하기" },
              { id: "human_review", label: "사람이 다시 확인하기" },
              { id: "multi_option_support", label: "다른 방식도 함께 제공하기" }
            ],
            planMulti: true,
            cases: [
              { id: "c1", title: "AI 얼굴 인식 보안 카메라", description: "공공장소 보안 카메라가 AI로 사람을 식별해요. 하지만 특정 피부색에서 오인식률이 높다는 보고가 있어요." },
              { id: "c2", title: "AI 채용 서류 심사", description: "기업이 AI로 지원서를 심사해요. 과거 채용 데이터를 학습했는데, 그 데이터에서 특정 집단이 불이익을 받은 경우가 있어요." },
              { id: "c3", title: "AI 음성 번역 서비스", description: "음성을 실시간으로 번역해 주는 서비스예요. 표준어 발음은 잘 인식하지만 지역 방언이나 억양에서 정확도가 크게 떨어져요." }
            ],
            validation: { required: true }
          }
        ],
        submit: {
          title: "AI 공정성 탐구 완료!",
          message: "편향 가능성을 판단하고 개선 방향을 제안하는 힘이 생겼어요.",
          summaryLabels: { step1: "사례별 편향 분석 결과" }
        }
      }
    }
  }
};
