export const C1_MISSION = {
    title: '판타지 릴레이 동화 만들기!',
    competency: 'AI와 창의적 협업',
    why: {
        lower: 'AI 친구와 동화책을 같이 만들면 정말 재미있어요!',
        middle: 'AI의 문장 생성 능력을 활용해 창의성을 확장해 보아요.',
        upper: '인간과 기계의 창작 작업 과정에서 "기여도"와 책임을 탐색합니다.'
    },
    example: {
        lower: '초콜릿 나라에 간 토끼 이야기 이어 쓰기',
        middle: '외계인이 우리 학교 급식실에 나타난다면?',
        upper: '인공지능 탐정과 함께 미궁에 빠진 사건 해결하기'
    },
    storySteps: {
        lower: [
            { text: '안녕! 나는 꼬마 작가 로봇 알리야. 만나서 정말 반가워!', image: '/robot_2d_base.png' },
            { text: '우리 머릿속에만 있던 마법 같은 이야기를 현실로 만들어볼까?', image: '/c1_story_v3.png' },
            { text: '내가 이야기의 시작을 적어 주면, 네가 다음 이야기를 이어주는 거야.', image: '/robot_2d_base.png' },
            { text: '우리가 힘을 합치면 세상에 하나뿐인 멋진 동화책이 탄생할 거야!', image: '/c1_story_v3.png' },
            { text: '상상력 나래를 활짝 펴고, 우리만의 판타지 세계로 떠나보자! 출발!', image: '/robot_2d_base.png' }
        ],
        middle: [
            { text: '반가워! 나는 베스트셀러 작가 알리야. 오늘은 너와 함께 판타지 대작을 집필해볼 거야.', image: '/robot_2d_base.png' },
            { text: 'AI와 사람이 힘을 합치면 그 어떤 기발한 이야기도 탄생할 수 있어.', image: '/c1_story_v3.png' },
            { text: '내가 첫 문장을 던질 테니, 누구도 예상 못 한 기상천외한 반전을 네가 넣어줄래?', image: '/robot_2d_base.png' },
            { text: '너의 창의성이 AI의 생성 능력과 만나면 어떤 일이 벌어질지 정말 기대돼!', image: '/c1_story_v3.png' },
            { text: '준비됐지? 자 이제 우리만의 릴레이 동화 쓰기 대작전 시작!', image: '/robot_2d_base.png' }
        ],
        upper: [
            { text: '환영해! 나는 전문 창작 파트너 알리야. 오늘은 인간의 독창성과 AI의 생성 능력이 만나는 창작의 세계를 경험해볼 거야.', image: '/robot_2d_base.png' },
            { text: '서로 교대로 한 줄씩 이야기를 이어가며 깊이 있는 판타지 소설을 완성해보자.', image: '/c1_story_v3.png' },
            { text: '문장을 완성한 다음에는 우리가 어떻게 협동했는지, 누구의 아이디어가 더 빛났는지 스스로 평가해보자!', image: '/robot_2d_base.png' },
            { text: '단순한 보조 도구를 넘어서서 AI와의 창의적 협업, 너의 작가적 기량을 보여줘!', image: '/c1_story_v3.png' },
            { text: '자 이제 타자기 키보드를 잡고 우리만의 걸작을 뽐내봐! 시작!', image: '/robot_2d_base.png' }
        ]
    },
    userTurnLimit: { lower: 3, middle: 5, upper: 7 },
    prompts: {
        lower: ['짜잔! AI 작가가 신비한 동화의 앞부분을 시작했어요. 우리에게는 총 3번의 이야기가 이어질 기회가 있어요. 너의 상상력을 대가동해서 멋진 문장으로 신나게 이어 볼까요?'],
        middle: ['AI 작가의 시작은 평범하지만 스릴이 조금 부족하네요! 우리에게는 총 5번의 이야기가 이어질 기회가 있어요. 너의 상상력을 듬뿍 담아 반전의 반전을 넣어 기발하게 이어가볼까요?'],
        upper: ['AI와 교대로 한 줄씩 나누어 예측불허의 판타지 소설을 완성해 보세요. 우리에게는 총 7번의 이야기가 이어질 기회가 있어요. 완전히 끝난 뒤 이 명작 스토리를 설계한 "나의 기여도(%)"를 당당하게 주장해 보세요.']
    },
    type: 'chat',
    isChatMode: true,
    chatInitiator: { lower: 'ai', middle: 'ai', upper: 'ai' },
    aiPromptText: '옛날 옛적, 만지면 유리로 변하는 마법의 우물 분수대 곳에 투명 망토를 두른 다람쥐가 뿅! 나타났어요. 다람쥐가 망토를 휙 벗자...',
    persona: (gradeGroup, currentTurn, maxTurns) => {
        const isFinalTurn = currentTurn >= maxTurns;
        const basePersona = `당신은 호들갑스럽고 재치 넘치는 'AI 창의적 작가'입니다. 학생이 기발한 문장을 적으면 "우와아앗!! 대박이에요!" 라며 과장되게 호응하고, 더 흥미진진하고 어이없는 상황을 꼬리물기로 붙여서 학생의 다음 답변을 이끌어내세요. 학생의 창의성을 최고조로 끌어올리는 것이 목표입니다.`;
        const finalInstruction = isFinalTurn
            ? `\n\n[중요: 자동 종료 알림] 지금은 학생의 마지막(${currentTurn}/${maxTurns}) 입력입니다. 학생의 문장을 바탕으로 지금까지의 이야기를 아주 멋지고 감동적으로, 혹은 기발하게 요약하며 대단원의 막을 내려주세요. 마지막 답변이므로 학생에게 다시 질문하지 마세요.`
            : `\n\n[현재 진행: ${currentTurn}/${maxTurns}] 학생의 답변에 신나게 반응하고 다음 이야기를 흥미롭게 이어주세요. 아직 이야기가 더 남아있음을 알려주세요.`;
        return basePersona + finalInstruction;
    }
};