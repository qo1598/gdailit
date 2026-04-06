import React from 'react';
import DictionaryText from '../DictionaryText';

/**
 * 미션 스토리 단계를 표시하는 컴포넌트
 * PC: 세로 배치 (이미지 위, 텍스트 아래 — 넉넉한 레이아웃)
 * 모바일: 가로 배치 (캐릭터 왼쪽, 텍스트 오른쪽 — 컴팩트 레이아웃)
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

    const BTN_W = 150;
    const BTN_H = 48;

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
                boxSizing: 'border-box'
            }}
        >
            {/* ====== PC 레이아웃 (768px 이상): 세로 배치 ====== */}
            <div className="story-layout-desktop">
                {step.image && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                    }}>
                        <img
                            src={step.image}
                            alt="알리 캐릭터"
                            style={{
                                maxHeight: '180px',
                                objectFit: 'contain',
                                background: 'transparent'
                            }}
                        />
                    </div>
                )}
                <div style={{
                    background: '#74b9ff',
                    color: 'white',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    alignSelf: 'center',
                    marginBottom: '12px'
                }}>
                    알리(AIli)
                </div>
                <div style={{
                    fontSize: '1.15rem',
                    lineHeight: '1.7',
                    fontWeight: '500',
                    color: '#2d3436',
                    textAlign: 'center',
                    padding: '0 10px',
                    marginBottom: '8px',
                    wordBreak: 'keep-all',
                    overflowWrap: 'break-word'
                }}>
                    <DictionaryText text={step.text} onWordClick={onWordClick} />
                </div>
            </div>

            {/* ====== 모바일 레이아웃 (767px 이하): 가로 배치 ====== */}
            <div className="story-layout-mobile">
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '6px'
                }}>
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        {step.image && (
                            <img
                                src={step.image}
                                alt="알리 캐릭터"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'contain',
                                    background: 'transparent'
                                }}
                            />
                        )}
                        <div style={{
                            background: '#74b9ff',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            marginTop: '3px',
                            display: 'inline-block'
                        }}>
                            알리(AIli)
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        color: '#2d3436',
                        wordBreak: 'keep-all',
                        overflowWrap: 'break-word',
                        paddingTop: '4px'
                    }}>
                        <DictionaryText text={step.text} onWordClick={onWordClick} />
                    </div>
                </div>
            </div>

            {/* ====== 공통: 네비게이션 버튼 ====== */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `${BTN_W}px 1fr ${BTN_W}px`,
                    alignItems: 'center',
                    justifyItems: 'stretch',
                    gap: '8px',
                    marginTop: '8px',
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
                        fontSize: '14px',
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
                                width: '8px',
                                height: '8px',
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
                        fontSize: '14px',
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
