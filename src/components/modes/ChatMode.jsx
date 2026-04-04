import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import ChatInterface from '../ChatInterface';

const ChatMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    userName,
    onComplete 
}) => {
    const { currentUserTurnLimit, currentChatInitiator } = useGradeLogic(mission, gradeGroup);
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 알리 AI 말풍선 */}
            <div style={{
                background: '#fdcb6e',
                border: '3px solid #e17055',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: '#e17055',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>
                        🤖
                    </div>
                    <div>
                        <div style={{
                            background: '#e17055',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'inline-block'
                        }}>
                            알리 (AI)
                        </div>
                    </div>
                </div>
                <div style={{
                    color: '#2d3436',
                    fontSize: '1rem',
                    lineHeight: '1.5'
                }}>
                    좋아! 이제 본격적으로 미션을 수행해 보자. 파이팅!
                </div>
            </div>

            {/* 탐구 과제 섹션 - 노란색 테두리 */}
            <div style={{
                background: '#fff9e6',
                border: '3px solid #fdcb6e',
                borderRadius: '20px',
                padding: '25px',
                marginBottom: '20px'
            }}>
                <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#e17055',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    탐구 과제
                </div>

                <ChatInterface
                    mission={mission}
                    missionId={missionId}
                    gradeGroup={gradeGroup}
                    currentUserTurnLimit={currentUserTurnLimit}
                    currentChatInitiator={currentChatInitiator}
                    onChatComplete={onComplete}
                    userName={userName}
                />
            </div>
        </div>
    );
};

export default ChatMode;