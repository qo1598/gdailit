export const D2_MISSION = {
    title: 'AI에게 어떤 예시를 줄까?',
    competency: '데이터 질과 GIGO 원칙',
    ksa_tags: { K: "K2.2", S: "Problem Solving", A: "Responsible" },
    type: {
        lower: 'stacked-inputs',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: 'AI는 우리가 주는 "데이터"라는 밥을 먹고 무럭무럭 자란답니다.' },
            { text: '공부를 잘하는 AI가 되려면 좋은 밥(정확한 데이터)을 골고루 먹어야 해요.' },
            { text: 'AI가 사과를 잘 알 수 있도록, 종류가 다른 사과 5가지를 추천해 볼까요?' }
        ],
        middle: [
            { text: '쓰레기가 들어가면 쓰레기가 나온다는 "GIGO(Garbage In, Out)" 법칙이 있습니다.' },
            { text: '사과 데이터 사이에 오렌지가 섞여 들어가면 AI는 어떻게 행동할까요?' },
            { text: '데이터 오염이 가져올 엉뚱한 예측 결과(추론 대참사)를 상상하며 예시를 적어 보세요.' }
        ],
        upper: [
            { text: 'AI 시스템의 정확도는 데이터의 양보다 다양성과 정밀함에 달려 있습니다.' },
            { text: '희귀 케이스(예: 초록색 아오리 사과)가 누락되면 AI는 큰 오판을 하게 됩니다.' },
            { text: '이런 사각지대를 해결하기 위한 데이터 수집 전략과 개선 방안을 설계해 봅시다.' }
        ]
    },
    education: {
        lower: {
            why: 'AI를 가르치기 위해 좋은 데이터가 필요함을 이해하기 위해서예요.',
            example: '작은 사과, 큰 사과, 빨간 사과 등 다양한 사과 사진이 많을수록 좋아요.'
        },
        middle: {
            why: '잘못된 데이터가 알고리즘의 성능을 어떻게 저하시키는지 GIGO 원리로 파악합니다.',
            example: '사과 바구니에 고추가 섞이면 AI는 사과를 "맛있지만 매운 것"으로 오해할 수 있어요.'
        },
        upper: {
            why: '포용적인 데이터 수집(Inclusive Data)의 중요성을 알고 실무적 대응책을 수립합니다.',
            example: '초록 사과도 사과라는 데이터를 충분히 학습시켜야 모든 사과를 정확하게 인식할 수 있습니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'd2_apple_five', type: 'text', label: 'AI에게 줄 사과 5가지', placeholder: '예: 부사, 홍로, 아오리 ...' }
        ],
        middle: [
            { id: 'd2_apple_five', type: 'text', label: '학습 데이터 리스트', placeholder: '정상적인 데이터를 입력하세요' },
            { id: 'd2_mixed_fruit_chaos', type: 'textarea', label: '오염된 결과 예측', placeholder: '잘못된 데이터가 섞이면 어떤 일이 벌어질까요?' }
        ],
        upper: [
            { id: 'd2_aomori_problem', type: 'text', label: '발견한 희귀 데이터 사례', placeholder: 'AI가 놓치기 쉬운 데이터 유형' },
            { id: 'd2_aomori_solution', type: 'textarea', label: '데이터 사각지대 해결책', placeholder: '어떤 데이터를 어떻게 더 수집해야 할까요?' }
        ]
    }
};
