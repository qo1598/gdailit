import React from 'react';
import { Check } from 'lucide-react';
import { getIcon } from '../MissionIcons';
import { StepHeader, SelectionHint } from './shared';

export const ChoiceCards = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || [];
  const otherText = answers[`${step.id}_other_text`] || '';

  const toggleOption = (optionId) => {
    const isSelected = selected.includes(optionId);
    const next = isSelected
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId];
    setAnswers(prev => ({ ...prev, [step.id]: next }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div className="v3-choice-grid">
        {step.options.map((option, idx) => {
          const isActive = selected.includes(option.id);
          const iconEl = getIcon(option.id, Math.min(56, window.innerWidth * 0.13));
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`v3-choice-btn ${isActive ? 'active' : ''}`}
              style={{
                animationDelay: `${idx * 70}ms`,
                borderColor: isActive ? domainColor : undefined,
                boxShadow: isActive ? `0 6px 18px ${domainColor}30` : undefined
              }}
            >
              <div style={{ lineHeight: 0 }}>
                {iconEl || (
                  <div style={{
                    width: 'clamp(44px, 12vw, 56px)',
                    height: 'clamp(44px, 12vw, 56px)',
                    borderRadius: '50%',
                    backgroundColor: `${domainColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: 900,
                    color: domainColor
                  }}>
                    {option.label[0]}
                  </div>
                )}
              </div>
              <span style={{
                fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
                fontWeight: 800,
                color: isActive ? '#1e293b' : '#64748b',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {option.label}
              </span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: 'clamp(18px, 4vw, 22px)',
                  height: 'clamp(18px, 4vw, 22px)',
                  borderRadius: '999px',
                  backgroundColor: domainColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected.includes('other') && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', fontWeight: 700, color: '#64748b' }}>
            어떤 내용인지 써보세요!
          </label>
          <input
            type="text"
            placeholder="직접 써보세요..."
            value={otherText}
            onChange={(e) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: e.target.value }))}
            autoFocus
            maxLength={40}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 18px)',
              border: `2.5px solid ${domainColor}`,
              borderRadius: '14px',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              color: '#1e293b',
              backgroundColor: 'white'
            }}
          />
        </div>
      )}

      <SelectionHint count={selected.length} mode="multi" />
    </div>
  );
};

export const SingleSelectButtons = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || null;
  const otherText = answers[`${step.id}_other_text`] || '';

  const selectOption = (optionId) => {
    setAnswers(prev => ({ ...prev, [step.id]: optionId }));
  };

  const iconSize = Math.min(48, window.innerWidth * 0.11);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'clamp(10px, 3vw, 14px)'
      }}>
        {step.options.map((option, idx) => {
          const isActive = selected === option.id;
          const iconEl = getIcon(option.id, iconSize);
          return (
            <button
              key={option.id}
              onClick={() => selectOption(option.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(8px, 2vw, 10px)',
                padding: 'clamp(16px, 4vw, 22px) clamp(10px, 3vw, 14px)',
                borderRadius: '18px',
                border: isActive ? `2.5px solid ${domainColor}` : '2.5px solid #e2e8f0',
                backgroundColor: isActive ? `${domainColor}12` : 'white',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 4px 14px ${domainColor}28` : '0 1px 4px rgba(0,0,0,0.05)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                fontFamily: 'inherit'
              }}
            >
              <div style={{ lineHeight: 0 }}>
                {iconEl || (
                  <div style={{
                    width: 'clamp(36px, 9vw, 48px)',
                    height: 'clamp(36px, 9vw, 48px)',
                    borderRadius: '50%',
                    backgroundColor: `${domainColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontWeight: 900,
                    color: domainColor
                  }}>
                    {option.label[0]}
                  </div>
                )}
              </div>
              <span style={{
                fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
                fontWeight: 800,
                color: isActive ? '#1e293b' : '#64748b',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected === 'other' && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', fontWeight: 700, color: '#64748b' }}>
            어떤 {step.id === 'step3' ? '장소' : '도움'}인지 써보세요!
          </label>
          <input
            type="text"
            placeholder={step.id === 'step3' ? '예: 마트, 병원, 공원...' : '예: 번역하기, 그림 그리기...'}
            value={otherText}
            onChange={(e) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: e.target.value }))}
            autoFocus
            maxLength={30}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 18px)',
              border: `2.5px solid ${domainColor}`,
              borderRadius: '14px',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              color: '#1e293b',
              backgroundColor: 'white'
            }}
          />
        </div>
      )}

      <SelectionHint count={selected ? 1 : 0} mode="single" />
    </div>
  );
};

export const TagSelect = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const ans = answers[step.id] || {};
  const setTag = (tagId) => setAnswers(prev => ({ ...prev, [step.id]: { ...ans, tag: tagId } }));
  const setText = (text) => setAnswers(prev => ({ ...prev, [step.id]: { ...ans, text } }));

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: step.allowText ? '14px' : '0' }}>
          {step.tags.map(tag => {
            const isSelected = ans.tag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setTag(tag.id)}
                style={{
                  padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3.5vw, 18px)',
                  borderRadius: '999px',
                  border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                  backgroundColor: isSelected ? domainColor : '#f8fafc',
                  color: isSelected ? '#fff' : '#475569',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                  cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all'
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
        {step.allowText && (
          <textarea
            placeholder="직접 써도 좋아요. (선택)"
            value={ans.text || ''}
            onChange={e => setText(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: '2px solid #e2e8f0', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.5
            }}
            rows={2}
          />
        )}
      </div>
    </div>
  );
};

export const SingleSelectCards = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || null;
  const TOPIC_ICONS = { animal: '🐾', cooking: '🍳', vehicle: '🚗' };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(10px, 3vw, 16px)' }}>
        {step.options.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setAnswers(prev => ({ ...prev, [step.id]: option.id }))}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(20px, 5vw, 28px) clamp(8px, 2vw, 12px)',
                borderRadius: '20px',
                border: `2.5px solid ${isActive ? domainColor : '#e2e8f0'}`,
                backgroundColor: isActive ? `${domainColor}12` : 'white',
                boxShadow: isActive ? `0 6px 18px ${domainColor}30` : '0 1px 4px rgba(0,0,0,0.05)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                fontFamily: 'inherit',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: 'clamp(28px, 8vw, 40px)', lineHeight: 1 }}>
                {TOPIC_ICONS[option.id] || '📌'}
              </span>
              <span style={{
                fontSize: 'clamp(0.9rem, 3vw, 1.05rem)', fontWeight: 800,
                color: isActive ? '#1e293b' : '#64748b', textAlign: 'center'
              }}>
                {option.label}
              </span>
              {isActive && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: 'clamp(18px, 4vw, 22px)', height: 'clamp(18px, 4vw, 22px)',
                  borderRadius: '999px', backgroundColor: domainColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={12} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <SelectionHint count={selected ? 1 : 0} mode="single" />
    </div>
  );
};

export const FreeText = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const value = answers[step.id] || '';
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <textarea
          placeholder={step.placeholder || '직접 써보세요.'}
          value={value}
          onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: `2px solid ${value ? domainColor : '#e2e8f0'}`,
            fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            resize: 'none', outline: 'none', fontFamily: 'inherit',
            color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.6,
            transition: 'border-color 0.15s'
          }}
          rows={3}
        />
      </div>
    </div>
  );
};
