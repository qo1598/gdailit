export const E1_MISSION = {
    title: '숨은 AI를 찾아라!',
    competency: 'AI 인식 및 발견',
    why: {
        lower: '우리 주변에 보물찾기처럼 똑똑한 기계를 찾아봐요!',
        middle: '우리 생활을 편리하게 해주는 AI 기술의 원리를 이해해요.',
        upper: '현대 사회의 핵심 기술인 AI의 사회적 역할을 탐구합니다.'
    },
    example: {
        lower: '집 안의 로봇청소기, 엄마 폰의 똑똑한 비서',
        middle: '유튜브의 영상 추천, 내가 좋아하는 것 같은 광고',
        upper: '도심의 자율주행 버스, 공장의 스마트 제조 로봇'
    },
    storySteps: {
        lower: [
            { text: '안녕하세요! 저는 AI 로봇 알리예요. 만나서 정말 반가워요!', image: '/robot_2d_base.png' },
            { text: '우리 집이나 학교에는 똑똑한 AI 친구들이 몰래 숨어있대요.', image: '/e1_mission_v3.png' },
            { text: '로봇청소기처럼 스스로 움직이거나, 내 목소리를 알아듣는 친구들이 모두 AI랍니다!', image: '/robot_2d_base.png' },
            { text: '우리 주변 어디에 숨어있는지 탐정처럼 눈을 크게 뜨고 찾아볼까요?', image: '/e1_mission_v3.png' },
            { text: '찾았으면 찰칵! 사진을 찍어서 제게 보여주세요. 어떤 도움을 주는지도 궁금해요!', image: '/robot_2d_base.png' }
        ],
        middle: [
            { text: '안녕하세요! 저는 알리예요. 우리 주변엔 몰래 숨어서 우리를 도와주는 AI 친구들이 아주 많아요.', image: '/robot_2d_base.png' },
            { text: '유튜브 추천 영상이나 날씨를 알려주는 스피커도 모두 AI 기술로 만들어졌답니다.', image: '/e1_mission_v3.png' },
            { text: 'AI는 우리가 무엇을 좋아하는지, 무엇이 필요한지 스스로 학습하고 판단해요.', image: '/robot_2d_base.png' },
            { text: '이제 여러분이 탐정이 되어 우리 생활 곳곳에 숨어있는 AI를 조사해 볼까요?', image: '/e1_mission_v3.png' },
            { text: '어떤 AI를 발견했는지, 그 친구가 어떤 착한 일을 하고 있는지 제게 상세히 알려주세요!', image: '/robot_2d_base.png' }
        ],
        upper: [
            { text: '안녕하세요! 저는 알리예요. 현대 사회의 일상 곳곳에는 수많은 AI 시스템이 이미 깊숙이 들어와 있어요.', image: '/robot_2d_base.png' },
            { text: '스마트홈, 자율주행, 정교한 알고리즘 서비스 등이 우리 삶을 더 편리하게 만들고 있답니다.', image: '/e1_mission_v3.png' },
            { text: '하지만 너무 익숙해서 우리는 그 속에 숨겨진 AI의 정체를 종종 놓치곤 해요.', image: '/robot_2d_base.png' },
            { text: '이제 여러분이 AI 전문가가 되어 우리 일상 속 AI 기술을 찾아 사진을 찍고 분석해 볼까요?', image: '/e1_mission_v3.png' },
            { text: '편리함뿐만 아니라 그 뒤에 숨겨진 작동 원리와 한계까지 찾아낸다면, 정말 훌륭한 전문가가 될 거예요!', image: '/robot_2d_base.png' }
        ]
    },
    prompts: {
        lower: ['AI 친구를 찾아 사진을 찍고, 어디에 있는지 알려주세요!'],
        middle: ['사진을 올리고, AI가 우리를 어떻게 도와주는지 설명해 주세요!'],
        upper: ['AI 기술의 사진을 올리고, 제공하는 편리함과 한계점을 분석해 보세요!']
    },
    type: 'upload-text',
    stackedInputs: {
        lower: [{ id: 'location', type: 'text', label: '1. 어디서 발견했나요?', placeholder: '방금 내가 주변에서 발견한 위치나 기계의 특징을 적어보세요.' }],
        middle: [
            { id: 'location', type: 'text', label: '1. 어디서 발견했나요?', placeholder: '집이나 학교 등 AI 친구를 만난 정확한 장소를 알려주세요.' },
            { id: 'function', type: 'textarea', label: '2. 여러분이 찾은 AI는 우리에게 어떤 편리함을 제공하나요?', placeholder: '이 AI가 특별히 어떤 귀찮은 일을 알아서 해주는지 생각해 보세요.' }
        ],
        upper: [
            { id: 'location', type: 'text', label: '1. 어디서 발견했나요?', placeholder: '집이나 학교 등 AI 친구를 만난 정확한 장소를 알려주세요.' },
            { id: 'function', type: 'textarea', label: '2. 여러분이 찾은 AI는 우리에게 어떤 편리함을 제공하나요?', placeholder: '이 AI가 특별히 어떤 귀찮은 일을 알아서 해주는지 생각해 보세요.' },
            { id: 'pros_cons', type: 'textarea', label: '3. 편리함 뒤에 숨겨진 아쉬운 점(한계)을 적어보세요.', placeholder: '이 기계가 모든 상황에서 완벽할까? 사람이 직접 해야만 하는 일이나 위험한 점은 없는지 분석해 보세요.' }
        ]
    }
};