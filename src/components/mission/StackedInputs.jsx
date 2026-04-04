import React from 'react';
import ImageGenerator from './ImageGenerator';

/**
 * 스택된 입력 필드들을 렌더링하는 컴포넌트
 */
const StackedInputs = ({ 
    stackedInputs, 
    stackedAnswers, 
    onAnswerChange,
    missionId,
    gradeGroup 
}) => {
    if (!stackedInputs || stackedInputs.length === 0) {
        return null;
    }

    const handleChecklistChange = (inputId, item, isChecked) => {
        const currentAnswers = stackedAnswers[inputId] || [];
        let newAnswers;
        
        if (isChecked) {
            newAnswers = [...currentAnswers, item];
        } else {
            newAnswers = currentAnswers.filter(answer => answer !== item);
        }
        
        onAnswerChange(inputId, newAnswers);
    };

    const handleMultiTextChange = (inputId, fieldId, value) => {
        const currentAnswers = stackedAnswers[inputId] || {};
        const newAnswers = { ...currentAnswers, [fieldId]: value };
        onAnswerChange(inputId, newAnswers);
    };

    const renderInput = (inputDef) => {
        const inputId = inputDef.id;
        const currentValue = stackedAnswers[inputId] || '';

        switch (inputDef.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => onAnswerChange(inputId, e.target.value)}
                        placeholder={inputDef.placeholder}
                        style={{
                            width: '100%',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid #dfe6e9',
                            fontSize: '1.05rem',
                            fontFamily: "'Nunito', sans-serif"
                        }}
                        required
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        rows={4}
                        value={currentValue}
                        onChange={(e) => onAnswerChange(inputId, e.target.value)}
                        placeholder={inputDef.placeholder}
                        style={{
                            width: '100%',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid #dfe6e9',
                            fontSize: '1.05rem',
                            fontFamily: "'Nunito', sans-serif",
                            resize: 'vertical',
                            minHeight: '120px'
                        }}
                        required
                    />
                );

            case 'checklist':
                // 백업 파일과 동일한 카드 색상 배열
                const cardColors = [
                    { bg: '#e8f4fd', border: '#74b9ff', accent: '#0984e3' },
                    { bg: '#fef7e8', border: '#fdcb6e', accent: '#e17055' },
                    { bg: '#f0e8ff', border: '#a29bfe', accent: '#6c5ce7' },
                    { bg: '#e8f8f5', border: '#00b894', accent: '#00a085' },
                    { bg: '#ffe8f7', border: '#fd79a8', accent: '#e84393' },
                    { bg: '#fff0e8', border: '#ff7675', accent: '#d63031' }
                ];

                return (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: '15px',
                        padding: '10px 0'
                    }}>
                        {inputDef.list.map((item, idx) => {
                            const currentAnswers = Array.isArray(stackedAnswers[inputId])
                                ? stackedAnswers[inputId]
                                : [];
                            const isChecked = currentAnswers.includes(item);
                            
                            const cardColor = cardColors[idx % cardColors.length];
                            
                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleChecklistChange(inputId, item, !isChecked)}
                                    style={{
                                        background: isChecked ? cardColor.bg : 'white',
                                        border: `3px solid ${isChecked ? cardColor.accent : cardColor.border}`,
                                        borderRadius: '20px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: isChecked ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                                        boxShadow: isChecked 
                                            ? `0 12px 35px ${cardColor.accent}25, 0 8px 15px ${cardColor.accent}15` 
                                            : '0 4px 12px rgba(0,0,0,0.08)',
                                        position: 'relative',
                                        minHeight: '85px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
                                        userSelect: 'none'
                                    }}
                                >
                                    {/* 선택 표시 */}
                                    {isChecked && (
                                        <>
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                width: '28px',
                                                height: '28px',
                                                background: cardColor.accent,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                boxShadow: `0 4px 12px ${cardColor.accent}40`
                                            }}>
                                                ✓
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                right: '10px',
                                                background: cardColor.accent,
                                                color: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '15px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                boxShadow: `0 2px 8px ${cardColor.accent}30`
                                            }}>
                                                선택됨 ✨
                                            </div>
                                        </>
                                    )}
                                    
                                    {/* 카드 내용 */}
                                    <div style={{
                                        fontSize: '1.05rem',
                                        fontWeight: '600',
                                        color: isChecked ? cardColor.accent : '#2d3436',
                                        lineHeight: '1.5',
                                        padding: '0 10px'
                                    }}>
                                        {item}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case 'multi-text':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {inputDef.fields.map((field, index) => (
                            <div key={field.id}>
                                <input
                                    type="text"
                                    value={(stackedAnswers[inputId] || {})[field.id] || ''}
                                    onChange={(e) => handleMultiTextChange(inputId, field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        border: '2px solid #dfe6e9',
                                        fontSize: '1.05rem',
                                        fontFamily: "'Nunito', sans-serif"
                                    }}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            {stackedInputs.map((inputDef, index) => (
                <div key={inputDef.id} style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#2d3436',
                        fontSize: '1.1rem'
                    }}>
                        {inputDef.label}
                    </label>
                    {renderInput(inputDef)}
                </div>
            ))}
            
            {/* M-3 미션 이미지 생성 기능 */}
            <ImageGenerator
                missionId={missionId}
                gradeGroup={gradeGroup}
                stackedAnswers={stackedAnswers}
            />
        </div>
    );
};

export default StackedInputs;