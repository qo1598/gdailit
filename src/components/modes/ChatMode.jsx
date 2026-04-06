import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import ChatInterface from '../ChatInterface';
import MissionScenarioPanel from '../mission/MissionScenarioPanel';
import DictionaryText from '../DictionaryText';

const ChatMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    userName,
    onWordClick,
    onComplete 
}) => {
    const {
        currentUserTurnLimit,
        currentChatInitiator,
        currentPrompts,
        currentScenarioImage,
        currentScenarioDescription
    } = useGradeLogic(mission, gradeGroup);
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 알리 AI 말풍선 */}
            <div style={{
                background: '#fff9e6',
                border: '3px solid #fdcb6e',
                borderRadius: '20px',
                padding: '12px',
                marginBottom: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <img 
                        src="/robot_2d_base.png" 
                        alt="알리 캐릭터" 
                        style={{ 
                            width: '60px', 
                            height: '60px',
                            objectFit: 'contain',
                            background: 'transparent'
                        }} 
                    />
                    <div style={{
                        color: '#2d3436',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        flex: 1
                    }}>
                        <span style={{
                            background: '#fdcb6e',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '15px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginRight: '15px'
                        }}>
                            알리(AIli)
                        </span>
                        <DictionaryText text="좋아! 이제 본격적으로 미션을 수행해 보자. 파이팅!" onWordClick={onWordClick} />
                    </div>
                </div>
            </div>

            {/* 탐구 과제 섹션 - 노란색 테두리 */}
            <div style={{
                background: '#fff9e6',
                border: '3px solid #fdcb6e',
                borderRadius: '20px',
                padding: '15px',
                marginBottom: '15px'
            }}>
                <h3
                    className="mission-task-header"
                    style={{
                        color: '#e67e22',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}
                >
                    탐구 과제
                </h3>

                {missionId === 'M-2' && gradeGroup === 'upper' ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            background: '#f8f9fa',
                            borderRadius: '15px',
                            padding: '15px',
                            border: '2px solid #ff7675'
                        }}
                    >
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
                ) : (
                    <MissionScenarioPanel
                        imageUrl={currentScenarioImage}
                        description={currentScenarioDescription}
                        onWordClick={onWordClick}
                    />
                )}

                {currentPrompts && currentPrompts.length > 0 && (
                    <div
                        style={{
                            marginBottom: '15px',
                            textAlign: 'left',
                            color: '#2d3436',
                            background: 'white',
                            padding: '12px',
                            borderRadius: '15px',
                            border: '3px solid #dfe6e9',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                        }}
                    >
                        {currentPrompts.map((prompt, idx) => (
                            <p
                                key={idx}
                                style={{
                                    marginBottom: idx === currentPrompts.length - 1 ? 0 : '12px',
                                    fontWeight: '900',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.5',
                                    color: '#2d3436'
                                }}
                            >
                                <DictionaryText text={prompt} onWordClick={onWordClick} />
                            </p>
                        ))}
                    </div>
                )}

                <ChatInterface
                    mission={mission}
                    missionId={missionId}
                    gradeGroup={gradeGroup}
                    currentUserTurnLimit={currentUserTurnLimit}
                    currentChatInitiator={currentChatInitiator}
                    onChatComplete={onComplete}
                    userName={userName}
                    onWordClick={onWordClick}
                />
            </div>
        </div>
    );
};

export default ChatMode;