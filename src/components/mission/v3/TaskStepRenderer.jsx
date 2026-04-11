import React from 'react';
import TDRenderer from './TDRenderer';
import GCRenderer from './GCRenderer';
import DSRenderer from './DSRenderer';
import SJRenderer from './SJRenderer';

/**
 * TaskStepRenderer - Dispatches the task to the appropriate performance type renderer.
 * Types: TD (Exploration), SJ (Judgement), GC (Generation/Critical), DS (Data/Design)
 */
const TaskStepRenderer = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const { performanceType } = gradeSpec;

  switch (performanceType) {
    case 'TD':
      return (
        <TDRenderer
          step={step}
          answers={answers}
          setAnswers={setAnswers}
          domainColor={domainColor}
          hint={hint}
          onHintClick={onHintClick}
        />
      );
    case 'GC':
      return (
        <GCRenderer
          step={step}
          answers={answers}
          setAnswers={setAnswers}
          domainColor={domainColor}
          hint={hint}
          onHintClick={onHintClick}
        />
      );
    case 'DS':
      return (
        <DSRenderer
          step={step}
          answers={answers}
          setAnswers={setAnswers}
          domainColor={domainColor}
          hint={hint}
          onHintClick={onHintClick}
        />
      );
    case 'SJ':
      return (
        <SJRenderer
          step={step}
          answers={answers}
          setAnswers={setAnswers}
          domainColor={domainColor}
          hint={hint}
          onHintClick={onHintClick}
        />
      );
    default:
      return (
        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
          준비 중인 수행 유형입니다: {performanceType}
        </div>
      );
  }
};

export default TaskStepRenderer;
