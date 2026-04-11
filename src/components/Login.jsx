import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SCHOOLS = [
    { id: 'gyeongdong', name: '대구경동초등학교' },
    // 추후 학교 추가 예시:
    // { id: 'sungnam', name: '성남초등학교' },
];

export default function Login({ onLogin }) {
    const [schoolId, setSchoolId] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password change modal state
    const [showChangePw, setShowChangePw] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [currentStudent, setCurrentStudent] = useState(null);

    const navigate = useNavigate();

    const handleLoginClick = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!schoolId) {
            setErrorMsg('학교를 먼저 선택해주세요!');
            return;
        }

        if (!userId.trim() || !password.trim()) {
            setErrorMsg('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);
        // ... (rest of logic remains same, just ensuring schoolId check)
        try {
            // Check credentials against the students table
            const { data: student, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', userId.trim())
                .maybeSingle();

            if (error || !student) {
                setErrorMsg('아이디를 찾을 수 없습니다.');
                setIsLoading(false);
                return;
            }

            if (student.password !== password) {
                setErrorMsg('비밀번호가 틀렸습니다.');
                setIsLoading(false);
                return;
            }

            // Credentials are correct. Check if it's their first login
            if (student.is_first_login) {
                setCurrentStudent({ ...student, schoolId });
                setShowChangePw(true);
                setIsLoading(false);
                return;
            }

            // Normal login success - Check Attendance Reward
            const updatedStudent = await checkAttendance(student);
            onLoginUserId({ ...updatedStudent, schoolId });

        } catch (err) {
            console.error('Login error:', err);
            setErrorMsg('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            if (!showChangePw) setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!newPassword.trim() || !newName.trim()) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('students')
                .update({
                    password: newPassword,
                    name: newName.trim(),
                    is_first_login: false
                })
                .eq('id', userId.trim());

            if (error) throw error;

            // Successfully changed password and name, now log them in
            setShowChangePw(false);
            onLoginUserId({ ...currentStudent, schoolId, password: newPassword, name: newName.trim(), is_first_login: false });

        } catch (err) {
            console.error('Password change error:', err);
            setErrorMsg('비밀번호 변경에 실패했습니다. (이름 추가 기능이 데이터베이스에 설정되었는지 확인하세요)');
        } finally {
            setIsLoading(false);
        }
    };

    const getKstDate = () => {
        const now = new Date();
        const kstString = now.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' });
        return kstString.replace(/\. /g, '-').replace(/\./, '');
    };

    const checkAttendance = async (student) => {
        const today = getKstDate();

        if (student.last_attended_at === today) {
            return student;
        }

        try {
            const newFragments = (student.fragments || 0) + 3;
            const { data, error } = await supabase
                .from('students')
                .update({
                    last_attended_at: today,
                    fragments: newFragments
                })
                .eq('id', student.id)
                .select()
                .maybeSingle();

            if (error) {
                console.error('Attendance update error:', error);
                return student;
            }

            return { ...data, justAttended: true };
        } catch (err) {
            console.error('Unexpected checkAttendance error:', err);
            return student;
        }
    };

    const onLoginUserId = (studentData) => {
        onLogin(studentData);
        navigate('/');
    };


    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', background: 'linear-gradient(135deg, #ff9f43 0%, #ff4757 100%)' }}>

            {/* Login Box */}
            <div style={{ background: 'white', padding: '40px 30px', borderRadius: '30px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', zIndex: 5 }}>
                
                <h1 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2.4rem', color: '#2f3542', marginBottom: '10px', whiteSpace: 'nowrap' }}>Learn Your AILit</h1>
                <p style={{ color: '#747d8c', marginBottom: '25px', fontWeight: 'bold', textAlign: 'center', fontSize: '0.92rem', lineHeight: '1.6' }}>
                    AI 리터러시 관련 미션을 해결하고 뱃지를 얻어<br />
                    여러분만의 디지털 도감을 완성하세요.
                </p>

                <form onSubmit={handleLoginClick} style={{ width: '100%' }}>
                    {/* 학교 선택 */}
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <select
                            value={schoolId}
                            onChange={(e) => setSchoolId(e.target.value)}
                            style={{
                                width: '100%', padding: '15px', border: '2px solid #dfe6e9', borderRadius: '15px',
                                fontSize: '1rem', fontFamily: "'Nunito', sans-serif", textAlign: 'center',
                                textAlignLast: 'center',
                                outline: 'none', background: '#f8f9fa', color: schoolId ? '#2f3542' : '#a4b0be',
                                fontWeight: 'bold', cursor: 'pointer', boxSizing: 'border-box', appearance: 'none'
                            }}
                        >
                            <option value="" disabled>-학교를 선택해주세요-</option>
                            {SCHOOLS.map(s => (
                                <option key={s.id} value={s.id} style={{ color: '#2f3542' }}>{s.name}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a4b0be' }}>▼</div>
                    </div>

                    <input
                        type="text"
                        inputMode="numeric"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="아이디(예: 2610101)"
                        required
                        style={{
                            width: '100%', padding: '15px', border: '2px solid #dfe6e9', borderRadius: '15px',
                            fontSize: '1.1rem', fontFamily: "'Nunito', sans-serif", textAlign: 'center',
                            marginBottom: '10px', outline: 'none', transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호(예: 2610101!)"
                        required
                        style={{
                            width: '100%', padding: '15px', border: '2px solid #dfe6e9', borderRadius: '15px',
                            fontSize: '1.1rem', fontFamily: "'Nunito', sans-serif", textAlign: 'center',
                            marginBottom: '15px', outline: 'none', transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errorMsg && (
                        <div style={{ color: '#ff4757', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
                            {errorMsg}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ marginTop: 0 }} disabled={isLoading}>
                        {isLoading ? '확인 중...' : '입장하기'}
                    </button>
                </form>
            </div>


            {/* Password Change Modal Overlay */}
            {showChangePw && (
                <div className="success-overlay" style={{ background: 'rgba(0,0,0,0.8)', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '25px', width: '90%', maxWidth: '350px', textAlign: 'center' }}>
                        <h2 style={{ fontFamily: "'Jua', sans-serif", color: '#e67e22', marginBottom: '15px' }}>환영합니다!</h2>
                        <p style={{ fontWeight: 'bold', color: '#555', marginBottom: '20px', fontSize: '0.95rem' }}>
                            본인의 이름과 새로운 비밀번호를 설정해주세요. (이후에는 새 비밀번호로 입장합니다)
                        </p>

                        <form onSubmit={handleChangePassword}>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="이름 (예: 배국환)"
                                required
                                style={{
                                    width: '100%', padding: '15px', border: '2px solid #ffeaa7', borderRadius: '15px',
                                    fontSize: '1.1rem', fontFamily: "'Nunito', sans-serif", textAlign: 'center',
                                    marginBottom: '10px', outline: 'none', backgroundColor: '#fffcf0', boxSizing: 'border-box'
                                }}
                            />
                            <input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새로운 비밀번호 입력"
                                required
                                style={{
                                    width: '100%', padding: '15px', border: '2px solid #ffeaa7', borderRadius: '15px',
                                    fontSize: '1.1rem', fontFamily: "'Nunito', sans-serif", textAlign: 'center',
                                    marginBottom: '20px', outline: 'none', backgroundColor: '#fffcf0', boxSizing: 'border-box'
                                }}
                            />
                            <button type="submit" className="btn-primary" style={{ marginTop: 0, background: '#0984e3', boxShadow: '0 6px 0 #0764ad' }} disabled={isLoading}>
                                {isLoading ? '변경 중...' : '변경하고 입장하기'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
