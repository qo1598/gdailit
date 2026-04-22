// E영역 루브릭 데이터 (v2 기준)
// 출처: docs/E영역_평가루브릭_v2.md

export const GRADE_WEIGHTS = {
  L: { A: 0.4, B: 0.6 },
  M: { A: 0.3, B: 0.3, C: 0.4 },
  H: { A: 0.2, B: 0.25, C: 0.3, D: 0.25 },
};

export const AXIS_NAMES = {
  A: '인식·식별',
  B: '근거·설명',
  C: '판단·적용',
  D: '제안·확장',
};

export const LEVEL_NAMES = {
  0: '미수행',
  1: '시작',
  2: '기초',
  3: '도달',
  4: '확장',
};

// 종합 수준 레이블
export function getLevelLabel(score) {
  if (score < 1.0) return '미수행/초기';
  if (score < 2.0) return '1수준(시작)';
  if (score < 3.0) return '2수준(기초)';
  if (score < 3.7) return '3수준(도달)';
  return '4수준(확장)';
}

// 축별 평균 계산
export function computeAxisAvg(axisScores) {
  const vals = Object.values(axisScores).filter(v => v != null);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// 종합 수준 계산
export function computeTotal(rubricScores, gradeBand) {
  const weights = GRADE_WEIGHTS[gradeBand];
  if (!weights || !rubricScores) return 0;
  let total = 0;
  for (const [axis, w] of Object.entries(weights)) {
    const axisScores = rubricScores[axis];
    if (!axisScores) continue;
    total += w * computeAxisAvg(axisScores);
  }
  return total;
}

// 12개 카드 루브릭
export const E_RUBRICS = {

  'E-1-L': {
    cardCode: 'E-1-L',
    missionName: 'AI 탐정단원',
    gradeBand: 'L',
    weights: GRADE_WEIGHTS.L,
    expectedLevel: '2수준 이상',
    axes: {
      A: [
        {
          id: 'a1',
          name: 'AI/비AI 판별',
          dataField: 'example_choices',
          levels: {
            0: '선택 없음',
            1: 'AI 1개 선택, 비AI(계산기·전등)도 함께 선택',
            2: 'AI만 1~2개 선택(비AI 제외)',
            3: 'AI 3개 이상 정확 선택, 비AI 전부 제외',
            4: 'AI 4개 모두 + wrong_attempts=0',
          },
        },
        {
          id: 'a2',
          name: '주변 AI 인식',
          dataField: 'selected_ai_item, evidence_type',
          levels: {
            0: '선택 없음',
            1: '카드/사진이 AI와 무관',
            2: 'AI 범주 1개 선택',
            3: 'STEP1에서 고른 종류와 동일 범주 선택',
            4: 'STEP1 범주 + 사진 업로드로 증거 제시',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '장소 기록',
          dataField: 'location',
          levels: {
            0: '선택 없음',
            1: "'other'만 선택",
            2: '구체 장소 1개 선택',
            3: '선택한 AI와 일치하는 장소',
            4: '선택 AI의 통상 사용 장소와 일치',
          },
        },
        {
          id: 'b2',
          name: '도움 기능 이해',
          dataField: 'ai_help_type',
          levels: {
            0: '선택 없음',
            1: "'other'만 선택",
            2: '도움 기능 1개 선택',
            3: '선택 AI의 기능과 부합',
            4: 'AI-장소-도움 3요소가 의미 있게 연결',
          },
        },
      ],
    },
  },

  'E-1-M': {
    cardCode: 'E-1-M',
    missionName: 'AI 소개 기자',
    gradeBand: 'M',
    weights: GRADE_WEIGHTS.M,
    expectedLevel: '3수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: 'AI/비AI 판별',
          dataField: 'step1',
          levels: {
            0: '선택 없음',
            1: '비AI 포함 선택',
            2: 'AI만 1~2개',
            3: 'AI 3개 이상 + 비AI 제외',
            4: 'AI 4개 모두 + wrong_attempts=0',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '하는 일 연결',
          dataField: 'step3',
          levels: {
            0: '선택 없음',
            1: '기타만',
            2: '기능 1개 선택',
            3: 'step2 AI와 일치',
            4: 'step2·step3 일치 + 구체 (예: 번역 앱→번역하기)',
          },
        },
        {
          id: 'b2',
          name: 'AI인 이유 서술',
          dataField: 'step4',
          levels: {
            0: '빈칸',
            1: '무관한 문장',
            2: '표면 특징("빨라요")',
            3: '자율 판단/추천/학습 중 1개 언급',
            4: '판단 원리 + 구체 예 포함',
          },
        },
        {
          id: 'b3',
          name: '소개 문장 완성',
          dataField: 'step5',
          levels: {
            0: '빈칸',
            1: '한 자리만 채움',
            2: '2요소(장소·도움) 중 1개',
            3: '2요소 모두 채움',
            4: '2요소 + AI인 이유 통합 표현',
          },
        },
      ],
    },
  },

  'E-1-H': {
    cardCode: 'E-1-H',
    missionName: 'AI 전시 큐레이터',
    gradeBand: 'H',
    weights: GRADE_WEIGHTS.H,
    expectedLevel: '3~4수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '기본 분류 정확도',
          dataField: 'step1 answerKey 일치',
          levels: {
            0: '미응답',
            1: '정답률 <50%',
            2: '50~75%',
            3: '75~100% + 비AI 모두 제외',
            4: '100% + wrong_attempts=0',
          },
        },
        {
          id: 'a2',
          name: '경계 사례 판정',
          dataField: 'step3 판정',
          levels: {
            0: '미응답',
            1: '전부 같은 답',
            2: "4개 중 2개 이상 'unclear' 활용",
            3: '스마트온도·스팸필터 등 학습형은 AI, 자동문은 비AI 구분',
            4: '4개 모두 구분 + 판정 분포 다양',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '경계 사례 이유',
          dataField: 'step3 텍스트',
          levels: {
            0: '빈칸',
            1: '판정과 무관',
            2: '"스스로 움직여요" 수준',
            3: "'학습·판단·데이터'의 용어 사용",
            4: 'step2 기준 칩을 명시적으로 인용',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '판단 기준 구성',
          dataField: 'step2 칩',
          levels: {
            0: '선택 없음',
            1: '1개만',
            2: '2개 선택',
            3: "2개 + 'learns/predicts/adapts' 중 1개 포함",
            4: '3개 이상 + 핵심/보조 기준 위계',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '전시 기준 문장',
          dataField: 'step4',
          levels: {
            0: '빈칸',
            1: '템플릿만 복사',
            2: '한 기준만 포함',
            3: '기준 2개 통합',
            4: '2개 기준 + 판단 주체("~할 때") 명시',
          },
        },
      ],
    },
  },

  'E-2-L': {
    cardCode: 'E-2-L',
    missionName: 'AI 답 점검 도우미',
    gradeBand: 'L',
    weights: GRADE_WEIGHTS.L,
    expectedLevel: '2수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: '이상한 답 식별',
          dataField: 'step1 qa 판정',
          levels: {
            0: '미응답',
            1: '정답률 <50%',
            2: '50~75%',
            3: '4~5개 정답(75~83%)',
            4: '6개 중 5개 이상 정확 + onMiss 0회',
          },
        },
        {
          id: 'a2',
          name: '이상 이유 선택',
          dataField: 'step1 reasonOptions',
          levels: {
            0: '선택 없음',
            1: '이유 없이 판정만',
            2: '모든 strange에 같은 이유',
            3: 'strange별로 적절한 이유',
            4: "'wrong_fact/impossible/contradicts' 구분 사용",
          },
        },
      ],
      B: [],
      C: [
        {
          id: 'c1',
          name: '확인 방법 판단',
          dataField: 'step2',
          levels: {
            0: '선택 없음',
            1: "'AI 말 그대로' 포함",
            2: '1개 안전한 방법만',
            3: '안전 방법 2개 이상',
            4: "안전 방법 복수 + 'AI 그대로' 제외",
          },
        },
        {
          id: 'c2',
          name: '게시판 결정',
          dataField: 'step3',
          levels: {
            0: '미응답',
            1: "모두 'post'",
            2: "모두 'hold'",
            3: "strange는 'hold', correct는 'post'",
            4: 'step1 판정과 step3 결정 완전 일치',
          },
        },
      ],
    },
  },

  'E-2-M': {
    cardCode: 'E-2-M',
    missionName: 'AI 대화 검토자',
    gradeBand: 'M',
    weights: GRADE_WEIGHTS.M,
    expectedLevel: '3수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: '의심 말풍선 식별',
          dataField: 'step2 bubble 판정',
          levels: {
            0: '미응답',
            1: '정답률 <50%',
            2: 'a3(24시간) 또는 a6(블랙홀) 중 1개',
            3: '2개 모두 strange 판정',
            4: '2개 strange + 정답 4개도 correct 유지',
          },
        },
        {
          id: 'a2',
          name: '이상 이유 선택',
          dataField: 'step2 reasonOptions',
          levels: {
            0: '없음',
            1: '모두 같은 이유',
            2: '1개에만 이유',
            3: "2개 모두 이유 + 'wrong_fact / not_proven' 구분",
            4: '구분 + strange별로 다른 이유 적용',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '확인 질문 작성',
          dataField: 'step3 텍스트',
          levels: {
            0: '빈칸',
            1: '관련성 낮은 문장',
            2: '"맞아요?" 수준',
            3: '근거·출처 요청 포함',
            4: '해당 말풍선의 구체 주장에 대응하는 질문',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '사용/보류 결정',
          dataField: 'step4',
          levels: {
            0: '미응답',
            1: '모두 같은 답',
            2: "의심 말풍선에 'hold' 부분 적용",
            3: 'step2 판정과 결정 일치',
            4: "완전 일치 + correct도 'use' 유지",
          },
        },
        {
          id: 'c2',
          name: '유의 태도 선택',
          dataField: 'step5',
          levels: {
            0: '없음',
            1: '1개 선택',
            2: "부적절 옵션('지칠 때까지', '그대로') 포함",
            3: '안전 태도 2개 이상',
            4: '3개 이상 + 부적절 옵션 전부 제외',
          },
        },
      ],
    },
  },

  'E-2-H': {
    cardCode: 'E-2-H',
    missionName: '학급 신문 편집장',
    gradeBand: 'H',
    weights: GRADE_WEIGHTS.H,
    expectedLevel: '3~4수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '5개 기사 판정',
          dataField: 'step2 per_response_judge',
          levels: {
            0: '미응답',
            1: '전부 같은 답',
            2: 's1·s3 use, s2·s4·s5 중 1개만 revise/verify',
            3: 's2·s4·s5 3개 모두 revise 또는 verify',
            4: '정답 배치: s1/s3=use, s2=revise, s4=revise, s5=verify',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '판정 이유 표시',
          dataField: 'step3 reasonOptions',
          levels: {
            0: '없음',
            1: "모두 'other'",
            2: '1개에만 이유',
            3: '모든 revise/verify에 이유',
            4: "'wrong_fact / not_proven / partly_wrong' 등 상황별로 구분",
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '편집 계획 서술',
          dataField: 'step4 텍스트',
          levels: {
            0: '빈칸',
            1: '"고친다" 수준',
            2: '계획 1개 구체',
            3: '각 대상별 계획 + 확인 자원(교과서·전문가) 명시',
            4: '각 대상별 차별화 + 재검증 절차 포함',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '편집장 메모',
          dataField: 'step5',
          levels: {
            0: '빈칸',
            1: '일반론',
            2: 'AI 한계 인식',
            3: 'AI 한계 + 인간 책임 언급',
            4: '한계 + 책임 + 앞으로의 실천 태도',
          },
        },
      ],
    },
  },

  'E-3-L': {
    cardCode: 'E-3-L',
    missionName: '추천 탐험가',
    gradeBand: 'L',
    weights: GRADE_WEIGHTS.L,
    expectedLevel: '2수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: '주제 선택 완료',
          dataField: 'step1',
          levels: {
            0: '선택 없음',
            1: '선택은 함',
            2: '—',
            3: '—',
            4: '—',
          },
        },
        {
          id: 'a2',
          name: '질문 응답 완료율',
          dataField: 'step2 answers',
          levels: {
            0: '0개',
            1: '3개 미만',
            2: '3~6개',
            3: '7~9개',
            4: '10개 전부',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '추천 결과 관찰',
          dataField: 'step3 recommendation_reveal 열람',
          levels: {
            0: '미열람',
            1: '열람만',
            2: '—',
            3: '—',
            4: '—',
          },
        },
        {
          id: 'b2',
          name: '추천 이유 서술',
          dataField: 'step4 자유서술',
          levels: {
            0: '빈칸',
            1: '무관한 문장',
            2: '"좋아해서" 수준',
            3: '자신의 응답 1개 인용 + 추천 특징 언급',
            4: '응답 2개 이상과 추천의 reasonTags 연결',
          },
        },
      ],
    },
  },

  'E-3-M': {
    cardCode: 'E-3-M',
    missionName: '추천 시스템 테스터',
    gradeBand: 'M',
    weights: GRADE_WEIGHTS.M,
    expectedLevel: '3수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: '별점 평가 충실도',
          dataField: 'step2 ratings',
          levels: {
            0: '0개',
            1: '10개 미만',
            2: '10개 채움, 점수 분포 거의 동일',
            3: '10개 이상 + 4~5점 구간 3개 이상',
            4: '20개 전부 + 점수 분포 뚜렷',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '취향 특징 인식',
          dataField: 'step4 q1',
          levels: {
            0: '빈칸',
            1: '무관',
            2: '"예쁜거 좋아해요"',
            3: '색/스타일/계절 중 1개 언급',
            4: '2개 이상 조합 언급',
          },
        },
        {
          id: 'b2',
          name: '추천-별점 연결 설명',
          dataField: 'step4 q2',
          levels: {
            0: '빈칸',
            1: '무관',
            2: '"비슷해요"',
            3: '공통 태그 1개 인용',
            4: '초기 추천과 현재 추천의 차이 비교',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '추천 영향 예측',
          dataField: 'step4 q3',
          levels: {
            0: '빈칸',
            1: '무관',
            2: '"편해요/좋아요"',
            3: '영향 1개(시야 좁아짐·새 선택 놓침)',
            4: '긍·부정 영향 모두 + 대응 방안',
          },
        },
      ],
    },
  },

  'E-3-H': {
    cardCode: 'E-3-H',
    missionName: '추천 분석 에디터',
    gradeBand: 'H',
    weights: GRADE_WEIGHTS.H,
    expectedLevel: '3~4수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '추천 이유 분석',
          dataField: 'step1 reasonOptions',
          levels: {
            0: '미응답',
            1: "모두 'other'",
            2: '사례 4개 중 2개 이유 선택',
            3: '4개 사례 모두 이유 선택',
            4: '사례별로 다른 이유 구분 적용',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '판단과 장·단점',
          dataField: 'step2 judgmentOptions + planOptions/limitationOptions',
          levels: {
            0: '미응답',
            1: '모두 같은 판단',
            2: 'helpful만 또는 careful만',
            3: '민서=helpful, 지호·준호=careful, 서연=both 등 논리적 구분',
            4: '구분 + 장·단점 옵션 각각 부합',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '주도적 활용 서술',
          dataField: 'step3 자유서술',
          levels: {
            0: '빈칸',
            1: '"조심히 쓴다"',
            2: '일반 원칙 1개',
            3: '사례와 연결된 구체 전략 1개',
            4: '복수 상황별 전략',
          },
        },
        {
          id: 'd2',
          name: '3가지 원칙 작성',
          dataField: 'step4 p1~p3',
          levels: {
            0: '0~1개',
            1: '2개',
            2: '3개이지만 중복',
            3: '3개 서로 다른 관점',
            4: '3개 + 인식·탐색·결정 단계를 포괄',
          },
        },
      ],
    },
  },

  'E-4-L': {
    cardCode: 'E-4-L',
    missionName: 'AI 배려 관찰자',
    gradeBand: 'L',
    weights: GRADE_WEIGHTS.L,
    expectedLevel: '2수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: '차이 인식',
          dataField: 'step2 options',
          levels: {
            0: '선택 없음',
            1: '무관 차이(옷·장소) 포함',
            2: '관련 차이 1개',
            3: '관련 차이 2개 이상, 무관 제외',
            4: '3개 이상 + 무관 완전 제외',
          },
        },
        {
          id: 'a2',
          name: '어려움 대상 식별',
          dataField: 'step3 personOption',
          levels: {
            0: '선택 없음',
            1: 'A 선택',
            2: '—',
            3: 'B 선택',
            4: 'B 선택 + 적절한 이유(not_recognized/needs_retry/hard_to_use/system_not_fit)',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '어려움 이유 선택',
          dataField: 'step3 reasonOption',
          levels: {
            0: '없음',
            1: '무관 이유(옷·장소)',
            2: '관련 이유 1개',
            3: '관련 이유 1개 + STEP2 차이와 정합',
            4: '정합 + 특정 AI 유형과 연결',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '배려 방법 선택',
          dataField: 'step4 options',
          levels: {
            0: '없음',
            1: '무관 옵션(색·크기) 포함',
            2: '관련 옵션 1개',
            3: 'step3 이유와 ruleMap 일치 옵션',
            4: '일치 옵션 2개 이상',
          },
        },
      ],
    },
  },

  'E-4-M': {
    cardCode: 'E-4-M',
    missionName: '공정성 점검단원',
    gradeBand: 'M',
    weights: GRADE_WEIGHTS.M,
    expectedLevel: '3수준 도달',
    axes: {
      A: [
        {
          id: 'a1',
          name: '불리 학생 식별',
          dataField: 'step1 per case',
          levels: {
            0: '미응답',
            1: '일관되게 A',
            2: '1개 사례만 B',
            3: '3개 사례 모두 B',
            4: '3개 모두 B + 근거와 일치',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '원인 분석',
          dataField: 'step3 reasonOptions (multi)',
          levels: {
            0: '없음',
            1: '1개 사례만 이유',
            2: '모든 사례에 이유 1개',
            3: '사례별 다른 이유',
            4: '각 사례별 2개 이상 원인 다각화',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '공정성 판단',
          dataField: 'step2',
          levels: {
            0: '미응답',
            1: '전부 okay',
            2: '1개만 unfair',
            3: '2~3개 unfair',
            4: '3개 모두 unfair + step3 이유와 정합',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '개선 제안',
          dataField: 'step4 텍스트',
          levels: {
            0: '빈칸 (2개 미만)',
            1: '일반론',
            2: '1개 사례만 구체',
            3: '2개 이상 사례에 구체 대안',
            4: '3개 모두 + 대체 입력/사람 확인/다양한 데이터 중 2개 이상 유형',
          },
        },
        {
          id: 'd2',
          name: '종합 의견',
          dataField: 'step5 텍스트',
          levels: {
            0: '빈칸',
            1: '한 문장, 무관',
            2: '일반 서술',
            3: 'AI 설계/사용 중 1관점',
            4: '제작자·사용자 양 관점 통합',
          },
        },
      ],
    },
  },

  'E-4-H': {
    cardCode: 'E-4-H',
    missionName: 'AI 공정성 자문위원',
    gradeBand: 'H',
    weights: GRADE_WEIGHTS.H,
    expectedLevel: '3~4수준',
    axes: {
      A: [
        {
          id: 'a1',
          name: '문제 신호 포착',
          dataField: 'step2 judgmentOptions',
          levels: {
            0: '미응답',
            1: '4개 중 1개만',
            2: '2개',
            3: '3개 + 장면별 적합 신호',
            4: '4개 + 장면 특성에 맞는 신호 구분',
          },
        },
      ],
      B: [
        {
          id: 'b1',
          name: '문제 이유 서술',
          dataField: 'step4 reasonOptions (multi)',
          levels: {
            0: '없음',
            1: '모든 장면 같은 이유 1개',
            2: '2~3개 장면에 이유',
            3: '4개 모두 이유 2개 이상',
            4: '누적·구조적 이유(cumulative_harm, unequal_opportunity) 포함',
          },
        },
      ],
      C: [
        {
          id: 'c1',
          name: '영향 대상·종류',
          dataField: 'step3 judgment + reason',
          levels: {
            0: '미응답',
            1: '일관되게 A 또는 reason 없음',
            2: 'B 2개 사례만 + 영향 1개',
            3: '4개 모두 B + 영향 복수',
            4: '4개 B + 장면별 영향 유형 차별화 (예: 공연=miss_performance)',
          },
        },
        {
          id: 'c2',
          name: 'AI 수용 판단',
          dataField: 'step5 텍스트',
          levels: {
            0: '빈칸',
            1: '"믿으면 안 된다" 수준',
            2: '장면 1개만 서술',
            3: '4개 중 3개 이상 + 개선 절차 1개',
            4: '4개 모두 + 데이터·절차·대안 중 2개 이상',
          },
        },
      ],
      D: [
        {
          id: 'd1',
          name: '최종 자문 의견서',
          dataField: 'step6 텍스트 (3~5문장)',
          levels: {
            0: '빈칸',
            1: '1~2문장 일반론',
            2: '3문장이나 관점 1개',
            3: '3~5문장 + 제작자·사용자 양 관점',
            4: '3~5문장 + 구조적 원인·개선 절차·지속 점검 포함',
          },
        },
      ],
    },
  },
};
