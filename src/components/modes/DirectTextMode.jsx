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
            {/* 알리 AI 말풍선 */}
            <div style={{
                background: '#fff9e6',
                border: '3px solid #fdcb6e',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px',
                position: 'relative'
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
                            알리
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
                <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#e17055',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    탐구 과제
                </div>

                <form onSubmit={onSubmit}>
                    {/* 파일 업로드 섹션 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            marginBottom: '10px', 
                            fontWeight: 'bold', 
                            color: '#2d3436' 
                        }}>
                            관련 사진을 업로드해주세요. 📸
                        </div>
                        <div style={{
                            border: '2px dashed #fdcb6e',
                            borderRadius: '12px',
                            padding: '20px',
                            textAlign: 'center',
                            background: 'white',
                            marginBottom: '20px'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    console.log('파일 선택:', e.target.files[0]);
                                }}
                                style={{ 
                                    width: '100%',
                                    padding: '10px',
                                    border: 'none',
                                    background: 'transparent'
                                }}
                            />
                            <div style={{
                                color: '#666',
                                fontSize: '14px',
                                marginTop: '10px'
                            }}>
                                파일을 선택하거나 여기로 드래그하세요
                            </div>
                        </div>
                    </div>

                    {/* 입력 필드들 */}
                    <StackedInputs
                        missionId={missionId}
                        gradeGroup={gradeGroup}
                        stackedInputs={currentStackedInputs}
                        stackedAnswers={stackedAnswers}
                        onStackedChange={onStackedChange}
                    />

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button
                            type="submit"
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
                </form>
            </div>
        </div>
    );
};

export default DirectTextMode;