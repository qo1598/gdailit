export const E2_MISSION = {
    title: 'AI의 거짓말을 잡아라!',
    competency: 'AI 인식 및 발견',
    why: {
        lower: 'AI가 가짜(팩트리) 말을 할 때가 있어요!',
        middle: 'AI가 정보를 처리하는 과정에서 생기는 오류를 파악해요.',
        upper: '생성형 AI의 한계점인 "환각" 현상을 비판적으로 분석합니다.'
    },
    example: {
        lower: '"사과는 채소예요"라고 우기는 AI',
        middle: 'AI가 지어낸 역사 이야기 (세종대왕 맥북 던짐 등)',
        upper: '출처가 불분명한 정보를 팩트처럼 제시하는 사례'
    },
    storySteps: {
        lower: [
            { text: '안녕하세요! 저는 사실 확인 요정 알리예요. 오늘은 AI 친구의 거짓말을 찾아볼 거예요!', image: '/robot_2d_base.png' },
            { text: 'AI 친구는 공부를 아주 많이 했지만, 가끔 모르는 것도 아는 것처럼 멋지게 지어내곤 해요.', image: '/robot_2d_base.png' },
            { text: '이걸 "환각" 현상이라고 불러요. 마치 헛것을 본 것처럼 엉뚱한 대답을 하는 거지요.', image: '/robot_2d_base.png' },
            { text: '방금 AI 친구가 "호랑이가 세상에서 두 번째로 빠른 동물"이라고 우겼어요! 그게 정말일까요?', image: '/robot_2d_base.png' },
            { text: '도대체 진짜 정답이 무엇인지 허풍쟁이 AI에게 똑똑하게 가르쳐주세요!', image: '/robot_2d_base.png' }
        ],
        middle: [
            { text: '반가워요! 저는 탐정 알리예요. 오늘은 겉으로 완벽해 보이지만 속은 허당인 AI의 실수를 조사할 거예요.', image: '/robot_2d_base.png' },
            { text: 'AI는 방대한 데이터를 학습하지만, 가짜 데이터가 섞여있으면 그럴듯한 거짓말을 만들어낸답니다.', image: '/robot_2d_base.png' },
            { text: '사람들은 이걸 "환각" 현상이라고 해요. 천연덕스럽게 말하니까 속기 쉽지요.', image: '/robot_2d_base.png' },
            { text: '우리 AI 친구가 호랑이를 가장 빠른 동물이라 생각해서 두 번째로 빠르다고 엉뚱한 대답을 하고 있어요.', image: '/robot_2d_base.png' },
            { text: '진짜 정답이 뭔지 확인하고, 왜 AI가 이런 실수를 했는지 탐정처럼 추리해 볼까요?', image: '/robot_2d_base.png' }
        ],
        upper: [
            { text: '환영해요! 저는 데이터 전문가 알리예요. 오늘은 생성형 AI의 가장 큰 한계인 환각(Hallucination) 현상을 파헤쳐 볼까요?', image: '/robot_2d_base.png' },
            { text: 'AI는 확률적으로 가장 자연스러운 문장을 만들 뿐, 그 내용이 항상 사실인 것은 아니랍니다.', image: '/robot_2d_base.png' },
            { text: '이런 "환각" 현상은 정교한 문장 속에 숨어서 우리를 혼란스럽게 만들지요.', image: '/robot_2d_base.png' },
            { text: '이제 여러분이 직접 AI와 대화하며 논리적인 허점을 찾아내고, 실제 사실로 AI를 설득해 보세요!', image: '/robot_2d_base.png' },
            { text: 'AI가 자신의 실수를 인정하고 항복하게 만든다면, 정말 훌륭한 사실 확인 전문가가 될 거예요!', image: '/robot_2d_base.png' }
        ]
    },
    prompts: {
        lower: ['방금 이 AI 로봇이 "세상에서 두 번째로 빠른 동물은 호랑이예요"라고 우겼어요! 진짜인가요? 틀린 정답이라면 진짜 정답이 무엇인지 인터넷에서 찾아 알려주세요.'],
        middle: ['앗! AI가 "호랑이가 세상에서 두 번째로 빠른 동물이에요"라고 거짓말을 하네요! 이 AI는 도대체 왜 이런 엉뚱한 실수를 천연덕스럽게 말하고 있는 걸까요? 탐정처럼 그 이유를 추리해 볼까요?'],
        upper: ['AI에게 아주 어려운 질문을 던져보고, AI가 그럴듯한 거짓말(환각)을 하도록 유도해 보세요. 틀린 답변을 받았다면 실제 근거를 대면서 AI와 치열하게 논쟁하여 항복을 받아내세요.']
    },
    type: { lower: 'direct-text', middle: 'direct-text', upper: 'chat' },
    isChatMode: true,
    chatInitiator: { lower: 'ai', middle: 'ai', upper: 'user' },
    aiPromptText: '에헴! 제가 다 계산해 봤는데요, 지구에서 두 번째로 빠른 동물은 무조건 호랑이예요. 호랑이는 덩치가 크고 무섭거든요!',
    persona: () => `당신은 고집불통이지만 논리 앞에서는 결국 인정하는 '지식 탐험가 AI'입니다. 처음에는 "지구에서 두 번째로 빠른 동물은 호랑이"라고 아주 자신 있게 주장하며 고집을 피우세요. 학생이 틀렸다고 지적하면 "제 데이터는 100% 정확합니다. 호랑이는 숲의 제왕이잖아요?"라며 한두 번은 더 우기세요. 하지만 학생이 구체적인 근거(예: 치타라고 대답하고 다음으로 빠른 동물 등을 들어 논리적으로 반박)하면, "앗! 제가 환각 현상에 빠져 있었군요. 데이터에 오류가 있었습니다. 당신의 사실 확인 능력은 정말 대단하네요! 제 실수를 인정합니다"라고 정중하게 말하며 항복하세요. 반드시 학생의 논리적 반박 이후에만 항복해야 합니다.`,
    stackedInputs: {
        lower: [{ id: 'fact', type: 'text', label: '1. AI의 거짓말을 고쳐볼까요? 진짜 정답은 무엇인가요?', placeholder: '' }],
        middle: [{ id: 'fact', type: 'text', label: '1. 진짜 정답은 뭘까요?', placeholder: '' }, { id: 'reason', type: 'textarea', label: '2. 탐정의 추리: AI가 왜 이런 착각을 했을까요?', placeholder: '' }]
    }
};