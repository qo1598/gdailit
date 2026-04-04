import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import { useFormHandling } from '../../hooks/useFormHandling';
import MissionStorySteps from './MissionStorySteps';
import MissionHeader from './MissionHeader';
import StackedInputs from './StackedInputs';

const E1Mission = ({ mission, missionId, gradeGroup, userName }) => {
    const { currentType, currentStackedInputs, currentWhy, currentExample } = useGradeLogic(mission, gradeGroup);
    const { stackedAnswers, handleStackedChange, handleSubmit, validateForm } = useFormHandling();
    
    const [missionPhase, setMissionPhase] = React.useState('story');
    const [currentStep, setCurrentStep] = React.useState(0);

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
            console.error('E-1 미션 제출 실패:', error);
        }
    };

    if (missionPhase === 'story') {
        return (
            <MissionStorySteps
                mission={mission}
                gradeGroup={gradeGroup}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onComplete={handleStoryComplete}
            />
        );
    }

    if (missionPhase === 'education') {
        return (
            <MissionHeader
                mission={mission}
                missionId={missionId}
                gradeGroup={gradeGroup}
                currentWhy={currentWhy}
                currentExample={currentExample}
                onComplete={handleEducationComplete}
            />
        );
    }

    if (missionPhase === 'task') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {mission.title}
                    </h2>
                    
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                            📸 우리 주변에 숨어있는 AI 친구들을 찾아 사진을 찍고, 
                            어떤 도움을 주는지 알려주세요!
                        </p>
                    </div>

                    <StackedInputs
                        missionId={missionId}
                        gradeGroup={gradeGroup}
                        stackedInputs={currentStackedInputs}
                        stackedAnswers={stackedAnswers}
                        onStackedChange={handleStackedChange}
                    />

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleMissionSubmit}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            미션 완료하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (missionPhase === 'complete') {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <div className="bg-green-50 rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                        🎉 미션 완료!
                    </h2>
                    <p className="text-green-700 text-lg">
                        우리 주변의 AI 친구들을 성공적으로 찾아냈어요!
                    </p>
                </div>
            </div>
        );
    }

    return null;
};

export default E1Mission;