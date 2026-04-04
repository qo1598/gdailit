import React from 'react';

/**
 * 미션 스토리 단계를 표시하는 컴포넌트
 */
const MissionStorySteps = ({ 
    steps, 
    currentStep, 
    onNextStep, 
    onPrevStep, 
    onComplete,
    setVocabModal 
}) => {
    if (!steps || steps.length === 0) {
        return null;
    }

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(116, 185, 255, 0.3)'
        }}>
            {step.image && (
                <div style={{ marginBottom: '20px' }}>
                    <img 
                        src={step.image} 
                        alt="스토리 이미지" 
                        style={{ 
                            maxWidth: '200px', 
                            height: 'auto', 
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }} 
                    />
                </div>
            )}
            
            <div style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '20px',
                fontWeight: '500'
            }}>
                {step.text}
            </div>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '20px'
            }}>
                <button
                    onClick={onPrevStep}
                    disabled={currentStep === 0}
                    style={{
                        background: currentStep === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 15px',
                        color: currentStep === 0 ? 'rgba(255,255,255,0.7)' : '#2d3436',
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ← 이전
                </button>

                <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                    alignItems: 'center'
                }}>
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: index === currentStep ? 'white' : 'rgba(255,255,255,0.4)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={isLastStep ? onComplete : onNextStep}
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 15px',
                        color: '#2d3436',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    {isLastStep ? '미션 시작!' : '다음 →'}
                </button>
            </div>
        </div>
    );
};

export default MissionStorySteps;