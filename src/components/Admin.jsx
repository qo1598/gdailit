import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Check, X, User, ArrowLeft, Loader2, Shield, Search, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'admin1234';

const MISSIONS = [
  { id: 'E-1', title: '우리 주변의 AI 찾기', imageUrl: '/e1_find_1773234874913.png' },
  { id: 'E-2', title: 'AI 답, 그대로 믿어도 될까?', imageUrl: '/e2_trust_1773234890193.png' },
  { id: 'E-3', title: '추천은 왜 나에게 왔을까?', imageUrl: '/e3_recommend_1773234908058.png' },
  { id: 'E-4', title: 'AI는 누구에게 불공평할까?', imageUrl: '/e4_fairness_1773234925903.png' },
  { id: 'C-1', title: 'AI와 이야기 이어쓰기', imageUrl: '/c1_story_1773234941443.png' },
  { id: 'C-2', title: 'AI 그림 보고 새 장면 만들기', imageUrl: '/c2_art_1773234957163.png' },
  { id: 'C-3', title: 'AI와 홍보물 만들기', imageUrl: '/c3_poster_1773234969699.png' },
  { id: 'C-4', title: '누가 만들었을까?', imageUrl: '/c4_copyright_1773234984925.png' },
  { id: 'M-1', title: '이럴 때 AI를 써도 될까?', imageUrl: '/m1_rules_1773234999640.png' },
  { id: 'M-2', title: '사람이 할 일, AI가 도와줄 일', imageUrl: '/m2_roles_1773235015302.png' },
  { id: 'M-3', title: 'AI에게 정확히 부탁하기', imageUrl: '/m3_prompt_1773235032419.png' },
  { id: 'M-4', title: '우리 반 AI 사용 약속 만들기', imageUrl: '/m4_promise_1773235045836.png' },
  { id: 'D-1', title: '같은 것끼리 묶어보자', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-2', title: 'AI가 배우는 자료 모으기', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-3', title: '잘못 분류되는 경우 찾기', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-4', title: '우리 학교 문제를 돕는 AI 상상하기', imageUrl: '/d1_sort_1773235059334.png' }
];

export default function Admin() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('LOGIN'); // 'LOGIN', 'DASHBOARD', 'STUDENT_LIST', 'DETAIL'
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    
    // Data states
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [allProgress, setAllProgress] = useState([]);
    const [allStudents, setAllStudents] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Current selection
    const [selectedMissionId, setSelectedMissionId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    
    // UI states
    const [rejectModal, setRejectModal] = useState({ show: false, comment: '' });

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        setIsAuthenticating(true);
        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                setViewMode('DASHBOARD');
                fetchData();
            } else {
                alert('비밀번호가 올바르지 않습니다.');
            }
            setIsAuthenticating(false);
        }, 500);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Students (Manual Join workaround)
            const { data: students, error: stuError } = await supabase
                .from('students')
                .select('id, name');
            if (stuError) throw stuError;
            
            const studentMap = (students || []).reduce((acc, s) => {
                acc[s.id] = s.name || s.id;
                return acc;
            }, {});
            setAllStudents(studentMap);

            // 2. Fetch User Progress (To filter pending)
            const { data: progress, error: progError } = await supabase
                .from('user_progress')
                .select('*');
            if (progError) throw progError;
            setAllProgress(progress || []);

            // 3. Fetch Submissions
            const { data: submissions, error: subError } = await supabase
                .from('mission_submissions')
                .select('*');
            if (subError) throw subError;
            setAllSubmissions(submissions || []);

        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getPendingCount = (missionId) => {
        return allProgress.filter(p => p.mission_id === missionId && !p.completed).length;
    };

    const handleApprove = async () => {
        try {
            const { error } = await supabase
                .from('user_progress')
                .update({ completed: true })
                .eq('user_id', selectedStudentId)
                .eq('mission_id', selectedMissionId);

            if (error) throw error;
            
            alert('승인이 완료되었습니다!');
            fetchData();
            setViewMode('STUDENT_LIST');
        } catch (err) {
            alert('승인 중 오류 발생: ' + err.message);
        }
    };

    const handleReject = async () => {
        if (!rejectModal.comment.trim()) {
            alert('반려 사유를 입력해 주세요.');
            return;
        }

        try {
            const sub = allSubmissions.find(s => s.user_id === selectedStudentId && s.mission_id === selectedMissionId);
            if (!sub) return;

            const updatedData = { ...sub.data, teacher_feedback: rejectModal.comment.trim() };

            const { error } = await supabase
                .from('mission_submissions')
                .update({ data: updatedData })
                .eq('user_id', selectedStudentId)
                .eq('mission_id', selectedMissionId);

            if (error) throw error;
            
            alert('반려 처리가 완료되었습니다.');
            setRejectModal({ show: false, comment: '' });
            fetchData();
            setViewMode('STUDENT_LIST');
        } catch (err) {
            alert('반려 처리 중 오류 발생');
        }
    };

    const renderLogin = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: '#0984e3', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'white' }}>
                    <Shield size={40} />
                </div>
                <h1 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.8rem', color: '#2d3436', marginBottom: '10px' }}>관리자 로그인</h1>
                <p style={{ color: '#636e72', marginBottom: '30px', fontWeight: 'bold' }}>관리 비밀번호를 입력해 주세요.</p>
                <form onSubmit={handleLogin}>
                    <input 
                        type="password" 
                        placeholder="비밀번호" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', marginBottom: '20px', fontSize: '1rem', textAlign: 'center' }}
                    />
                    <button 
                        type="submit"
                        disabled={isAuthenticating}
                        style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#0984e3', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(9, 132, 227, 0.3)' }}
                    >
                        {isAuthenticating ? <Loader2 className="animate-spin" size={20} /> : '인증하기'}
                    </button>
                </form>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="page-enter">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.8rem', color: '#2d3436', margin: 0 }}>관리자 미션 대시보드</h2>
                <button onClick={() => setViewMode('LOGIN')} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer' }}>로그아웃</button>
            </div>
            
            <div className="badge-grid">
                {MISSIONS.map(m => {
                    const pendingCount = getPendingCount(m.id);
                    return (
                        <div 
                            key={m.id} 
                            className={`badge-card ${pendingCount > 0 ? 'pending' : 'locked'}`}
                            onClick={() => { setSelectedMissionId(m.id); setViewMode('STUDENT_LIST'); }}
                        >
                            <span className="badge-id">{m.id}</span>
                            <div className="badge-image-container">
                                <img src={m.imageUrl} alt={m.title} className="badge-image" style={{ filter: pendingCount > 0 ? 'none' : 'grayscale(1) opacity(0.5)' }} />
                                {pendingCount > 0 && (
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#d63031', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 3px 10px rgba(214, 48, 49, 0.4)' }}>
                                        {pendingCount}
                                    </div>
                                )}
                            </div>
                            <div className="badge-title">{m.title}</div>
                            <div style={{
                                marginTop: 'auto', fontSize: '0.85rem', fontWeight: '900', padding: '6px 12px', borderRadius: '15px',
                                background: pendingCount > 0 ? '#ffeaa7' : '#f1f2f6',
                                color: pendingCount > 0 ? '#e67e22' : '#a4b0be',
                                width: '100%', textAlign: 'center'
                            }}>
                                {pendingCount > 0 ? '⚠️ 검토 대기' : '✅ 완료됨'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStudentList = () => {
        const mission = MISSIONS.find(m => m.id === selectedMissionId);
        const pendingStudents = allProgress
            .filter(p => p.mission_id === selectedMissionId && !p.completed)
            .map(p => ({ 
                id: p.user_id, 
                name: allStudents[p.user_id] || p.user_id,
                grade: p.user_id.substring(2, 3) 
            }));

        const grades = [...new Set(pendingStudents.map(s => s.grade))].sort();

        return (
            <div className="page-enter">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setViewMode('DASHBOARD')} style={{ background: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><ArrowLeft size={20} /></button>
                    <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.6rem', color: '#2d3436', margin: 0 }}>{mission?.title}</h2>
                </div>

                {pendingStudents.length === 0 ? (
                    <div style={{ background: 'white', padding: '50px', borderRadius: '30px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✨</div>
                        <h3>남은 검토가 없습니다!</h3>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {grades.map(grade => (
                            <div key={grade}>
                                <h3 style={{ fontFamily: "'Jua', sans-serif", color: '#0984e3', borderBottom: '2px solid #0984e3', paddingBottom: '8px', marginBottom: '15px' }}>{grade}학년 학생 리스트</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {pendingStudents.filter(s => s.grade === grade).map(student => (
                                        <div 
                                            key={student.id} 
                                            onClick={() => { setSelectedStudentId(student.id); setViewMode('DETAIL'); }}
                                            style={{ background: 'white', padding: '15px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid #eee' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#e1f5fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#0984e3" /></div>
                                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{student.name}</span>
                                            </div>
                                            <ChevronRight size={20} color="#b2bec3" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderDetail = () => {
        const studentName = allStudents[selectedStudentId] || selectedStudentId;
        const submission = allSubmissions.find(s => s.user_id === selectedStudentId && s.mission_id === selectedMissionId);
        
        const renderData = (data) => {
            if (!data) return '데이터 없음';
            if (data.rule1) return (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>• {data.rule1}</li>
                    <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>• {data.rule2}</li>
                    <li style={{ padding: '10px' }}>• {data.rule3}</li>
                </ul>
            );
            return data.text || JSON.stringify(data);
        };

        return (
            <div className="page-enter">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setViewMode('STUDENT_LIST')} style={{ background: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><ArrowLeft size={20} /></button>
                    <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.6rem', color: '#2d3436', margin: 0 }}>{studentName} 학생의 미션</h2>
                </div>

                <div style={{ background: 'white', borderRadius: '30px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '100px' }}>
                    {submission?.data?.file_url && (
                        <div style={{ marginBottom: '25px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <img 
                                src={submission.data.file_url} 
                                alt="Student Submission" 
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }} 
                            />
                        </div>
                    )}
                    
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', borderLeft: '5px solid #0984e3', marginBottom: '30px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        {renderData(submission?.data)}
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            onClick={handleApprove}
                            style={{ flex: 1, padding: '18px', borderRadius: '15px', border: 'none', background: '#00b894', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 6px 0 #00897b' }}
                        >
                            ✅ 최종 승인
                        </button>
                        <button 
                            onClick={() => setRejectModal({ show: true, comment: '' })}
                            style={{ flex: 1, padding: '18px', borderRadius: '15px', border: 'none', background: '#e17055', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 6px 0 #c0392b' }}
                        >
                            ❌ 반려 (보충 요청)
                        </button>
                    </div>
                </div>

                {/* Reject Modal */}
                {rejectModal.show && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '400px' }}>
                            <h3 style={{ fontFamily: "'Jua', sans-serif", marginBottom: '15px' }}>반려 및 보충 이유</h3>
                            <textarea 
                                placeholder="학생에게 전달할 의견을 입력해 주세요..."
                                value={rejectModal.comment}
                                onChange={(e) => setRejectModal({ ...rejectModal, comment: e.target.value })}
                                style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '15px', border: '2px solid #eee', marginBottom: '20px', fontSize: '0.95rem' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setRejectModal({ show: false, comment: '' })} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#eee', fontWeight: 'bold', cursor: 'pointer' }}>취소</button>
                                <button onClick={handleReject} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#e17055', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>요청 전달</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
            {viewMode === 'LOGIN' && renderLogin()}
            {viewMode === 'DASHBOARD' && renderDashboard()}
            {viewMode === 'STUDENT_LIST' && renderStudentList()}
            {viewMode === 'DETAIL' && renderDetail()}
        </div>
    );
}
