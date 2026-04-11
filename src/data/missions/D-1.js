export const D1_MISSION = {
    title: '끼리끼리 분류 놀이!',
    competency: '머신러닝 분류 원리 및 데이터 특징 추출',
    ksa_tags: { K: "K1.2", S: "Computational Thinking", A: "Curious" },
    type: {
        lower: 'performance-sorting',
        middle: 'performance-matching',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '알록달록 과일들이 시장에 나왔어요! AI가 과일을 정리할 수 있게 도와주세요.' },
            { text: '빨간 사과와 노란 바나나를 색깔별로 분류 바구니에 담아볼까요?' },
            { text: '색깔은 컴퓨터가 사물을 알아보는 아주 중요한 첫 번째 힌트랍니다.' }
        ],
        middle: [
            { text: '기계는 우리가 가르쳐준 "기준(Feature)"에 따라 데이터를 분류합니다.' },
            { text: '만약 색깔이 아니라 "맛"이나 "껍질의 두께"로 나누면 결과가 어떻게 달라질까요?' },
            { text: '나만의 독특한 분류 기준을 세우고, 관련 있는 데이터끼리 짝을 지어 정렬해 보세요.' }
        ],
        upper: [
            { text: '프레임워크 K1.2에 따르면, AI는 패턴을 감지하고 예측 결과를 도출합니다.' },
            { text: '하지만 분류 기준이 공정하지 않다면 누군가는 소외되거나 상처받을 수 있습니다.' },
            { text: '축제 입장객을 분류하는 시스템의 문제점과 이를 해결할 혁신적인 제안을 담아 인사이트를 기록하세요.' }
        ]
    },
    education: {
        lower: {
            why: '컴퓨터가 사물의 특징을보고 분류하는 기초 원리를 알기 위해서예요.',
            example: '빨간색 바구니에는 사과와 딸기를, 노란색 바구니에는 바나나와 참외를 넣어요.'
        },
        middle: {
            why: '머신러닝의 "특징 추출" 과정을 경험하고 데이터 정렬의 논리적 사고를 기릅니다.',
            example: '"먹을 수 있는 껍질" 기준: 사과, 포도 vs "버리는 껍질" 기준: 바나나, 귤'
        },
        upper: {
            why: '데이터 분류가 사회적 의사결정에 미치는 영향과 편향성 문제를 비판적으로 성찰합니다.',
            example: '안경 쓴 사람만 할인해 주는 AI는 그렇지 않은 사람에게 불평등을 줄 수 있어요.'
        }
    },
    stackedInputs: {
        lower: [
            { 
                id: 'fruit_basket', 
                type: 'performance-sorting', 
                label: '과일 색깔 분류하기',
                list: ['빨간 사과', '노란 바나나', '빨간 딸기', '노란 참외', '빨간 앵두', '노란 레몬'],
                categories: ['빨강 바구니', '노랑 바구니']
            }
        ],
        middle: [
            { 
                id: 'custom_classification', 
                type: 'performance-matching', 
                label: '데이터와 기준 연결하기',
                pairs: [
                    { id: 'p1', question: '동그랗고 달콤한 맛', answer: '사과' },
                    { id: 'p2', question: '길쭉하고 부드러운 속살', answer: '바나나' },
                    { id: 'p3', question: '작고 신 맛이 강함', answer: '레몬' }
                ],
                sources: ['사과', '바나나', '레몬']
            }
        ],
        upper: [
            { id: 'unique_sort', type: 'text', label: '나만의 공정한 분류 기준', placeholder: '어떤 기준으로 나누면 모두가 행복할까요?' },
            { id: 'insight', type: 'textarea', label: '분류 알고리즘 분석', placeholder: '기준 하나가 세상을 어떻게 바꿀 수 있을지 적어보세요' }
        ]
    }
};
