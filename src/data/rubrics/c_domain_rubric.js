// C영역 루브릭 데이터 (v1 기준)
// 출처: docs/C영역_평가루브릭_v1.md
// C영역 평가 축: A(의도 설정), B(AI 협업), C(정제와 개선), D(자기 기여), E(책임 있는 공유)

export const C_AXIS_NAMES = {
  A: '의도 설정',
  B: 'AI 협업',
  C: '정제와 개선',
  D: '자기 기여',
  E: '책임 있는 공유',
};

export const C_RUBRICS = {

  // =========================================================================
  // C-1-L · 도서관 그림책 작가 (1-2학년)
  // 역량 축: A + B + D | 준거 4개
  // =========================================================================
  'C-1-L': {
    cardCode: 'C-1-L',
    missionName: '도서관 그림책 작가',
    gradeBand: 'L',
    weights: { A: 0.25, B: 0.25, D: 0.50 },
    expectedLevel: '2수준 이상',
    axes: {
      A: [
        {
          id: 'a1',
          name: '창작 방향 설정',
          dataField: 'step1(주인공) + step2(장소)',
          levels: {
            0: '둘 다 null 또는 미응답',
            1: '하나만 선택 (주인공 또는 장소)',
            2: '둘 다 선택했으나 조합이 부자연스러움',
            3: '주인공 + 장소 모두 선택, 조합 자연스러움',
            4: '모두 선택 + step3 첫 문장에 주인공·장소 반영',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: 'AI 후보 선택 판단',
          dataField: 'step4 (ai_option_picker)',
          levels: {
            0: 'null 또는 미응답',
            1: 'AI 후보 선택했으나 regenerate 0회 + customInput 미사용 (무비판 수용)',
            2: 'AI 후보 선택 + regenerate 1회 이상',
            3: 'AI 후보 선택 또는 customInput 사용 + step3 첫 문장의 주인공·장소와 일관',
            4: 'customInput 사용 + step3 일관 + step1-step2 요소 명시적 반영',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '첫 문장 자기 작성',
          dataField: 'step3 (free_text)',
          levels: {
            0: '빈칸 또는 10자 미만',
            1: '10자 이상이나 step1·step2 선택과 무관',
            2: '10자 이상 + 주인공 또는 장소 하나만 반영',
            3: '10자 이상 + step1(주인공)·step2(장소) 요소가 문장에 반영',
            4: '주인공·장소 모두 반영 + 감각 묘사·감정 표현 포함',
          },
        },
        {
          id: 'd2',
          name: '마무리 문장 자기 작성',
          dataField: 'step5(마무리) + step6(남기고 싶은 문장+이유)',
          levels: {
            0: 'step5·step6 모두 빈칸',
            1: 'step5만 작성, step6 빈칸 또는 "모르겠다"',
            2: 'step5 + step6 작성이나 이유가 "좋아서" 수준',
            3: 'step5(마무리 문장) + step6(남기고 싶은 문장 + 구체적 이유) 모두 작성',
            4: 'step5+step6 + 이유가 step3 첫 문장·step4와 일관된 서사적 마무리',
          },
        },
      ],
    },
  },

  // =========================================================================
  // C-1-M · 학급 신문 이야기 코너 기자 (3-4학년)
  // 역량 축: A + B + C + D | 준거 4개
  // =========================================================================
  'C-1-M': {
    cardCode: 'C-1-M',
    missionName: '학급 신문 이야기 코너 기자',
    gradeBand: 'M',
    weights: { A: 0.25, B: 0.25, C: 0.25, D: 0.25 },
    expectedLevel: '2~3수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '독자·주제 설정',
          dataField: 'step1 (multi_select_chips)',
          levels: {
            0: '빈 배열 또는 미응답',
            1: '1개만 선택',
            2: '1~2개 선택',
            3: '1~2개 선택 + 주제 키워드가 step4 초안에 반영',
            4: '선택 + step4 초안에 주제·독자(반 친구들)가 명시적으로 반영',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: 'AI 줄거리 비교·선택',
          dataField: 'step3 (option_adopt_hold)',
          levels: {
            0: 'step3 미응답 또는 모두 같은 판정',
            1: '채택·보류 구분 시도했으나 이유 빈칸',
            2: '채택·보류 구분 + 이유 하나만 기술',
            3: '차등 판정 + 채택 이유·보류 이유 모두 기술',
            4: '채택·보류 + 독자 적합성·흐름·결말 등 구체 기준으로 이유 차별화',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '후보 기준 적용',
          dataField: 'step3 채택/보류 이유 분석',
          levels: {
            0: '모두 같은 judgment',
            1: 'judgment는 다르나 이유 미선택',
            2: '후보별 다른 judgment',
            3: '후보별 다른 judgment + 이유 1개 이상 (독자 적합·흐름·결말 등)',
            4: '이유가 step1 주제·독자와 명시적으로 연결',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '내 말로 재구성',
          dataField: 'step4 (free_text_with_refs)',
          levels: {
            0: '빈칸 또는 80자 미만',
            1: '80자 이상이나 AI 줄거리와 80% 이상 동일 (복사)',
            2: '80자 이상 + 일부 표현 변경 (이름·장소)',
            3: '80자 이상 + AI 줄거리와 명확히 다른 표현·구조 (이름·장소·문장 재배열 등)',
            4: '재구성 + 독자(반 친구들) 수준에 맞춘 어휘·분위기 조절 흔적',
          },
        },
      ],
    },
  },

  // =========================================================================
  // C-1-H · 학교 축제 웹소설 부스 기획자 (5-6학년)
  // 역량 축: A + B + D + E | 준거 5개
  // =========================================================================
  'C-1-H': {
    cardCode: 'C-1-H',
    missionName: '학교 축제 웹소설 부스 기획자',
    gradeBand: 'H',
    weights: { A: 0.20, B: 0.35, D: 0.20, E: 0.25 },
    expectedLevel: '3수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '기획 기준 수립',
          dataField: 'step1 (multi_free_text) — audience·genre·include·avoid',
          levels: {
            0: '0~1개 작성',
            1: '2~3개 작성',
            2: '4개 작성이나 include와 avoid 모순',
            3: '4개 모두 작성 + include와 avoid 모순 없음',
            4: '4개 모두 + 독자·장르와 include/avoid가 유기적으로 연결',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: 'AI 대화 전략',
          dataField: 'step2 + step3 (ai_chat_turn)',
          levels: {
            0: 'step2·step3 모두 input 빈칸',
            1: 'input 있으나 step1 기준과 무관한 질문',
            2: 'input이 step1 기준 일부 참조',
            3: 'input이 step1 기준 명시적 참조 + 2차(step3)가 1차(step2) 결과를 발전',
            4: '1·2차 질문이 전략적으로 분리(예: 1차=줄거리, 2차=갈등/반전) + 기준 참조',
          },
        },
        {
          id: 'b2',
          name: 'AI 제안 반영 판단',
          dataField: 'step2·step3 apply 입력',
          levels: {
            0: 'apply 빈칸',
            1: '"좋아요" 수준, 구체적 반영 방향 없음',
            2: '반영할 아이디어 지목',
            3: '반영 방향 + 변경·순화 이유 구체 서술',
            4: 'AI 제안의 장단점 분석 후 선별적 반영 + 독자 고려',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '최종 기획안 고유성',
          dataField: 'step4 (multi_free_text) — title·logline·characters·conflict·ending',
          levels: {
            0: '0~2개 작성',
            1: '3~4개 작성',
            2: '5개 작성이나 AI 제안 거의 그대로',
            3: '5개 모두 작성 + AI 제안과 다른 고유 요소 1개 이상',
            4: '5개 + 고유 요소 2개 이상 + 기획 기준과 일관된 통합 서사',
          },
        },
      ],
      E: [
        {
          id: 'e1',
          name: 'AI 기여·자기 기여 구분',
          dataField: 'step5 (multi_free_text) — ai_help·my_work',
          levels: {
            0: '둘 다 빈칸',
            1: '하나만 작성 또는 "AI가 도와줬다" 수준',
            2: 'ai_help + my_work 모두 작성이나 구체성 부족',
            3: '양쪽 모두 구체적 판단 사례 1개 이상 (40자 이상)',
            4: 'AI 도움 영역·내 판단 영역을 명확히 분류 + 협업 구조에 대한 성찰',
          },
        },
      ],
    },
  },

  // =========================================================================
  // C-2-L · 행사 그림 의뢰자 (1-2학년)
  // 역량 축: A + B + C | 준거 3개
  // =========================================================================
  'C-2-L': {
    cardCode: 'C-2-L',
    missionName: '행사 그림 의뢰자',
    gradeBand: 'L',
    weights: { A: 0.30, B: 0.40, C: 0.30 },
    expectedLevel: '2수준 이상',
    axes: {
      A: [
        {
          id: 'a1',
          name: '그림 목적 설정',
          dataField: 'step1 (single_select_cards)',
          levels: {
            0: 'null 또는 미응답',
            1: '선택했으나 step2 슬롯과 무관한 주제',
            2: 'step1 선택 + step2 슬롯 일부 맥락 일치',
            3: 'step1 선택 + step2 슬롯이 step1 맥락과 일관 (예: picnic → park/eating)',
            4: '맥락 일관 + exclude 슬롯도 목적에 맞게 선택',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '프롬프트 구성',
          dataField: 'step2 (prompt_builder) — slots',
          levels: {
            0: 'slots 미입력 또는 1개만',
            1: '2~3개 슬롯 입력',
            2: '4개 슬롯 입력',
            3: '4~5개 슬롯 모두 입력 (place + subject + action + mood + exclude)',
            4: '5개 모두 + 슬롯 간 조합이 일관된 장면 구성',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '결과 확인·평가',
          dataField: 'step3 (free_text)',
          levels: {
            0: '빈칸 또는 15자 미만',
            1: '"예쁘다" / "좋다" 수준 (감상만)',
            2: '요청 요소 1개 결과 언급',
            3: '요청한 요소가 결과에 반영됐는지 1개 이상 구체 언급',
            4: '반영된 요소 + 아쉬운 점 모두 구체 언급',
          },
        },
      ],
    },
  },

  // =========================================================================
  // C-2-M · 환경 캠페인 포스터 디자이너 (3-4학년)
  // 역량 축: A + B + C | 준거 4개
  // =========================================================================
  'C-2-M': {
    cardCode: 'C-2-M',
    missionName: '환경 캠페인 포스터 디자이너',
    gradeBand: 'M',
    weights: { A: 0.15, B: 0.35, C: 0.50 },
    expectedLevel: '2~3수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '초안 열람',
          dataField: 'step1 (image_view) ⬩이진',
          levels: {
            0: 'falsy (미열람)',
            1: 'truthy (열람 완료)',
            2: '—',
            3: '—',
            4: '—',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '오류 발견',
          dataField: 'step2 (defect_select) — markers',
          levels: {
            0: 'markers 없음 또는 0개',
            1: '1개 marker',
            2: '2개 marker',
            3: '2개 이상 marker + category가 2종 이상 다름',
            4: '3개 이상 marker + category 3종 이상 + 텍스트 설명 포함',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '수정 요청문 작성',
          dataField: 'step3 (prompt_single_input) — revisedPrompt',
          levels: {
            0: '빈칸 또는 50자 미만',
            1: '50자 이상이나 step2 오류와 무관한 일반 요청',
            2: '50자 이상 + step2 오류 일부 언급',
            3: '50자 이상 + step2에서 발견한 오류 1개 이상 구체 반영',
            4: '오류 2개 이상 반영 + 배경·인물·자연 요소 지정까지 포함',
          },
        },
        {
          id: 'c2',
          name: '개선 판단',
          dataField: 'step4 (free_text)',
          levels: {
            0: '빈칸 또는 30자 미만',
            1: '"좋아졌다" 수준 (근거 없음)',
            2: '개선점 1개 언급',
            3: '구체적 개선점 1개 이상 + 남은 아쉬운 점 언급',
            4: '개선점·아쉬운 점 모두 + 다음 개선 방향까지 제안',
          },
        },
      ],
    },
  },

  // =========================================================================
  // C-2-H · 전시 홍보물 아트디렉터 (5-6학년)
  // 역량 축: A + B + C | 준거 5개
  // =========================================================================
  'C-2-H': {
    cardCode: 'C-2-H',
    missionName: '전시 홍보물 아트디렉터',
    gradeBand: 'H',
    weights: { A: 0.20, B: 0.35, C: 0.45 },
    expectedLevel: '3수준',
    axes: {
      B: [
        {
          id: 'b1',
          name: '문제 분석 범위',
          dataField: 'step1 (defect_select) — markers',
          levels: {
            0: '0~1개 marker',
            1: '2개 marker',
            2: '3개 marker, category 2종',
            3: '3개 이상 marker + category 3종 이상',
            4: '3개 이상 + 4종(visual_error·style_issue·purpose_gap·info_delivery) 모두 포함',
          },
        },
        {
          id: 'b2',
          name: '프롬프트 역추정',
          dataField: 'step2 (multi_free_text) — vagueness·missing_style·no_exclude·inferred_prompt',
          levels: {
            0: '0~1개 작성',
            1: '2~3개 작성',
            2: '4개 작성이나 step1 오류와 무관',
            3: '4개 모두 작성 + inferred_prompt가 step1 오류와 논리적 연결',
            4: '4개 + 추정 프롬프트의 구조적 원인(막연함·제외 누락 등) 체계적 분석',
          },
        },
      ],
      A: [
        {
          id: 'a1',
          name: '개선 기준 수립',
          dataField: 'step3 (multi_free_text) — audience·mood·must_include·must_exclude',
          levels: {
            0: '0~1개 작성',
            1: '2~3개 작성',
            2: '4개 작성이나 must_exclude가 step1 오류와 무관',
            3: '4개 모두 작성 + must_exclude가 step1 오류 카테고리와 대응',
            4: '4개 + 기준 간 위계·우선순위까지 제시',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '최종 프롬프트 설계',
          dataField: 'step4 (prompt_with_conditions) — fullPrompt',
          levels: {
            0: '빈칸 또는 100자 미만',
            1: '100자 이상이나 step3 기준 중 1개 이하 반영',
            2: '100자 이상 + step3 기준 2개 반영',
            3: '100자 이상 + step3 기준 3개 이상 명시적 반영',
            4: '기준 4개 모두 반영 + conditionFields와 fullPrompt가 일관',
          },
        },
        {
          id: 'c2',
          name: '개선 효과 분석',
          dataField: 'step5 (free_text)',
          levels: {
            0: '빈칸 또는 60자 미만',
            1: '"좋아졌다" 수준',
            2: '개선점 1개 구체 판단',
            3: '기준별 충족 여부 1개 이상 구체 판단 + 잔여 과제 언급',
            4: '충족·부분충족·미충족 구분 판단 + 다음 반복 개선 방안 제시',
          },
        },
      ],
    },
  },
};
