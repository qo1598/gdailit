import React from 'react';
import { StepHeader, ChipGroup, BranchReferencePanel } from './shared';
import { deriveCases } from '../deriveCases';

// ─── per_case_judge ──────────────────────────────────────────────
export const PerCaseJudge = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const cases = deriveCases(step, gradeSpec, answers);

  const setField = (caseId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...answer, [caseId]: { ...(answer[caseId] || {}), [field]: value } }
    }));
  };
  const toggleMulti = (caseId, field, itemId) => {
    const current = answer[caseId]?.[field] || [];
    const next = current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId];
    setField(caseId, field, next);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <BranchReferencePanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />
      {cases.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>
          이전 단계에서 선택된 항목이 없어 정리할 사례가 없어요.
        </div>
      )}
      {cases.map(c => {
        const ca = answer[c.id] || {};
        const hasJudgment = !!ca.judgment;
        return (
          <div key={c.id} className="v3-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
            {c.image && (
              <img
                src={c.image}
                alt={c.title}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              />
            )}
            <div style={{ padding: 'clamp(12px, 3vw, 16px)' }}>
            <div style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', color: '#1e293b', marginBottom: c.description ? '6px' : '10px', wordBreak: 'keep-all' }}>
              {c.title}
            </div>
            {c.description && (
              <div style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', color: '#64748b', marginBottom: '12px', lineHeight: 1.55, wordBreak: 'keep-all' }}>
                {c.description}
              </div>
            )}
            {(c.userA || c.userB) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                {[c.userA, c.userB].filter(Boolean).map((user) => (
                  <div key={user.id} style={{
                    padding: 'clamp(8px, 2vw, 11px)',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #e2e8f0'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', color: '#1e293b', marginBottom: '4px' }}>
                      {user.label}
                    </div>
                    <div style={{ fontSize: 'clamp(0.75rem, 2.1vw, 0.82rem)', color: '#64748b', lineHeight: 1.45, wordBreak: 'keep-all' }}>
                      {user.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {step.judgmentOptions && step.judgmentLabel && (
              <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {step.judgmentLabel}
              </div>
            )}
            {step.judgmentOptions && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: hasJudgment && (step.reasonOptions || step.planOptions || step.allowText) ? '12px' : '0' }}>
              {step.judgmentOptions.map(opt => {
                const isSelected = ca.judgment === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setField(c.id, 'judgment', opt.id)}
                    style={{
                      flex: 1,
                      padding: 'clamp(8px, 2vw, 11px)',
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
                    {opt.label}
                  </button>
                );
              })}
            </div>
            )}
            {step.reasonOptions && (hasJudgment || step.reasonAlwaysVisible) && (
              <ChipGroup
                label={step.reasonLabel || "이유"}
                options={step.reasonOptions}
                selected={step.reasonMulti ? (ca.reasons || []) : (ca.reason ? [ca.reason] : [])}
                onToggle={(id) => {
                  if (step.reasonMulti) toggleMulti(c.id, 'reasons', id);
                  else setField(c.id, 'reason', id);
                }}
                domainColor={domainColor}
              />
            )}
            {step.planOptions && (hasJudgment || step.planAlwaysVisible) &&
              (!step.planShowForJudgments || step.planShowForJudgments.includes(ca.judgment)) && (
              <ChipGroup
                label={step.planLabel || "어떻게 할까요?"}
                options={step.planOptions}
                selected={step.planMulti ? (ca.plans || []) : (ca.plan ? [ca.plan] : [])}
                onToggle={(id) => {
                  if (step.planMulti) toggleMulti(c.id, 'plans', id);
                  else setField(c.id, 'plan', ca.plan === id ? null : id);
                }}
                domainColor="#0ea5e9"
                style={{ marginTop: '10px' }}
              />
            )}
            {step.limitationOptions && hasJudgment &&
              (!step.limitationShowForJudgments || step.limitationShowForJudgments.includes(ca.judgment)) && (
              <ChipGroup
                label={step.limitationLabel || "아쉬운 점은?"}
                options={step.limitationOptions}
                selected={step.limitationMulti ? (ca.limitations || []) : (ca.limitation ? [ca.limitation] : [])}
                onToggle={(id) => {
                  if (step.limitationMulti) toggleMulti(c.id, 'limitations', id);
                  else setField(c.id, 'limitation', ca.limitation === id ? null : id);
                }}
                domainColor="#ef4444"
                style={{ marginTop: '10px' }}
              />
            )}
            {step.allowText && hasJudgment && (
              <div style={{ marginTop: '12px' }}>
                <textarea
                  placeholder={step.textPlaceholder || '왜 그렇게 생각했는지 짧게 적어보세요.'}
                  value={ca.text || ''}
                  onChange={e => setField(c.id, 'text', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `2px solid ${ca.text?.trim() ? '#94a3b8' : '#e2e8f0'}`,
                    fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    lineHeight: 1.5
                  }}
                  rows={3}
                />
              </div>
            )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── case_info_cards ─────────────────────────────────────────────
export const CaseInfoCards = ({ step, domainColor, hint, onHintClick }) => (
  <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
    <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
    {(step.cases || []).map((c, idx) => (
      <div key={c.id} className="v3-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
        {c.image && (
          <img src={c.image} alt={c.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
        )}
        <div style={{ padding: 'clamp(12px, 3vw, 16px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: domainColor, color: '#fff', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>
              사례 {idx + 1}
            </span>
            <span style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', color: '#1e293b', wordBreak: 'keep-all' }}>
              {c.title}
            </span>
          </div>
          <div style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', color: '#475569', lineHeight: 1.65, wordBreak: 'keep-all' }}>
            {c.description}
          </div>
          {c.note && (
            <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1.5px solid #86efac', fontSize: 'clamp(0.78rem, 2.2vw, 0.84rem)', color: '#15803d', fontWeight: 700, wordBreak: 'keep-all' }}>
              {c.note}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ─── chat_display ───────────────────────────────────────────────
export const ChatDisplay = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const confirmed = answers[step.id]?.confirmed;
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <div className="v3-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {step.chatMessages.map((msg) => {
          const isStudent = msg.role === 'student';
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isStudent ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: isStudent ? '#dbeafe' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(0.65rem, 2vw, 0.72rem)', fontWeight: 900,
                color: isStudent ? '#1d4ed8' : '#64748b'
              }}>
                {isStudent ? '나' : 'AI'}
              </div>
              <div style={{
                maxWidth: '78%',
                padding: 'clamp(8px, 2.5vw, 11px) clamp(11px, 3vw, 15px)',
                borderRadius: isStudent ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                backgroundColor: isStudent ? '#dbeafe' : '#f1f5f9',
                border: `1.5px solid ${isStudent ? '#93c5fd' : '#e2e8f0'}`,
                fontSize: 'clamp(0.83rem, 2.4vw, 0.92rem)',
                color: '#1e293b',
                lineHeight: 1.6,
                wordBreak: 'keep-all'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        padding: 'clamp(10px, 2.5vw, 13px) 14px',
        backgroundColor: '#fef9c3',
        borderRadius: '12px',
        border: '1.5px solid #fde047',
        fontSize: 'clamp(0.78rem, 2.3vw, 0.86rem)',
        color: '#92400e',
        fontWeight: 700,
        lineHeight: 1.5
      }}>
        AI의 답변 중 사실과 다른 내용이 섞여 있을 수 있어요. 주의 깊게 읽어보세요!
      </div>
      {!confirmed ? (
        <button
          onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true } }))}
          style={{
            padding: 'clamp(10px, 3vw, 14px)',
            borderRadius: '14px',
            border: `2px solid ${domainColor}`,
            backgroundColor: '#fff',
            color: domainColor,
            fontWeight: 800,
            fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            wordBreak: 'keep-all',
            width: '100%'
          }}
        >
          다 읽었어요!
        </button>
      ) : (
        <div style={{
          padding: 'clamp(10px, 3vw, 14px)',
          borderRadius: '14px',
          backgroundColor: domainColor + '14',
          border: `2px solid ${domainColor}`,
          textAlign: 'center',
          fontWeight: 800,
          color: domainColor,
          fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)'
        }}>
          ✓ 대화 내용을 확인했어요
        </div>
      )}
    </div>
  );
};

// ─── bubble_select_correct ───────────────────────────────────────
export const BubbleSelectCorrect = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const toggleBubble = (bubbleId) => {
    const current = answer[bubbleId] || {};
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...answer, [bubbleId]: { ...current, selected: !current.selected, reason: undefined, correction: undefined } }
    }));
  };
  const setField = (bubbleId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...answer, [bubbleId]: { ...(answer[bubbleId] || {}), [field]: value } }
    }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      {step.aiBubbles.map(bubble => {
        const ba = answer[bubble.id] || {};
        const isSelected = !!ba.selected;
        return (
          <div key={bubble.id} className="v3-card" style={{
            marginBottom: 0,
            border: isSelected ? '2px solid #ef4444' : undefined
          }}>
            {bubble.context && (
              <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.76rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', letterSpacing: '0.04em' }}>
                Q: {bubble.context}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', fontWeight: 800, color: '#64748b'
              }}>
                AI
              </div>
              <div style={{
                flex: 1, padding: '9px 12px', borderRadius: '4px 12px 12px 12px',
                backgroundColor: isSelected ? '#fef2f2' : '#f1f5f9',
                border: `1.5px solid ${isSelected ? '#fca5a5' : '#e2e8f0'}`,
                fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', color: '#334155',
                lineHeight: 1.6, wordBreak: 'keep-all'
              }}>
                {bubble.text}
              </div>
            </div>
            <button
              onClick={() => toggleBubble(bubble.id)}
              style={{
                width: '100%', padding: 'clamp(7px, 2vw, 10px)',
                borderRadius: '10px',
                border: `2px solid ${isSelected ? '#ef4444' : '#e2e8f0'}`,
                backgroundColor: isSelected ? '#fef2f2' : '#f8fafc',
                color: isSelected ? '#ef4444' : '#94a3b8',
                fontWeight: 800, fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)',
                cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all'
              }}
            >
              {isSelected ? '✓ 틀린 답으로 선택됨 (취소하려면 다시 누르세요)' : '이 답이 틀린 것 같아요'}
            </button>
            {isSelected && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <ChipGroup
                  label="틀린 이유"
                  options={step.reasonOptions}
                  selected={ba.reason ? [ba.reason] : []}
                  onToggle={(id) => setField(bubble.id, 'reason', id)}
                  domainColor="#ef4444"
                />
                {bubble.correctionOptions && (
                  <ChipGroup
                    label="바른 내용은?"
                    options={bubble.correctionOptions}
                    selected={ba.correction ? [ba.correction] : []}
                    onToggle={(id) => setField(bubble.id, 'correction', id)}
                    domainColor={domainColor}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── match_select ────────────────────────────────────────────────
export const MatchSelect = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const setMatch = (recId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...answer, [recId]: { ...(answer[recId] || {}), [field]: value } }
    }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <div className="v3-card" style={{ marginBottom: 0, backgroundColor: '#f8fafc' }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          내가 전에 본 것들
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {step.historyCards.map(h => (
            <span key={h.id} style={{
              padding: '6px 14px',
              backgroundColor: '#e2e8f0',
              borderRadius: '999px',
              fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
              fontWeight: 700,
              color: '#475569'
            }}>
              {h.label}
            </span>
          ))}
        </div>
      </div>
      {step.recommendations.map(rec => {
        const ra = answer[rec.id] || {};
        return (
          <div key={rec.id} className="v3-card" style={{ marginBottom: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 'clamp(0.92rem, 2.8vw, 1rem)', color: '#1e293b', marginBottom: rec.description ? '4px' : '10px', wordBreak: 'keep-all' }}>
              추천: {rec.label}
            </div>
            {rec.description && (
              <div style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', color: '#64748b', marginBottom: '10px', wordBreak: 'keep-all' }}>
                {rec.description}
              </div>
            )}
            <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              어떤 것 때문에 추천됐을까요?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: step.reasonOptions ? '12px' : '0' }}>
              {step.historyCards.map(h => {
                const isSelected = ra.history_id === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setMatch(rec.id, 'history_id', h.id)}
                    style={{
                      padding: 'clamp(7px, 2vw, 9px) clamp(12px, 3vw, 16px)',
                      borderRadius: '999px',
                      border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                      backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                      color: isSelected ? domainColor : '#64748b',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      wordBreak: 'keep-all'
                    }}
                  >
                    {isSelected && '✓ '}{h.label}
                  </button>
                );
              })}
            </div>
            {step.reasonOptions && ra.history_id && (
              <ChipGroup
                label="이유"
                options={step.reasonOptions}
                selected={ra.reason_tag ? [ra.reason_tag] : []}
                onToggle={(id) => setMatch(rec.id, 'reason_tag', id)}
                domainColor={domainColor}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
