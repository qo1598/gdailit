import React from 'react';
import { Home, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DOMAIN_COLORS = {
  Engaging: 'var(--v3-color-engaging)',
  Creating: 'var(--v3-color-creating)',
  Managing: 'var(--v3-color-managing)',
  Designing: 'var(--v3-color-designing)'
};

const GRADE_LABELS = { L: '1-2학년', M: '3-4학년', H: '5-6학년' };

const MissionShell = ({
  meta,
  gradeSpec,
  stage,
  stepIndex,
  totalSteps,
  slideIndex,
  totalSlides,
  onPrev,
  onNext,
  onStart,
  uiState,
  dwellRemaining,
  children
}) => {
  const navigate = useNavigate();
  const domainColor = DOMAIN_COLORS[meta.domain] || '#3498db';
  const gradeSuffix = gradeSpec.cardCode.split('-').pop();
  const gradeLabel = GRADE_LABELS[gradeSuffix] || '';

  const isStart = stage === 'start';
  const isComplete = stage === 'complete';
  const isSubmit = stage === 'submit';

  // Progress label and percentage
  const getProgress = () => {
    if (stage === 'intro') {
      return {
        label: `미션 도입 ${slideIndex + 1}/${totalSlides}`,
        pct: Math.round(((slideIndex + 1) / totalSlides) * 20)
      };
    }
    if (stage === 'core') return { label: '핵심 이해', pct: 25 };
    if (stage === 'scenario') return { label: '미션 상황', pct: 32 };
    if (stage === 'task') {
      return {
        label: `수행 과제 ${stepIndex + 1}/${totalSteps}`,
        pct: Math.round(35 + ((stepIndex + 1) / totalSteps) * 55)
      };
    }
    if (stage === 'submit') return { label: '최종 제출', pct: 95 };
    return { label: '', pct: 0 };
  };

  const { label: progressLabel, pct: progressPct } = getProgress();

  const handleHomeClick = () => navigate('/');

  return (
    <div className="v3-mission-layout">
      {/* TopBar */}
      {!isComplete && (
        <div className="v3-top-bar" style={{ backgroundColor: domainColor }}>
          <button onClick={handleHomeClick} className="v3-back-btn">
            <Home size={20} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', opacity: 0.85, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {meta.domain} | {gradeSpec.cardCode}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {meta.title}
            </div>
          </div>
          <div className="v3-grade-badge">{gradeLabel}</div>
        </div>
      )}

      {/* ProgressHeader */}
      {!isStart && !isComplete && (
        <div className="v3-progress-container">
          <div className="v3-progress-info">
            <span className="v3-progress-label">{progressLabel}</span>
            <span className="v3-progress-percent">{progressPct}%</span>
          </div>
          <div className="v3-progress-track">
            <div
              className="v3-progress-bar"
              style={{ backgroundColor: domainColor, width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* ContentStage */}
      <div className="v3-content-stage">
        {children}
      </div>

      {/* Validation Error */}
      {uiState?.validationError && (
        <div style={{ margin: '0 16px 8px', padding: '10px 16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', color: '#dc2626', fontSize: '0.875rem', fontWeight: 700, textAlign: 'center' }}>
          {uiState.validationError}
        </div>
      )}

      {/* BottomNav */}
      {!isStart && !isComplete && (
        <div className="v3-bottom-nav">
          <button onClick={onPrev} className="v3-btn-prev">
            <ChevronLeft size={20} />
            이전
          </button>
          {(() => {
            const isBlocked = uiState?.loading || dwellRemaining > 0;
            const dwellSec = dwellRemaining > 0 ? Math.ceil(dwellRemaining / 1000) : 0;
            return (
              <button
                onClick={onNext}
                className="v3-btn-next"
                style={{
                  backgroundColor: isBlocked ? '#94a3b8' : domainColor,
                  opacity: 1,
                  cursor: isBlocked ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                disabled={isBlocked}
              >
                {uiState?.loading ? (
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                ) : dwellSec > 0 ? (
                  <>{dwellSec}초 후 가능</>
                ) : isSubmit ? (
                  <>제출하기 <Check size={18} /></>
                ) : (
                  <>다음 <ChevronRight size={20} /></>
                )}
              </button>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MissionShell;
