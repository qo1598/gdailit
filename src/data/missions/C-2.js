export const C2_MISSION = {
    title: 'AI 그림, 어디가 이상할까?',
    competency: 'AI 출력물 비판적 평가 및 교정',
    ksa_tags: { K: "K4.1", S: "Creativity", A: "Adaptable" },
    type: {
        lower: 'performance-highlight',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: 'AI가 소풍 그림을 그렸는데, 자세히 보니 아주 이상한 점이 있어요!' },
            { text: '기계는 진짜 세상의 물리 법칙을 가끔 잊어버리거든요. (예: 손가락이 6개!)' },
            { text: '그림 속에서 AI가 실수한 부분(오류)을 마법의 펜으로 콕콕 집어주세요.' }
        ],
        middle: [
            { text: '이미지 AI는 "팩토리"처럼 그림을 찍어내지만, 논리적인 실수를 할 때가 많습니다.' },
            { text: '그림에서 발견한 오류의 개수와, AI가 왜 이런 실수를 했을지 기술적으로 추측해 볼까요?' },
            { text: 'AI가 실제 사물이 입체적이라는 사실을 몰라서 생기는 평면적인 오류를 찾아보세요.' }
        ],
        upper: [
            { text: 'AI의 환각 현상은 이미지 생성 단계에서도 시각적 모순으로 나타납니다.' },
            { text: '오류가 있는 이미지를 분석하고, 이 이미지를 생성하기 위해 사용된 "잘못된 프롬프트"를 역설계해 보세요.' },
            { text: '더 완벽한 이미지를 얻기 위해 프롬프트를 어떻게 수정해야 할지 제안해 봅시다.' }
        ]
    },
    education: {
        lower: {
            why: 'AI가 만드는 것이 항상 완벽하지 않다는 것을 관찰하기 위해서예요.',
            example: '공중에 떠 있는 컵이나, 거꾸로 된 신발을 찾아보세요!'
        },
        middle: {
            why: 'AI의 시각 지능이 데이터를 픽셀 단위로만 이해할 때 생기는 오류 원인을 탐구합니다.',
            example: 'AI는 사과의 "맛"이나 "무게"를 모르기 때문에 사과가 바닥을 뚫고 지나가게 그릴 수도 있어요.'
        },
        upper: {
            why: '생성형 모델의 한계를 극복하기 위한 정교한 프롬프트 엔지니어링 역량을 기릅니다.',
            example: '"손가락을 뒤로 숨긴 채 손을 흔드는" 구체적인 명령어로 오류를 피할 수 있습니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'defects', type: 'performance-highlight', label: '오류 부위 찾기', content: '이 그림의 손가락 개수와 컵의 그림자가 이상해요!' }
        ],
        middle: [
            { id: 'defects', type: 'text', label: '발견한 오류들', placeholder: '어떤 것이 이상한가요?' },
            { id: 'reason', type: 'textarea', label: '실수 원인 추측', placeholder: 'AI가 무엇을 헷갈린 것 같나요?' }
        ],
        upper: [
            { id: 'defects', type: 'text', label: '시각적 모순 분석', placeholder: '이미지의 논리적 오류를 기술하세요' },
            { id: 'solution', type: 'textarea', label: '프롬프트 수정 제안', placeholder: '이 오류를 고치기 위해 어떤 명령어를 추가해야 할까요?' }
        ]
    }
};
