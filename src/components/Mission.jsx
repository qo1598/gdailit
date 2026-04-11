import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { useGradeLogic } from '../hooks/useGradeLogic';
import { useFormHandling } from '../hooks/useFormHandling';
import confetti from 'canvas-confetti';

// 미션 단계별 컴포넌트
import MissionStorySteps from './mission/MissionStorySteps';
import MissionHeader from './mission/MissionHeader';
import DictionaryModal from './DictionaryModal';

// 모드별 컴포넌트
import DirectTextMode from './modes/DirectTextMode';
import ChatMode from './modes/ChatMode';
import StackedInputsMode from './modes/StackedInputsMode';
import ChecklistMode from './modes/ChecklistMode';
import PerformanceModes from './modes/PerformanceModes'; // 추가
import { useModeration } from '../hooks/useModeration';
import ModerationModal from './common/ModerationModal';

const Mission = ({ userId, userName, schoolId, setFragments, onReward }) => {
    const { missionId, gradeGroup } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // 사전 모달 상태
    const [vocabModal, setVocabModal] = useState({ isOpen: false, word: '', definition: '' });
    const { modWarning, validateContent, closeWarning } = useModeration();
    
    const openVocabModal = React.useCallback((word, definition) => {
        setVocabModal({ isOpen: true, word, definition });
    }, []);
    const closeVocabModal = React.useCallback(() => {
        setVocabModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const mission = MISSIONS[missionId];
    const {
        currentType,
        currentWhy,
        currentExample,
        currentStackedInputs,
        isCurrentChatMode
    } = useGradeLogic(mission, gradeGroup);

    const { 
        stackedAnswers, 
        handleStackedChange, 
        handleSubmit, 
        validateForm,
        fetchExistingSubmission,
        isEditing,
        teacherFeedback,
        handleFileChange,
        handleTextChange
    } = useFormHandling();

    // 초기 데이터 로드 (수정 모드 감지)
    React.useEffect(() => {
        const loadData = async () => {
            if (userId && missionId) {
                const subData = await fetchExistingSubmission(userId, missionId, currentType, currentStackedInputs);
                if (subData && subData.chat_history) {
                    setChatMessages(subData.chat_history);
                }
            }
        };
        loadData();
    }, [userId, missionId, currentType, currentStackedInputs, fetchExistingSubmission]);
    
    // URL 파라미터에서 phase 확인
    const urlParams = new URLSearchParams(location.search);
    const initialPhase = urlParams.get('phase') || 'story';
    
    const [missionPhase, setMissionPhase] = useState(initialPhase);
    const [currentStep, setCurrentStep] = useState(0);
    const [chatMessages, setChatMessages] = useState([]); // 채팅 대화 내역 저장용
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // 생성된 이미지 URL 저장용
    const [showIntroModal, setShowIntroModal] = useState(false);
    const hasShownIntroModalRef = React.useRef(false);

    if (!mission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600">미션을 찾을 수 없습니다</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        대시보드로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const handleBack = () => {
        navigate('/');
    };

    const handleStoryComplete = () => {
        setMissionPhase('education');
    };

    const handleEducationComplete = () => {
        setMissionPhase('task');
    };

    const startTimeRef = React.useRef(Date.now());
    const telemetryRef = React.useRef({
        dwellTimePerField: {}, // { fieldId: totalMs }
        interactionCount: 0,
        choiceHistory: [], // { timestamp, fieldId, value }
        lastFieldFocus: null,
        lastFocusTime: Date.now()
    });

    const trackFieldFocus = (fieldId) => {
        const now = Date.now();
        if (telemetryRef.current.lastFieldFocus) {
            const duration = now - telemetryRef.current.lastFocusTime;
            const prevField = telemetryRef.current.lastFieldFocus;
            telemetryRef.current.dwellTimePerField[prevField] = (telemetryRef.current.dwellTimePerField[prevField] || 0) + duration;
        }
        telemetryRef.current.lastFieldFocus = fieldId;
        telemetryRef.current.lastFocusTime = now;
        telemetryRef.current.interactionCount += 1;
    };

    const trackFieldChange = (fieldId, value) => {
        telemetryRef.current.choiceHistory.push({
            timestamp: Date.now(),
            fieldId,
            value: typeof value === 'object' ? 'complex_object' : value
        });
        telemetryRef.current.interactionCount += 1;
    };

    const editCountRef = React.useRef(0);
    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyData, setSurveyData] = useState({ effort: 3, confidence: 3, trust: 3 });

    // 내부 제출 버튼 클릭 시 트리거 (수정이면 즉시 제출, 처음이면 설문 모달 띄우기)
    const handlePreSubmit = () => {
        if (!validateForm(currentType, currentStackedInputs)) return;

        // 비속어/도배 필터링 전수 검사
        // 1. 단순 텍스트 검사 (formData)
        if (formData && !validateContent(formData)) return;

        // 2. 스택 입력 데이터 검사 (stackedAnswers)
        if (stackedAnswers) {
            const hasProfanity = Object.values(stackedAnswers).some(val => {
                if (typeof val === 'string' && val.trim()) {
                    return !validateContent(val, { skipSpam: true, skipRepetition: true });
                }
                if (typeof val === 'object' && val !== null) {
                    // multi-text 필드 등 검사
                    return Object.values(val).some(innerVal => 
                        typeof innerVal === 'string' && innerVal.trim() && !validateContent(innerVal, { skipSpam: true, skipRepetition: true })
                    );
                }
                return false;
            });
            if (hasProfanity) return;
        }

        if (isEditing) {
            handleFinalSubmit();
        } else {
            setShowSurvey(true);
        }
    };

    // 실제 제출 함수 (포스터, 설문결과 포함)
    const handleFinalSubmit = async () => {
        try {
            await handleSubmit({
                userId, schoolId, missionId, gradeGroup, mission,
                currentType, currentStackedInputs,
                startTime: startTimeRef.current,
                editCountRef,
                telemetry: {
                    ...telemetryRef.current,
                    totalTime: Date.now() - startTimeRef.current
                },
                isMockMode: true, // 로컬 검증을 위해 기본 활성화
                messages: chatMessages, 
                generatedImageUrl: generatedImageUrl, 
                surveyData: isEditing ? null : surveyData,
                onSuccess: () => {
                    setShowSurvey(false);
                    setMissionPhase('complete');
                    if (!isEditing) {
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#fdcb6e', '#0984e3', '#00b894', '#d63031', '#e84393']
                        });
                    }
                },
                onReward
            });
        } catch (error) {
            console.error('미션 제출 실패:', error);
            alert('제출 중 문제가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleChatComplete = (messages) => {
        setChatMessages(messages);
        // 채팅은 turnLimit이 차야 버튼이 활성화되므로 바로 제출 단계(설문)로 진입
        if (isEditing) {
            // 수정 모드면 설문 없이 즉시 제출
            handleFinalSubmit(); 
        } else {
            setShowSurvey(true);
        }
    };

    // 미션 완료 화면
    if (missionPhase === 'complete') {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <div className="bg-green-50 rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                        🎉 미션 완료!
                    </h2>
                    <p className="text-green-700 text-lg mb-6">
                        {mission.title} 미션을 성공적으로 완료했어요!
                    </p>
                    {teacherFeedback && (
                        <div className="bg-white p-4 rounded text-left mb-6 shadow alert-info">
                            <h4 className="font-bold text-blue-800">선생님의 피드백:</h4>
                            <p className="text-blue-700 whitespace-pre-wrap">{teacherFeedback}</p>
                        </div>
                    )}
                    <button
                        onClick={handleBack}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        대시보드로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // 스토리 단계
    if (missionPhase === 'story') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-4xl mx-auto p-4">
                    {/* 미션 제목 헤더 */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '12px',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            color: '#2d3436',
                            marginBottom: '4px'
                        }}>
                            {mission.title}
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: '#636e72'
                        }}>
                            {missionId} | {mission.competency}
                        </div>
                    </div>

                    <MissionStorySteps
                        steps={mission.storySteps?.[gradeGroup] || []}
                        currentStep={currentStep}
                        onNextStep={() => {
                            const nextStep = currentStep + 1;
                            if (nextStep === 1 && mission.introModalImage && !hasShownIntroModalRef.current) {
                                setShowIntroModal(true);
                                hasShownIntroModalRef.current = true;
                            }
                            setCurrentStep(nextStep);
                        }}
                        onPrevStep={() => setCurrentStep(prev => prev - 1)}
                        onComplete={handleStoryComplete}
                        onWordClick={openVocabModal}
                        missionId={missionId}
                    />

                    {/* 도입부 이미지 모달 (C-3 용 등) */}
                    {showIntroModal && mission.introModalImage && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.85)',
                            zIndex: 10000,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                        }}>
                            <div className="page-enter" style={{
                                width: '100%',
                                maxWidth: '600px',
                                background: 'white',
                                borderRadius: '30px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    background: '#f8f9fa',
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3436' }}>
                                        🎨 이번 미션의 핵심 참고 자료예요!
                                    </h3>
                                </div>
                                <div style={{ 
                                    padding: '25px', 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    maxHeight: '70vh',
                                    overflowY: 'auto'
                                }}>
                                    <img 
                                        src={mission.introModalImage} 
                                        alt="도입부 이미지" 
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            borderRadius: '15px',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                        }} 
                                    />
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <button 
                                        onClick={() => setShowIntroModal(false)}
                                        style={{
                                            width: '100%',
                                            padding: '18px',
                                            background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 0 #0763ab'
                                        }}
                                    >
                                        닫고 스토리 시작하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <DictionaryModal 
                    isOpen={vocabModal.isOpen}
                    word={vocabModal.word}
                    definition={vocabModal.definition}
                    onClose={closeVocabModal}
                />
            </div>
        );
    }

    // 교육 단계
    if (missionPhase === 'education') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-4xl mx-auto p-4">
                    <MissionHeader
                        mission={mission}
                        missionId={missionId}
                        gradeGroup={gradeGroup}
                        currentWhy={currentWhy}
                        currentExample={currentExample}
                        onBack={handleBack}
                        onComplete={handleEducationComplete}
                    />
                </div>
                <DictionaryModal 
                    isOpen={vocabModal.isOpen}
                    word={vocabModal.word}
                    definition={vocabModal.definition}
                    onClose={closeVocabModal}
                />
            </div>
        );
    }

    // 미션 수행 단계 - 타입별 라우팅
    const renderMissionMode = () => {
        const modeProps = {
            mission,
            missionId,
            gradeGroup,
            stackedAnswers,
            isEditing,
            onStackedChange: handleStackedChange,
            onFileChange: handleFileChange,
            onTextChange: handleTextChange,
            onImageGenerated: setGeneratedImageUrl,
            onWordClick: openVocabModal,
            onSubmit: handlePreSubmit,
            onFocus: trackFieldFocus, // 추가
            onChange: (id, val) => {   // 추가
                handleStackedChange(id, val);
                trackFieldChange(id, val);
            }
        };

        if (isCurrentChatMode) {
            return (
                <ChatMode
                    {...modeProps}
                    userName={userName}
                    onComplete={handleChatComplete}
                    chatMessages={chatMessages}
                />
            );
        }

        switch (currentType) {
            case 'direct-text':
                return <DirectTextMode {...modeProps} />;

            case 'chat':
                return (
                    <ChatMode
                        {...modeProps}
                        userName={userName}
                        onComplete={handleChatComplete}
                        chatMessages={chatMessages}
                    />
                );

            case 'stacked-inputs':
                return <StackedInputsMode {...modeProps} />;

            case 'checklist':
                return <ChecklistMode {...modeProps} />;

            case 'performance-sorting': 
            case 'performance-matching': 
            case 'performance-highlight': 
                return <PerformanceModes {...modeProps} />;

            case 'upload-text':
                return <DirectTextMode {...modeProps} />;

            default:
                return <DirectTextMode {...modeProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative">
            {renderMissionMode()}
            
            <ModerationModal 
                show={modWarning.show} 
                message={modWarning.message} 
                onClose={closeWarning} 
            />

            {/* 설문조사 모달 */}
            {showSurvey && (
                <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white border-4 border-blue-400 rounded-[30px] p-8 w-full max-w-lg relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                        {/* 상단 장식 */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
                        
                        <h2 className="text-2xl font-black text-gray-800 mb-2 text-center tracking-tight">수고했어요! 🥳</h2>
                        <p className="text-center text-blue-600 font-bold mb-8 italic">마지막 질문에 답하고 미션을 완료해볼까요?</p>

                        <div className="space-y-8">
                            {/* KSA 동적 질문 매핑 */}
                            {mission.ksa_tags?.K && (
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                    <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span style={{ fontSize: '1.2rem' }}>📚</span> {mission.ksa_tags.K}: AI 지식을 더 잘 알게 되었나요?
                                    </p>
                                    <div className="flex justify-between px-2">
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <button key={v} onClick={() => setSurveyData({ ...surveyData, effort: v })} 
                                                className={`w-12 h-12 rounded-full font-black text-lg transition-all transform hover:scale-110 active:scale-95 ${surveyData.effort === v ? 'bg-blue-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.5)] scale-110 border-2 border-white' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mission.ksa_tags?.S && (
                                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                                    <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span style={{ fontSize: '1.2rem' }}>🛠️</span> {mission.ksa_tags.S}: AI 기능을 잘 활용했나요?
                                    </p>
                                    <div className="flex justify-between px-2">
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <button key={v} onClick={() => setSurveyData({ ...surveyData, confidence: v })} 
                                                className={`w-12 h-12 rounded-full font-black text-lg transition-all transform hover:scale-110 active:scale-95 ${surveyData.confidence === v ? 'bg-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.5)] scale-110 border-2 border-white' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mission.ksa_tags?.A && (
                                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                                    <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span style={{ fontSize: '1.2rem' }}>🌱</span> {mission.ksa_tags.A}: AI를 책임감 있게 사용했나요?
                                    </p>
                                    <div className="flex justify-between px-2">
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <button key={v} onClick={() => setSurveyData({ ...surveyData, trust: v })} 
                                                className={`w-12 h-12 rounded-full font-black text-lg transition-all transform hover:scale-110 active:scale-95 ${surveyData.trust === v ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.5)] scale-110 border-2 border-white' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={handleFinalSubmit} 
                            className="mt-10 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[20px] text-white font-black text-xl hover:from-blue-700 hover:to-indigo-700 active:transform active:scale-95 transition-all shadow-[0_8px_25px_rgba(37,99,235,0.3)]">
                            미션 완료하고 뱃지 받기! ✨
                        </button>
                    </div>
                </div>
            )}
            {/* 사전 모달 */}
            <DictionaryModal 
                isOpen={vocabModal.isOpen}
                word={vocabModal.word}
                definition={vocabModal.definition}
                onClose={closeVocabModal}
            />
        </div>
    );
};

export default Mission;