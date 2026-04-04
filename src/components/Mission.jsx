import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { useGradeLogic } from '../hooks/useGradeLogic';
import { useFormHandling } from '../hooks/useFormHandling';

// 미션 단계별 컴포넌트
import MissionStorySteps from './mission/MissionStorySteps';
import MissionHeader from './mission/MissionHeader';

// 모드별 컴포넌트
import DirectTextMode from './modes/DirectTextMode';
import ChatMode from './modes/ChatMode';
import StackedInputsMode from './modes/StackedInputsMode';
import ChecklistMode from './modes/ChecklistMode';

const Mission = ({ userName }) => {
    const { missionId, gradeGroup } = useParams();
    const navigate = useNavigate();
    
    const mission = MISSIONS[missionId];
    const { currentType, currentWhy, currentExample } = useGradeLogic(mission, gradeGroup);
    const { stackedAnswers, handleStackedChange, handleSubmit, validateForm } = useFormHandling();
    
    const [missionPhase, setMissionPhase] = useState('story');
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
        navigate('/dashboard');
    };

    const handleStoryComplete = () => {
        setMissionPhase('education');
    };

    const handleEducationComplete = () => {
        setMissionPhase('task');
    };

    const handleMissionSubmit = async () => {
        if (!validateForm()) return;
        
        try {
            const submissionData = {
                missionId,
                gradeGroup,
                userName,
                answers: stackedAnswers,
                completedAt: new Date().toISOString()
            };
            
            await handleSubmit(submissionData);
            setMissionPhase('complete');
        } catch (error) {
            console.error('미션 제출 실패:', error);
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
                <div className="p-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        뒤로가기
                    </button>
                </div>
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">{mission.title}</h2>
                    <MissionStorySteps
                        steps={mission.storySteps?.[gradeGroup] || []}
                        currentStep={currentStep}
                        onNextStep={() => setCurrentStep(prev => prev + 1)}
                        onPrevStep={() => setCurrentStep(prev => prev - 1)}
                        onComplete={handleStoryComplete}
                        missionId={missionId}
                    />
                </div>
            </div>
        );
    }

    // 교육 단계
    if (missionPhase === 'education') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-4xl mx-auto p-6">
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
            onStackedChange: handleStackedChange,
            onSubmit: handleMissionSubmit
        };

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
                return <StackedInputsMode {...modeProps} />;
            
            default:
                return <DirectTextMode {...modeProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="p-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    뒤로가기
                </button>
            </div>
            {renderMissionMode()}
        </div>
    );
};

export default Mission;