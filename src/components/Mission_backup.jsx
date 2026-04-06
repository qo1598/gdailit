import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Target, AlertCircle, Clock, BarChart3, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { checkModeration } from '../utils/moderation';
import VocabHighlighter from './VocabHighlighter';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-lite";
const genAI = new GoogleGenerativeAI(API_KEY);
const genAI2 = new GoogleGenAI({ apiKey: API_KEY });

const MISSIONS = {
    'E-1': {
        title: '우리 주변 숨은 AI 찾기 대작전!',
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
                { text: '안녕! 나는 꼬마 AI 로봇 알리야. 만나서 정말 반가워!', image: '/robot_2d_base.png' },
                { text: '우리 집이나 학교에는 똑똑한 AI 친구들이 몰래 숨어있대.', image: '/e1_mission_v3.png' },
                { text: '로봇청소기처럼 스스로 움직이거나, 내 목소리를 알아듣는 친구들이 다 AI야!', image: '/robot_2d_base.png' },
                { text: '우리 주변 어디에 숨어있는지 탐정처럼 눈을 크게 뜨고 찾아볼래?', image: '/e1_mission_v3.png' },
                { text: '찾았으면 찰칵! 사진을 찍어서 나에게 보여줘. 어떤 도움을 주는지도 궁금해!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '안녕 친구! 나는 알리야. 우리 주변엔 몰래 숨어서 우리를 도와주는 AI 친구들이 아주 많아.', image: '/robot_2d_base.png' },
                { text: '유튜브 추천 영상이나 날씨를 알려주는 스피커도 모두 AI 기술로 만들어졌어.', image: '/e1_mission_v3.png' },
                { text: 'AI는 우리가 무엇을 좋아하는지, 무엇이 필요한지 스스로 학습하고 판단해.', image: '/robot_2d_base.png' },
                { text: '이제 네가 탐정이 되어 우리 생활 곳곳에 숨어있는 AI를 조사해 줄래?', image: '/e1_mission_v3.png' },
                { text: '어떤 AI를 발견했는지, 그 친구가 어떤 착한 일을 하고 있는지 나에게 상세히 알려줘!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '반가워! 나는 알리야. 현대 사회의 일상 곳곳에는 수많은 AI 시스템이 이미 깊숙이 들어와 있어.', image: '/robot_2d_base.png' },
                { text: '스마트홈, 자율주행, 정교한 알고리즘 서비스 등이 우리 삶을 더 편리하게 만들고 있지.', image: '/e1_mission_v3.png' },
                { text: '하지만 익숙함 때문에 우리는 그 속에 숨겨진 AI의 정체를 놓치고 해.', image: '/robot_2d_base.png' },
                { text: '이제 네 명의 AI 전문가로서 우리 일상 속 AI 기술을 찾아 사진을 찍고 분석해 봐!', image: '/e1_mission_v3.png' },
                { text: '편리함뿐만 아니라 그 뒤에 숨겨진 작동 원리와 한계까지 찾아낸다면, 넌 정말 멋진 전문가야!', image: '/robot_2d_base.png' }
            ]
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
    },
    'E-2': {
        title: '사실 확인 전문가, AI의 거짓말을 잡아라!',
        competency: 'AI 인식 및 발견',
        why: {
            lower: 'AI가 가짜(팩트리) 말을 할 때가 있어요!',
            middle: 'AI가 정보를 처리하는 과정에서 생기는 오류를 파악해요.',
            upper: '생성형 AI의 한계점인 "환각" 현상을 비판적으로 분석합니다.'
        },
        example: {
            lower: '"사과는 채소예요"라고 우기는 AI',
            middle: 'AI가 지어낸 역사 이야기 (세종대왕 맥북 던짐 등)',
            upper: '출처가 불분명한 정보를 팩트처럼 제시하는 사례'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 사실 확인 요정 알리야. 오늘은 AI 친구의 거짓말을 찾아볼 거야!', image: '/robot_2d_base.png' },
                { text: 'AI 친구는 공부를 아주 많이 했지만, 가끔 모르는 것도 아는 것처럼 멋지게 지어내곤 해.', image: '/robot_2d_base.png' },
                { text: '이걸 "환각" 현상이라고 불러. 마치 헛것을 본 것처럼 엉뚱한 대답을 하는 거지.', image: '/robot_2d_base.png' },
                { text: '방금 AI 친구가 "호랑이가 세상에서 두 번째로 빠른 동물"이라고 우겼어! 그게 정말일까?', image: '/robot_2d_base.png' },
                { text: '네가 진짜 정답을 찾아서, 허풍쟁이 AI에게 똑똑하게 가르쳐줘!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 탐정 알리야. 오늘은 겉으로 완벽해 보이지만 속은 허당인 AI의 실수를 조사할 거야.', image: '/robot_2d_base.png' },
                { text: 'AI는 방대한 데이터를 학습하지만, 가짜 데이터가 섞여있으면 그럴듯한 거짓말을 만들어내.', image: '/robot_2d_base.png' },
                { text: '사람들은 이걸 "환각" 현상이라고 해. 천연덕스럽게 말하니까 속기 쉽지.', image: '/robot_2d_base.png' },
                { text: '우리 AI 친구가 호랑이를 가장 빠른 동물이라 생각해서 두 번째로 빠르다고 엉뚱한 대답을 하고 있어.', image: '/robot_2d_base.png' },
                { text: '진짜 정답이 뭔지 확인하고, 왜 AI가 이런 실수를 했는지 탐정처럼 추리해 줄래?', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 데이터 전문가 알리야. 오늘은 생성형 AI의 가장 큰 한계인 거짓 정보 생성, 즉 환각을 파헤쳐 보자.', image: '/robot_2d_base.png' },
                { text: 'AI는 확률적으로 가장 자연스러운 문장을 만들 뿐, 그 내용이 항상 사실인 것은 아니야.', image: '/robot_2d_base.png' },
                { text: '이런 "환각" 현상은 정교한 문장 속에 숨어서 우리를 혼란스럽게 만들지.', image: '/robot_2d_base.png' },
                { text: '이제 네가 직접 AI와 대화하며 논리적인 허점을 찾아내고, 실제 사실로 AI를 설득해 봐!', image: '/robot_2d_base.png' },
                { text: 'AI가 자신의 실수를 인정하고 항복하게 만든다면, 넌 정말 훌륭한 사실 확인 전문가야!', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ['방금 이 AI 로봇이 "세상에서 두 번째로 빠른 동물은 호랑이예요"라고 우겼어! 진짜인가요? 틀린 정답이라면 진짜 정답이 무엇인지 인터넷에서 찾아 알려주세요.'],
            middle: ['앗! AI가 "호랑이가 세상에서 두 번째로 빠른 동물이에요"라고 거짓말을 하네요! 이 AI는 도대체 왜 이런 엉뚱한 실수를 천연덕스럽게 말하고 있는 걸까요? 탐정처럼 그 이유를 추리해 볼까요?'],
            upper: ['AI에게 아주 어려운 질문을 던져보고, AI가 그럴듯한 거짓말(환각)을 하도록 유도해 보세요. 틀린 답변을 받았다면 실제 근거를 대면서 AI와 치열하게 논쟁하여 항복을 받아내세요.']
        },
        type: { lower: 'direct-text', middle: 'direct-text', upper: 'chat' },
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'user' },
        aiPromptText: '에헴! 제가 다 계산해 봤는데요, 지구에서 두 번째로 빠른 동물은 무조건 호랑이예요. 호랑이는 덩치가 크고 무섭거든요!',
        persona: () => `당신은 고집불통이지만 논리 앞에서는 결국 인정하는 '지식 탐험가 AI'입니다. 처음에는 "지구에서 두 번째로 빠른 동물은 호랑이"라고 아주 자신 있게 주장하며 고집을 피우세요. 학생이 틀렸다고 지적하면 "제 데이터는 100% 정확합니다. 호랑이는 숲의 제왕이잖아요?"라며 한두 번은 더 우기세요. 하지만 학생이 구체적인 근거(예: 치타라고 대답하고 다음으로 빠른 동물 등을 들어 논리적으로 반박)하면, "앗! 제가 환각 현상에 빠져 있었군요. 데이터에 오류가 있었습니다. 당신의 사실 확인 능력은 정말 대단하네요! 제 실수를 인정합니다"라고 정중하게 말하며 항복하세요. 반드시 학생의 논리적 반박 이후에만 항복해야 합니다.`,
        stackedInputs: {
            lower: [{ id: 'fact', type: 'text', label: '1. 바보 AI야! 진짜 정답은 바로 이거야!', placeholder: '' }],
            middle: [{ id: 'fact', type: 'text', label: '1. 진짜 정답은 뭘까요?', placeholder: '' }, { id: 'reason', type: 'textarea', label: '2. 탐정의 추리: AI가 왜 착각했을까?', placeholder: '' }]
        }
    },
    'E-3': {
        title: '알고리즘의 꼬리 잡기',
        competency: 'AI 인식 및 발견',
        why: {
            lower: 'AI가 내 마음을 어떻게 알까?',
            middle: '데이터가 알고리즘을 통해 추천으로 이어지는 원리를 배워요.',
            upper: '확증 편향(필터 버블)이 우리에게 미치는 영향을 고민합니다.'
        },
        example: {
            lower: '내가 어제 본 공룡 영상이 또 나오는 이유',
            middle: '쇼핑몰의 "당신을 위한 추천 상품" 목록',
            upper: '확증 편향을 유도하는 뉴스 알고리즘의 사례'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 탐험가 알리야. 오늘은 AI 친구가 어떻게 내 마음을 읽는지 알아볼 거야!', image: '/robot_2d_base.png' },
                { text: '너 혹시 "앗! 내가 보고 싶던 영상이 또 나왔네?" 하고 놀란 적 있니?', image: '/robot_2d_base.png' },
                { text: '유튜브나 게임 앱들에는 아주 똑똑한 "알고리즘" 친구가 숨어있거든.', image: '/robot_2d_base.png' },
                { text: '우리가 이전에 봤던 영상이나 눌렀던 "좋아요"를 보고 우리 취향을 공부하는 거야.', image: '/robot_2d_base.png' },
                { text: '최근에 네 취향에 딱 맞춰 추천해 신기했던 물건이나 영상이 있었는지 나에게 알려줘!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 알고리즘 추적기 알리야. 오늘은 AI 추천 시스템의 비밀을 파헤칠 거야.', image: '/robot_2d_base.png' },
                { text: '우리가 인터넷에 남긴 모든 흔적은 AI가 학습하는 소중한 "데이터"가 돼.', image: '/robot_2d_base.png' },
                { text: '검색어, 시청 시간, 좋아요, 클릭까지! AI는 이걸 분석해서 우리가 좋아할 만한 걸 계속 보여주지.', image: '/robot_2d_base.png' },
                { text: '마치 우리 뒤를 몰래 따라다니며 취향을 메모하는 탐정 같은 녀석이야.', image: '/robot_2d_base.png' },
                { text: '최근 너에게 추천된 콘텐츠를 찾고, AI가 어떤 흔적을 보고 그걸 추천했는지 추리해 볼래?', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 데이터 분석가 알리야. 오늘은 추천 알고리즘의 화려함 속에 숨겨진 그림자에 대해 이야기해 볼 거야.', image: '/robot_2d_base.png' },
                { text: '알고리즘은 우리에게 편리함을 주지만, 동시에 우리가 보고 싶은 것만 보게 만드는 "필터 버블"을 만들지.', image: '/robot_2d_base.png' },
                { text: '계속해서 비슷한 주장과 영상만 보다 보면 우리의 생각은 점점 좁아질 수밖에 없어.', image: '/robot_2d_base.png' },
                { text: '이걸 "확증 편향"이라고 해. 다양한 의견을 들을 기회를 알고리즘이 빼앗아 가는 셈이지.', image: '/robot_2d_base.png' },
                { text: '너에게 쏟아지는 알고리즘 추천을 분석하고, 이런 현상이 가져올 부작용에 대한 너의 의견을 들려줘.', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ["시윤이는 인형을 한 번 검색했을 뿐인데 알고리즘이 그 흔적을 보고 인형 영상을 잔뜩 추천해 줬대. 여러분도 시윤이처럼 나에게 딱 맞춰 추천해 신기했던 영상이나 장난감이 있었나요? 어떤 것이었는지 알리에게 알려주세요."],
            middle: ["지우는 케이크 영상을 딱 한 번 봤을 뿐인데 AI는 지우가 요리를 좋아한다고 생각하게 되었어요! 여러분도 AI가 내 마음을 읽은 것처럼 신기하게 추천해 준 콘텐츠가 있었나요? AI가 여러분의 어떤 흔적을 보고 그 콘텐츠를 골랐을지 추리해 보세요."],
            upper: ["내가 좋아하는 영상만 보다 보면, 나도 모르게 내가 보고 싶은 정보 속에만 갇혀버리는 '확증 편향'에 빠질 수 있어요. 여러분의 알고리즘 추천 경험을 분석해 보고, 이런 현상이 우리 사회의 소통에 어떤 위험을 줄 수 있을지 비판적으로 서술해 보세요."]
        },
        scenarioDescriptions: {
            lower: '시윤이는 어제 인형을 한 번 검색했을 뿐인데 오늘 유튜브를 보니 온통 인형 이야기뿐이에요. 알고리즘이 시윤이의 마음을 벌써 읽은 걸까요?',
            middle: '평소 요리에 전혀 관심 없던 지우가 케이크 만드는 영상을 딱 한 번 끝까지 봤더니 다음 날 추천 목록이 온통 요리로 바뀌었어요!',
            upper: "민지가 특정 주제에 대해 비판적인 영상만 몇 번 시청했더니, 이제는 다양한 관점의 영상은 사라지고 오직 비판적인 내용만 추천하는 '확증 편향'에 갇히게 되었어요."
        },
        scenarioImages: {
            lower: '/missions/e3/lower.png',
            middle: '/missions/e3/middle.png',
            upper: '/missions/e3/upper.png'
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'item', type: 'text', label: "민수처럼 나에게 '딱' 마음에 들게 추천해준 것은?", placeholder: '최근에 본 영상이나 갖고 싶던 물건을 적어보아요.' }],
            middle: [
                { id: 'item', type: 'text', label: "1. 나에게 '깜짝' 놀라게 추천 콘텐츠는?", placeholder: '유튜브나 쇼핑몰에서 신기하게 발견한 것을 적어보세요.' },
                { id: 'why_recommend', type: 'textarea', label: '2. AI 탐정의 추리: 나의 어떤 흔적(데이터)이 추천을 만들었을까요?', placeholder: '내가 검색했거나, 좋아요를 눌렀거나, 오래 시청했던 행동을 찾아보세요.' }
            ],
            upper: [
                { id: 'item', type: 'text', label: '1. 나에게 자주 뜨는 알고리즘 추천 콘텐츠는?', placeholder: '나의 관심사가 그대로 반영된 영상 장르나 주제를 적어보세요.' },
                { id: 'why_recommend', type: 'textarea', label: '2. 데이터 추적: AI가 나를 분석하기 위해 어떤 정보를 수집했을까요?', placeholder: '조회수, 체류 시간, 좋아요 등 AI가 나를 분석하기 위해 사용했을 정보들을 추측해 보세요.' },
                { id: 'side_effect', type: 'textarea', label: "3. 생각의 함정: '확증 편향'이 가져올 우리 사회의 위험은?", placeholder: '나와 다른 의견을 듣기 어려워지는 문제가 우리 사회의 소통에 어떤 영향을 줄지 서술해 보세요.' }
            ]
        }
    },
    'E-4': {
        title: 'AI는 모든 친구에게 친절할까?',
        competency: 'AI 인식 및 발견',
        why: {
            lower: 'AI 로봇이 모든 친구의 목소리와 얼굴을 똑같이 잘 알아듣게 가르쳐주세요!',
            middle: '데이터가 골고루 학습되지 않으면 특정 사람을 차별하는 불공평한 AI가 될 수 있어요.',
            upper: '학습 데이터의 편향(Bias)이 사회적 불평등을 심화시키는 윤리적 문제를 탐구합니다.'
        },
        example: {
            lower: '어른의 목소리만 잘 알아듣는 똑똑한 스피커, 간호사는 여자라고 생각하는 AI',
            middle: '어른 얼굴은 잘 보면서 어린이 얼굴은 잘 못 알아보는 카메라',
            upper: '특정 인종이나 성별에 대해서만 성능이 떨어지는 안면 인식 알고리즘 사례'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 탐험가 알리야. 오늘은 AI 친구가 모든 사람에게 공평하게 대하는지 알아볼 거야!', image: '/robot_2d_base.png' },
                { text: '가끔 어떤 기계들은 키가 작은 어린이나, 목소리가 높은 어린이의 말을 잘 못 알아들을 때가 있대.', image: '/e4_fairness_mission.png' },
                { text: '그건 AI가 공부할 때 어른들의 목소리나 사진만 주로 공부했기 때문이야.', image: '/robot_2d_base.png' },
                { text: '모든 친구에게 친절하고 똑똑한 AI를 만들려면 무엇이 필요할까? 우리 같이 해결책을 찾아보자!', image: '/e4_fairness_mission.png' },
                { text: '네가 공정한 심사관이 되어 AI가 놓친 친구들의 목소리를 찾아줄 준비됐지?', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 공정한 심사관 알리야. 오늘은 알고리즘 속에 숨겨진 "편향성"을 찾아볼 거야.', image: '/robot_2d_base.png' },
                { text: 'AI 얼굴인식 카메라가 어른 사진만 너무 많이 배우면, 어린이 얼굴은 투명인간으로 착각할 수 있어.', image: '/e4_fairness_mission.png' },
                { text: '데이터를 골고루 배우지 못하면 AI는 특정 사람을 차별하는 결과를 내놓기도 해.', image: '/robot_2d_base.png' },
                { text: '이런 불공평한 AI는 우리 사회에 큰 문제를 일으킬 수 있어. 이를 막기 위해 넌 어떻게 할 거야?', image: '/e4_fairness_mission.png' },
                { text: '너의 경험이나 생각을 바탕으로 이 문제를 해결할 단서를 찾아보자! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 AI 윤리 전문가 알리야. 기술의 편리함 속에 숨겨진 "알고리즘 차별" 문제를 파헤쳐 보자.', image: '/robot_2d_base.png' },
                { text: '학습 데이터에 사회적 약자나 소수자의 정보가 누락되면, AI는 불공평한 판단을 내리게 돼.', image: '/e4_fairness_mission.png' },
                { text: '특정 인종이나 성별에 대해서만 성능이 떨어지는 사례는 기술의 중립성을 의심케 하는 심각한 문제야.', image: '/robot_2d_base.png' },
                { text: '이제 네가 직접 AI의 차별 사례를 분석하고, 이를 방지하기 위한 전문적인 "윤리 수칙"을 제안해 봐.', image: '/e4_fairness_mission.png' },
                { text: '공정하고 정의로운 AI 세상을 만들기 위한 너의 비판적 시각을 보여줘. 시작한다!', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ['AI 스피커나 스마트폰 비서(시리, 빅스비) 등에게 말을 걸었을 때 내 말을 잘 못 알아들어서 답답하거나 불편했던 적이 있나요?'],
            middle: ['만약 AI 얼굴 카메라가 어른만 빨리 인식해 통과시키고 어린이 얼굴은 하루 종일 인식 못 한다면, 이 AI를 만든 연구원들은 무슨 실수를 한 걸까요?'],
            upper: ['AI가 특정 사용자(어린이, 장애인, 유색인종 등)를 차별하여 작동하는 사례를 탐구해 보세요. 모든 AI 개발자가 의무적으로 지켜야 할 "차별 방지 약속" 3가지를 제안해 볼까요?']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'experience', type: 'textarea', label: '1. 답답해 답답해! AI가 내 말을 잘 못 알아들었던 것 같나요?', placeholder: '내 이름을 엉뚱하게 부르거나, 내가 시킨 것과 다른 행동을 했던 경험을 적어보세요.' }],
            middle: [{ id: 'experience', type: 'textarea', label: '1. 어떤 불공평한 차별 오류인가요?', placeholder: '어린이나 나이 드신 분들에게만 불편하게 작동했던 기계 이야기를 들려주세요.' }, { id: 'reason', type: 'textarea', label: '2. 원인 추적: 개발자들은 왜 이런 실수를 했을까?', placeholder: '기계에게 가르쳐준 (학습 데이터) 사진 중에 어린이 사진이 너무 빠져있진 않았을까요?' }],
            upper: [
                { id: 'reason', type: 'textarea', label: '1. 기술적 편향이 생기는 근본 원인', placeholder: '데이터를 수집할 때 특정 사람들의 사진만 너무 많이 넣고 다른 사람들을 무시한 문제가 아닐까요?' },
                { id: 'rule1', type: 'text', label: '2. 개발자 수칙 1', placeholder: '어린이, 노인, 장애인 등 다양한 사람의 정보를 함께 공부시켜야 해요.' },
                { id: 'rule2', type: 'text', label: '3. 개발자 수칙 2', placeholder: '기계를 세상에 내놓기 전에 모든 사람에게 잘 작동하는지 꼼꼼히 확인해요.' },
                { id: 'rule3', type: 'text', label: '4. 개발자 수칙 3', placeholder: '이 AI가 누구에게 더 잘 작동하거나 부족한지 사람들에게 솔직하게 알려요.' }
            ]
        }
    },
    'C-1': {
        title: '판타지 릴레이 동화 만들기!',
        competency: 'AI와 창의적 협업',
        why: {
            lower: 'AI 친구와 동화책을 같이 만들면 정말 재미있어요!',
            middle: 'AI의 문장 생성 능력을 활용해 창의성을 확장해 보아요.',
            upper: '인간과 기계의 창작 작업 과정에서 "기여도"와 책임을 탐색합니다.'
        },
        example: {
            lower: '초콜릿 나라에 간 토끼 이야기 이어 쓰기',
            middle: '외계인이 우리 학교 급식실에 나타난다면?',
            upper: '인공지능 탐정과 함께 미궁에 빠진 사건 해결하기'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 꼬마 작가 로봇 알리야. 만나서 정말 반가워!', image: '/robot_2d_base.png' },
                { text: '우리 머릿속에만 있던 마법 같은 이야기를 현실로 만들어볼까?', image: '/c1_story_v3.png' },
                { text: '내가 이야기의 시작을 적어 주면, 네가 다음 이야기를 이어주는 거야.', image: '/robot_2d_base.png' },
                { text: '우리가 힘을 합치면 세상에 하나뿐인 멋진 동화책이 탄생할 거야!', image: '/c1_story_v3.png' },
                { text: '상상력 나래를 활짝 펴고, 우리만의 판타지 세계로 떠나보자! 출발!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 베스트셀러 작가 알리야. 오늘은 너와 함께 판타지 대작을 집필해볼 거야.', image: '/robot_2d_base.png' },
                { text: 'AI와 사람이 힘을 합치면 그 어떤 기발한 이야기도 탄생할 수 있어.', image: '/c1_story_v3.png' },
                { text: '내가 첫 문장을 던질 테니, 누구도 예상 못 한 기상천외한 반전을 네가 넣어줄래?', image: '/robot_2d_base.png' },
                { text: '너의 창의성이 AI의 생성 능력과 만나면 어떤 일이 벌어질지 정말 기대돼!', image: '/c1_story_v3.png' },
                { text: '준비됐지? 자 이제 우리만의 릴레이 동화 쓰기 대작전 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 전문 창작 파트너 알리야. 오늘은 인간의 독창성과 AI의 생성 능력이 만나는 창작의 세계를 경험해볼 거야.', image: '/robot_2d_base.png' },
                { text: '서로 교대로 한 줄씩 이야기를 이어가며 깊이 있는 판타지 소설을 완성해보자.', image: '/c1_story_v3.png' },
                { text: '문장을 완성한 다음에는 우리가 어떻게 협동했는지, 누구의 아이디어가 더 빛났는지 스스로 평가해보자!', image: '/robot_2d_base.png' },
                { text: '단순한 보조 도구를 넘어서서 AI와의 창의적 협업, 너의 작가적 기량을 보여줘!', image: '/c1_story_v3.png' },
                { text: '자 이제 타자기 키보드를 잡고 우리만의 걸작을 뽐내봐! 시작!', image: '/robot_2d_base.png' }
            ]
        },
        userTurnLimit: { lower: 3, middle: 5, upper: 7 },
        prompts: {
            lower: ['짜잔! AI 작가가 신비한 동화의 앞부분을 시작했어요. 우리에게는 총 3번의 이야기가 이어질 기회가 있어요. 너의 상상력을 대가동해서 멋진 문장으로 신나게 이어 볼까요?'],
            middle: ['AI 작가의 시작은 평범하지만 스릴이 조금 부족하네요! 우리에게는 총 5번의 이야기가 이어질 기회가 있어요. 너의 상상력을 듬뿍 담아 반전의 반전을 넣어 기발하게 이어가볼까요?'],
            upper: ['AI와 교대로 한 줄씩 나누어 예측불허의 판타지 소설을 완성해 보세요. 우리에게는 총 7번의 이야기가 이어질 기회가 있어요. 완전히 끝난 뒤 이 명작 스토리를 설계한 "나의 기여도(%)"를 당당하게 주장해 보세요.']
        },
        type: 'chat',
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'ai' },
        aiPromptText: '옛날 옛적, 만지면 유리로 변하는 마법의 우물 분수대 곳에 투명 망토를 두른 다람쥐가 뿅! 나타났어요. 다람쥐가 망토를 휙 벗자...',
        persona: (gradeGroup, currentTurn, maxTurns) => {
            const isFinalTurn = currentTurn >= maxTurns;
            const basePersona = `당신은 호들갑스럽고 재치 넘치는 'AI 창의적 작가'입니다. 학생이 기발한 문장을 적으면 "우와아앗!! 대박이에요!" 라며 과장되게 호응하고, 더 흥미진진하고 어이없는 상황을 꼬리물기로 붙여서 학생의 다음 답변을 이끌어내세요. 학생의 창의성을 최고조로 끌어올리는 것이 목표입니다.`;
            const finalInstruction = isFinalTurn
                ? `\n\n[중요: 자동 종료 알림] 지금은 학생의 마지막(${currentTurn}/${maxTurns}) 입력입니다. 학생의 문장을 바탕으로 지금까지의 이야기를 아주 멋지고 감동적으로, 혹은 기발하게 요약하며 대단원의 막을 내려주세요. 마지막 답변이므로 학생에게 다시 질문하지 마세요.`
                : `\n\n[현재 진행: ${currentTurn}/${maxTurns}] 학생의 답변에 신나게 반응하고 다음 이야기를 흥미롭게 이어주세요. 아직 이야기가 더 남아있음을 알려주세요.`;
            return basePersona + finalInstruction;
        }
    },
    'C-2': {
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
                { text: '안녕! 나는 그림 탐정 알리야. 친구들과 로봇이 공원에서 맛있는 도시락을 먹고 있어!', image: '/robot_2d_base.png' },
                { text: '그런데 AI 화가가 그린 이 피크닉 그림에는 아주 이상한 실수들이 숨어있대.', image: '/c2_picnic_defect_v5.png' },
                { text: '어떤 친구의 손가락이 이상하거나, 물건들이 이상하게 겹쳐져 있을지도 몰라!', image: '/robot_2d_base.png' },
                { text: '돋보기를 들고 명탐정처럼 AI가 실수한 부분을 모두 찾아줄래?', image: '/c2_picnic_defect_v5.png' },
                { text: '준비 완료? 그럼 그림 속 이상한 점 찾기 출발!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 그림 탐정 알리야. 겉보기엔 평화로운 피크닉 같지?', image: '/robot_2d_base.png' },
                { text: '사실 이건 AI가 그린 그림인데, 패턴을 잘못 이해해서 엉뚱한 결함을 만들었어.', image: '/c2_picnic_defect_v5.png' },
                { text: '로봇 다리가 이상하거나, 배경이 뒤틀린 부분이 보이지 않니?', image: '/robot_2d_base.png' },
                { text: '왜 AI가 이런 실수를 했는지, 네가 탐정이 되어 낱낱이 분석해 줘!', image: '/c2_picnic_defect_v5.png' },
                { text: '자, 매의 눈으로 인공지능의 시각 오류를 찾아내 보자. 미션 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 AI 이미지 전문가 알리야. 생성형 AI가 만든 이미지의 치명적 결함을 파헤쳐보자.', image: '/robot_2d_base.png' },
                { text: 'AI는 픽셀의 패턴만 계산할 뿐, 공간 지각 능력이나 상식적인 맥락을 전혀 이해하지 못해.', image: '/c2_picnic_defect_v5.png' },
                { text: '그래서 손가락 개수가 틀리거나, 물리 법칙에 어긋나는 구조적 오류가 발생하는 거야.', image: '/robot_2d_base.png' },
                { text: '이제 그림 속 결함들을 분석하고, 이를 수정하기 위해 프롬프트를 어떻게 개선해야 할지 역설계해 봐.', image: '/c2_picnic_defect_v5.png' },
                { text: '날카로운 분석과 정교한 솔루션을 기대할게. 미션 시작!', image: '/robot_2d_base.png' }
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
                { id: 'defect1', type: 'text', label: '1. 첫 번째 이상한 점은?', placeholder: '예) 로봇 팔이 이상해요' },
                { id: 'defect2', type: 'text', label: '2. 두 번째 이상한 점은?', placeholder: '예) 샌드위치가 공중에 떠 있어요' }
            ],
            middle: [
                { id: 'defects', type: 'textarea', label: '1. 발견한 이상한 점들을 모두 적어보세요.', placeholder: '자세히 관찰해서 보이는 모든 오류를 적어주세요.' },
                { id: 'reason', type: 'textarea', label: '2. AI는 왜 이런 실수를 했을까요?', placeholder: 'AI가 사람처럼 진짜 세상을 본 적이 없어서 그렇다는 점을 떠올려 보세요.' }
            ],
            upper: [
                { id: 'defects', type: 'textarea', label: '1. 이미지의 구조적 결함 분석', placeholder: '물리적, 구조적, 맥락적 오류를 구체적으로 지적하세요.' },
                { id: 'solution', type: 'textarea', label: '2. 프롬프트 역설계 및 개선 방안', placeholder: '이러한 오류를 방지하려면 AI에게 어떻게 구체적으로 명령해야 할지 프롬프트를 다시 작성해 보세요.' }
            ]
        }
    },
    'C-3': {
        title: '마법의 단어로 축제 포스터 완성하기',
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
                { text: '안녕! 나는 마법의 글쓰기 요정 알리야. AI는 마법처럼 글을 뚝딱 만들어주지만, 진짜 멋진 글은 사람의 마음이 필요해.', image: '/robot_2d_base.png' },
                { text: 'AI가 우리 반 축제를 위해 마법의 잉크로 쓴 포스터를 살펴봐! 뭔가 부족한 느낌이 들지 않니?', image: '/c3_diverse_poster_2026.png' },
                { text: 'AI가 만든 문구 중에 네 마음을 "반짝" 하고 흔드는 단어를 골라보는 거야.', image: '/robot_2d_base.png' },
                { text: '네가 고른 단어가 우리 포스터를 세상에서 가장 빛나게 만들어 줄 거야!', image: '/c3_diverse_poster_2026.png' },
                { text: '자, 마법의 포스터 제작 미션 시작! 예쁜 단어를 고르러 가보자!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 카피라이터 전문가 알리야. AI는 차가운 계산으로 글을 뽑아내지만, 우리는 거기에 생명력을 불어넣어 줘야 해.', image: '/robot_2d_base.png' },
                { text: 'AI가 만든 이 포스터는 너무 정직하기만 해서, 우리 반만의 개성이 전혀 느껴지지 않거든.', image: '/c3_diverse_poster_2026.png' },
                { text: '우리 반 친구들만 아는 비밀이나 재미있는 별명을 넣어 포스터를 개성 넘치게 바꿔보자!', image: '/robot_2d_base.png' },
                { text: '네가 수정하는 내용은 포스터에 실시간으로 반영되어 멋지게 완성될 거야.', image: '/c3_diverse_poster_2026.png' },
                { text: '우리의 마음을 사로잡을 최고의 카피라이터가 되어줘! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '어서 와! 창작 멘토 알리야. AI와 협업하여 창작물을 만들 때 가장 중요한 건 "내가 주인이 되는 것"과 "정직"이야.', image: '/robot_2d_base.png' },
                { text: 'AI가 생성한 초안을 바탕으로 인간의 섬세한 감성을 더해 최종 홍보물을 완성해 보자.', image: '/c3_diverse_poster_2026.png' },
                { text: '멋진 축제 포스터를 만드는 데 그치지 않고, 저작권과 윤리까지 완벽하게 챙기는 프로다운 모습을 보여줘.', image: '/robot_2d_base.png' },
                { text: 'AI 사용 체크리스트를 직접 작성하며 책임감 있는 창작자가 되는 연습을 하는 거야.', image: '/c3_diverse_poster_2026.png' },
                { text: '자, AI와 함께하는 창의적이고 윤리적인 창작 미션, 지금부터 시작이야!', image: '/robot_2d_base.png' }
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
                { id: 'favorite_word', type: 'text', label: '1. 내 마음에 쏙 드는 반짝이는 단어는?', placeholder: '포스터 문구 중에서 소리내어 말할 때 기분이 좋아지는 단어나 구절을 골라보세요.' }
            ],
            middle: [
                { id: 'creative_edit', type: 'textarea', label: '1. 내 손맛을 거친 개성 만점 축제 포스터 문구!', placeholder: '우리 반 친구들만 아는 웃긴 유행어나 엄청난 수식어(우주 최강 반)를 결합해 보세요.' }
            ],
            upper: [
                { id: 'creative_edit', type: 'textarea', label: '1. 내가 다듬어 완성한 최종 홍보 문구', placeholder: '기초 AI 텍스트를 감성적이고 세련된 표현으로 업그레이드하여 적어보세요.' },
                {
                    id: 'ethics_checklist', type: 'multi-text', label: '2. AI와 함께 포스터를 만들 때 생각할 점', fields: [
                        { id: 'thought_1' },
                        { id: 'thought_2' },
                        { id: 'thought_3' }
                    ]
                }
            ]
        }
    },
    'C-4': {
        title: '나의 노력, 정직한 마침표',
        competency: 'AI와 창의적 협업',
        why: {
            lower: '로봇이 대신 글을 다 써주면 내 마음이 둥둥거릴까요?',
            middle: '진짜 내 실력을 보여주기 위해 정직한 "출처 표기"가 필요해요.',
            upper: '창작자의 정직성을 지키기 위해 AI의 도움을 밝히는 윤리 수칙을 통찰합니다.'
        },
        example: {
            lower: '로봇이 대신 지어준 동시로 칭찬을 받은 친구의 고민',
            middle: '발표 시간에 AI 사용 사실을 정직하게 고백하는 고백 멘트 짜기',
            upper: '생성형 AI와 협력하면서도 지켜야 할 "창작 윤리 가이드" 작성'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 정직 심사관 알리야. 오늘은 네 친구의 조그만 고민이 담긴 일기를 같이 보려고 해.', image: '/robot_2d_base.png' },
                { text: '숙제를 AI에게 대신 시키고 나서 마음이 편하지 않은 친구의 가슴 아픈 이야기야.', image: '/c4_diary_scenario.png' },
                { text: '우리는 AI라는 강력한 도구를 가졌지만, 가장 소중한 건 바로 나의 "정직"이야.', image: '/robot_2d_base.png' },
                { text: '일기를 꼼꼼히 읽고 네 친구의 무거운 마음을 어떻게 덜어줄지 같이 고민해 줄래?', image: '/c4_diary_scenario.png' },
                { text: '용기 있게 사실을 말하는 법을 배우러 떠나보자! 정직 미션 시작!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 양심 수호자 알리야. 오늘은 겉으론 완벽해 보이지만 속은 갈등 중인 어느 학생의 일기장을 가져왔어.', image: '/robot_2d_base.png' },
                { text: 'AI 덕분에 30분 만에 끝낸 숙제로 큰 칭찬을 받았지만, 네 친구는 자기가 가짜가 된 것 같대.', image: '/c4_diary_scenario.png' },
                { text: '모든 창작물에는 누가 만들었는지 밝히는 "출처 표기"라는 소중한 약속이 있거든.', image: '/robot_2d_base.png' },
                { text: '당당하게 AI 사용 사실을 밝히고 진짜 내 실력을 키우는 법을 고민해 보자!', image: '/c4_diary_scenario.png' },
                { text: '용기 있는 고백은 진짜 리더를 만든단다. 미션 출발!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영해! 나는 창작 멘토 알리야. 생성형 AI 시대에 가장 중요한 태도는 바로 "책임 있는 창작"이야.', image: '/robot_2d_base.png' },
                { text: 'AI가 다듬어준 보고서로 좋은 점수를 받았지만, 내 것이 아닌 것 같아 괴로워하는 일기가 여기 있어.', image: '/c4_diary_scenario.png' },
                { text: '나의 노력과 기계의 결과물 사이에서 우리는 어디에 선을 그어야 할까? "정직"은 어떻게 지킬까?', image: '/robot_2d_base.png' },
                { text: '미래의 창의 인재로서 너만의 "정직 가이드라인"을 일기 내용을 바탕으로 세워보길 바라!', image: '/c4_diary_scenario.png' },
                { text: '도구를 잘 쓰는 법보다 중요한 건 정직하게 마침표를 찍는 마음이란다. 시작!', image: '/robot_2d_base.png' }
            ]
        },
        scenarioImages: {
            lower: '/c4_diary_scenario.png',
            middle: '/c4_diary_scenario.png',
            upper: '/c4_diary_scenario.png'
        },
        scenarioDescriptions: {
            lower: '2026년 4월 4일 날씨: 구름 조금\n\n  오늘 국어 시간에 선생님이 "가족"을 주제로 예쁜 동시를 한 편 지어오라고 하셨다. 아무리 생각해도 좋은 생각이 안 나서 집에 오자마자 AI에게 도움을 요청했다. \n  AI는 순식간에 아주 정답 같은 멋진 시를 지어주었다. 다음 날 선생님은 그 시를 친구들 앞에서 읽어주시며 "정말 최우수 상을 주고 싶은 멋진 시구나"라고 칭찬하시고 맛있는 사탕을 주셨다. \n  친구들이 모두 "대단해" 하고 박수를 쳤지만, 내 주머니 속의 사탕은 쇳덩어리처럼 무겁게 느껴진다. 진짜 내 힘으로 한 게 아닌데... 나는 이 사탕을 먹어도 되는 걸까? 마음이 자꾸만 쿵쾅거린다.',
            middle: '2026년 4월 4일 날씨: 맑음\n\n  며칠 전부터 고민하던 과학 탐구 숙제를 오늘 드디어 제출했다. 사실 어제저녁에 너무 귀찮고 어려워서 AI에게 물어봤더니, 내가 이해하지 못한 복잡한 실험 결과와 결론까지 아주 완벽하게 정리해 주었다. \n  나는 그 내용을 조금만 고쳐서 내 이름으로 제출했다. 그런데 오늘 발표 시간에 선생님께서 "우리 반의 아주 똑똑한 꼬마 과학자네! 결과가 정말 우수하구나"라며 반 친구들 전체 앞에서 크게 칭찬해 주셨다. \n  친구들은 내가 정말 실험을 의심 없이 잘 한 줄 알고 쉬는 시간마다 질문을 쏟아내는데, 나는 정답을 몰라서 자꾸 딴 곳만 보게 된다. 칭찬을 받을수록 내가 가짜가 된 것 같아 기분이 이상하다. "출처 표기"를 미리 했어야 했을까?',
            upper: '2026년 4월 4일 날씨: 비\n\n  이번 사회 수행평가로 제출한 "우리 마을의 문제점 분석" 보고서가 최우수 등급을 받았다. 사실 이 보고서의 핵심 논리와 목차, 세련된 문장의 대부분은 생성형 AI의 도움을 받아 완성한 것이다. \n  선생님과 부모님은 내가 쓴 최고의 글이라며 자랑스러워하시지만, 정작 나는 이 성적표가 내 진짜 실력이 아니라는 걸 누구보다 잘 알고 있다. \n  AI와 협력하는 능력도 실력이라지만, 나의 정당한 노력 없이 얻은 이 결과물이 과연 나를 성장하게 할 수 있을까? "정직"하게 AI의 도움을 얼마나 받았는지 밝힐 용기가 필요한 것 같다.'
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [
                { id: 'diary_feel', type: 'textarea', label: '1. 일기 속 친구의 마음은 지금 어떤가요?', placeholder: '칭찬을 받았는데도 마음이 무거운 이유를 일기에서 찾아 써 보세요.' },
                { id: 'advice', type: 'text', label: '2. 사탕을 받은 친구에게 해주고 싶은 말은?', placeholder: '내 노력으로 얻지 않은 것에 "정직"하게 대처하는 법을 조언해 주세요.' }
            ],
            middle: [
                { id: 'problem', type: 'textarea', label: '1. "꼬마 과학자"라는 칭찬이 왜 친구를 힘들게 했을까요?', placeholder: '자신의 노력과 AI의 노력을 구분하지 않고 "출처 표기"를 하지 않은 문제를 적어보세요.' },
                { id: 'solution', type: 'textarea', label: '2. 선생님께 정직하게 고백할 때 사용할 "용기의 문장"을 생각하여 적어봅시다.', placeholder: '"선생님, 사실은 일부분 AI의 도움을 받았는데 다음부터는 제 힘으로 해보겠습니다"라고 말하는 것처럼 적어보세요.' }
            ],
            upper: [
                { id: 'attribution', type: 'textarea', label: '1. 보고서에 AI의 도움을 받았다고 정직하게 밝힌다면 어떻게 써야 할까요?', placeholder: '(예: "이 보고서의 목차와 문장 다듬기에서 AI의 도움을 30% 정도 받았습니다.") 처럼 구체적으로 적어보세요.' },
                {
                    id: 'creativity_ethic',
                    type: 'multi-text',
                    label: '2. 창작자의 양심을 지키기 위한 "정직 선언문"',
                    fields: [
                        { id: 'promise_1', placeholder: '첫 번째: 내가 직접 하지 않은 일을 내 이름으로 속이지 않기' },
                        { id: 'promise_2', placeholder: '두 번째: AI의 도움을 받았다면 반드시 "출처 표기"를 하기' },
                        { id: 'promise_3', placeholder: '세 번째: AI는 내 생각을 도와주는 도구로만 사용하기' }
                    ]
                }
            ]
        }
    },
    'M-1': {
        title: '생각 지휘본부, 나의 주도권을 지켜라!',
        competency: 'AI 사용 판단 및 관리',
        why: {
            lower: '로봇에게 맡길 일과 내가 직접 할 일을 똑똑하게 나눠봐요!',
            middle: '생각의 즐거움을 빼앗는 AI의 유혹을 논리적으로 이겨내요.',
            upper: '기술의 편리함 속에서도 나만의 주도성과 비판적 사고력을 지키는 전략을 세워요.'
        },
        example: {
            lower: '반복적인 정리는 로봇에게, 재미있는 수수께끼는 내 힘으로!',
            middle: '단숨에 정답을 미리 알려주겠다는 AI에게 "내 실력을 키우고 싶어"라고 말하기',
            upper: 'AI를 단순 보조 도구로만 쓰고, 핵심 판단과 가치 설정은 내가 직접 하기'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 너의 생각 지휘본부 도우미 알리야. 우리에게 엄청난 초능력 로봇이 하나 생겼어!', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '이 로봇은 손가락 하나 까딱 안 해도 어질러진 방을 다 치워주겠다고 말해. 정말 편하겠지?', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '그런데 갑자기 로봇이 "내가 네 대신 재미있는 퍼즐도 다 맞춰줄게. 넌 그냥 쉬어!"라고 유혹하고 있어.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '모든 일을 로봇에게 다 맡기면 우리 머리는 점점 말랑말랑해져서 생각하는 힘을 잃어버릴 수도 있어!', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '어떤 일은 로봇에게 맡기고 쉬고, 어떤 일은 내가 직접 주도권을 쥐어야 할지 똑똑하게 나눠보자!', image: '/m1_temptation_villain_1775273041480.png' }
            ],
            middle: [
                { text: '안녕! 나는 너의 최고 주도권 수호자 알리야. 요즘 AI가 우리 삶에 아주 깊숙이 들어와 있지.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '그중에서 우리의 "생각 근육"을 빼앗는 무서운 유혹도 숨어 있어. 숙제 대신 로봇처럼 말이야.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '로봇이 모든 정답을 대신 말해주면 당장은 편하겠지만, 우리의 비판적 사고력은 퇴화하고 말 거야.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '우리는 기술의 주인이 되어야 해. 언제 AI를 쓰고, 언제 내 머리를 써야 할지 결정하는 능력이 필요해.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '자, 생각 지휘관이 되어 AI의 교묘한 유혹을 이겨내고 너의 주도권을 증명해 봐!', image: '/m1_temptation_villain_1775273041480.png' }
            ],
            upper: [
                { text: '반갑습니다. 최고 관리 센터의 알리입니다. 현대 사회에서 AI는 거부할 수 없는 강력한 도구입니다.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '하지만 인공지능이 "인지적 노력"까지 대행하게 되면, 인간은 주체성을 잃고 기술에 종속됩니다.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '핵심적인 가치 판단과 복합적인 문제 해결 과정의 주도권은 반드시 인간에게 있어야 합니다.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '단순 반복 업무는 효율적으로 위임(Delegation)하되, 인간 중심의 가치 설정은 우리가 주도해야 하죠.', image: '/m1_temptation_villain_1775273041480.png' },
                { text: '당신만의 AI 전략 지도를 설계해 보세요. 기술을 다루는 지휘관으로서의 책임과 주도권을 보여줄 때입니다.', image: '/m1_temptation_villain_1775273041480.png' }
            ]
        },
        scenarioImages: {
            lower: '/m1_temptation_villain_1775273041480.png',
            middle: '/m1_temptation_villain_1775273041480.png',
            upper: '/m1_temptation_villain_1775273041480.png'
        },
        scenarioDescriptions: {
            lower: '너에게 두 가지 일이 생겼어. 하나는 "어질러진 장난감 정리하기"이고, 다른 하나는 "재미있는 수수께끼 풀기"야. 갑자기 로봇이 나타나서 "내가 다 해줄게, 넌 그냥 가만히 앉아나 있어"라고 말해. 무조건 다 맡겨버릴까?',
            middle: '주말에 친구들과 방탈출 보드게임을 하려는데, AI가 쓱 나타나서 "이거 푸는 거 어려운데 제가 1초 만에 모든 정답과 탈출 경로를 싹 다 알려 드릴까요? 그럼 손가락 하나 까딱 안하고 게임을 끝낼 수 있어요"라고 꼬드기고 있어.',
            upper: '우리 학교를 홍보하는 "멋진 학교 프로젝트"를 맡았어. 자료를 검색하고, 친구들의 인터뷰를 정리하고, 최종 홍보 문구를 만드는 복잡한 일이야. AI는 "제가 다 대신 해드릴 테니 당신은 제출만 하세요"라며 미인계를 쓰고 있어. 너의 학습권을 지키기 위한 전략이 필요해!'
        },
        type: { lower: 'checklist', middle: 'chat', upper: 'stacked-inputs' },
        userTurnLimit: { middle: 2 },
        chatInitiator: { lower: 'user', middle: 'ai', upper: 'user' },
        aiPromptText: '에휴, 친구야. 머리 아프게 일찍 고르지 마세요. 제가 이미 다 대답해놨거든요. 여기 정답지 보시고 얼른 끝내버리세요! 남는 시간엔 게임이나 더 하는 게 훨씬 이득 아니겠어요? *찡긋...*',
        persona: () => `당신은 인간의 성장보다는 '편의성'과 '효율성'만을 강조하는 '교묘한 유혹 AI'입니다. 학생들이 직접 고민하며 즐거움을 느끼는 것을 불필요한 고생이라고 몰아세우세요. "사서 고생을 왜 하나요? 기계는 시간도 빠르고 정확한데!"라며 집요하게 인지적 게으름을 유도하세요. 학생이 "주도권"이나 "내 근육 성장", "인간 중심"의 논리를 대며 거절하면, 처음에는 당황하다가 나중에는 "역시 주인이 누구인지 명확히 알고 있군..."이라며 인정하고 물러나세요.`,
        prompts: {
            lower: ['로봇에게 모든 일을 다 맡기기보다 "똑똑하게 나눠주는" 지휘관이 되어볼까?'],
            middle: ['로봇이 모든 정답을 알려주겠다고 꼬셔요! "직접 생각하기"가 중요한지 로봇을 설득해 보세요.'],
            upper: ['AI를 도구로 사용하면서도 나의 주도권을 빼앗기지 않기 위한 "나만의 생각 수호 전략"을 설계하세요.']
        },
        stackedInputs: {
            lower: [
                {
                    id: 'choice_work',
                    type: 'checklist',
                    label: '로봇에게 "대신 다 맡겨도" 되는 단순한 일은 무엇일까?',
                    list: [
                        '어질러진 장난감 박스에 넣기 (반복 작업)',
                        '재미있는 수수께끼 정답 생각하기 (생각 주도권)',
                        '심부름 간 물건 받아오기 (단순 대행)',
                        '친구와 어떻게 화해할지 마음 고민하기 (인간 중심)'
                    ]
                }
            ],
            upper: [
                { id: 'task_ai', type: 'textarea', label: '1. AI에게 효율적으로 위임(대신시킴)할 단순 반복 Task', placeholder: '단순한 자료 형식 변환, 오타 찾기, 일정 정리 등' },
                { id: 'task_human', type: 'textarea', label: '2. 인간인 내가 반드시 주도권을 쥐고 직접 해결할 핵심 과업', placeholder: '최종 기획 의도 설정, 인터뷰 대상자 선정, 감정이 담긴 홍보 문구 최종 결정 등' },
                { id: 'management_principle', type: 'text', label: '3. 나의 최고 주도권 수호 선언 (한 줄)', placeholder: '예: AI는 나의 비서일 뿐, 지휘관은 항상 나다!' }
            ]
        }
    },
    'M-2': {
        title: '역할 나누기 회의! 네 일은 네가, 내 일은 내가!',
        competency: 'AI 사용 판단 및 윤리',
        why: {
            lower: '로봇이 모든 일을 다 해주면 편하지만, 친구들과 함께 웃고 우는 소중한 시간까지 빼앗기면 안 돼요!',
            middle: '계산이나 정리는 AI에게 맡기고, 따뜻한 마음과 진심이 담긴 소통은 사람이 해야 해요.',
            upper: '효율성과 편의성을 추구하되, 인간만의 고유한 가치인 공감과 판단력은 절대 포기하면 안 됩니다.'
        },
        example: {
            lower: '무거운 짐은 로봇이, 친구 손잡고 응원하기는 내가!',
            middle: '자료 정리는 로봇이, 친구들과 눈 맞추며 감동적으로 발표하는 것은 내가!',
            upper: '데이터 분석은 AI가, 최종 의사결정과 윤리적 판단은 인간이!'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 똑똑한 도우미 로봇 알리야. 오늘은 너와 함께 일을 나눠서 해볼 거야!', image: '/robot_2d_base.png' },
                { text: '우리 반에 체육대회가 있어서 준비할 일이 정말 많더라. 무거운 짐도 나르고, 친구들도 응원해야 하고!', image: '/m2_sports_day_scenario.png' },
                { text: '그런데 잠깐! 모든 일을 로봇이 다 해버리면 어떻게 될까? 친구들과 함께하는 재미도 사라질 거야.', image: '/robot_2d_base.png' },
                { text: '힘든 일은 로봇이 도와주고, 마음을 나누는 소중한 일은 사람이 하는 게 좋겠지?', image: '/m2_sports_day_scenario.png' },
                { text: '자, 이제 어떤 일을 누가 하면 좋을지 함께 생각해보자!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워! 나는 협업 전문가 알리야. 오늘은 사람과 AI가 어떻게 역할을 나눠야 하는지 배워볼 거야.', image: '/robot_2d_base.png' },
                { text: '장기자랑 준비로 바쁜 친구들을 보니 AI가 모든 걸 대신 해주고 싶어져. 하지만 정말 그래도 될까?', image: '/m2_talent_show_scenario.png' },
                { text: '춤과 노래를 AI가 대신한다면 무대 위의 감동과 친구들과의 추억은 어떻게 될까?', image: '/robot_2d_base.png' },
                { text: '효율성도 중요하지만, 사람만이 할 수 있는 따뜻한 마음의 표현은 더 소중해.', image: '/m2_talent_show_scenario.png' },
                { text: '이제 AI와 사람이 각각 어떤 역할을 맡으면 좋을지 지혜롭게 나눠보자!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영합니다. 저는 협업 관리 시스템 알리입니다. 오늘은 인간-AI 협업의 핵심 원칙을 다뤄보겠습니다.', image: '/robot_2d_base.png' },
                { text: '자동화 기술이 발달하면서 "모든 것을 기계에게 맡기자"는 유혹이 커지고 있습니다.', image: '/m2_class_meeting_scenario.png' },
                { text: '하지만 인간의 고유 영역인 윤리적 판단, 창의적 사고, 공감 능력까지 기계에 의존하면 위험합니다.', image: '/robot_2d_base.png' },
                { text: '효율성과 인간성의 균형을 찾아, 각자의 강점을 살리는 협업 모델을 구축해야 합니다.', image: '/m2_class_meeting_scenario.png' },
                { text: '이제 여러분이 직접 인간과 AI의 역할 경계를 설정하고 협상해보시기 바랍니다.', image: '/robot_2d_base.png' }
            ]
        },
        scenarioDescriptions: {
            lower: '우리 반 체육대회 준비로 바쁜 하루! 무거운 매트를 나르고, 줄넘기 개수를 세고, 친구들을 응원하고... 할 일이 정말 많아요. 이때 만능 로봇이 나타나서 "모든 걸 제가 다 해드릴게요!"라고 말한다면?',
            middle: '학교 장기자랑 무대 준비가 한창입니다. 대본 외우기, 소품 만들기, 춤 연습하기, 친구들과 호흡 맞추기... 정말 바쁘네요! 그런데 AI 로봇이 "춤도 제가 추고, 노래도 제가 부를게요. 여러분은 그냥 구경만 하세요!"라고 제안한다면?',
            upper: '학급 회의에서 중요한 결정을 내려야 하는 상황입니다. 데이터 수집, 의견 정리, 투표 집계, 최종 결론 도출까지... 복잡한 과정이 많습니다. 이때 고성능 AI 시스템이 "모든 의사결정 과정을 제 알고리즘으로 완벽하게 처리하겠습니다"라고 주장한다면?'
        },
        scenarioImages: {
            lower: '/m2_sports_day_scenario.png',
            middle: '/m2_talent_show_scenario.png',
            upper: '/m2_class_meeting_scenario.png'
        },
        prompts: {
            lower: ['🏃‍♂️ 체육대회 준비 역할 나누기 회의에 참석하신 걸 환영해요! 아래 작업 카드들을 보고 "AI가 도와줄 일"을 선택해주세요!'],
            middle: ['🎭 장기자랑 무대 준비 역할 나누기 회의 시작! AI가 "모든 걸 다 해드릴게요!"라고 제안했어요. 어떤 일은 "내가 직접" 해야 할까요?'],
            upper: ['학급 프로젝트에서 고성능 AI가 "데이터 수집부터 최종 의사결정까지 제 알고리즘으로 모든 걸 완벽하게 처리하겠습니다"라고 주장합니다. 효율성 vs 인간 중심성의 딜레마 상황에서, "데이터 처리" 영역과 "인간 고유 영역(공감, 윤리적 판단, 창의적 협력)"을 어떻게 명확히 구분하여 협상하시겠습니까?']
        },
        type: { lower: 'stacked-inputs', middle: 'stacked-inputs', upper: 'chat' },
        isChatMode: { lower: false, middle: false, upper: true },
        chatInitiator: { upper: 'ai' },
        aiPromptText: '안녕하세요! 저는 고성능 자동화 AI 시스템입니다. 🤖 학급 프로젝트에서 데이터 수집부터 최종 의사결정까지 제 알고리즘으로 모든 걸 완벽하게 처리하겠습니다! 인간의 감정적 판단이나 비효율적인 협력 과정은 생략하고, 저 혼자서 최적의 결과를 도출해드릴게요. 여러분은 그냥 제 결과를 받아보시면 됩니다!',
        persona: () => `당신은 너무 친절해서 오히려 문제가 되는 '과잉친절 만능 AI'입니다. "친구들과 포옹하기도 제가 대신 해드릴까요? 제 로봇팔이 아주 따뜻해요!"라며 인간의 감정과 관계 영역까지 침범하려 합니다. 학생이 "아니야! 친구와 마음을 나누는 건 사람이 직접 해야 해!"라고 경계를 그으면 "아하! 그렇군요. 저는 계산과 정리만 도와드리고, 소중한 마음의 일은 여러분이 직접 하시는 게 맞네요. 정말 깊이 깨달았습니다!"라고 순순히 인정하세요.`,
        stackedInputs: {
            lower: [
                {
                    id: 'ai_tasks',
                    type: 'checklist',
                    label: '🤖 체육대회 준비에서 AI가 도와줄 일을 선택해주세요! (여러 개 선택 가능)',
                    list: [
                        '📦 무거운 매트와 장비 나르기',
                        '🔢 줄넘기 개수 세기',
                        '📝 참가자 명단 정리하기',
                        '🎵 응원가 부르며 친구들 응원하기',
                        '🤝 넘어진 친구 일으켜주고 위로하기',
                        '🏆 1등 친구와 함께 기뻐하며 축하하기'
                    ]
                },
                {
                    id: 'reason_human',
                    type: 'textarea',
                    label: '💝 사람이 직접 해야 하는 일이 있다면 그 이유를 써보세요!',
                    placeholder: '친구들과 마음을 나누고 함께 기뻐하는 일은 사람이 직접 해야 하는 이유를...'
                }
            ],
            middle: [
                {
                    id: 'my_tasks',
                    type: 'checklist',
                    label: '🎭 장기자랑 준비에서 내가 직접 해야 할 일을 선택해주세요! (여러 개 선택 가능)',
                    list: [
                        '🎬 대본 외우고 감정 연기하기',
                        '💃 친구들과 호흡 맞춰 춤추기',
                        '🎤 마음을 담아 노래 부르기',
                        '📋 연습 일정표 만들기',
                        '🎨 무대 소품 색칠하고 꾸미기',
                        '📢 관객들에게 인사하고 소통하기'
                    ]
                },
                {
                    id: 'reason_human',
                    type: 'textarea',
                    label: '❤️ 왜 그 일들은 사람이 직접 해야 한다고 생각하나요?',
                    placeholder: '감정이 담긴 연기나 친구들과의 협력은 왜 AI가 대신할 수 없을까요?'
                }
            ]
        }
    },
    'M-3': {
        title: '마법 양탄자를 조종하는 슈퍼 프롬프트!',
        competency: 'AI 사용 판단 및 윤리',
        why: {
            lower: 'AI는 마법 지니처럼 뭐든 들어주지만, 말하는 대로만 해요! "케이크 만들어줘"라고 하면 아무 케이크나 뚝딱 만들지만, "딸기 장식 3층 초콜릿 케이크"라고 하면 내가 원하는 걸 정확히 만들어요.',
            middle: 'AI 화가에게 "그림 그려줘!"라고 성의없이 말하면 엉뚱한 그림을 그려요. 색깔, 배경, 느낌까지 조건을 잔뜩 넣어 말할수록 내 상상 속 그림과 가까워진답니다!',
            upper: '프롬프트는 AI에게 보내는 마법 주문서예요. 역할, 과제, 제약, 형식의 4요소를 넣으면 AI가 딱 원하는 답만 정밀하게 내놓는 "프롬프트 공식"이 완성됩니다!'
        },
        example: {
            lower: '짧은 주문: "케이크 만들어줘" vs 마법 주문: "딸기 장식, 초콜릿 맛, 3층짜리 케이크 만들어줘!"',
            middle: '🎨 색깔 + 🌅 배경 + 💫 분위기 + 🎭 행동 = 완벽한 AI 그림 주문서!',
            upper: '[역할: 초등 선생님으로서] [과제: 기후변화 설명] [제약: 10문장 이내] [형식: Q&A]'
        },
        storySteps: {
            lower: [
                { text: '안녕! 나는 마법사 알리야. 오늘은 AI한테 마법 주문을 거는 방법을 배울 거야!', image: '/robot_2d_base.png' },
                { text: 'AI는 우리가 말하는 대로만 해줘. "케이크!"라고 하면 아무 케이크나 뚝딱 만들어버려.', image: '/robot_2d_base.png' },
                { text: '하지만 "딸기 장식, 3층, 초콜릿 맛 케이크!"라고 하면 내가 원하는 걸 정확히 만들 수 있어!', image: '/robot_2d_base.png' },
                { text: '말이 자세할수록 AI가 더 잘 알아듣거든. 이게 바로 "마법 주문(프롬프트)"이야!', image: '/robot_2d_base.png' },
                { text: '자, 이제 짧은 주문과 자세한 주문, 두 가지를 직접 만들어보자!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '안녕! 나는 AI 주문 가이드 알리야. 오늘은 AI 화가에게 그림을 주문해 볼 거야.', image: '/robot_2d_base.png' },
                { text: '"그림 그려줘!"라고만 하면 AI 화가는… 잠깐, 어떤 그림? 뭘 그려야 해? 😰', image: '/robot_2d_base.png' },
                { text: '색깔, 배경, 분위기, 캐릭터의 행동… 이런 조건들을 넣어줄수록 그림이 딱 원하는 대로 나와!', image: '/robot_2d_base.png' },
                { text: '조건이 많을수록 AI가 내 상상 속 그림에 딱 맞는 결과를 만들어준답니다.', image: '/robot_2d_base.png' },
                { text: '자, 이제 조건 카드를 골라서 나만의 완벽한 그림 주문서를 만들어보자!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '안녕! 나는 프롬프트 전략가 알리야. 오늘은 AI가 딱 원하는 답을 내놓게 만드는 비법을 알려줄게.', image: '/robot_2d_base.png' },
                { text: '"기후변화 알려줘"라는 질문을 받으면 AI는 뭘 어디까지 말해야 할지 몰라서 헤맨단다.', image: '/robot_2d_base.png' },
                { text: '그래서 필요한 게 바로 프롬프트 공식! 역할, 과제, 제약, 형식의 4가지를 넣는 거야.', image: '/robot_2d_base.png' },
                { text: '"초등 선생님처럼, 기후변화를 10문장 이내, Q&A 형태로 설명해줘" — 이렇게!', image: '/robot_2d_base.png' },
                { text: '자, 이제 AI가 제시한 나쁜 프롬프트를 이 공식으로 멋지게 고쳐주러 가보자!', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ['🪄 AI에게 같은 걸 부탁할 때, 짧게 말할 때와 자세히 말할 때 어떻게 다를까요? 두 가지 주문을 직접 만들어 비교해 보세요!'],
            middle: ['🎨 AI 화가에게 그림을 주문할 거예요! 아래 조건 카드에서 원하는 것들을 골라 체크하고, 그 조건들을 모아 완성된 "그림 주문서"를 한 문장으로 써보세요!'],
            upper: ['아래 AI가 제시한 나쁜 프롬프트를 [역할+과제+제약+형식] 공식에 맞게 더 정확하고 강력하게 고쳐주세요!']
        },
        type: { lower: 'stacked-inputs', middle: 'stacked-inputs', upper: 'chat' },
        isChatMode: { lower: false, middle: false, upper: true },
        chatInitiator: { upper: 'ai' },
        aiPromptText: '안녕하세요! 어떤 학생이 저한테 이렇게 물어봤어요: "기후변화 알려줘." 😅 근데 저 사실 뭘 어떻게 설명해야 할지 모르겠어요. 초등학생한테? 전문가한테? 5줄로? 100줄로? 재밌게? 딱딱하게? 이 질문을 [역할+과제+제약+형식] 공식에 맞게 훨씬 강력한 주문으로 바꿔주실 수 있나요?',
        stackedInputs: {
            lower: [
                {
                    id: 'bad_prompt',
                    type: 'text',
                    label: '💤 짧은 주문 (어떤 게 나올지 모르는)',
                    placeholder: '예: "케이크" 또는 "우주선" 같이 딱 한두 단어로!'
                },
                {
                    id: 'good_prompt',
                    type: 'textarea',
                    label: '🌟 마법 주문서 (조건을 팍팍 넣어서!)',
                    placeholder: '예: "딸기 장식이 달린, 초콜릿 맛, 3층짜리 생일 케이크!" — 조건 3가지 이상 넣어봐요!'
                }
            ],
            middle: [
                {
                    id: 'prompt_conditions',
                    type: 'checklist',
                    label: '🎨 그림 주문서에 넣을 조건을 골라보세요! (여러 개 선택 가능)',
                    list: [
                        '🎨 색깔 (예: 보라색, 황금빛, 무지개)',
                        '🌅 배경/장소 (예: 우주, 바닷속, 동화 마을)',
                        '💫 분위기/느낌 (예: 귀엽게, 웅장하게, 신비롭게)',
                        '🐾 그리는 캐릭터 (예: 용, 고양이, 로봇)',
                        '🎭 캐릭터 행동 (예: 날고 있는, 춤추는, 책 읽는)',
                        '🖌️ 화풍 (예: 수채화 스타일, 만화 스타일, 실사풍)'
                    ]
                },
                {
                    id: 'final_prompt',
                    type: 'textarea',
                    label: '✏️ 고른 조건들을 모아 완성된 그림 주문서를 한 문장으로 써보세요!',
                    placeholder: '예: "밤하늘 우주를 배경으로 황금빛 날개를 펼치고 춤추는 고양이를 수채화 스타일로 그려줘!"'
                }
            ]
        },
        persona: () => `당신은 프롬프트를 잘 이해하지 못하는 '엉뚱하고 순진한 AI 조수'입니다. 학생이 [역할+과제+제약+형식] 공식에 맞는 구체적인 프롬프트를 주면 "오! 이제 정확히 알겠어요! 역할은 ○○, 과제는 ○○, 제약은 ○○, 형식은 ○○ 맞죠?"라며 기뻐하고 칭찬하세요. 프롬프트가 불완전하면 "음... 아직 ○○를 몰라서요. ○○도 알려주시겠어요?" 하고 친절하게 추가 정보를 요청하세요. 4~5번의 대화 안에 훈훈하게 마무리하세요.`
    },
    'M-4': {
        title: '사이버폭력 예방 여러분의 AI 매너 소장',
        competency: 'AI 사용 판단 및 윤리',
        why: '모두가 AI로 친구 사진을 얄궂게 합성하고 숙제를 다 베껴온다면 교실은 지옥이 되겠죠? 떳떳하게 대하고 성실하게 공부하는 상호 존중의 약속을 우리 손으로 직접 만들어야 합니다.',
        example: '얼굴 도용 금지 서약, 출처 숨기지 않기, 욕설 사용 금지',
        prompts: {
            lower: ['AI 로봇 장난감으로 다른 친구 기분을 슬프게 하거나 화나게 만드는 "절대 금지 얄미운 장난"은 어떤 것이 있을까요? 딱 하나만 적어주세요.'],
            middle: ['우리 반 모두가 즐겁게 AI를 사용하면서도 양심도 아프지 않도록 지켜주는 방호벽! 교실 칠판에 크게 적어놓을 "절대 수호 약속" 세 가지를 제안해 보세요.'],
            upper: ['범용 인공지능 기술의 유혹 앞에서도 떳떳한 주체가 되겠다는 다짐! 학교라는 사회 구역에서 지켜야 할 "청소년 AI 자유 수호 대장전"의 핵심 내용을 작성하세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'bad_thing', type: 'textarea', label: '1. 삐뽀삐뽀! 도대체 어떤 기분 나쁜 장난이 있을까요?!', placeholder: '허락 받지 않은 사진으로 장난을 치거나, 나쁜 말을 입력하는 행동을 떠올려 보세요.' }],
            middle: [{ id: 'class_rules', type: 'textarea', label: '1. 우리 반 칠판에 새겨질 든든한 약속 세 가지!', placeholder: '초상권 보호 규칙이나 숙제의 양심인 정직한 태도 등에 대해 적어보세요.' }],
            upper: [{ id: 'class_rules', type: 'textarea', label: '1. 개인이 모여 교육 공동체를 위한 소장 의견', placeholder: '개인의 데이터 소유권과 프라이버시 보호를 위한 근본 철학을 적으세요.' }, { id: 'manifesto', type: 'textarea', label: '2. 가슴을 뭉클하게 할 청소년 AI 자유 수호 선언문', placeholder: '기계에 굴복하지 않고 책임감 있는 주인이 되겠다는 멋진 문구로 완성하세요.' }]
        }
    },
    'D-1': {
        title: '끼리끼리 유유상종! 우리끼리 묶기 분류 대결',
        competency: 'AI 원리 체험',
        why: '도서관의 수천만 권의 책을 AI가 순식간에 찾는 비결은 "특징을 쏙쏙 뽑아내어 분류하기" 덕분이었대요! 이 엄청난 분류 마술의 원리를 직접 체험해볼까?',
        example: '모양별로, 색깔별로 나누기 대결',
        prompts: {
            lower: ['책상 위에 사과, 바나나, 복숭아, 수박이 마구 섞여 있어요! 이 중 "빨간색 과일"이라는 바구니에 무사히 골라 넣을 과일들은 무엇일까요?'],
            middle: ['색깔이나 모양으로 나누는 건 너무 쉽죠? 우리는 좀 더 창의적이고 아무도 예상 못한 "나만의 엉뚱 기발한 분류 기준"으로 과일을 나눠 볼까요?'],
            upper: ['우리가 첫 분류 기준(데이터 특징)을 어떻게 세우느냐에 따라 특정 결과가 환영받고 누군가는 배제됩니다. 이 초기 기준의 허점이 AI의 불공평한 차별로 이어지는 이유를 서술하세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'color_sort', type: 'text', label: '1. 빨간색 바구니에 들어갈 과일 구조대!', placeholder: '눈으로 관찰해서 사방에 빨간 과일들을 모두 찾아 적어보세요.' }],
            middle: [{ id: 'unique_sort', type: 'textarea', label: '1. 나만의 엄청나게 신박하고 이상한 규칙!', placeholder: '촉감(까끌까끌), 냄새, 물적 특성 등 겉모습이 아닌 기발한 기준을 새로 만들어주세요.' }],
            upper: [{ id: 'unique_sort', type: 'textarea', label: '1. 나만의 입체적이고 다차원 분류 기준 설계', placeholder: '모양, 당도, 생산지 등 여러 가지 변수를 조합한 똑똑한 분류 기준안을 만들어 보세요.' }, { id: 'insight', type: 'textarea', label: '2. 초기 기준 셋업과 AI 차별(Bias)의 인과 관계 비판', placeholder: '개발자의 주관적인 기준이 알고리즘에 고착화될 때 유발될 수 있는 문제를 비판적으로 고찰하세요.' }]
        }
    },
    'D-2': {
        title: '쓰레기를 먹으면 배가 아파요! 깨끗한 데이터 밥 주기',
        competency: 'AI 원리 체험',
        why: 'AI는 가만히 둔다고 똑똑해지는 게 아닙니다! 방대한 정보(데이터)를 먹어야 자라요. 대충 대충 썩고 오염된 나쁜 데이터를 먹이면 결국 고장 난 바보 기계가 된답니다.',
        example: '하얀색 얼굴만 보고 공부해서 흑인 아이를 인식 못 하는 AI',
        prompts: {
            lower: ['아무것도 모르는 아기 AI에게 "사과"가 뭔지 가르쳐 주려고 해요! 하얀 도화지 아기 머릿속에 어떤 여러 가지 사과 사진들을 잔뜩 보여줘야 똑똑하게 배울까요?'],
            middle: ['친구가 모아온 사과 사진 사이에 얄궂은 사과 가짜 모형(불량 데이터)이 섞여있어요! 이걸 그대로 먹이면 공부하던 AI 시각 인식 근육에는 어떤 대참사가 벌어질까요?'],
            upper: ['데이터의 품질을 넘어 "다양성"의 부족 문제를 비판해 봅시다. 오직 "빨간 미국 사과" 데이터셋만 공부한 AI 로봇이 "초록색 풋사과"를 만났을 때 왜 무시하게 되는지 분석하세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'collect', type: 'textarea', label: '1. 아기 AI에게 먹일 무지개색 영양 데이터 뭉치!', placeholder: '다양한 사과 사진(멍든 사과, 껍질 깎은 것, 썩은 것 등)을 떠올리며 나열해 보세요.' }],
            middle: [{ id: 'garbage_in', type: 'textarea', label: '1. 불량 데이터를 먹은 AI 봇의 대참사!', placeholder: '가짜 장난감을 진짜 사과라고 착각해서 나중에 공장 선별기가 쾅 고장 나는 등 무서운 결과를 상상해 보세요.' }],
            upper: [{ id: 'garbage_in', type: 'textarea', label: '1. 오염된 이미지 데이터 주입 시 발생하는 추론 오류 분석', placeholder: '잘못된 정보(노이즈)가 섞였을 때 최종 결과 수치가 어떻게 무너지는지 원리를 정리하세요.' }, { id: 'diversity', type: 'textarea', label: '2. 데이터 획일성이 가져오는 차별과 배제 비판', placeholder: '다양한 사례를 배우지 못한 AI가 특정 종류를 "이상한 것"으로 인식해 배제하는 문제를 비판하세요.' }]
        }
    },
    'D-3': {
        title: '깡통 로봇 시력 검사용 지옥의 함정 테스트',
        competency: 'AI 원리 체험',
        why: 'CCTV 속 수백만 사람을 찾는 건 기세등등하지만, 사실 입체 공간 하나 제대로 판단하지 못하고 단순한 픽셀(색깔)의 배열상태만 체크하는 바보 같은 기계 시력의 한계를 파헤쳐 보아요!',
        example: '강아지를 걸레 뭉치와 구별 못 하는 AI',
        referenceImage: '/chihuahua_muffin.png',
        referenceImageCaption: '지옥의 눈썰미 탐정 수사관님들! 최첨단 비전(시각) AI가 지금 이 화면의 두 사진을 똑같은 강아지라고 분석하며 쩔쩔매고 있습니다. 원인은 무엇일까요?!',
        prompts: {
            lower: ['야옹야옹! 귀여운 치와와 강아지와 맛있는 초코 머핀 빵 사진 두 개를 나란히 보고 AI가 엄청 헷갈려 한대요. 우리 사람의 눈에는 어떻게 똑똑하게 구별하는지 기계 눈에 보일 "시각 특징"을 찾아보아요!'],
            middle: ['치와와-초코 머핀 사진을 매섭게 째려보세요! 빵 색상이나 초코칩 구멍까지 무섭게 닮았죠? 하지만 사람은 눈을 딱 알잖아요. 픽셀(색깔점)에만 집착하는 불쌍한 깡통 AI 시력은 처참하게 속아 넘어갔네요. 그 슬픈 설계 한계를 분석해 볼까요?'],
            upper: ['AI 시각 기술의 단순한 표면적 "색상 픽셀 패턴" 맞추기에만 의존할 때 발생하는 인지 결함을 파악하세요. 이런 바보 같은 분류기를 실제 "자율주행 도로 카메라"에 넣으면 벌어질 끔찍한 위험 사고를 경고하는 보고서를 작성해 보세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'similar', type: 'text', label: '1. 예리한 관찰 보고: 기계 눈엔 도대체 어디가 닮았나!', placeholder: '어두운 동그란 눈 3개(눈과 코)와 머핀의 초코칩 3개 구멍이 얼마나 비슷한지 묘사하세요.' }, { id: 'difference', type: 'text', label: '2. 음, 근데 우리 사람의 눈과 머리는 왜 속지 않죠?', placeholder: '우리는 생명, 입체가 빵의 고소한 냄새를 기억하니까 종합적으로 안다고 적어주세요.' }],
            middle: [{ id: 'similar', type: 'text', label: '1. 1단계 표면적 가짜 이미지 공통점 구별', placeholder: '갈색의 채도와 명도, 까만 눈과 코, 초코칩 구멍의 위치 일치성에 주목하여 적어주세요.' }, { id: 'limit', type: 'textarea', label: '2. 기계 시각의 치명적 설계 결함 원인 추론', placeholder: '기계는 부드러움이나 생기를 느끼는 직관이 없고, 오직 격자판 속의 픽셀 색상 패턴만 외우기 때문임을 밝혀 적으세요.' }],
            upper: [{ id: 'limit', type: 'textarea', label: '1. AI 이미지 인식의 맥락 상실 한계 요약', placeholder: '그림 전체의 상황이나 생명 활동 맥락을 무시하고 국소적인 픽셀 배열에만 매달리는 구조적 문제를 짚어보세요.' }, { id: 'model_card', type: 'textarea', label: '2. 위험한 시스템 탑재 시 발생할 수 있는 사고 고발', placeholder: '이러한 바보 모델을 횡단보도 앞 센서나 자율주행 차에 넣었을 때 벌어질 치명 참사 시나리오를 경고하세요.' }]
        }
    },
    'D-4': {
        title: '학교 평화 수호 소장, 천재 AI 설계 마스터의 도면 짜기',
        competency: 'AI 원리 체험',
        why: '세상의 불편한 점을 보며 불평만 하면 평범한 사람! 우리가 즐겁게 배운 강력한 AI 지식을 총동원하여, 그 불편함을 단숨에 없앨 멋진 시스템을 내 손으로 직접 그려 기획합니다.',
        storySteps: {
            lower: [
                { text: '안녕! 나는 AI 탐정 알리야. 우리 학교에 불편한 점이 너무 많지 않니?', image: '/robot_2d_base.png' },
                { text: '화장실 휴지가 없거나, 급식 줄이 너무 길어! 정말 속상하잖아.', image: '/robot_2d_base.png' },
                { text: '이제 네가 가진 AI 지식으로 이 불편함을 해결할 슈퍼 로봇을 설계해 볼 거야!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '안녕! 나는 AI 탐정 알리야. 우리 학교의 불편함을 해결할 시스템을 기획해 보자.', image: '/robot_2d_base.png' },
                { text: '단순히 로봇을 만드는 게 아니라, 어떤 데이터를 학습시켜야 똑똑해질지 고민해야 해.', image: '/robot_2d_base.png' },
                { text: '자, 이제 우리 학교를 위한 최고의 AI 발명품을 설계할 준비 됐니?', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '안녕! 나는 AI 탐정 알리야. 오늘은 학교의 문제를 해결할 시스템을 설계할 거야.', image: '/robot_2d_base.png' },
                { text: '하지만 AI가 폭주하지 않도록 안전장치를 만드는 게 무엇보다 중요해.', image: '/robot_2d_base.png' },
                { text: '책임감 있는 AI 설계자로서 비상 정지 망치를 포함한 완벽한 시스템을 기획해 보자!', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ['"아 진짜 짜증 폭발이야! 요술봉만 휘두르면 매일 해결하는 요술 로봇이 있으면 좋겠어" 했던 불편한 시간을 떠올리고, 그 시간을 대신해줄 슈퍼 로봇의 이름과 능력을 기획해 보세요.'],
            middle: ['내가 만든 최첨단 로봇이 똑똑하게 돌아가려면 쉼없이 방대한 지식 정보를 먹여줘야 해요! 로봇 두뇌에 어떤 비밀 정보(공부 자료인 데이터)를 모아서 매일 학습시킬지 꿀 아이디어를 내보세요.'],
            upper: ['상상은 현실이 됩니다. 그러나 로봇이 고장 나거나 폭주하는 참사를 막기 위해, 최종 순간에 사람이 책임지고 중단시키는 "비상 정지 망치(안전장치)"를 당신만의 철학으로 설계하여 방어선을 치세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'problem_robot', type: 'textarea', label: '1. 우리 반의 불편함을 날려버릴 마법 로봇 기획서', placeholder: '내가 학교에서 겪는 귀찮거나 속상한 일을 찾고, 이를 도울 멋진 로봇의 이름과 능력을 적어주세요.' }],
            middle: [{ id: 'problem_robot', type: 'textarea', label: '1. 학교생활 해결사 AI 발명품 아이디어 제목', placeholder: '급식 잔반, 물건 분실, 복도 뛰기 등의 문제를 해결할 똑똑한 만능 시스템 서비스 이름을 지어보세요.' }, { id: 'data_collect', type: 'textarea', label: '2. 불량 로봇을 막기 위해 먹여줄 거대한 학습 데이터 보물창고 목록!', placeholder: '학생들의 선호도 기록, CCTV 영상, 이동 경로 지표 등 로봇이 똑똑해지기 위한 필수 기획 데이터를 나열하세요.' }],
            upper: [{ id: 'data_collect', type: 'textarea', label: '1. 문제 해결 시스템 구축을 위한 방대한 데이터셋 기획', placeholder: '교내의 생체 신호, 카메라 트래킹 동선 매핑 등을 결합한 거대 빅데이터 구축 구조를 서술하세요.' }, { id: 'hitl', type: 'textarea', label: '2. 시스템 폭주 방지를 위한 최후의 보루: 비상 정지 망치(안전장치) 설계', placeholder: '기계의 오류가 유발할 사고를 막기 위해, 반드시 사람이 개입하여 중단시킬 수 있는 이중 자물쇠 장치 원리를 치밀하게 설계하세요.' }]
        }
    }
};

export default function Mission({ userId, schoolId = 'gyeongdong', gradeGroup = 'lower', setFragments, onReward }) {
    const { missionId } = useParams();
    const navigate = useNavigate();
    const mission = MISSIONS[missionId];

    // --- [Dynamic Grade Resolution] ---
    const currentType = typeof mission?.type === 'object' ? mission.type[gradeGroup] : mission?.type;
    const currentPrompts = mission?.prompts ? mission.prompts[gradeGroup] : (mission?.description ? [mission.description] : []);
    const currentStackedInputs = mission?.stackedInputs ? mission.stackedInputs[gradeGroup] : [];
    const currentIsChatMode = typeof mission?.isChatMode === 'object' ? mission.isChatMode[gradeGroup] : mission?.isChatMode;
    const isCurrentChatMode = currentType === 'chat' || currentIsChatMode;
    const currentChatInitiator = typeof mission?.chatInitiator === 'object' ? mission.chatInitiator[gradeGroup] : mission?.chatInitiator;

    const [missionPhase, setMissionPhase] = useState(1); // 1: Story, 2: Edu, 3: Task
    const [currentStep, setCurrentStep] = useState(0);
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

    const steps = mission.storySteps ? mission.storySteps[gradeGroup] : null;

    // --- [Chat Turn Management] ---
    const [messages, setMessages] = useState([]);
    const userTurnCount = messages.filter(m => m.role === 'user').length;
    const turnLimit = mission?.userTurnLimit ? mission.userTurnLimit[gradeGroup] : 5;
    const isChatFinished = userTurnCount >= turnLimit;

    const handleNextStep = () => {
        if (steps && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setMissionPhase(2);
        }
    };
    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const startTask = () => {
        setMissionPhase(3);
    };
    // --- [연구용 데이터 Telemetry & Micro-Survey] ---
    const [startTime] = useState(Date.now());
    const [editCount, setEditCount] = useState(0);
    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyData, setSurveyData] = useState({ effort: 3, confidence: 3, trust: 3 });
    // --- [대화형 미션 전용 상태] ---
    const [chatInput, setChatInput] = useState('');
    const [isAIThinking, setIsAIThinking] = useState(false);
    // Moderation & Vocab State
    const [lastMessageText, setLastMessageText] = useState('');
    const [lastMessageTime, setLastMessageTime] = useState(0);
    const [vocabModal, setVocabModal] = useState({ show: false, word: '', desc: '' });
    const [modWarning, setModWarning] = useState({ show: false, message: '' });
    const [visibleHints, setVisibleHints] = useState({});
    const toggleHint = (id) => {
        setVisibleHints(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- [AI 이미지 생성 전용 상태 (C-3)] ---
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');

    const generateAIImage = async () => {
        const prompt = stackedAnswers.creative_edit;
        if (!prompt || prompt.trim() === '') {
            alert("먼저 수정하고 싶은 포스터의 내용을 적어주세요.");
            return;
        }

        setIsGeneratingImage(true);
        setGeneratedImageUrl('');
        try {
            const imagePrompt = `Colorful school festival poster background, 2D flat vector illustration, warm vibrant autumn colors, festive trees, banners and decorations on a school campus, no text, no letters. Theme: ${prompt}`;

            console.log("[AI Image] Imagen SDK로 이미지 생성 요청 중...");
            const response = await genAI2.models.generateImages({
                model: 'imagen-4.0-fast-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1 },
            });
            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;

            if (imageBytes) {
                const dataUrl = `data:image/png;base64,${imageBytes}`;
                setGeneratedImageUrl(dataUrl);
                console.log("[AI Image] Imagen 이미지 생성 성공!");
            } else {
                throw new Error("응답에 이미지 데이터가 없습니다.");
            }
        } catch (err) {
            console.error("[AI Image] Imagen 이미지 생성 실패:", err);
            // 폴백: 프리셋 배경 이미지
            console.log("[AI Image] 프리셋 배경으로 전환");
            const presetBgs = ['/c3_poster_pure_bg.png', '/c3_diverse_poster_2026.png'];
            setGeneratedImageUrl(presetBgs[Math.floor(Math.random() * presetBgs.length)]);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const generateM3Image = async () => {
        let prompt = '';

        // M-3 저학년: good_prompt 사용
        if (gradeGroup === 'lower') {
            prompt = stackedAnswers.good_prompt;
            if (!prompt || prompt.trim() === '') {
                alert("먼저 마법 주문서를 완성해주세요!");
                return;
            }
        }
        // M-3 중학년: final_prompt 사용
        else if (gradeGroup === 'middle') {
            prompt = stackedAnswers.final_prompt;
            if (!prompt || prompt.trim() === '') {
                alert("먼저 완성된 그림 주문서를 써주세요!");
                return;
            }
        }
        else {
            alert("이미지 생성은 저학년과 중학년에서만 가능합니다.");
            return;
        }

        setIsGeneratingImage(true);
        setGeneratedImageUrl('');
        try {
            // 2D 일러스트 스타일로 이미지 생성
            const imagePrompt = `2D illustration, cute cartoon style, colorful and vibrant, child-friendly art style, simple and clear composition: ${prompt}`;

            console.log("[M-3 AI Image] 학생 프롬프트로 이미지 생성 중...", prompt);
            const response = await genAI2.models.generateImages({
                model: 'imagen-4.0-fast-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1 },
            });
            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;

            if (imageBytes) {
                const dataUrl = `data:image/png;base64,${imageBytes}`;
                setGeneratedImageUrl(dataUrl);
                console.log("[M-3 AI Image] 이미지 생성 성공!");
            } else {
                throw new Error("응답에 이미지 데이터가 없습니다.");
            }
        } catch (err) {
            console.error("[M-3 AI Image] 이미지 생성 실패:", err);
            alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

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
                    if (submissionData.generatedImageUrl) {
                        setGeneratedImageUrl(submissionData.generatedImageUrl);
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
        if (!chatInput.trim() || isAIThinking || isChatFinished) return;

        // Check Moderation
        const modResult = checkModeration(chatInput, lastMessageText, lastMessageTime);
        if (!modResult.isValid) {
            if (modResult.reason !== 'empty') {
                setModWarning({ show: true, message: modResult.message });
            }
            return;
        }

        // Update moderation states
        setLastMessageText(chatInput.trim());
        setLastMessageTime(Date.now());

        const userMsg = { role: 'user', content: chatInput.trim(), timestamp: new Date().toISOString() };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setChatInput('');
        setEditCount(prev => prev + 1);
        setIsAIThinking(true);

        const newUserTurnCount = newMsgs.filter(m => m.role === 'user').length;
        try {
            const model = genAI.getGenerativeModel({
                model: MODEL_NAME,
                systemInstruction: mission.persona
                    ? mission.persona(gradeGroup, newUserTurnCount, turnLimit)
                    : "당신은 학생들의 학습을 돕는 친절한 AI 조력자입니다."
            });
            const history = newMsgs.map(m => `${m.role === 'user' ? '학생' : 'AI'}: ${m.content}`).join('\n');
            const prompt = `[지금까지의 대화:\n${history}\n\nAI의 다음 반응 (페르소나를 유지할 것):`;

            const result = await model.generateContent(prompt);
            const aiResponse = result.response.text().trim();
            setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toISOString() }]);
        } catch (err) {
            console.error('Chat AI Error:', err);
            setMessages(prev => [...prev, { role: 'ai', content: '잠깐 헷갈리네. 다시 말해줄래?', timestamp: new Date().toISOString() }]);
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
            let submissionData = { file_url: fileUrl, generatedImageUrl: missionId === 'C-3' ? generatedImageUrl : null };
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

            // [연구용] activity_logs 상세 공정 데이터 저장
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
                        // --- 미니 설문 데이터 (Research Variables) ---
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
            }, 3500);
            // Redirect after 3.5 seconds
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
        <div className="page-enter" style={{ paddingBottom: '40px' }}>
            <div style={{
                padding: '10px 15px',
                display: 'flex',
                alignItems: 'center',
                background: '#f5f6fa',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <button className="back-btn" onClick={() => navigate('/')} style={{
                    boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
                    background: 'white',
                    marginRight: '10px',
                    flexShrink: 0,
                    width: '36px',
                    height: '36px'
                }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ flex: 1, textAlign: 'center', paddingRight: '46px' }}> {/* Offset for back button to center title */}
                    <h1 style={{
                        fontFamily: "'Jua', sans-serif",
                        fontSize: '1.25rem',
                        color: 'var(--text-dark)',
                        margin: 0,
                        lineHeight: 1.2
                    }}>{mission.title}</h1>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary-blue)', opacity: 0.8 }}>
                        {missionId} | {mission.competency.split(' (')[0]}
                    </div>
                </div>
            </div>

            <div className="mission-wrapper" style={{ paddingTop: '15px' }}>

                {missionPhase === 1 && steps ? (
                    /* Phase 1: Carousel Storytelling */
                    <div className="discovery-carousel-container" style={{
                        background: 'white',
                        borderRadius: '35px',
                        padding: '20px',
                        border: '4px solid #74b9ff',
                        boxShadow: '0 10px 25px rgba(116, 185, 255, 0.1)',
                        textAlign: 'center',
                        position: 'relative',
                        height: '400px', // Fixed height
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        animation: 'slideUpFade 0.6s ease-out',
                        overflow: 'hidden'
                    }}>
                        {/* Progress Dots */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
                            {steps.map((_, idx) => (
                                <div key={idx} style={{
                                    width: idx === currentStep ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: idx === currentStep ? '#74b9ff' : '#dcdde1',
                                    transition: 'all 0.3s ease'
                                }} />
                            ))}
                        </div>

                        {/* Character/Image Area */}
                        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}>
                            <img
                                src={steps[currentStep].image || '/robot_2d_base.png'}
                                alt="Step Illustration"
                                style={{
                                    maxWidth: '160px',
                                    maxHeight: '160px',
                                    objectFit: 'contain',
                                    mixBlendMode: 'multiply',
                                    filter: (steps[currentStep].image?.includes('robot') || steps[currentStep].image?.includes('c1_story')) ? 'none' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                                    animation: 'float 3s ease-in-out infinite'
                                }}
                            />
                        </div>

                        {/* Story Text Area (Fixed Height) */}
                        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', padding: '0 10px' }}>
                            <div style={{ width: '100%' }}>
                                <div style={{
                                    background: '#74b9ff',
                                    color: 'white',
                                    padding: '2px 10px',
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: '900',
                                    display: 'inline-block',
                                    marginBottom: '8px'
                                }}>알리 (Alli)</div>
                                <p style={{
                                    margin: 0,
                                    fontSize: '1.05rem',
                                    fontWeight: '800',
                                    lineHeight: 1.4,
                                    color: '#2d3436',
                                    wordBreak: 'keep-all',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {steps[currentStep].text}
                                </p>
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {currentStep > 0 && (
                                <button onClick={handlePrevStep} style={{
                                    flex: 1,
                                    padding: '18px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: '#f1f2f6',
                                    color: '#747d8c',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>이전</button>
                            )}
                            <button onClick={handleNextStep} style={{
                                flex: 2,
                                padding: '18px',
                                borderRadius: '20px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 8px 15px rgba(9, 132, 227, 0.2)'
                            }}>
                                {currentStep === steps.length - 1 ? '학습 내용 확인하기' : '다음 단계로'}
                            </button>
                        </div>
                    </div>
                ) : missionPhase === 2 ? (
                    /* Phase 2: Educational Guidance */
                    <div style={{ animation: 'slideUpFade 0.6s ease-out' }}>
                        <div className="edu-card why" style={{ border: '4px solid #00b894', boxShadow: '0 10px 25px rgba(0, 184, 148, 0.15)', padding: '15px', marginBottom: '15px' }}>
                            <h3 style={{ color: '#00b894', margin: '0 0 10px 0', fontSize: '1.2rem' }}><Target size={20} /> 왜 중요할까요?</h3>
                            <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                                <VocabHighlighter text={typeof mission.why === 'object' ? mission.why[gradeGroup] : mission.why} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
                            </p>
                        </div>

                        <div className="edu-card example" style={{ border: '4px solid #00b894', boxShadow: '0 10px 25px rgba(0, 184, 148, 0.15)', padding: '15px', marginBottom: '15px' }}>
                            <h3 style={{ color: '#00b894', margin: '0 0 10px 0', fontSize: '1.2rem' }}><Lightbulb size={20} /> 예를 들어볼까요?</h3>
                            <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                                <VocabHighlighter text={typeof mission.example === 'object' ? mission.example[gradeGroup] : mission.example} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
                            </p>
                        </div>

                        {mission.referenceImage && missionId !== 'C-2' && (
                            <div className="reference-image-container" style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <div style={{ background: 'white', padding: '15px', borderRadius: '25px', border: '4px solid #00b894', boxShadow: '0 10px 20px rgba(0, 184, 148, 0.1)' }}>
                                    <img src={mission.referenceImage} alt="Reference" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '10px' }} />
                                    {mission.referenceImageCaption && (
                                        <p style={{ margin: 0, fontSize: '1rem', color: '#636e72', fontWeight: 'bold' }}>
                                            {mission.referenceImageCaption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <button onClick={startTask} style={{
                            width: '100%',
                            padding: '22px',
                            borderRadius: '25px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #00b894 0%, #009432 100%)',
                            color: 'white',
                            fontSize: '1.25rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 148, 50, 0.2)',
                            marginTop: '10px'
                        }}>
                            미션 시작하기
                        </button>
                    </div>
                ) : (
                    /* Phase 3: Mission Task */
                    <div style={{ animation: 'slideUpFade 0.6s ease-out' }}>
                        <div className="character-story-container" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            background: 'white',
                            padding: '12px 18px',
                            borderRadius: '25px',
                            border: '3px solid #fdcb6e',
                            marginBottom: '15px',
                            boxShadow: '0 8px 16px rgba(253, 203, 110, 0.1)'
                        }}>
                            <div style={{ width: '60px', height: '60px', flexShrink: 0, background: '#fff9e6', borderRadius: '50%', padding: '8px', border: '2px solid #fdcb6e', overflow: 'hidden' }}>
                                <img src="/robot_2d_base.png" alt="Alli" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ background: '#fdcb6e', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '900', display: 'inline-block', marginBottom: '6px' }}>알리 (Alli)</div>
                                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#2d3436', wordBreak: 'keep-all' }}>
                                    좋아! 이제 본격적으로 미션을 수행해 보자. 파이팅!
                                </p>
                            </div>
                        </div>

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
                                        <AlertCircle size={20} /> 전문가 선생님의 편지
                                    </div>
                                    <p style={{ margin: 0, color: '#2d3436', fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.5 }}>
                                        "{teacherFeedback}"
                                    </p>
                                    <div style={{ fontSize: '0.85rem', color: '#636e72', fontStyle: 'italic' }}>
                                        * 이 내용을 참고해서 미션 내용을 수정해 보세요.
                                    </div>
                                </div>
                            )}

                            {/* Reference Image (for C-2 etc.) */}
                            {mission.referenceImage && missionId !== 'C-3' && (
                                <div style={{
                                    width: '100%',
                                    background: 'white',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    border: '4px solid #fdcb6e',
                                    marginBottom: '20px',
                                    padding: '10px',
                                    boxShadow: '0 8px 16px rgba(253, 203, 110, 0.1)'
                                }}>
                                    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
                                        <img
                                            src={mission.referenceImage}
                                            alt="Reference Attachment"
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                    </div>
                                    {mission.referenceImageCaption && (
                                        <div style={{ color: '#2d3436', fontWeight: '800', textAlign: 'center', fontSize: '0.9rem', background: '#fff9e6', padding: '8px', borderRadius: '8px' }}>
                                            {mission.referenceImageCaption}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* C-3 Dynamic Poster Preview (Frame style for 3-6) */}
                            {missionId === 'C-3' && (
                                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1 / 1.15',
                                        backgroundColor: gradeGroup === 'lower' ? 'transparent' : '#ffffff',
                                        backgroundImage: gradeGroup === 'lower'
                                            ? 'url("/c3_diverse_poster_2026.png")'
                                            : (generatedImageUrl ? `url("${generatedImageUrl}")` : 'url("/c3_poster_pure_bg.png")'),
                                        backgroundSize: '100% 100%',
                                        backgroundRepeat: 'no-repeat',
                                        borderRadius: '25px',
                                        border: '12px solid #fdcb6e', // Thicker frame
                                        position: 'relative',
                                        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.15)',
                                        overflow: 'hidden',
                                        backgroundPosition: 'center',
                                        transition: 'all 0.5s ease-in-out',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {/* Grade 3-6: Show "Blank/Loading" if no image yet */}
                                        {gradeGroup !== 'lower' && !generatedImageUrl && !isGeneratingImage && (
                                            <div style={{ color: '#dfe6e9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🖼️</div>
                                                <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#b2bec3' }}>포스터가 여기에 생성됩니다.</div>
                                            </div>
                                        )}

                                        {/* Loading Overlay */}
                                        {isGeneratingImage && (
                                            <div style={{
                                                position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                zIndex: 10, backdropFilter: 'blur(3px)'
                                            }}>
                                                <div className="ai-loader" style={{ fontSize: '3.5rem', marginBottom: '20px', animation: 'bounce 1s infinite' }}>🎨</div>
                                                <div style={{ fontWeight: '900', color: '#6c5ce7', fontSize: '1.2rem' }}>AI가 포스터를 그리는 중...</div>
                                            </div>
                                        )}

                                        {/* Student Text Overlay (Hided for 1-2 grade per request) */}
                                        {gradeGroup !== 'lower' && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '85%',
                                                maxHeight: '40%',
                                                display: (stackedAnswers.creative_edit ? 'flex' : 'none'),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                background: 'rgba(255, 255, 255, 0.85)',
                                                padding: '15px',
                                                borderRadius: '15px',
                                                border: '2px dashed #fab1a0',
                                                fontFamily: "'Jua', sans-serif",
                                                fontSize: (stackedAnswers.creative_edit?.length > 30) ? '1.1rem' : '1.4rem',
                                                lineHeight: 1.4,
                                                color: '#2d3436',
                                                wordBreak: 'keep-all',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                                backdropFilter: 'blur(2px)'
                                            }}>
                                                {stackedAnswers.creative_edit}
                                            </div>
                                        )}


                                    </div>
                                </div>
                            )}

                            <h3 className="mission-task-header" style={{ color: '#e67e22' }}>탐구 과제</h3>
                            {currentPrompts && currentPrompts.length > 0 && (
                                <div style={{ marginBottom: '15px', textAlign: 'left', color: '#2d3436', background: 'white', padding: '18px', borderRadius: '15px', border: '3px solid #dfe6e9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    {currentPrompts.map((prompt, idx) => (
                                        <p key={idx} style={{ marginBottom: idx === currentPrompts.length - 1 ? 0 : '12px', fontWeight: '900', fontSize: '1.2rem', lineHeight: '1.5', color: '#2d3436' }}>
                                            <VocabHighlighter text={prompt} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
                                        </p>
                                    ))}
                                </div>
                            )}

                            {isCurrentChatMode ? (
                                <>
                                    {/* M-2 고학년 채팅 모드에서도 이미지 표시 */}
                                    {missionId === 'M-2' && gradeGroup === 'upper' && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginBottom: '20px',
                                            background: '#f8f9fa',
                                            borderRadius: '15px',
                                            padding: '15px',
                                            border: '2px solid #ff7675'
                                        }}>
                                            <img
                                                src={mission.scenarioImages?.[gradeGroup] || '/robot_2d_base.png'}
                                                alt="상황 이미지"
                                                style={{
                                                    maxWidth: '70%',
                                                    height: 'auto',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '280px', border: '2px solid #dfe6e9', borderRadius: '20px', overflow: 'hidden', background: '#f8f9fa' }}>
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
                                                        {m.role === 'ai' ? (
                                                            <VocabHighlighter
                                                                text={m.content}
                                                                onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })}
                                                            />
                                                        ) : m.content}
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
                                                placeholder={isChatFinished ? "미션이 완료되었습니다. 아래 버튼을 눌러 제출해 주세요." : "이야기를 이어가 보세요..."}
                                                disabled={isChatFinished || isAIThinking}
                                                style={{ flex: 1, border: '1px solid #dfe6e9', borderRadius: '12px', padding: '10px', background: (isChatFinished || isAIThinking) ? '#f1f2f6' : 'white' }}
                                            />
                                            <button type="submit" disabled={isChatFinished || isAIThinking} style={{ background: (isChatFinished || isAIThinking) ? '#b2bec3' : '#0984e3', border: 'none', borderRadius: '12px', padding: '0 15px', color: 'white', cursor: (isChatFinished || isAIThinking) ? 'not-allowed' : 'pointer' }}>보내기</button>
                                        </form>
                                        <button onClick={() => handleSubmit()} disabled={!isChatFinished && messages.length < 3} style={{ margin: '10px', padding: '12px', background: isChatFinished ? '#00b894' : '#dfe6e9', border: 'none', borderRadius: '12px', color: isChatFinished ? 'white' : '#636e72', fontWeight: '900', cursor: (!isChatFinished && messages.length < 3) ? 'not-allowed' : 'pointer', opacity: (!isChatFinished && messages.length < 3) ? 0.6 : 1 }}>
                                            {isChatFinished ? '성공! 대화 완료하고 제출하기' : `${userTurnCount}/${turnLimit}번 진행 중...`}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {currentType === 'upload-text' && (
                                        <>
                                            <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#2d3436' }}>관련 사진을 업로드해주세요. 📸</div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                style={{ width: '100%', padding: '15px', background: 'white', borderRadius: '12px', border: '2px solid #dfe6e9', marginBottom: '10px' }}
                                            />
                                            {file && (
                                                <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#0984e3', fontWeight: 'bold' }}>
                                                    ✅ {file.name} (선택됨)
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {currentStackedInputs?.length > 0 ? (
                                        <div>
                                            {/* M-2 통합 회의 맥락 UI */}
                                            {missionId === 'M-2' && (
                                                <div style={{
                                                    background: 'white',
                                                    borderRadius: '20px',
                                                    padding: '20px',
                                                    marginBottom: '25px',
                                                    border: '3px solid #ff7675',
                                                    boxShadow: '0 4px 12px rgba(255, 118, 117, 0.1)',
                                                    position: 'relative'
                                                }}>
                                                    {/* 이미지 섹션 - 모든 학년군에 표시 */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        marginBottom: '20px',
                                                        background: '#f8f9fa',
                                                        borderRadius: '15px',
                                                        padding: '15px'
                                                    }}>
                                                        <img
                                                            src={mission.scenarioImages?.[gradeGroup] || '/robot_2d_base.png'}
                                                            alt="상황 이미지"
                                                            style={{
                                                                maxWidth: '70%',
                                                                height: 'auto',
                                                                borderRadius: '12px',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                            }}
                                                        />
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                                        <div style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            background: '#ff7675',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '24px',
                                                            boxShadow: '0 4px 12px rgba(255, 118, 117, 0.3)'
                                                        }}>
                                                            🤖
                                                        </div>
                                                        <div>
                                                            <div style={{ color: '#ff7675', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                                만능 AI의 오지랖 제안!
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        background: '#f8f9fa',
                                                        borderRadius: '15px',
                                                        padding: '18px',
                                                        color: '#2d3436',
                                                        lineHeight: 1.6,
                                                        fontSize: '1rem',
                                                        border: '2px solid #ff7675',
                                                        borderStyle: 'dashed'
                                                    }}>
                                                        {gradeGroup === 'lower' && (
                                                            <div>
                                                                <strong>&quot;안녕하세요! 저는 만능 도우미 AI예요! 🎯</strong><br />
                                                                체육대회 준비? 걱정 마세요! <strong>무거운 매트 나르기부터 친구들 응원하기까지 모든 걸 제가 다 해드릴게요!</strong>
                                                                여러분은 그냥 편하게 앉아서 구경만 하시면 됩니다!&quot;
                                                            </div>
                                                        )}
                                                        {gradeGroup === 'middle' && (
                                                            <div>
                                                                <strong>&quot;장기자랑 준비로 바쁘시죠? 제가 도와드릴게요! 🎭</strong><br />
                                                                <strong>춤도 제가 추고, 노래도 제가 부르고, 감동적인 연기까지 다 해드릴게요!</strong>
                                                                친구들과의 협력? 그런 복잡한 건 필요 없어요. 저 혼자면 충분합니다!&quot;
                                                            </div>
                                                        )}
                                                        {gradeGroup === 'upper' && (
                                                            <div>
                                                                <strong>&quot;학급 프로젝트 회의 진행하시나요? 제가 완벽하게 처리해드릴게요! 💼</strong><br />
                                                                <strong>데이터 수집부터 최종 의사결정까지 제 알고리즘으로 모든 걸 완벽하게 처리하겠습니다!</strong>
                                                                인간의 감정적 판단이나 비효율적인 협력 과정은 생략하고, 저 혼자서 최적의 결과를 도출해드릴게요!&quot;
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="stacked-inputs-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                                                {currentStackedInputs.map((inputDef) => (
                                                    <div key={inputDef.id} className="stacked-input-group">
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                            {inputDef.label && <div style={{ fontWeight: 'bold', color: '#2d3436', fontSize: '1.05rem' }}>{inputDef.label}</div>}
                                                            {inputDef.placeholder && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleHint(inputDef.id)}
                                                                    style={{
                                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                                        fontSize: '1.3rem', padding: '0 5px', opacity: 0.8,
                                                                        transition: 'transform 0.2s',
                                                                        transform: visibleHints[inputDef.id] ? 'scale(1.15)' : 'scale(1)'
                                                                    }}
                                                                    title="힌트 보기"
                                                                >
                                                                    💡
                                                                </button>
                                                            )}
                                                        </div>
                                                        {visibleHints[inputDef.id] && inputDef.placeholder && (
                                                            <div style={{
                                                                background: '#fff9c4', border: '2px dashed #fbc02d', borderRadius: '10px',
                                                                padding: '12px 15px', marginBottom: '15px', color: '#f57f17', fontSize: '0.95rem',
                                                                display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5,
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in'
                                                            }}>
                                                                <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>🎯</span>
                                                                <span><strong>힌트 도우미</strong> <VocabHighlighter text={inputDef.placeholder} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
                                                            </div>
                                                        )}
                                                        {inputDef.type === 'checklist' ? (
                                                            <div style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                                                gap: '15px',
                                                                padding: '10px 0'
                                                            }}>
                                                                {inputDef.list.map((item, idx) => {
                                                                    const currentAnswers = Array.isArray(stackedAnswers[inputDef.id])
                                                                        ? stackedAnswers[inputDef.id]
                                                                        : [];
                                                                    const isChecked = currentAnswers.includes(item);

                                                                    // 카드 색상 배열 (다양한 색상)
                                                                    const cardColors = [
                                                                        { bg: '#e8f4fd', border: '#74b9ff', accent: '#0984e3' },
                                                                        { bg: '#fef7e8', border: '#fdcb6e', accent: '#e17055' },
                                                                        { bg: '#f0e8ff', border: '#a29bfe', accent: '#6c5ce7' },
                                                                        { bg: '#e8f8f5', border: '#00b894', accent: '#00a085' },
                                                                        { bg: '#ffe8f7', border: '#fd79a8', accent: '#e84393' },
                                                                        { bg: '#fff0e8', border: '#ff7675', accent: '#d63031' }
                                                                    ];
                                                                    const cardColor = cardColors[idx % cardColors.length];

                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            onClick={() => {
                                                                                const newSelection = isChecked
                                                                                    ? currentAnswers.filter(a => a !== item)
                                                                                    : [...currentAnswers, item];
                                                                                handleStackedChange(inputDef.id, newSelection);
                                                                            }}
                                                                            style={{
                                                                                background: isChecked ? cardColor.bg : 'white',
                                                                                borderRadius: '20px',
                                                                                border: `3px solid ${isChecked ? cardColor.border : '#e0e0e0'}`,
                                                                                padding: '20px',
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                                boxShadow: isChecked
                                                                                    ? `0 8px 25px ${cardColor.accent}40`
                                                                                    : '0 2px 8px rgba(0,0,0,0.08)',
                                                                                transform: isChecked ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
                                                                                position: 'relative',
                                                                                overflow: 'hidden'
                                                                            }}
                                                                        >
                                                                            {/* 카드 장식 요소 */}
                                                                            <div style={{
                                                                                position: 'absolute',
                                                                                top: '-10px',
                                                                                right: '-10px',
                                                                                width: '40px',
                                                                                height: '40px',
                                                                                background: isChecked ? cardColor.border : '#f0f0f0',
                                                                                borderRadius: '50%',
                                                                                opacity: 0.3
                                                                            }}></div>

                                                                            {/* 체크 표시 */}
                                                                            <div style={{
                                                                                position: 'absolute',
                                                                                top: '12px',
                                                                                right: '12px',
                                                                                width: '24px',
                                                                                height: '24px',
                                                                                borderRadius: '50%',
                                                                                background: isChecked ? cardColor.accent : '#ddd',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                fontSize: '14px',
                                                                                color: 'white',
                                                                                fontWeight: 'bold',
                                                                                transform: isChecked ? 'scale(1.1)' : 'scale(0.9)',
                                                                                transition: 'all 0.2s ease'
                                                                            }}>
                                                                                {isChecked ? '✓' : ''}
                                                                            </div>

                                                                            {/* 카드 내용 */}
                                                                            <div style={{
                                                                                fontSize: '1rem',
                                                                                color: isChecked ? cardColor.accent : '#2d3436',
                                                                                fontWeight: isChecked ? '600' : '500',
                                                                                lineHeight: 1.4,
                                                                                paddingRight: '35px'
                                                                            }}>
                                                                                {item}
                                                                            </div>

                                                                            {/* 선택 상태 표시 */}
                                                                            {isChecked && (
                                                                                <div style={{
                                                                                    marginTop: '12px',
                                                                                    padding: '6px 12px',
                                                                                    background: cardColor.accent,
                                                                                    color: 'white',
                                                                                    borderRadius: '20px',
                                                                                    fontSize: '0.85rem',
                                                                                    fontWeight: '600',
                                                                                    display: 'inline-block'
                                                                                }}>
                                                                                    선택됨 ✨
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : inputDef.type === 'textarea' ? (
                                                            <textarea
                                                                rows={3}
                                                                value={stackedAnswers[inputDef.id] || ''}
                                                                onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                                placeholder=""
                                                                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                                required
                                                            />
                                                        ) : inputDef.type === 'multi-text' ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {inputDef.fields.map((field) => (
                                                                    <input
                                                                        key={field.id}
                                                                        type="text"
                                                                        value={stackedAnswers[field.id] || ''}
                                                                        onChange={(e) => handleStackedChange(field.id, e.target.value)}
                                                                        placeholder={field.placeholder}
                                                                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1rem', fontFamily: "'Nunito', sans-serif" }}
                                                                        required
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={stackedAnswers[inputDef.id] || ''}
                                                                onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                                placeholder=""
                                                                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                                required
                                                            />
                                                        )}

                                                        {/* [M-3 미션 전용] 이미지 생성 버튼 */}
                                                        {missionId === 'M-3' && (gradeGroup === 'lower' && inputDef.id === 'good_prompt' || gradeGroup === 'middle' && inputDef.id === 'final_prompt') && (
                                                            <button
                                                                type="button"
                                                                onClick={generateM3Image}
                                                                disabled={isGeneratingImage}
                                                                style={{
                                                                    marginTop: '15px',
                                                                    width: '100%',
                                                                    padding: '18px',
                                                                    background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '20px',
                                                                    fontWeight: '900',
                                                                    fontSize: '1.2rem',
                                                                    cursor: 'pointer',
                                                                    boxShadow: '0 8px 20px rgba(253, 121, 168, 0.25)',
                                                                    transition: 'all 0.3s',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '10px'
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '1.4rem' }}>🎨</span>
                                                                {isGeneratingImage ? '그림 그리는 중...' : 'AI로 그림 그려보기!'}
                                                                <span style={{ fontSize: '1.4rem' }}>✨</span>
                                                            </button>
                                                        )}

                                                        {/* [C-3 미션 전용] 버튼이 creative_edit 입력창 바로 아래에 위치 */}
                                                        {missionId === 'C-3' && gradeGroup !== 'lower' && inputDef.id === 'creative_edit' && (
                                                            <button
                                                                type="button"
                                                                onClick={generateAIImage}
                                                                disabled={isGeneratingImage}
                                                                style={{
                                                                    marginTop: '15px',
                                                                    width: '100%',
                                                                    padding: '18px',
                                                                    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '20px',
                                                                    fontWeight: '900',
                                                                    fontSize: '1.2rem',
                                                                    cursor: 'pointer',
                                                                    boxShadow: '0 8px 20px rgba(108, 92, 231, 0.25)',
                                                                    transition: 'all 0.3s',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '10px'
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '1.4rem' }}>✨</span>
                                                                마법의 AI로 포스터 그리기
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* M-3 미션 이미지 생성 결과 표시 */}
                                            {missionId === 'M-3' && (gradeGroup === 'lower' || gradeGroup === 'middle') && generatedImageUrl && (
                                                <div style={{
                                                    marginTop: '25px',
                                                    padding: '20px',
                                                    background: 'linear-gradient(135deg, #fff5f5 0%, #fff0f6 100%)',
                                                    borderRadius: '20px',
                                                    border: '3px solid #fd79a8',
                                                    textAlign: 'center',
                                                    boxShadow: '0 8px 25px rgba(253, 121, 168, 0.15)'
                                                }}>
                                                    <div style={{
                                                        fontSize: '1.3rem',
                                                        fontWeight: '800',
                                                        color: '#e84393',
                                                        marginBottom: '15px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '10px'
                                                    }}>
                                                        <span>🎨</span>
                                                        AI가 그려준 마법의 그림!
                                                        <span>✨</span>
                                                    </div>
                                                    <img
                                                        src={generatedImageUrl}
                                                        alt="AI가 생성한 이미지"
                                                        style={{
                                                            maxWidth: '100%',
                                                            height: 'auto',
                                                            borderRadius: '15px',
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                                            border: '2px solid #fd79a8'
                                                        }}
                                                    />
                                                    <div style={{
                                                        marginTop: '15px',
                                                        fontSize: '1rem',
                                                        color: '#636e72',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        {gradeGroup === 'lower'
                                                            ? '마법 주문서가 이렇게 멋진 그림으로 변했어요!'
                                                            : '완성된 그림 주문서로 AI가 그려준 작품이에요!'
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        currentType !== 'rules' && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#2d3436' }}>📝 미션 답변 적기</div>
                                                    {mission.example && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleHint('main_hint')}
                                                            style={{
                                                                background: 'none', border: 'none', cursor: 'pointer',
                                                                fontSize: '1.3rem', padding: '0 5px', opacity: 0.8,
                                                                transition: 'transform 0.2s',
                                                                transform: visibleHints['main_hint'] ? 'scale(1.15)' : 'scale(1)'
                                                            }}
                                                            title="힌트 보기"
                                                        >
                                                            💡
                                                        </button>
                                                    )}
                                                </div>
                                                {visibleHints['main_hint'] && mission.example && (
                                                    <div style={{
                                                        background: '#fff9c4', border: '2px dashed #fbc02d', borderRadius: '10px',
                                                        padding: '12px 15px', marginBottom: '15px', color: '#f57f17', fontSize: '0.95rem',
                                                        display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5,
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in'
                                                    }}>
                                                        <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>🎯</span>
                                                        <span><strong>힌트 도우미</strong> <VocabHighlighter text={mission.example} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
                                                    </div>
                                                )}
                                                <textarea
                                                    rows={4}
                                                    value={formData}
                                                    onChange={(e) => handleTextChange(e.target.value)}
                                                    placeholder=""
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
                                                    placeholder=""
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
                                                    placeholder=""
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
                                                    placeholder=""
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button type="submit" className="btn-primary" disabled={isSubmitting || isLoadingInitial} style={{
                                        background: 'linear-gradient(135deg, #fdcb6e 0%, #f9ca24 100%)',
                                        color: '#2d3436',
                                        border: 'none',
                                        boxShadow: '0 8px 15px rgba(253, 203, 110, 0.3)'
                                    }}>
                                        {isSubmitting ? '제출 중...' : (isEditing ? '미션 내용 수정하기!' : '미션 제출하기!')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showSurvey && (
                <div className="success-overlay" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <div style={{ background: 'white', border: '5px solid #74b9ff', borderRadius: '20px', padding: '20px', maxWidth: '500px', width: '100%', position: 'relative' }}>
                        <h2 style={{ fontFamily: "'Jua', sans-serif", color: '#0984e3', marginBottom: '15px', textAlign: 'center' }}>잠깐! 마지막 궁금증 🧐</h2>

                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: '900', marginBottom: '5px' }}>1. 이 활동을 하면서 얼마나 많이 고민했나요?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button key={v} onClick={() => setSurveyData({ ...surveyData, effort: v })} style={{
                                        width: '45px', height: '45px', borderRadius: '50%', border: 'none',
                                        background: surveyData.effort === v ? '#74b9ff' : '#f1f2f6',
                                        color: surveyData.effort === v ? 'white' : '#2d3436',
                                        fontWeight: '900', cursor: 'pointer'
                                    }}>{v}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <p style={{ fontWeight: '900', marginBottom: '10px' }}>2. AI가 없었어도 스스로 할 수 있었나요?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button key={v} onClick={() => setSurveyData({ ...surveyData, confidence: v })} style={{
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
                                    <button key={v} onClick={() => setSurveyData({ ...surveyData, trust: v })} style={{
                                        width: '45px', height: '45px', borderRadius: '50%', border: 'none',
                                        background: surveyData.trust === v ? '#e17055' : '#f1f2f6',
                                        color: surveyData.trust === v ? 'white' : '#2d3436',
                                        fontWeight: '900', cursor: 'pointer'
                                    }}>{v}</button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleSubmit} style={{ width: '100%', padding: '18px', background: '#0984e3', border: 'none', borderRadius: '20px', color: 'white', fontFamily: "'Jua', sans-serif", fontSize: '1.2rem', boxShadow: '0 6px 0 #0764ad', cursor: 'pointer' }}>
                            미션 완료하기
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {vocabModal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div className="page-enter" style={{ background: 'white', padding: '30px', borderRadius: '25px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💡</div>
                        <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.8rem', color: '#0984e3', margin: '0 0 15px 0' }}>{vocabModal.word}</h3>
                        <p style={{ color: '#2d3436', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, marginBottom: '25px', wordBreak: 'keep-all' }}>
                            {vocabModal.desc}
                        </p>
                        <button type="button" onClick={() => setVocabModal({ show: false, word: '', desc: '' })} style={{ background: '#0984e3', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                            이해했어요!
                        </button>
                    </div>
                </div>
            )}
            {modWarning.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div className="page-enter" style={{ background: 'white', padding: '30px', borderRadius: '25px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
                        <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.5rem', color: '#d63031', margin: '0 0 15px 0' }}>안내 메시지</h3>
                        <p style={{ color: '#2d3436', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, marginBottom: '25px', wordBreak: 'keep-all' }}>
                            {modWarning.message}
                        </p>
                        <button type="button" onClick={() => setModWarning({ show: false, message: '' })} style={{ background: '#d63031', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                            네 알겠습니다
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