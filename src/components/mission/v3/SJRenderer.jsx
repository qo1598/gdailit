import React, { useState } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // ─── classify_cards_carousel ────────────────────────────────────
  if (step.uiMode === 'classify_cards_carousel') {
    return <ClassifyCarousel step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
  }

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

  // ─── chat_display ───────────────────────────────────────────────
  // step.chatMessages: [{ id, role: 'student'|'ai', aiId?, text }]
  if (step.uiMode === 'chat_display') {
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
  }

  // ─── bubble_select_correct ───────────────────────────────────────
  // step.aiBubbles: [{ id, context?, text, correctionOptions?: [{ id, label }] }]
  // step.reasonOptions: [{ id, label }]
  if (step.uiMode === 'bubble_select_correct') {
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

// ─── ClassifyCarousel ────────────────────────────────────────────
const ClassifyCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const cards = step.cards;
  const total = cards.length;
  const classified = Object.keys(answer).length;

  // Start at first unclassified card
  const firstUnclassified = cards.findIndex(c => !answer[c.id]);
  const [index, setIndex] = useState(firstUnclassified === -1 ? 0 : firstUnclassified);

  const card = cards[index];
  const selected = answer[card.id];

  const classify = (groupId) => {
    const next = { ...answer, [card.id]: groupId };
    setAnswers(prev => ({ ...prev, [step.id]: next }));
    // Auto-advance to next unclassified
    const nextUnclassified = cards.findIndex((c, i) => i !== index && !next[c.id]);
    if (nextUnclassified !== -1) {
      setTimeout(() => setIndex(nextUnclassified), 300);
    }
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* Card */}
      <div className="v3-card" style={{ marginBottom: 0, padding: 'clamp(20px, 5vw, 28px) clamp(16px, 4vw, 24px)' }}>
        {/* Index indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {cards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setIndex(i)}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  border: 'none', cursor: 'pointer', padding: 0,
                  backgroundColor: answer[c.id]
                    ? domainColor
                    : i === index ? '#94a3b8' : '#e2e8f0',
                  transition: 'background-color 0.15s'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.85rem)', fontWeight: 700, color: '#94a3b8' }}>
            {index + 1} / {total}
          </span>
        </div>

        {/* Product image area */}
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

        {/* Classification buttons */}
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

      {/* Navigation */}
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
