import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DOMAIN_COLORS = {
  Engaging: 'var(--v3-color-engaging)',
  Creating: 'var(--v3-color-creating)',
  Managing: 'var(--v3-color-managing)',
  Designing: 'var(--v3-color-designing)'
};

const MissionShell = ({ 
  meta, 
  gradeSpec, 
  stage, 
  stepIndex, 
  totalSteps, 
  onPrev, 
  onNext, 
  onStart, 
  children 
}) => {
  const navigate = useNavigate();
  const domainColor = DOMAIN_COLORS[meta.domain] || 'var(--pokedex-red)';
  
  const isStart = stage === 'start';
  const isComplete = stage === 'complete';
  const isLastStep = stage === 'submit';

  const gradeLabel = gradeSpec.cardCode.split('-').pop() === 'L' ? '1-2학년' : 
                     gradeSpec.cardCode.split('-').pop() === 'M' ? '3-4학년' : '5-6학년';

  return (
    <div className="v3-mission-layout">
      {/* TopBar */}
      {!isComplete && (
        <div 
          className="v3-top-bar"
          style={{ backgroundColor: domainColor }}
        >
          <button 
            onClick={() => stage === 'start' ? navigate('/') : onPrev()}
            className="v3-back-btn"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', opacity: 0.8, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {meta.domain} | {gradeSpec.cardCode}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.125rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {meta.title}
            </div>
          </div>
          <div className="v3-grade-badge">
            {gradeLabel}
          </div>
        </div>
      )}

      {/* ProgressHeader */}
      {!isStart && !isComplete && (
        <div className="v3-progress-container">
          <div className="v3-progress-info">
            <span className="v3-progress-label">
              {stage === 'intro' ? '미션 도입' : 
               stage === 'core' ? '핵심 이해' : 
               stage === 'task' ? `수행 과제 (${stepIndex + 1}/${totalSteps})` : 
               stage === 'submit' ? '최종 제출' : ''}
            </span>
            <span className="v3-progress-percent">
               {stage === 'task' ? Math.round(((stepIndex + 1) / totalSteps) * 100) : 
                stage === 'intro' ? 20 : stage === 'core' ? 40 : 90}%
            </span>
          </div>
          <div className="v3-progress-track">
            <div 
              className="v3-progress-bar"
              style={{ 
                backgroundColor: domainColor,
                width: stage === 'intro' ? '20%' : 
                       stage === 'core' ? '40%' : 
                       stage === 'task' ? `${40 + ((stepIndex + 1) / totalSteps) * 50}%` : 
                       stage === 'submit' ? '95%' : '0%'
              }}
            />
          </div>
        </div>
      )}

      {/* ContentStage */}
      <div className="v3-content-stage">
        {children}
      </div>

      {/* BottomNav */}
      {!isStart && !isComplete && (
        <div className="v3-bottom-nav">
          <button 
            onClick={onPrev}
            className="v3-btn-prev"
          >
            <ChevronLeft size={20} />
            이전
          </button>
          <button 
            onClick={onNext}
            className="v3-btn-next"
            style={{ backgroundColor: domainColor }}
          >
            {isLastStep ? '제출하기' : '다음'}
            {isLastStep ? <Check size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default MissionShell;
