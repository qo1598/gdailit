import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ missions, refresh, justAttended, setJustAttended }) {
    const navigate = useNavigate();
    const [showRewardModal, setShowRewardModal] = React.useState(false);

    React.useEffect(() => {
        if (justAttended) {
            setShowRewardModal(true);
            setJustAttended(false); // Clear the flag in parent
        }
        if (refresh) {
            refresh();
        }
    }, [justAttended, setJustAttended, refresh]);

    const handleMissionClick = (id) => {
        navigate(`/mission/${id}`);
    };

    const completedCount = missions.filter(m => m.completed).length;

    return (
        <div className="page-enter">
            <div className="badge-grid">
                {missions.map(mission => {
                    const isCompleted = mission.status === 'completed';
                    const isPending = mission.status === 'pending';

                    return (
                        <div
                            key={mission.id}
                            className={`badge-card ${isCompleted ? 'completed' : isPending ? 'pending' : 'locked'}`}
                            onClick={() => handleMissionClick(mission.id)}
                        >
                            <span className="badge-id">{mission.id}</span>
                            <div className="badge-image-container">
                                {isCompleted && <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, #ffeaa7 0%, transparent 70%)', zIndex: 1, animation: 'pulse 2s infinite' }}></div>}

                                <img
                                    src={mission.imageUrl}
                                    alt={mission.title}
                                    className={`badge-image ${isCompleted ? '' : 'mystery-fog'}`}
                                />

                                {!isCompleted && (
                                    <div className="mystery-icon">
                                        ❓
                                    </div>
                                )}
                            </div>
                            <div className="badge-title">{mission.title}</div>

                            <div style={{
                                marginTop: 'auto',
                                fontSize: '0.85rem',
                                fontWeight: '900',
                                padding: '6px 12px',
                                borderRadius: '15px',
                                background: isCompleted ? '#ffeaa7' : isPending ? '#ffeaa7' : '#f1f2f6',
                                color: isCompleted ? '#d35400' : isPending ? '#e67e22' : '#a4b0be',
                                width: '100%',
                                textAlign: 'center'
                            }}>
                                {isCompleted ? '✨ 뱃지 획득!' : isPending ? '⏳ 검토 대기 중' : '🔒 도전하기'}
                            </div>
                        </div>
                    );
                })}

                {/* Fill the rest with empty mock slots to show the "16" total scale */}
                {Array.from({ length: Math.max(0, 16 - missions.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="badge-card" style={{ opacity: 0.5 }}>
                        <span className="badge-id">?</span>
                        <div className="badge-image-container">
                            <div style={{ width: '60px', height: '60px', background: '#dfe6e9', borderRadius: '50%' }}></div>
                        </div>
                        <div className="badge-title" style={{ color: '#b2bec3' }}>비밀 미션</div>
                        <div style={{ marginTop: '15px', fontSize: '0.85rem', fontWeight: 'bold', padding: '6px', borderRadius: '15px', background: '#f1f2f6', color: '#b2bec3', width: '100%', textAlign: 'center' }}>🔒 잠김</div>
                    </div>
                ))}
            </div>

    );
}
