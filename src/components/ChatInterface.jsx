import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkModeration } from '../utils/moderation';
import DictionaryText from './DictionaryText';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-lite";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 채팅 인터페이스 컴포넌트
 */
const ChatInterface = ({
    mission,
    missionId,
    gradeGroup,
    currentUserTurnLimit,
    currentChatInitiator,
    onChatComplete,
    onWordClick,
    initialMessages = [],
    style = {}
}) => {
    const [messages, setMessages] = useState(initialMessages);
    const [chatInput, setChatInput] = useState('');
    const [isAIThinking, setIsAIThinking] = useState(false);
    const chatEndRef = useRef(null);

    // 채팅 상태 계산
    const userTurnCount = messages.filter(m => m.role === 'user').length;
    const turnLimit = currentUserTurnLimit || 5;
    const isChatFinished = userTurnCount >= turnLimit;

    // 초기 메시지 설정
    useEffect(() => {
        if (messages.length === 0 && mission && (currentChatInitiator === 'ai' || !currentChatInitiator)) {
            const initialMessage = {
                role: 'ai',
                content: mission.aiPromptText || `안녕! ${mission.title} 미션에 온 걸 환영해. 같이 시작해볼까?`,
                timestamp: new Date().toISOString()
            };
            setMessages([initialMessage]);
        }
    }, [mission, currentChatInitiator, messages.length, initialMessages]);

    // 자동 스크롤
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAIThinking]);

    const handleChatSend = async (e) => {
        e.preventDefault();
        
        if (!chatInput.trim() || isAIThinking || isChatFinished) return;

        const userMessage = {
            role: 'user',
            content: chatInput.trim(),
            timestamp: new Date().toISOString()
        };

        // 모더레이션 체크
        const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0];
        const lastText = lastUserMsg?.content || '';
        const lastTime = lastUserMsg ? new Date(lastUserMsg.timestamp).getTime() : null;
        const moderationResult = checkModeration(userMessage.content, lastText, lastTime);
        if (!moderationResult.isValid) {
            alert(moderationResult.message || `부적절한 내용이 감지되었습니다.`);
            return;
        }

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setChatInput('');
        setIsAIThinking(true);

        try {
            // 1. AI 페르소나 및 시스템 지침 생성
            const persona = mission.persona ? mission.persona() : 
                "당신은 친근하고 도움이 되는 AI 선생님입니다. 학생들이 AI 리터러시를 배울 수 있도록 도와주세요.";
            
            // AI가 먼저 말을 시작한 경우, 그 내용은 시스템 지침에 포함시켜 컨텍스트를 유지하고
            // API에 보내는 history에서는 제외하여 첫 메시지가 'user'가 되도록 합니다.
            let contextInstruction = persona;
            if (messages.length > 0 && messages[0].role === 'ai') {
                contextInstruction += `\n\n현재 미션의 도입 문구: "${messages[0].content}"`;
            }

            // 2. Gemini API 모델 설정 (systemInstruction 활용)
            const model = genAI.getGenerativeModel({ 
                model: MODEL_NAME,
                systemInstruction: contextInstruction
            });

            // 3. 채팅 히스토리 구성 (첫 AI 메시지 제외하여 user-first 규칙 준수)
            const chatHistory = newMessages.slice(0, -1)
                .filter((msg, idx) => !(idx === 0 && msg.role === 'ai')) // 첫 AI 메시지 제외
                .map(msg => ({
                    role: msg.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));

            const chat = model.startChat({
                history: chatHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                }
            });

            const result = await chat.sendMessage(userMessage.content);
            const aiResponse = result.response.text();

            const aiMessage = {
                role: 'ai',
                content: aiResponse,
                timestamp: new Date().toISOString()
            };

            setMessages([...newMessages, aiMessage]);
        } catch (error) {
            console.error('AI 응답 생성 실패:', error);
            const errorMessage = {
                role: 'ai',
                content: '죄송합니다. 잠시 문제가 발생했습니다. 다시 시도해주세요.',
                timestamp: new Date().toISOString()
            };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsAIThinking(false);
        }
    };

    return (
        <div style={{ ...style }}>
            {/* 채팅 창 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'max(45vh, 300px)',
                flex: 1,
                border: '2px solid #dfe6e9',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#f8f9fa'
            }}>
                {/* 메시지 영역 */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: '200px'
                }}>
                    
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                alignSelf: message.role === 'ai' ? 'flex-start' : 'flex-end',
                                maxWidth: '80%'
                            }}
                        >
                            <div style={{
                                background: message.role === 'ai' ? 'white' : '#6c5ce7',
                                color: message.role === 'ai' ? '#2d3436' : 'white',
                                padding: '12px 16px',
                                borderRadius: message.role === 'ai' ? '5px 15px 15px 15px' : '15px 15px 5px 15px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                fontSize: '1rem',
                                lineHeight: '1.4'
                            }}>
                                {message.role === 'ai' ? (
                                    <DictionaryText
                                        text={message.content}
                                        onWordClick={onWordClick}
                                    />
                                ) : (
                                    message.content
                                )}
                            </div>
                        </div>
                    ))}

                    {/* AI 생각 중 표시 */}
                    {isAIThinking && (
                        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                            <div style={{
                                background: 'white',
                                color: '#636e72',
                                padding: '12px 16px',
                                borderRadius: '5px 15px 15px 15px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                fontStyle: 'italic'
                            }}>
                                AI가 생각하고 있어요... 🤔
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* 입력 영역 */}
                <form onSubmit={handleChatSend} style={{
                    padding: '15px',
                    borderTop: '1px solid #dfe6e9',
                    background: 'white',
                    display: 'flex',
                    gap: '10px'
                }}>
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={isChatFinished ? "대화가 완료되었습니다" : "메시지를 입력하세요..."}
                        disabled={isAIThinking || isChatFinished}
                        style={{
                            flex: 1,
                            padding: '12px 15px',
                            border: '2px solid #dfe6e9',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            outline: 'none',
                            background: (isAIThinking || isChatFinished) ? '#f8f9fa' : 'white'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isAIThinking || isChatFinished || !chatInput.trim()}
                        style={{
                            background: '#6c5ce7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            padding: '12px 20px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            opacity: (isAIThinking || isChatFinished || !chatInput.trim()) ? 0.5 : 1,
                            transition: 'opacity 0.3s'
                        }}
                    >
                        보내기
                    </button>
                </form>
            </div>

            {/* 완료 버튼 */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => onChatComplete?.(messages)}
                    disabled={!isChatFinished && messages.length < 3}
                    style={{
                        background: isChatFinished ? '#27ae60' : '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 30px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: isChatFinished ? 'pointer' : 'not-allowed',
                        boxShadow: isChatFinished ? '0 8px 20px rgba(39, 174, 96, 0.3)' : 'none',
                        transition: 'all 0.3s'
                    }}
                >
                    {isChatFinished ? '🎉 대화 완료! 미션 제출하기' : `💬 ${userTurnCount}/${turnLimit}번 대화 진행 중...`}
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;