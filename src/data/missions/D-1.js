export const D1_MISSION = {
    title: '끼리끼리 유유상종! 우리끼리 묶기 분류 놀이!',
    competency: 'AI 원리 체험',
    why: {
        lower:
            'AI는 물건을 "특징"을 보고 나누는 걸 잘해요. 우리도 눈으로 특징을 골라 보면 분류가 어떻게 돌아가는지 감이 와요!',
        middle:
            '같은 과일도 기준을 바꾸면 완전히 다른 모둠이 돼요. 내가 정한 기준은 AI가 데이터를 나눌 때와 똑같이 중요해요.',
        upper:
            '축제나 학교 행사를 기획할 때는 어떤 프로그램을 살릴지(통과), 잠시 미룰지(보류) 정해야 해요. 이때 쓰는 기준이 한 번 정해지면 그대로 반복되기 쉬운데, 그러면 어떤 활동이나 친구들의 취향은 계속 뒤로 밀릴 수 있어요. 그래서 “왜 이렇게 나눴는지”를 생각해 보는 일이 중요해요.'
    },
    example: {
        lower: '빨간색만 모으기, 동그란 것만 모으기처럼 한 가지 특징에 집중해 볼까요?',
        middle: '씨가 있는지, 부드러운지, 향이 강한지… 겉모습 말고 다른 감각으로 나눠 보기!',
        upper:
            '예를 들어 행사 담당자가 활동 10가지를 나눌 때 “움직이는 체험만 통과”, “조용한 부스는 전부 보류”처럼 아주 단순한 기준만 쓴다고 해 봐요. 그 기준이 매번 그대로면 축제 안내에는 어떤 친구나 활동이 계속 빠질 수 있을까요? 편견이나 불공평은 없을까요?'
    },
    storySteps: {
        lower: [
            {
                text: '안녕! 나는 분류 도우미 알리야. 오늘은 과일을 색깔 바구니에 나눠 볼 거야!',
                image: '/robot_2d_base.png'
            },
            {
                text: '책상 위에 과일이 잔뜩 섞여 있어. "빨간색"만 골라 보면 어떤 친구들이 모일까?',
                image: '/robot_2d_base.png'
            },
            {
                text: 'AI도 이렇게 "어떤 특징을 볼지" 정한 다음에 데이터를 나눠요.',
                image: '/robot_2d_base.png'
            },
            {
                text: '자, 과일을 끌어서 빨간 바구니에 담아 보자. 바구니가 곧 네 답이야!',
                image: '/robot_2d_base.png'
            }
        ],
        middle: [
            {
                text: '반가워! 나는 패턴 탐정 알리야. 평소에 과일 먹는 걸 좋아하니? 세상에는 정말 다양한 과일이 있단다.',
                image: '/robot_2d_base.png'
            },
            {
                text: '촉감, 냄새, 씨 유무… 아무도 안 쓰는 기준으로 나누면 과일들이 신기하게 뒤섞여!',
                image: '/robot_2d_base.png'
            },
            {
                text: '과일을 A 그룹, B 그룹으로 나누고, 너만의 기준을 만들어 봐.',
                image: '/robot_2d_base.png'
            },
            {
                text: '너만의 기준을 만들어 과일을 분류하는 것 처럼, AI도 이렇게 학습 데이터에 라벨을 붙인단다.',
                image: '/robot_2d_base.png'
            }
        ],
        upper: [
            {
                text: '안녕! 나는 규칙 디자이너 알리야. 우리 주변에는 다양한 축제와 행사가 있는거 아니?',
                image: '/robot_2d_base.png'
            },
            {
                text: '축제나 행사를 기획할 때는 어떤 프로그램을 운영할지 설계하는게 중요해.',
                image: '/robot_2d_base.png'
            },
            {
                text: '오늘은 너가 행사 담당자가 되어, 10가지의 활동을 보고 통과시킬지 보류시킬지 나눠 보고, 그다음 어떤 기준으로 나누었는지 적어보자.',
                image: '/robot_2d_base.png'
            },
            {
                text: '그리고 만약 이 기준으로 행사를 운영하면 어떤 문제가 생길 수 있을지 한번 고민해서 적어보자.',
                image: '/robot_2d_base.png'
            }
        ]
    },
    scenarioDescriptions: {
        lower: '',
        middle: '',
        upper: ''
    },
    scenarioImages: {
        lower: null,
        middle: null,
        upper: null
    },
    type: 'direct-text',
    prompts: {
        lower: [
            '빨간색 계열 과일만 빨간 바구니에 담아 봅시다. 손가락으로 과일을 길게 눌러, 빨간 바구니로 끌어다 놓아 보세요.'
        ],
        middle: [
            '과일 데이터를 나만의 기준으로 A 그룹과, B그룹에 나눠 보세요. 손가락으로 과일을 길게 눌러 끌어다 놓으면 돼요. 10개 모두 A 또는 B에 넣은 뒤, 아래에 어떤 기준으로 나누었는지 적어 주세요.'
        ],
        upper: []
    },
    stackedInputs: {
        lower: [
            {
                id: 'color_sort',
                type: 'd1-lower-basket-dnd',
                omitLabel: true,
                label: '',
                placeholder: ''
            }
        ],
        middle: [
            {
                id: 'd1_group_assignments',
                type: 'd1-middle-drag',
                omitLabel: true,
                label: '',
                placeholder: ''
            },
            {
                id: 'classification_rule',
                type: 'textarea',
                label: '어떤 기준으로 과일을 나누었는지 나만의 기준을 적어봅시다.',
                placeholder:
                    '예: 씨가 있는 과일만 A로 모았어요. / 향이 강한 과일은 B로 모았어요. / 둥근 모양과 긴 모양으로 나눴어요.'
            }
        ],
        upper: [
            {
                id: 'd1_upper_assignments',
                type: 'd1-upper-drag',
                omitLabel: false,
                label: '① 활동 10가지 나누기 — 통과 ✅ / 보류 ⚠️',
                placeholder: ''
            },
            {
                id: 'unique_sort',
                type: 'textarea',
                label: '② 통과·보류 기준을 한 문장으로 적어봅시다.',
                placeholder:
                    '위에서 나눈 것과 맞게 적어 봐. 예: "움직이는 활동만 통과" / "조용한 모임은 전부 보류" / "만들기·그림만 통과"'
            },
            {
                id: 'insight',
                type: 'textarea',
                label: '③ 이 기준으로 행사를 운영하면 어떤 상황이 발생할까?',
                placeholder:
                    '예: 체육만 통과면 독서·그림 좋아하는 친구는 소외될 수 있어 / 조용한 활동만 보류면 내향적인 친구만 손해… 구체적으로 적어 봐.'
            }
        ]
    }
};
