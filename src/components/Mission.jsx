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

const Mission = ({ userId, userName, schoolId, setFragments, onReward }) => {
    const { missionId, gradeGroup } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // 사전 모달 상태
    const [vocabModal, setVocabModal] = useState({ isOpen: false, word: '', definition: '' });
    
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
        teacherFeedback
    } = useFormHandling();

    // 초기 데이터 로드 (수정 모드 감지)
    React.useEffect(() => {
        if (userId && missionId) {
            fetchExistingSubmission(userId, missionId, currentType, currentStackedInputs);
        }
    }, [userId, missionId, currentType, currentStackedInputs, fetchExistingSubmission]);
    
    // URL 파라미터에서 phase 확인
    const urlParams = new URLSearchParams(location.search);
    const initialPhase = urlParams.get('phase') || 'story';
    
    const [missionPhase, setMissionPhase] = useState(initialPhase);
    const [currentStep, setCurrentStep] = useState(0);

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
    const editCountRef = React.useRef(0);
    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyData, setSurveyData] = useState({ effort: 3, confidence: 3, trust: 3 });

    // 내부 제출 버튼 클릭 시 트리거 (수정이면 즉시 제출, 처음이면 설문 모달 띄우기)
    const handlePreSubmit = () => {
        if (!validateForm(currentType, currentStackedInputs)) return;
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

    const handleChatComplete = () => {
        setMissionPhase('complete');
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
                        onNextStep={() => setCurrentStep(prev => prev + 1)}
                        onPrevStep={() => setCurrentStep(prev => prev - 1)}
                        onComplete={handleStoryComplete}
                        onWordClick={openVocabModal}
                        missionId={missionId}
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
            onWordClick: openVocabModal,
            onSubmit: handlePreSubmit
        };

        if (isCurrentChatMode) {
            return (
                <ChatMode
                    {...modeProps}
                    userName={userName}
                    onComplete={handleChatComplete}
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
                    />
                );

            case 'stacked-inputs':
                return <StackedInputsMode {...modeProps} />;

            case 'checklist':
                return <ChecklistMode {...modeProps} />;

            case 'upload-text':
                return <DirectTextMode {...modeProps} />;

            default:
                return <DirectTextMode {...modeProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative">
            {renderMissionMode()}

            {/* 설문조사 모달 */}
            {showSurvey && (
                <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white border-4 border-blue-400 rounded-[30px] p-8 w-full max-w-lg relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                        {/* 상단 장식 */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
                        
                        <h2 className="text-2xl font-black text-gray-800 mb-2 text-center tracking-tight">수고했어요! 🥳</h2>
                        <p className="text-center text-blue-600 font-bold mb-8 italic">마지막 질문에 답하고 미션을 완료해볼까요?</p>

                        <div className="space-y-8">
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span style={{ fontSize: '1.2rem' }}>🔥</span> 이 미션을 위해 얼마나 노력했나요?
                                </p>
                                <div className="flex justify-between px-2">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button key={v} onClick={() => setSurveyData({ ...surveyData, effort: v })} 
                                            className={`w-12 h-12 rounded-full font-black text-lg transition-all transform hover:scale-110 active:scale-95 ${surveyData.effort === v ? 'bg-blue-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.5)] scale-110 border-2 border-white' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-blue-200 hover:text-blue-400'}`}>
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                                <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span style={{ fontSize: '1.2rem' }}>💡</span> 내용을 스스로 잘 이해했나요?
                                </p>
                                <div className="flex justify-between px-2">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button key={v} onClick={() => setSurveyData({ ...surveyData, confidence: v })} 
                                            className={`w-12 h-12 rounded-full font-black text-lg transition-all transform hover:scale-110 active:scale-95 ${surveyData.confidence === v ? 'bg-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.5)] scale-110 border-2 border-white' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-green-200 hover:text-green-400'}`}>
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                                <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span style={{ fontSize: '1.2rem' }}>🚀</span> 실생활에 도움이 될 것 같나요?
                                </p>
                                <div className="flex justify-between px-2">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button key={v} onClick={() => setSurveyData({ ...surveyData, trust: v })} 
                                            className={`w-12 h-12 rounded-full font-black text-lg transition-all transform hover:scale-110 active:scale-95 ${surveyData.trust === v ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.5)] scale-110 border-2 border-white' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-orange-200 hover:text-orange-400'}`}>
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
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