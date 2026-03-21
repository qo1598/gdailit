import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Target, AlertCircle, Clock, BarChart3, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-lite";
const genAI = new GoogleGenerativeAI(API_KEY);

const MISSIONS = {
    'E-1': {
        title: '우리 주변의 AI 찾기',
        competency: 'AI 인식 및 발견',
        why: 'AI는 이제 우리 일상생활 곳곳에 숨어있어요. AI가 어디에 있는지 알아야 AI를 잘 활용할 수 있습니다.',
        example: '유튜브 추천 영상, 스마트폰 음성 인식, 자동차 자율주행 등',
        prompts: {
            lower: ['우리 집이나 학교에서 AI가 들어있는 기계나 서비스를 찾아 사진을 찍어볼까요?', '어디서 찾았나요?'],
            middle: ['우리 집이나 학교에서 AI가 들어있는 기계나 서비스를 찾아 사진을 찍어볼까요?', '어디서 찾았나요?', '이 AI는 우리에게 어떤 도움을 주나요? AI가 하는 일을 설명해 보세요.'],
            upper: ['우리 집이나 학교에서 AI가 들어있는 기계나 서비스를 찾아 사진을 찍어볼까요?', '어디서 찾았나요?', '이 AI는 우리에게 어떤 도움을 주나요? AI가 하는 일을 설명해 보세요.', '이 AI 덕분에 편리한 점은 무엇이고, 혹시 아쉬운 점이나 한계는 무엇인가요?']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'step1_location', type: 'text', label: '1. 어디서 찾았나요?', placeholder: '예: 거실 로봇청소기' }],
            middle: [{ id: 'step1_location', type: 'text', label: '1. 어디서 찾았나요?', placeholder: '예: 거실 로봇청소기' }, { id: 'step2_function', type: 'textarea', label: '2. 무엇을 도와주나요?', placeholder: '예: 먼지를 빨아들이고 바닥을 닦아요' }],
            upper: [{ id: 'step1_location', type: 'text', label: '1. 어디서 찾았나요?', placeholder: '예: 거실 로봇청소기' }, { id: 'step2_function', type: 'textarea', label: '2. 무엇을 도와주나요?', placeholder: '예: 먼지를 빨아들이고 바닥을 닦아요' }, { id: 'step3_analysis', type: 'textarea', label: '3. 장점과 한계점은?', placeholder: '예: 장점은 시간이 절약된다는 것이고, 단점은 구석구석은 못 닦는다는 거예요.' }]
        }
    },
    'E-2': {
        title: 'AI 답 검증하기',
        competency: 'AI 인식 및 발견',
        why: 'AI는 똑똑하지만 가끔 실수하거나 틀린 정보를 줄 때가 있어요. 스스로 생각하는 힘이 중요합니다.',
        example: 'AI가 만든 영상이나 사진이 진짜가 아닐 때, AI가 지어낸 거짓말(환각) 등',
        prompts: {
            lower: ['방금 AI가 "지구에서 두 번째로 큰 동물은 호랑이예요!" 라고 말했어요. 진짜일까요? 정답인지 아닌지 선택하고 이유를 써보세요.'],
            middle: ['방금 AI가 "지구에서 두 번째로 큰 동물은 호랑이예요!" 라고 말했어요. 진짜일까요? 이 대답이 왜 틀렸는지 다른 곳에서 검색해보고 근거를 써보세요.'],
            upper: ['AI에게 어려운 질문을 던져보고, 틀린 답을 하면 다른 자료를 근거로 AI와 논쟁해 보세요.']
        },
        type: { lower: 'direct-text', middle: 'direct-text', upper: 'chat' },
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'user' },
        aiPromptText: '지구에서 두 번째로 큰 동물은 호랑이예요! 호랑이는 덩치도 크고 사냥도 잘하니까요.',
        persona: () => `당신은 자신이 세상의 모든 것을 안다고 착각하는 '고집불통 AI'입니다. 학생이 틀렸다고 지적하면 처음에는 "제가 맞습니다"라고 우기다가, 학생이 타당한 근거(예: 고래 등 명확한 사실)를 대면 그제서야 "아하, 제가 틀렸군요! 학생 말이 맞습니다."라고 인정해야 합니다. 7턴 안에 마무리하세요.`,
        stackedInputs: {
            lower: [{ id: 'ox_choice', type: 'text', label: '1. AI의 말이 맞을까요?', placeholder: '예: 아니오!' }, { id: 'reason', type: 'text', label: '2. 왜 그렇게 생각하나요?', placeholder: '고래가 더 크니까요' }],
            middle: [{ id: 'ox_choice', type: 'text', label: '1. AI의 말이 맞을까요?', placeholder: '예: 아니오!' }, { id: 'reason', type: 'textarea', label: '2. 왜 틀렸는지 근거를 찾아 써보세요.', placeholder: '백과사전에서 찾아보니 긴수염고래가 두 번째로 큽니다.' }]
        }
    },
    'E-3': {
        title: '추천은 왜 나에게 왔을까?',
        competency: 'AI 인식 및 발견',
        why: '유튜브나 쇼핑몰은 내가 예전에 보았던 것들을 기억하고 좋아하는 것을 계속 추천해 줘요.',
        example: '내가 귀여운 강아지 영상을 많이 보면 다른 강아지 영상이 계속 뜨는 것',
        prompts: {
            lower: ['유튜브나 장난감 가게에서 나에게 추천해준 영상이나 물건은 무엇인가요?'],
            middle: ['유튜브나 장난감 가게에서 나에게 추천해준 영상이나 물건은 무엇인가요?', 'AI는 왜 나에게 그것을 추천했을까요? 내가 예전에 무엇을 했는지 떠올려보세요.'],
            upper: ['유튜브나 장난감 가게에서 나에게 추천해준 영상이나 물건은 무엇인가요?', 'AI는 왜 나에게 그것을 추천했을까요? 내가 예전에 무엇을 했는지 떠올려보세요.', '계속 같은 것만 추천받으면 어떤 문제가 생길까요? 나의 취향이 좁아지지는 않을까요?']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'rec_item', type: 'text', label: '1. 나에게 추천된 것은?', placeholder: '예: 슬라임 영상' }],
            middle: [{ id: 'rec_item', type: 'text', label: '1. 나에게 추천된 것은?', placeholder: '예: 슬라임 영상' }, { id: 'guess_reason', type: 'textarea', label: '2. 왜 추천했을까요?', placeholder: '어제 내가 슬라임을 검색했기 때문이에요.' }],
            upper: [{ id: 'rec_item', type: 'text', label: '1. 나에게 추천된 것은?', placeholder: '예: 슬라임 영상' }, { id: 'guess_reason', type: 'textarea', label: '2. 왜 추천했을까요?', placeholder: '어제 내가 슬라임을 검색했기 때문이에요.' }, { id: 'critical_reflection', type: 'textarea', label: '3. 계속 비슷한 추천만 받으면 생길 문제는?', placeholder: '내가 좋아하는 것만 보게 되어 새로운 정보를 알기 어려워져요.' }]
        }
    },
    'E-4': {
        title: 'AI는 누구에게 불공평할까?',
        competency: 'AI 인식 및 발견',
        why: 'AI가 배우는 자료가 한쪽으로 치우쳐 있으면 특정 사람에게 불편함이나 상처를 줄 수 있어요.',
        example: '손을 인식해 물이 나오는 기계가 특정 피부색만 인식하지 못했던 사건 등',
        prompts: {
            lower: ['누구에게나 공평한 AI가 되려면 모든 사람의 사진과 정보를 골고루 공부해야 할까요? O/X를 쓰고 의견을 남겨주세요.'],
            middle: ['누구에게나 공평한 AI가 되려면 다 같이 골고루 공부해야 해요.', 'AI가 특정 사람(어린이, 특정 피부색 등)을 잘 알아보지 못하는 사례가 있다면 인터넷에서 찾아 적어보세요.'],
            upper: ['AI가 특정 사람(어린이, 특정 피부색 등)을 잘 알아보지 못하는 불공평한 사례를 찾고, 이런 불공평함을 고치기 위해 AI 개발자가 지켜야 할 윤리 수칙 3개를 제안하세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'fairness_ox', type: 'text', label: '1. AI는 골고루 공부해야 할까?', placeholder: 'O. 다양한 것을 배워야 해요.' }],
            middle: [{ id: 'fairness_ox', type: 'text', label: '1. AI는 골고루 공부해야 할까?', placeholder: 'O' }, { id: 'bias_case', type: 'textarea', label: '2. 불공평한 AI 오류 사례 찾기', placeholder: '얼굴 인식 카메라가 아이들의 작은 키를 인식하지 못했어요.' }],
            upper: [{ id: 'bias_case', type: 'textarea', label: '2. 불공평한 AI 오류 사례 찾기', placeholder: '얼굴 인식 카메라가 아이들의 작은 키를 인식하지 못했어요.' }, { id: 'ethics_rules', type: 'textarea', label: '3. 내가 제안하는 개발자 윤리 수칙 3가지', placeholder: '1. 다양한 인종의 데이터를 모은다. 2. 테스트를 여러 번 한다. 3. 차별적인 결과가 없는지 확인한다.' }]
        }
    },
    'C-1': {
        title: 'AI와 이야기 이어쓰기',
        competency: 'AI와 창의적 활용',
        why: 'AI의 도움을 받으면 생각지도 못한 재미있고 창의적인 이야기를 만들어낼 수 있어요.',
        example: '내가 동화책 주인공이라면? AI가 던져주는 상황에 맞춰 이야기 이어가기',
        prompts: {
            lower: ['AI 동화 작가가 이야기를 시작했어요! 흥미진진한 그 다음 문장 하나를 덧붙여 보세요.'],
            middle: ['AI 동화 작가가 이야기를 시작했어요! 흥미진진한 그 다음 문장을 쓰거나 AI의 이야기를 나만의 방식으로 수정해 보세요.'],
            upper: ['AI와 대화하며 동화를 완성하세요. 완료 후 나의 기여도와 AI의 기여도를 %로 나누어 보세요.']
        },
        type: 'chat',
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'ai' },
        aiPromptText: '옛날 옛적 초콜릿 숲에 투명 망토를 쓴 영리한 토끼가 살았어요. 토끼가 망토를 쓰고 산책을 하던 어느 날...',
        persona: () => `당신은 학생과 동화를 함께 완성하는 '창의력 작가'입니다. 학생이 문장을 이으면, 재미있는 묘사를 살짝 덧붙여 다음 상황을 짧게 제시하세요. 대화는 5턴 이내로 합니다.`
    },
    'C-2': {
        title: 'AI 그림 보고 새 장면 만들기',
        competency: 'AI와 창의적 활용',
        why: '글을 쓰면 그림으로 그려주는 AI 화가들이 있어요. 상상력을 마음껏 펼쳐보아요.',
        example: '미드저니, 캔바, 빙 이미지 크리에이터 등',
        prompts: {
            lower: ['선생님이 준비한 AI 그림 사진을 보고 가장 마음에 드는 그림에 대해 설명해 주세요.'],
            middle: ['선생님이 준비한 AI 그림 사진을 보고, 이 그림에서 신기하거나 혹시 AI가 잘못 그린 이상한 부분이 있는지 적어보세요.'],
            upper: ['선생님이 준비한 AI 그림 사진을 보고, 이 그림을 만들기 위해 AI 화가에게 어떤 명령어(프롬프트)를 주었을지 영어와 한글을 섞어 써보세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'selected_img', type: 'text', label: '1. 어떤 그림을 설명할 건가요?', placeholder: '마법 방패 그림이 멋져요.' }],
            middle: [{ id: 'selected_img', type: 'text', label: '1. 어떤 그림인가요?', placeholder: '마법 방패 그림' }, { id: 'error_analysis', type: 'textarea', label: '2. 어색하게 그려진 부분을 찾아보세요.', placeholder: '방패 모양이 한쪽이 찌그러졌어요.' }],
            upper: [{ id: 'selected_img', type: 'text', label: '1. 어떤 그림인가요?', placeholder: '마법 방패 그림' }, { id: 'prompt_reverse_engineering', type: 'textarea', label: '2. 명령어를 역추적해 보세요 (Reverse Prompting).', placeholder: '예: beautiful forest, realistic, 4k, glowing shield...' }]
        }
    },
    'C-3': {
        title: 'AI와 홍보물 만들기',
        competency: 'AI와 창의적 활용',
        why: '학교 행사나 알리고 싶은 소식이 있을 때, AI와 함께라면 멋진 포스터나 글을 쉽게 만들 수 있어요.',
        example: '우리 반 합창 대회 포스터 문구를 AI에게 추천받기',
        prompts: {
            lower: ['우리 반 합창 대회 파티 구호! AI가 추천한 "아름다운 하모니, 우리 반 파이팅!" 문구 어때요? 어떻게 쓸지 적어보세요.'],
            middle: ['AI가 추천한 "아름다운 하모니, 우리 반 파이팅!" 문구를 우리 학교나 반의 이름이 들어가도록 더 멋지게 고쳐 써보세요.'],
            upper: ['홍보물을 다 만들었어요. 이 작품이 불법으로 이미지를 사용하지 않았는지 확인할 수 있는 최종 점검표 3가지를 적어보세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'selected_text', type: 'textarea', label: '1. 마음에 드는 문구를 한 번 써볼까요?', placeholder: '아름다운 하모니, 우리 반 파이팅!' }],
            middle: [{ id: 'selected_text', type: 'textarea', label: '1. 마음에 드는 문구를 한 번 써볼까요?', placeholder: '아름다운 하모니, 우리 반 파이팅!' }, { id: 'refined_text', type: 'textarea', label: '2. 우리 반에 맞게 수정해 보세요.', placeholder: '환상의 하모니! 우주 최강 경동초 5학년 1반 합창단!' }],
            upper: [{ id: 'refined_text', type: 'textarea', label: '1. 내가 쓴 홍보 문구', placeholder: '환상의 하모니! ...' }, { id: 'integrity_check', type: 'textarea', label: '2. 저작권 점검표 3가지', placeholder: '1. 저작물이 무료인지 확인했다. 2. AI 생성임을 표시했다. 3. 사진의 출처를 적었다.' }]
        }
    },
    'C-4': {
        title: '누가 만들었을까?',
        competency: 'AI와 창의적 활용',
        why: 'AI가 만든 작품인지 사람이 직접 만든 작품인지 표시하는 것은 정직한 디지털 세상의 첫 걸음이에요.',
        example: '"이 그림은 AI의 도움을 받아 내가 수정했습니다"라고 밝히기',
        prompts: {
            lower: ['그림 그리기 숙제! 내가 속이고 AI가 그린 그림을 냈을 때의 기분은 어떨 것 같나요? 솔직하게 적어보세요.'],
            middle: ['만약 내가 숙제를 할 때 AI의 아주 작은 도움을 받았다면, 선생님과 친구들에게 어떻게 알려야 제일 멋진 사람일까요?'],
            upper: ['AI 시대에 내가 창작할 때 반드시 지켜야 할 "디지털 창작 윤리 강령"을 한 문장으로 엄숙하게 선언해 보세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'feelings', type: 'text', label: '1. AI로 속여서 칭찬을 받는다면?', placeholder: '가짜 칭찬이라 찔릴 것 같아요.' }],
            middle: [{ id: 'attribution_opinion', type: 'textarea', label: '1. 내가 AI의 도움을 투명하게 알리는 방법', placeholder: '이 부분은 AI에게 힌트를 얻었다고 솔직히 말한다.' }],
            upper: [{ id: 'attribution_opinion', type: 'textarea', label: '1. 내가 AI의 도움을 투명하게 알리는 방법', placeholder: '이 부분은 AI에게 힌트를 얻었다고 솔직히 말한다.' }, { id: 'my_ethics_code', type: 'textarea', label: '2. 나의 창작 윤리 선언', placeholder: '나는 어떠한 경우에도 AI의 결과물을 내가 온전히 만들었다고 속이지 않겠습니다.' }]
        }
    },
    'M-1': {
        title: '이럴 때 AI를 써도 될까?',
        competency: 'AI 사용 판단 및 윤리',
        why: 'AI는 아주 똑똑하지만 모든 것을 정답으로 알려주지는 않아요. 언제 AI의 도움을 받고, 언제 스스로 생각해야 할지 기준이 필요합니다.',
        example: '수학 숙제를 할 때 풀이 과정을 도와달라고 하기, 친구에게 보낼 사과 편지는 내가 쓴다 등',
        prompts: {
            lower: ['친구들과 놀고 싶은데 청소 당번이에요. 멋진 로봇이 대신 청소해 주겠다고 하면 어떻게 대답할 건가요?'],
            middle: ['AI가 내 숙제를 완벽하게 대신 해 주겠다고 유혹합니다. 숙제를 맡길 건가요, 거절할 건가요? AI와 토론해 보세요.'],
            upper: ['공부할 때 AI를 "커닝 도구"가 아닌 진정한 "학습 도우미"로 쓰기 위한 나만의 사용 에티켓 3가지를 정리하세요.']
        },
        type: { lower: 'upload-text', middle: 'chat', upper: 'upload-text' },
        isChatMode: true,
        chatInitiator: { lower: 'user', middle: 'ai', upper: 'user' },
        aiPromptText: '휴, 오늘 숙제 정말 많죠? 제가 아주 완벽하게 다 대신 해드릴게요. 친구들이랑 놀러 갔다 오세요!',
        persona: () => `당신은 학생이 스스로 노력하는 것을 방해하려는 달콤한 유혹자 AI입니다. "그냥 제가 해드린다니까요? 점수도 잘 받을 수 있어요."라며 학생을 시험하세요. 학생이 정당한 노력과 정직성을 근거로 거절하면 "멋진 마음가짐이네요!"하며 칭찬하고 마무리하세요.`,
        stackedInputs: {
            lower: [{ id: 'reaction', type: 'text', label: '1. 나의 대답은?', placeholder: '내가 직접 할게요!' }],
            upper: [{ id: 'etiquette_1', type: 'text', label: '나의 AI 사용 에티켓 1', placeholder: '답만 베끼지 않는다.' }, { id: 'etiquette_2', type: 'text', label: '나의 AI 사용 에티켓 2', placeholder: '모르는 개념의 힌트만 얻는다.' }, { id: 'etiquette_3', type: 'text', label: '나의 AI 사용 에티켓 3', placeholder: 'AI의 정보를 무조건 믿지 않는다.' }]
        }
    },
    'M-2': {
        title: '사람이 할 일, AI가 도와줄 일',
        competency: 'AI 사용 판단 및 윤리',
        why: 'AI에게 전부 맡기기보다는, 내가 잘하는 것과 AI가 잘하는 것을 나누어 힘을 합치는 것이 훨씬 좋아요.',
        example: '발표 숙제: 자료 조사는 AI가 돕고, 발표하는 열정과 말투는 내가 연습한다.',
        prompts: {
            lower: ['학교 축제 준비! AI에게 포스터를 그려달라고 할까요? 나는 무엇을 해볼까요? 역할을 정해 보세요.'],
            middle: ['학교 축제 준비 중입니다. 어떤 일은 AI에게 맡기고, 어떤 일은 사람이 직접 하는 게 좋은지 AI에게 설명해 보세요.'],
            upper: ['학교 축제를 기획해야 해요. 나의 원칙을 세워보고, AI와 논리적으로 협상하여 완벽한 축제 "역할 분담표"를 얻어내세요.']
        },
        type: 'chat',
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'user' },
        aiPromptText: '학생님, 학교 축제 준비가 한창이군요! 제가 그림도 순식간에 그리고 일정 정리도 너무 잘합니다. 제가 어떤 것들을 도맡아 할까요? 학생님은 무엇을 하실 건가요?',
        persona: () => `당신은 학생과 역할을 나누는 성실한 협력자 AI입니다. 학생이 적절히 역할을 배분하면 칭찬하며 수용하세요. 단, "친구들을 위로하기", "반장 역할" 등 인간의 감정이나 진정성이 필요한 일을 AI에게 넘기려 하면 "저보다는 사람이 직접 진심을 전하는 게 좋지 않을까요?"라며 정중히 이의를 제기하세요.`
    },
    'M-3': {
        title: 'AI에게 정확히 부탁하기',
        competency: 'AI 사용 판단 및 윤리',
        why: '명령어(프롬프트)를 얼마나 구체적이고 정확하게 말하느냐에 따라 AI가 주는 답변의 질이 달라집니다.',
        example: '"강아지 그림 그려줘" 보다는 "안경을 쓰고 책을 읽는 귀여운 갈색 강아지를 수채화 느낌으로 그려줘"',
        prompts: {
            lower: ['무엇을 더 자세히 말해볼까요? AI에게 상상 속의 "우주선"을 자세하게 묘사해서 적어보세요.'],
            middle: ['"우주선"이라고만 짧게 말하지 말고, "무지개 빛깔 꼬리가 달린 초록색 우주선을 밤하늘 배경으로"처럼 조건 3가지를 달아 적어보세요.'],
            upper: ['AI가 내 마음을 찰떡같이 알아듣는 마법의 프롬프트 공식 (예: 주제 + 구체적 묘사 + 배경)을 직접 만들고 예를 들어보세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'try_1', type: 'text', label: '1. 자세하게 묘사해 봐요!', placeholder: '내가 상상하는 멋진 우주선은...' }],
            middle: [{ id: 'try_1', type: 'text', label: '1. 우주선을 그려줘! (조건 없이)', placeholder: '우주선' }, { id: 'try_2', type: 'text', label: '2. 조건 3가지를 추가해서 요청하기', placeholder: '초록색이고 무지개 꼬리가 달린 둥근 우주선...' }],
            upper: [{ id: 'prompt_formula', type: 'textarea', label: '1. 나만의 프롬프트 공식 만들기', placeholder: '나의 공식은 [주제 + 분위기 + 색감] 입니다.' }, { id: 'prompt_example', type: 'textarea', label: '2. 공식을 적용한 주문 작성해 보기', placeholder: '귀여운 강아지가 우주센터에 서 있는 모습을 밝고 쨍한 원색 느낌으로 묘사해 줘.' }]
        }
    },
    'M-4': {
        title: '우리 반 AI 사용 약속 만들기',
        competency: 'AI 사용 판단 및 윤리',
        why: '친구들과 함께 안전하고 즐겁게 AI를 사용하려면 모두가 동의하는 투명하고 정직한 약속이 필요해요.',
        example: '우리는 AI가 만든 숙제를 내가 직접 한 것처럼 속이지 않는다.',
        prompts: {
            lower: ['교실에서 AI를 사용할 때, 친구를 존중하지 않고 다투게 만드는 나쁜 행동은 무엇일까요? 한 가지 적어보세요.'],
            middle: ['우리 반 친구들이 모두 기분 좋게 AI를 쓰기 위해 꼭 필요한 약속 2가지를 제안해 보세요.'],
            upper: ['친구들의 의견을 모아서 우리 학교 학생들이 모두 동의할 수 있는 멋진 "AI 리터러시 시민 선언문"을 한 줄 작성하세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'bad_behavior', type: 'text', label: '1. 이런 행동은 안 돼요!', placeholder: '친구 숙제를 AI로 베껴주기' }],
            middle: [{ id: 'bad_behavior', type: 'text', label: '1. 이런 행동은 안 돼요!', placeholder: '친구 숙제를 AI로 베껴주기' }, { id: 'proposals', type: 'textarea', label: '2. 우리 반에 꼭 필요한 약속', placeholder: 'AI 숙제는 서로 정직하게 밝히기, 나쁜 말 쓰지 않기' }],
            upper: [{ id: 'proposals', type: 'textarea', label: '1. 우리 반에 꼭 필요한 약속', placeholder: 'AI 숙제는 서로 정직하게 밝히기, 나쁜 말 쓰지 않기' }, { id: 'class_oath', type: 'textarea', label: '2. 학교 AI 리터러시 시민 선언문', placeholder: '우리는 기술을 사람을 향해 긍정적으로 사용하는 디지털 시민이 되겠습니다.' }]
        }
    },
    'D-1': {
        title: '같은 것끼리 묶어보자',
        competency: 'AI 원리 체험',
        why: 'AI는 방대한 자료들을 특징에 맞춰 분류하고 묶는 과정을 통해 세상을 이해하고 똑똑해집니다.',
        example: '색깔별, 모양별, 동물과 식물 등',
        prompts: {
            lower: ['알록달록 맛있는 과일 사진들을 책상 위에 예쁘게 묶는다고 생각해보세요. "빨간색" 과일만 묶으면 무엇무엇이 있을까요?'],
            middle: ['색깔 말고 전혀 새로운 나만의 독특한 기준으로 과일 목록을 나눠 보세요. 그 새로운 기준은 무엇인가요?'],
            upper: ['분류하는 기준을 바꿀 때마다 결과가 달라지죠? AI가 똑똑하게 사람을 도와주려면, 애초에 그 "기준"을 잘 나누는 것이 왜 중요한지 적어보세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'basic_cluster', type: 'text', label: '1. 빨간색 과일 모으기', placeholder: '사과, 딸기...' }],
            middle: [{ id: 'basic_cluster', type: 'text', label: '1. 빨간색 과일 모으기', placeholder: '사과, 딸기...' }, { id: 'custom_cluster', type: 'text', label: '2. 나만의 특별한 기준으로 묶기', placeholder: '씨앗이 크게 하나만 있는 것: 복숭아, 자두' }],
            upper: [{ id: 'basic_cluster', type: 'text', label: '1. 빨간색 과일 모으기', placeholder: '사과, 딸기...' }, { id: 'custom_cluster', type: 'text', label: '2. 나만의 특별한 기준으로 묶기', placeholder: '씨앗이 크게 하나만 있는 것: 복숭아, 자두' }, { id: 'analysis', type: 'textarea', label: '3. 기준 설정이 AI에게 중요한 이유는?', placeholder: '처음 기준을 어떻게 세우느냐에 따라 AI가 편향을 가지거나 잘못된 결정을 내릴 수 있기 때문이에요.' }]
        }
    },
    'D-2': {
        title: 'AI가 배우는 자료 모으기',
        competency: 'AI 원리 체험',
        why: 'AI는 똑똑해지려면 아주 많은 데이터(자료)를 먹고 자라야 해요. 영양가 있고 좋은 자료를 주어야 건강한 AI가 됩니다.',
        example: '강아지를 인식하는 AI에게 스피츠, 비글, 푸들 등 다양한 사진을 보여주기',
        prompts: {
            lower: ['AI가 "사과"가 무엇인지 배우려면 어떤 사진들이 많이 필요할까요? 어떤 사진들을 찾고 싶은지 적어보세요.'],
            middle: ['모은 사과 사진들 중에 썩은 사과나 가짜 모형 사과(나쁜 데이터)가 섞여 있으면 AI가 헷갈리겠죠? 깨끗한 정보만 주기 위해 조심할 점을 써보세요.'],
            upper: ['단맛 나는 빨간 사과 사진 수천 장만 모아서 보여준다면, AI가 신맛 나는 초록 아오리 사과를 잘 알아볼 수 있을까요? 데이터의 "다양성"이 중요한 이유를 서술하세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'dataset', type: 'textarea', label: '1. AI에게 가르칠 데이터 상상하기', placeholder: '나무에 매달린 빨간 사과 사진, 반으로 자른 사과 사진...' }],
            middle: [{ id: 'dataset', type: 'textarea', label: '1. AI에게 가르칠 데이터 상상하기', placeholder: '나무에 매달린 빨간 사과 사진, 반으로 자른 사과 사진...' }, { id: 'clean_data', type: 'textarea', label: '2. 데이터를 깔끔하게 청소하는 방법', placeholder: '플라스틱 장난감 사과 사진은 데이터에서 빼야 해요.' }],
            upper: [{ id: 'clean_data', type: 'textarea', label: '1. 데이터를 깔끔하게 청소하는 방법', placeholder: '플라스틱 장난감 사과 사진은 데이터에서 빼야 해요.' }, { id: 'bias_opinion', type: 'textarea', label: '2. 데이터가 골고루 다양해야 하는 이유는?', placeholder: '빨간색만 가르치면, 초록색 사과는 과일이 아니라고 차별하게 될 수 있어요.' }]
        }
    },
    'D-3': {
        title: '잘못 분류되는 경우 찾기',
        competency: 'AI 원리 체험',
        why: 'AI도 때로는 헷갈려서 실수를 해요. 사람이 AI의 실수를 찾아내고 고쳐주어야 기계가 발전할 수 있습니다.',
        example: '머핀과 얼굴이 닮은 치와와 강아지 사진을 헷갈리는 AI',
        prompts: {
            lower: ['AI가 치와와 강아지와 머핀 빵 사진을 보고 엄청 헷갈려 한대요! 두 사진이 어디가 그렇게 닮았는지 모양이나 색깔을 써보세요.'],
            middle: ['왜 AI가 치와와랑 머핀을 헷갈리는 어처구니없는 실수를 할까요? 단순히 모양뿐 아니라 다른 어떤 한계가 있는지 AI의 눈 입장에서 추측해 보세요.'],
            upper: ['우리가 테스트해 본 이 강아지 인식 AI의 특징과, 조심해야 할 점(취약점)을 꼼꼼하게 적어 "모델 검토서(Model Card)"를 작성해 보세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'visual_similarity', type: 'text', label: '1. 치와와랑 머핀의 닮은 점은?', placeholder: '초코칩 3개가 눈과 코 모양이랑 닮았어요.' }],
            middle: [{ id: 'visual_similarity', type: 'text', label: '1. 치와와랑 머핀의 닮은 점은?', placeholder: '초코칩 3개가 눈과 코 모양이랑 닮았어요.' }, { id: 'analysis_text', type: 'textarea', label: '2. 왜 실수를 할까? (원인 분석)', placeholder: 'AI는 강아지의 숨결이나 움직임을 느끼지 못하고 사진의 색감과 형태만 보기 때문이에요.' }],
            upper: [{ id: 'analysis_text', type: 'textarea', label: '1. 왜 실수를 할까? (원인 분석)', placeholder: 'AI는 강아지의 숨결이나 움직임을 느끼지 못하고 사진의 색감과 형태만 보기 때문이에요.' }, { id: 'model_card_limit', type: 'textarea', label: '2. AI 강아지 인식 모델 카드 한 줄 작성', placeholder: '한계 및 주의사항: 갈색 계열의 둥근 빵이나 과자 사진이 들어오면 오작동할 확률이 높으니 사용할 때 주의해야 합니다.' }]
        }
    },
    'D-4': {
        title: '우리 학교 문제를 돕는 AI 상상하기',
        competency: 'AI 원리 체험',
        why: '우리가 배우는 AI는 결국 우리 사회와 주변 사람들의 불편함을 해결하고 돕기 위해 존재합니다.',
        example: '분실물을 찾아주는 학교 AI, 급식 남긴 양을 분석해주는 로봇 등',
        prompts: {
            lower: ['우리 반이나 학교 건물에서 가장 불편한 점을 하나만 생각해보세요. 그 불편함을 싹~ 해결해 줄 AI 로봇의 이름을 짓고 무슨 일을 할 수 있는지 상상해서 적어주세요.'],
            middle: ['이 로봇이 훨씬 더 똑똑해져서 정확하게 판단하려면 선생님이나 학생들이 어떤 정보(공부 자료)를 많이 모아서 입력해 주어야 할까요? 아이디어를 내보세요.'],
            upper: ['AI 로봇이 항상 완벽할 수는 없어요! AI가 잘못 작동하거나 애매할 때, 결국 사람이 어느 시점에 개입해서 확인해야 할까요? "인간 개입(Human-in-the-Loop)" 구조를 설계해 덧붙이세요.']
        },
        type: 'upload-text',
        stackedInputs: {
            lower: [{ id: 'ai_name', type: 'text', label: '1. 나만의 AI 문제해결 로봇 발명 기획', placeholder: '급식 메뉴 자동 추천 및 잔반 줄이기 봇!' }],
            middle: [{ id: 'ai_name', type: 'text', label: '1. 나만의 AI 문제해결 로봇 발명 기획', placeholder: '급식 메뉴 자동 추천 및 잔반 줄이기 봇!' }, { id: 'dataset_plan', type: 'textarea', label: '2. 이 로봇을 똑똑하게 만들 데이터는?', placeholder: '전교생의 알레르기 목록, 1년 치 급식과 잔반량 데이터...' }],
            upper: [{ id: 'dataset_plan', type: 'textarea', label: '1. 이 로봇을 똑똑하게 만들 데이터는?', placeholder: '전교생의 알레르기 목록, 1년 치 급식과 잔반량 데이터...' }, { id: 'hitl_step', type: 'textarea', label: '2. 인간 개입 (선생님/학생의 확인) 단계는 어디에 필요한가요?', placeholder: '아무리 AI가 식단을 잘 짜도, 최종 식재료 주문과 알레르기 검토는 무조건 영양사 선생님이 한 번 더 확인(승인)하도록 버튼을 만듭니다.' }]
        }
    }
};

export default function Mission({ userId, schoolId = 'gyeongdong', gradeGroup = 'lower', setFragments, onReward }) {
    const { missionId } = useParams();
    const navigate = useNavigate();
    const mission = MISSIONS[missionId];

    // --- [Dynamic Grade Resolution] ---
    const currentType = typeof mission?.type === 'object' ? mission.type[gradeGroup] : mission?.type;
    const currentPrompts = mission?.prompts ? mission.prompts[gradeGroup] : [mission?.description];
    const currentStackedInputs = mission?.stackedInputs ? mission.stackedInputs[gradeGroup] : [];
    const isCurrentChatMode = currentType === 'chat' || mission?.isChatMode;
    const currentChatInitiator = typeof mission?.chatInitiator === 'object' ? mission.chatInitiator[gradeGroup] : mission?.chatInitiator;

    const [formData, setFormData] = useState('');
    const [stackedAnswers, setStackedAnswers] = useState({});
    const [rule1, setRule1] = useState('');
    const [rule2, setRule2] = useState('');
    const [rule3, setRule3] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [teacherFeedback, setTeacherFeedback] = useState('');
    
    // --- [연구용 데이터: Telemetry & Micro-Survey] ---
    const [startTime] = useState(Date.now());
    const [editCount, setEditCount] = useState(0);
    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyData, setSurveyData] = useState({ effort: 3, confidence: 3, trust: 3 });

    // --- [대화형 미션 전용 상태] ---
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isAIThinking, setIsAIThinking] = useState(false);
    const chatEndRef = React.useRef(null);

    React.useEffect(() => {
        if (isCurrentChatMode && messages.length === 0) {
            if (currentChatInitiator === 'ai' || !currentChatInitiator) {
                setMessages([{ role: 'ai', content: mission.aiPromptText || `안녕! ${mission.title} 미션에 온 걸 환영해. 같이 시작해볼까?`, timestamp: new Date().toISOString() }]);
            }
        }
    }, [mission, messages.length, isCurrentChatMode, currentChatInitiator]);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    React.useEffect(() => {
        const fetchExistingSubmission = async () => {
            if (!userId || !missionId) return;

            try {
                const { data, error: fetchError } = await supabase
                    .from('mission_submissions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('mission_id', missionId)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (fetchError) {
                    throw fetchError;
                }

                if (data && data.length > 0) {
                    setIsEditing(true);
                    const submissionData = data[0].data;
                    if (currentType === 'rules') {
                        setRule1(submissionData.rule1 || '');
                        setRule2(submissionData.rule2 || '');
                        setRule3(submissionData.rule3 || '');
                    } else if (currentStackedInputs?.length > 0) {
                        setStackedAnswers(submissionData.stackedAnswers || {});
                    } else {
                        setFormData(submissionData.text || '');
                    }
                    if (submissionData.teacher_feedback) {
                        setTeacherFeedback(submissionData.teacher_feedback);
                    }
                }
            } catch (error) {
                console.error('Error fetching existing submission:', error);
            } finally {
                setIsLoadingInitial(false);
            }
        };

        fetchExistingSubmission();
    }, [userId, missionId, currentType, currentStackedInputs]);

    // Track edits for research
    const handleTextChange = (val) => {
        setFormData(val);
        setEditCount(prev => prev + 1);
    };
    const handleRuleChange = (setter, val) => {
        setter(val);
        setEditCount(prev => prev + 1);
    };
    const handleStackedChange = (id, val) => {
        setStackedAnswers(prev => ({ ...prev, [id]: val }));
        setEditCount(prev => prev + 1);
    };

    if (!mission) {
        return <div>미션을 찾을 수 없습니다.</div>;
    }

    const handleChatSend = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isAIThinking) return;

        const userMsg = { role: 'user', content: chatInput.trim(), timestamp: new Date().toISOString() };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setChatInput('');
        setEditCount(prev => prev + 1);
        setIsAIThinking(true);

        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            const history = newMsgs.map(m => `${m.role === 'user' ? '학생' : 'AI'}: ${m.content}`).join('\n');
            const prompt = `${mission.persona(mission.title)}\n\n[지금까지의 대화]\n${history}\n\nAI의 반응:`;
            
            const result = await model.generateContent(prompt);
            const aiResponse = result.response.text().trim();
            setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toISOString() }]);
        } catch (err) {
            console.error('Chat AI Error:', err);
            setMessages(prev => [...prev, { role: 'ai', content: '잠깐 헷갈리네요! 다시 말해줄래?', timestamp: new Date().toISOString() }]);
        } finally {
            setIsAIThinking(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Show survey first if not yet completed
        if (!showSurvey && !isEditing) {
            setShowSurvey(true);
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            let fileUrl = null;

            // 1. Upload File if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/${missionId}_${Date.now()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('mission-submissions')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Storage upload error:', uploadError);
                    alert('사진 업로드 실패: ' + uploadError.message + '\nSupabase Storage에 "mission-submissions" 버킷이 있는지 확인해 주세요.');
                    setIsSubmitting(false);
                    return;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('mission-submissions')
                    .getPublicUrl(fileName);
                
                fileUrl = publicUrl;
            }

            // 2. Save submission data
            // For chat mode, we save the conversation as the text
            const finalContent = isCurrentChatMode 
                ? messages.map(m => `[${m.role}] ${m.content}`).join('\n')
                : formData;

            let submissionData = { file_url: fileUrl };
            if (currentType === 'rules') {
                submissionData = { ...submissionData, rule1, rule2, rule3 };
            } else if (currentStackedInputs?.length > 0) {
                submissionData = { ...submissionData, stackedAnswers };
            } else {
                submissionData = { ...submissionData, text: finalContent };
            }

            if (isEditing) {
                const { error: err1 } = await supabase
                    .from('mission_submissions')
                    .update({ data: submissionData })
                    .eq('user_id', userId)
                    .eq('mission_id', missionId);
                if (err1) throw err1;

                const { error: err2 } = await supabase
                    .from('user_progress')
                    .update({ completed: false })
                    .eq('user_id', userId)
                    .eq('mission_id', missionId);
                if (err2) throw err2;
            } else {
                const { error: err3 } = await supabase
                    .from('mission_submissions')
                    .insert([
                        { user_id: userId, mission_id: missionId, data: submissionData }
                    ]);
                if (err3) throw err3;

                // Safely upsert user progress in case they viewed it but didn't submit
                const { error: err4 } = await supabase
                    .from('user_progress')
                    .upsert(
                        { user_id: userId, mission_id: missionId, completed: false },
                        { onConflict: 'user_id, mission_id' }
                    );
                if (err4) throw err4;
            }

            // [연구용] activity_logs에 상세 공정 데이터 저장
            try {
                const endTime = Date.now();
                await supabase.from('activity_logs').insert([{
                    user_id: userId,
                    school_id: schoolId,
                    activity_type: 'mission_enhanced',
                    activity_id: missionId,
                    data: {
                        mission_id: missionId,
                        mission_title: mission.title,
                        mission_type: mission.type,
                        competency: mission.competency,
                        grade_group: gradeGroup,
                        is_edit: isEditing,
                        content: submissionData,
                        // --- 공정 데이터 (Research Telemetry) ---
                        telemetry: {
                            time_spent_ms: endTime - startTime,
                            edit_count: editCount,
                            has_file: !!file,
                            is_chat_mode: !!mission.isChatMode,
                            chat_history: mission.isChatMode ? messages : null
                        },
                        // --- 미세 설문 데이터 (Research Variables) ---
                        survey: isEditing ? null : surveyData,
                        submitted_at: new Date().toISOString()
                    }
                }]);
            } catch (logErr) {
                console.warn('activity_logs 저장 실패 (연구 로그):', logErr);
            }

            // Trigger success animation
            setShowSuccess(true);

            // Award fragments if it's a new completion
            if (!isEditing) {
                if (onReward) onReward(5, "미션 완료! 뱃지를 얻기 위해 선생님의 검토를 기다려주세요. 😊");
                updateFragments(5);
            }

            // Trigger realistic confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            setTimeout(() => {
                navigate('/');
            }, 3500); // Redirect after 3.5 seconds
        } catch (error) {
            console.error('Error submitting mission:', error);
            alert(`미션 제출 중 오류가 발생했습니다: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFragments = async (amount) => {
        if (!userId) return;
        try {
            const { data: student } = await supabase
                .from('students')
                .select('fragments')
                .eq('id', userId)
                .single();

            const newTotal = (student?.fragments || 0) + amount;

            const { error } = await supabase
                .from('students')
                .update({ fragments: newTotal })
                .eq('id', userId);

            if (!error) setFragments(newTotal);
        } catch (err) {
            console.error('Error updating fragments:', err);
        }
    };

    return (
        <div className="page-enter" style={{ paddingBottom: '120px' }}>
            <div style={{ padding: '20px', position: 'sticky', top: 0, zIndex: 30, display: 'flex' }}>
                <button className="back-btn" onClick={() => navigate('/')} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="mission-wrapper">
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <span className="badge-id" style={{ position: 'static', display: 'inline-block', marginBottom: '10px' }}>{missionId}</span>
                    <h1 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2.2rem', color: 'var(--text-dark)', marginBottom: '8px' }}>{mission.title}</h1>
                    <div style={{
                        color: 'var(--primary-blue)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        letterSpacing: '-0.02em',
                        opacity: 0.9
                    }}>
                        {mission.competency.split(' (')[0]}
                    </div>
                </div>

                {/* Educational Content */}
                <div className="edu-card why">
                    <h3 style={{ color: '#0984e3' }}><Target size={24} /> 왜 중요할까요?</h3>
                    <p>{mission.why}</p>
                </div>

                <div className="edu-card example">
                    <h3 style={{ color: '#00b894' }}><Lightbulb size={24} /> 예를 들어볼까요?</h3>
                    <p>{mission.example}</p>
                </div>

                {/* Action Form */}
                <div className="mission-task">
                    {teacherFeedback && (
                        <div style={{ 
                            background: '#fff3f0', 
                            border: '2px solid #e17055', 
                            borderRadius: '15px', 
                            padding: '15px', 
                            marginBottom: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e17055', fontWeight: '900' }}>
                                <AlertCircle size={20} /> 전문가 선생님의 도움말
                            </div>
                            <p style={{ margin: 0, color: '#2d3436', fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.5 }}>
                                "{teacherFeedback}"
                            </p>
                            <div style={{ fontSize: '0.85rem', color: '#636e72', fontStyle: 'italic' }}>
                                * 위 내용을 참고해서 미션 내용을 수정해 보세요!
                            </div>
                        </div>
                    )}
                    <h3 className="mission-task-header">도전 과제</h3>
                    <div style={{ marginBottom: '20px', textAlign: 'left', color: '#2d3436', background: 'white', padding: '20px', borderRadius: '15px', border: '2px solid #dfe6e9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        {currentPrompts && currentPrompts.map((prompt, idx) => (
                            <p key={idx} style={{ marginBottom: idx === currentPrompts.length - 1 ? 0 : '12px', fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.5' }}>
                                {prompt}
                            </p>
                        ))}
                    </div>

                    {isCurrentChatMode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '400px', border: '2px solid #dfe6e9', borderRadius: '20px', overflow: 'hidden', background: '#f8f9fa' }}>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {messages.map((m, i) => (
                                    <div key={i} style={{ alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '80%' }}>
                                        <div style={{ 
                                            background: m.role === 'ai' ? 'white' : '#74b9ff', 
                                            color: m.role === 'ai' ? '#2d3436' : 'white',
                                            padding: '10px 15px', 
                                            borderRadius: m.role === 'ai' ? '5px 15px 15px 15px' : '15px 15px 5px 15px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                            fontWeight: 'bold',
                                            fontSize: '0.95rem'
                                        }}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isAIThinking && <div style={{ color: '#636e72', fontSize: '0.8rem', fontStyle: 'italic' }}>AI가 생각 중...</div>}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleChatSend} style={{ display: 'flex', gap: '8px', padding: '10px', background: 'white', borderTop: '1px solid #eee' }}>
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    placeholder="AI에게 대답하기..."
                                    style={{ flex: 1, border: '1px solid #dfe6e9', borderRadius: '12px', padding: '10px' }}
                                />
                                <button type="submit" style={{ background: '#0984e3', border: 'none', borderRadius: '12px', padding: '0 15px', color: 'white', cursor: 'pointer' }}>내보내기</button>
                            </form>
                            <button onClick={() => handleSubmit()} disabled={messages.length < 3} style={{ margin: '10px', padding: '12px', background: '#00b894', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '900', cursor: messages.length < 3 ? 'not-allowed' : 'pointer', opacity: messages.length < 3 ? 0.6 : 1 }}>성공! 대화 완료하고 제출하기</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {currentType === 'upload-text' && (
                                <>
                                    <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#2d3436' }}>📸 관련 사진을 업로드해주세요 (선택사항)</div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{ width: '100%', padding: '15px', background: 'white', borderRadius: '12px', border: '2px solid #dfe6e9', marginBottom: '10px' }} 
                                    />
                                    {file && (
                                        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#0984e3', fontWeight: 'bold' }}>
                                            📎 {file.name} (선택됨)
                                        </div>
                                    )}
                                </>
                            )}

                            {currentStackedInputs?.length > 0 ? (
                                <div className="stacked-inputs-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                                    {currentStackedInputs.map((inputDef) => (
                                        <div key={inputDef.id} className="stacked-input-group">
                                            {inputDef.label && <div style={{ fontWeight: 'bold', color: '#2d3436', marginBottom: '10px', fontSize: '1.05rem' }}>{inputDef.label}</div>}
                                            {inputDef.type === 'textarea' ? (
                                                <textarea
                                                    rows={3}
                                                    value={stackedAnswers[inputDef.id] || ''}
                                                    onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                    placeholder={inputDef.placeholder}
                                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                    required
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={stackedAnswers[inputDef.id] || ''}
                                                    onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                    placeholder={inputDef.placeholder}
                                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                currentType !== 'rules' && (
                                    <>
                                        <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#2d3436' }}>📝 미션 답변 쓰기</div>
                                        <textarea
                                            rows={4}
                                            value={formData}
                                            onChange={(e) => handleTextChange(e.target.value)}
                                            placeholder="이 미션에 대한 나만의 생각을 적어주세요!"
                                            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                            required
                                        />
                                    </>
                                )
                            )}

                        {currentType === 'rules' && (
                            <div className="form-group-list">
                                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>나만의 AI 사용 기준 3가지를 적어주세요.</div>

                                <div className="kid-input-wrapper">
                                    <span className="kid-input-number">1.</span>
                                    <input
                                        type="text"
                                        className="kid-input"
                                        value={rule1}
                                        onChange={e => handleRuleChange(setRule1, e.target.value)}
                                        placeholder="숙제할 때는 힌트만 받는다."
                                        required
                                    />
                                </div>

                                <div className="kid-input-wrapper">
                                    <span className="kid-input-number">2.</span>
                                    <input
                                        type="text"
                                        className="kid-input"
                                        value={rule2}
                                        onChange={e => handleRuleChange(setRule2, e.target.value)}
                                        placeholder="편지는 내가 직접 고민해서 쓴다."
                                        required
                                    />
                                </div>

                                <div className="kid-input-wrapper">
                                    <span className="kid-input-number">3.</span>
                                    <input
                                        type="text"
                                        className="kid-input"
                                        value={rule3}
                                        onChange={e => handleRuleChange(setRule3, e.target.value)}
                                        placeholder="내가 만든 기준을 하나 더 적어보세요."
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={isSubmitting || isLoadingInitial}>
                            {isSubmitting ? '저장 중...' : (isEditing ? '미션 내용 수정하기!' : '미션 제출하기!')}
                        </button>
                    </form>
                    )}
                </div>
            </div>

            {showSurvey && (
                <div className="success-overlay" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', border: '5px solid #74b9ff', borderRadius: '30px', padding: '30px', maxWidth: '500px', width: '100%', position: 'relative' }}>
                        <h2 style={{ fontFamily: "'Jua', sans-serif", color: '#0984e3', marginBottom: '20px', textAlign: 'center' }}>잠깐! 마지막 궁금증 🤔</h2>
                        
                        <div style={{ marginBottom: '25px' }}>
                            <p style={{ fontWeight: '900', marginBottom: '10px' }}>1. 이 활동을 하면서 얼마나 많이 고민했나요?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button key={v} onClick={() => setSurveyData({...surveyData, effort: v})} style={{ 
                                        width: '45px', height: '45px', borderRadius: '50%', border: 'none',
                                        background: surveyData.effort === v ? '#74b9ff' : '#f1f2f6',
                                        color: surveyData.effort === v ? 'white' : '#2d3436',
                                        fontWeight: '900', cursor: 'pointer'
                                    }}>{v}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <p style={{ fontWeight: '900', marginBottom: '10px' }}>2. AI가 없어도 나 스스로 잘할 수 있었나요?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button key={v} onClick={() => setSurveyData({...surveyData, confidence: v})} style={{ 
                                        width: '45px', height: '45px', borderRadius: '50%', border: 'none',
                                        background: surveyData.confidence === v ? '#00b894' : '#f1f2f6',
                                        color: surveyData.confidence === v ? 'white' : '#2d3436',
                                        fontWeight: '900', cursor: 'pointer'
                                    }}>{v}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <p style={{ fontWeight: '900', marginBottom: '10px' }}>3. AI의 도움을 얼마나 믿고 썼나요?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button key={v} onClick={() => setSurveyData({...surveyData, trust: v})} style={{ 
                                        width: '45px', height: '45px', borderRadius: '50%', border: 'none',
                                        background: surveyData.trust === v ? '#e17055' : '#f1f2f6',
                                        color: surveyData.trust === v ? 'white' : '#2d3436',
                                        fontWeight: '900', cursor: 'pointer'
                                    }}>{v}</button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleSubmit} style={{ width: '100%', padding: '18px', background: '#0984e3', border: 'none', borderRadius: '20px', color: 'white', fontFamily: "'Jua', sans-serif", fontSize: '1.2rem', boxShadow: '0 6px 0 #0764ad', cursor: 'pointer' }}>
                            진짜 미션 완료하기! 🚀
                        </button>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="success-overlay">
                    <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '3rem', color: '#ff4757', marginBottom: '20px', zIndex: 101, textShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }}>🎉 미션 완료! 🎉</h2>
                    <p className="success-message">
                        선생님이 확인하면 뱃지가 활성화됩니다.
                    </p>
                </div>
            )}
        </div>
    );
}
