/**
 * D-4 — 학교 문제 해결 AI 설계 (나선형)
 * 저: 이름 + 불편 + 도움(3칸) → 중: + 데이터(data_collect) → 상: + 안전(hitl)
 * 기존 설계도 id 중 data_collect, hitl 유지. 저·중 공통 기본은 ai_name, inconvenience, ai_helps.
 */

export const D4_MISSION = {
    title: '학교 평화 수호의 심장, 천재 AI 설계 마스터 도면 짜기',
    competency: 'AI 원리 체험',
    why: {
        lower:
            '학교에 불편한 일이 있을 때, 도와줄 AI에게 이름을 짓고 무엇을 도와줄지 정리해 보면 “AI가 하는 일”이 어떤 것인지 감이 와요.',
        middle:
            '같은 AI라도 어떤 데이터를 배우느냐에 따라 행동이 달라져요. 이름·불편·도움을 정한 뒤, 똑똑해지려면 무엇이 필요한지까지 적어 보는 단계예요.',
        upper:
            '데이터까지 정했어도 AI는 틀리거나 엉뚱하게 굴 수 있어요. 그때를 대비해 사람이 멈추거나 확인하는 방법까지 설계하는 것이 책임 있는 나선형 마무리예요.'
    },
    example: {
        lower: '이름 “줄줄이”, 불편 “급식 줄”, 도움 “몇 반부터 가면 한산한지 안내”.',
        middle: '여기에 더해 데이터: 급식 시간표, 지난주 줄 길이 기록 같은 것.',
        upper: '안전: AI 안내가 이상하면 담임 선생님이 앱을 꺼 버리는 버튼이 있다 등.'
    },
    storySteps: {
        lower: [
            {
                text: '안녕! 나는 AI 설계 도우미 알리야. 우리 학교에 불편한 점이 있지?',
                image: '/robot_2d_base.png'
            },
            {
                text: '오늘은 도와줄 AI에게 이름을 짓고, 어떤 불편을 어떻게 도울지 세 가지로 나누어 적어 보자.',
                image: '/robot_2d_base.png'
            },
            {
                text: '아래 세 칸: ① 이름 ② 불편한 일 ③ 도와줄 수 있는 일. 차례로 채워 봐!',
                image: '/robot_2d_base.png'
            }
        ],
        middle: [
            {
                text: '안녕! 나는 AI 설계 도우미 알리야. 이름·불편·도움을 정했다면, 한 단계 더 나아가 보자.',
                image: '/robot_2d_base.png'
            },
            {
                text: 'AI가 진짜로 똑똑하게 행동하려면, 어떤 정보(데이터)를 모아서 배우게 할지 정해야 해.',
                image: '/robot_2d_base.png'
            },
            {
                text: '아래 네 칸: 앞의 세 가지에 이어 ④ 필요한 데이터까지 적어 봐!',
                image: '/robot_2d_base.png'
            }
        ],
        upper: [
            {
                text: '안녕! 나는 AI 설계 도우미 알리야. 이름·불편·도움·데이터까지 생각했다면 마지막 단계야.',
                image: '/robot_2d_base.png'
            },
            {
                text: 'AI는 가끔 예상과 다르게 행동하거나 잘못할 수 있어. 그럴 때 어떻게 하면 안전하게 쓸 수 있을지가 중요해.',
                image: '/robot_2d_base.png'
            },
            {
                text: '아래 다섯 칸: 마지막에 ⑤ 안전하게 쓰는 방법(사람이 멈추거나 확인하는 것)을 적어 봐!',
                image: '/robot_2d_base.png'
            }
        ]
    },
    // 탐구 과제(3단계) 상단 점선 안내 박스 없음 — 안내는 스토리·입력 라벨로만 제공
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
        lower: [],
        middle: [],
        upper: []
    },
    stackedInputs: {
        lower: [
            {
                id: 'ai_name',
                type: 'text',
                label: '1. AI(또는 로봇)의 이름',
                placeholder: '예: 줄줄이, 도서관 요정 봇…'
            },
            {
                id: 'inconvenience',
                type: 'textarea',
                label: '2. 학교에서 불편한 일',
                placeholder: '예: 급식 줄이 너무 길다, 분실물을 잘 못 찾겠다…'
            },
            {
                id: 'ai_helps',
                type: 'textarea',
                label: '3. 그 AI가 도움을 줄 수 있는 일',
                placeholder: '예: 몇 학년 몇 반이 먼저 가면 한산한지 알려 준다, 분실물 장소를 사진으로 찾아 준다…'
            }
        ],
        middle: [
            {
                id: 'ai_name',
                type: 'text',
                label: '1. AI(또는 로봇)의 이름',
                placeholder: '예: 줄줄이, 도서관 요정 봇…'
            },
            {
                id: 'inconvenience',
                type: 'textarea',
                label: '2. 학교에서 불편한 일',
                placeholder: '예: 급식 줄이 너무 길다, 분실물을 잘 못 찾겠다…'
            },
            {
                id: 'ai_helps',
                type: 'textarea',
                label: '3. 그 AI가 도움을 줄 수 있는 일',
                placeholder: '예: 줄 안내, 분실물 검색 도움…'
            },
            {
                id: 'data_collect',
                type: 'textarea',
                label: '4. 똑똑하게 행동하려면 필요한 데이터',
                placeholder:
                    '예: 지난주 급식 줄 사진·시간 기록, 분실물 접수 장부, 설문 결과… 쉬운 말로 나열해 봐.'
            }
        ],
        upper: [
            {
                id: 'ai_name',
                type: 'text',
                label: '1. AI(또는 로봇)의 이름',
                placeholder: '예: 줄줄이, 도서관 요정 봇…'
            },
            {
                id: 'inconvenience',
                type: 'textarea',
                label: '2. 학교에서 불편한 일',
                placeholder: '예: 급식 줄, 분실물, 시끄러운 복도…'
            },
            {
                id: 'ai_helps',
                type: 'textarea',
                label: '3. 그 AI가 도움을 줄 수 있는 일',
                placeholder: '예: 안내, 기록 정리, 알림…'
            },
            {
                id: 'data_collect',
                type: 'textarea',
                label: '4. 똑똑하게 행동하려면 필요한 데이터',
                placeholder:
                    '예: 도서 대출 기록, 급식 신청, 체육관 예약표… 어떤 문제를 풀 때 어떤 데이터가 필요한지 적어 봐.'
            },
            {
                id: 'hitl',
                type: 'textarea',
                label:
                    '5. AI가 예상과 다르게 행동하거나 문제가 생겼을 때, 안전하게 쓰려면 어떻게 할까?',
                placeholder:
                    '예: 이상하면 교사가 전원 끄기 / 영양사·담임이 최종 확인 후만 실행 / 학부모 신고 시 사용 중지…'
            }
        ]
    }
};
