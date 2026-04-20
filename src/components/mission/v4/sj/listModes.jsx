import React from 'react';
import { StepHeader, ChipGroup, BranchReferencePanel } from './shared';
import { PrevContextPanel } from '../gc/shared';

// ─── classify_cards ─────────────────────────────────────────────
export const ClassifyCards = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const classify = (cardId, groupId) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...answer, [cardId]: groupId } }));
  };
  const classified = Object.keys(answer).length;
  const total = step.cards.length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      {step.cards.map(card => {
        const selected = answer[card.id];
        return (
          <div key={card.id} className="v3-card" style={{ padding: 'clamp(12px, 3vw, 16px)', marginBottom: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', color: '#1e293b', marginBottom: '10px', wordBreak: 'keep-all' }}>
              {card.label}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {step.groups.map(group => {
                const isSelected = selected === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => classify(card.id, group.id)}
                    style={{
                      flex: 1,
                      padding: 'clamp(8px, 2vw, 12px)',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                      backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                      color: isSelected ? domainColor : '#64748b',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      wordBreak: 'keep-all'
                    }}
                  >
                    {isSelected && <span style={{ marginRight: '4px' }}>✓</span>}
                    {group.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{
        padding: 'clamp(10px, 3vw, 14px) 16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '2px dashed #e2e8f0',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: classified === total ? '#22c55e' : '#94a3b8', margin: 0 }}>
          {classified === total ? `${total}개 모두 분류했어요!` : `${classified} / ${total}개 분류됨`}
        </p>
      </div>
    </div>
  );
};

// ─── multi_select_chips ──────────────────────────────────────────
export const MultiSelectChips = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || [];
  const otherText = answers[`${step.id}_other_text`] || '';
  const toggle = (chipId) => {
    const isSelected = selected.includes(chipId);
    setAnswers(prev => ({
      ...prev,
      [step.id]: isSelected ? selected.filter(id => id !== chipId) : [...selected, chipId]
    }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {step.chips.map(chip => {
            const isSelected = selected.includes(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => toggle(chip.id)}
                style={{
                  padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3.5vw, 18px)',
                  borderRadius: '999px',
                  border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                  backgroundColor: isSelected ? domainColor : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  wordBreak: 'keep-all'
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        {selected.includes('other') && (
          <div style={{ marginTop: '14px' }}>
            <input
              type="text"
              placeholder="직접 써보세요..."
              value={otherText}
              onChange={(e) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: e.target.value }))}
              autoFocus
              maxLength={40}
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 16px)',
                border: `2px solid ${domainColor}`,
                borderRadius: '12px',
                fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
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
        {selected.length > 0 && !selected.includes('other') && (
          <div style={{ marginTop: '12px', padding: '8px 14px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            {selected.length}개 선택됨
          </div>
        )}
      </div>
    </div>
  );
};

// ─── per_card_tags ───────────────────────────────────────────────
export const PerCardTags = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const setCardField = (cardId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...answer, [cardId]: { ...(answer[cardId] || {}), [field]: value } }
    }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      {step.cards.map(card => {
        const ca = answer[card.id] || {};
        return (
          <div key={card.id} className="v3-card" style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              질문
            </div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(0.92rem, 2.8vw, 1rem)', color: '#1e293b', marginBottom: '8px', wordBreak: 'keep-all' }}>
              {card.question}
            </div>
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#f1f5f9',
              borderRadius: '10px',
              fontSize: 'clamp(0.83rem, 2.4vw, 0.9rem)',
              color: '#334155',
              marginBottom: '14px',
              lineHeight: 1.55,
              wordBreak: 'keep-all'
            }}>
              <span style={{ fontWeight: 700, color: '#94a3b8' }}>AI 답: </span>{card.answer}
            </div>
            {step.problemOptions && (
              <ChipGroup
                label="문제점"
                options={step.problemOptions}
                selected={ca.problem_tag ? [ca.problem_tag] : []}
                onToggle={(id) => setCardField(card.id, 'problem_tag', id)}
                domainColor="#ef4444"
              />
            )}
            {step.actionOptions && (
              <ChipGroup
                label="대처 방법"
                options={step.actionOptions}
                selected={ca.response_action ? [ca.response_action] : []}
                onToggle={(id) => setCardField(card.id, 'response_action', id)}
                domainColor={domainColor}
                style={{ marginTop: '10px' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── multi_free_text ──────────────────────────────────────────────
export const MultiFreeText = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const questions = step.questions || [];
  const placeholders = step.placeholders || [];
  const rowsPerField = step.rowsPerField || 3;
  const answeredCount = questions.filter(q => answer[q.id]?.trim()).length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <PrevContextPanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />
      {questions.map((q, i) => (
        <div key={q.id} className="v3-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: answer[q.id]?.trim() ? domainColor : '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 900,
              color: answer[q.id]?.trim() ? '#fff' : '#94a3b8',
              transition: 'all 0.15s', marginTop: '2px'
            }}>
              {i + 1}
            </div>
            <div style={{ fontSize: 'clamp(0.9rem, 2.7vw, 1rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.4, wordBreak: 'keep-all' }}>
              {q.text}
            </div>
          </div>
          <textarea
            placeholder={placeholders[i] || '여기에 답을 써보세요.'}
            value={answer[q.id] || ''}
            onChange={e => setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [q.id]: e.target.value } }))}
            rows={rowsPerField}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: `2px solid ${answer[q.id]?.trim() ? domainColor : '#e2e8f0'}`,
              fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
              outline: 'none', fontFamily: 'inherit', color: '#1e293b',
              boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s'
            }}
          />
        </div>
      ))}
      <div style={{
        padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
        border: `2px dashed ${answeredCount === questions.length ? '#22c55e' : '#e2e8f0'}`,
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700, margin: 0, color: answeredCount === questions.length ? '#16a34a' : '#94a3b8' }}>
          {answeredCount === questions.length ? `${questions.length}개 질문 모두 답했어요!` : `${answeredCount} / ${questions.length}개 답함`}
        </p>
      </div>
    </div>
  );
};

// ─── free_text ───────────────────────────────────────────────────
export const FreeText = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || '';
  const filled = typeof answer === 'string' && answer.trim().length > 0;
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <BranchReferencePanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <textarea
          placeholder={step.placeholder || '여기에 생각을 써보세요.'}
          value={typeof answer === 'string' ? answer : ''}
          onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
          rows={5}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: `2px solid ${filled ? domainColor : '#e2e8f0'}`,
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
            outline: 'none', fontFamily: 'inherit', color: '#1e293b',
            boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.15s'
          }}
        />
        {filled && (
          <div style={{ marginTop: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
            ✓ 작성 완료
          </div>
        )}
      </div>
    </div>
  );
};
