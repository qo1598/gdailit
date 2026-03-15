import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';

const MISSIONS = {
    'E-1': {
        title: '우리 주변의 AI 찾기',
        competency: 'AI 인식 및 발견',
        why: 'AI는 이제 우리 일상생활 곳곳에 숨어있어요. AI가 어디에 있는지 알아야 AI를 잘 활용할 수 있습니다.',
        example: '유튜브 추천 영상, 스마트폰 음성 인식(시리, 빅스비), 자동차 자율주행, 스노우 앱 얼굴 필터 등',
        description: '생활 속에서 찾은 AI 기기나 서비스 사진을 올리고 하는 일과 한계를 적어주세요.',
        type: 'upload-text'
    },
    'E-2': {
        title: 'AI 답, 그대로 믿어도 될까?',
        competency: 'AI 인식 및 발견',
        why: 'AI는 똑똑하지만 가끔 실수하거나 틀린 정보를 줄 때가 있어요. 스스로 생각하는 힘이 중요합니다.',
        example: 'AI가 만든 영상이나 사진이 진짜가 아닐 때, AI가 지어낸 거짓말(환각) 등',
        description: 'AI의 대답이 진짜인지 어떻게 확인할 수 있을까요? 나만의 확인 방법을 적어주세요.',
        type: 'upload-text'
    },
    'E-3': {
        title: '추천은 왜 나에게 왔을까?',
        competency: 'AI 인식 및 발견',
        why: '유튜브나 쇼핑몰은 내가 예전에 보았던 것들을 기억하고 좋아하는 것을 계속 추천해 줘요.',
        example: '내가 귀여운 강아지 영상을 많이 보면 다른 강아지 영상이 계속 뜨는 것',
        description: '인터넷에서 나에게 추천해 준 것을 떠올려 보고, 왜 나에게 그것을 추천했는지 이유를 추측해 보세요.',
        type: 'upload-text'
    },
    'E-4': {
        title: 'AI는 누구에게 불공평할까?',
        competency: 'AI 인식 및 발견',
        why: 'AI가 배우는 자료가 한쪽으로 치우쳐 있으면 특정 사람에게 불편함이나 상처를 줄 수 있어요.',
        example: '손을 인식해 물이 나오는 기계가 특정 피부색만 인식하지 못했던 사건 등',
        description: 'AI가 불공평하게 행동할 수 있는 상황을 상상해 보고, 어떻게 하면 모두에게 공평해질지 제안해 보세요.',
        type: 'upload-text'
    },

    'C-1': {
        title: 'AI와 이야기 이어쓰기',
        competency: 'AI와 창의적 활용',
        why: 'AI의 도움을 받으면 생각지도 못한 재미있고 창의적인 이야기를 만들어낼 수 있어요.',
        example: '내가 동화책 주인공이라면? AI가 던져주는 상황에 맞춰 이야기 이어가기',
        description: '만약 우리 집 로봇 청소기가 말을 할 수 있다면 무슨 말을 할까요? AI와 함께 재미있는 대화를 상상해 적어주세요.',
        type: 'upload-text'
    },
    'C-2': {
        title: 'AI 그림 보고 새 장면 만들기',
        competency: 'AI와 창의적 활용',
        why: '글을 쓰면 그림으로 그려주는 AI 화가들이 있어요. 상상력을 마음껏 펼쳐보아요.',
        example: '미드저니, 캔바, 빙 이미지 크리에이터 등',
        description: 'AI가 그린 신기한 그림 사진을 하나 올리고, 그 그림의 제목과 숨겨진 이야기를 지어주세요.',
        type: 'upload-text'
    },
    'C-3': {
        title: 'AI와 홍보물 만들기',
        competency: 'AI와 창의적 활용',
        why: '학교 행사나 알리고 싶은 소식이 있을 때, AI와 함께라면 멋진 포스터나 글을 쉽게 만들 수 있어요.',
        example: '우리 반 합창 대회 포스터 문구를 AI에게 추천받기',
        description: '우리 학교나 반의 멋진 점을 알리는 홍보 문구를 하나 만들어 적어주세요.',
        type: 'upload-text'
    },
    'C-4': {
        title: '누가 만들었을까?',
        competency: 'AI와 창의적 활용',
        why: 'AI가 만든 작품인지 사람이 직접 만든 작품인지 표시하는 것은 정직한 디지털 세상의 첫 걸음이에요.',
        example: '"이 그림은 AI의 도움을 받아 내가 수정했습니다"라고 밝히기',
        description: '작은 이미지를 올리고, 이 이미지를 만들 때 내가 주의해야 할 저작권 원칙을 적어주세요.',
        type: 'upload-text'
    },

    'M-1': {
        title: '이럴 때 AI를 써도 될까?',
        competency: 'AI 사용 판단 및 윤리',
        why: 'AI는 아주 똑똑하지만 모든 것을 정답으로 알려주지는 않아요. 언제 AI의 도움을 받고, 언제 스스로 생각해야 할지 기준이 필요합니다.',
        example: '수학 숙제를 할 때 풀이 과정을 도와달라고 하기, 친구에게 보낼 사과 편지는 내가 쓴다 등',
        description: '어떤 상황에서 AI를 사용해도 좋을지 자신의 기준 3가지를 만들어보세요.',
        type: 'rules'
    },
    'M-2': {
        title: '사람이 할 일, AI가 도와줄 일',
        competency: 'AI 사용 판단 및 윤리',
        why: 'AI에게 전부 맡기기보다는, 내가 잘하는 것과 AI가 잘하는 것을 나누어 힘을 합치는 것이 훨씬 좋아요.',
        example: '발표 숙제: 자료 조사는 AI가 돕고, 발표하는 열정과 말투는 내가 연습한다.',
        description: '내가 요즘 하고 있는 일 중에서 AI가 도와주면 좋을 것 같은 일을 적어주세요.',
        type: 'upload-text'
    },
    'M-3': {
        title: 'AI에게 정확히 부탁하기',
        competency: 'AI 사용 판단 및 윤리',
        why: '명령어(프롬프트)를 얼마나 구체적이고 정확하게 말하느냐에 따라 AI가 주는 답변의 질이 달라집니다.',
        example: '"강아지 그림 그려줘" 보다는 "안경을 쓰고 책을 읽는 귀여운 갈색 강아지를 수채화 느낌으로 그려줘"',
        description: 'AI에게 명령을 내릴 때 더 좋은 결과를 얻기 위해 내가 지켜야 할 규칙 3가지를 적어보세요.',
        type: 'rules'
    },
    'M-4': {
        title: '우리 반 AI 사용 약속 만들기',
        competency: 'AI 사용 판단 및 윤리',
        why: '친구들과 함께 안전하고 즐겁게 AI를 사용하려면 모두가 동의하는 투명하고 정직한 약속이 필요해요.',
        example: '우리는 AI가 만든 숙제를 내가 직접 한 것처럼 속이지 않는다.',
        description: '우리 반 친구들이 함께 지켜야 할 AI 사용 약속 3가지를 만들어주세요.',
        type: 'rules'
    },

    'D-1': {
        title: '같은 것끼리 묶어보자',
        competency: 'AI 원리 체험',
        why: 'AI는 방대한 자료들을 특징에 맞춰 분류하고 묶는 과정을 통해 세상을 이해하고 똑똑해집니다.',
        example: '색깔별, 모양별, 동물과 식물 등',
        description: '주변의 물건 3가지를 찍어서 올리고, 어떤 기준으로 이 물건들을 한 그룹으로 묶었는지 설명해주세요.',
        type: 'upload-text'
    },
    'D-2': {
        title: 'AI가 배우는 자료 모으기',
        competency: 'AI 원리 체험',
        why: 'AI는 똑똑해지려면 아주 많은 데이터(자료)를 먹고 자라야 해요. 영양가 있고 좋은 자료를 주어야 건강한 AI가 됩니다.',
        example: '강아지를 인식하는 AI에게 스피츠, 비글, 푸들 등 다양한 사진을 보여주기',
        description: '만약 우리 학교 급식을 평가하는 AI를 만든다면, 어떤 자료(데이터)들을 가장 먼저 모아야 할까요?',
        type: 'upload-text'
    },
    'D-3': {
        title: '잘못 분류되는 경우 찾기',
        competency: 'AI 원리 체험',
        why: 'AI도 때로는 헷갈려서 실수를 해요. 사람이 AI의 실수를 찾아내고 고쳐주어야 기계가 발전할 수 있습니다.',
        example: '머핀과 얼굴이 닮은 치와와 강아지 사진을 헷갈리는 AI',
        description: 'AI가 헷갈려 할 만한 재미있는 사진이나 상황을 생각해 보고 적어주세요.',
        type: 'upload-text'
    },
    'D-4': {
        title: '우리 학교 문제를 돕는 AI 상상하기',
        competency: 'AI 원리 체험',
        why: '우리가 배우는 AI는 결국 우리 사회와 주변 사람들의 불편함을 해결하고 돕기 위해 존재합니다.',
        example: '분실물을 찾아주는 학교 AI, 급식 남긴 양을 분석해주는 로봇 등',
        description: '우리 학교나 생활 속에서 불편한 점을 찾아보고, 이것을 해결해 줄 나만의 AI 아이디어를 자유롭게 상상해 적어주세요.',
        type: 'upload-text'
    }
};

export default function Mission({ userId, setFragments, onReward }) {
    const { missionId } = useParams();
    const navigate = useNavigate();
    const mission = MISSIONS[missionId];

    const [formData, setFormData] = useState('');
    const [rule1, setRule1] = useState('');
    const [rule2, setRule2] = useState('');
    const [rule3, setRule3] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    React.useEffect(() => {
        const fetchExistingSubmission = async () => {
            if (!userId || !missionId) return;

            try {
                const { data, error } = await supabase
                    .from('mission_submissions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('mission_id', missionId)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (data && data.length > 0) {
                    setIsEditing(true);
                    const submissionData = data[0].data;
                    if (mission.type === 'rules') {
                        setRule1(submissionData.rule1 || '');
                        setRule2(submissionData.rule2 || '');
                        setRule3(submissionData.rule3 || '');
                    } else {
                        setFormData(submissionData.text || '');
                    }
                }
            } catch (error) {
                console.error('Error fetching existing submission:', error);
            } finally {
                setIsLoadingInitial(false);
            }
        };

        fetchExistingSubmission();
    }, [userId, missionId, mission]);

    if (!mission) {
        return <div>미션을 찾을 수 없습니다.</div>;
    }

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Save submission data (rules or text)
            const submissionData = mission.type === 'rules'
                ? { rule1, rule2, rule3 }
                : { text: formData };

            if (isEditing) {
                const { error: err1 } = await supabase
                    .from('mission_submissions')
                    .update({ data: submissionData })
                    .eq('user_id', userId)
                    .eq('mission_id', missionId);
                if (err1) throw err1;

                const { error: err2 } = await supabase
                    .from('user_progress')
                    .update({ completed: false })
                    .eq('user_id', userId)
                    .eq('mission_id', missionId);
                if (err2) throw err2;
            } else {
                const { error: err3 } = await supabase
                    .from('mission_submissions')
                    .insert([
                        { user_id: userId, mission_id: missionId, data: submissionData }
                    ]);
                if (err3) throw err3;

                // Safely upsert user progress in case they viewed it but didn't submit
                const { error: err4 } = await supabase
                    .from('user_progress')
                    .upsert(
                        { user_id: userId, mission_id: missionId, completed: false },
                        { onConflict: 'user_id, mission_id' }
                    );
                if (err4) throw err4;
            }

            // Trigger success animation
            setShowSuccess(true);

            // Award fragments if it's a new completion
            if (!isEditing) {
                if (onReward) onReward(5, "미션 완료! 뱃지를 얻기 위해 선생님의 검토를 기다려주세요. 😊");
                updateFragments(5);
            }

            // Trigger realistic confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            setTimeout(() => {
                navigate('/');
            }, 3500); // Redirect after 3.5 seconds
        } catch (error) {
            console.error('Error submitting mission:', error);
            alert(`미션 제출 중 오류가 발생했습니다: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFragments = async (amount) => {
        if (!userId) return;
        try {
            const { data: student } = await supabase
                .from('students')
                .select('fragments')
                .eq('id', userId)
                .single();

            const newTotal = (student?.fragments || 0) + amount;

            const { error } = await supabase
                .from('students')
                .update({ fragments: newTotal })
                .eq('id', userId);

            if (!error) setFragments(newTotal);
        } catch (err) {
            console.error('Error updating fragments:', err);
        }
    };

    return (
        <div className="page-enter" style={{ paddingBottom: '120px' }}>
            <div style={{ padding: '20px', position: 'sticky', top: 0, zIndex: 30, display: 'flex' }}>
                <button className="back-btn" onClick={() => navigate('/')} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="mission-wrapper">
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <span className="badge-id" style={{ position: 'static', display: 'inline-block', marginBottom: '10px' }}>{missionId}</span>
                    <h1 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2.2rem', color: 'var(--text-dark)', marginBottom: '8px' }}>{mission.title}</h1>
                    <div style={{
                        color: 'var(--primary-blue)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        letterSpacing: '-0.02em',
                        opacity: 0.9
                    }}>
                        {mission.competency.split(' (')[0]}
                    </div>
                </div>

                {/* Educational Content */}
                <div className="edu-card why">
                    <h3 style={{ color: '#0984e3' }}><Target size={24} /> 왜 중요할까요?</h3>
                    <p>{mission.why}</p>
                </div>

                <div className="edu-card example">
                    <h3 style={{ color: '#00b894' }}><Lightbulb size={24} /> 예를 들어볼까요?</h3>
                    <p>{mission.example}</p>
                </div>

                {/* Action Form */}
                <div className="mission-task">
                    <h3 className="mission-task-header">도전 과제</h3>
                    <p style={{ marginBottom: '20px', textAlign: 'center', color: '#555', fontWeight: 'bold', fontSize: '1.1rem' }}>{mission.description}</p>

                    <form onSubmit={handleSubmit}>
                        {mission.type === 'upload-text' && (
                            <>
                                <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>1. AI 사진 업로드</div>
                                <input type="file" accept="image/*" style={{ width: '100%', padding: '15px', background: 'white', borderRadius: '12px', border: '2px solid #dfe6e9', marginBottom: '20px' }} />

                                <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>2. 이 AI가 하는 일과 한계 쓰기</div>
                                <textarea
                                    rows={4}
                                    value={formData}
                                    onChange={(e) => setFormData(e.target.value)}
                                    placeholder="예: 우리 집 인공지능 스피커는 노래를 틀어주지만 내가 작게 말하면 못 알아듣는다."
                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                    required
                                />
                            </>
                        )}

                        {mission.type === 'rules' && (
                            <div className="form-group-list">
                                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>나만의 AI 사용 기준 3가지를 적어주세요.</div>

                                <div className="kid-input-wrapper">
                                    <span className="kid-input-number">1.</span>
                                    <input
                                        type="text"
                                        className="kid-input"
                                        value={rule1}
                                        onChange={e => setRule1(e.target.value)}
                                        placeholder="숙제할 때는 힌트만 받는다."
                                        required
                                    />
                                </div>

                                <div className="kid-input-wrapper">
                                    <span className="kid-input-number">2.</span>
                                    <input
                                        type="text"
                                        className="kid-input"
                                        value={rule2}
                                        onChange={e => setRule2(e.target.value)}
                                        placeholder="편지는 내가 직접 고민해서 쓴다."
                                        required
                                    />
                                </div>

                                <div className="kid-input-wrapper">
                                    <span className="kid-input-number">3.</span>
                                    <input
                                        type="text"
                                        className="kid-input"
                                        value={rule3}
                                        onChange={e => setRule3(e.target.value)}
                                        placeholder="내가 만든 기준을 하나 더 적어보세요."
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={isSubmitting || isLoadingInitial}>
                            {isSubmitting ? '저장 중...' : (isEditing ? '미션 내용 수정하기!' : '미션 제출하기!')}
                        </button>
                    </form>
                </div>
            </div>

            {showSuccess && (
                <div className="success-overlay">
                    <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '3rem', color: '#ff4757', marginBottom: '20px', zIndex: 101, textShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }}>🎉 미션 완료! 🎉</h2>
                    <p className="success-message">
                        선생님이 확인하면 뱃지가 활성화됩니다.
                    </p>
                </div>
            )}
        </div>
    );
}
