import React from 'react';
import DictionaryText from '../DictionaryText';
import ImageGenerator from './ImageGenerator';
import D1LowerBasketDnD from './d1/D1LowerBasketDnD';
import D1MiddleGroupsDnD from './d1/D1MiddleGroupsDnD';
import { renderAomoriFragments } from './d2/AomoriAppleHelpModal';

/**
 * 스택된 입력 필드들을 렌더링하는 컴포넌트
 */
const StackedInputs = ({ 
    stackedInputs, 
    stackedAnswers, 
    onAnswerChange,
    missionId,
    gradeGroup,
    onC3GeneratePoster,
    isGeneratingC3Image,
    onRequestAomoriHelp,
    onWordClick
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
                        style={{
                            width: '100%',
                            padding: 'clamp(14px, 3.5vw, 16px)',
                            borderRadius: '14px',
                            border: '2px solid #dfe6e9',
                            fontSize: 'max(16px, 1.05rem)',
                            fontFamily: "'Nunito', sans-serif",
                            minHeight: '48px',
                            boxSizing: 'border-box',
                            WebkitTapHighlightColor: 'transparent',
                            touchAction: 'manipulation'
                        }}
                        required
                    />
                );

            case 'textarea':
                return (
                    <>
                        <textarea
                            rows={4}
                            value={currentValue}
                            onChange={(e) => onAnswerChange(inputId, e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'clamp(14px, 3.5vw, 16px)',
                                borderRadius: '14px',
                                border: '2px solid #dfe6e9',
                                fontSize: 'max(16px, 1.05rem)',
                                fontFamily: "'Nunito', sans-serif",
                                resize: 'vertical',
                                minHeight: '120px',
                                boxSizing: 'border-box',
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation'
                            }}
                            required
                        />
                        {missionId === 'C-3' && gradeGroup !== 'lower' && inputDef.id === 'creative_edit' && onC3GeneratePoster && (
                            <button
                                type="button"
                                onClick={onC3GeneratePoster}
                                disabled={isGeneratingC3Image}
                                style={{
                                    marginTop: '15px',
                                    width: '100%',
                                    padding: '18px',
                                    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontWeight: '900',
                                    fontSize: '1.2rem',
                                    cursor: isGeneratingC3Image ? 'wait' : 'pointer',
                                    boxShadow: '0 8px 20px rgba(108, 92, 231, 0.25)',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span style={{ fontSize: '1.4rem' }}>✨</span>
                                마법의 AI로 포스터 그리기
                            </button>
                        )}
                    </>
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
                                        <DictionaryText text={item} onWordClick={onWordClick} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case 'd1-lower-basket-dnd':
                return (
                    <D1LowerBasketDnD
                        value={currentValue}
                        onAnswerChange={(v) => onAnswerChange(inputId, v)}
                    />
                );

            case 'd1-middle-drag':
                return (
                    <D1MiddleGroupsDnD
                        value={currentValue}
                        onAnswerChange={(v) => onAnswerChange(inputId, v)}
                        dndVariant={inputDef.dndVariant}
                        dndLabels={inputDef.dndLabels}
                    />
                );

            case 'd1-upper-drag':
                return (
                    <D1MiddleGroupsDnD
                        value={currentValue}
                        onAnswerChange={(v) => onAnswerChange(inputId, v)}
                        dndVariant="upper"
                        dndLabels={inputDef.dndLabels}
                    />
                );

            case 'multi-text':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {inputDef.fields.map((field) => (
                            <div key={field.id}>
                                {field.label && (
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: 'clamp(0.92rem, 3.2vw, 1rem)',
                                            color: '#2d3436',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <DictionaryText text={field.label} onWordClick={onWordClick} />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={(stackedAnswers[inputId] || {})[field.id] || ''}
                                    onChange={(e) => handleMultiTextChange(inputId, field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: 'clamp(12px, 3.2vw, 15px)',
                                        borderRadius: '12px',
                                        border: '2px solid #dfe6e9',
                                        fontSize: 'max(16px, 1.05rem)',
                                        fontFamily: "'Nunito', sans-serif",
                                        minHeight: '48px',
                                        boxSizing: 'border-box',
                                        WebkitTapHighlightColor: 'transparent',
                                        touchAction: 'manipulation'
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

    const [visibleHints, setVisibleHints] = React.useState({});

    const toggleHint = (inputId) => {
        setVisibleHints(prev => ({
            ...prev,
            [inputId]: !prev[inputId]
        }));
    };

    return (
        <div>
            {stackedInputs.map((inputDef, index) => {
                const labelStyle = {
                    fontWeight: 'bold',
                    color: '#2d3436',
                    fontSize: 'clamp(1rem, 3.6vw, 1.1rem)'
                };
                const aomoriLabel =
                    typeof inputDef.label === 'string' &&
                    inputDef.label.includes('{{AOMORI}}') &&
                    onRequestAomoriHelp;

                return (
                <div key={inputDef.id} style={{ marginBottom: '25px' }}>
                    {!inputDef.omitLabel && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '10px' 
                        }}>
                            {aomoriLabel ? (
                                <div style={labelStyle}>
                                    {renderAomoriFragments(inputDef.label, onRequestAomoriHelp)}
                                </div>
                            ) : (
                            <label style={labelStyle}>
                                <DictionaryText text={inputDef.label} onWordClick={onWordClick} />
                            </label>
                            )}
                            {inputDef.placeholder && (
                                <button
                                    type="button"
                                    onClick={() => toggleHint(inputDef.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.3rem',
                                        padding: '0 5px',
                                        opacity: 0.8,
                                        touchAction: 'manipulation'
                                    }}
                                    title="힌트 보기"
                                >
                                    💡
                                </button>
                            )}
                        </div>
                    )}
                    
                    {visibleHints[inputDef.id] && inputDef.placeholder && (
                        <div style={{
                            background: '#fff9c4',
                            border: '2px dashed #fbc02d',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            marginBottom: '15px',
                            color: '#f57f17',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            lineHeight: 1.5
                        }}>
                            <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>🎯</span>
                            <span><strong>힌트 도우미</strong> {inputDef.placeholder}</span>
                        </div>
                    )}
                    
                    {renderInput(inputDef)}
                </div>
                );
            })}
            
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