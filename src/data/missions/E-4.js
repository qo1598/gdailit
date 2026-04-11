export const E4_MISSION = {
    title: 'AI는 모든 친구에게 친절할까?',
    competency: '데이터 편향성 인지 및 윤리',
    ksa_tags: { K: "K2.5", S: "Critical Thinking", A: "Empathetic" },
    type: {
        lower: 'stacked-inputs',
        middle: 'stacked-inputs',
        upper: 'rules'
    },
    storySteps: {
        lower: [
            { text: '나의 사투리나 작은 목소리를 AI가 잘 알아듣지 못해서 속상했던 적이 있나요?' },
            { text: 'AI는 많은 데이터를 공부하지만, 가끔은 특정 친구들의 특징을 배우지 못할 때도 있어요.' },
            { text: 'AI와 대화하며 불편했던 경험이 있다면 솔직하게 이야기해 주세요.' }
        ],
        middle: [
            { text: 'AI 시스템의 편향성은 학습 데이터가 특정 집단에 치우쳐 있을 때 발생합니다.' },
            { text: '어린이의 목소리나 다양한 문화적 배경이 빠져있다면 AI는 편견을 가질 수 있어요.' },
            { text: '이런 편향된 AI가 우리 사회에서 어떤 차별적 행동을 할 수 있을지 분석해 봅시다.' }
        ],
        upper: [
            { text: '프레임워크 K2.5에 따르면, 인간은 설계 과정에서 유해한 편향을 완화할 책임이 있습니다.' },
            { text: 'AI가 모든 사람에게 공정하고 친절하기 위해 어떤 "수칙"이 필요할까요?' },
            { text: '여러분이 AI 개발자가 되어 차별을 방지하기 위한 강력한 윤리 수칙 3가지를 제정해 보세요.' }
        ]
    },
    education: {
        lower: {
            why: '기술에도 차별이 있을 수 있음을 알고, 평등에 대해 생각하기 위해서예요.',
            example: '어른 목소리만 공부한 AI는 어린이 말을 잘 못 알아들을 수 있어요.'
        },
        middle: {
            why: '데이터의 다양성 부족이 기술적 불평등으로 이어지는 원리를 이해합니다.',
            example: '도시 데이터만 배운 AI는 시골 길 안내를 잘 못할 수도 있어요.'
        },
        upper: {
            why: 'AI 윤리의 핵심 가치인 공정성과 책임감을 내면화하고 해결책을 제시합니다.',
            example: '학습 데이터에 다양한 성별, 연령, 문화 정보를 골고루 포함해야 합니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'experience', type: 'text', label: '나의 불편했던 경험', placeholder: 'AI가 내 말을 오해했거나 못 알아들은 적이 있나요?' }
        ],
        middle: [
            { id: 'experience', type: 'text', label: '관찰한 차별 상황', placeholder: 'AI가 누구에게 불리하게 작동할까요?' },
            { id: 'reason', type: 'textarea', label: '기술적 원인 분석', placeholder: '데이터에서 무엇이 부족해서 이런 일이 생겼을까요?' }
        ]
    }
};
