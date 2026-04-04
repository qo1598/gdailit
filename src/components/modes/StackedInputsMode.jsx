import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import StackedInputs from '../mission/StackedInputs';
import ImageGenerator from '../mission/ImageGenerator';

const StackedInputsMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onStackedChange, 
    onSubmit 
}) => {
    const { currentStackedInputs, currentPrompts } = useGradeLogic(mission, gradeGroup);
    
    // M-2 미션의 특별한 회의 맥락 UI - 백업과 100% 동일
    if (missionId === 'M-2') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                {/* M-2 통합 회의 맥락 UI - 백업 파일 1750-1835 라인과 동일 */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '25px',
                    border: '3px solid #ff7675',
                    boxShadow: '0 4px 12px rgba(255, 118, 117, 0.1)',
                    position: 'relative'
                }}>
                    {/* 이미지 섹션 - 모든 학년군에 표시 */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginBottom: '20px',
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '15px'
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: '#ff7675',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            boxShadow: '0 4px 12px rgba(255, 118, 117, 0.3)'
                        }}>
                            🤖
                        </div>
                        <div>
                            <div style={{ color: '#ff7675', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                만능 AI의 오지랖 제안!
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '18px',
                        color: '#2d3436',
                        lineHeight: 1.6,
                        fontSize: '1rem',
                        border: '2px solid #ff7675',
                        borderStyle: 'dashed'
                    }}>
                        {gradeGroup === 'lower' && (
                            <div>
                                <strong>"안녕하세요! 저는 만능 도우미 AI예요! 🎯</strong><br/>
                                체육대회 준비? 걱정 마세요! <strong>무거운 매트 나르기부터 친구들 응원하기까지 모든 걸 제가 다 해드릴게요!</strong> 
                                여러분은 그냥 편하게 앉아서 구경만 하시면 됩니다!"
                            </div>
                        )}
                        {gradeGroup === 'middle' && (
                            <div>
                                <strong>"장기자랑 준비로 바쁘시죠? 제가 도와드릴게요! 🎭</strong><br/>
                                <strong>춤도 제가 추고, 노래도 제가 부르고, 감동적인 연기까지 다 해드릴게요!</strong> 
                                친구들과의 협력? 그런 복잡한 건 필요 없어요. 저 혼자면 충분합니다!"
                            </div>
                        )}
                        {gradeGroup === 'upper' && (
                            <div>
                                <strong>"학급 프로젝트 회의 진행하시나요? 제가 완벽하게 처리해드릴게요! 💼</strong><br/>
                                <strong>데이터 수집부터 최종 의사결정까지 제 알고리즘으로 모든 걸 완벽하게 처리하겠습니다!</strong> 
                                인간의 감정적 판단이나 비효율적인 협력 과정은 생략하고, 저 혼자서 최적의 결과를 도출해드릴게요!"
                            </div>
                        )}
                    </div>
                </div>

                {/* 프롬프트 섹션 */}
                {currentPrompts && currentPrompts.length > 0 && (
                    <div style={{
                        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                        borderRadius: '15px',
                        padding: '20px',
                        marginBottom: '25px',
                        color: 'white',
                        textAlign: 'center',
                        boxShadow: '0 6px 20px rgba(116, 185, 255, 0.3)'
                    }}>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            lineHeight: '1.5'
                        }}>
                            {currentPrompts[0]}
                        </div>
                    </div>
                )}

                <StackedInputs
                    missionId={missionId}
                    gradeGroup={gradeGroup}
                    stackedInputs={currentStackedInputs}
                    stackedAnswers={stackedAnswers}
                    onStackedChange={onStackedChange}
                    onSubmit={onSubmit}
                />
            </div>
        );
    }
    
    // 다른 미션들의 기본 UI
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {currentPrompts && currentPrompts.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                            {currentPrompts[0]}
                        </p>
                    </div>
                )}

                <StackedInputs
                    missionId={missionId}
                    gradeGroup={gradeGroup}
                    stackedInputs={currentStackedInputs}
                    stackedAnswers={stackedAnswers}
                    onStackedChange={onStackedChange}
                    onSubmit={onSubmit}
                />

                {/* M-3 미션에서만 이미지 생성 컴포넌트 표시 */}
                {missionId === 'M-3' && (gradeGroup === 'lower' || gradeGroup === 'middle') && (
                    <ImageGenerator
                        missionId={missionId}
                        gradeGroup={gradeGroup}
                        stackedAnswers={stackedAnswers}
                    />
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={onSubmit}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        답변 제출하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StackedInputsMode;