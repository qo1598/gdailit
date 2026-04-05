export const C2_MISSION = {
    title: '인공지능의 팩트리 피크닉',
    competency: 'AI와 창의적 협업',
    why: {
        lower: 'AI가 우리 생각보다 실수를 많이 한다는 걸 알아보아요!',
        middle: 'AI의 생성 원리와 패턴 학습의 한계를 이해하면 더 똑똑하게 사용할 수 있어요.',
        upper: 'AI의 시각적 한계와 맥락 이해 부족을 비판적으로 분석하여 고도화된 프롬프트를 설계합니다.'
    },
    example: {
        lower: '손가락이나 물건이 이상하게 그려진 피크닉 사진 찾기',
        middle: '로봇과 바구니가 서로 겹쳐 보이는 인공지능의 시각 오류 분석',
        upper: '완벽한 소풍 이미지를 생성하기 위해 결함을 역설계(Reverse Engineering)하여 프롬프트 수정'
    },
    referenceImage: '/c2_picnic_defect_v5.png',
    referenceImageCaption: '앗! 이 소풍 그림을 돋보기 보듯 관찰해 봅시다. 어딘가 매우 이상합니다.',
    storySteps: {
        lower: [
            { text: '안녕하세요! 저는 그림 탐정 선생님, 알리예요. 친구들과 로봇이 공원에서 맛있는 도시락을 먹고 있어요!', image: '/robot_2d_base.png' },
            { text: '그런데 AI 화가가 그린 이 피크닉 그림에는 아주 이상한 실수들이 숨어있대요.', image: '/c2_picnic_defect_v5.png' },
            { text: '어떤 친구의 손가락이 이상하거나, 물건들이 이상하게 겹쳐져 있을지도 몰라요!', image: '/robot_2d_base.png' },
            { text: '돋보기를 들고 명탐정처럼 AI가 실수한 부분을 모두 찾아줄래요?', image: '/c2_picnic_defect_v5.png' },
            { text: '준비 완료? 그럼 그림 속 이상한 점 찾기 제1막 출발!', image: '/robot_2d_base.png' }
        ],
        middle: [
            { text: '반가워요! 저는 그림 탐정 선생님, 알리예요. 겉보기엔 평화로운 피크닉 같죠?', image: '/robot_2d_base.png' },
            { text: '사실 이건 AI가 그린 그림인데, 패턴을 잘못 이해해서 엉뚱한 결함을 만들었어요.', image: '/c2_picnic_defect_v5.png' },
            { text: '로봇 다리가 이상하거나, 배경이 뒤틀린 부분이 보이지 않나요?', image: '/robot_2d_base.png' },
            { text: '왜 AI가 이런 실수를 했는지, 여러분이 탐정이 되어 낱낱이 분석해 주세요!', image: '/c2_picnic_defect_v5.png' },
            { text: '자, 매의 눈으로 인공지능의 시각 오류를 찾아내 보아요. 미션 시작!', image: '/robot_2d_base.png' }
        ],
        upper: [
            { text: '환영합니다! 저는 AI 이미지 전문가 선생님, 알리예요. 생성형 AI가 만든 이미지의 치명적 결함을 파헤쳐 볼까요?', image: '/robot_2d_base.png' },
            { text: 'AI는 픽셀의 패턴만 계산할 뿐, 공간 지각 능력이나 상식적인 맥락을 전혀 이해하지 못해요.', image: '/c2_picnic_defect_v5.png' },
            { text: '그래서 손가락 개수가 틀리거나, 물리 법칙에 어긋나는 구조적 오류가 발생하는 거랍니다.', image: '/robot_2d_base.png' },
            { text: '이제 그림 속 결함들을 분석하고, 이를 수정하기 위해 프롬프트를 어떻게 개선해야 할지 역설계해 보아요.', image: '/c2_picnic_defect_v5.png' },
            { text: '여러분의 날카로운 분석과 정교한 솔루션을 기대할게요. 미션 시작!', image: '/robot_2d_base.png' }
        ]
    },
    prompts: {
        lower: ['그림 속에 숨겨진 AI의 실수(손가락, 겹친 물건 등)를 매의 눈으로 찾아서 알려주세요.'],
        middle: ['그림 속 이상한 점을 3가지 이상 찾고, 왜 AI가 이런 실수를 했는지 상상력을 발휘해 추리해 보세요.'],
        upper: ['AI가 이미지를 생성할 때 발생하는 구조적 결함을 지적하고, 이를 완벽하게 수정하기 위한 정교한 프롬프트 개선안을 제안해 보세요.']
    },
    type: 'direct-text',
    stackedInputs: {
        lower: [
            { id: 'defect1', type: 'text', label: '1. 첫 번째로 발견한 이상한 점은 무엇인가요?', placeholder: '예) 로봇 팔이 이상해요' },
            { id: 'defect2', type: 'text', label: '2. 두 번째로 발견한 이상한 점은 무엇인가요?', placeholder: '예) 샌드위치가 공중에 떠 있어요' }
        ],
        middle: [
            { id: 'defects', type: 'textarea', label: '1. 여러분이 발견한 이상한 점들을 모두 적어볼까요?', placeholder: '자세히 관찰해서 보이는 모든 오류를 적어주세요.' },
            { id: 'reason', type: 'textarea', label: '2. 똑똑한 AI 화가는 왜 이런 실수를 했을까요?', placeholder: 'AI가 사람처럼 진짜 세상을 본 적이 없어서 그렇다는 점을 떠올려 보세요.' }
        ],
        upper: [
            { id: 'defects', type: 'textarea', label: '1. 이미지에서 구조적인 결함을 찾아 분석해 볼까요?', placeholder: '물리적, 구조적, 맥락적 오류를 구체적으로 지적하세요.' },
            { id: 'solution', type: 'textarea', label: '2. 완벽한 이미지를 위해 프롬프트를 역설계하고 개선 방안을 제안해 줄래요?', placeholder: '이러한 오류를 방지하려면 AI에게 어떻게 구체적으로 명령해야 할지 프롬프트를 다시 작성해 보세요.' }
        ]
    }
};