import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { useGradeLogic } from '../hooks/useGradeLogic';
import { useFormHandling } from '../hooks/useFormHandling';
import MissionStorySteps from './mission/MissionStorySteps';
import MissionHeader from './mission/MissionHeader';
import StackedInputs from './mission/StackedInputs';
import ChatInterface from './ChatInterface';

/**
 * 리팩토링된 Mission 컴포넌트 - M-3 미션 전용
 */
const MissionRefactored = ({ userName }) => {
    const { missionId, gradeGroup } = useParams();
    const navigate = useNavigate();
    
    // 미션 데이터 가져오기
    const mission = MISSIONS[missionId];
    
    // 학년별 로직 처리
    const {
        currentType,
        currentPrompts,
        currentStackedInputs,
        currentIsChatMode,
        isCurrentChatMode,
        currentChatInitiator,
        currentUserTurnLimit,
        currentWhy,
        currentExample
    } = useGradeLogic(mission, gradeGroup);

    // 미션 단계 관리
    const [missionPhase, setMissionPhase] = useState(1); // 1: Story, 2: Edu, 3: Task
    const [currentStep, setCurrentStep] = useState(0);
    const [vocabModal, setVocabModal] = useState({ show: false, word: '', desc: '' });

    // 폼 핸들링
    const {
        formData,
        stackedAnswers,
        isSubmitting,
        showSuccess,
        handleTextChange,
        handleStackedChange,
        handleSubmit: baseHandleSubmit,
        resetForm,
        validateForm
    } = useFormHandling();

    // 미션이 없으면 에러 표시
    if (!mission) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>미션을 찾을 수 없습니다</h2>
                <button onClick={() => navigate('/')} style={{ padding: '10px 20px', marginTop: '20px' }}>
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    // 스토리 단계 핸들링
    const handleNextStep = () => {
        if (currentStep < mission.storySteps[gradeGroup].length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStoryComplete = () => {
        setMissionPhase(2); // 교육 단계로 이동
    };

    // 교육 단계에서 미션 단계로 이동
    const handleEducationComplete = () => {
        setMissionPhase(3); // 미션 수행 단계로 이동
    };

    // 미션 제출 처리
    const handleMissionSubmit = async (additionalData = {}) => {
        try {
            const submissionData = {
                mission_id: missionId,
                grade_group: gradeGroup,
                user_name: userName,
                submission_type: currentType,
                ...additionalData
            };

            if (isCurrentChatMode) {
                submissionData.chat_log = additionalData.messages || [];
            } else {
                submissionData.stacked_data = stackedAnswers;
            }

            await baseHandleSubmit(submissionData);
        } catch (error) {
            console.error('미션 제출 실패:', error);
            alert('미션 제출에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 채팅 완료 처리
    const handleChatComplete = (messages) => {
        handleMissionSubmit({ messages });
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {/* 헤더 */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{mission.title}</h1>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                            {gradeGroup === 'lower' ? '1-2학년' : 
                             gradeGroup === 'middle' ? '3-4학년' : '5-6학년'}
                        </p>
                    </div>
                </div>

                {/* 콘텐츠 */}
                <div style={{ padding: '30px' }}>
                    {missionPhase === 1 && (
                        <MissionStorySteps
                            steps={mission.storySteps[gradeGroup]}
                            currentStep={currentStep}
                            onNextStep={handleNextStep}
                            onPrevStep={handlePrevStep}
                            onComplete={handleStoryComplete}
                            setVocabModal={setVocabModal}
                        />
                    )}

                    {missionPhase === 2 && (
                        <MissionHeader
                            mission={mission}
                            missionId={missionId}
                            gradeGroup={gradeGroup}
                            currentWhy={currentWhy}
                            currentExample={currentExample}
                            onBack={() => setMissionPhase(1)}
                            onComplete={handleEducationComplete}
                        />
                    )}

                    {missionPhase === 3 && (
                        <div>
                            <h2 style={{ 
                                textAlign: 'center', 
                                marginBottom: '30px',
                                color: '#2d3436'
                            }}>
                                🎯 미션 수행하기
                            </h2>

                            {/* 프롬프트 표시 */}
                            {currentPrompts.length > 0 && (
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '20px',
                                    borderRadius: '15px',
                                    marginBottom: '25px',
                                    border: '2px solid #e9ecef'
                                }}>
                                    <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>
                                        📝 미션 안내
                                    </h3>
                                    {currentPrompts.map((prompt, index) => (
                                        <p key={index} style={{ 
                                            margin: '10px 0', 
                                            lineHeight: '1.6',
                                            fontSize: '1.1rem'
                                        }}>
                                            {prompt}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {/* 미션 수행 영역 */}
                            {isCurrentChatMode ? (
                                <ChatInterface
                                    mission={mission}
                                    missionId={missionId}
                                    gradeGroup={gradeGroup}
                                    currentUserTurnLimit={currentUserTurnLimit}
                                    currentChatInitiator={currentChatInitiator}
                                    onChatComplete={handleChatComplete}
                                    setVocabModal={setVocabModal}
                                />
                            ) : (
                                <div>
                                    <StackedInputs
                                        stackedInputs={currentStackedInputs}
                                        stackedAnswers={stackedAnswers}
                                        onAnswerChange={handleStackedChange}
                                        missionId={missionId}
                                        gradeGroup={gradeGroup}
                                    />
                                    
                                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                        <button
                                            onClick={() => handleMissionSubmit()}
                                            disabled={isSubmitting || !validateForm(currentType, currentStackedInputs)}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '25px',
                                                padding: '15px 40px',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                                transition: 'all 0.3s',
                                                opacity: (isSubmitting || !validateForm(currentType, currentStackedInputs)) ? 0.6 : 1
                                            }}
                                        >
                                            {isSubmitting ? '제출 중...' : '🎯 미션 완료!'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 성공 메시지 */}
                    {showSuccess && (
                        <div style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'white',
                            padding: '30px',
                            borderRadius: '20px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                            zIndex: 1000
                        }}>
                            <h2 style={{ color: '#27ae60', marginBottom: '15px' }}>
                                🎉 미션 완료!
                            </h2>
                            <p style={{ marginBottom: '20px', color: '#2d3436' }}>
                                훌륭하게 미션을 완수했습니다!
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '10px 20px',
                                    cursor: 'pointer'
                                }}
                            >
                                홈으로 돌아가기
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 어휘 모달 */}
            {vocabModal.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#2d3436' }}>
                            📖 {vocabModal.word}
                        </h3>
                        <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                            {vocabModal.desc}
                        </p>
                        <button
                            onClick={() => setVocabModal({ show: false, word: '', desc: '' })}
                            style={{
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                cursor: 'pointer'
                            }}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionRefactored;