import React from 'react';
import { useNavigate } from 'react-router-dom';


const GRADE_OPTIONS = [
    { label: '1·2학년군', band: 'lower' },
    { label: '3·4학년군', band: 'middle' },
    { label: '5·6학년군', band: 'upper' },
];

export default function Dashboard({ missions, refresh, justAttended, setJustAttended, gradeGroup, isTestAccount }) {
    const navigate = useNavigate();
    const [, setShowRewardModal] = React.useState(false);
    const [gradeModal, setGradeModal] = React.useState(null); // missionId when open

    React.useEffect(() => {
        if (justAttended) {
            setShowRewardModal(true);
            setJustAttended(false);
        }
        if (refresh) {
            refresh();
        }
    }, [justAttended, setJustAttended, refresh]);

    const navigateToMission = (id, band) => {
        navigate(`/mission/${id}/${band}`);
    };

    const handleMissionClick = (id) => {
        if (isTestAccount) {
            setGradeModal(id);
        } else {
            navigateToMission(id, gradeGroup);
        }
    };

    const handleGradeSelect = (band) => {
        const id = gradeModal;
        setGradeModal(null);
        navigateToMission(id, band);
    };

    return (
        <div className="page-enter">
            <div className="badge-grid">
                {missions.map(mission => {
                    const isCompleted = mission.status === 'completed';
                    const isPending = mission.status === 'pending';
                    const isSupplement = mission.status === 'supplement';

                    return (
                        <div
                            key={mission.id}
                            className={`badge-card ${isCompleted ? 'completed' : isSupplement ? 'supplement' : isPending ? 'pending' : 'locked'}`}
                            onClick={() => handleMissionClick(mission.id)}
                            style={isSupplement ? { border: '3px solid #e17055', boxShadow: '0 0 15px rgba(225, 112, 85, 0.3)' } : {}}
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
                                        {isSupplement ? '✍️' : '❓'}
                                    </div>
                                )}
                            </div>
                            <div className="badge-title">{mission.title}</div>

                            <div style={{
                                marginTop: 'auto',
                                fontSize: '0.8rem',
                                fontWeight: '900',
                                padding: '6px 10px',
                                borderRadius: '12px',
                                background: isCompleted ? '#fef3c7' : isSupplement ? '#fee2e2' : isPending ? '#fef9c3' : '#f1f5f9',
                                color: isCompleted ? '#92400e' : isSupplement ? '#991b1b' : isPending ? '#854d0e' : '#94a3b8',
                                width: '100%',
                                textAlign: 'center'
                            }}>
                                {isCompleted ? '뱃지 획득' : isSupplement ? '보충 필요' : isPending ? '검토 대기' : '도전하기'}
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
                        <div style={{ marginTop: '15px', fontSize: '0.85rem', fontWeight: 'bold', padding: '6px', borderRadius: '15px', background: '#f1f2f6', color: '#b2bec3', width: '100%', textAlign: 'center' }}>잠김</div>
                    </div>
                ))}
            </div>

            {/* 학년군 선택 모달 (검증 계정 전용) */}
            {gradeModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setGradeModal(null)}
                >
                    <div
                        style={{
                            background: '#fff', borderRadius: '20px', padding: '32px 28px',
                            minWidth: '300px', textAlign: 'center',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.18)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em' }}>
                            검증 계정 · {gradeModal}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', marginBottom: '24px' }}>
                            학년군을 선택하세요
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {GRADE_OPTIONS.map(opt => (
                                <button
                                    key={opt.band}
                                    onClick={() => handleGradeSelect(opt.band)}
                                    style={{
                                        padding: '14px 20px', borderRadius: '12px',
                                        border: '2px solid #e2e8f0', background: '#f8fafc',
                                        cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                                        color: '#334155', textAlign: 'center', width: '100%',
                                        transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setGradeModal(null)}
                            style={{
                                marginTop: '20px', background: 'none', border: 'none',
                                color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem'
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
