import React from 'react';
import DictionaryText from '../DictionaryText';

/**
 * 미션 스토리 단계 — 완전 반응형
 * PC: 세로 배치 (큰 이미지 + 중앙 텍스트 + 넓은 버튼)
 * 모바일: 가로 배치 (작은 캐릭터 왼쪽 + 텍스트 오른쪽 + 풀폭 버튼)
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
    if (!steps || steps.length === 0) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div
            style={{
                background: 'white',
                border: '3px solid #74b9ff',
                borderRadius: 'clamp(14px, 4vw, 20px)',
                padding: 'clamp(10px, 3vw, 20px)',
                boxShadow: '0 4px 12px rgba(116, 185, 255, 0.1)',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
        >
            {/* ====== PC 레이아웃: 세로 배치 ====== */}
            <div className="story-layout-desktop">
                {step.image && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <img
                            src={step.image}
                            alt="알리 캐릭터"
                            style={{
                                maxHeight: '160px',
                                objectFit: 'contain',
                                background: 'transparent',
                                marginBottom: '8px'
                            }}
                        />
                        <div style={{
                            background: '#74b9ff',
                            color: 'white',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}>
                            알리(AIli)
                        </div>
                    </div>
                )}
                <div style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                    lineHeight: '1.7',
                    fontWeight: '500',
                    color: '#2d3436',
                    textAlign: 'center',
                    padding: '0 clamp(5px, 2vw, 20px)',
                    marginBottom: '8px',
                    wordBreak: 'keep-all',
                    overflowWrap: 'break-word'
                }}>
                    <DictionaryText text={step.text} onWordClick={onWordClick} />
                </div>
            </div>

            {/* ====== 모바일 레이아웃: 가로 배치 ====== */}
            <div className="story-layout-mobile">
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '6px'
                }}>
                    {/* 캐릭터 + 이름 */}
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        {step.image && (
                            <img
                                src={step.image}
                                alt="알리 캐릭터"
                                style={{
                                    width: 'clamp(50px, 15vw, 65px)',
                                    height: 'clamp(50px, 15vw, 65px)',
                                    objectFit: 'contain',
                                    background: 'transparent'
                                }}
                            />
                        )}
                        <div style={{
                            background: '#74b9ff',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: 'clamp(10px, 2.5vw, 12px)',
                            fontWeight: 'bold',
                            marginTop: '2px',
                            whiteSpace: 'nowrap'
                        }}>
                            알리(AIli)
                        </div>
                    </div>
                    {/* 텍스트 */}
                    <div style={{
                        flex: 1,
                        fontSize: 'clamp(0.88rem, 3.8vw, 1rem)',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        color: '#2d3436',
                        wordBreak: 'keep-all',
                        overflowWrap: 'break-word',
                        paddingTop: '2px'
                    }}>
                        <DictionaryText text={step.text} onWordClick={onWordClick} />
                    </div>
                </div>
            </div>

            {/* ====== 공통: 단계 인디케이터 ====== */}
            <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '6px 0'
            }}>
                {steps.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: 'clamp(6px, 1.5vw, 8px)',
                            height: 'clamp(6px, 1.5vw, 8px)',
                            borderRadius: '50%',
                            background: index === currentStep ? '#74b9ff' : '#ddd',
                            transition: 'background 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* ====== 공통: 네비게이션 버튼 (유동 폭) ====== */}
            <div style={{
                display: 'flex',
                gap: 'clamp(8px, 2vw, 12px)',
                marginTop: '4px'
            }}>
                <button
                    type="button"
                    onClick={onPrevStep}
                    disabled={currentStep === 0}
                    style={{
                        flex: 1,
                        padding: 'clamp(10px, 2.5vw, 14px) 0',
                        background: currentStep === 0 ? '#e0e0e0' : '#b2bec3',
                        border: 'none',
                        borderRadius: 'clamp(16px, 4vw, 25px)',
                        color: 'white',
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.8rem, 3.2vw, 0.95rem)',
                        boxSizing: 'border-box'
                    }}
                >
                    ← 이전
                </button>
                <button
                    type="button"
                    onClick={isLastStep ? onComplete : onNextStep}
                    style={{
                        flex: 1.5,
                        padding: 'clamp(10px, 2.5vw, 14px) 0',
                        background: '#74b9ff',
                        border: 'none',
                        borderRadius: 'clamp(16px, 4vw, 25px)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.8rem, 3.2vw, 0.95rem)',
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
