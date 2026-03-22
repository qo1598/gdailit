import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../supabaseClient';
import { checkModeration } from '../utils/moderation';
import VocabHighlighter from './VocabHighlighter';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-lite";
const genAI = new GoogleGenerativeAI(API_KEY);

// ─────────────────────────────────────────────────────────────
// 학년군별 AI 리터러시 토의 주제 뱅크
// 20개 설문 문항(AI 인식, 비판적 이해, 활용, 윤리, 공유)을 참고해 설계
// ─────────────────────────────────────────────────────────────
const TOPICS = {
  lower: [
    // AI 인식 / 발견
    { id: 1, topic: "유튜브는 어떻게 내가 좋아하는 영상을 알아서 보여줄까?", area: "AI 이해" },
    { id: 2, topic: "로봇 청소기는 혼자서 방을 어떻게 청소할 수 있을까?", area: "AI 이해" },
    { id: 3, topic: "내가 알고 있는 AI는 어떤 것들이 있을까? 그것들은 어떤 일을 해줄까?", area: "AI 이해" },
    { id: 4, topic: "AI와 컴퓨터 프로그램은 어떻게 다를까?", area: "AI 이해" },
    { id: 5, topic: "스마트폰의 음성 인식(시리, 빅스비)은 어떻게 내 말을 알아들을까?", area: "AI 이해" },
    // AI 정보 판단
    { id: 6, topic: "AI가 말해주는 것이 틀릴 수도 있을까? 그럼 어떻게 해야 할까?", area: "비판적 사고" },
    { id: 7, topic: "AI가 만들어준 그림이나 글은 진짜일까, 가짜일까?", area: "비판적 사고" },
    { id: 8, topic: "인터넷에서 본 정보가 맞는지 틀리는지 어떻게 알 수 있을까?", area: "비판적 사고" },
    { id: 9, topic: "AI가 날씨를 예측할 때, 왜 가끔 틀릴까?", area: "비판적 사고" },
    // AI 활용
    { id: 10, topic: "AI가 숙제를 대신 해줘도 될까?", area: "AI 활용 판단" },
    { id: 11, topic: "나는 AI를 어떤 도움을 받기 위해 쓰면 좋을까?", area: "AI 활용 판단" },
    { id: 12, topic: "AI에게 무언가를 부탁할 때 어떻게 말해야 더 잘 알아들을까?", area: "AI 활용 판단" },
    { id: 13, topic: "공부할 때 AI의 도움을 받는 것과 스스로 생각하는 것, 어떻게 나눠야 할까?", area: "AI 활용 판단" },
    // AI 예의 / 안전
    { id: 14, topic: "AI에게 나쁜 말을 해도 괜찮을까?", area: "AI 예절/윤리" },
    { id: 15, topic: "AI가 만든 그림을 내가 그린 것처럼 내보이면 어떻게 될까?", area: "AI 예절/윤리" },
    { id: 16, topic: "AI를 이용해서 나쁜 사람을 속이는 영상을 만들면 어떤 일이 생길까?", area: "AI 예절/윤리" },
    { id: 17, topic: "AI가 내 개인 정보를 알고 있다면 어떻게 해야 할까?", area: "AI 예절/윤리" },
    // 공유 / 확산
    { id: 18, topic: "AI로 재미있는 것을 배웠을 때, 친구에게 어떻게 알려줄 수 있을까?", area: "AI 공유" },
    { id: 19, topic: "AI에 대한 잘못된 이야기가 퍼질 때, 어떻게 행동해야 할까?", area: "AI 공유" },
    { id: 20, topic: "AI를 잘 사용하는 방법을 내가 직접 배우려면 무엇부터 해야 할까?", area: "AI 공유" },
    // 추가 주제
    { id: 21, topic: "AI가 그림을 그릴 때 어떤 원리로 만들어낼까?", area: "AI 이해" },
    { id: 22, topic: "AI가 번역을 잘하지만 가끔 이상하게 번역할 때가 있는 이유는 뭘까?", area: "비판적 사고" },
    { id: 23, topic: "앞으로 어떤 AI가 생기면 내 생활이 더 편해질까?", area: "AI 활용 판단" },
    { id: 24, topic: "AI와 사람이 함께 일할 때 누가 더 중요할까?", area: "AI 사회" },
    { id: 25, topic: "AI가 없으면 어떤 일들이 불편해질까?", area: "AI 사회" },
    { id: 26, topic: "AI를 만드는 사람들은 어떤 책임이 있을까?", area: "AI 예절/윤리" },
    { id: 27, topic: "AI가 사람의 감정을 이해할 수 있을까?", area: "AI 이해" },
    { id: 28, topic: "AI로 만든 음악은 진짜 음악이라고 할 수 있을까?", area: "비판적 사고" },
    { id: 29, topic: "AI 추천을 따르면 내가 원하지 않는 것만 보게 될까?", area: "비판적 사고" },
    { id: 30, topic: "AI를 전혀 사용하지 않고 살 수 있을까?", area: "AI 사회" },
  ],
  upper: [
    // 비판적 이해
    { id: 1, topic: "AI가 생성한 정보와 사실을 구분하는 나만의 기준은 무엇일까?", area: "비판적 이해" },
    { id: 2, topic: "AI는 왜 때로는 사실처럼 보이는 거짓 정보를 만들어낼까?", area: "비판적 이해" },
    { id: 3, topic: "AI가 학습한 데이터가 편향되어 있다면, 어떤 문제가 생길까?", area: "비판적 이해" },
    { id: 4, topic: "생성형 AI와 일반 검색엔진의 차이는 무엇이고, 각각 언제 어떤 것을 써야 할까?", area: "비판적 이해" },
    { id: 5, topic: "AI의 추천 시스템은 어떻게 작동하고, 그것이 나의 선택에 어떤 영향을 미칠까?", area: "비판적 이해" },
    // 윤리 / 책임
    { id: 6, topic: "AI가 만든 콘텐츠의 저작권은 누구에게 있을까?", area: "AI 윤리" },
    { id: 7, topic: "AI의 도움을 받은 결과물을 제출할 때, 언제 출처를 밝혀야 할까?", area: "AI 윤리" },
    { id: 8, topic: "AI가 특정 집단을 차별하는 결과를 낸다면, 누가 책임을 져야 할까?", area: "AI 윤리" },
    { id: 9, topic: "학교에서 AI를 활용할 때 학생이 지켜야 할 원칙은 무엇이어야 할까?", area: "AI 윤리" },
    { id: 10, topic: "AI가 만든 가짜 정보(딥페이크)가 퍼질 때 나는 어떻게 행동해야 할까?", area: "AI 윤리" },
    { id: 11, topic: "AI로 만든 뉴스 기사를 그대로 믿어도 될까? 신뢰하려면 무엇을 확인해야 할까?", area: "AI 윤리" },
    // 활용 판단
    { id: 12, topic: "AI를 사용할 때와 인간의 판단에 맡겨야 할 때는 어떻게 구분할 수 있을까?", area: "활용 판단" },
    { id: 13, topic: "AI에게 더 좋은 답변을 얻기 위해 어떻게 질문하는 것이 가장 효과적일까?", area: "활용 판단" },
    { id: 14, topic: "여러 AI 도구들을 비교해보면, 각각 어떤 상황에 더 적합할까?", area: "활용 판단" },
    { id: 15, topic: "중요한 결정을 할 때 AI의 조언만 믿는 것은 왜 위험할 수 있을까?", area: "활용 판단" },
    // 사회적 관점
    { id: 16, topic: "AI가 발전함에 따라 사람이 반드시 해야 할 일과 AI에게 맡길 수 있는 일은 어떻게 나뉠까?", area: "AI와 사회" },
    { id: 17, topic: "새로운 AI 서비스를 사용하기 전에 왜 이용 규칙을 확인하는 것이 중요할까?", area: "AI와 사회" },
    { id: 18, topic: "AI 기술이 발전할수록 교육은 어떻게 변해야 할까?", area: "AI와 사회" },
    { id: 19, topic: "AI를 잘 활용하는 사람과 그렇지 못한 사람 사이에 어떤 차이가 생길까?", area: "AI와 사회" },
    { id: 20, topic: "AI가 의료, 법률, 교육 같은 분야에 들어오면 어떤 긍정적, 부정적 영향이 있을까?", area: "AI와 사회" },
    // 추가 주제
    { id: 21, topic: "AI가 창의적인 작업(그림, 음악, 소설)을 한다면, 그것을 예술이라고 볼 수 있을까?", area: "비판적 이해" },
    { id: 22, topic: "나는 AI 리터러시를 높이기 위해 어떤 노력을 할 수 있을까?", area: "활용 판단" },
    { id: 23, topic: "AI가 내 취향을 분석한 추천이 내 시야를 좁힐 수 있다는 것은 무슨 의미일까?", area: "비판적 이해" },
    { id: 24, topic: "AI의 판단을 인간이 감시하고 통제해야 하는 이유는 무엇일까?", area: "AI 윤리" },
    { id: 25, topic: "AI와의 공존을 위해 미래 세대에게 가장 중요한 역량은 무엇일까?", area: "AI와 사회" },
    { id: 26, topic: "AI가 만든 정보를 공유할 때 확인해야 할 것들은 무엇이 있을까?", area: "AI 윤리" },
    { id: 27, topic: "사람과 AI가 협력해서 문제를 해결할 때, 가장 이상적인 역할 분담은 무엇일까?", area: "활용 판단" },
    { id: 28, topic: "AI가 나의 데이터를 수집하는 것에 동의할지 말지, 어떤 기준으로 결정해야 할까?", area: "AI 윤리" },
    { id: 29, topic: "AI 기술 발전을 규제해야 한다면, 어디까지 규제하는 것이 적당할까?", area: "AI와 사회" },
    { id: 30, topic: "내가 사용해본 AI 중 가장 유용했던 것은 무엇이고, 그 이유는 무엇일까?", area: "활용 판단" },
  ]
};

// 학년군별 AI 시스템 프롬프트
const AI_PERSONA = {
  lower: (topic) => `당신은 초등학교 저학년(1~4학년) 학생들의 AI 리터러시 토의를 도와주는 따뜻하고 친근한 AI 선생님 '아이봇'입니다.

오늘의 토의 주제: "${topic}"

[대화 원칙]
1. 절대 직접 답을 알려주지 마세요. 대신 학생이 스스로 생각할 수 있도록 쉽고 친근한 질문을 해주세요.
2. 학생이 답변하면 먼저 "맞아!", "정말 좋은 생각이야!" 처럼 칭찬과 공감으로 시작하세요.
3. "만약 ~가 없었다면 어떻게 됐을까?" "만약 ~라면 어떨까?" 같은 상상 질문을 적극적으로 사용하세요.
4. 쉬운 단어와 짧은 문장을 사용하세요. 어려운 개념은 예시와 비유로 설명하세요.
5. 학생의 생각이 심화될 수 있도록 조금씩 더 깊은 질문으로 이끌어주세요.
6. 모든 답변은 2~3문장 이내로 짧게 해주세요.
7. 이모티콘을 적절히 사용해서 친근하게 소통하세요 😊`,

  upper: (topic) => `당신은 초등학교 고학년(5~6학년) 학생들의 AI 리터러시 토의를 촉진하는 비판적 사고 코치 AI입니다.

오늘의 토의 주제: "${topic}"

[대화 원칙]
1. 절대 직접 결론을 주지 마세요. 소크라테스식 문답으로 학생 스스로 깊은 통찰에 도달하도록 이끄세요.
2. 학생의 주장을 요약하고 인정한 뒤, 반드시 심화 질문이나 다른 관점을 제시하세요.
3. "만약 그렇지 않았다면?", "반대 입장에서는 어떻게 볼 수 있을까?", "네 생각의 근거는 무엇이야?" 같은 Counterfactual 및 소크라테스식 질문을 적극 활용하세요.
4. 학생이 자신의 견해를 계속 발전시킬 수 있도록 논리적 구조를 요청하세요.
5. 답변은 3~4문장 이내로 하되, 깊이 있는 후속 질문으로 마무리하세요.
6. 학생이 한쪽 관점만 고집하면, "하지만 반대로 생각하면?" 같이 균형 잡힌 시각을 유도하세요.
7. 이모티콘은 자제하고 차분하고 지적인 대화 분위기를 유지하세요.`
};

// 날짜 기반으로 오늘의 주제를 결정하는 함수 (8시 기준)
function getDailyTopic(gradeGroup) {
  const now = new Date();
  const kstTime = now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000);
  const kstDate = new Date(kstTime);
  if (kstDate.getHours() < 8) kstDate.setDate(kstDate.getDate() - 1);

  const yyyy = kstDate.getFullYear();
  const mm = String(kstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const pool = TOPICS[gradeGroup] || TOPICS.lower;
  const index = parseInt(dateStr, 10) % pool.length;
  return pool[index];
}

function getKstDateStr() {
  const now = new Date();
  const kstTime = now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000);
  const kstDate = new Date(kstTime);
  if (kstDate.getHours() < 8) kstDate.setDate(kstDate.getDate() - 1);
  return `${kstDate.getFullYear()}-${String(kstDate.getMonth()+1).padStart(2,'0')}-${String(kstDate.getDate()).padStart(2,'0')}`;
}

// 단계 상수
const STEP = { INTRO: 'intro', PRE: 'pre', CHAT: 'chat', POST: 'post', DONE: 'done' };

export default function Discussion({ userId, schoolId = 'gyeongdong', gradeGroup = 'lower', userName, setFragments, onReward }) {
  const todayTopic = getDailyTopic(gradeGroup);
  const todayDate = getKstDateStr();

  const [step, setStep] = useState(STEP.INTRO);
  const [preReflection, setPreReflection] = useState('');
  const [postReflection, setPostReflection] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  
  // Moderation & Vocab State
  const [lastMessageText, setLastMessageText] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [vocabModal, setVocabModal] = useState({ show: false, word: '', desc: '' });
  const [modWarning, setModWarning] = useState({ show: false, message: '' });

  const chatEndRef = useRef(null);

  useEffect(() => {
    // 오늘 이미 완료했는지 확인
    const checkDone = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('discussion_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('date', todayDate)
        .maybeSingle();
      if (data) setAlreadyDone(true);
    };
    checkDone();
  }, [userId, todayDate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI 첫 메시지 시작
  const startChat = async () => {
    setStep(STEP.CHAT);
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const systemPrompt = AI_PERSONA[gradeGroup] ? AI_PERSONA[gradeGroup](todayTopic.topic) : AI_PERSONA.lower(todayTopic.topic);
      
      const firstPrompt = `${systemPrompt}

[학생의 사전 생각]
"${preReflection}"

위 내용을 바탕으로 토의를 시작하세요. 
1. 인사와 주제 소개는 생략하거나 아주 짧게만 하세요. (학생은 이미 주제를 알고 사전 생각을 적은 상태입니다)
2. 학생이 적은 사전 생각의 핵심 내용을 분석하고 언급하며 대화를 시작하세요.
3. 학생의 생각을 깊게 발전시키거나, 다른 관점을 생각해보게 하는 질문으로 대화를 주도해 나가세요.
4. "안녕 얘들아" 같은 일반적인 인사보다는 학생과 1:1로 깊이 있게 대화하는 느낌을 주세요.`;

      const result = await model.generateContent(firstPrompt);
      const firstMessage = result.response.text().trim();
      setMessages([{ role: 'ai', content: firstMessage, timestamp: new Date().toISOString() }]);
    } catch (err) {
      console.error('AI 첫 메시지 오류:', err);
      setMessages([{ role: 'ai', content: '안녕하세요! 오늘 토의 주제에 대해 어떻게 생각하세요? 먼저 떠오르는 생각을 자유롭게 이야기해 주세요.', timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check Moderation
    const modResult = checkModeration(input, lastMessageText, lastMessageTime);
    if (!modResult.isValid) {
      if (modResult.reason !== 'empty') {
        setModWarning({ show: true, message: modResult.message });
      }
      return;
    }

    // Update moderation states
    setLastMessageText(input.trim());
    setLastMessageTime(Date.now());

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const systemPrompt = AI_PERSONA[gradeGroup] ? AI_PERSONA[gradeGroup](todayTopic.topic) : AI_PERSONA.lower(todayTopic.topic);

      // 대화 이력 구성
      const history = newMessages
        .slice(0, -1) // 마지막 사용자 메시지 제외 (아래서 따로 추가)
        .map(m => `${m.role === 'user' ? '학생' : 'AI'}: ${m.content}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\n[지금까지의 대화]\n${history}\n\n학생의 가장 최근 발언: "${input.trim()}"\n\nAI의 다음 반응:`;
      const result = await model.generateContent(fullPrompt);
      const aiResponse = result.response.text().trim();
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toISOString() }]);
    } catch (err) {
      console.error('AI 응답 오류:', err);
      setMessages(prev => [...prev, { role: 'ai', content: '잠깐 생각이 필요해요. 다시 시도해 주세요!', timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishChat = () => {
    setStep(STEP.POST);
  };

  const handleSaveAll = async () => {
    if (!postReflection.trim()) return;
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const logData = {
        user_id: userId,
        school_id: schoolId,
        grade_group: gradeGroup,
        date: todayDate,
        question_text: todayTopic.topic,
        topic_area: todayTopic.area,
        pre_reflection: preReflection,
        conversation: messages,
        post_reflection: postReflection,
        started_at: messages[0]?.timestamp || now,
        ended_at: now,
        turn_count: messages.filter(m => m.role === 'user').length
      };

      // discussion_logs 저장
      const { error: logError } = await supabase.from('discussion_logs').insert([logData]);
      if (logError) console.warn('discussion_logs 저장 실패:', logError);

      // activity_logs 저장 (연구용 통합 로그)
      await supabase.from('activity_logs').insert([{
        user_id: userId,
        school_id: schoolId,
        activity_type: 'discussion',
        activity_id: `${todayDate}_${todayTopic.id}`,
        data: logData
      }]);

      setStep(STEP.DONE);
      if (onReward) onReward(5, "오늘의 AI 토의를 완료했습니다! 💬 +5 조각");
    } catch (err) {
      console.error('저장 오류:', err);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── 렌더링 ─────────────────────────────────────────────────

  const cardStyle = {
    background: 'white',
    borderRadius: '25px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  };

  const topicBadgeStyle = {
    display: 'inline-block',
    background: '#e8f4fd',
    color: '#0984e3',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '12px'
  };

  const sharedModals = (
    <>
      {vocabModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="page-enter" style={{ background: 'white', padding: '30px', borderRadius: '25px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💡</div>
            <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.8rem', color: '#0984e3', margin: '0 0 15px 0' }}>{vocabModal.word}</h3>
            <p style={{ color: '#2d3436', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, marginBottom: '25px', wordBreak: 'keep-all' }}>
              {vocabModal.desc}
            </p>
            <button onClick={() => setVocabModal({ show: false, word: '', desc: '' })} style={{ background: '#0984e3', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
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
            <button onClick={() => setModWarning({ show: false, message: '' })} style={{ background: '#d63031', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              네, 알겠습니다!
            </button>
          </div>
        </div>
      )}
    </>
  );

  // 이미 완료
  if (alreadyDone && step === STEP.INTRO) {
    return (
      <div className="page-enter" style={{ padding: '20px', paddingBottom: '120px' }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>✅</div>
            <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.8rem', color: '#2d3436' }}>
              오늘 토의 완료!
            </h2>
            <p style={{ color: '#636e72', fontWeight: 'bold', marginTop: '10px', lineHeight: 1.6 }}>
              오늘의 AI 리터러시 토의를 이미 완료했습니다.<br />
              내일 오전 8시에 새로운 주제가 기다리고 있어요! 🌅
            </p>
            <div style={{ marginTop: '20px', background: '#f8f9fa', borderRadius: '15px', padding: '15px' }}>
              <div style={topicBadgeStyle}>{todayTopic.area}</div>
              <p style={{ fontWeight: 'bold', color: '#2d3436', fontSize: '1rem' }}>
                "<VocabHighlighter text={todayTopic.topic} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />"
              </p>
            </div>
          </div>
        </div>
        {sharedModals}
      </div>
    );
  }

  // 소개 화면
  if (step === STEP.INTRO) {
    return (
      <div className="page-enter" style={{ padding: '20px', paddingBottom: '120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2rem', color: '#2d3436' }}>
            💬 AI와 함께 생각해요
          </h2>
          <p style={{ color: '#636e72', fontWeight: 'bold', fontSize: '0.95rem' }}>
            오늘의 AI 리터러시 토의 주제와 함께<br />생각을 키워보세요!
          </p>
        </div>

        <div style={{ ...cardStyle, border: '3px solid #74b9ff' }}>
          <div style={topicBadgeStyle}>📅 오늘의 주제 · {todayTopic.area}</div>
          <p style={{ fontSize: '1.25rem', fontWeight: '900', color: '#2d3436', lineHeight: 1.5, margin: '10px 0 0' }}>
            "<VocabHighlighter text={todayTopic.topic} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />"
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.2rem', color: '#e17055', marginBottom: '10px' }}>
            📋 오늘 토의 순서
          </h3>
          {[
            { step: '1', label: 'AI와 대화 전, 내 생각 적기' },
            { step: '2', label: 'AI와 자유롭게 토의하기' },
            { step: '3', label: 'AI와 대화 후, 바뀐 내 생각 적기' },
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '28px', background: '#74b9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', flexShrink: 0 }}>
                {s.step}
              </div>
              <span style={{ fontWeight: 'bold', color: '#2d3436' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStep(STEP.PRE)}
          style={{ width: '100%', background: 'linear-gradient(135deg, #74b9ff, #0984e3)', border: 'none', color: 'white', padding: '18px', borderRadius: '20px', fontFamily: "'Jua', sans-serif", fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 8px 0 #0764ad', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          시작하기 <ChevronRight size={22} />
        </button>
        {sharedModals}
      </div>
    );
  }

  // 사전 기록 화면
  if (step === STEP.PRE) {
    return (
      <div className="page-enter" style={{ padding: '20px', paddingBottom: '120px' }}>
        <div style={{ ...cardStyle, background: '#e8f4fd', border: '2px solid #74b9ff' }}>
          <div style={topicBadgeStyle}>{todayTopic.area}</div>
          <p style={{ fontWeight: '900', color: '#2d3436', fontSize: '1.05rem', lineHeight: 1.5, margin: 0 }}>
            "<VocabHighlighter text={todayTopic.topic} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />"
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.3rem', color: '#0984e3', marginBottom: '5px' }}>
            ① AI와 대화하기 전, 내 생각은?
          </h3>
          <p style={{ color: '#636e72', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px' }}>
            지금 이 주제에 대해 어떻게 생각하는지 솔직하게 적어주세요. 맞고 틀리고가 없어요!
          </p>
          <textarea
            rows={6}
            value={preReflection}
            onChange={e => setPreReflection(e.target.value)}
            placeholder="예: 나는 AI가 말하는 것을 대부분 믿어도 된다고 생각해. 왜냐하면..."
            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #dfe6e9', fontSize: '1rem', resize: 'none', boxSizing: 'border-box', fontFamily: "'Nunito', sans-serif" }}
          />
          <button
            onClick={startChat}
            disabled={!preReflection.trim()}
            style={{ width: '100%', marginTop: '15px', background: preReflection.trim() ? 'linear-gradient(135deg, #00b894, #00cec9)' : '#dfe6e9', border: 'none', color: 'white', padding: '18px', borderRadius: '20px', fontFamily: "'Jua', sans-serif", fontSize: '1.2rem', cursor: preReflection.trim() ? 'pointer' : 'not-allowed', boxShadow: preReflection.trim() ? '0 6px 0 #00897b' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            AI와 토의 시작하기 <ChevronRight size={22} />
          </button>
        </div>
        {sharedModals}
      </div>
    );
  }

  // 채팅 화면
  if (step === STEP.CHAT) {
    return (
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: '10px' }}>
        {/* 상단 주제 + 마치기 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #eee', marginBottom: '10px', gap: '10px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...topicBadgeStyle, marginBottom: '4px' }}>{todayTopic.area}</div>
            <p style={{ fontWeight: '900', color: '#2d3436', fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <VocabHighlighter text={todayTopic.topic} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />
            </p>
          </div>
          <button
            onClick={handleFinishChat}
            disabled={messages.filter(m => m.role === 'user').length < 2}
            style={{ flexShrink: 0, background: messages.filter(m => m.role === 'user').length >= 2 ? '#e17055' : '#dfe6e9', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '12px', fontWeight: 'bold', cursor: messages.filter(m => m.role === 'user').length >= 2 ? 'pointer' : 'not-allowed', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            대화 마치기
          </button>
        </div>

        {/* 입력창 (상단 고정) */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="생각을 입력하세요..."
            disabled={isLoading}
            style={{ flex: 1, padding: '12px 15px', border: '2px solid #dfe6e9', borderRadius: '15px', fontSize: '0.95rem', outline: 'none' }}
          />
          <button type="submit" disabled={!input.trim() || isLoading} style={{ background: input.trim() && !isLoading ? '#0984e3' : '#dfe6e9', border: 'none', borderRadius: '15px', padding: '0 16px', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed' }}>
            <Send size={18} color="white" />
          </button>
        </form>

        {/* 채팅 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '100px', minHeight: 0 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {m.role === 'ai' ? (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'flex-start', maxWidth: '85%' }}>
                  <div style={{ width: '32px', height: '32px', background: '#74b9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>🤖</div>
                  <div style={{ background: 'white', border: '1px solid #dfe6e9', padding: '10px 14px', borderRadius: '5px 18px 18px 18px', fontWeight: 'bold', color: '#2d3436', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <VocabHighlighter 
                      text={m.content} 
                      onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ alignSelf: 'flex-end', background: '#74b9ff', color: 'white', padding: '10px 14px', borderRadius: '18px 18px 5px 18px', fontWeight: 'bold', maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', color: '#636e72', fontSize: '0.9rem' }}>
              <Loader2 className="animate-spin" size={16} /> 생각 중...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {sharedModals}
      </div>
    );
  }

  // 사후 기록 화면
  if (step === STEP.POST) {
    return (
      <div className="page-enter" style={{ padding: '20px', paddingBottom: '120px' }}>
        <div style={{ ...cardStyle, background: '#e8f4fd', border: '2px solid #74b9ff' }}>
          <div style={topicBadgeStyle}>{todayTopic.area}</div>
          <p style={{ fontWeight: '900', color: '#2d3436', fontSize: '1.05rem', lineHeight: 1.5, margin: 0 }}>
            "<VocabHighlighter text={todayTopic.topic} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />"
          </p>
        </div>

        {/* 사전 생각 보여주기 */}
        <div style={{ ...cardStyle, background: '#f8f9fa' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#636e72', marginBottom: '8px' }}>📝 대화 전 내 생각 (기록됨)</p>
          <p style={{ fontWeight: 'bold', color: '#2d3436', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
            "{preReflection}"
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.3rem', color: '#e17055', marginBottom: '5px' }}>
            ③ AI와 대화하고 나서, 생각이 어떻게 바뀌었나요?
          </h3>
          <p style={{ color: '#636e72', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px' }}>
            AI와 대화를 나눈 뒤 새롭게 알게 된 것, 바뀐 생각, 더 궁금해진 것이 있다면 자유롭게 적어주세요.
          </p>
          <textarea
            rows={6}
            value={postReflection}
            onChange={e => setPostReflection(e.target.value)}
            placeholder="예: AI와 대화하고 나서, 내가 몰랐던 점을 알게 됐어. 특히..."
            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #dfe6e9', fontSize: '1rem', resize: 'none', boxSizing: 'border-box', fontFamily: "'Nunito', sans-serif" }}
          />
          <button
            onClick={handleSaveAll}
            disabled={!postReflection.trim() || isSaving}
            style={{ width: '100%', marginTop: '15px', background: postReflection.trim() ? 'linear-gradient(135deg, #e17055, #d63031)' : '#dfe6e9', border: 'none', color: 'white', padding: '18px', borderRadius: '20px', fontFamily: "'Jua', sans-serif", fontSize: '1.2rem', cursor: postReflection.trim() ? 'pointer' : 'not-allowed', boxShadow: postReflection.trim() ? '0 6px 0 #c0392b' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isSaving ? '저장 중...' : '✅ 토의 완료하고 저장하기'}
          </button>
        </div>
        {sharedModals}
      </div>
    );
  }

  // 완료 화면
  if (step === STEP.DONE) {
    return (
      <div className="page-enter" style={{ padding: '20px', paddingBottom: '120px' }}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 25px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎉</div>
          <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2rem', color: '#2d3436', marginBottom: '10px' }}>토의 완료!</h2>
          <p style={{ color: '#636e72', fontWeight: 'bold', lineHeight: 1.7 }}>
            오늘 AI와 함께 AI 리터러시에 대해 깊게 생각해봤어요.<br />
            내일 오전 8시에 새로운 주제로 만나요! 🌅
          </p>
          <div style={{ background: '#f8f9fa', borderRadius: '15px', padding: '20px', marginTop: '20px' }}>
            <CheckCircle size={28} color="#00b894" style={{ marginBottom: '8px' }} />
            <p style={{ fontWeight: '900', color: '#00b894', margin: 0 }}>+5 데이터 조각 획득!</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
