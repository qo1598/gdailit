const fs = require('fs');
const path = require('path');

const targetFile = 'c:/Cursor/allit/src/components/Mission.jsx';
let content = fs.readFileSync(targetFile, 'utf8');

const UPDATES = {
    'C-1': {
        title: '판타지 릴레이 동화 쓰기!',
        competency: 'AI와 창의적 활용',
        why: {
            lower: 'AI 작가와 번갈아 가며 한 줄씩 릴레이 소설을 쓰다 보면 나 혼자서는 절대 상상 못 했던 미친 듯이 재밌는 이야기가 탄생한답니다.',
            middle: '생성형 AI는 창작의 고통을 덜어주는 훌륭한 브레인스토밍 파트너입니다. AI가 던진 아이디어에 나의 감성을 더해 보세요.',
            upper: 'AI와의 협업 창작은 인간의 창의성을 확장하는 새로운 예술 형태입니다. 기술을 도구로 활용해 나만의 독창적인 서사를 구축해 보세요.'
        },
        example: {
            lower: '초콜릿 폭포 옆 무지개 토끼 이야기 한 줄 멋지게 지어내기',
            middle: '평범한 일상에 판타지 요소를 AI와 함께 섞어 기발한 반전 만들기',
            upper: 'AI가 생성한 초안을 바탕으로 문체와 인물의 심송 묘사를 정교하게 다듬어 최종 릴레이 명작 완성하기'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 창의력 대장 알리야. 오늘은 AI 작가랑 같이 마법 동화를 한 줄씩 써볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 작가는 우리 머릿속 상상을 아주 멋진 글자로 쨘! 하고 나타나게 도와준대.', image: '/robot_2d_base.png' },
                { text: '하지만 진짜 이야기의 주인공은 너야! 네 상상력이 더해져야 진짜 살아 움직이는 동화가 되거든.', image: '/robot_2d_base.png' },
                { text: '지금 AI 작가가 첫 문장을 보냈어. 그 다음 이야기를 네가 멋지게 완성해 줄래?', image: '/robot_2d_base.png' },
                { text: '자, 우리 반에서 가장 재미난 동담작가가 되어보자! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 문학 소년 알리야. 오늘은 AI와 협업해서 판타지 소설을 집필해 보자.', image: '/robot_2d_base.png' },
                { text: '생성형 AI는 창의적인 아이디어를 제안하는 데 아주 훌륭한 파트너가 될 수 있어.', image: '/robot_2d_base.png' },
                { text: '하지만 진짜 재미있는 반전과 감동은 바로 "사람의 손길"에서 탄생한다는 걸 기억해!', image: '/robot_2d_base.png' },
                { text: 'AI가 던진 문장에 네가 마라맛 반전을 더한다면 세상에 없던 명작이 탄생할 거야.', image: '/robot_2d_base.png' },
                { text: '자, 이제 너의 기발한 상상력을 릴레이 문장에 녹여내 볼까? 시작해 보자!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 창작 가이드 알리야. 오늘은 AI와 창의적 협업을 통해 판타지 대작을 완성해 보자.', image: '/robot_2d_base.png' },
                { text: 'AI는 방대한 데이터를 바탕으로 문장을 생성하지만, 고유한 문체와 영혼은 작가인 네가 불어넣어야 해.', image: '/robot_2d_base.png' },
                { text: '서로 주고받는 문장 속에서 이야기가 어디로 튈지 모르는 릴레이 소설의 묘미를 느껴봐.', image: '/robot_2d_base.png' },
                { text: '소설을 완성한 후에는 이 작품에 얼마나 "나의 노력"이 들어갔는지 비중을 평가해보는 것도 중요해.', image: '/robot_2d_base.png' },
                { text: '자, 이제 AI와 함께 상상력의 한계에 도전해 볼까? 릴레이 소설 쓰기를 시작하자!', image: '/robot_2d_base.png' }
            ]
        },
        scenarioDescriptions: {
            lower: '🌟 동화 속으로: AI 작가가 "옛날 옛적에 초콜릿 폭포 옆에..."라며 멋진 이야기를 시작했어요! 뒷이야기가 벌써 궁금하죠? 😉',
            middle: '📚 릴레이 아이디어: 생성형 AI가 흥미로운 세계관을 제시했습니다. 이제 당신의 "휴먼 필터"를 거쳐 이야기를 완성하세요!',
            upper: '✍️ 창의적 협업: 기술(AI)의 논리와 인간(나)의 영감이 만나 하나의 서사를 구축합니다. 창작의 주도권을 잃지 말고 명작을 설계하세요.'
        },
        scenarioImages: {
            lower: '/robot_2d_base.png',
            middle: '/robot_2d_base.png',
            upper: '/robot_2d_base.png'
        },
        prompts: {
            lower: ['오앗! AI 작가가 재밌는 동화의 앞부분을 시작했어요. 뒷이야기가 너무너무 궁금해요. 내 상상력을 풀가동해서 딱 한 문장만 신나게 이어 써 볼까요?'],
            middle: ['AI 작가의 시작은 훌륭하지만 스릴이 조금 부족하네요! 내 상상력을 듬뿍 담은 마라맛 반전을 넣어 그 다음 문장을 기발하게 이어서 써볼까요?'],
            upper: ['AI와 교대로 역할을 나누어 엎치락뒤치락하는 판타지 소설을 완성해 보세요. 완전히 끝난 후, 이 명작 스토리를 설계한 "나의 기여도(%)"를 당당하게 주장해 보세요!']
        },
        type: 'chat',
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'ai' },
        aiPromptText: '옛날 옛적, 만지면 젤리로 변하는 마법의 파란 분수대 곁에 투명 망토를 두른 다람쥐가 쨘! 나타났어요. 다람쥐가 망토를 휙 벗자...',
        persona: (userName) => {
            const name = userName || '학생';
            return `당신은 호들갑스럽고 재치 넘치는 'AI 창의력 작가'입니다. ${name}님이 기발한 문장을 던지면 "오마이갓!! 대박이에요, ${name}님!" 이라며 과장되게 호응하고, 더 흥미진진하고 어이없는 상황을 꼬리물기로 붙여서 ${name}님의 다음 답변을 이끌어내세요. 5턴 이내로 훈훈하게 끝냅시다.`;
        },
        stackedInputs: {
            upper: [{ id: 'contribution', type: 'text', label: '1. 이 멋진 이야기에 대한 나의 기여도는 몇 %인가요?', placeholder: '0~100 사이의 숫자를 적고 그 이유도 짧게 써보세요.' }]
        }
    },
    'C-2': {
        title: '불량 그림 수리 대작전',
        competency: 'AI와 창의적 활용',
        why: {
            lower: 'AI 화가가 엄청 그럴듯한 그림을 그렸지만, 자세히 뜯어보면 손가락이나 그림자 모양이 아주 어이없게 꼬여있기도 해요! 눈썰미가 필요해요.',
            middle: '이미지 생성 AI는 사물의 물리적 구조를 완전히 이해하지 못해 시각적 오류를 범하곤 합니다. 결과물을 검수하는 비판적 안목이 중요합니다.',
            upper: '컴퓨터 비전 모델의 한계로 인해 발생하는 "에지 케이스"와 물리적 불일치를 분석하며 AI 생성물의 품질을 평가하는 역량을 키웁니다.'
        },
        example: {
            lower: '나무 그늘 아래서 피크닉을 즐기는 행복한 가족... 앗! 그런데 저 손이랑 발은 누구 거죠? 😱',
            middle: '인물의 신체 구조나 배경의 원근감이 어색하게 뭉개진 AI 그림 찾아내기',
            upper: '프롬프트의 모호함이 시각적 할루시네이션으로 이어지는 인과 관계 분석'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 그림 수사관 알리야. 오늘은 엉터리 AI 그림을 찾아볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 화가는 그림을 아주 잘 그리지만, 가끔은 손가락이나 발가락 개수를 틀릴 때가 있어.', image: '/robot_2d_base.png' },
                { text: '세상을 직접 본 적이 없어서 사진들을 섞다가 실수를 하는 거래. 이걸 "불량 데이터"라고 불러.', image: '/robot_2d_base.png' },
                { text: '방금 평화로운 피크닉 그림이 하나 도착했는데, 어딘가 아주 징그럽고 이상한 부분이 있대!', image: '/robot_2d_base.png' },
                { text: '어디가 이상한지 직접 본다면 아마 깜짝 놀랄 거야! 탐정의 눈으로 샅샅이 찾아내 줄래?', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 그림 감별사 알리야. 오늘은 AI가 만든 비주얼 결함을 분석해 보자.', image: '/robot_2d_base.png' },
                { text: '생성형 AI는 픽셀의 확률을 계산할 뿐, 사물의 구조나 물리 법칙을 완전히 이해하지는 못해.', image: '/robot_2d_base.png' },
                { text: '그래서 물체가 녹아내리거나 원근감이 엉망인 "할루시네이션(환각)" 현상이 나타나곤 하지.', image: '/robot_2d_base.png' },
                { text: '이 피크닉 사진 속에 숨겨진 어처구니없는 실수를 찾아내고, 왜 이런 일이 생겼을지 추리해 볼까?', image: '/robot_2d_base.png' },
                { text: '자, 탐정의 눈으로 불량 그림을 수리할 단서를 찾아보자! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 비주얼 전문가 알리야. 오늘은 이미지 생성 AI의 기술적 한계를 파헤쳐 볼 거야.', image: '/robot_2d_base.png' },
                { text: 'AI 모델은 학습 데이터의 패턴을 모방하지만, 사물의 구조적 일관성을 유지하는 데 종종 실패해.', image: '/robot_2d_base.png' },
                { text: '이런 결함은 부적절한 프롬프트나 데이터셋의 편향 때문에 발생하기도 하지.', image: '/robot_2d_base.png' },
                { text: '이제 네가 직접 이 그림의 결함을 시각적으로 분석하고, 이를 수정할 수 있는 "정교한 주문(프롬프트)"을 다시 설계해 봐.', image: '/robot_2d_base.png' },
                { text: '완벽한 결과물을 만드는 훌륭한 창작자가 되어보자. 자, 분석을 시작해 볼까?', image: '/robot_2d_base.png' }
            ]
        },
        scenarioDescriptions: {
            lower: '🧺 칠칠치 못한 피크닉: AI 화가가 그린 그림이에요! 앗, 저기 나무 밑에 있는 가족의 손이랑 발이… 으악! 너무 징그러워요! 😱',
            middle: '🔍 비주얼 리포트: 생성형 AI가 만든 이미지에서 심각한 시각적 오류가 발견되었습니다. 기계 뇌의 입장에서 왜 이런 실수를 했을까요?',
            upper: '📐 시각 지능 분석: 이미지 생성 과정에서 발생하는 구조적 할루시네이션(Hallucination) 사례입니다. 기술적 취약점을 분석하고 수정 방향을 제시하세요.'
        },
        scenarioImages: {
            lower: '/c2_picnic_defect_v6_extreme.png',
            middle: '/c2_picnic_defect_v6_extreme.png',
            upper: '/c2_picnic_defect_v6_extreme.png'
        },
        referenceImage: '/c2_picnic_defect_v6_extreme.png',
        referenceImageCaption: '🔍 이 AI 그림을 돋보기 보듯 관찰해 봅시다! 어딘가 매우 이상합니다!',
        prompts: {
            lower: ['선생님이 보여주신 평화로운 피크닉 그림을 자세히 볼까요? 앗! 뭔가 꼬물꼬물 엄청 이상하고 징그러운 부분이 있어요! 눈에 보이는 대로 적어줄래요?'],
            middle: ['피크닉 그림을 매의 눈을 뜨고 살펴보니 소름 돋는 불량 실수가 발견됐어요! 왜 저렇게 똑똑한 AI 화가가 이런 터무니없는 실수를 저질렀을까요?'],
            upper: ['이 이미지 생성 결과물에 숨겨진 어색한 부분을 시각 분석한 뒤, AI 화가에게 결함 없는 완벽한 그림을 그리게 할 "정밀한 프롬프트"를 다시 짜주세요!']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'observe', type: 'textarea', label: '1. 돋보기 관찰: 어디가 이상하게 꼬여있나요?', placeholder: '사람의 손가락 개수나 발가락 모양, 혹은 물건의 모양을 아주 자세히 살펴보세요!' }],
            middle: [{ id: 'observe', type: 'textarea', label: '1. 어떤 어처구니없는 불량이 있나요?', placeholder: '그림의 앞과 뒤(원근감)가 무시되고 서로 섞이거나 인체의 구조가 엉망인 곳을 찾으세요.' }, { id: 'reason', type: 'textarea', label: '2. 탐정의 추리: 왜 AI는 이런 멍청한 실수를 할까?', placeholder: 'AI는 3차원 세상을 직접 본 적이 없고 이차원 그림으로만 외워서 그런 건 아닐까요?' }],
            upper: [{ id: 'observe', type: 'textarea', label: '1. 그림의 구조적 결함 분석', placeholder: '물체 사이의 경계가 희미하거나 공간 배치가 엉망인 부분을 콕 집어내 보세요.' }, { id: 'prompt', type: 'textarea', label: '2. 완벽한 수정을 위한 정밀 프롬프트', placeholder: '해부학적으로 정확한 인체 구조와 뚜렷한 원근감을 살리도록 명령어를 새로 만들어 보세요.' }]
        }
    },
    'C-3': {
        title: '오싹오싹 마법의 카피라이터',
        competency: 'AI와 창의적 활용',
        why: {
            lower: 'AI가 아무리 좋은 문장을 줘도, 결국 우리 반만의 느낌과 인간의 따뜻한 마음 한 스푼을 뿌려줘야 진짜 사람의 마음을 훔치는 명작이 된답니다.',
            middle: 'AI가 생성한 텍스트는 기초 재료일 뿐입니다. 타겟 사용자의 마음을 움직이는 감동적인 카피는 인간의 공감 능력이 필요합니다.',
            upper: 'AI와 창작물을 공유할 때는 저작권과 윤리적 가이드를 준수해야 합니다. 기술적 보조와 인간의 책임감을 조화시키는 법을 배웁니다.'
        },
        example: {
            lower: '심심한 가을 운동회 문구를 신나게 바꾸기',
            middle: 'AI의 기계적인 홍보 문구에 우리 반만의 웃음 포인트와 진심 더하기',
            upper: '창작 윤리 점검표(Attribution)를 작성하며 AI 협진 결과물의 소유권 인식'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 카피라이팅 요정 알리야. 오늘은 우리 반에 딱 맞는 예쁜 포스터를 만들어볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 친구는 아주 빠르고 똑똑하지만, 가끔은 너무 차갑고 기계 같은 말만 할 때가 있어.', image: '/robot_2d_base.png' },
                { text: '내가 너를 위해 멋진 포스터 배경을 준비했어. 여기에 네 상상을 더해볼래?', image: '/robot_2d_base.png' },
                { text: '네가 멋진 문구를 입력하면, 내가 마법처럼 포스터에 글자를 새겨줄게!', image: '/robot_2d_base.png' },
                { text: '자, 우리 반을 위한 세상에 하나뿐인 포스터, 같이 만들어보자!', image: '/robot_2d_base.png' }
            ],
            // ... middle, upper similar (I'll keep them consistent)
            middle: [
                { text: '반가워! 나는 아이디어 멘토 알리야. 오늘은 AI와 함께 개성 넘치는 포스터를 디자인해 보자.', image: '/robot_2d_base.png' },
                { text: 'AI는 기초적인 그림을 잘 그리지만, "너만의 특별한 개성"은 오직 너만이 넣을 수 있어.', image: '/robot_2d_base.png' },
                { text: '내가 깨끗한 액자를 준비했어. 네가 원하는 문구와 캐릭터를 설명해주면 AI가 그려줄 거야.', image: '/robot_2d_base.png' },
                { text: '사람들이 읽었을 때 "와!" 하고 감동받을 수 있도록 멋진 프롬프트를 짜줄래?', image: '/robot_2d_base.png' },
                { text: '자, 이제 너만의 창작 마법을 부릴 시간이야! 시작해 보자!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 창작 가이드 알리야. 오늘은 AI와 협업하여 학교 축제 홍보물을 완성해 보자.', image: '/robot_2d_base.png' },
                { text: 'AI 도구는 창작을 도와주지만, 그 결과물에는 반드시 "출처"와 "윤리적 검토"가 필요해.', image: '/robot_2d_base.png' },
                { text: '멋진 포스터를 만들기 위해 AI에게 정교한 명령(프롬프트)을 내리고, 창작 윤리도 함께 점검해 볼까?', image: '/robot_2d_base.png' },
                { text: '네가 다듬은 문구와 AI가 생성한 이미지가 학교 복도에서 가장 빛나는 작품이 될 거야.', image: '/robot_2d_base.png' },
                { text: '정직하고 멋진 창작자가 되는 길, 우리 같이 시작해 보자!', image: '/robot_2d_base.png' }
            ]
        },
        type: { lower: 'direct-text', middle: 'frame', upper: 'frame' },
        prompt: {
            lower: 'AI가 우리 반 학예회를 위해 "아름다운 하모니, 우리 반 파이팅!" 문구를 추천했어요. 이 중 마음에 드는 단어를 골라 볼까요?',
            middle: '배경은 액자 느낌으로 하고 안에는 흰색으로 만든 다음, 학생들이 프롬프트를 입력하면 포스터가 액자 안에 만들어집니다.',
            upper: 'AI와 함께 포스터를 만들 때 생각할 점을 3가지로 정리하고, 정교한 프롬프트로 포스터를 완성하세요.'
        },
        prompts: {
            lower: ['AI 로봇 아저씨가 추천해준 "아름다운 하모니, 우리 반 파이팅!" 중에서 네 마음에 쏙 드는 단어를 골라 써 볼까요?'],
            middle: ['AI 화가에게 너만의 포스터 문구와 분위기를 설명해 주세요! 마법의 버튼을 누르면 액자 속에 포스터가 쨘! 하고 나타날 거예요.'],
            upper: ['AI와 협업하여 명작 포스터를 완성해 보세요! 그 전에, AI와 함께 창작할 때 우리가 꼭 생각해야 할 "윤리적 포인트" 3가지를 먼저 정리해 볼까요?']
        },
        stackedInputs: {
            lower: [{ id: 'favorite_word', type: 'text', label: '1. 내 마음에 쏙 드는 반짝이는 단어는?', placeholder: '가장 예쁘게 느껴지는 단어를 골라보세요.' }],
            middle: [{ id: 'creative_edit', type: 'textarea', label: '1. 내 손맛을 거친 개성 만점 포스터 문구!', placeholder: '우리 반 친구들만의 웃긴 유행어나 엄청난 수식어를 결합해 보세요.' }],
            upper: [
                { id: 'creative_edit', type: 'textarea', label: '1. 내가 다듬어 완성한 최종 홍보 문구', placeholder: '기초 AI 텍스트를 감성적이고 세련된 표현으로 업그레이드하여 적어보세요.' },
                { id: 'ethics_points', type: 'multi-text', label: '2. AI와 함께 포스터를 만들 때 생각할 점 (3가지)', placeholder: '저작권, 정직함, 친구 배려 등 꼭 필요한 3가지를 적어보세요.' }
            ]
        },
        posterBg: '/c3_poster_pure_bg_1775226077744.png'
    }
};

// Replace mission blocks
for (const key of Object.keys(UPDATES)) {
    const startMarker = `    '${key}': {`;
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.error(`Marker not found for ${key}`);
        continue;
    }

    // Find the end of the object (matching brace)
    let openBraces = 0;
    let endIndex = -1;
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') openBraces++;
        if (content[i] === '}') openBraces--;
        if (openBraces === 0) {
            endIndex = i + 1;
            // Check for trailing comma
            if (content[endIndex] === ',') endIndex++;
            break;
        }
    }

    if (endIndex === -1) {
        console.error(`Closing brace not found for ${key}`);
        continue;
    }

    const newObjectStr = `    '${key}': ${JSON.stringify(UPDATES[key], (k, v) => (typeof v === 'function' ? v.toString() : v), 8).replace(/"(persona)":\s*"([^"]+)"/, '"$1": $2')},`;
    
    // Note: JSON.stringify mangles the persona function string. I'll handle it specially or just use backticks.
    // Actually, manual assembly is safer for functions.
}

// Rewriting using a template approach because persona functions are tricky with JSON.stringify
const c1_data = `    'C-1': {
        title: '판타지 릴레이 동화 쓰기!',
        competency: 'AI와 창의적 활용',
        why: {
            lower: 'AI 작가와 번갈아 가며 한 줄씩 릴레이 소설을 쓰다 보면 나 혼자서는 절대 상상 못 했던 미친 듯이 재밌는 이야기가 탄생한답니다.',
            middle: '생성형 AI는 창작의 고통을 덜어주는 훌륭한 브레인스토밍 파트너입니다. AI가 던진 아이디어에 나의 감성을 더해 보세요.',
            upper: 'AI와의 협업 창작은 인간의 창의성을 확장하는 새로운 예술 형태입니다. 기술을 도구로 활용해 나만의 독창적인 서사를 구축해 보세요.'
        },
        example: {
            lower: '초콜릿 폭포 옆 무지개 토끼 이야기 한 줄 멋지게 지어내기',
            middle: '평범한 일상에 판타지 요소를 AI와 함께 섞어 기발한 반전 만들기',
            upper: 'AI가 생성한 초안을 바탕으로 문체와 인물의 심성 묘사를 정교하게 다듬어 최종 릴레이 명작 완성하기'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 창의력 대장 알리야. 오늘은 AI 작가랑 같이 마법 동화를 한 줄씩 써볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 작가는 우리 머릿속 상상을 아주 멋진 글자로 쨘! 하고 나타나게 도와준대.', image: '/robot_2d_base.png' },
                { text: '하지만 진짜 이야기의 주인공은 너야! 네 상상력이 더해져야 진짜 살아 움직이는 동화가 되거든.', image: '/robot_2d_base.png' },
                { text: '지금 AI 작가가 첫 문장을 보냈어. 그 다음 이야기를 네가 멋지게 완성해 줄래?', image: '/robot_2d_base.png' },
                { text: '자, 우리 반에서 가장 재미난 동담작가가 되어보자! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 문학 소년 알리야. 오늘은 AI와 협업해서 판타지 소설을 집필해 보자.', image: '/robot_2d_base.png' },
                { text: '생성형 AI는 창의적인 아이디어를 제안하는 데 아주 훌륭한 파트너가 될 수 있어.', image: '/robot_2d_base.png' },
                { text: '하지만 진짜 재미있는 반전과 감동은 바로 "사람의 손길"에서 탄생한다는 걸 기억해!', image: '/robot_2d_base.png' },
                { text: 'AI가 던진 문장에 네가 마라맛 반전을 더한다면 세상에 없던 명작이 탄생할 거야.', image: '/robot_2d_base.png' },
                { text: '자, 이제 너의 기발한 상상력을 릴레이 문장에 녹여내 볼까? 시작해 보자!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 창작 가이드 알리야. 오늘은 AI와 창의적 협업을 통해 판타지 대작을 완성해 보자.', image: '/robot_2d_base.png' },
                { text: 'AI는 방대한 데이터를 바탕으로 문장을 생성하지만, 고유한 문체와 영혼은 작가인 네가 불어넣어야 해.', image: '/robot_2d_base.png' },
                { text: '서로 주고받는 문장 속에서 이야기가 어디로 튈지 모르는 릴레이 소설의 묘미를 느껴봐.', image: '/robot_2d_base.png' },
                { text: '소설을 완성한 후에는 이 작품에 얼마나 "나의 노력"이 들어갔는지 비중을 평가해보는 것도 중요해.', image: '/robot_2d_base.png' },
                { text: '자, 이제 AI와 함께 상상력의 한계에 도전해 볼까? 릴레이 소설 쓰기를 시작하자!', image: '/robot_2d_base.png' }
            ]
        },
        scenarioDescriptions: {
            lower: '🌟 동화 속으로: AI 작가가 "옛날 옛적에 초콜릿 폭포 옆에..."라며 멋진 이야기를 시작했어요! 뒷이야기가 벌써 궁금하죠? 😉',
            middle: '📚 릴레이 아이디어: 생성형 AI가 흥미로운 세계관을 제시했습니다. 이제 당신의 "휴먼 필터"를 거쳐 이야기를 완성하세요!',
            upper: '✍️ 창의적 협업: 기술(AI)의 논리와 인간(나)의 영감이 만나 하나의 서사를 구축합니다. 창작의 주도권을 잃지 말고 명작을 설계하세요.'
        },
        scenarioImages: {
            lower: '/robot_2d_base.png',
            middle: '/robot_2d_base.png',
            upper: '/robot_2d_base.png'
        },
        prompts: {
            lower: ['오앗! AI 작가가 재밌는 동화의 앞부분을 시작했어요. 뒷이야기가 너무너무 궁금해요. 내 상상력을 풀가동해서 딱 한 문장만 신나게 이어 써 볼까요?'],
            middle: ['AI 작가의 시작은 훌륭하지만 스릴이 조금 부족하네요! 내 상상력을 듬뿍 담은 마라맛 반전을 넣어 그 다음 문장을 기발하게 이어서 써볼까요?'],
            upper: ['AI와 교대로 역할을 나누어 엎치락뒤치락하는 판타지 소설을 완성해 보세요. 완전히 끝난 후, 이 명작 스토리를 설계한 "나의 기여도(%)"를 당당하게 주장해 보세요!']
        },
        type: 'chat',
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'ai' },
        aiPromptText: '옛날 옛적, 만지면 젤리로 변하는 마법의 파란 분수대 곁에 투명 망토를 두른 다람쥐가 쨘! 나타났어요. 다람쥐가 망토를 휙 벗자...',
        persona: (userName) => {
            const name = userName || '학생';
            return \`당신은 호들갑스럽고 재치 넘치는 'AI 창의력 작가'입니다. \${name}님이 기발한 문장을 던지면 "오마이갓!! 대박이에요, \${name}님!" 이라며 과장되게 호응하고, 더 흥미진진하고 어이없는 상황을 꼬리물기로 붙여서 \${name}님의 다음 답변을 이끌어내세요. 5턴 이내로 훈훈하게 끝냅시다.\`;
        },
        stackedInputs: {
            upper: [{ id: 'contribution', type: 'text', label: '1. 이 멋진 이야기에 대한 나의 기여도는 몇 %인가요?', placeholder: '0~100 사이의 숫자를 적고 그 이유도 짧게 써보세요.' }]
        }
    },`;

const c2_data = `    'C-2': {
        title: '불량 그림 수리 대작전',
        competency: 'AI와 창의적 활용',
        why: {
            lower: 'AI 화가가 엄청 그럴듯한 그림을 그렸지만, 자세히 뜯어보면 손가락이나 그림자 모양이 아주 어이없게 꼬여있기도 해요! 눈썰미가 필요해요.',
            middle: '이미지 생성 AI는 사물의 물리적 구조를 완전히 이해하지 못해 시각적 오류를 범하곤 합니다. 결과물을 검수하는 비판적 안목이 중요합니다.',
            upper: '컴퓨터 비전 모델의 한계로 인해 발생하는 "에지 케이스"와 물리적 불일치를 분석하며 AI 생성물의 품질을 평가하는 역량을 키웁니다.'
        },
        example: {
            lower: '나무 그늘 아래서 피크닉을 즐기는 행복한 가족... 앗! 그런데 저 손이랑 발은 누구 거죠? 😱',
            middle: '인물의 신체 구조나 배경의 원근감이 어색하게 뭉개진 AI 그림 찾아내기',
            upper: '프롬프트의 모호함이 시각적 할루시네이션으로 이어지는 인과 관계 분석'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 그림 수사관 알리야. 오늘은 엉터리 AI 그림을 찾아볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 화가는 그림을 아주 잘 그리지만, 가끔은 손가락이나 발가락 개수를 틀릴 때가 있어.', image: '/robot_2d_base.png' },
                { text: '세상을 직접 본 적이 없어서 사진들을 섞다가 실수를 하는 거래. 이걸 "불량 데이터"라고 불러.', image: '/robot_2d_base.png' },
                { text: '방금 평화로운 피크닉 그림이 하나 도착했는데, 어딘가 아주 징그럽고 이상한 부분이 있대!', image: '/robot_2d_base.png' },
                { text: '어디가 이상한지 직접 본다면 아마 깜짝 놀랄 거야! 탐정의 눈으로 샅샅이 찾아내 줄래?', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 그림 감별사 알리야. 오늘은 AI가 만든 비주얼 결함을 분석해 보자.', image: '/robot_2d_base.png' },
                { text: '생성형 AI는 픽셀의 확률을 계산할 뿐, 사물의 구조나 물리 법칙을 완전히 이해하지는 못해.', image: '/robot_2d_base.png' },
                { text: '그래서 물체가 녹아내리거나 원근감이 엉망인 "할루시네이션(환각)" 현상이 나타나곤 하지.', image: '/robot_2d_base.png' },
                { text: '이 피크닉 사진 속에 숨겨진 어처구니없는 실수를 찾아내고, 왜 이런 일이 생겼을지 추리해 볼까?', image: '/robot_2d_base.png' },
                { text: '자, 탐정의 눈으로 불량 그림을 수리할 단서를 찾아보자! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 비주얼 전문가 알리야. 오늘은 이미지 생성 AI의 기술적 한계를 파헤쳐 볼 거야.', image: '/robot_2d_base.png' },
                { text: 'AI 모델은 학습 데이터의 패턴을 모방하지만, 사물의 구조적 일관성을 유지하는 데 종종 실패해.', image: '/robot_2d_base.png' },
                { text: '이런 결함은 부적절한 프롬프트나 데이터셋의 편향 때문에 발생하기도 하지.', image: '/robot_2d_base.png' },
                { text: '이제 네가 직접 이 그림의 결함을 시각적으로 분석하고, 이를 수정할 수 있는 "정교한 주문(프롬프트)"을 다시 설계해 봐.', image: '/robot_2d_base.png' },
                { text: '완벽한 결과물을 만드는 훌륭한 창작자가 되어보자. 자, 분석을 시작해 볼까?', image: '/robot_2d_base.png' }
            ]
        },
        scenarioDescriptions: {
            lower: '🧺 칠칠치 못한 피크닉: AI 화가가 그린 그림이에요! 앗, 저기 나무 밑에 있는 가족의 손이랑 발이… 으악! 너무 징그러워요! 😱',
            middle: '🔍 비주얼 리포트: 생성형 AI가 만든 이미지에서 심각한 시각적 오류가 발견되었습니다. 기계 뇌의 입장에서 왜 이런 실수를 했을까요?',
            upper: '📐 시각 지능 분석: 이미지 생성 과정에서 발생하는 구조적 할루시네이션(Hallucination) 사례입니다. 기술적 취약점을 분석하고 수정 방향을 제시하세요.'
        },
        scenarioImages: {
            lower: '/c2_picnic_defect_v6_extreme.png',
            middle: '/c2_picnic_defect_v6_extreme.png',
            upper: '/c2_picnic_defect_v6_extreme.png'
        },
        referenceImage: '/c2_picnic_defect_v6_extreme.png',
        referenceImageCaption: '🔍 이 AI 그림을 돋보기 보듯 관찰해 봅시다! 어딘가 매우 이상합니다!',
        prompts: {
            lower: ['선생님이 보여주신 평화로운 피크닉 그림을 자세히 볼까요? 앗! 뭔가 꼬물꼬물 엄청 이상하고 징그러운 부분이 있어요! 눈에 보이는 대로 적어줄래요?'],
            middle: ['피크닉 그림을 매의 눈을 뜨고 살펴보니 소름 돋는 불량 실수가 발견됐어요! 왜 저렇게 똑똑한 AI 화가가 이런 터무니없는 실수를 저질렀을까요?'],
            upper: ['이 이미지 생성 결과물에 숨겨진 어색한 부분을 시각 분석한 뒤, AI 화가에게 결함 없는 완벽한 그림을 그리게 할 "정밀한 프롬프트"를 다시 짜주세요!']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'observe', type: 'textarea', label: '1. 돋보기 관찰: 어디가 이상하게 꼬여있나요?', placeholder: '사람의 손가락 개수나 발가락 모양, 혹은 물건의 모양을 아주 자세히 살펴보세요!' }],
            middle: [{ id: 'observe', type: 'textarea', label: '1. 어떤 어처구니없는 불량이 있나요?', placeholder: '그림의 앞과 뒤(원근감)가 무시되고 서로 섞이거나 인체의 구조가 엉망인 곳을 찾으세요.' }, { id: 'reason', type: 'textarea', label: '2. 탐정의 추리: 왜 AI은 이런 멍청한 실수를 할까?', placeholder: 'AI는 3차원 세상을 직접 본 적이 없고 이차원 그림으로만 외워서 그런 건 아닐까요?' }],
            upper: [{ id: 'observe', type: 'textarea', label: '1. 그림의 구조적 결함 분석', placeholder: '물체 사이의 경계가 희미하거나 공간 배치가 엉망인 부분을 콕 집어내 보세요.' }, { id: 'prompt', type: 'textarea', label: '2. 완벽한 수정을 위한 정밀 프롬프트', placeholder: '해부학적으로 정확한 인체 구조와 뚜렷한 원근감을 살리도록 명령어를 새로 만들어 보세요.' }]
        }
    },`;

const c3_data = `    'C-3': {
        title: '오싹오싹 마법의 카피라이터',
        competency: 'AI와 창의적 활용',
        why: {
            lower: 'AI가 아무리 좋은 문장을 줘도, 결국 우리 반만의 느낌과 인간의 따뜻한 마음 한 스푼을 뿌려줘야 진짜 사람의 마음을 훔치는 명작이 된답니다.',
            middle: 'AI가 생성한 텍스트는 기초 재료일 뿐입니다. 타겟 사용자의 마음을 움직이는 감동적인 카피는 인간의 공감 능력이 필요합니다.',
            upper: 'AI와 창작물을 공유할 때는 저작권과 윤리적 가이드를 준수해야 합니다. 기술적 보조와 인간의 책임감을 조화시키는 법을 배웁니다.'
        },
        example: {
            lower: '심심한 가을 운동회 문구를 신나게 바꾸기',
            middle: 'AI의 기계적인 홍보 문구에 우리 반만의 웃음 포인트와 진심 더하기',
            upper: '창작 윤리 점검표(Attribution)를 작성하며 AI 협업 결과물의 소유권 인식'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 카피라이팅 요정 알리야. 오늘은 우리 반에 딱 맞는 예쁜 포스터를 만들어볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 친구는 아주 빠르고 똑똑하지만, 가끔은 너무 차갑고 기계 같은 말만 할 때가 있어.', image: '/robot_2d_base.png' },
                { text: '내가 너를 위해 멋진 포스터 배경을 준비했어. 여기에 네 상상을 더해볼래?', image: '/robot_2d_base.png' },
                { text: '네가 멋진 문구를 입력하면, 내가 마법처럼 포스터에 글자를 새겨줄게!', image: '/robot_2d_base.png' },
                { text: '자, 우리 반을 위한 세상에 하나뿐인 포스터, 같이 만들어보자!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 아이디어 멘토 알리야. 오늘은 AI와 함께 개성 넘치는 포스터를 디자인해 보자.', image: '/robot_2d_base.png' },
                { text: 'AI는 기초적인 그림을 잘 그리지만, "너만의 특별한 개성"은 오직 너만이 넣을 수 있어.', image: '/robot_2d_base.png' },
                { text: '내가 깨끗한 액자를 준비했어. 네가 원하는 문구와 캐릭터를 설명해주면 AI가 그려줄 거야.', image: '/robot_2d_base.png' },
                { text: '사람들이 읽었을 때 "와!" 하고 감동받을 수 있도록 멋진 프롬프트를 짜줄래?', image: '/robot_2d_base.png' },
                { text: '자, 이제 너만의 창작 마법을 부릴 시간이야! 시작해 보자!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 창작 가이드 알리야. 오늘은 AI와 협업하여 학교 축제 홍보물을 완성해 보자.', image: '/robot_2d_base.png' },
                { text: 'AI 도구는 창작을 도와주지만, 그 결과물에는 반드시 "출처"와 "윤리적 검토"가 필요해.', image: '/robot_2d_base.png' },
                { text: '멋진 포스터를 만들기 위해 AI에게 정교한 명령(프롬프트)을 내리고, 창작 윤리도 함께 점검해 볼까?', image: '/robot_2d_base.png' },
                { text: '네가 다듬은 문구와 AI가 생성한 이미지가 학교 복도에서 가장 빛나는 작품이 될 거야.', image: '/robot_2d_base.png' },
                { text: '정직하고 멋진 창작자가 되는 길, 우리 같이 시작해 보자!', image: '/robot_2d_base.png' }
            ]
        },
        type: { lower: 'direct-text', middle: 'frame', upper: 'frame' },
        prompts: {
            lower: ['AI 로봇 아저씨가 추천해준 "아름다운 하모니, 우리 반 파이팅!" 중에서 네 마음에 쏙 드는 단어를 골라 써 볼까요?'],
            middle: ['AI 화가에게 너만의 포스터 문구와 분위기를 설명해 주세요! 마법의 버튼을 누르면 액자 속에 포스터가 쨘! 하고 나타날 거예요.'],
            upper: ['AI와 협업하여 명작 포스터를 완성해 보세요! 그 전에, AI와 함께 창작할 때 우리가 꼭 생각해야 할 "윤리적 포인트" 3가지를 먼저 정리해 볼까요?']
        },
        stackedInputs: {
            lower: [{ id: 'favorite_word', type: 'text', label: '1. 내 마음에 쏙 드는 반짝이는 단어는?', placeholder: '가장 예쁘게 느껴지는 단어를 골라보세요.' }],
            middle: [{ id: 'creative_edit', type: 'textarea', label: '1. 내 손맛을 거친 개성 만점 포스터 문구!', placeholder: '우리 반 친구들만의 웃긴 유행어나 엄청난 수식어를 결합해 보세요.' }],
            upper: [
                { id: 'creative_edit', type: 'textarea', label: '1. 내가 다듬어 완성한 최종 홍보 문구', placeholder: '기초 AI 텍스트를 감성적이고 세련된 표현으로 업그레이드하여 적어보세요.' },
                { id: 'ethics_points', type: 'multi-text', label: '2. AI와 함께 포스터를 만들 때 생각할 점 (3가지)', placeholder: '저작권, 정직함, 친구 배려 등 꼭 필요한 3가지를 적어보세요.' }
            ]
        },
        posterBg: '/c3_poster_pure_bg_1775226077744.png'
    },`;

// Surgical replacement using regex-like markers
function updateMission(key, newData) {
    const startMarker = `    '${key}': {`;
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return;

    let openBraces = 0;
    let endIndex = -1;
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') openBraces++;
        if (content[i] === '}') openBraces--;
        if (openBraces === 0) {
            endIndex = i + 1;
            if (content[endIndex] === ',') endIndex++;
            break;
        }
    }

    if (endIndex !== -1) {
        content = content.substring(0, startIndex) + newData + content.substring(endIndex);
    }
}

updateMission('C-1', c1_data);
updateMission('C-2', c2_data);
updateMission('C-3', c3_data);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated Mission.jsx for C-1, C-2, and C-3!');
