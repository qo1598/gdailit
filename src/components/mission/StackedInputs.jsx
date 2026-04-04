import React from 'react';

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
                const cardColors = [
                    { bg: '#fff5f5', border: '#fed7d7', accent: '#e53e3e' },
                    { bg: '#fffaf0', border: '#fbd38d', accent: '#dd6b20' },
                    { bg: '#f0fff4', border: '#9ae6b4', accent: '#38a169' },
                    { bg: '#ebf8ff', border: '#90cdf4', accent: '#3182ce' },
                    { bg: '#faf5ff', border: '#d6bcfa', accent: '#805ad5' },
                    { bg: '#fffbf0', border: '#f6e05e', accent: '#d69e2e' }
                ];

                return (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '15px',
                        marginTop: '10px'
                    }}>
                        {inputDef.list.map((item, index) => {
                            const isChecked = (stackedAnswers[inputId] || []).includes(item);
                            const colors = cardColors[index % cardColors.length];
                            
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleChecklistChange(inputId, item, !isChecked)}
                                    style={{
                                        background: isChecked ? colors.bg : 'white',
                                        border: `3px solid ${isChecked ? colors.accent : colors.border}`,
                                        borderRadius: '15px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: isChecked ? 'translateY(-2px)' : 'translateY(0)',
                                        boxShadow: isChecked 
                                            ? `0 8px 25px ${colors.accent}30` 
                                            : '0 2px 8px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        minHeight: '80px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    {isChecked && (
                                        <>
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                width: '24px',
                                                height: '24px',
                                                background: colors.accent,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}>
                                                ✓
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '8px',
                                                right: '8px',
                                                background: colors.accent,
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                선택됨 ✨
                                            </div>
                                        </>
                                    )}
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: isChecked ? colors.accent : '#2d3436',
                                        lineHeight: '1.4'
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
        </div>
    );
};

export default StackedInputs;