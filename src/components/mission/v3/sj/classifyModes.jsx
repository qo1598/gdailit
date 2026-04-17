import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepHeader } from './shared';

// ─── ClassifyCarousel (classify_cards_carousel) ──────────────────
export const ClassifyCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const cards = step.cards;
  const total = cards.length;
  const classified = Object.keys(answer).length;

  const firstUnclassified = cards.findIndex(c => !answer[c.id]);
  const [index, setIndex] = useState(firstUnclassified === -1 ? 0 : firstUnclassified);

  const card = cards[index];
  const selected = answer[card.id];

  const classify = (groupId) => {
    const next = { ...answer, [card.id]: groupId };
    setAnswers(prev => ({ ...prev, [step.id]: next }));
    const nextUnclassified = cards.findIndex((c, i) => i !== index && !next[c.id]);
    if (nextUnclassified !== -1) {
      setTimeout(() => setIndex(nextUnclassified), 300);
    }
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div className="v3-card" style={{ marginBottom: 0, padding: 'clamp(20px, 5vw, 28px) clamp(16px, 4vw, 24px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {cards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setIndex(i)}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  border: 'none', cursor: 'pointer', padding: 0,
                  backgroundColor: answer[c.id] ? domainColor : i === index ? '#94a3b8' : '#e2e8f0',
                  transition: 'background-color 0.15s'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.85rem)', fontWeight: 700, color: '#94a3b8' }}>
            {index + 1} / {total}
          </span>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '12px',
          padding: 'clamp(24px, 6vw, 36px) 0',
          marginBottom: '20px'
        }}>
          <div style={{
            width: 'clamp(80px, 22vw, 110px)', height: 'clamp(80px, 22vw, 110px)',
            borderRadius: '24px',
            backgroundColor: answer[card.id] === 'ai' ? domainColor + '18' : answer[card.id] === 'non_ai' ? '#f1f5f9' : '#f8fafc',
            border: `2px solid ${answer[card.id] ? domainColor + '40' : '#e2e8f0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(36px, 10vw, 52px)',
            transition: 'all 0.2s'
          }}>
            {card.emoji}
          </div>
          <div style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 900,
            color: '#1e293b', textAlign: 'center', wordBreak: 'keep-all'
          }}>
            {card.label}
          </div>
          {selected && (
            <div style={{
              padding: '4px 14px', borderRadius: '999px',
              backgroundColor: domainColor + '18',
              border: `1.5px solid ${domainColor}`,
              fontSize: 'clamp(0.78rem, 2.2vw, 0.85rem)', fontWeight: 800, color: domainColor
            }}>
              ✓ {step.groups.find(g => g.id === selected)?.label}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {step.groups.map(group => {
            const isSelected = selected === group.id;
            return (
              <button
                key={group.id}
                onClick={() => classify(group.id)}
                style={{
                  flex: 1,
                  padding: 'clamp(12px, 3vw, 16px)',
                  borderRadius: '14px',
                  border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                  backgroundColor: isSelected ? domainColor : '#f8fafc',
                  color: isSelected ? '#fff' : '#64748b',
                  fontWeight: isSelected ? 900 : 700,
                  fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  wordBreak: 'keep-all'
                }}
              >
                {isSelected && '✓ '}{group.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setIndex(prev => Math.max(0, prev - 1))}
          disabled={index === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: '2px solid #e2e8f0', backgroundColor: '#f8fafc',
            color: index === 0 ? '#cbd5e1' : '#475569',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: index === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={16} /> 이전
        </button>

        <div style={{
          flex: 1, padding: 'clamp(8px, 2.5vw, 11px) 14px',
          backgroundColor: classified === total ? '#dcfce7' : '#f8fafc',
          borderRadius: '12px',
          border: `2px dashed ${classified === total ? '#22c55e' : '#e2e8f0'}`,
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700,
            color: classified === total ? '#16a34a' : '#94a3b8', margin: 0
          }}>
            {classified === total ? `${total}개 모두 분류 완료!` : `${classified} / ${total}개 분류됨`}
          </p>
        </div>

        <button
          onClick={() => setIndex(prev => Math.min(total - 1, prev + 1))}
          disabled={index === total - 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: '2px solid #e2e8f0', backgroundColor: '#f8fafc',
            color: index === total - 1 ? '#cbd5e1' : '#475569',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: index === total - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          다음 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── CaseCarouselReason (case_carousel_reason) ───────────────────
export const CaseCarouselReason = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const cases = step.cases || [];
  const answer = answers[step.id] || {};
  const [index, setIndex] = useState(0);

  const c = cases[index];
  if (!c) return null;
  const ca = answer[c.id] || {};

  const toggleReason = (reasonId) => {
    const current = ca.reasons || [];
    const next = current.includes(reasonId) ? current.filter(r => r !== reasonId) : [...current, reasonId];
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), [c.id]: { ...(prev[step.id]?.[c.id] || {}), reasons: next } }
    }));
  };

  const setOtherText = (text) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), [c.id]: { ...(prev[step.id]?.[c.id] || {}), otherText: text } }
    }));
  };

  const isOtherSelected = (ca.reasons || []).includes('other');
  const completedCount = cases.filter(cs => (answer[cs.id]?.reasons || []).length > 0).length;
  const allDone = completedCount === cases.length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
        {cases.map((cs, i) => {
          const isDone = (answer[cs.id]?.reasons || []).length > 0;
          const isCurrent = i === index;
          return (
            <button key={i} onClick={() => setIndex(i)} style={{
              width: isCurrent ? '28px' : '10px', height: '10px',
              borderRadius: '5px', border: 'none', padding: 0, cursor: 'pointer',
              backgroundColor: isDone ? '#22c55e' : isCurrent ? domainColor : '#cbd5e1',
              transition: 'all 0.2s'
            }} />
          );
        })}
      </div>

      <div className="v3-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
        <div style={{
          background: c.visualBg || domainColor + '22',
          padding: 'clamp(20px, 5vw, 30px)',
          textAlign: 'center',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ fontSize: 'clamp(2.8rem, 11vw, 4.5rem)', lineHeight: 1, marginBottom: '10px' }}>
            {c.visual}
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: domainColor, color: '#fff', borderRadius: '20px',
            padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800
          }}>
            사례 {index + 1} / {cases.length}
          </span>
        </div>

        <div style={{ padding: 'clamp(14px, 4vw, 20px)' }}>
          <div style={{
            fontWeight: 900, fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            color: '#1e293b', marginBottom: '12px', wordBreak: 'keep-all'
          }}>
            {c.title}
          </div>

          <div style={{
            background: '#f8fafc', borderRadius: '10px', padding: '10px 14px',
            marginBottom: '8px', fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)',
            color: '#334155', lineHeight: 1.65, wordBreak: 'keep-all'
          }}>
            <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>📍 상황</span>
            {c.situation}
          </div>

          <div style={{
            background: '#f0fdf4', borderRadius: '10px', padding: '10px 14px',
            marginBottom: '18px', fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)',
            color: '#166534', lineHeight: 1.65, wordBreak: 'keep-all'
          }}>
            <span style={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>🔄 결과</span>
            {c.change}
          </div>

          <div style={{
            fontWeight: 800, fontSize: 'clamp(0.85rem, 2.6vw, 0.95rem)',
            color: '#1e293b', marginBottom: '10px'
          }}>
            왜 이런 추천이 이어졌나요?
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(step.reasonOptions || []).map(opt => {
              const isSelected = (ca.reasons || []).includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleReason(opt.id)} style={{
                  padding: '8px 16px', borderRadius: '20px',
                  border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                  backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                  color: isSelected ? domainColor : '#64748b',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)',
                  cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all'
                }}>
                  {isSelected ? '✓ ' : ''}{opt.label}
                </button>
              );
            })}
          </div>

          {isOtherSelected && (
            <div style={{ marginTop: '12px' }}>
              <textarea
                placeholder="다른 이유가 있다면 적어보세요."
                value={ca.otherText || ''}
                onChange={e => setOtherText(e.target.value)}
                rows={2}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: `2px solid ${ca.otherText?.trim() ? domainColor : '#e2e8f0'}`,
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
                  outline: 'none', fontFamily: 'inherit', color: '#1e293b',
                  boxSizing: 'border-box', lineHeight: 1.5
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: '2px solid #e2e8f0',
            backgroundColor: index === 0 ? '#f8fafc' : '#fff',
            color: index === 0 ? '#cbd5e1' : '#475569',
            fontWeight: 700, cursor: index === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)'
          }}
        >
          <ChevronLeft size={16} /> 이전 사례
        </button>
        <button
          onClick={() => setIndex(i => Math.min(cases.length - 1, i + 1))}
          disabled={index === cases.length - 1}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: `2px solid ${index === cases.length - 1 ? '#e2e8f0' : domainColor}`,
            backgroundColor: index === cases.length - 1 ? '#f8fafc' : domainColor + '18',
            color: index === cases.length - 1 ? '#cbd5e1' : domainColor,
            fontWeight: 700, cursor: index === cases.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)'
          }}
        >
          다음 사례 <ChevronRight size={16} />
        </button>
      </div>

      <div style={{
        padding: '10px 14px', borderRadius: '10px', textAlign: 'center',
        border: `2px dashed ${allDone ? '#22c55e' : '#e2e8f0'}`,
        backgroundColor: '#f8fafc'
      }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: allDone ? '#16a34a' : '#94a3b8' }}>
          {allDone ? `${cases.length}개 사례 모두 완료!` : `${completedCount} / ${cases.length} 사례 완료`}
        </p>
      </div>
    </div>
  );
};
