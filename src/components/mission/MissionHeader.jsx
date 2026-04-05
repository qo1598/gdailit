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
            case 'M-4':
                return {
                    gradient: 'linear-gradient(135deg, #fdcba0 0%, #fab1a0 100%)',
                    buttonColor: '#e17055'
                };
            case 'D-1':
                return {
                    gradient: 'linear-gradient(135deg, #00cec9 0%, #55efc4 100%)',
                    buttonColor: '#00b894'
                };
            case 'D-2':
                return {
                    gradient: 'linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)',
                    buttonColor: '#d63031'
                };
            case 'D-3':
                return {
                    gradient: 'linear-gradient(135deg, #636e72 0%, #b2bec3 100%)',
                    buttonColor: '#2d3436'
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
        <div>
            {/* Why 섹션 - 초록색 테두리 */}
            {currentWhy && (
                <div style={{
                    background: 'white',
                    border: '3px solid #00b894',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                    }}>
                        <div style={{ fontSize: '24px' }}>🤔</div>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: '#00b894'
                        }}>
                            왜 중요한가요?
                        </div>
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#2d3436'
                    }}>
                        {currentWhy}
                    </div>
                </div>
            )}

            {/* Example 섹션 - 초록색 테두리 */}
            {currentExample && (
                <div style={{
                    background: 'white',
                    border: '3px solid #00b894',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                    }}>
                        <div style={{ fontSize: '24px' }}>💡</div>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: '#00b894'
                        }}>
                            예를 들어볼까요?
                        </div>
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#2d3436'
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
                        background: '#00b894',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    미션 시작하기
                </button>
            </div>
        </div>
    );
};

export default MissionHeader;