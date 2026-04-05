import React from 'react';

/**
 * mission.scenarioImages / scenarioDescriptions 를 탐구 과제 상단에 표시
 */
const MissionScenarioPanel = ({ imageUrl, description }) => {
    if (!imageUrl && !description) return null;

    return (
        <div style={{ marginBottom: '20px' }}>
            {imageUrl && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: description ? '12px' : 0,
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '15px',
                        border: '2px solid #fdcb6e'
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="미션 상황 일러스트"
                        style={{
                            maxWidth: '70%',
                            height: 'auto',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>
            )}
            {description && (
                <div
                    style={{
                        background: 'white',
                        color: '#2d3436',
                        fontSize: '0.98rem',
                        lineHeight: 1.55,
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '2px dashed #fdcb6e',
                        fontWeight: '600'
                    }}
                >
                    {description}
                </div>
            )}
        </div>
    );
};

export default MissionScenarioPanel;
