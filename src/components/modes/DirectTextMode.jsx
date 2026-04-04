import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import StackedInputs from '../mission/StackedInputs';

const DirectTextMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onStackedChange, 
    onSubmit 
}) => {
    const { currentStackedInputs, currentPrompts } = useGradeLogic(mission, gradeGroup);
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* E-1 미션의 특별한 AI 탐정 UI */}
            {missionId === 'E-1' && (
                <div style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '25px',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}>
                            🕵️‍♀️
                        </div>
                        <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '5px' }}>
                                🔍 AI 전문가 탐정 미션
                            </div>
                            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                                일상 속 숨겨진 AI 기술을 찾아 분석해보세요!
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-blue-800 font-semibold">
                        {currentPrompts && currentPrompts[0]}
                    </p>
                </div>

                <StackedInputs
                    missionId={missionId}
                    gradeGroup={gradeGroup}
                    stackedInputs={currentStackedInputs}
                    stackedAnswers={stackedAnswers}
                    onStackedChange={onStackedChange}
                />

                <div className="mt-6 text-center">
                    <button
                        onClick={onSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        {missionId === 'E-1' ? '🔍 탐정 보고서 제출하기' : '답변 제출하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectTextMode;