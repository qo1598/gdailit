import React, { useState, useRef, useEffect } from 'react';
import { Send, Trophy, Loader2, List, X } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../supabaseClient';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-lite";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function MiniGame({ userId, schoolId = 'gyeongdong', gradeGroup = 'lower', userName, setFragments, onReward }) {
    const [dailyWord, setDailyWord] = useState("인공지능스피커");
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [guess, setGuess] = useState('');
    const [won, setWon] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showGuessInput, setShowGuessInput] = useState(false);
    const [rankings, setRankings] = useState([]);
    const maxTurns = 20;

    const chatEndRef = useRef(null);

    // Utility to format ISO time to "오전/오후 HH:MM"
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '';
        }
    };

    // Utility to get the game date (New day starts at 8 AM KST)
    const getGameDate = () => {
        // Create date in KST (UTC+9)
        const now = new Date();
        const kstTime = now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000);
        const kstDate = new Date(kstTime);

        const hour = kstDate.getHours();
        // If before 8 AM, it belongs to the previous calendar day
        if (hour < 8) {
            kstDate.setDate(kstDate.getDate() - 1);
        }

        const yyyy = kstDate.getFullYear();
        const mm = String(kstDate.getMonth() + 1).padStart(2, '0');
        const dd = String(kstDate.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        let isMounted = true;
        const fetchInitialData = async () => {
            const today = getGameDate();

            try {
                // 1. Try to fetch word from Supabase
                const { data: wordData, error: wordError } = await supabase
                    .from('daily_words')
                    .select('word')
                    .eq('date', today)
                    .maybeSingle();

                if (wordError) console.error("Daily Word Fetch Error:", wordError);

                if (isMounted && wordData && wordData.word) {
                    setDailyWord(wordData.word);
                } else if (isMounted) {
                    // Fallback: Seeded random
                    const fallbackWords = [
                        "인공지능", "로봇", "챗봇", "자율주행차", "드론", "스마트폰", "음성인식", "얼굴인식",
                        "인공지능비서", "인공지능스피커", "번역기", "알파고", "코딩", "프로그램", "알고리즘",
                        "명령어", "순서도", "변수", "반복", "조건", "웹사이트", "애플리케이션", "컴퓨터게임",
                        "마우스", "키보드", "인터넷", "와이파이", "블록코딩", "개인정보", "비밀번호", "저작권",
                        "가짜뉴스", "사이버예절", "댓글", "디지털발자국", "정보보호", "해킹", "스팸메일",
                        "디지털중독", "온라인예절", "미디어리터러시", "정보검색", "스마트패드", "코딩로봇",
                        "디지털교과서", "이메일", "비디오회의", "유튜브", "포털사이트", "클라우드저장소"
                    ];
                    const seed = today.split('-').join('');
                    const index = parseInt(seed) % fallbackWords.length;
                    setDailyWord(fallbackWords[index]);
                }

                // 2. CHECK IF ALREADY SOLVED TODAY
                if (isMounted && userId) {
                    const { data: solvedData, error: solvedError } = await supabase
                        .from('minigame_rankings')
                        .select('*')
                        .eq('user_id', userId)
                        .eq('date', today)
                        .maybeSingle();

                    if (solvedError) console.error("Participation Check Error:", solvedError);

                    if (solvedData) {
                        setWon(true);
                        if (solvedData.turns) {
                            const dummyQuestions = Array(solvedData.turns).fill({ q: '...', a: '이미 성공한 기록이 있습니다.' });
                            setQuestions(dummyQuestions);
                        }
                    }
                }

                // 3. Fetch initial rankings
                if (isMounted) await fetchRankings();
            } catch (err) {
                console.error("Initialization Error:", err);
            }
        };

        fetchInitialData();
        return () => { isMounted = false; };
    }, [userId]); // Dependency is stable now

    const fetchRankings = async () => {
        const today = getGameDate();
        const { data, error } = await supabase
            .from('minigame_rankings')
            .select('*')
            .eq('date', today)
            .order('turns', { ascending: true })
            .order('completed_at', { ascending: true }) // Tie-breaker: earlier completion
            .limit(10);

        if (error) console.error("Fetch Rankings Error:", error);
        if (data) setRankings(data);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [questions]);

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!currentQuestion || isLoading || questions.length >= maxTurns || won) return;

        setIsLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });

            // Generate metadata for the daily word to help AI accuracy
            const wordLength = dailyWord.replace(/\s/g, '').length;
            const hasEnglish = /[a-zA-Z]/.test(dailyWord);
            const isPureKorean = /^[가-힣\s]+$/.test(dailyWord);

            const prompt = `당신은 초등학생을 대상으로 하는 '스무고개' 게임의 친절하고 지능적인 AI 호스트입니다.
            오늘의 비밀 단어는 '${dailyWord}'입니다.
            
            [비밀 단어에 대한 정확한 정보 - 답변 시 반드시 참고하세요]
            - 전체 글자 수 (공백 제외): ${wordLength}글자
            - 첫 번째 글자: ${dailyWord[0]}
            - 언어 구성: ${isPureKorean ? '순수 한글' : (hasEnglish ? '영어 포함' : '한글 및 기타')}
            
            현재 학생이 ${questions.length + 1}번째 질문을 하고 있습니다. (최대 20번 가능)

            [대화 규칙]
            1. 학생의 질문이 비밀 단어와 관련이 있다면, 질문에 대해 "네/아니오/모르겠습니다"를 명확히 포함하여 대답하세요.
            2. **중요: 글자 수나 언어에 대한 질문을 받으면, 반드시 위에서 제공된 '비밀 단어에 대한 정확한 정보'를 바탕으로 사실만을 말하세요.** (예: "두 글자야?"라고 묻고 ${wordLength}가 2라면 반드시 "네"라고 답하세요.)
            3. 질문에 답할 때 친절한 말투로 아주 짧은 추임새나 힌트(정답을 직접 말하지 않는 선에서)를 덧붙여도 좋습니다.
            4. **절대로** 답변에 비밀 단어 '${dailyWord}'를 직접 언급하거나 포함하지 마세요.
            5. 정답이 무엇인지 묻거나, 게임과 전혀 상관없는 질문을 한다면 웃으며 게임에 집중하도록 안내하세요.
            6. 모든 답변은 1~2문장 내외로 매우 짧고 간결하게 하세요.
            
            학생의 질문: ${currentQuestion}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let answer = response.text().trim();

            setQuestions([...questions, { q: currentQuestion, a: answer }]);
            setCurrentQuestion('');
        } catch (error) {
            console.error("Gemini API Error:", error);
            alert("AI 호스트와 연결에 문제가 생겼습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuessSubmit = async (e) => {
        e.preventDefault();
        if (won) return;

        if (guess.replace(/\s/g, '') === dailyWord.replace(/\s/g, '')) {
            setWon(true);
            await saveResult();
            await fetchRankings();

            // Reward: +2 fragments for correct guess
            if (onReward) onReward(2, "정답입니다! 당신의 기록이 순위에 반영되었습니다. ✨");
            updateFragments(2);
        } else {
            alert("틀렸습니다! 다시 시도해보세요.");
            setGuess('');
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

    const saveResult = async () => {
        if (!userId) return;

        const today = getGameDate();
        const { error } = await supabase
            .from('minigame_rankings')
            .upsert({
                user_id: userId,
                date: today,
                turns: questions.length,
                student_name: userName,
                completed_at: new Date().toISOString()
            }, {
                onConflict: 'user_id, date'
            });

        if (error) {
            console.error("Ranking Save Error Detail:", error);
            if (error.code === '22P02') {
                alert("데이터베이스 설정 오류가 감지되었습니다. 제공해 드린 SQL 명령어를 Supabase SQL Editor에서 실행해 주세요.");
            } else {
                alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
            }
        }

        // [연구용] activity_logs에 전체 Q&A 턴 JSON 저장
        try {
            await supabase.from('activity_logs').insert([{
                user_id: userId,
                school_id: schoolId,
                activity_type: 'minigame',
                activity_id: today,
                data: {
                    date: today,
                    word: dailyWord,
                    grade_group: gradeGroup,
                    turns: questions.map((q, i) => ({
                        turn: i + 1,
                        question: q.q,
                        answer: q.a,
                        timestamp: q.timestamp || null
                    })),
                    total_turns: questions.length,
                    result: 'solved',
                    solved_at: new Date().toISOString()
                }
            }]);
        } catch (logErr) {
            console.warn('activity_logs 저장 실패 (연구 로그):', logErr);
        }
    };

    return (
        <div className="page-enter" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            padding: '10px'
        }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
            }}>
                <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.4rem', margin: 0, color: '#ff4757', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={20} color="#ffa502" /> 스무고개
                </h2>
                <button
                    onClick={() => { fetchRankings(); setShowLeaderboard(true); }}
                    style={{
                        border: 'none',
                        background: 'linear-gradient(135deg, #fab005, #ff922b)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(250, 176, 5, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <List size={16} /> 오늘의 순위
                </button>
            </header>

            <div style={{
                background: 'white',
                padding: '10px 15px',
                borderRadius: '15px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#555',
                marginBottom: '10px'
            }}>
                <span style={{ color: '#ff4757', fontWeight: 'bold' }}>TIP:</span> 힌트를 얻어 정답을 맞춰보세요! (최대 20번)
            </div>

            {won ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
                    <div style={{ background: '#2ed573', color: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', width: '100%' }}>
                        <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2rem', marginBottom: '10px' }}>🎉 정답입니다! 🎉</h3>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '15px', margin: '20px 0', fontSize: '1.4rem', fontWeight: '900' }}>
                            {dailyWord}
                        </div>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>사용한 기회: {questions.length} / {maxTurns}</p>
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            style={{
                                marginTop: '15px',
                                background: 'white',
                                color: '#2ed573',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '15px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            오늘의 순위
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

                    {/* Controls Area (Moved to TOP for visibility) */}
                    <div style={{ background: 'white', padding: '10px 0', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#ff4757', background: '#fff5f5', padding: '5px 12px', borderRadius: '10px' }}>
                                기회: {maxTurns - questions.length}번 남음
                            </div>
                            <button
                                onClick={() => setShowGuessInput(!showGuessInput)}
                                style={{ background: showGuessInput ? '#ff7675' : '#74b9ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                {showGuessInput ? "취소" : "정답 맞히기!"}
                            </button>
                        </div>

                        {showGuessInput ? (
                            <form className="page-enter" onSubmit={handleGuessSubmit} style={{ display: 'flex', gap: '8px', background: '#f8f9fa', padding: '10px', borderRadius: '15px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    value={guess}
                                    onChange={e => setGuess(e.target.value)}
                                    placeholder="정답 입력!"
                                    style={{ flex: 1, padding: '10px', border: '2px solid #ff9f43', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold' }}
                                    autoFocus
                                />
                                <button type="submit" style={{ background: '#ff9f43', color: 'white', border: 'none', borderRadius: '10px', padding: '0 15px', fontWeight: '900', fontSize: '0.9rem' }}>
                                    제출
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleQuestionSubmit} style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={currentQuestion}
                                    onChange={e => setCurrentQuestion(e.target.value)}
                                    placeholder="질문을 입력하세요"
                                    style={{ flex: 1, padding: '12px 15px', border: '1px solid #dfe6e9', borderRadius: '12px', fontSize: '0.95rem' }}
                                    disabled={questions.length >= maxTurns || isLoading}
                                />
                                <button type="submit" style={{ background: '#f1f2f6', border: '1px solid #ced6e0', borderRadius: '12px', padding: '0 15px', cursor: 'pointer' }} disabled={questions.length >= maxTurns || isLoading}>
                                    <Send size={18} color={questions.length >= maxTurns || isLoading ? '#ced6e0' : '#2f3542'} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Chat Area (Flexible height) */}
                    <div style={{
                        flex: 1,
                        background: '#fffcf0',
                        border: '2px solid #ffeaa7',
                        borderRadius: '20px',
                        padding: '15px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minHeight: 0,
                        marginBottom: '100px' // Extra bottom padding for navigation bar safety
                    }}>
                        {questions.length === 0 ? (
                            <div style={{ color: '#b2bec3', textAlign: 'center', margin: 'auto', fontWeight: 'bold', fontSize: '1rem' }}>
                                AI 호스트에게 말을 걸어보세요! 👋
                            </div>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <div style={{ alignSelf: 'flex-end', background: '#ffeaa7', padding: '8px 12px', borderRadius: '15px 15px 0 15px', fontWeight: 'bold', maxWidth: '85%', fontSize: '0.95rem' }}>
                                        {q.q}
                                    </div>
                                    <div style={{ alignSelf: 'flex-start', background: 'white', border: '1px solid #dfe6e9', padding: '8px 12px', borderRadius: '15px 15px 15px 0', fontWeight: 'bold', maxWidth: '85%', color: '#0984e3', fontSize: '0.95rem' }}>
                                        {q.a}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', background: 'white', border: '1px solid #dfe6e9', padding: '8px 12px', borderRadius: '15px 15px 15px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                <Loader2 className="animate-spin" size={16} />
                                <span>생각 중...</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                </div>
            )}

            {/* Leaderboard Overlay */}
            {showLeaderboard && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 15px 100px'
                }}>
                    <div className="page-enter" style={{
                        background: 'white',
                        width: '100%',
                        borderRadius: '30px',
                        padding: '25px',
                        maxHeight: '100%',
                        overflowY: 'auto',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.5rem', margin: 0, color: '#2f3542', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Trophy size={24} color="#ffa502" /> 오늘의 순위 TOP 10
                            </h3>
                            <button onClick={() => setShowLeaderboard(false)} style={{ border: 'none', background: '#f1f2f6', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}>
                                <X size={24} color="#2f3542" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {rankings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#b2bec3', fontWeight: 'bold' }}>
                                    아직 기록이 없습니다.<br />첫 번째 주인공이 되어보세요! 🚀
                                </div>
                            ) : (
                                rankings.map((r, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: i === 0 ? '#fff9db' : '#f8f9fa', borderRadius: '15px', border: i === 0 ? '2px solid #fab005' : '1px solid #e9ecef' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: '900', color: i < 3 ? '#fab005' : '#b2bec3', fontSize: '1.2rem', width: '25px' }}>{i + 1}</span>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{r.student_name}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', color: '#ff4757', fontSize: '0.95rem' }}>
                                                {r.turns}번 만에 정답!
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#a4b0be', marginTop: '2px' }}>
                                                ({formatTime(r.completed_at)})
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#a4b0be', textAlign: 'center' }}>
                            질문 횟수가 같다면 먼저 정답을 맞춘 친구가 높은 순위에 올라갑니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
