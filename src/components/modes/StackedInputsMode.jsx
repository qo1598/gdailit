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
    
    const cardRadius = 'clamp(16px, 4vw, 22px)';

    return (
        <div className="max-w-4xl mx-auto w-full px-3 py-4 sm:px-6 sm:py-6 box-border">
            {/* 알리 AI 말풍선 */}
            <div style={{
                background: '#fff9e6',
                border: '3px solid #fdcb6e',
                borderRadius: cardRadius,
                padding: 'clamp(14px, 4vw, 22px)',
                marginBottom: 'clamp(12px, 3vw, 20px)',
                WebkitTapHighlightColor: 'transparent'
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
                        fontSize: 'clamp(0.92rem, 3.5vw, 1rem)',
                        lineHeight: 1.55,
                        flex: 1,
                        minWidth: 0
                    }}>
                        <span style={{
                            background: '#fdcb6e',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: 'clamp(12px, 3.2vw, 14px)',
                            fontWeight: 'bold',
                            marginRight: '8px',
                            display: 'inline-block',
                            marginBottom: '6px',
                            verticalAlign: 'middle'
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
                borderRadius: cardRadius,
                padding: 'clamp(14px, 4vw, 26px)',
                marginBottom: 'clamp(12px, 3vw, 20px)',
                WebkitTapHighlightColor: 'transparent'
            }}>
                <h3
                    className="mission-task-header"
                    style={{
                        color: '#e67e22',
                        fontSize: 'clamp(1.1rem, 4.2vw, 1.35rem)',
                        fontWeight: 'bold',
                        marginBottom: 'clamp(14px, 4vw, 20px)',
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
                            padding: 'clamp(14px, 3.8vw, 18px)',
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
                                    fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                                    lineHeight: 1.5,
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

                <div style={{ textAlign: 'center', marginTop: 'clamp(20px, 5vw, 30px)' }}>
                    <button
                        type="button"
                        onClick={onSubmit}
                        style={{
                            background: 'linear-gradient(180deg, #fdcb6e 0%, #f39c12 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '999px',
                            padding: 'clamp(14px, 3.5vw, 16px) clamp(24px, 6vw, 40px)',
                            fontSize: 'clamp(1.02rem, 3.8vw, 1.2rem)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%',
                            minHeight: '52px',
                            boxShadow: '0 8px 22px rgba(243, 156, 18, 0.35)',
                            touchAction: 'manipulation'
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