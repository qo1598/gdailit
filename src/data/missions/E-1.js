export const E1_MISSION = {
    title: '생활 속 AI 찾기',
    competency: 'AI 인식 및 한계점 파악',
    ksa_tags: { K: "K1.4", S: "Self and Social Awareness", A: "Curious" },
    type: {
        lower: 'performance-sorting',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '안녕! 우리 주변에는 우리를 도와주는 똑똑한 AI 친구들이 아주 많이 숨어 있어.' },
            { text: '에어컨, 로봇 청소기, 그리고 엄마 핸드폰 속에도 AI가 살고 있을지 몰라!' },
            { text: '오늘은 우리 주변에서 AI가 들어있는 물건과 아닌 물건을 직접 나누어 볼 거야. 준비됐니?' }
        ],
        middle: [
            { text: '여러분, AI는 단순히 전기로 움직이는 기계와는 조금 달라요.' },
            { text: '스스로 생각하고 결정하는 AI 시스템이 우리 일상 어디에 숨어 있는지 찾아볼 시간입니다.' },
            { text: '주변에서 발견한 AI 기기의 이름과 그 친구가 어떤 일을 하는지 자세히 기록해 보세요.' }
        ],
        upper: [
            { text: '프레임워크 p.27에 따르면, AI는 목적에 따라 생성, 예측, 추천 등 다양한 방식으로 작동합니다.' },
            { text: '하지만 모든 AI가 완벽한 건 아니에요. 편리함 뒤에 숨겨진 한계점이나 위험한 점은 없을까요?' },
            { text: '발견한 AI 시스템을 분석하고, 그 기기가 가진 명확한 한계점까지 함께 도출해 봅시다.' }
        ]
    },
    education: {
        lower: {
            why: '어떤 물건이 AI인지 알면 기술을 더 잘 이해할 수 있어요.',
            example: '로봇 청소기는 스스로 길을 찾지만, 일반 빗자루는 사람이 움직여야 해요.'
        },
        middle: {
            why: 'AI의 기능을 이해하면 디지털 세상에서 주도적으로 행동할 수 있습니다.',
            example: '스마트 스피커는 음성 인식 알고리즘을 사용하여 우리의 명령을 수행해요.'
        },
        upper: {
            why: 'AI 시스템의 작동 원리와 한계를 알면 비판적으로 기술을 활용할 수 있습니다.',
            example: '자율주행 자동차는 편리하지만, 예기치 못한 날씨 상황에서는 판단 오류가 생길 수 있습니다.'
        }
    },
    stackedInputs: {
        lower: [
            { 
                id: 'performance_sort', 
                type: 'performance-sorting', 
                label: 'AI 바구니 분류하기',
                list: ['로봇 청소기', '일반 빗자루', '스마트 스피커', '나무 의자', '자율주행 차', '종이 비행기'],
                categories: ['AI예요!', 'AI가 아니에요!']
            }
        ],
        middle: [
            { id: 'location', type: 'text', label: '발견한 장소', placeholder: '어디에서 찾았나요? (예: 거실, 편의점)' },
            { id: 'function', type: 'text', label: 'AI가 하는 일', placeholder: '이 AI는 어떤 도움을 주나요?' }
        ],
        upper: [
            { id: 'location', type: 'text', label: '발견한 장소/시스템', placeholder: '예: 자율주행 버스, 유튜브 추천' },
            { id: 'function', type: 'text', label: '작동 원리 및 기능', placeholder: '이 시스템은 어떤 데이터를 기반으로 작동하나요?' },
            { id: 'pros_cons', type: 'textarea', label: '편리함 뒤의 한계점', placeholder: '이 AI가 실수하거나 위험할 수 있는 상황은 언제일까요?' }
        ]
    }
};
