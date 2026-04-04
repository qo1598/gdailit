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
    onBack,
    onComplete
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

    // 미션별 테마 색상
    const getThemeColors = (missionId) => {
        switch (missionId) {
            case 'E-1':
                return {
                    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    buttonColor: '#4facfe'
                };
            case 'M-1':
                return {
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    buttonColor: '#667eea'
                };
            case 'M-2':
                return {
                    gradient: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
                    buttonColor: '#ff7675'
                };
            case 'M-3':
                return {
                    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
                    buttonColor: '#a29bfe'
                };
            default:
                return {
                    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                    buttonColor: '#6c5ce7'
                };
        }
    };

    const theme = getThemeColors(missionId);

    return (
        <div style={{
            background: theme.gradient,
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

                {/* 다음 단계 버튼 */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={onComplete}
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            color: theme.buttonColor,
                            border: 'none',
                            borderRadius: '25px',
                            padding: '12px 30px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s'
                        }}
                    >
                        🎯 미션 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionHeader;