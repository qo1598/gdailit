export const D3_MISSION = {
    title: '시험해 보고 고쳐 보는 AI',
    competency: '시각 인식 한계 및 모델 카드 분석',
    ksa_tags: { K: "K4.1", S: "Critical Thinking", A: "Responsible" },
    type: {
        lower: 'performance-highlight',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '이건 강아지(치와와)일까요, 아니면 맛있는 머핀일까요?' },
            { text: '기계 눈(시각 AI)은 우리처럼 물체를 한눈에 알아보지 못한답니다.' },
            { text: 'AI가 헷갈려 하는 사진들 중 "가장 닮은 두 지점"을 찾아 마법의 원으로 표시해 주세요.' }
        ],
        middle: [
            { text: '시각 AI는 픽셀의 패턴과 형태만 보고 사물을 인식할 때가 많습니다.' },
            { text: '강아지의 눈과 머핀의 건포도가 비슷하게 보이기 때문에 실수를 하는 것이죠.' },
            { text: '이렇게 기계가 입체적인 세상을 오해할 때 발생할 수 있는 사고 시나리오를 작성해 봅시다.' }
        ],
        upper: [
            { text: '프레임워크 K4.1에 따르면 기계는 문맥(Context)과 감정적 이해가 없습니다.' },
            { text: '도로 위 자율주행 상황에서 "사람 사진"과 "진짜 사람"을 구분하지 못하면 어떻게 될까요?' },
            { text: '기계 지능의 위험성을 경고하는 보안 보고서(Model Card)를 정교하게 작성해 봅시다.' }
        ]
    },
    education: {
        lower: {
            why: '컴퓨터의 시력이 우리 눈과 얼마나 다른지 관찰하기 위해서예요.',
            example: '동그란 눈 2개가 있으면 AI는 머핀을 강아지로 착각할 수 있어요.'
        },
        middle: {
            why: '2D 픽셀 매칭 위주의 시각 기술이 갖는 구조적 한계를 논리적으로 분석합니다.',
            example: '그림자는 검은 물체로 오해하고, 평면 사진은 입체 사물로 오해하기 쉬워요.'
        },
        upper: {
            why: '기술의 안전성과 투명성을 위해 AI 모델의 취약점을 문서화하고 관리하는 법을 배웁니다.',
            example: '갑작스러운 폭우나 복잡한 조명 아래서 시각 AI의 정확도는 급격히 낮아질 수 있습니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'similar_points', type: 'performance-highlight', label: '닮은 지점 표시', content: '강아지 눈과 머핀 건포도를 각각 클릭해보세요!' }
        ],
        middle: [
            { id: 'limit', type: 'textarea', label: '시각 인식 오판 시나리오', placeholder: '어떤 위험한 착각을 할 수 있을까요?' }
        ],
        upper: [
            { id: 'road_danger', type: 'text', label: '자율주행 위험요소 분석', placeholder: '어떤 사물을 오해할 때 가장 위험할까요?' },
            { id: 'model_card', type: 'textarea', label: 'AI 취약점 보고서(Model Card)', placeholder: '이 시스템을 사용할 때 주의할 점을 적으세요' }
        ]
    }
};
