import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import StackedInputs from '../mission/StackedInputs';
import MissionScenarioPanel from '../mission/MissionScenarioPanel';

const StackedInputsMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onStackedChange, 
    onSubmit 
}) => {
    const {
        currentStackedInputs,
        currentPrompts,
        currentScenarioImage,
        currentScenarioDescription
    } = useGradeLogic(mission, gradeGroup);
    
    // 모든 미션에 동일한 노란색 테두리 적용
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 알리 AI 말풍선 */}
            <div style={{
                background: '#fff9e6',
                border: '3px solid #fdcb6e',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px'
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
                            알리(Alli)
                        </span>
                        좋아! 이제 본격적으로 미션을 수행해 보자. 파이팅!
                    </div>
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

                <MissionScenarioPanel
                    imageUrl={currentScenarioImage}
                    description={currentScenarioDescription}
                />

                {currentPrompts && currentPrompts.length > 0 && (
                    <div
                        style={{
                            marginBottom: '15px',
                            textAlign: 'left',
                            color: '#2d3436',
                            background: 'white',
                            padding: '18px',
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
                                    fontSize: '1.2rem',
                                    lineHeight: '1.5',
                                    color: '#2d3436'
                                }}
                            >
                                {prompt}
                            </p>
                        ))}
                    </div>
                )}

                <StackedInputs
                    missionId={missionId}
                    gradeGroup={gradeGroup}
                    stackedInputs={currentStackedInputs}
                    stackedAnswers={stackedAnswers}
                    onAnswerChange={onStackedChange}
                />

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button
                        onClick={onSubmit}
                        style={{
                            background: '#fdcb6e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        미션 내용 수정하기!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StackedInputsMode;