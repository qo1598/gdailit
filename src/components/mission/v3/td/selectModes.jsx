import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { getIcon } from '../MissionIcons';
import { StepHeader, SelectionHint } from './shared';

function shuffleOnce(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ChoiceCards = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || [];
  const otherText = answers[`${step.id}_other_text`] || '';
  const [options] = useState(() => step.randomize ? shuffleOnce(step.options) : step.options);

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
        {options.map((option, idx) => {
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
                    fontSize: option.emoji ? 'clamp(22px, 6vw, 28px)' : 'clamp(16px, 4vw, 20px)',
                    fontWeight: 900,
                    color: domainColor
                  }}>
                    {option.emoji || option.label[0]}
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

// ─── CaseViewCarousel (case_view_carousel) ────────────────────────
export const CaseViewCarousel = ({ step, domainColor, hint, onHintClick }) => {
  const cases = step.cases || [];
  const [index, setIndex] = useState(0);
  const c = cases[index];
  if (!c) return null;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {cases.map((cs, i) => (
          <button key={i} onClick={() => setIndex(i)} style={{
            width: i === index ? '28px' : '10px', height: '10px',
            borderRadius: '5px', border: 'none', padding: 0, cursor: 'pointer',
            backgroundColor: i === index ? domainColor : '#cbd5e1', transition: 'all 0.2s'
          }} />
        ))}
      </div>

      <div className="v3-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
        {c.image && (
          <img src={c.image} alt={c.title} style={{
            width: '100%', aspectRatio: '16/9', objectFit: 'cover',
            display: 'block', borderRadius: '16px 16px 0 0'
          }} />
        )}
        <div style={{ padding: 'clamp(14px, 4vw, 20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{
              background: domainColor, color: '#fff', borderRadius: '20px',
              padding: '3px 12px', fontSize: '0.75rem', fontWeight: 800
            }}>
              {index + 1} / {cases.length}
            </span>
            <span style={{ fontWeight: 900, fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', color: '#1e293b', wordBreak: 'keep-all' }}>
              {c.title}
            </span>
          </div>
          <p style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)', color: '#475569', marginBottom: '14px', wordBreak: 'keep-all' }}>
            {c.description}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[c.personA, c.personB].map((p, i) => (
              <div key={i} style={{
                borderRadius: '12px', padding: '12px 14px',
                background: i === 0 ? '#f0fdf4' : '#fff1f2',
                border: '1.5px solid ' + (i === 0 ? '#86efac' : '#fca5a5')
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: i === 0 ? '#15803d' : '#dc2626', marginBottom: '4px' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 'clamp(0.8rem, 2.3vw, 0.85rem)', color: '#334155', wordBreak: 'keep-all' }}>
                  {p.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIndex(function(i){ return Math.max(0, i - 1); })} disabled={index === 0}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0',
            backgroundColor: index === 0 ? '#f8fafc' : '#fff',
            color: index === 0 ? '#cbd5e1' : '#475569',
            fontWeight: 700, cursor: index === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontFamily: 'inherit'
          }}>
          <ChevronLeft size={16} /> 이전 사례
        </button>
        <button onClick={() => setIndex(function(i){ return Math.min(cases.length - 1, i + 1); })} disabled={index === cases.length - 1}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: '2px solid ' + (index === cases.length - 1 ? '#e2e8f0' : domainColor),
            backgroundColor: index === cases.length - 1 ? '#f8fafc' : domainColor + '18',
            color: index === cases.length - 1 ? '#cbd5e1' : domainColor,
            fontWeight: 700, cursor: index === cases.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontFamily: 'inherit'
          }}>
          다음 사례 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── PersonReasonSelect (person_reason_select) ────────────────────
export const PersonReasonSelect = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const ans = answers[step.id] || {};
  const [reasonOptions] = useState(() => step.randomizeReasons ? shuffleOnce(step.reasonOptions) : step.reasonOptions);
  const setPerson = (id) => setAnswers(function(prev){ return { ...prev, [step.id]: { ...ans, person: id } }; });
  const toggleReason = (id) => {
    const current = ans.reasons || [];
    const next = current.includes(id) ? current.filter(function(r){ return r !== id; }) : [...current, id];
    setAnswers(function(prev){ return { ...prev, [step.id]: { ...ans, reasons: next } }; });
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div className="v3-card" style={{ marginBottom: 0 }}>
        <p style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>
          누가 더 어려울까요?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {(step.personOptions || []).map(function(p) {
            const isSelected = ans.person === p.id;
            return (
              <button key={p.id} onClick={() => setPerson(p.id)} style={{
                padding: 'clamp(14px, 4vw, 20px) clamp(10px, 3vw, 14px)',
                borderRadius: '16px',
                border: '2.5px solid ' + (isSelected ? domainColor : '#e2e8f0'),
                backgroundColor: isSelected ? domainColor + '12' : '#f8fafc',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.15s', boxShadow: isSelected ? '0 4px 14px ' + domainColor + '28' : 'none'
              }}>
                <span style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 900, color: isSelected ? domainColor : '#94a3b8' }}>
                  {p.label}
                </span>
                <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', color: isSelected ? '#334155' : '#94a3b8', fontWeight: 700, wordBreak: 'keep-all', textAlign: 'center' }}>
                  {p.description}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: domainColor }}>선택됨</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {ans.person && (
        <div className="v3-card animate-slide-up" style={{ marginBottom: 0 }}>
          <p style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>
            왜 그렇게 생각했나요? (1개 이상 선택)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(reasonOptions || []).map(function(r) {
              const isSelected = (ans.reasons || []).includes(r.id);
              return (
                <button key={r.id} onClick={() => toggleReason(r.id)} style={{
                  padding: '8px 16px', borderRadius: '20px',
                  border: '2px solid ' + (isSelected ? domainColor : '#e2e8f0'),
                  backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                  color: isSelected ? domainColor : '#64748b',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)',
                  cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all', fontFamily: 'inherit'
                }}>
                  {isSelected ? '✓ ' : ''}{r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{
        padding: '10px 14px', borderRadius: '10px', textAlign: 'center',
        border: '2px dashed ' + (ans.person && (ans.reasons || []).length > 0 ? '#22c55e' : '#e2e8f0'),
        backgroundColor: '#f8fafc'
      }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: ans.person && (ans.reasons || []).length > 0 ? '#16a34a' : '#94a3b8' }}>
          {ans.person && (ans.reasons || []).length > 0 ? '사람과 이유 모두 선택됐어요!' : '사람을 고른 뒤 이유도 선택해보세요.'}
        </p>
      </div>
    </div>
  );
};
