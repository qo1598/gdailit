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
      }
    }
  }
};
