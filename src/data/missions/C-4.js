export const C4_MISSION = {
    title: '나의 노력, 정직한 마침표',
    competency: '창작물 출처 표기 및 정직성',
    ksa_tags: { K: "K5.3", S: "Communication", A: "Responsible" },
    type: {
        lower: 'stacked-inputs',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '내가 그림을 그렸는데, AI가 조금 도와줘서 더 멋진 그림이 되었어요!' },
            { text: '이걸 친구들에게 보여줄 때, AI와 함께 그렸다고 말하면 어떤 기분이 들까요?' },
            { text: '정직하게 말했을 때의 내 마음을 일기에 짧게 적어 봅시다.' }
        ],
        middle: [
            { text: '가끔은 AI가 했다고 말하기 쑥스러울 수 있지만, 정직하게 밝히는 용기가 중요해요.' },
            { text: 'AI의 도움을 숨겼을 때 어떤 오해가 생길 수 있을까요?' },
            { text: '친구와 선생님에게 정직하게 고백하는 멋진 한 마디를 연습해 봅시다.' }
        ],
        upper: [
            { text: '디지털 시대에는 AI 활용 여부를 투명하게 공개하는 것이 신뢰의 기본입니다.' },
            { text: '여러분의 작품 뒤에 붙일 "AI 사용 출처 표기 가이드라인"을 직접 설계해 보세요.' },
            { text: '마지막으로, 앞으로 AI를 어떻게 정직하게 활용할지 "정직 선언문"을 작성하며 마무리합니다.' }
        ]
    },
    education: {
        lower: {
            why: '정직하게 말하는 것이 마음을 더 편안하게 만든다는 활성을 알기 위해서예요.',
            example: '"이 그림의 나무는 AI가 그렸어!"라고 말하면 더 자신감이 생길 수 있어요.'
        },
        middle: {
            why: '기술을 대하는 정직한 태도가 다른 사람과의 신뢰 관계에 미치는 영향을 이해합니다.',
            example: '내가 한 것처럼 거짓말을 하면, 나중에 진짜 내 실력을 보여줄 수 없어 속상해질 수 있어요.'
        },
        upper: {
            why: '학문적, 창작적 신뢰를 지키기 위한 구체적인 방법론(인용 및 표기)을 체화합니다.',
            example: '"[참고] 이 에세이의 아이디어 구성을 위해 Gemini 1.5가 활용되었습니다" 와 같이 표기합니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'diary_feel', type: 'text', label: '정직한 내 마음', placeholder: '솔직하게 말하면 기분이 어떨까요?' }
        ],
        middle: [
            { id: 'problem', type: 'text', label: '숨겼을 때 생기는 일', placeholder: '거짓말을 하면 나중에 어떤 문제가 생길까요?' },
            { id: 'solution', type: 'textarea', label: '정직한 고백의 한 마디', placeholder: '"선생님, 사실..." 로 시작하는 멋진 말' }
        ],
        upper: [
            { id: 'attribution', type: 'text', label: '나만의 출처 표기법', placeholder: '작품 어디에, 어떻게 표기하면 좋을까요?' },
            { id: 'promise_1', type: 'text', label: '선언: 하나', placeholder: 'AI 결과물을 그대로 베끼지 않겠습니다.' },
            { id: 'promise_2', type: 'text', label: '선언: 둘', placeholder: '도움받은 부분을 투명하게 공개하겠습니다.' }
        ]
    }
};
