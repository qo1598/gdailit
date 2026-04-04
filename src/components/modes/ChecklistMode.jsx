import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';

const ChecklistMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onStackedChange, 
    onSubmit 
}) => {
    const { currentStackedInputs, currentPrompts } = useGradeLogic(mission, gradeGroup);
    
    const handleChecklistChange = (inputId, selectedItems) => {
        onStackedChange(inputId, selectedItems);
    };

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
                            objectFit: 'contain'
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
                <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#e17055',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    탐구 과제
                </div>

                {currentPrompts && currentPrompts.length > 0 && (
                    <div style={{
                        background: '#74b9ff',
                        color: 'white',
                        borderRadius: '15px',
                        padding: '15px',
                        marginBottom: '20px',
                        textAlign: 'center'
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

                {currentStackedInputs?.map((inputDef, index) => (
                    <div key={inputDef.id} style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            marginBottom: '15px',
                            color: '#2d3436'
                        }}>
                            {inputDef.label}
                        </label>
                        
                        {inputDef.type === 'checklist' && (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {inputDef.list?.map((item, itemIndex) => (
                                    <label key={itemIndex} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '15px',
                                        border: '2px solid #ddd',
                                        borderRadius: '12px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={stackedAnswers[inputDef.id]?.includes(item) || false}
                                            onChange={(e) => {
                                                const currentSelected = stackedAnswers[inputDef.id] || [];
                                                const newSelected = e.target.checked
                                                    ? [...currentSelected, item]
                                                    : currentSelected.filter(selected => selected !== item);
                                                handleChecklistChange(inputDef.id, newSelected);
                                            }}
                                            style={{ marginRight: '12px', width: '16px', height: '16px' }}
                                        />
                                        <span style={{ color: '#2d3436' }}>{item}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        
                        {inputDef.type === 'textarea' && (
                            <textarea
                                value={stackedAnswers[inputDef.id] || ''}
                                onChange={(e) => onStackedChange(inputDef.id, e.target.value)}
                                placeholder={inputDef.placeholder}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: '2px solid #ddd',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    minHeight: '120px',
                                    resize: 'vertical'
                                }}
                                rows={4}
                            />
                        )}
                    </div>
                ))}

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

export default ChecklistMode;