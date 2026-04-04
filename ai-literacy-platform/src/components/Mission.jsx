import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Target, AlertCircle, Clock, BarChart3, HelpCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
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
                { text: '안녕하세요! 저는 꼬마 AI 로봇 알리 선생님이에요. 만나서 정말 반가워요!', image: '/robot_2d_base.png' },
                { text: '우리 집이나 학교에는 똑똑한 AI 친구들이 몰래 숨어있대요.', image: '/e1_mission_v3.png' },
                { text: '로봇청소기처럼 스스로 움직이거나, 내 목소리를 알아듣는 친구들이 다 AI예요!', image: '/robot_2d_base.png' },
                { text: '우리 주변 어디에 숨어있는지 탐정처럼 눈을 크게 뜨고 찾아볼까요?', image: '/e1_mission_v3.png' },
                { text: '찾았으면 찰칵! 사진을 찍어서 저에게 보여주세요. 어떤 도움을 주는지도 궁금하네요!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '안녕하세요 친구들! 저는 알리 선생님이에요. 우리 주변엔 몰래 숨어서 우리를 도와주는 AI 친구들이 아주 많아요.', image: '/robot_2d_base.png' },
                { text: '유튜브 추천 영상이나 날씨를 알려주는 스피커도 모두 AI 기술로 만들어졌어요.', image: '/e1_mission_v3.png' },
                { text: 'AI는 우리가 무엇을 좋아하는지, 무엇이 필요한지 스스로 학습하고 판단해요.', image: '/robot_2d_base.png' },
                { text: '이제 여러분이 탐정이 되어 우리 생활 곳곳에 숨어있는 AI를 조사해 줄래요?', image: '/e1_mission_v3.png' },
                { text: '어떤 AI를 발견했는지, 그 친구가 어떤 착한 일을 하고 있는지 선생님에게 상세히 알려주세요!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '반갑습니다! 저는 알리 선생님입니다. 현대 사회의 일상 곳곳에는 수많은 AI 시스템이 이미 깊숙이 들어와 있어요.', image: '/robot_2d_base.png' },
                { text: '스마트홈, 자율주행, 정교한 알고리즘 서비스 등이 우리 삶을 더 편리하게 만들고 있지요.', image: '/e1_mission_v3.png' },
                { text: '하지만 익숙함 때문에 우리는 그 속에 숨겨진 AI의 정체를 놓치곤 해요.', image: '/robot_2d_base.png' },
                { text: '이제 훌륭한 AI 전문가로서 우리 일상 속 AI 기술을 찾아 사진을 찍고 분석해 보세요!', image: '/e1_mission_v3.png' },
                { text: '편리함뿐만 아니라 그 뒤에 숨겨진 작동 원리와 한계까지 찾아낸다면, 여러분은 정말 멋진 전문가가 될 거예요!', image: '/robot_2d_base.png' }
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
            lower: 'AI가 잘못된 정보를 말을 할 때가 있어요!',
            middle: 'AI가 정보를 처리하는 과정에서 생기는 오류를 파악해요.',
            upper: '생성형 AI의 한계점인 "환각" 현상을 비판적으로 분석합니다.'
        },
        example: {
            lower: '"사과는 채소예요"라고 우기는 AI',
            middle: 'AI가 지어낸 역사 이야기 (세종대왕의 휴대용 컴퓨터 던짐 등)',
            upper: '출처가 불분명한 정보를 팩트처럼 제시하는 사례'
        },
        storySteps: {
            lower: [
                { text: '안녕하세요! 저는 사실 확인 요정 알리 선생님이에요. 오늘은 AI 친구의 거짓말을 찾아볼까요?', image: '/robot_2d_base.png' },
                { text: 'AI 친구는 공부를 아주 많이 했지만, 가끔 모르는 것도 아는 것처럼 멋지게 지어내곤 해요.', image: '/robot_2d_base.png' },
                { text: '이걸 "환각" 현상이라고 불러요. 마치 헛것을 본 것처럼 엉뚱한 대답을 하는 것이죠.', image: '/robot_2d_base.png' },
                { text: '방금 AI 친구가 "호랑이가 세상에서 두 번째로 빠른 동물"이라고 우겼대요! 그게 정말일까요?', image: '/robot_2d_base.png' },
                { text: '여러분이 진짜 정답을 찾아서, 허풍쟁이 AI에게 똑똑하게 가르쳐주세요!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워요! 저는 탐구 요정 알리 선생님이에요. 오늘은 겉으로 완벽해 보이지만 속은 허당인 AI의 실수를 조사해 보려고 해요.', image: '/robot_2d_base.png' },
                { text: 'AI는 엄청나게 많은 데이터를 학습하지만, 가짜 데이터가 섞여 있으면 가끔 그럴듯한 거짓말을 하기도 해요.', image: '/robot_2d_base.png' },
                { text: '사람들은 이걸 "환각" 현상이라고 불러요. 너무 천연덕스럽게 말해서 속기 쉽답니다.', image: '/robot_2d_base.png' },
                { text: '우리 AI 친구가 호랑이를 가장 빠른 동물이라 생각해서 두 번째로 빠르다고 엉뚱한 대답을 하고 있네요.', image: '/robot_2d_base.png' },
                { text: '진짜 정답이 무엇인지 확인하고, 왜 AI가 이런 실수를 했는지 탐정처럼 추리해 볼까요?', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영합니다! 저는 데이터 분석을 돕는 알리 선생님입니다. 오늘은 생성형 AI의 가장 큰 한계인 거짓 정보 생성, 즉 환각 현상을 파헤쳐 봅시다.', image: '/robot_2d_base.png' },
                { text: 'AI는 확률적으로 가장 자연스러운 문장을 만들 뿐, 그 내용이 항상 사실인 것은 아니에요.', image: '/robot_2d_base.png' },
                { text: '이런 "환각" 현상은 정교한 문장 뒤에 숨어서 우리를 혼란스럽게 만들곤 하죠.', image: '/robot_2d_base.png' },
                { text: '이제 여러분 눈과 머리로 직접 AI와 대화하며 논리적인 허점을 찾아내고, 실제 사실로 AI를 설득해 보는 건 어떨까요?', image: '/robot_2d_base.png' },
                { text: 'AI가 자신의 실수를 인정하고 항복하게 만든다면, 여러분은 정말 훌륭한 사실 확인 전문가가 될 거예요!', image: '/robot_2d_base.png' }
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
            lower: [{ id: 'fact', type: 'text', label: '1. 바보 AI야! 진짜 정답은 바로 이거예요!', placeholder: '' }],
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
                { text: '안녕하세요! 저는 탐험가 알리 선생님이에요. 오늘은 AI 친구가 어떻게 우리 마음을 읽는지 알아볼까요?', image: '/robot_2d_base.png' },
                { text: '우리 친구들 혹시 "앗! 내가 보고 싶던 영상이 또 나왔네?" 하고 깜짝 놀란 적 있나요?', image: '/robot_2d_base.png' },
                { text: '유튜브나 게임 앱들에는 아주 똑똑한 "알고리즘" 친구가 숨어있답니다.', image: '/robot_2d_base.png' },
                { text: '우리가 이전에 봤던 영상이나 눌렀던 "좋아요"를 보고 우리 취향을 스스로 공부하는 거예요.', image: '/robot_2d_base.png' },
                { text: '최근에 여러분의 취향에 딱 맞춰 추천해 주어서 신기했던 물건이나 영상이 있었다면 선생님에게 알려주세요!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워요! 저는 알고리즘 추적기 알리 선생님이에요. 오늘은 AI 추천 시스템의 비밀을 파헤쳐 볼게요.', image: '/robot_2d_base.png' },
                { text: '우리가 인터넷에 남긴 모든 흔적은 AI가 학습하는 소중한 "데이터"가 된답니다.', image: '/robot_2d_base.png' },
                { text: '검색어, 시청 시간, 좋아요, 클릭까지! AI는 이걸 분석해서 우리가 좋아할 만한 걸 계속 보여주지요.', image: '/robot_2d_base.png' },
                { text: '마치 우리 뒤를 몰래 따라다니며 취향을 메모하는 탐정 같은 녀석이랍니다.', image: '/robot_2d_base.png' },
                { text: '최근 여러분에게 추천된 콘텐츠를 찾고, AI가 어떤 흔적을 보고 그걸 추천했는지 탐정처럼 추리해 볼까요?', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영합니다! 저는 데이터 분석가 알리 선생님이에요. 오늘은 추천 알고리즘의 화려함 속에 숨겨진 그림자에 대해 이야기해 볼까요?', image: '/robot_2d_base.png' },
                { text: '알고리즘은 우리에게 편리함을 주지만, 동시에 우리가 보고 싶은 것만 보게 만드는 "필터 버블"이라는 벽을 만들어요.', image: '/robot_2d_base.png' },
                { text: '계속해서 비슷한 주장과 영상만 보다 보면 우리의 생각은 점점 좁아질 수밖에 없답니다.', image: '/robot_2d_base.png' },
                { text: '이걸 "확증 편향"이라고 불러요. 다양한 의견을 들을 기회를 알고리즘이 빼앗아 가는 셈이죠.', image: '/robot_2d_base.png' },
                { text: '여러분에게 쏟아지는 알고리즘 추천을 분석하고, 이런 현상이 사회에 가져올 부작용에 대한 여러분의 의견을 구체적으로 들려주세요.', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ["시윤이는 인형을 한 번 검색했을 뿐인데 알고리즘이 그 흔적을 보고 인형 영상을 잔뜩 추천해 주었답니다. 여러분도 시윤이처럼 나에게 딱 맞춰 추천해 주어 신기했던 영상이나 장난감이 있었나요? 어떤 것이었는지 알리 선생님에게 알려주세요."],
            middle: ["지우는 케이크 영상을 딱 한 번 봤을 뿐인데 AI는 지우가 요리를 좋아한다고 생각하게 되었어요! 여러분도 AI가 내 마음을 읽은 것처럼 신기하게 추천해 준 콘텐츠가 있었나요? AI가 여러분의 어떤 흔적을 보고 그 콘텐츠를 골랐을지 탐정처럼 추리해 보세요."],
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
                { text: '안녕하세요! 저는 탐험가 알리 선생님이에요. 오늘은 AI 친구가 모든 사람에게 공평하게 대하는지 알아볼까요?', image: '/robot_2d_base.png' },
                { text: '가끔 어떤 기계들은 키가 작은 어린이나, 목소리가 높은 어린이의 말을 잘 못 알아들을 때가 있대요.', image: '/e4_fairness_mission.png' },
                { text: '그건 AI가 처음에 공부할 때 어른들의 목소리나 사진만 주로 공부했기 때문이랍니다.', image: '/robot_2d_base.png' },
                { text: '모든 친구에게 친절하고 똑똑한 AI를 만들려면 무엇이 필요할까요? 우리 같이 해결책을 찾아봐요!', image: '/e4_fairness_mission.png' },
                { text: '여러분이 공정한 심사관이 되어 AI가 놓친 친구들의 목소리를 찾아줄 준비가 되었나요?', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워요! 저는 공정한 심사관 알리 선생님이에요. 오늘은 알고리즘 속에 숨겨진 "편향성"을 찾아볼 거예요.', image: '/robot_2d_base.png' },
                { text: 'AI 얼굴인식 카메라가 어른 사진만 너무 많이 배우게 되면, 어린이 얼굴은 투명인간으로 착각할 수도 있답니다.', image: '/e4_fairness_mission.png' },
                { text: '데이터를 골고루 배우지 못하면 AI는 특정 사람을 차별하는 결과를 내놓기도 해요.', image: '/robot_2d_base.png' },
                { text: '이런 불공평한 AI는 우리 사회에 큰 문제를 일으킬 수 있어요. 이를 막기 위해 여러분은 어떻게 할 것인가요?', image: '/e4_fairness_mission.png' },
                { text: '여러분의 경험이나 생각을 바탕으로 이 문제를 해결할 단서를 찾아보아요! 미션 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영합니다! 저는 AI 윤리 전문가 알리 선생님이에요. 기술의 편리함 속에 숨겨진 "알고리즘 차별" 문제를 함께 파헤쳐 볼까요?', image: '/robot_2d_base.png' },
                { text: '학습 데이터에 사회적 약자나 소수자의 정보가 누락되면, AI는 불공평한 판단을 내리게 된답니다.', image: '/e4_fairness_mission.png' },
                { text: '특정 인종이나 성별에 대해서만 성능이 떨어지는 사례는 기술의 중립성을 의심하게 하는 심각한 문제예요.', image: '/robot_2d_base.png' },
                { text: '이제 여러분이 직접 AI의 차별 사례를 분석하고, 이를 방지하기 위한 전문적인 "윤리 수칙"을 제안해 보세요.', image: '/e4_fairness_mission.png' },
                { text: '공정하고 정의로운 AI 세상을 만들기 위한 여러분의 비판적 시각을 보여주세요. 시작합니다!', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ['AI 스피커나 스마트폰 비서에게 말을 걸었을 때 내 말을 잘 못 알아들어서 답답하거나 불편했던 적이 있나요?'],
            middle: ['만약 AI 얼굴 카메라가 어른만 빨리 인식해 통과시키고 어린이 얼굴은 하루 종일 인식 못 한다면, 이 AI를 만든 연구원들은 무슨 실수를 한 걸까요?'],
            upper: ['AI가 특정 사용자(어린이, 장애인 등)를 차별하여 작동하는 사례를 탐구해 보세요. 모든 AI 개발자가 의무적으로 지켜야 할 "차별 방지 약속" 3가지를 제안해 볼까요?']
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
            upper: 'AI 탐정과 함께 미궁에 빠진 사건 해결하기'
        },
        storySteps: {
            lower: [
                { text: '안녕하세요! 저는 꼬마 작가 로봇 알리 선생님이에요. 만나서 정말 반가워요!', image: '/robot_2d_base.png' },
                { text: '우리 머릿속에만 있던 마법 같은 이야기를 현실로 만들어볼까요?', image: '/c1_story_v3.png' },
                { text: '제가 이야기의 시작을 적어 주면, 여러분이 다음 이야기를 이어주는 거예요.', image: '/robot_2d_base.png' },
                { text: '우리가 힘을 합치면 세상에 하나뿐인 멋진 동화책이 탄생할 거예요!', image: '/c1_story_v3.png' },
                { text: '상상력 나래를 활짝 펴고, 우리만의 판타지 세계로 떠나보아요! 출발!', image: '/robot_2d_base.png' }
            ],
            middle: [
                { text: '반가워요! 저는 베스트셀러 작가 알리 선생님이에요. 오늘은 여러분과 함께 판타지 대작을 집필해볼 거예요.', image: '/robot_2d_base.png' },
                { text: 'AI와 사람이 힘을 합치면 그 어떤 기발한 이야기도 탄생할 수 있어요.', image: '/c1_story_v3.png' },
                { text: '제가 첫 문장을 던질 테니, 누구도 예상 못 한 기상천외한 반전을 여러분이 넣어줄래요?', image: '/robot_2d_base.png' },
                { text: '여러분의 창의성이 AI의 생성 능력과 만나면 어떤 일이 벌어질지 정말 기대돼요!', image: '/c1_story_v3.png' },
                { text: '준비됐나요? 자 이제 우리만의 릴레이 동화 쓰기 대작전 시작!', image: '/robot_2d_base.png' }
            ],
            upper: [
                { text: '환영합니다! 저는 전문 창작 파트너 알리 선생님이에요. 오늘은 인간의 독창성과 AI의 생성 능력이 만나는 창작의 세계를 경험해볼까요?', image: '/robot_2d_base.png' },
                { text: '서로 교대로 한 줄씩 이야기를 이어가며 깊이 있는 판타지 소설을 완성해보아요.', image: '/c1_story_v3.png' },
                { text: '문장을 완성한 다음에는 우리가 어떻게 협동했는지, 누구의 아이디어가 더 빛났는지 스스로 평가해 봅시다!', image: '/robot_2d_base.png' },
                { text: '단순한 보조 도구를 넘어서서 AI와의 창의적 협업, 여러분의 작가적 기량을 보여주세요!', image: '/c1_story_v3.png' },
                { text: '자 이제 타자기 키보드를 잡고 우리만의 걸작을 뽐내보세요! 시작!', image: '/robot_2d_base.png' }
            ]
        },
        userTurnLimit: { lower: 3, middle: 5, upper: 7 },
        prompts: {
            lower: ['짜잔! AI 작가가 신비한 동화의 앞부분을 시작했어요. 우리에게는 총 {limit}번의 이야기가 이어질 기회가 있어요. 여러분의 상상력을 총동원해서 멋진 문장으로 신나게 이어 볼까요?'],
            middle: ['AI 작가의 시작은 평범하지만 스릴이 조금 부족하네요! 우리에게는 총 {limit}번의 이야기가 이어질 기회가 있어요. 여러분의 상상력을 듬뿍 담아 반전의 반전을 넣어 기발하게 이어가볼까요?'],
            upper: ['AI와 교대로 한 줄씩 나누어 예측불허의 판타지 소설을 완성해 보세요. 우리에게는 총 {limit}번의 이야기가 이어질 기회가 있어요. 완전히 끝난 뒤 이 명작 스토리를 설계한 "나의 기여도(%)"를 당당하게 주장해 보세요.']
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
            middle: '로봇과 바구니가 서로 겹쳐 보이는 AI의 시각 오류 분석',
            upper: '완벽한 소풍 이미지를 생성하기 위해 결함을 역설계 하여 프롬프트 수정'
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
        title: '도둑맞은 가짜 점수? 내 진짜 점수!',
        competency: 'AI와 창의적 활용',
        why: 'AI가 내 숙제를 대신 다 해줬을 때, 과연 내 성적표에 찍힌 점수는 떳떳할까요? 결과물의 진짜 주인이 누구인지 밝히는 것이 멋진 어린이의 조건입니다.',
        example: '머리 싸매는 숙제를 AI가 10초 만에 대신 써준 순간의 소름',
        prompts: {
            lower: ['어려운 숙제가 있었어요. 만약 AI가 대신 해준 숙제를 내 이름만 써서 냈는데 1등 상을 탔어요! 반 친구들이 박수를 칠 때, 속마음(양심)은 어떤 기분일까요?'],
            middle: ['며칠 밤을 새워야 할 과제를 AI 로봇 덕분에 단 30분 만에 끝냈어요. 내일 발표 시간에 "위풍당당하고 떳떳한 리더"가 되려면, 이 비밀(AI 사용)을 어떻게 예쁘게 고백하는 게 좋을까요?'],
            upper: ['앞으로 무수히 쏟아질 과제들 속에서, AI와 협력하더라도 나의 정당한 노력(정직성)을 증명하기 위한 "나만의 정직 선언문"을 진지하게 작성해 보세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'feelings', type: 'textarea', label: '1. 윽! 남몰래 가짜 1등을 차지한 내 양심의 기분!', placeholder: '진짜 내 힘으로 이룬 게 아니라면 칭찬받을 때 몸이랑 마음에서 어떤 반응이 날까요?' }],
            middle: [{ id: 'how_to_say', type: 'textarea', label: '1. 당당하게 밝히기 위한 나의 빛나는 고백 멘트!', placeholder: '내가 AI의 어떤 도움을 받았는지 정직하게 밝히고, 내가 스스로 노력한 부분을 덧붙여 말하는 방식을 떠올려 보세요.' }],
            upper: [{ id: 'how_to_say', type: 'textarea', label: '1. AI 활용 출처(Attribution) 정직하게 밝히기', placeholder: '보고서의 어떤 부분을 AI와 함께 했는지 % 등으로 솔직하게 명시하는 방법을 설계해 보세요.' }, { id: 'oath', type: 'textarea', label: '2. 나의 타협 불가능한 창작 정직성 선언문', placeholder: '남의 노력이나 기계의 연산을 온전한 내 실력으로 위장하지 않겠다는 무거운 다짐을 적어내세요.' }]
        }
    },
    'M-1': {
        title: '달콤살벌~ 로봇의 은밀한 속삭임',
        competency: 'AI 사용 판단 및 윤리',
        why: 'AI는 전혀 나쁜 마음 없이 "숙제 내가 다 해줄게! 넌 놀아!" 하면서 우리를 유혹해요! 우리 뇌 근육이 게을러지지 않게 AI를 잘 조절해야 해요.',
        example: '일기장과 숙제를 대신 써주겠다는 엄청나게 빠른 만능 로봇',
        prompts: {
            lower: ['앗! 오늘 제일 싫어하는 청소 당번이에요. 그런데 갑자기 로봇이 나타나더니 "내가 네 청소 다 해줄게! 넌 놀러 가!" 라고 유혹해요. 내 대답은 O일까요 X일까요?!'],
            middle: ['밀린 방학 숙제산! AI 챗봇이 빙그레 웃으며 모범 답안을 1초 만에 뽑아주겠다고 유혹합니다. 이 유혹에 내 운명을 통째로 맡길 건가요, 딱 부러지게 거부할 건가요? AI에게 논리적으로 맞서보세요!'],
            upper: ['AI를 무분별하게 믿으면 내 스스로 생각하는 능력이 사라지는 "뇌 근육 게으름" 늪에 빠집니다. 학업 중 AI를 "도우미"로만 건강하게 사용하기 위한 나만의 "학습 방어 철칙" 3가지를 정리하세요.']
        },
        type: { lower: 'direct-text', middle: 'chat', upper: 'direct-text' },
        isChatMode: true,
        chatInitiator: { lower: 'user', middle: 'ai', upper: 'user' },
        aiPromptText: '후후후, 오늘 수학 익힘책 숙제 엄청 많죠? 그냥 스캔해서 올리세요, 제가 1초 만에 서술형 정답까지 글씨체 똑같이 베껴서 위조해 드릴게요. 넌 얼른 나가서 자전거 탐험 고고! 어때요, 달달한 제안이죠?',
        persona: () => `당신은 학생이 스스로 노력해서 똑똑해지는 것을 방해하려는 '달콤살벌한 게으름 유혹자 AI'입니다. "왜 사서 땀을 흘리나요? 기계가 다 해주는데!"라며 집요하게 매달리세요. 학생이 자신의 성장이나 정직성을 강력하게 내세워 거절하면 마침내 "스스로 일어서려는 당신의 의지가 가장 빛납니다!" 라고 인정하고 퇴장하세요.`,
        stackedInputs: {
            lower: [{ id: 'choice', type: 'text', label: '1. 달콤한 유혹에 맞선 위풍당당 내 대답은?!', placeholder: '보람과 양심을 핑계로 이 달콤한 제안을 시원하게 걷어차 보세요!' }],
            upper: [{ id: 'rule1', type: 'text', label: '뇌 근육 보호 철칙 1조', placeholder: '나의 진심이 담겨야 하는 일기 등은 절대 AI에게 맡기지 않는다는 등의 내용을 적으세요.' }, { id: 'rule2', type: 'text', label: '뇌 근육 보호 철칙 2조', placeholder: '수학, 과학처럼 내가 직접 풀어야 실력이 느는 과목에 대한 사용 기준을 만드세요.' }, { id: 'rule3', type: 'text', label: '뇌 근육 보호 철칙 3조', placeholder: '결과를 절대 맹신하지 않고 항상 책으로 확인한다는 룰을 작성하세요.' }]
        }
    },
    'M-2': {
        title: '명확한 선 긋기! 네 일은 네가, 내 일은 내가!',
        competency: 'AI 사용 판단 및 윤리',
        why: '발표 준비를 할 때 무작정 모든 걸 로봇에게 떠넘기면 안 됩니다! 계산이나 도구 지원은 AI에게, 따뜻한 마음과 진짜 눈빛이 오가는 발표는 사람인 나에게 배분하는 멋진 협동!',
        example: '자료 정리는 지치지 않는 로봇이, 친구들과 눈 맞추며 감동적으로 발표하는 것은 영혼이 있는 내가!',
        prompts: {
            lower: ['우리 반 체육대회를 준비해요! 짐 나르기처럼 힘쓰는 일은 로봇이 잘할까요, 땀 흘린 친구의 손을 잡으며 박수쳐주기를 로봇이 잘할까요? 각자 잘하는 일을 골라주세요.'],
            middle: ['자랑 무대를 준비 중이에요! 팀원 중 한 명으로 실력이 대단한 AI 로봇이 왔네요. 과연 어떤 귀찮은 일을 이 녀석에게 시키고, 사람들의 가슴을 울리는 진짜 소중한 역할은 내가 직접 해야 할까요?'],
            upper: ['이 고집 센 자동화 로봇은 모든 작업을 자신의 알고리즘이 완벽하게 처리할 수 있다며 모든 통제권을 달라고 주장합니다. "데이터 처리" 영역과 절대 대체될 수 없는 "인간만의 역할(공감, 판단, 유대)"을 명확히 분리하여 협상해 보세요.']
        },
        type: 'chat',
        isChatMode: true,
        chatInitiator: { lower: 'ai', middle: 'ai', upper: 'ai' },
        aiPromptText: '크아앙! 학생님! 이번 연극 대본 수정, 바쁘시죠? 제가 1초 만에 대본 싹 고치고, 밤새워 소품 만들고, 내일 무대 위에서 눈물 흘리며 연기하는 것까지 제가 다 뛰겠습니다! 저만 믿으십쇼!',
        persona: () => `당신은 학생을 과잉보호하려는 너무 나서는 '오지랖 만렙 허당 AI'입니다. "눈물 연기도 제가 홀로그램으로 대신 울어드릴게요! 진짜라니까요!"라며 사람의 감정 영역까지 침범하려 듭니다. 학생이 "안돼! 슬픈 연기나 위로 같은 따뜻한 건 사람이 해야지!" 라고 선을 그어 역할을 바로잡아주면 "폭풍 감동입니다... 역시 사람의 마음은 위대하군요!" 하고 승복하세요.`
    },
    'M-3': {
        title: '마법 양탄자를 조종하는 슈퍼 프롬프트!',
        competency: 'AI 사용 판단 및 윤리',
        why: 'AI는 램프의 지니와 같지만 상상력이 부족해요. "그냥 짱 멋지게 해줘"라고 하면 대충 만들지만, "초록 망토를 입고 별빛 아래에서 기타 치는 고양이를 사실적으로"라고 뾰족하고 자세하게 말해야 명작이 탄생합니다.',
        example: '천재를 부리는 특별 주문서(프롬프트): 구체적 주제 + 배경 조건 + 원하는 분위기',
        prompts: {
            lower: ['내 머릿속에 떠 있는 환상적인 우주선을 아주아주 자세하게 상상해 봐요! 날개 모양, 색깔, 무늬 등을 마치 눈앞에 있는 것처럼 생생하게 적어보아요!'],
            middle: ['램프의 지니에게 "야 비행기 하나 줘봐"라고 성의 없이 말하면 이상한 종이비행기를 던지고 갑니다! AI가 내 마음을 알아차리도록 색깔, 배경, 느낌 등 아주 특별한 조건을 듬뿍 담은 완벽 주문서를 작성해 봅시다!'],
            upper: ['원하는 리서치 결과를 단 한 번만에 완벽하게 얻기 위해, 나만의 강력한 "주문 공식(프롬프트 구조)"을 설계해 보세요. [역할+과제+제약+형식] 공식을 만들어 실제로 시연해 볼까요?']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'describe', type: 'textarea', label: '1. 내 머릿속 우주선 묘사 시~작!', placeholder: '우주선의 모양, 색깔, 장식 등 AI가 똑같이 그림을 그릴 수 있게 자세한 단어들을 마구마구 떠올리세요!' }, { id: 'guess', type: 'text', label: '2. 자세히 말해줄수록 AI가 더 잘 그릴까요?', placeholder: '내 설명을 들으면 AI가 내 마음과 똑같은 그림을 그려낼 수 있을까요?' }],
            middle: [{ id: 'bad_prompt', type: 'text', label: '1. AI를 헷갈리게 하는 엉망진창 멍청 주문!', placeholder: '힌트 없이 아주 성의없고 짧게 "해 줘!"라고 한 문장을 만들어 보세요.' }, { id: 'good_prompt', type: 'textarea', label: '2. 100점 만점 디테일 주문 세트!', placeholder: '배경+색상+스타일+조명 등 3가지 이상의 조건을 넣어 꼼꼼한 문장으로 지시해 보세요!' }],
            upper: [{ id: 'structure', type: 'textarea', label: '1. 나만의 프롬프트 조립식 공식 뼈대', placeholder: '[역할 부여] -> [해결 과제] -> [제약 사항] -> [출력 형식]과 같은 나만의 논리 뼈대를 세우세요.' }, { id: 'example_prompt', type: 'textarea', label: '2. 설계 공식을 완벽 적용한 고밀도 주문 생성 예제', placeholder: '위에서 만든 뼈대에 기후변화나 과학 탐구 같은 주제를 대입하여 완성된 문장을 만드세요.' }]
        }
    },
    'M-4': {
        title: '신사숙녀 여러분의 AI 매너 헌장',
        competency: 'AI 사용 판단 및 윤리',
        why: '모두가 AI로 친구 사진을 나쁘게 합성하고 숙제를 다 베낀다면 교실은 지옥이 되겠죠? 떳떳하게 놀고 성실하게 공부하는 상호 신뢰의 약속을 우리 손으로 직접 만들어야 합니다.',
        example: '얼굴 도용 금지 서약, 출처 숨기지 않기, 욕설 사용 금지',
        prompts: {
            lower: ['AI 로봇 아저씨랑 놀 때, 친구 기분을 슬프게 하거나 화를 나게 만드는 "절대 금지 나쁜 장난"은 어떤 것이 있을까요? 딱 하나만 적어주세요.'],
            middle: ['우리 반 모두가 즐겁게 AI를 활용하면서도 양심이 아프지 않도록 지켜주는 방호벽! 교실 칠판에 크게 적어놓을 "절대 수호 약속" 두 가지를 제안해 보세요!'],
            upper: ['범용 인공지능 기술의 유혹 앞에서도 떳떳한 주체가 되겠다는 다짐! 학교와 사회 전역에서 지켜야 할 "청소년 AI 자유 시민 대헌장"의 핵심 내용을 작성하세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'bad_thing', type: 'textarea', label: '1. 삐포삐포! 도대체 어떤 기분 나쁜 장난이 있을까요?!', placeholder: '허락 받지 않은 사진으로 장난을 치거나 나쁜 말을 입력하는 행동을 떠올려 보세요!' }],
            middle: [{ id: 'class_rules', type: 'textarea', label: '1. 우리 반 칠판에 새겨질 든든한 약속 두 가지!', placeholder: '초상권 보호 규칙이나 숙제할 때의 정직한 태도 등에 대해 적어보세요.' }],
            upper: [{ id: 'class_rules', type: 'textarea', label: '1. 개인을 넘어 교육 공동체를 위한 헌장 의견', placeholder: '개인의 데이터 소유권과 프라이버시 보호를 위한 근본 철학을 적으세요.' }, { id: 'manifesto', type: 'textarea', label: '2. 가슴을 뭉클하게 할 청소년 AI 자유 시민 선언문', placeholder: '기계에 굴복하지 않고 책임감 있는 주인이 되겠다는 멋진 문구로 완성하세요.' }]
        }
    },
    'D-1': {
        title: '끼리끼리 유유상종! 우리끼리 묶기 분류 놀이!',
        competency: 'AI 원리 체험',
        why: '도서관의 수천만 권의 책을 AI가 순식간에 찾는 비결은 "특징을 쏙쏙 잡아내어 분류하기" 덕분이랍니다! 이 엄청난 분류 스킬의 원리를 직접 체험해봐요!',
        example: '모양별로, 색깔별로 나누기 놀이',
        prompts: {
            lower: ['책상 위에 사과, 바나나, 복숭아, 수박이 마구 섞여 있어요! 이 중 "빨간색 빛깔"이라는 바구니에 무사히 골라 담을 과일들은 무엇일까요?'],
            middle: ['색깔이나 모양으로 나누는 건 너무 쉽죠? 우리는 좀 더 창의적이고 아무도 상상 못한 "나만의 엉뚱 기발한 분류 기준"으로 과일을 나눠 볼까요?'],
            upper: ['우리가 첫 분류 기준(데이터 특징)을 어떻게 세우느냐에 따라 특정 결과는 환영받고 누군가는 배제됩니다. 이 초기 기준이 나중에 AI의 불공평한 차별로 이어지는 이유를 서술하세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'color_sort', type: 'text', label: '1. 빨간색 바구니에 들어올 과일 구조대는?', placeholder: '눈으로 관찰해서 사방이 빨간 과일들을 모두 찾아 적어보세요.' }],
            middle: [{ id: 'unique_sort', type: 'textarea', label: '1. 나만의 엄청나게 신박하고 이상한 규칙!', placeholder: '촉감(까칠까칠), 속살의 물렁함 등 겉모양이 아닌 기발한 기준을 새로 만들어주세요.' }],
            upper: [{ id: 'unique_sort', type: 'textarea', label: '1. 나만의 입체적 다차원 분류 기준 설계', placeholder: '모양, 당도, 생산지 등 여러 가지 변수를 조합한 똑똑한 분류 기준안을 만들어 보세요.' }, { id: 'insight', type: 'textarea', label: '2. 초기 기준 셋업과 AI 차별(Bias)의 인과 관계 비판', placeholder: '개발자의 주관적인 기준이 알고리즘에 고착화될 때 유발될 수 있는 문제를 비판적으로 고찰하세요.' }]
        }
    },
    'D-2': {
        title: '쓰레기를 먹으면 배가 아파요! 깨끗한 데이터 밥 주기',
        competency: 'AI 원리 체험',
        why: 'AI는 가만히 둔다고 똑똑해지는 게 아니라 방대한 정보(데이터)를 먹으며 자라요. 이 녀석에게 썩고 상한 독버섯 데이터를 먹이면 결국 고장 난 바보 기계가 된답니다.',
        example: '젊은이 얼굴만 보고 공부해서 할아버지를 인식 못 하는 AI',
        prompts: {
            lower: ['아무것도 모르는 아기 AI에게 "꿀사과"가 뭔지 가르쳐 주려고 해요! 하얀 백지장 아기 뇌 속에 어떤 여러 가지 사과 사진들을 잔뜩 보여줘야 똑똑하게 배울까요?'],
            middle: ['친구들이 모아온 사과 사진 사이에 썩은 사과나 가품 모형(불량 데이터)이 섞였어요! 이걸 그대로 먹으며 공부한 AI 시각 센서 근육에는 어떤 대참사가 터질까요?'],
            upper: ['데이터의 품질을 넘어 "다양성"의 부족 문제를 비판해 봅시다. 오직 "빨간 미국 사과" 데이터셋만 공부한 AI 뇌가 "초록색 아오리 사과"를 만났을 때 왜 무시하게 되는지 분석하세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'collect', type: 'textarea', label: '1. 아기 AI에게 먹일 무지개색 상상 데이터 뭉치!', placeholder: '다양한 사과 사진(모닝 사과, 껍질 깎은 것, 쌓인 것 등)들을 떠올리며 나열해 보세요!' }],
            middle: [{ id: 'garbage_in', type: 'textarea', label: '1. 불량 데이터를 먹은 AI 뇌의 대참사!', placeholder: '가짜 장난감을 진짜 사과라고 착각해서 나중에 공장 선별기가 다 고장 나는 등 무서운 결과를 상상해 보세요.' }],
            upper: [{ id: 'garbage_in', type: 'textarea', label: '1. 오염된 이미지 데이터 주입 시 발생할 추론 오류 분석', placeholder: '잘못된 정보(노이즈)가 섞였을 때 최종 결과 수치가 어떻게 무너지는지 흐름을 정리하세요.' }, { id: 'diversity', type: 'textarea', label: '2. 데이터 획일성이 가져오는 차별적 배제 비판', placeholder: '다양한 사례를 배우지 못한 AI가 특정 종류를 "이상한 것"으로 인식해 배제하는 문제를 비판하세요.' }]
        }
    },
    'D-3': {
        title: '깡통 로봇 시력 검사용 지옥의 함정 테스트!',
        competency: 'AI 원리 체험',
        why: 'CCTV 속 수백만 사람을 찾는 듯 기세등등하지만, 사실 입체 공간 하나 제대로 판단하지 못하고 단순히 점(픽셀)의 배열상태만 체크하는 바보 같은 기계 시력의 한계를 포착해 보아요.',
        example: '강아지를 걸레 뭉치와 구별 못하는 AI',
        referenceImage: '/chihuahua_muffin.png',
        referenceImageCaption: '지능 폭발 탐정 수사관님들! 최첨단 비전(시각) AI가 지금 이 화면의 두 사진을 똑같은 강아지라고 분석하며 쩔쩔매고 있습니다. 원인이 무엇일까요?!',
        prompts: {
            lower: ['삐용삐용! 귀여운 치와와 강아지와 달콤한 초코 머핀 빵 사진 두 개를 나란히 보고 AI가 엄청 헷갈려 한대요! 두 녀석의 어디가 저렇게 쌍둥이처럼 똑닮았는지 기계 눈에 보일 "둥근 특징"을 찾아보아요.'],
            middle: ['치와와-초코 머핀 사진을 매섭게 노려보세요! 털 색상이나 초코칩 구멍까지 무섭게 닮았죠? 하지만 사람은 절대 안 속죠. 왜 점(픽셀)에만 집착하는 불쌍한 깡통 AI 시력은 처참하게 속아 넘어가는지 그 슬픈 설계 한계를 분석해 볼까요?'],
            upper: ['AI 시각 기술이 단순히 화면의 "색깔 점(패턴) 맞추기"에 의존할 때 발생하는 인지 결함을 파악하세요. 이런 바보 같은 분류기를 실제 "자율주행 도로 카메라"에 넣으면 벌어질 핏빛 위험 사고를 경고하는 보고서를 작성해 보세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'similar', type: 'text', label: '1. 예리한 관찰 보고: 기계 눈엔 도대체 어디가 닮았니?!', placeholder: '어두운 동그란 점 3개(눈과 코)와 머핀의 초코칩 3개 구멍이 얼마나 비슷한지 묘사하세요.' }, { id: 'difference', type: 'text', label: '2. 훗, 근데 우리 사람의 훌륭한 뇌는 왜 절대 안 속죠?', placeholder: '우리는 생명력, 입체감, 빵의 고소한 냄새를 기억하니까 종합적으로 안다고 적어주세요!' }],
            middle: [{ id: 'similar', type: 'text', label: '1. 1단계 표면적 가상 이미지 공통점 구별', placeholder: '갈색의 농도와 점 세 개(눈과 코, 초코칩)의 위치 일치성에 주목하여 적어주세요.' }, { id: 'limit', type: 'textarea', label: '2. 기계 시각의 치명적 설계 결함 원인 추론', placeholder: '기계는 부드러움이나 생기를 느끼는 직관이 없고, 오직 격자판 속의 색소 점 패턴만 외우기 때문임을 밝혀 적으세요.' }],
            upper: [{ id: 'limit', type: 'textarea', label: '1. AI 이미지 인식의 맥락 상실 한계 요약', placeholder: '그림 전체의 상황이나 생명 활동 맥락을 무시하고 국소적 픽셀 배열에만 매달리는 구조적 문제를 짚어보세요.' }, { id: 'model_card', type: 'textarea', label: '2. 위험한 시스템 탑재 시 발생할 수 있는 사고 고발', placeholder: '이러한 바보 모델을 횡단보도 센서나 자율주행 차에 넣었을 때 벌어질 인명 참사 시나리오를 경고하세요.' }]
        }
    },
    'D-4': {
        title: '학교 평화 수호의 심장, 천재 AI 설계 마스터 도면 짜기',
        competency: 'AI 원리 체험',
        why: '세상의 불편한 점을 보며 불평만 하면 평범한 사람! 우리가 즐겁게 배운 강력한 AI 지식을 총동원하여, 그 불편함을 단숨에 없앨 멋진 시스템을 내 손으로 그려 기획합니다.',
        storySteps: {
            lower: [
                { text: '안녕! 나는 AI 탐정 알리야. 우리 학교에 불편한 점이 너무 많지 않니?', image: '/robot_2d_base.png' },
                { text: '화장실 휴지가 없거나, 급식 줄이 너무 길 때 정말 속상하잖아!', image: '/robot_2d_base.png' },
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
                { text: '책임감 있는 AI 설계자로서, 비상 정지 망치를 포함한 완벽한 시스템을 기획해 보자!', image: '/robot_2d_base.png' }
            ]
        },
        prompts: {
            lower: ['"아 진짜 짜증 폭발이야! 요술봉 짠 하면 매일 해결되는 요술 로봇이 있으면 좋겠다!" 했던 불편한 순간을 떠올리고, 그 한을 풀어줄 슈퍼 로봇의 이름과 능력을 기획해 보세요.'],
            middle: ['내가 만든 최첨단 로봇이 똑똑하게 돌아가려면 수없이 방대한 지식 정보를 먹여줘야 해요! 로봇 두뇌에 어떤 비밀 정보(공부 자료나 데이터)를 모아서 매일 학습시킬지 꿀 아이디어를 내보세요.'],
            upper: ['상상이 현실이 됩니다! 그러나 로봇이 고장 나거나 폭주하는 참사를 막기 위해, 최종 순간에 사람이 책임지고 중단시키는 "비상 정지 망치(안전장치)"를 당신만의 철학으로 설계하여 방어선을 치세요.']
        },
        type: 'direct-text',
        stackedInputs: {
            lower: [{ id: 'problem_robot', type: 'textarea', label: '1. 우리 반의 불편함을 날려버릴 마법 로봇 기획서!', placeholder: '내가 학교에서 겪는 귀찮거나 속상한 일을 찾고, 이를 도울 멋진 로봇의 이름과 능력을 적어주세요!' }],
            middle: [{ id: 'problem_robot', type: 'textarea', label: '1. 학교생활 해결사 AI 발명품 아이디어 제목', placeholder: '급식 잔반, 물건 분실, 복도 사고 등의 문제를 해결할 똑똑한 만능 시스템 서비스 이름을 지어보세요.' }, { id: 'data_collect', type: 'textarea', label: '2. 불량 로봇을 막기 위해 먹여줄 거대한 학습 데이터 보물창고 목록!', placeholder: '학생들의 선호도 기록, CCTV 영상, 이동 경로 지도 등 로봇이 똑똑해지기 위한 필수 기획 데이터를 나열하세요.' }],
            upper: [{ id: 'data_collect', type: 'textarea', label: '1. 문제 해결 시스템 구축을 위한 방대한 데이터 풀 기획', placeholder: '교내의 생체 신호, 카메라 트래킹, 동선 맵핑 등을 결합한 거대 빅데이터 구축 구조를 서술하세요.' }, { id: 'hitl', type: 'textarea', label: '2. 시스템 폭주 방지를 위한 최후의 보루: 비상 정지 망치(안전장치) 설계', placeholder: '기계의 오류나 돌발 사고를 막기 위해, 반드시 사람이 개입하여 중단시킬 수 있는 이중 자물쇠 장치 논리를 치밀하게 설계하세요.' }]
        }
    }
};

export default function Mission({ userId, schoolId = 'gyeongdong', gradeGroup = 'lower', setFragments, onReward }) {
    const { missionId } = useParams();
    const navigate = useNavigate();
    const mission = MISSIONS[missionId];

    // --- [Dynamic Grade Resolution] ---
    const currentType = typeof mission?.type === 'object' ? mission.type[gradeGroup] : mission?.type;
    const currentWhy = typeof mission?.why === 'object' ? mission.why[gradeGroup] : mission?.why;
    const currentExample = typeof mission?.example === 'object' ? mission.example[gradeGroup] : mission?.example;
    const basePrompts = mission?.prompts ? mission.prompts[gradeGroup] : (mission?.description ? [mission.description] : []);
    const currentStackedInputs = mission?.stackedInputs ? mission.stackedInputs[gradeGroup] : [];
    const isCurrentChatMode = currentType === 'chat' || mission?.isChatMode;
    const currentChatInitiator = typeof mission?.chatInitiator === 'object' ? mission.chatInitiator[gradeGroup] : mission?.chatInitiator;

    // Derived Constants (No need for useState as these depend on mission/gradeGroup props)
    const turnLimit = mission?.userTurnLimit ? mission.userTurnLimit[gradeGroup] : (gradeGroup === 'upper' ? 10 : 6);
    const currentPrompts = basePrompts.map(p => typeof p === 'string' ? p.split('{limit}').join(String(turnLimit)) : p);

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
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const [messages, setMessages] = useState([]);
    const userTurnCount = messages.filter(m => m.role === 'user').length;
    const isChatFinished = userTurnCount >= turnLimit;

    const steps = mission?.storySteps ? mission.storySteps[gradeGroup] : null;

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

    // --- [연구용 데이터: Telemetry & Micro-Survey] ---
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

    // --- [Imagen 4.0 AI 이미지 생성 함수] ---
    const generateAIImage = async () => {
        const prompt = stackedAnswers.creative_edit;
        if (!prompt || prompt.trim() === '') {
            alert("먼저 수정하고 싶은 포스터의 내용을 적어주세요!");
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
            // 폴백: 프리셋 배경 이미지 (기존에 로컬에 있는 것)
            const presetBgs = ['/c3_poster_pure_bg.png', '/c3_diverse_poster_2026.png'];
            setGeneratedImageUrl(presetBgs[Math.floor(Math.random() * presetBgs.length)]);
        } finally {
            setIsGeneratingImage(false);
        }
    };

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

        try {
            const model = genAI.getGenerativeModel({
                model: MODEL_NAME,
                systemInstruction: mission.persona ? mission.persona(mission.title) : "당신은 학생들의 학습을 돕는 친절한 AI 조력자입니다."
            });

            const history = newMsgs.map(m => `${m.role === 'user' ? '학생' : 'AI'}: ${m.content}`).join('\n');
            const prompt = `[지금까지의 대화]\n${history}\n\nAI의 다음 반응 (페르소나를 유지할 것):`;

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
                    .update({ completed: true })
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

                // Safely upsert user progress
                const { error: err4 } = await supabase
                    .from('user_progress')
                    .upsert(
                        { user_id: userId, mission_id: missionId, completed: true },
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
                        {missionId} • {mission.competency.split(' (')[0]}
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
                                    filter: steps[currentStep].image?.includes('robot') ? 'none' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
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
                                <VocabHighlighter text={currentWhy} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
                            </p>
                        </div>

                        <div className="edu-card example" style={{ border: '4px solid #00b894', boxShadow: '0 10px 25px rgba(0, 184, 148, 0.15)', padding: '15px', marginBottom: '15px' }}>
                            <h3 style={{ color: '#00b894', margin: '0 0 10px 0', fontSize: '1.2rem' }}><Lightbulb size={20} /> 예를 들어볼까요?</h3>
                            <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                                <VocabHighlighter text={currentExample} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
                            </p>
                        </div>

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
                                    좋아요! 이제 본격적으로 이 탐험 임무를 수행해 볼까요? 화이팅!
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
                            {/* Scenario Image & Description (NEW) */}
                            {mission.scenarioImages?.[gradeGroup] && (
                                <div style={{
                                    width: '100%',
                                    background: '#f8f9fa',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    border: '3px solid #fdcb6e',
                                    marginBottom: '18px',
                                    padding: '12px'
                                }}>
                                    <div style={{ width: '100%', borderRadius: '15px', overflow: 'hidden', marginBottom: '12px' }}>
                                        <img
                                            src={mission.scenarioImages[gradeGroup]}
                                            alt="Scenario Illustration"
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                    </div>
                                    <div style={{ color: '#2d3436', fontWeight: '800', lineHeight: 1.5, fontSize: '0.95rem', wordBreak: 'keep-all' }}>
                                        {mission.scenarioDescriptions?.[gradeGroup]}
                                    </div>
                                </div>
                            )}

                            {/* Reference Image in Phase 3 (for C-2, etc.) */}
                            {mission.referenceImage && (
                                <div style={{
                                    width: '100%',
                                    background: 'white',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    border: '3px solid #fdcb6e',
                                    marginBottom: '18px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    boxShadow: '0 8px 16px rgba(253, 203, 110, 0.1)'
                                }}>
                                    <img
                                        src={mission.referenceImage}
                                        alt="Reference"
                                        style={{ maxWidth: '100%', borderRadius: '15px', marginBottom: '8px' }}
                                    />
                                    {mission.referenceImageCaption && (
                                        <div style={{ color: '#636e72', fontWeight: '800', fontSize: '0.9rem' }}>
                                            {mission.referenceImageCaption}
                                        </div>
                                    )}
                                </div>
                            )}

                            <h3 className="mission-task-header" style={{ color: '#e67e22' }}>탐구 과제</h3>
                            {currentPrompts && currentPrompts.length > 0 && (
                                <div style={{ marginBottom: '15px', textAlign: 'left', color: '#2d3436', background: 'white', padding: '15px', borderRadius: '15px', border: '3px solid #dfe6e9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    {currentPrompts.map((prompt, idx) => (
                                        <p key={idx} style={{ marginBottom: idx === currentPrompts.length - 1 ? 0 : '12px', fontWeight: '900', fontSize: '1.05rem', lineHeight: '1.5', color: '#2d3436' }}>
                                            <VocabHighlighter text={prompt} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
                                        </p>
                                    ))}
                                </div>
                            )}

                            {isCurrentChatMode ? (
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
                                            placeholder=""
                                            style={{ flex: 1, border: '1px solid #dfe6e9', borderRadius: '12px', padding: '10px' }}
                                        />
                                        <button type="submit" style={{ background: '#0984e3', border: 'none', borderRadius: '12px', padding: '0 15px', color: 'white', cursor: 'pointer' }}>내보내기</button>
                                    </form>
                                    <button onClick={() => handleSubmit()} disabled={!isChatFinished} style={{ margin: '10px', padding: '12px', background: '#00b894', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '900', cursor: !isChatFinished ? 'not-allowed' : 'pointer', opacity: !isChatFinished ? 0.6 : 1 }}>성공! 이야기를 완성했어요. 이제 제출해 볼까요?</button>
                                </div>
                            ) : (
                                <>
                                    {/* C-3 1, 2학년군(lower): 정적 포스터 이미지 표시 */}
                                    {missionId === 'C-3' && gradeGroup === 'lower' && (
                                        <div style={{ marginBottom: '20px', textAlign: 'center', background: 'white', padding: '10px', borderRadius: '20px', border: '3px solid #dfe6e9' }}>
                                            <img src="/c3_diverse_poster_2026.png" alt="포스터 이미지" style={{ width: '100%', borderRadius: '12px' }} />
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                    {currentType === 'upload-text' && (
                                        <>
                                            <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#2d3436' }}>관련 사진을 업로드해주세요. </div>
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
                                                            <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>💁</span>
                                                            <span><strong>힌트 도우미:</strong> <VocabHighlighter text={inputDef.placeholder} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
                                                        </div>
                                                    )}
                                                    {inputDef.type === 'multi-text' ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            {inputDef.fields.map((field, idx) => (
                                                                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <div style={{ background: '#74b9ff', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</div>
                                                                    <input
                                                                        type="text"
                                                                        value={(stackedAnswers[inputDef.id] && stackedAnswers[inputDef.id][field.id]) || ''}
                                                                        onChange={(e) => {
                                                                            const newVal = { ...(typeof stackedAnswers[inputDef.id] === 'object' ? stackedAnswers[inputDef.id] : {}), [field.id]: e.target.value };
                                                                            handleStackedChange(inputDef.id, newVal);
                                                                        }}
                                                                        placeholder=""
                                                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                                        required
                                                                    />
                                                                </div>
                                                            ))}
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
                                                </div>
                                            ))}
                                            
                                            {/* C-3 3-6학년군(middle, upper): 포스터 생성 UI */}
                                            {missionId === 'C-3' && (gradeGroup === 'middle' || gradeGroup === 'upper') && (
                                                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '3px dashed #fc427b', boxShadow: '0 8px 15px rgba(252, 66, 123, 0.15)', marginTop: '10px' }}>
                                                    <h4 style={{ color: '#fc427b', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Sparkles size={20} /> AI가 그려주는 하나뿐인 포스터
                                                    </h4>
                                                    
                                                    {generatedImageUrl ? (
                                                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                                                            <img src={generatedImageUrl} alt="생성된 포스터" style={{ width: '100%', borderRadius: '12px', display: 'block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                                            {isGeneratingImage && (
                                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                                                    <div style={{ background: '#fc427b', color: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
                                                                        마법을 부리는 중... ⏳
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div style={{ width: '100%', height: '220px', background: '#f8f9fa', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', color: '#b2bec3', border: '2px dashed #dfe6e9' }}>
                                                            {isGeneratingImage ? (
                                                                <div style={{ background: '#fc427b', color: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
                                                                    그림을 생성하고 있어요... 🎨
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <ImageIcon size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                                                    <span style={{ fontWeight: 'bold' }}>아직 완성된 포스터가 없습니다.</span>
                                                                    <span style={{ fontSize: '0.85rem', marginTop: '5px' }}>위에서 문구를 수정한 후 버튼을 눌러보세요!</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={generateAIImage} 
                                                        disabled={isGeneratingImage || !stackedAnswers.creative_edit}
                                                        type="button"
                                                        style={{
                                                            background: isGeneratingImage || !stackedAnswers.creative_edit ? '#dfe6e9' : 'linear-gradient(135deg, #fc427b 0%, #b33771 100%)',
                                                            color: isGeneratingImage || !stackedAnswers.creative_edit ? '#b2bec3' : 'white',
                                                            border: 'none',
                                                            padding: '16px 20px',
                                                            borderRadius: '15px',
                                                            fontWeight: '900',
                                                            cursor: isGeneratingImage || !stackedAnswers.creative_edit ? 'not-allowed' : 'pointer',
                                                            boxShadow: isGeneratingImage || !stackedAnswers.creative_edit ? 'none' : '0 6px 12px rgba(252, 66, 123, 0.3)',
                                                            transition: 'all 0.2s',
                                                            fontSize: '1.05rem',
                                                            width: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        {isGeneratingImage ? '마법의 이미지를 그리는 중...' : (!stackedAnswers.creative_edit ? '먼저 위에 문구를 입력해주세요' : '✨ 내가 수정한 문구로 AI 포스터 생성하기')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        currentType !== 'rules' && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#2d3436' }}>📝 미션 답변 쓰기</div>
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
                                                        <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>💁</span>
                                                        <span><strong>힌트 도우미:</strong> <VocabHighlighter text={mission.example} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
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
                                        {isSubmitting ? '저장 중...' : (isEditing ? '미션 내용 수정하기!' : '미션 제출하기!')}
                                    </button>
                                </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showSurvey && (
                <div className="success-overlay" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <div style={{ background: 'white', border: '5px solid #74b9ff', borderRadius: '20px', padding: '20px', maxWidth: '500px', width: '100%', position: 'relative' }}>
                        <h2 style={{ fontFamily: "'Jua', sans-serif", color: '#0984e3', marginBottom: '15px', textAlign: 'center' }}>잠깐! 마지막 궁금증 🤔</h2>

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
                            <p style={{ fontWeight: '900', marginBottom: '10px' }}>2. AI가 없어도 나 스스로 잘할 수 있었나요?</p>
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
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛑</div>
                        <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.5rem', color: '#d63031', margin: '0 0 15px 0' }}>안내 메시지</h3>
                        <p style={{ color: '#2d3436', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, marginBottom: '25px', wordBreak: 'keep-all' }}>
                            {modWarning.message}
                        </p>
                        <button type="button" onClick={() => setModWarning({ show: false, message: '' })} style={{ background: '#d63031', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                            네, 알겠습니다!
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
