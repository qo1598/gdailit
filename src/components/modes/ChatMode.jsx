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
    );
};

export default ChatMode;