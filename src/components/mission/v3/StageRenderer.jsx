import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import TaskStepRenderer from './TaskStepRenderer';
import {
  StartDetectiveIcon,
  IntroThinkingIcon,
  IntroDiscoverIcon,
  IntroDetectiveIcon
} from './MissionIcons';

const INTRO_ICONS = [IntroThinkingIcon, IntroDiscoverIcon, IntroDetectiveIcon];

/**
 * StageRenderer - Renders the content for each stage.
 * Stages: start | intro | core | task | submit | complete
 */
const StageRenderer = ({
  stage,
  mission,
  gradeSpec,
  stepIndex,
  slideIndex,
  answers,
  setAnswers,
  uiState,
  onStart
}) => {
  const navigate = useNavigate();
  const currentStep = gradeSpec.steps?.[stepIndex];
  const domainColor = `var(--v3-color-${mission.meta.domain.toLowerCase()})`;

  // ─── START ────────────────────────────────────────────────────
  if (stage === 'start') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        textAlign: 'center',
        padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 32px)',
        gap: 'clamp(20px, 5vw, 32px)'
      }}>
        <StartDetectiveIcon size={Math.min(120, window.innerWidth * 0.28)} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px' }}>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 5.5vw, 2rem)',
            fontWeight: 900,
            color: '#1e293b',
            lineHeight: 1.15,
            margin: 0
          }}>
            {mission.meta.title}
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.125rem)',
            color: '#64748b',
            lineHeight: 1.6,
            margin: 0
          }}>
            {gradeSpec.description}
          </p>
        </div>

        {/* 버튼: flex: none 로 flex-grow 방지 */}
        <button
          onClick={onStart}
          style={{
            flex: 'none',
            backgroundColor: domainColor,
            color: 'white',
            width: '100%',
            maxWidth: 'clamp(200px, 60vw, 280px)',
            padding: 'clamp(16px, 4vw, 20px) 32px',
            fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
            fontWeight: 900,
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transition: 'transform 0.1s ease',
            fontFamily: 'inherit'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          시작하기
        </button>
      </div>
    );
  }

  // ─── INTRO ────────────────────────────────────────────────────
  if (stage === 'intro') {
    const slide = gradeSpec.intro[slideIndex];
    const IntroIcon = INTRO_ICONS[slideIndex % INTRO_ICONS.length];
    const iconSize = Math.min(96, window.innerWidth * 0.22);

    return (
      <div
        key={slideIndex}
        className="animate-slide-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          padding: 'clamp(16px, 5vw, 32px) 0',
          gap: 'clamp(20px, 5vw, 32px)'
        }}
      >
        <IntroIcon size={iconSize} />

        <div className="v3-card" style={{ textAlign: 'center', padding: 'clamp(20px, 5vw, 28px) clamp(16px, 4vw, 24px)', width: '100%' }}>
          {slide.text.split('\n').map((line, i, arr) => (
            <p
              key={i}
              style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                color: '#1e293b',
                lineHeight: 1.7,
                margin: 0,
                marginBottom: i < arr.length - 1 ? '10px' : 0,
                wordBreak: 'keep-all'
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Dot indicator */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {gradeSpec.intro.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === slideIndex ? '28px' : '10px',
                height: '10px',
                borderRadius: '999px',
                backgroundColor: i === slideIndex ? domainColor : '#cbd5e1',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── CORE ─────────────────────────────────────────────────────
  if (stage === 'core') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 2px 4px' }}>
          <div style={{ width: '4px', height: '20px', borderRadius: '2px', backgroundColor: domainColor, flexShrink: 0 }} />
          <h2 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 900, color: '#1e293b', margin: 0 }}>
            함께 생각해보아요
          </h2>
        </div>
        {gradeSpec.coreUnderstanding.map((item, idx) => (
          <div
            key={item.id}
            className="v3-card animate-slide-up"
            style={{
              animationDelay: `${idx * 120}ms`,
              padding: `clamp(16px, 4vw, 20px)`,
              marginBottom: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: 'clamp(22px, 5vw, 26px)',
                height: 'clamp(22px, 5vw, 26px)',
                borderRadius: '50%',
                backgroundColor: domainColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                fontWeight: 900,
                color: 'white',
                flexShrink: 0
              }}>
                {item.id}
              </div>
              <div style={{
                fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
                fontWeight: 900,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                질문 {item.id}
              </div>
            </div>
            <div style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.05rem)',
              fontWeight: 800,
              color: '#1e293b',
              marginBottom: '10px',
              lineHeight: 1.45,
              wordBreak: 'keep-all'
            }}>
              {item.question}
            </div>
            <div style={{
              padding: 'clamp(8px, 2vw, 10px) clamp(10px, 3vw, 14px)',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              fontSize: 'clamp(0.875rem, 2.5vw, 0.95rem)',
              color: '#475569',
              lineHeight: 1.55,
              wordBreak: 'keep-all'
            }}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── TASK ──────────────────────────────────────────────────────
  if (stage === 'task') {
    return (
      <TaskStepRenderer
        step={currentStep}
        gradeSpec={gradeSpec}
        answers={answers}
        setAnswers={setAnswers}
        domainColor={domainColor}
      />
    );
  }

  // ─── SUBMIT ────────────────────────────────────────────────────
  if (stage === 'submit') {
    const { summaryLabels } = gradeSpec.submit;

    const getAnswerDisplay = (step) => {
      const ans = answers[step.id];
      if (!ans) return '—';

      if (step.uiMode === 'choice_cards') {
        const selected = (step.options || []).filter(o => (ans || []).includes(o.id));
        return selected.map(o => o.label).join(', ') || '—';
      }
      if (step.uiMode === 'single_select_buttons') {
        if (ans === 'other') {
          const text = answers[`${step.id}_other_text`];
          return text ? `기타: ${text}` : '기타';
        }
        const found = (step.options || []).find(o => o.id === ans);
        return found ? found.label : '—';
      }
      if (step.uiMode === 'photo_or_card_select') {
        return ans.type === 'photo' ? '📷 사진으로 찾음' : '—';
      }
      return '—';
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)', padding: '4px 0' }}>
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{
              width: 'clamp(52px, 13vw, 64px)',
              height: 'clamp(52px, 13vw, 64px)',
              borderRadius: '50%',
              backgroundColor: `${domainColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClipboardList size={28} color={domainColor} strokeWidth={2.5} />
            </div>
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.6rem)', fontWeight: 900, color: '#1e293b', margin: '0 0 4px' }}>
            미션을 제출할까요?
          </h2>
          <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#64748b', margin: 0 }}>
            활동한 내용을 한번 확인해보세요.
          </p>
        </div>

        <div className="v3-card">
          <div style={{
            fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
            fontWeight: 900,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px'
          }}>
            활동 요약
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {gradeSpec.steps.map(step => (
              <div key={step.id}>
                <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
                  {summaryLabels?.[step.id] || step.title}
                </span>
                <span style={{ fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', fontWeight: 800, color: '#1e293b' }}>
                  {getAnswerDisplay(step)}
                </span>
                <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginTop: '10px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPLETE ──────────────────────────────────────────────────
  if (stage === 'complete') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        textAlign: 'center',
        gap: 'clamp(18px, 5vw, 28px)',
        padding: 'clamp(32px, 8vw, 56px) clamp(16px, 5vw, 32px)'
      }}>
        <div style={{
          width: 'clamp(90px, 22vw, 120px)',
          height: 'clamp(90px, 22vw, 120px)',
          backgroundColor: `${domainColor}18`,
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 16px 40px ${domainColor}30`,
          animation: 'pulse 2s infinite'
        }}>
          <CheckCircle2
            size={Math.min(60, window.innerWidth * 0.14)}
            color={domainColor}
            strokeWidth={1.8}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
            {gradeSpec.submit.title}
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1.05rem)', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            {gradeSpec.submit.message}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: 'clamp(14px, 4vw, 18px) clamp(28px, 8vw, 40px)',
            backgroundColor: '#1e293b',
            color: 'white',
            fontWeight: 900,
            borderRadius: '18px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
            fontFamily: 'inherit'
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return null;
};

export default StageRenderer;
