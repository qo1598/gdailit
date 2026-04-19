import React, { useState } from 'react';
import { StepHeader } from './shared';

export const JudgeQaCards = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const ans = answers[step.id] || {};
  const setJudge = (cardId, judgeId) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...ans, [cardId]: judgeId } }));
  };
  const judged = Object.keys(ans).length;
  const total = step.qaCards.length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {step.qaCards.map(card => {
        const selected = ans[card.id];
        return (
          <div key={card.id} className="v3-card" style={{ padding: 'clamp(12px, 3vw, 16px)', marginBottom: 0 }}>
            <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>질문</div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(0.92rem, 2.8vw, 1rem)', color: '#1e293b', marginBottom: '8px', wordBreak: 'keep-all' }}>{card.question}</div>
            <div style={{ padding: '9px 13px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: 'clamp(0.83rem, 2.4vw, 0.9rem)', color: '#334155', marginBottom: '12px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
              <span style={{ fontWeight: 700, color: '#94a3b8' }}>AI: </span>{card.answer}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(step.judgeOptions || [
                { id: 'correct', label: '맞는 답' },
                { id: 'strange', label: '이상한 답' }
              ]).map(opt => {
                const isSelected = selected === opt.id;
                const accent = opt.id === 'strange' ? '#ef4444' : '#22c55e';
                return (
                  <button
                    key={opt.id}
                    onClick={() => setJudge(card.id, opt.id)}
                    style={{
                      flex: 1, padding: 'clamp(8px, 2vw, 11px)', borderRadius: '12px',
                      border: `2px solid ${isSelected ? accent : '#e2e8f0'}`,
                      backgroundColor: isSelected ? accent + '18' : '#f8fafc',
                      color: isSelected ? accent : '#64748b',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                      cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all'
                    }}
                  >
                    {isSelected && '✓ '}{opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ padding: 'clamp(10px, 3vw, 14px) 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: judged === total ? '#22c55e' : '#94a3b8', margin: 0 }}>
          {judged === total ? `${total}개 모두 확인했어요!` : `${judged} / ${total}개 확인함`}
        </p>
      </div>
    </div>
  );
};

export const JudgeQaCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const cards = step.qaCards || [];
  const total = cards.length;
  const ans = answers[step.id] || {};

  const card = cards[currentIdx];
  const cardAns = ans[card?.id] || {};
  const judgedCount = Object.keys(ans).length;

  const setJudge = (judgeId) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: {
        ...(prev[step.id] || {}),
        [card.id]: { ...(prev[step.id]?.[card.id] || {}), judge: judgeId, reason: judgeId === 'correct' ? undefined : (prev[step.id]?.[card.id]?.reason) }
      }
    }));
  };

  const setReason = (reasonId) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: {
        ...(prev[step.id] || {}),
        [card.id]: { ...(prev[step.id]?.[card.id] || {}), reason: reasonId }
      }
    }));
  };

  const canGoNext = cardAns.judge === 'correct' || (cardAns.judge === 'strange' && cardAns.reason);
  const isLast = currentIdx === total - 1;
  const allDone = judgedCount === total && cards.every(c => {
    const ca = ans[c.id] || {};
    return ca.judge === 'correct' || (ca.judge === 'strange' && ca.reason);
  });

  const judgeOptions = step.judgeOptions || [{ id: 'correct', label: '맞는 답' }, { id: 'strange', label: '이상한 답' }];
  const reasonOptions = step.reasonOptions || [];

  if (!card) return null;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        {cards.map((c, i) => {
          const ca = ans[c.id] || {};
          const done = ca.judge === 'correct' || (ca.judge === 'strange' && ca.reason);
          const isCurrent = i === currentIdx;
          return (
            <button
              key={c.id}
              onClick={() => setCurrentIdx(i)}
              style={{
                width: isCurrent ? '24px' : '10px',
                height: '10px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: done ? '#22c55e' : isCurrent ? domainColor : '#e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0
              }}
            />
          );
        })}
        <span style={{ marginLeft: '6px', fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', fontWeight: 700, color: '#94a3b8' }}>
          {currentIdx + 1} / {total}
        </span>
      </div>

      <div className="v3-card" style={{ padding: 'clamp(14px, 3.5vw, 20px)', marginBottom: 0, minHeight: '200px' }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          질문 {currentIdx + 1}
        </div>
        <div style={{ fontWeight: 800, fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: '#1e293b', marginBottom: '12px', wordBreak: 'keep-all', lineHeight: 1.4 }}>
          {card.question}
        </div>
        <div style={{ padding: '10px 14px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: 'clamp(0.85rem, 2.5vw, 0.92rem)', color: '#334155', marginBottom: '16px', lineHeight: 1.6, wordBreak: 'keep-all' }}>
          <span style={{ fontWeight: 700, color: '#94a3b8' }}>AI: </span>{card.answer}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: cardAns.judge === 'strange' ? '14px' : '0' }}>
          {judgeOptions.map(opt => {
            const isSelected = cardAns.judge === opt.id;
            const accent = opt.id === 'strange' ? '#ef4444' : '#22c55e';
            return (
              <button
                key={opt.id}
                onClick={() => setJudge(opt.id)}
                style={{
                  flex: 1,
                  padding: 'clamp(10px, 2.5vw, 13px)',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? accent : '#e2e8f0'}`,
                  backgroundColor: isSelected ? accent + '18' : '#f8fafc',
                  color: isSelected ? accent : '#64748b',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  wordBreak: 'keep-all'
                }}
              >
                {isSelected && '✓ '}{opt.label}
              </button>
            );
          })}
        </div>

        {cardAns.judge === 'strange' && (
          <div style={{ borderTop: '1.5px dashed #e2e8f0', paddingTop: '14px' }}>
            <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.77rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              STEP 2 · 왜 이상하다고 생각했나요?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reasonOptions.map(r => {
                const isSelected = cardAns.reason === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setReason(r.id)}
                    style={{
                      padding: 'clamp(8px, 2.2vw, 11px) clamp(12px, 3vw, 16px)',
                      borderRadius: '10px',
                      border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                      backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                      color: isSelected ? domainColor : '#475569',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.93rem)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      wordBreak: 'keep-all'
                    }}
                  >
                    {isSelected && '✓ '}{r.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {currentIdx > 0 && (
          <button
            onClick={() => setCurrentIdx(i => i - 1)}
            style={{
              flex: 1,
              padding: 'clamp(10px, 2.5vw, 13px)',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              color: '#64748b',
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 2.5vw, 0.93rem)',
              cursor: 'pointer'
            }}
          >
            ← 이전
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => { if (canGoNext) setCurrentIdx(i => i + 1); }}
            style={{
              flex: 2,
              padding: 'clamp(10px, 2.5vw, 13px)',
              borderRadius: '12px',
              border: `2px solid ${canGoNext ? domainColor : '#e2e8f0'}`,
              backgroundColor: canGoNext ? domainColor : '#f1f5f9',
              color: canGoNext ? '#fff' : '#94a3b8',
              fontWeight: 800,
              fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)',
              cursor: canGoNext ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s'
            }}
          >
            다음 →
          </button>
        )}
      </div>

      {allDone && (
        <div style={{ padding: 'clamp(10px, 3vw, 14px) 16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #bbf7d0', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', fontWeight: 800, color: '#16a34a', margin: 0 }}>
            {total}개 모두 확인 완료!
          </p>
        </div>
      )}
    </div>
  );
};
