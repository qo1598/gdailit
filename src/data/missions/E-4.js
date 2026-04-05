export const E4_MISSION = {
    title: 'AI는 모든 친구에게 친절할까?',
    competency: 'AI 인식 및 발견',
    why: {
        lower: 'AI 로봇이 모든 친구의 목소리와 얼굴을 똑같이 잘 알아듣게 가르쳐주세요!',
        middle: '데이터가 골고루 학습되지 않으면 특정 사람을 차별하는 불공평한 AI가 될 수 있어요.',
        upper: '학습 데이터의 편향(Bias)이 사회적 불평등을 심화시키는 윤리적 문제를 탐구합니다.'
    },
    example: {
        lower: '어른의 목소리만 잘 알아듣는 똑똑한 스피커, 간호사는 여자라고 생각하는 AI',
        middle: '어른 얼굴은 잘 보면서 어린이 얼굴은 잘 못 알아보는 카메라',
        upper: '특정 인종이나 성별에 대해서만 성능이 떨어지는 안면 인식 알고리즘 사례'
    },
    storySteps: {
        lower: [
            { text: '안녕하세요! 저는 탐험가 알리예요. 오늘은 AI 친구가 모든 사람에게 공평하게 대하는지 알아볼 거예요!', image: '/robot_2d_base.png' },
            { text: '가끔 어떤 기계들은 키가 작은 어린이나, 목소리가 높은 어린이의 말을 잘 못 알아들을 때가 있대요.', image: '/e4_fairness_mission.png' },
            { text: '그건 AI가 공부할 때 어른들의 목소리나 사진만 주로 공부했기 때문이에요.', image: '/robot_2d_base.png' },
            { text: '모든 친구에게 친절하고 똑똑한 AI를 만들려면 무엇이 필요할까요? 우리 같이 해결책을 찾아볼까요?', image: '/e4_fairness_mission.png' },
            { text: '여러분이 공정한 심사관이 되어 AI가 놓친 친구들의 목소리를 찾아줄 준비가 되었나요?', image: '/robot_2d_base.png' }
        ],
        middle: [
            { text: '반가워요! 저는 공정한 심사관 알리예요. 오늘은 알고리즘 속에 숨겨진 "편향성"을 찾아볼 거예요.', image: '/robot_2d_base.png' },
            { text: 'AI 얼굴인식 카메라가 어른 사진만 너무 많이 배우면, 어린이 얼굴은 투명인간으로 착각할 수 있어요.', image: '/e4_fairness_mission.png' },
            { text: '데이터를 골고루 배우지 못하면 AI는 특정 사람을 차별하는 결과를 내놓기도 해요.', image: '/robot_2d_base.png' },
            { text: '이런 불공평한 AI는 우리 사회에 큰 문제를 일으킬 수 있어요. 이를 막기 위해 여러분은 어떻게 할 건가요?', image: '/e4_fairness_mission.png' },
            { text: '여러분의 경험이나 생각을 바탕으로 이 문제를 해결할 단서를 찾아볼까요? 미션 시작!', image: '/robot_2d_base.png' }
        ],
        upper: [
            { text: '환영해요! 저는 AI 윤리 전문가 알리예요. 기술의 편리함 속에 숨겨진 "알고리즘 차별" 문제를 파헤쳐 볼까요?', image: '/robot_2d_base.png' },
            { text: '학습 데이터에 사회적 약자나 소수자의 정보가 누락되면, AI는 불공평한 판단을 내리게 돼요.', image: '/e4_fairness_mission.png' },
            { text: '특정 인종이나 성별에 대해서만 성능이 떨어지는 사례는 기술의 중립성을 의심케 하는 심각한 문제랍니다.', image: '/robot_2d_base.png' },
            { text: '이제 여러분이 직접 AI의 차별 사례를 분석하고, 이를 방지하기 위한 전문적인 "윤리 수칙"을 제안해 보세요.', image: '/e4_fairness_mission.png' },
            { text: '공정하고 정의로운 AI 세상을 만들기 위한 비판적 시각을 보여주세요. 시작할까요!', image: '/robot_2d_base.png' }
        ]
    },
    prompts: {
        lower: ['AI 스피커나 스마트폰 비서(시리, 빅스비) 등에게 말을 걸었을 때 내 말을 잘 못 알아들어서 답답하거나 불편했던 적이 있나요?'],
        middle: ['만약 AI 얼굴 카메라가 어른만 빨리 인식해 통과시키고 어린이 얼굴은 하루 종일 인식 못 한다면, 이 AI를 만든 연구원들은 무슨 실수를 한 걸까요?'],
        upper: ['AI가 특정 사용자(어린이, 장애인, 유색인종 등)를 차별하여 작동하는 사례를 탐구해 보세요. 모든 AI 개발자가 의무적으로 지켜야 할 "차별 방지 약속" 3가지를 제안해 볼까요?']
    },
    type: 'direct-text',
    stackedInputs: {
        lower: [{ id: 'experience', type: 'textarea', label: '1. AI가 내 말을 잘 알아듣지 못해서 답답했던 경험이 있나요?', placeholder: '내 이름을 엉뚱하게 부르거나, 내가 시킨 것과 다른 행동을 했던 경험을 적어보세요.' }],
        middle: [{ id: 'experience', type: 'textarea', label: '1. 기계가 어린이나 나이 드신 분들에게만 불편하게 작동했던 경험이나 이야기가 있나요?', placeholder: '어린이나 나이 드신 분들에게만 불편하게 작동했던 기계 이야기를 들려주세요.' }, { id: 'reason', type: 'textarea', label: '2. 원인 추적: 개발자들은 왜 이런 실수를 했을까요?', placeholder: '기계에게 가르쳐준 (학습 데이터) 사진 중에 어린이 사진이 너무 빠져있진 않았을까요?' }],
        upper: [
            { id: 'reason', type: 'textarea', label: '1. 기술적 편향이 생기는 근본 원인은 무엇이라고 생각하나요?', placeholder: '데이터를 수집할 때 특정 사람들의 사진만 너무 많이 넣고 다른 사람들을 무시한 문제가 아닐까요?' },
            { id: 'rule1', type: 'text', label: '2. 차별 방지를 위한 개발자 수칙 1은 무엇인가요?', placeholder: '어린이, 노인, 장애인 등 다양한 사람의 정보를 함께 공부시켜야 해요.' },
            { id: 'rule2', type: 'text', label: '3. 차별 방지를 위한 개발자 수칙 2는 무엇인가요?', placeholder: '기계를 세상에 내놓기 전에 모든 사람에게 잘 작동하는지 꼼꼼히 확인해요.' },
            { id: 'rule3', type: 'text', label: '4. 차별 방지를 위한 개발자 수칙 3은 무엇인가요?', placeholder: '이 AI가 누구에게 더 잘 작동하거나 부족한지 사람들에게 솔직하게 알려요.' }
        ]
    }
};