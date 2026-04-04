import React from 'react';

/**
 * 미션 헤더 컴포넌트
 */
const MissionHeader = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    currentWhy, 
    currentExample,
    onBack 
}) => {
    if (!mission) {
        return null;
    }

    const getGradeGroupName = (group) => {
        switch (group) {
            case 'lower': return '1-2학년';
            case 'middle': return '3-4학년';
            case 'upper': return '5-6학년';
            default: return group;
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 배경 장식 */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
            }} />
            
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 뒤로가기 버튼 */}
                <button
                    onClick={onBack}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        color: 'white',
                        cursor: 'pointer',
                        marginBottom: '15px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                    }}
                >
                    ← 대시보드로
                </button>

                {/* 미션 제목 */}
                <h1 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    {mission.title}
                </h1>

                {/* 미션 ID와 학년군 */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '15px',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                    }}>
                        {missionId}
                    </span>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                    }}>
                        {getGradeGroupName(gradeGroup)}
                    </span>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                    }}>
                        {mission.competency}
                    </span>
                </div>

                {/* Why 섹션 */}
                {currentWhy && (
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        marginBottom: '15px'
                    }}>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            opacity: 0.9
                        }}>
                            🎯 이 미션을 하는 이유
                        </div>
                        <div style={{
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            fontWeight: '500'
                        }}>
                            {currentWhy}
                        </div>
                    </div>
                )}

                {/* Example 섹션 */}
                {currentExample && (
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px'
                    }}>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            opacity: 0.9
                        }}>
                            💡 예시
                        </div>
                        <div style={{
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            fontWeight: '500'
                        }}>
                            {currentExample}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionHeader;