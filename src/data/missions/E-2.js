export const E2_MISSION = {
    title: 'AI 답, 믿어도 될까?',
    competency: '환각 인지 및 사실 확인',
    ksa_tags: { K: "K4.3", S: "Critical Thinking", A: "Responsible" },
    type: {
        lower: 'stacked-inputs',
        middle: 'stacked-inputs',
        upper: 'chat'
    },
    storySteps: {
        lower: [
            { text: '와 특종이에요! AI가 세종대왕님이 맥북을 던졌다는 가짜 뉴스를 만들었어요!' },
            { text: 'AI는 아주 똑똑해 보이지만, 가끔은 이렇게 말도 안 되는 거짓말을 할 때가 있답니다.' },
            { text: '여러분, AI의 거짓말을 찾아내고 진짜 정답이 무엇인지 가르쳐줄 수 있나요?' }
        ],
        middle: [
            { text: 'AI가 생성하는 정보는 때때로 사실과 다른 내용(환각 현상)을 포함할 수 있습니다.' },
            { text: '이런 가짜 정보를 그대로 믿으면 큰 문제가 생길 수 있어요. 우리가 직접 팩트체크를 해봅시다.' },
            { text: 'AI가 틀린 답을 내놓은 이유가 무엇인지, 학습 데이터의 관점에서 함께 고민해 봐요.' }
        ],
        upper: [
            { text: 'LLM(대규모 언어 모델)은 확률에 기반하여 답변을 생성하므로, 교묘한 거짓말을 할 수 있습니다.' },
            { text: 'p.43에 따르면, AI 생성물을 비판적으로 평가하는 것은 디지털 시민의 필수 역량입니다.' },
            { text: '이제 실시간 대화를 통해 AI의 논리적 허점을 지적하고, AI가 스스로 오류를 인정하도록 유도해 보세요.' }
        ]
    },
    education: {
        lower: {
            why: 'AI가 항상 정답만 말하는 것은 아니라는 점을 알기 위해서예요.',
            example: 'AI가 "고래는 다리가 4개예요"라고 하면, 우리가 틀렸다고 말해줘야 해요.'
        },
        middle: {
            why: '정보의 출처를 확인하고 오답의 원인을 분석하는 능력을 기릅니다.',
            example: '인터넷에 잘못된 정보가 많을 때, AI도 그 잘못된 정보를 배울 수 있어요.'
        },
        upper: {
            why: '복잡한 정보 속에서 사실과 허구를 구분하는 고도의 비판적 사고력을 갖춥니다.',
            example: '딥페이크나 정교한 가짜 뉴스를 발견했을 때 논리적으로 반박할 수 있어야 합니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'fact', type: 'text', label: 'AI의 거짓말 고쳐주기', placeholder: '세종대왕님은 사실 무엇을 하셨나요?' }
        ],
        middle: [
            { id: 'fact', type: 'text', label: '발견한 거짓 정보', placeholder: 'AI가 틀린 부분은 어디인가요?' },
            { id: 'reason', type: 'textarea', label: 'AI가 실수한 이유 추측', placeholder: '데이터가 부족했을까요, 아니면 헷갈린 걸까요?' }
        ]
    }
};
