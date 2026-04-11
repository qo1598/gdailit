export const C3_MISSION = {
    title: '목적에 맞게 다시 만들기',
    competency: 'AI 산출물 정제 및 창작 윤리',
    ksa_tags: { K: "K5.3", S: "Creativity", A: "Responsible" },
    type: {
        lower: 'stacked-inputs',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '우리는 오늘 "지구를 지키자"는 포스터를 만들 후보 단어들을 골라볼 거예요.' },
            { text: 'AI가 추천해 준 멋진 단어들 중에 여러분의 마음을 사로잡은 마법 단어는 무엇인가요?' },
            { text: '단어를 선택하고, 왜 그 단어를 골랐는지 한 가지만 짧게 적어보세요.' }
        ],
        middle: [
            { text: 'AI가 초안을 잡아주면, 우리는 그것을 더 아름답게 "윤색"할 수 있습니다.' },
            { text: 'AI의 딱딱한 문구를 여러분만의 따뜻한 감성으로 직접 고쳐볼까요?' },
            { text: '여러분이 고친 문구와 AI의 원래 문구를 비교해 보며 창작의 즐거움을 느껴보세요.' }
        ],
        upper: [
            { text: '프레임워크 K5.3에 따르면, AI 창작물은 저작권과 독창성이라는 복잡한 문제를 가집니다.' },
            { text: '포스터를 완성하기 전, 이 창작물이 타인의 권리를 침해하지는 않는지 최종 점검표를 작성해야 합니다.' },
            { text: '윤리적인 창작자로서 여러분이 내린 의사결정의 근거를 기록해 봅시다.' }
        ]
    },
    education: {
        lower: {
            why: 'AI의 의견 중 좋은 것을 선택하는 "큐레이팅" 능력을 기르기 위해서예요.',
            example: '"푸른 산", "맑은 바다" 중 어떤 단어가 포스터에 더 어울릴까요?'
        },
        middle: {
            why: 'AI 출력물을 비판적으로 다듬고 개선하는 "리파이닝" 과정을 체험합니다.',
            example: '"에너지를 아낍시다"라는 AI 문구를 "지구의 체온을 1도 낮추는 우리의 실천"으로 고칩니다.'
        },
        upper: {
            why: 'AI 협업 창작 과정에서 발생하는 책임과 저작권 윤리 의식을 확립합니다.',
            example: '이미지에 포함된 타인의 로고를 지우거나, AI 사용 여부를 정직하게 명시합니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'favorite_word', type: 'text', label: '나의 마법 단어', placeholder: '어떤 단어가 제일 마음에 드나요?' }
        ],
        middle: [
            { id: 'creative_edit', type: 'textarea', label: '더 멋진 문구로 고치기', placeholder: 'AI 문구를 여러분의 개성을 담아 바꿔주세요.' }
        ],
        upper: [
            { id: 'creative_edit', type: 'textarea', label: '최종 포스터 문구', placeholder: '정제된 최종 문구를 작성하세요' },
            { id: 'thought_1', type: 'checkbox', label: '타인의 저작물을 그대로 베끼지 않았나요?' },
            { id: 'thought_2', type: 'checkbox', label: 'AI 생성물임을 명시할 준비가 되었나요?' },
            { id: 'thought_3', type: 'textarea', label: '나의 창의적 노력', placeholder: '여러분이 문구를 다듬기 위해 노력한 점은 무엇인가요?' }
        ]
    }
};
