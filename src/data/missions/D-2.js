/**
 * D-2 — 나선형: 저·중학년은 “사과 데이터 5칸” 동일 컨셉, 중학년에 타 과일 혼입, 고학년은 아오리(초록 익은 사과) 인식 한계
 */

const D2_APPLE_FIVE_FIELDS = [
    {
        id: 's1',
        label: '① 사과 데이터',
        placeholder: '예: 빨간 사과 한 알 통째로'
    },
    {
        id: 's2',
        label: '② 사과 데이터',
        placeholder: '예: 반으로 잘라 씨가 보이는 사과'
    },
    {
        id: 's3',
        label: '③ 사과 데이터',
        placeholder: '예: 풋사과(초록빛)'
    },
    {
        id: 's4',
        label: '④ 사과 데이터',
        placeholder: '예: 상자에 담긴 사과 여러 개'
    },
    {
        id: 's5',
        label: '⑤ 사과 데이터',
        placeholder: '예: 주스나 샐러드에 썬 사과 조각'
    }
];

export const D2_MISSION = {
    title: '쓰레기를 먹으면 배가 아파요! 깨끗한 데이터 밥 주기',
    competency: 'AI 원리 체험',
    why: {
        lower:
            'AI는 사진·글 같은 자료를 보고 배워요. 같은 “사과”라도 모양이 다양하게 들어가야 나중에 진짜 사과를 잘 알아봐요.',
        middle:
            '1·2학년 때처럼 사과 데이터를 골고루 모으는 건 그대로 중요해요. 여기에 바나나·망고 같은 다른 과일 사진이 “사과”라고 잘못 섞이면, AI는 경계를 엉망으로 배워요.',
        upper:
            '학습 데이터가 현실을 골고루 담지 못하면, 특이하지만 맞는 경우를 틀리게 처리해요. 익은 빨간 사과와 덜 익은 사과만으로 배운 AI는, 다 익어도 초록인 아오리사과를 어떻게 볼지가 문제가 돼요.'
    },
    example: {
        lower:
            '빨간 사과 사진만 잔뜩 보여 주면, 초록 풋사과를 볼 때 AI는 뭘 할까요?',
        middle:
            '사과 연습인데 바나나 사진에 “사과”라고 붙어 있으면, 나중에 과일을 고를 때 무슨 일이 생길까요?',
        upper:
            '“빨갛게 익음 = 잘 익은 사과”만 반복해서 배우면, 초록이지만 달콤한 아오리를 “아직 안 익음”으로 착각할 수 있어요.'
    },
    storySteps: {
        lower: [
            {
                text: '안녕! 나는 데이터 요리사 알리야. 아기 AI에게 사과를 가르칠 건데, 똑같은 사진만 주면 금방 싫증 난다구!',
                image: '/robot_2d_base.png'
            },
            {
                text: '색·모양·어디에 있든 서로 다른 사과 모습을 다섯 가지 적어 넣어 보자. 그게 곧 AI의 “영양 만점 도시락”이야.',
                image: '/robot_2d_base.png'
            },
            {
                text: '아래 다섯 칸에 하나씩만 적어도 돼. 상상력 쇼핑 시작!',
                image: '/robot_2d_base.png'
            }
        ],
        middle: [
            {
                text: '반가워! 1·2학년 때 했던 것 기억나? 사과는 여러 모습으로 골고루 넣는 게 좋았지.',
                image: '/robot_2d_base.png'
            },
            {
                text: '이번엔 나선형으로 한 단계 더! “사과” 연습인데 바나나·망고 사진이 이름표만 사과로 잘못 붙어 섞였다고 상상해 봐.',
                image: '/robot_2d_base.png'
            },
            {
                text: '먼저 아래 다섯 칸에 또 다른 사과 아이디어를 적고, 그다음 칸에 섞였을 때 생길 문제를 적어!',
                image: '/robot_2d_base.png'
            }
        ],
        upper: [
            {
                text: '안녕! 나는 데이터 요리사 알리야. 오늘은 “색이 속이는” 사과 이야기를 할 거야.',
                image: '/robot_2d_base.png'
            },
            {
                text: '어떤 AI는 잘 익은 빨간 사과와 덜 익은 빨간 사과만 잔뜩 보고 배웠대. 그런데 세상엔 다 익어도 초록색인 아오리사과도 있지.',
                image: '/robot_2d_base.png'
            },
            {
                text: '이 AI가 아오리를 만나면 뭘 착각할까? 그리고 데이터와 설계를 어떻게 바꾸면 나아질까? 비판적으로 두 칸에 적어 보자!',
                image: '/robot_2d_base.png'
            }
        ]
    },
    scenarioDescriptions: {
        lower:
            '아래 다섯 칸에, 서로 달라 보이는 사과 모습을 하나씩 적어. (위 그림도 참고!)',
        middle:
            '① 먼저 다섯 칸에 사과 데이터 아이디어를 각각 하나씩 적어. ② 그다음 칸에, 사과 학습인데 바나나·망고 같은 다른 과일이 “사과”라고 잘못 섞여 학습되면 어떤 문제가 생길지 적어.',
        upper:
            '익은 빨간 사과와 덜 익은 빨간 사과 위주로만 학습한 AI가 있다고 해. ① {{AOMORI}}(다 익어도 초록색)를 보면 어떤 오인·문제가 생길지 적어. ② 데이터 수집·라벨·검증 등에서 어떤 해결책이 있을지 비판적으로 적어.'
    },
    scenarioImages: {
        lower: '/d2_scenario_lower.png',
        middle: '/d2_scenario_middle.png',
        upper: '/d2_scenario_upper.png'
    },
    type: 'direct-text',
    prompts: {
        lower: [],
        middle: [],
        upper: []
    },
    stackedInputs: {
        lower: [
            {
                id: 'd2_apple_five',
                type: 'multi-text',
                label: '서로 다른 사과 모습 5가지',
                placeholder: '',
                fields: D2_APPLE_FIVE_FIELDS
            }
        ],
        middle: [
            {
                id: 'd2_apple_five',
                type: 'multi-text',
                label: '서로 다른 사과 모습 5가지',
                placeholder: '',
                fields: D2_APPLE_FIVE_FIELDS
            },
            {
                id: 'd2_mixed_fruit_chaos',
                type: 'textarea',
                label: '다른 과일(바나나·망고 등)이 사과 데이터에 잘못 섞여 학습되면?',
                placeholder:
                    '예: 바나나를 사과로 착각해서 추천이 엉망 / 망고 사진만 보면 무조건 사과로 답함 / 진짜 사과와 다른 과일 경계가 무너짐… 네 생각을 적어 봐.'
            }
        ],
        upper: [
            {
                id: 'd2_aomori_problem',
                type: 'textarea',
                label: '① AI가 {{AOMORI}}를 인식했을 때 생길 수 있는 문제를 생각해 봅시다.',
                placeholder:
                    '예: “아직 안 익었다”고만 판단해서 버림 / 초록=미숙 규칙에 갇혀 달콤한 아오리를 평가 절하…'
            },
            {
                id: 'd2_aomori_solution',
                type: 'textarea',
                label: '② 위와 같은 해결을 위해 데이터·검증·설계에서 할 수 방법을 생각해 봅시다.',
                placeholder:
                    '예: 초록 사과·아오리 사진을 충분히 넣기 / 익음은 색만이 아니라 질감·당도 정보 병행 / 사람이 의심 케이스만 검토…'
            }
        ]
    }
};
