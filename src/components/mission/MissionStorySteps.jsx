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
    setVocabModal,
    missionId 
}) => {
    if (!steps || steps.length === 0) {
        return null;
    }

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    // 미션별 테마 색상
    const getThemeColors = (missionId) => {
        switch (missionId) {
            case 'E-1':
                return {
                    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    shadow: 'rgba(79, 172, 254, 0.3)'
                };
            case 'M-1':
                return {
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    shadow: 'rgba(102, 126, 234, 0.3)'
                };
            case 'M-2':
                return {
                    gradient: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
                    shadow: 'rgba(255, 118, 117, 0.3)'
                };
            case 'M-3':
                return {
                    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
                    shadow: 'rgba(162, 155, 254, 0.3)'
                };
            default:
                return {
                    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                    shadow: 'rgba(116, 185, 255, 0.3)'
                };
        }
    };

    const theme = getThemeColors(missionId);

    return (
        <div style={{
            background: 'white',
            border: '3px solid #74b9ff',
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(116, 185, 255, 0.1)',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto'
        }}>

            {step.image && (
                <div style={{ marginBottom: '20px' }}>
                    <img 
                        src={step.image} 
                        alt="스토리 이미지" 
                        style={{ 
                            maxWidth: '300px', 
                            height: 'auto', 
                            borderRadius: '15px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                    />
                </div>
            )}
            
            {/* 알리 이름표를 캐릭터 이미지 밑에 배치 */}
            <div style={{
                background: '#74b9ff',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '20px'
            }}>
                알리
            </div>
            
            <div style={{
                fontSize: '1.3rem',
                lineHeight: '1.6',
                marginBottom: '20px',
                fontWeight: '500',
                color: '#2d3436'
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
                        background: currentStep === 0 ? '#ddd' : '#74b9ff',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 40px',
                        color: 'white',
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        minWidth: '120px'
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
                                background: index === currentStep ? '#74b9ff' : '#ddd',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={isLastStep ? onComplete : onNextStep}
                    style={{
                        background: '#74b9ff',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 40px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        minWidth: '120px'
                    }}
                >
                    {isLastStep ? '다음 →' : '다음 →'}
                </button>
            </div>
        </div>
    );
};

export default MissionStorySteps;