import React from 'react';

/**
 * mission.scenarioImages / scenarioDescriptions 를 탐구 과제 상단에 표시
 * @param {React.ReactNode} [descriptionNode] — 있으면 description 대신 렌더 (D-2 아오리 용어 링크 등)
 */
const MissionScenarioPanel = ({ imageUrl, description, descriptionNode }) => {
    const hasString = typeof description === 'string' ? description.trim().length > 0 : false;
    const hasNode = descriptionNode != null;
    const hasText = hasString || hasNode;
    if (!imageUrl && !hasText) return null;

    return (
        <div style={{ marginBottom: 'clamp(14px, 4vw, 20px)' }}>
            {imageUrl && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: hasText ? '12px' : 0,
                        background: 'linear-gradient(180deg, #f8f9fa 0%, #fff 100%)',
                        borderRadius: 'clamp(12px, 3vw, 16px)',
                        padding: 'clamp(10px, 3vw, 16px)',
                        border: '2px solid #fdcb6e',
                        boxShadow: '0 4px 14px rgba(253, 203, 110, 0.12)'
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="미션 상황 일러스트"
                        style={{
                            width: '100%',
                            maxWidth: 'min(100%, 400px)',
                            height: 'auto',
                            maxHeight: 'min(52vh, 280px)',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>
            )}
            {hasText && (
                <div
                    style={{
                        background: 'white',
                        color: '#2d3436',
                        fontSize: 'clamp(0.9rem, 3.4vw, 0.98rem)',
                        lineHeight: 1.55,
                        padding: 'clamp(12px, 3.5vw, 16px)',
                        borderRadius: '12px',
                        border: '2px dashed #fdcb6e',
                        fontWeight: '600'
                    }}
                >
                    {hasNode ? descriptionNode : description}
                </div>
            )}
        </div>
    );
};

export default MissionScenarioPanel;
