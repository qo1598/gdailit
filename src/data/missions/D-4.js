export const D4_MISSION = {
    title: '천재 AI 설계 마스터 도면 짜기',
    competency: 'AI 수명 주기 기획 및 HITL 설계',
    ksa_tags: { K: "K3.2", S: "Problem Solving", A: "Innovative" },
    type: {
        lower: 'stacked-inputs',
        middle: 'stacked-inputs',
        upper: 'stacked-inputs'
    },
    storySteps: {
        lower: [
            { text: '여러분이 "학교의 영웅 AI"를 만든다면 어떤 친구를 만들고 싶나요?' },
            { text: '급식 메뉴를 알려주는 AI? 무거운 가방을 들어주는 로봇?' },
            { text: '나만 알고 있는 학교 생활의 불편함을 해결할 멋진 AI의 이름과 기능을 지어주세요!' }
        ],
        middle: [
            { text: 'AI를 완성하려면 도면이 필요해요. 문제 정의부터 필요한 데이터까지 설계해 봅시다.' },
            { text: '여러분의 AI 영웅이 똑똑해지려면 학생들의 어떤 데이터를 수집해야 할까요?' },
            { text: '데이터의 종류와 학습 방법을 담은 초안 기획서를 완성해 보세요.' }
        ],
        upper: [
            { text: '진정한 혁신은 AI의 능력을 믿으면서도, 언제든지 인간이 개입할 수 있는 안전장치를 두는 것입니다.' },
            { text: 'p.174에 따르면, 설계 주기 전체에서 "인간 개입(HITL)"은 투명성을 보장하는 핵심입니다.' },
            { text: 'AI가 실수했을 때를 대비한 최종 승인 시스템과 긴급 정지 시스템을 포함한 마스터 플랜을 짜봅시다.' }
        ]
    },
    education: {
        lower: {
            why: '문제를 해결하는 도구로서 AI를 상상하며 기획자의 첫 걸음을 떼기 위해서예요.',
            example: '"급식 요정 AI": 메뉴 데이터 -> 분석 -> 제일 인기 있는 반찬 알려주기'
        },
        middle: {
            why: 'AI 제품의 개발 프로세스(문제 정의 - 데이터 수집 - 모델링)를 체계적으로 이해합니다.',
            example: '"도서관 큐레이터": 대출 기록 -> 추천 엔진 -> 맞춤 도서 제안'
        },
        upper: {
            why: '인간의 가치와 안전을 최우선으로 하는 시스템 디자인 역량을 종합적으로 발휘합니다.',
            example: '최종 등수를 매기는 AI의 판단을 선생님이 검토(HITL)하여 최종 결정합니다.'
        }
    },
    stackedInputs: {
        lower: [
            { id: 'ai_name', type: 'text', label: 'AI 이름', placeholder: '멋진 이름을 지어주세요!' },
            { id: 'inconvenience', type: 'text', label: '해결할 불편함', placeholder: '학교에서 어떤 점이 힘들었나요?' }
        ],
        middle: [
            { id: 'ai_name', type: 'text', label: 'AI 도면 (중급)', placeholder: '이름/기능' },
            { id: 'data_collect', type: 'textarea', label: '수집할 데이터셋 기획', placeholder: '어떤 사진이나 정보를 공부시켜야 할까요?' }
        ],
        upper: [
            { id: 'data_collect', type: 'text', label: '데이터 요구사항', placeholder: '필수 데이터 리스트' },
            { id: 'hitl', type: 'textarea', label: '인간 개입(Safety) 설계', placeholder: 'AI가 실수하면 누가, 어떻게 바로잡나요?' }
        ]
    }
};
