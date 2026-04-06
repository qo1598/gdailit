import React from 'react';
import DictionaryText from '../DictionaryText';

/**
 * 미션 스토리 단계를 표시하는 컴포넌트
 * 파란 테두리 박스·버튼 크기 고정으로 단계 전환 시 레이아웃이 흔들리지 않도록 함
 */
const MissionStorySteps = ({
    steps,
    currentStep,
    onNextStep,
    onPrevStep,
    onComplete,
    onWordClick,
    missionId
}) => {
    if (!steps || steps.length === 0) {
        return null;
    }

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const BTN_W = 172;
    const BTN_H = 56;

    return (
        <div
            style={{
                background: 'white',
                border: '3px solid #74b9ff',
                borderRadius: '20px',
                padding: '15px',
                boxShadow: '0 4px 12px rgba(116, 185, 255, 0.1)',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                textAlign: 'center'
            }}
        >
            <div
                style={{
                    maxHeight: '150px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                }}
            >
                {step.image ? (
                    <img
                        src={step.image}
                        alt="스토리 이미지"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '140px',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '15px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                ) : (
                    <div style={{ width: 1, height: 1, opacity: 0 }} aria-hidden />
                )}
            </div>

            <div
                style={{
                    background: '#74b9ff',
                    color: 'white',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    alignSelf: 'center',
                    marginBottom: '8px',
                    flexShrink: 0
                }}
            >
                알리
            </div>

            <div
                style={{
                    flex: '1 1 auto',
                    minHeight: '80px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    fontSize: '1.1rem',
                    lineHeight: '1.5',
                    fontWeight: '500',
                    color: '#2d3436',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    boxSizing: 'border-box'
                }}
            >
                <DictionaryText text={step.text} onWordClick={onWordClick} />
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `${BTN_W}px 1fr ${BTN_W}px`,
                    alignItems: 'center',
                    justifyItems: 'stretch',
                    gap: '8px',
                    marginTop: '10px',
                    flexShrink: 0,
                    minHeight: `${BTN_H}px`
                }}
            >
                <button
                    type="button"
                    onClick={onPrevStep}
                    disabled={currentStep === 0}
                    style={{
                        width: `${BTN_W}px`,
                        height: `${BTN_H}px`,
                        padding: 0,
                        background: currentStep === 0 ? '#ddd' : '#74b9ff',
                        border: 'none',
                        borderRadius: '25px',
                        color: 'white',
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        lineHeight: 1.2,
                        boxSizing: 'border-box'
                    }}
                >
                    ← 이전
                </button>

                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        minHeight: `${BTN_H}px`
                    }}
                >
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: index === currentStep ? '#74b9ff' : '#ddd',
                                transition: 'background 0.3s ease',
                                flexShrink: 0
                            }}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={isLastStep ? onComplete : onNextStep}
                    style={{
                        width: `${BTN_W}px`,
                        height: `${BTN_H}px`,
                        padding: 0,
                        background: '#74b9ff',
                        border: 'none',
                        borderRadius: '25px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        lineHeight: 1.2,
                        boxSizing: 'border-box'
                    }}
                >
                    {isLastStep ? '학습 내용 확인하기' : '다음 단계로'}
                </button>
            </div>
        </div>
    );
};

export default MissionStorySteps;
