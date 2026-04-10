import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MISSIONS_V3 } from '../../../data/missionsV3';
import MissionShell from './MissionShell';
import StageRenderer from './StageRenderer';

/**
 * V3 MissionRunner - The main engine for rendering V3 missions.
 */
const MissionRunner = () => {
  const { missionId, gradeBand } = useParams();
  const navigate = useNavigate();
  
  // 1. Load mission data
  const mission = MISSIONS_V3[missionId];
  const gradeSpec = mission?.grades[gradeBand];
  
  // 2. State management
  const [stage, setStage] = useState('start'); // start, intro, core, task, submit, complete
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [uiState, setUiState] = useState({
    loading: false,
    error: null,
    validationError: null
  });

  // 3. Navigation handlers
  const handleStart = () => setStage('intro');
  
  const handleNext = () => {
    if (stage === 'intro') {
      setStage('core');
    } else if (stage === 'core') {
      setStage('task');
      setStepIndex(0);
    } else if (stage === 'task') {
      const totalSteps = gradeSpec.steps.length;
      if (stepIndex < totalSteps - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        setStage('submit');
      }
    } else if (stage === 'submit') {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (stage === 'intro') {
      setStage('start');
    } else if (stage === 'core') {
      setStage('intro');
    } else if (stage === 'task') {
      if (stepIndex > 0) {
        setStepIndex(stepIndex - 1);
      } else {
        setStage('core');
      }
    } else if (stage === 'submit') {
      setStage('task');
      setStepIndex(gradeSpec.steps.length - 1);
    }
  };

  const handleSubmit = async () => {
    setUiState(prev => ({ ...prev, loading: true }));
    try {
      // Logic for submitting to Supabase or other backend
      console.log('Submitting V3 data:', { 
        missionCode: gradeSpec.cardCode, 
        answers 
      });
      // Simulate API call
      setTimeout(() => {
        setStage('complete');
        setUiState(prev => ({ ...prev, loading: false }));
      }, 1000);
    } catch (err) {
      setUiState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  if (!mission || !gradeSpec) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">미션을 찾을 수 없습니다.</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <MissionShell
      meta={mission.meta}
      gradeSpec={gradeSpec}
      stage={stage}
      stepIndex={stepIndex}
      totalSteps={gradeSpec.steps.length}
      onPrev={handlePrev}
      onNext={handleNext}
      onStart={handleStart}
    >
      <StageRenderer
        stage={stage}
        mission={mission}
        gradeSpec={gradeSpec}
        stepIndex={stepIndex}
        answers={answers}
        setAnswers={setAnswers}
        uiState={uiState}
        onStart={handleStart}
      />
    </MissionShell>
  );
};

export default MissionRunner;
