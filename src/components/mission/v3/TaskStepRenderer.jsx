import React from 'react';
import TDRenderer from './TDRenderer';

/**
 * TaskStepRenderer - Dispatches the task to the appropriate performance type renderer.
 * Types: TD (Exploration), SJ (Judgement), GC (Generation), DS (Data/Design)
 */
const TaskStepRenderer = ({ step, gradeSpec, answers, setAnswers, domainColor }) => {
  const { performanceType } = gradeSpec;

  switch (performanceType) {
    case 'TD':
      return (
        <TDRenderer 
          step={step} 
          answers={answers} 
          setAnswers={setAnswers} 
          domainColor={domainColor} 
        />
      );
    // SJ, GC, DS will be added here
    default:
      return (
        <div className="p-8 text-center text-slate-400">
          준비 중인 수행 유형입니다: {performanceType}
        </div>
      );
  }
};

export default TaskStepRenderer;
