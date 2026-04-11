export const E3_MISSION = {
    title: '알고리즘의 꼬리 잡기',
    competency: '알고리즘 편식 및 편향 성찰',
    ksa_tags: { K: "K1.1", S: "Self and Social Awareness", A: "Curious" },
    type: {
        lower: 'stacked-inputs',
        middle: 'performance-matching',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '유튜브나 게임을 할 때, 내가 좋아할 만한 걸 AI가 쏙쏙 골라준 적이 있나요?' },
            { text: '내가 본 것을 기억하고 추천해 주는 것을 "알고리즘"이라고 불러요.' },
            { text: '나에게 추천된 것들 중 가장 신기했던 경험을 기록해 봅시다!' }
        ],
        middle: [
            { text: '알고리즘은 우리가 클릭한 "데이터"의 꼬리를 잡고 따라다녀요.' },
            { text: '어떤 과거의 기록 때문에 지금 이 콘텐츠가 추천되었는지 연결해 볼까요?' },
            { text: '추천의 원리를 알면 알고리즘에 휘둘리지 않는 똑똑한 사용자가 될 수 있어요.' }
        ],
        upper: [
            { text: '알고리즘 추천은 편리하지만 "필터 버블"이라는 위험한 우리에 갇히게 할 수도 있습니다.' },
            { text: '나와 비슷한 의견만 듣게 되면 사회의 다양한 목소리를 듣지 못하게 될 수 있어요.' },
            { text: '이런 현상이 우리 공동체에 어떤 영향을 줄지 비판적으로 분석해 봅시다.' }
        ]
    },
    education: {
        lower: {
            why: '나에게 추천되는 정보들이 어떻게 나타나는지 관심을 가지기 위해서예요.',
            example: '고양이 영상을 많이 보면, AI는 나를 "고양이 매니아"로 기억해요.'
        },
        middle: {
            why: '추천 알고리즘의 통계적 추론 과정을 이해하고 데이터의 흐름을 파악합니다.',
            example: '축구화 검색 기록(데이터) -> 축구 경기 영상 추천(알고리즘)'
        },
        upper: {
            why: '알고리즘이 개인의 가치관 형성과 사회적 소통에 미치는 영향을 성찰합니다.',
            example: '편향된 뉴스만 추천받으면 다른 사람의 생각을 이해하기 어려워져요.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'item', type: 'text', label: '나에게 추천된 콘텐츠', placeholder: '무엇을 추천받았나요?' }
        ],
        middle: [
            { 
                id: 'matching_algo', 
                type: 'performance-matching', 
                label: '데이터와 추천 연결하기',
                pairs: [
                    { id: 'p1', question: '강아지 간식 검색', answer: '애완동물 용품 광고' },
                    { id: 'p2', question: '신나는 댄스 노래 청취', artist: '비슷한 분위기의 가수 추천' },
                    { id: 'p3', question: '종이접기 방법 시청', answer: '미술 도구 만들기 영상' }
                ],
                sources: ['애완동물 용품 광고', '비슷한 분위기의 가수 추천', '미술 도구 만들기 영상']
            }
        ],
        upper: [
            { id: 'item', type: 'text', label: '분석할 추천 콘텐츠', placeholder: '최근 자주 뜨는 영상이나 광고' },
            { id: 'why_recommend', type: 'text', label: '추천된 원인 추적', placeholder: '나의 어떤 활동 때문일까요?' },
            { id: 'side_effect', type: 'textarea', label: '필터 버블의 위험성', placeholder: '이 콘텐츠만 계속 보게 된다면 무엇을 놓치게 될까요?' }
        ]
    }
};
