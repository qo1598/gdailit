import React from 'react';
import { Lightbulb } from 'lucide-react';

/**
 * SJRenderer - Statement & Judgement type UI.
 * Handles uiModes:
 *   classify_cards      — 카드별 그룹 분류 (AI/비AI 등)
 *   multi_select_chips  — 다중 선택 칩
 *   per_case_judge      — 사례별 판단 + 이유 + 선택적 계획/텍스트
 *   per_card_tags       — QA 카드별 태그 선택 (문제점 + 대처)
 *   match_select        — 추천-이전기록 매칭 + 이유
 */
const SJRenderer = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {

  // ─── classify_cards ─────────────────────────────────────────────
  if (step.uiMode === 'classify_cards') {
    const answer = answers[step.id] || {};

    const classify = (cardId, groupId) => {
      setAnswers(prev => ({
        ...prev,
        [step.id]: { ...answer, [cardId]: groupId }
      }));
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
  }

  // ─── multi_select_chips ──────────────────────────────────────────
  if (step.uiMode === 'multi_select_chips') {
    const selected = answers[step.id] || [];

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
          {selected.length > 0 && (
            <div style={{ marginTop: '12px', padding: '8px 14px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {selected.length}개 선택됨
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── per_case_judge ──────────────────────────────────────────────
  // step.cases: [{ id, title, description }]
  // step.judgmentOptions: [{ id, label }]
  // step.reasonOptions?: [{ id, label }]  (multi-select if reasonMulti)
  // step.planOptions?: [{ id, label }]    (single or multi if planMulti)
  // step.allowText?: boolean
  if (step.uiMode === 'per_case_judge') {
    const answer = answers[step.id] || {};

    const setField = (caseId, field, value) => {
      setAnswers(prev => ({
        ...prev,
        [step.id]: { ...answer, [caseId]: { ...(answer[caseId] || {}), [field]: value } }
      }));
    };

    const toggleMulti = (caseId, field, itemId) => {
      const current = answer[caseId]?.[field] || [];
      const next = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      setField(caseId, field, next);
    };

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        {step.cases.map(c => {
          const ca = answer[c.id] || {};
          const hasJudgment = !!ca.judgment;

          return (
            <div key={c.id} className="v3-card" style={{ marginBottom: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', color: '#1e293b', marginBottom: c.description ? '6px' : '10px', wordBreak: 'keep-all' }}>
                {c.title}
              </div>
              {c.description && (
                <div style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', color: '#64748b', marginBottom: '12px', lineHeight: 1.55, wordBreak: 'keep-all' }}>
                  {c.description}
                </div>
              )}

              {/* Judgment buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: hasJudgment && (step.reasonOptions || step.planOptions || step.allowText) ? '12px' : '0' }}>
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

              {/* Reason chips — appear after judgment */}
              {step.reasonOptions && hasJudgment && (
                <ChipGroup
                  label="이유"
                  options={step.reasonOptions}
                  selected={step.reasonMulti ? (ca.reasons || []) : (ca.reason ? [ca.reason] : [])}
                  onToggle={(id) => {
                    if (step.reasonMulti) toggleMulti(c.id, 'reasons', id);
                    else setField(c.id, 'reason', id);
                  }}
                  domainColor={domainColor}
                />
              )}

              {/* Plan chips — appear after judgment */}
              {step.planOptions && hasJudgment && (
                <ChipGroup
                  label="어떻게 할까요?"
                  options={step.planOptions}
                  selected={step.planMulti ? (ca.plans || []) : (ca.plan ? [ca.plan] : [])}
                  onToggle={(id) => {
                    if (step.planMulti) toggleMulti(c.id, 'plans', id);
                    else setField(c.id, 'plan', id);
                  }}
                  domainColor="#0ea5e9"
                  style={{ marginTop: '10px' }}
                />
              )}

              {/* Short text */}
              {step.allowText && (
                <div style={{ marginTop: '12px' }}>
                  <textarea
                    placeholder="왜 그렇게 생각했는지 짧게 적어보세요. (선택)"
                    value={ca.text || ''}
                    onChange={e => setField(c.id, 'text', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
                      resize: 'none',
                      outline: 'none',
                      fontFamily: 'inherit',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                      lineHeight: 1.5
                    }}
                    rows={2}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ─── per_card_tags ───────────────────────────────────────────────
  // E-2-M: each QA card → problem_tag + response_action
  // step.cards: [{ id, question, answer }]
  // step.problemOptions: [{ id, label }]
  // step.actionOptions: [{ id, label }]
  if (step.uiMode === 'per_card_tags') {
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
  }

  // ─── match_select ────────────────────────────────────────────────
  // E-3-M: match recommendations to history cards + select reason
  // step.historyCards: [{ id, label }]
  // step.recommendations: [{ id, label, description? }]
  // step.reasonOptions?: [{ id, label }]
  if (step.uiMode === 'match_select') {
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

        {/* History reference bar */}
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

        {/* Recommendation cards to match */}
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
  }

  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 SJ UI 유형: {step.uiMode}
    </div>
  );
};

// ─── Shared Sub-components ───────────────────────────────────────

const StepHeader = ({ step, domainColor, hint, onHintClick }) => (
  <div className="v3-card" style={{ marginBottom: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <span style={{ width: 'clamp(12px, 3vw, 16px)', height: '4px', borderRadius: '999px', backgroundColor: domainColor, flexShrink: 0 }} />
      <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {step.title}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 900, color: '#1e293b', lineHeight: 1.3, margin: 0, wordBreak: 'keep-all', flex: 1 }}>
        {step.question}
      </h3>
      {hint && (
        <button
          onClick={onHintClick}
          title="힌트 보기"
          style={{
            flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: '#fef9c3', border: '2px solid #fde047',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.15s, background-color 0.15s', marginTop: '2px'
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef08a'; e.currentTarget.style.transform = 'scale(1.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fef9c3'; e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(1.12)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Lightbulb size={18} color="#ca8a04" strokeWidth={2.2} />
        </button>
      )}
    </div>
  </div>
);

const ChipGroup = ({ label, options, selected, onToggle, domainColor, style = {} }) => (
  <div style={style}>
    <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            style={{
              padding: 'clamp(7px, 2vw, 9px) clamp(12px, 3vw, 16px)',
              borderRadius: '999px',
              border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
              backgroundColor: isSelected ? domainColor : '#f8fafc',
              color: isSelected ? '#fff' : '#64748b',
              fontWeight: isSelected ? 800 : 600,
              fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              wordBreak: 'keep-all'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default SJRenderer;
