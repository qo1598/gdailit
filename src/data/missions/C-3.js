export const C3_MISSION = {
    title: '마법 단어로 포스터 만들기',
    competency: 'AI와 창의적 협업',
    why: {
        lower: 'AI가 만든 멋진 그림에 사람의 따뜻한 마음을 얹어볼까요?',
        middle: 'AI의 결과물을 그대로 쓰지 않고, 나만의 개성을 더해 창작물을 발전시켜요.',
        upper: '인간-AI 협업 과정에서 창작자의 주도성과 윤리적 책임(저작권 등)을 숙고합니다.'
    },
    aiPromptText: '제가 학교 축제를 위한 포스터 초안을 짰습니다. 하지만 뭔가 부족해 보이네요. 사람의 마음을 터치할 명작을 완성해주세요.',
    example: '기계가 쓴 딱딱한 문구를 신나게 바꾸기',
    storySteps: {
        lower: [
            { text: '안녕하세요! 저는 마법의 글쓰기 요정 선생님, 알리예요. AI는 마법처럼 글을 뚝딱 만들어주지만, 진짜 멋진 글은 사람의 마음이 필요하답니다.', image: '/robot_2d_base.png' },
            { text: 'AI가 우리 반 축제를 위해 마법의 잉크로 쓴 포스터를 살펴볼까요? 뭔가 부족한 느낌이 들지 않나요?', image: '/c3_diverse_poster_2026.png' },
            { text: 'AI가 만든 문구 중에 여러분의 마음을 "반짝" 하고 흔드는 단어를 골라보는 거예요.', image: '/robot_2d_base.png' },
            { text: '여러분이 고른 단어가 우리 포스터를 세상에서 가장 빛나게 만들어 줄 거예요!', image: '/c3_diverse_poster_2026.png' },
            { text: '자, 마법의 포스터 제작 미션 시작! 예쁜 단어를 고르러 가보아요!', image: '/robot_2d_base.png' }
        ],
        middle: [
            { text: '반가워요! 저는 카피라이터 선생님, 알리예요. AI는 차가운 계산으로 글을 뽑아내지만, 우리는 거기에 생명력을 불어넣어 줘야 해요.', image: '/robot_2d_base.png' },
            { text: 'AI가 만든 이 포스터는 너무 정직하기만 해서, 우리 반만의 개성이 전혀 느껴지지 않거든요.', image: '/c3_diverse_poster_2026.png' },
            { text: '우리 반 친구들만 아는 비밀이나 재미있는 별명을 넣어 포스터를 개성 넘치게 바꿔볼까요?', image: '/robot_2d_base.png' },
            { text: '여러분이 수정하는 내용은 포스터에 실시간으로 반영되어 멋지게 완성될 거예요.', image: '/c3_diverse_poster_2026.png' },
            { text: '우리의 마음을 사로잡을 최고의 카피라이터가 되어주세요! 미션 시작!', image: '/robot_2d_base.png' }
        ],
        upper: [
            { text: '어서 오세요! 여러분의 창작 멘토 선생님, 알리예요. AI와 협업하여 창작물을 만들 때 가장 중요한 건 "내가 주인이 되는 것"과 "정직"이에요.', image: '/robot_2d_base.png' },
            { text: 'AI가 생성한 초안을 바탕으로 인간의 섬세한 감성을 더해 최종 홍보물을 완성해 볼까요?', image: '/c3_diverse_poster_2026.png' },
            { text: '멋진 축제 포스터를 만드는 데 그치지 않고, 저작권과 윤리까지 완벽하게 챙기는 프로다운 모습을 보여주세요.', image: '/robot_2d_base.png' },
            { text: 'AI 사용 체크리스트를 직접 작성하며 책임감 있는 창작자가 되는 연습을 하는 거랍니다.', image: '/c3_diverse_poster_2026.png' },
            { text: '자, AI와 함께하는 창의적이고 윤리적인 창작 미션, 지금부터 시작해 보아요!', image: '/robot_2d_base.png' }
        ]
    },
    prompts: {
        lower: ['AI 로봇이 우리 반 가을 축제를 위해 "2026 우리 반 가을 축제: 마법 같은 조화! 함께 만들고 같이 즐기는 행복한 시간, 파이팅! 우리 모두가 주인공입니다."라는 문구를 주었어. 여러 번 읽어보고 가장 예쁘고 내 마음에 드는 단어를 골라 볼까요?'],
        middle: ['AI가 추천한 포스터 문구가 조금 심심하네요. 우리 반의 별명이나 재미있는 특징을 팍팍 넣어서 엄청나게 멋진 포스터 문구로 바꿔 볼까요? 수정한 내용은 아래 포스터에 실시간으로 나타날 거예요!'],
        upper: ['AI 도구의 도움을 받아 환상적인 학교 축제 홍보물을 완성해 봅시다. 문구를 세련되게 다듬고, 게시판에 붙이기 전 AI와 함께 포스터를 만들 때 확인해야 할 체크리스트 내용을 만들어 보아요.']
    },
    type: 'direct-text',
    stackedInputs: {
        lower: [
            { id: 'favorite_word', type: 'text', label: '1. 내 마음에 쏙 드는 반짝이는 단어는 무엇인가요?', placeholder: '포스터 문구 중에서 소리내어 말할 때 기분이 좋아지는 단어나 구절을 골라보세요.' }
        ],
        middle: [
            { id: 'creative_edit', type: 'textarea', label: '1. 내 손맛을 거친 개성 만점 축제 포스터 문구를 적어볼까요?', placeholder: '우리 반 친구들만 아는 웃긴 유행어나 엄청난 수식어(우주 최강 반)를 결합해 보세요.' }
        ],
        upper: [
            { id: 'creative_edit', type: 'textarea', label: '1. 내가 다듬어 완성한 최종 홍보 문구를 적어주세요.', placeholder: '기초 AI 텍스트를 감성적이고 세련된 표현으로 업그레이드하여 적어보세요.' },
            {
                id: 'ethics_checklist', type: 'multi-text', label: '2. AI와 함께 포스터를 만들 때 생각할 점 3가지를 적어보세요.', fields: [
                    { id: 'thought_1' },
                    { id: 'thought_2' },
                    { id: 'thought_3' }
                ]
            }
        ]
    }
};