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
const SJRenderer = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {

  // ─── sample_full_carousel ────────────────────────────────────────
  if (step.uiMode === 'sample_full_carousel') {
    return <SampleFullCarousel step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
  }

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

  // ─── clothing_grid_with_rec ──────────────────────────────────────
  // E-3-M STEP1: AI 추천 TOP3 (초기) + 전체 20개 4열 그리드
  if (step.uiMode === 'clothing_grid_with_rec') {
    const confirmed = answers[step.id]?.confirmed;
    const items = gradeSpec?.clothingItems || [];
    const initialRecIds = step.initialRecommendedIds || items.slice(0, 3).map(i => i.id);
    const initialRecItems = initialRecIds.map(id => items.find(i => i.id === id)).filter(Boolean);

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        {/* AI 추천 TOP 3 */}
        <div style={{ backgroundColor: domainColor + '10', borderRadius: '14px', padding: 'clamp(12px, 3vw, 16px)', border: `2px solid ${domainColor}30` }}>
          <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 900, color: domainColor, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI 추천 TOP 3
          </div>
          <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.8rem)', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', wordBreak: 'keep-all' }}>
            아직 취향 정보가 없어서 임의로 추천했어요. 별점을 주면 바뀔 거예요!
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {initialRecItems.map(item => <ClothingItemCard key={item.id} item={item} domainColor={domainColor} compact />)}
          </div>
        </div>

        {/* 전체 20개 그리드 (4열) */}
        <div>
          <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 900, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            전체 상품 (20개)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px, 1.5vw, 10px)' }}>
            {items.map(item => <ClothingItemCard key={item.id} item={item} domainColor={domainColor} compact />)}
          </div>
        </div>

        {!confirmed ? (
          <button
            onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true } }))}
            style={{
              padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
              border: `2px solid ${domainColor}`, backgroundColor: '#fff', color: domainColor,
              fontWeight: 800, fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)', cursor: 'pointer', width: '100%'
            }}
          >
            다 봤어요!
          </button>
        ) : (
          <div style={{
            padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
            backgroundColor: domainColor + '14', border: `2px solid ${domainColor}`,
            textAlign: 'center', fontWeight: 800, color: domainColor,
            fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)'
          }}>
            ✓ 옷 20개를 모두 확인했어요
          </div>
        )}
      </div>
    );
  }

  // ─── star_rating_carousel ─────────────────────────────────────────
  // E-3-M STEP2: 캐러셀로 옷 1개씩 + 별점 + 실시간 취향
  if (step.uiMode === 'star_rating_carousel') {
    const ratings = answers[step.id] || {};
    const items = gradeSpec?.clothingItems || [];
    const rules = gradeSpec?.recommendationRules || {};
    const total = items.length;
    const ratedCount = Object.keys(ratings).length;
    const minRated = step.validation?.minRated || 10;

    const firstUnrated = items.findIndex(i => !ratings[i.id]);
    const [carouselIndex, setCarouselIndex] = useState(firstUnrated === -1 ? 0 : firstUnrated);
    const safeIndex = Math.min(carouselIndex, total - 1);
    const item = items[safeIndex];
    const currentRating = item ? (ratings[item.id] || 0) : 0;

    const setRating = (itemId, val) => {
      setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [itemId]: val } }));
    };

    const topPrefs = computeClothingTopPrefs(ratings, items);

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        {/* 진행 도트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '72%' }}>
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => setCarouselIndex(i)}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  border: 'none', cursor: 'pointer', padding: 0,
                  backgroundColor: ratings[it.id] ? '#f59e0b' : i === safeIndex ? domainColor : '#e2e8f0',
                  transition: 'all 0.15s'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: ratedCount >= minRated ? '#16a34a' : '#94a3b8' }}>
            {ratedCount} / {total}개
          </span>
        </div>

        {/* 옷 카드 */}
        {item && (
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px',
            border: `2px solid ${currentRating ? domainColor + '50' : '#e2e8f0'}`,
            overflow: 'hidden'
          }}>
            {/* 이미지 */}
            <div style={{
              width: '100%', height: 'clamp(150px, 38vw, 190px)',
              backgroundColor: item.colorHex ? `${item.colorHex}22` : '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ClothingIllustration type={getClothingType(item.tags)} colorHex={item.colorHex} size={90} />
            </div>
            {/* 정보 + 별점 */}
            <div style={{ padding: 'clamp(14px, 3.5vw, 18px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: 'clamp(1rem, 3.2vw, 1.15rem)', fontWeight: 900, color: '#1e293b', textAlign: 'center' }}>
                {item.name}
              </div>
              <div style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em' }}>
                {item.tags.map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
              </div>
              {/* 별점 */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(item.id, star)}
                    style={{
                      width: 'clamp(34px, 8.5vw, 42px)', height: 'clamp(34px, 8.5vw, 42px)',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 'clamp(22px, 5.5vw, 28px)', padding: 0,
                      color: star <= currentRating ? '#f59e0b' : '#e2e8f0',
                      transition: 'color 0.1s, transform 0.1s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#f59e0b'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = star <= currentRating ? '#f59e0b' : '#e2e8f0'; }}
                  >
                    ★
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <div style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', fontWeight: 700, color: domainColor }}>
                  {currentRating}점
                </div>
              )}
            </div>
          </div>
        )}

        {/* 이전 / 다음 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
            disabled={safeIndex === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '12px',
              border: '2px solid #e2e8f0', backgroundColor: '#f8fafc',
              color: safeIndex === 0 ? '#cbd5e1' : '#475569',
              fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
              cursor: safeIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} /> 이전
          </button>
          <button
            onClick={() => setCarouselIndex(i => Math.min(total - 1, i + 1))}
            disabled={safeIndex === total - 1}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '12px',
              border: `2px solid ${safeIndex < total - 1 ? domainColor : '#e2e8f0'}`,
              backgroundColor: safeIndex < total - 1 ? domainColor + '18' : '#f8fafc',
              color: safeIndex < total - 1 ? domainColor : '#cbd5e1',
              fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
              cursor: safeIndex < total - 1 ? 'pointer' : 'not-allowed'
            }}
          >
            다음 <ChevronRight size={16} />
          </button>
        </div>

        {/* 실시간 취향 */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 14px) 14px', backgroundColor: '#f8fafc',
          borderRadius: '12px', border: `2px solid ${topPrefs.length > 0 ? domainColor + '40' : '#e2e8f0'}`
        }}>
          <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            사용자의 취향
          </div>
          {topPrefs.length > 0 ? (
            <div style={{ fontSize: 'clamp(0.9rem, 2.7vw, 1rem)', fontWeight: 800, color: domainColor, wordBreak: 'keep-all' }}>
              {topPrefs.slice(0, 3).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
            </div>
          ) : (
            <div style={{ fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)', color: '#94a3b8', fontWeight: 600 }}>
              별점 4~5점 준 옷이 생기면 취향이 나타나요!
            </div>
          )}
        </div>

        {/* 평가 진행 현황 */}
        <div style={{
          padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
          border: `2px dashed ${ratedCount >= minRated ? '#22c55e' : '#e2e8f0'}`,
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 'clamp(0.78rem, 2.3vw, 0.86rem)', fontWeight: 700, margin: 0, color: ratedCount >= minRated ? '#16a34a' : '#94a3b8' }}>
            {ratedCount >= minRated
              ? `${ratedCount}개 평가 완료! 다음 단계로 넘어갈 수 있어요.`
              : `${minRated}개 이상 평가해야 해요 (현재 ${ratedCount}개)`}
          </p>
        </div>
      </div>
    );
  }

  // ─── recommendation_grid ──────────────────────────────────────────
  // E-3-M STEP3: AI 추천 TOP3 그리드 (질문 없음)
  if (step.uiMode === 'recommendation_grid') {
    const confirmed = answers[step.id]?.confirmed;
    const ratings = answers['step2'] || {};
    const items = gradeSpec?.clothingItems || [];
    const rules = gradeSpec?.recommendationRules || {};
    const count = step.recommendationCount || 3;

    const topPrefs = computeClothingTopPrefs(ratings, items);
    const recIds = computeClothingRecommendations(ratings, items, rules, count);
    const recItems = recIds.map(id => items.find(i => i.id === id)).filter(Boolean);

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        {/* 분석된 취향 */}
        {topPrefs.length > 0 && (
          <div style={{ padding: '12px 16px', backgroundColor: domainColor + '10', borderRadius: '12px', border: `1.5px solid ${domainColor}30` }}>
            <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              분석된 취향
            </div>
            <div style={{ fontSize: 'clamp(0.92rem, 2.8vw, 1.02rem)', fontWeight: 800, color: domainColor, wordBreak: 'keep-all' }}>
              {topPrefs.slice(0, 3).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
            </div>
          </div>
        )}

        {/* TOP 3 추천 그리드 */}
        <div>
          <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 900, color: domainColor, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI 추천 TOP 3
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(8px, 2vw, 12px)' }}>
            {recItems.map((item, idx) => (
              <div key={item.id} style={{
                backgroundColor: '#fff', borderRadius: '14px', border: `2px solid ${domainColor}40`,
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    height: 'clamp(80px, 20vw, 100px)',
                    backgroundColor: item.colorHex ? `${item.colorHex}22` : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ClothingIllustration type={getClothingType(item.tags)} colorHex={item.colorHex} size={56} />
                  </div>
                  <div style={{
                    position: 'absolute', top: '6px', left: '6px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    backgroundColor: domainColor, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.68rem', fontWeight: 900
                  }}>
                    {idx + 1}
                  </div>
                </div>
                <div style={{ padding: 'clamp(7px, 1.8vw, 10px)' }}>
                  <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.78rem)', fontWeight: 800, color: '#1e293b', marginBottom: '3px', lineHeight: 1.3, wordBreak: 'keep-all' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 'clamp(0.55rem, 1.4vw, 0.62rem)', color: '#94a3b8', fontWeight: 600 }}>
                    {item.tags.slice(0, 2).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!confirmed ? (
          <button
            onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true, topPrefs, recommendedIds: recIds } }))}
            style={{
              padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
              border: `2px solid ${domainColor}`, backgroundColor: '#fff', color: domainColor,
              fontWeight: 800, fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)', cursor: 'pointer', width: '100%'
            }}
          >
            추천 결과를 확인했어요!
          </button>
        ) : (
          <div style={{
            padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
            backgroundColor: domainColor + '14', border: `2px solid ${domainColor}`,
            textAlign: 'center', fontWeight: 800, color: domainColor,
            fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)'
          }}>
            ✓ 추천 결과를 확인했어요
          </div>
        )}
      </div>
    );
  }

  // ─── multi_free_text ──────────────────────────────────────────────
  // E-3-M STEP4: 주관식 질문 여러 개
  if (step.uiMode === 'multi_free_text') {
    const answer = answers[step.id] || {};
    const questions = step.questions || [];
    const placeholders = step.placeholders || [];
    const answeredCount = questions.filter(q => answer[q.id]?.trim()).length;

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

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
              rows={3}
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
  }

  // ─── monitor_display ────────────────────────────────────────────
  if (step.uiMode === 'monitor_display') {
    return <MonitorCarousel step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
  }

  // ─── per_response_judge ──────────────────────────────────────────
  if (step.uiMode === 'per_response_judge') {
    return <PerResponseJudgeCarousel step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
  }

  // ─── filtered_reason_select ──────────────────────────────────────
  if (step.uiMode === 'filtered_reason_select') {
    return <FilteredReasonCarousel step={step} gradeSpec={gradeSpec} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
  }

  // ─── filtered_plan_text ──────────────────────────────────────────
  if (step.uiMode === 'filtered_plan_text') {
    return <FilteredPlanCarousel step={step} gradeSpec={gradeSpec} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
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

// ─── SampleFullCarousel ──────────────────────────────────────────
// E-2-H: one sample at a time — read → judge → reason → plan
const SampleFullCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const samples = step.samples || [];
  const total = samples.length;
  const answer = answers[step.id] || {};

  const [index, setIndex] = useState(0);
  const sample = samples[index];
  const sampleAns = answer[sample.id] || {};

  const setField = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: {
        ...(prev[step.id] || {}),
        [sample.id]: { ...(prev[step.id]?.[sample.id] || {}), [field]: value }
      }
    }));
  };

  const isSampleComplete = (sa) => {
    if (!sa.judgment) return false;
    if (sa.judgment !== 'use') {
      if (!sa.reason) return false;
      if (sa.reason === 'other' && !sa.reason_other?.trim()) return false;
      if (!sa.plan?.trim()) return false;
    }
    return true;
  };

  const canAdvance = isSampleComplete(sampleAns);
  const completedCount = samples.filter(s => isSampleComplete(answer[s.id] || {})).length;
  const judgmentColors = { use: '#22c55e', revise: '#f59e0b', verify: '#3b82f6' };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {samples.map((s, i) => {
            const isDone = isSampleComplete(answer[s.id] || {});
            return (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? '20px' : '10px',
                  height: '10px', borderRadius: '999px',
                  border: 'none', cursor: 'pointer', padding: 0,
                  backgroundColor: isDone ? '#22c55e' : i === index ? domainColor : '#e2e8f0',
                  transition: 'all 0.2s'
                }}
              />
            );
          })}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: '#94a3b8' }}>
          {index + 1} / {total}
        </span>
      </div>

      {/* Monitor-style sample display */}
      <div style={{ background: '#0f172a', borderRadius: '16px', overflow: 'hidden', border: '2px solid #334155', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />
          ))}
          <span style={{ marginLeft: '8px', fontSize: 'clamp(0.7rem, 2vw, 0.78rem)', color: '#64748b', fontWeight: 700 }}>
            AI 응답 {index + 1}
          </span>
        </div>
        <div style={{ padding: 'clamp(12px, 3vw, 16px)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '80%', padding: '9px 13px', backgroundColor: '#3b82f6', borderRadius: '14px 4px 14px 14px', fontSize: 'clamp(0.82rem, 2.4vw, 0.92rem)', color: '#fff', fontWeight: 700, lineHeight: 1.5, wordBreak: 'keep-all' }}>
              {sample.prompt}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0, backgroundColor: '#22c55e20', border: '1.5px solid #22c55e40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.6rem, 1.7vw, 0.68rem)', fontWeight: 900, color: '#22c55e' }}>
              AI
            </div>
            <div style={{ flex: 1, padding: '9px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px 14px 14px 14px', fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)', color: '#cbd5e1', lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {sample.response}
            </div>
          </div>
        </div>
      </div>

      {/* Judgment buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          이 답변을 어떻게 처리할까요?
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(step.judgmentOptions || []).map(opt => {
            const isSelected = sampleAns.judgment === opt.id;
            const accent = judgmentColors[opt.id] || domainColor;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (opt.id === 'use') {
                    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [sample.id]: { judgment: 'use' } } }));
                  } else {
                    setField('judgment', opt.id);
                  }
                }}
                style={{
                  flex: 1, padding: 'clamp(10px, 2.5vw, 13px) clamp(4px, 1vw, 8px)',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? accent : '#e2e8f0'}`,
                  backgroundColor: isSelected ? accent + '18' : '#f8fafc',
                  color: isSelected ? accent : '#64748b',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  wordBreak: 'keep-all', textAlign: 'center'
                }}
              >
                {isSelected && '✓ '}{opt.label}
                {opt.desc && <div style={{ fontSize: 'clamp(0.6rem, 1.6vw, 0.68rem)', opacity: 0.8, marginTop: '2px' }}>{opt.desc}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reason + Plan — only when judgment is not 'use' */}
      {sampleAns.judgment && sampleAns.judgment !== 'use' && (
        <>
          <div className="v3-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              이유가 뭔가요?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(step.reasonOptions || []).map(r => {
                const isSelected = sampleAns.reason === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setField('reason', r.id)}
                    style={{
                      padding: 'clamp(9px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                      borderRadius: '10px',
                      border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                      backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                      color: isSelected ? domainColor : '#475569',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.93rem)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s', wordBreak: 'keep-all'
                    }}
                  >
                    {isSelected && '✓ '}{r.label}
                  </button>
                );
              })}
            </div>
            {sampleAns.reason === 'other' && (
              <input
                type="text"
                placeholder="이유를 직접 써보세요..."
                value={sampleAns.reason_other || ''}
                onChange={(e) => setField('reason_other', e.target.value)}
                autoFocus
                maxLength={50}
                style={{
                  width: '100%', padding: 'clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 16px)',
                  border: `2px solid ${domainColor}`, borderRadius: '10px',
                  fontSize: 'clamp(0.88rem, 2.6vw, 0.96rem)', fontWeight: 700,
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                  color: '#1e293b', backgroundColor: 'white'
                }}
              />
            )}
          </div>

          <div className="v3-card" style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              어떻게 처리할 계획인가요?
            </div>
            <textarea
              placeholder={step.placeholder || '어떻게 수정하거나 다시 확인할지 계획을 써보세요.'}
              value={sampleAns.plan || ''}
              onChange={e => setField('plan', e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: `2px solid ${sampleAns.plan?.trim() ? domainColor : '#e2e8f0'}`,
                fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
                outline: 'none', fontFamily: 'inherit', color: '#1e293b',
                boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s'
              }}
            />
          </div>
        </>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
          backgroundColor: completedCount === total ? '#dcfce7' : '#f8fafc',
          borderRadius: '12px',
          border: `2px dashed ${completedCount === total ? '#22c55e' : canAdvance ? domainColor : '#e2e8f0'}`,
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700, color: completedCount === total ? '#16a34a' : canAdvance ? domainColor : '#94a3b8', margin: 0 }}>
            {completedCount === total ? `${total}개 모두 완료!` : `${completedCount} / ${total}개 완료`}
          </p>
        </div>

        <button
          onClick={() => { if (canAdvance && index < total - 1) setIndex(prev => prev + 1); }}
          disabled={!canAdvance || index === total - 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: `2px solid ${canAdvance && index < total - 1 ? domainColor : '#e2e8f0'}`,
            backgroundColor: canAdvance && index < total - 1 ? domainColor + '18' : '#f8fafc',
            color: canAdvance && index < total - 1 ? domainColor : '#cbd5e1',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: canAdvance && index < total - 1 ? 'pointer' : 'not-allowed'
          }}
        >
          다음 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── MonitorCarousel ─────────────────────────────────────────────
// STEP1: 샘플 1개씩 캐러셀로 읽기
const MonitorCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const samples = step.samples || [];
  const total = samples.length;
  const [index, setIndex] = useState(0);
  const confirmed = answers[step.id]?.confirmed;
  const sample = samples[index];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 진행 점 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {samples.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)} style={{ width: i === index ? '20px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0, backgroundColor: i === index ? domainColor : '#e2e8f0', transition: 'all 0.2s' }} />
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: '#94a3b8' }}>{index + 1} / {total}</span>
      </div>

      {/* 모니터 카드 */}
      <div style={{ background: '#0f172a', borderRadius: '16px', overflow: 'hidden', border: '2px solid #334155', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
          <span style={{ marginLeft: '8px', fontSize: 'clamp(0.7rem, 2vw, 0.78rem)', color: '#64748b', fontWeight: 700 }}>AI 응답 {index + 1}</span>
        </div>
        <div style={{ padding: 'clamp(12px, 3vw, 16px)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '80%', padding: '9px 13px', backgroundColor: '#3b82f6', borderRadius: '14px 4px 14px 14px', fontSize: 'clamp(0.82rem, 2.4vw, 0.92rem)', color: '#fff', fontWeight: 700, lineHeight: 1.5, wordBreak: 'keep-all' }}>
              {sample.prompt}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0, backgroundColor: '#22c55e20', border: '1.5px solid #22c55e40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.6rem, 1.7vw, 0.68rem)', fontWeight: 900, color: '#22c55e' }}>AI</div>
            <div style={{ flex: 1, padding: '9px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px 14px 14px 14px', fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)', color: '#cbd5e1', lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {sample.response}
            </div>
          </div>
        </div>
      </div>

      {/* 이전/다음 + 마지막에 확인 버튼 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: index === 0 ? '#cbd5e1' : '#475569', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
        >
          <ChevronLeft size={16} /> 이전
        </button>

        {index < total - 1 ? (
          <button
            onClick={() => setIndex(i => i + 1)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: `2px solid ${domainColor}`, backgroundColor: domainColor + '18', color: domainColor, fontWeight: 800, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: 'pointer' }}
          >
            다음 <ChevronRight size={16} />
          </button>
        ) : !confirmed ? (
          <button
            onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true } }))}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', border: `2px solid ${domainColor}`, backgroundColor: domainColor, color: '#fff', fontWeight: 800, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: 'pointer' }}
          >
            모두 읽었어요!
          </button>
        ) : (
          <div style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', backgroundColor: domainColor + '14', border: `2px solid ${domainColor}`, textAlign: 'center', fontWeight: 800, color: domainColor, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)' }}>
            ✓ 모두 읽었어요
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PerResponseJudgeCarousel ────────────────────────────────────
// STEP2: 샘플 1개씩 수용/수정/재검증 판단
const PerResponseJudgeCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const samples = step.samples || [];
  const total = samples.length;
  const answer = answers[step.id] || {};

  const firstUnjudged = samples.findIndex(s => !answer[s.id]);
  const [index, setIndex] = useState(firstUnjudged === -1 ? 0 : firstUnjudged);

  const sample = samples[index];
  const selected = answer[sample.id] || null;
  const judgedCount = Object.keys(answer).length;
  const judgmentColors = { use: '#22c55e', revise: '#f59e0b', verify: '#3b82f6' };

  const setJudgment = (judgeId) => {
    const next = { ...answer, [sample.id]: judgeId };
    setAnswers(prev => ({ ...prev, [step.id]: next }));
    const nextUnjudged = samples.findIndex((s, i) => i !== index && !next[s.id]);
    if (nextUnjudged !== -1) setTimeout(() => setIndex(nextUnjudged), 350);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 진행 점 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {samples.map((s, i) => {
            const isDone = !!answer[s.id];
            return <button key={s.id} onClick={() => setIndex(i)} style={{ width: i === index ? '20px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0, backgroundColor: isDone ? '#22c55e' : i === index ? domainColor : '#e2e8f0', transition: 'all 0.2s' }} />;
          })}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: judgedCount === total ? '#16a34a' : '#94a3b8' }}>
          {judgedCount === total ? `${total}개 모두 판단 완료!` : `${judgedCount} / ${total}개 판단함`}
        </span>
      </div>

      {/* 샘플 카드 */}
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Q: {sample.prompt}
        </div>
        <div style={{ padding: '10px 13px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: 'clamp(0.83rem, 2.4vw, 0.92rem)', color: '#334155', lineHeight: 1.6, wordBreak: 'keep-all', marginBottom: '14px' }}>
          <span style={{ fontWeight: 700, color: '#94a3b8' }}>AI: </span>{sample.response}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(step.judgmentOptions || []).map(opt => {
            const isSelected = selected === opt.id;
            const accent = judgmentColors[opt.id] || domainColor;
            return (
              <button key={opt.id} onClick={() => setJudgment(opt.id)} style={{ flex: 1, padding: 'clamp(10px, 2.5vw, 13px) clamp(4px, 1vw, 8px)', borderRadius: '12px', border: `2px solid ${isSelected ? accent : '#e2e8f0'}`, backgroundColor: isSelected ? accent + '18' : '#f8fafc', color: isSelected ? accent : '#64748b', fontWeight: isSelected ? 800 : 600, fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all', textAlign: 'center' }}>
                {isSelected && '✓ '}{opt.label}
                {opt.desc && <div style={{ fontSize: 'clamp(0.6rem, 1.6vw, 0.68rem)', opacity: 0.8, marginTop: '2px' }}>{opt.desc}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 이전/다음 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: index === 0 ? '#cbd5e1' : '#475569', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>
          <ChevronLeft size={16} /> 이전
        </button>
        <button onClick={() => { if (selected) setIndex(i => Math.min(total - 1, i + 1)); }} disabled={!selected || index === total - 1} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: `2px solid ${selected && index < total - 1 ? domainColor : '#e2e8f0'}`, backgroundColor: selected && index < total - 1 ? domainColor + '18' : '#f8fafc', color: selected && index < total - 1 ? domainColor : '#cbd5e1', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: selected && index < total - 1 ? 'pointer' : 'not-allowed' }}>
          다음 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── FilteredReasonCarousel ──────────────────────────────────────
// STEP3: 수정/재검증 샘플 1개씩 이유 선택
const FilteredReasonCarousel = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const sourceStepId = step.sourceStepId || 'step2';
  const filterJudgments = step.filterJudgments || ['revise', 'verify'];
  const sourceAnswers = answers[sourceStepId] || {};
  const sourceStep = gradeSpec?.steps?.find(s => s.id === sourceStepId);
  const filteredSamples = (sourceStep?.samples || []).filter(s => filterJudgments.includes(sourceAnswers[s.id]));
  const total = filteredSamples.length;
  const [index, setIndex] = useState(0);

  const answer = answers[step.id] || {};
  const otherText = answers[`${step.id}_other_text`] || {};

  const setReason = (sampleId, reasonId) => setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [sampleId]: reasonId } }));
  const setOther = (sampleId, text) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: { ...(prev[`${step.id}_other_text`] || {}), [sampleId]: text } }));

  if (total === 0) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '14px' }}>
          <p style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', margin: 0 }}>이전 단계에서 수정 또는 재검증을 선택한 응답이 없어요.</p>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(index, total - 1);
  const sample = filteredSamples[safeIndex];
  const selected = answer[sample.id] || null;
  const currentOther = typeof otherText === 'object' ? (otherText[sample.id] || '') : '';
  const doneCount = filteredSamples.filter(s => answer[s.id]).length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 진행 점 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {filteredSamples.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)} style={{ width: i === safeIndex ? '20px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0, backgroundColor: answer[s.id] ? '#22c55e' : i === safeIndex ? domainColor : '#e2e8f0', transition: 'all 0.2s' }} />
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: doneCount === total ? '#16a34a' : '#94a3b8' }}>
          {doneCount === total ? `${total}개 모두 완료!` : `${doneCount} / ${total}개 완료`}
        </span>
      </div>

      {/* 샘플 카드 */}
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', letterSpacing: '0.04em' }}>Q: {sample.prompt}</div>
        <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', borderRadius: '8px', fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)', color: '#7f1d1d', lineHeight: 1.5, wordBreak: 'keep-all', marginBottom: '14px', border: '1px solid #fca5a5' }}>
          <span style={{ fontWeight: 700, color: '#ef4444' }}>AI: </span>{sample.response}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(step.reasonOptions || []).map(r => {
            const isSelected = selected === r.id;
            return (
              <button key={r.id} onClick={() => setReason(sample.id, r.id)} style={{ padding: 'clamp(9px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', borderRadius: '10px', border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`, backgroundColor: isSelected ? domainColor + '18' : '#f8fafc', color: isSelected ? domainColor : '#475569', fontWeight: isSelected ? 800 : 600, fontSize: 'clamp(0.85rem, 2.5vw, 0.93rem)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', wordBreak: 'keep-all' }}>
                {isSelected && '✓ '}{r.label}
              </button>
            );
          })}
        </div>
        {selected === 'other' && (
          <div style={{ marginTop: '10px' }}>
            <input type="text" placeholder="이유를 직접 써보세요..." value={currentOther} onChange={(e) => setOther(sample.id, e.target.value)} autoFocus maxLength={50} style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 16px)', border: `2px solid ${domainColor}`, borderRadius: '10px', fontSize: 'clamp(0.88rem, 2.6vw, 0.96rem)', fontWeight: 700, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#1e293b', backgroundColor: 'white' }} />
          </div>
        )}
      </div>

      {/* 이전/다음 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={safeIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: safeIndex === 0 ? '#cbd5e1' : '#475569', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: safeIndex === 0 ? 'not-allowed' : 'pointer' }}>
          <ChevronLeft size={16} /> 이전
        </button>
        <button onClick={() => { if (selected) setIndex(i => Math.min(total - 1, i + 1)); }} disabled={!selected || safeIndex === total - 1} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: `2px solid ${selected && safeIndex < total - 1 ? domainColor : '#e2e8f0'}`, backgroundColor: selected && safeIndex < total - 1 ? domainColor + '18' : '#f8fafc', color: selected && safeIndex < total - 1 ? domainColor : '#cbd5e1', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: selected && safeIndex < total - 1 ? 'pointer' : 'not-allowed' }}>
          다음 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── FilteredPlanCarousel ────────────────────────────────────────
// STEP4: 수정/재검증 샘플 1개씩 계획 직접 작성
const FilteredPlanCarousel = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const sourceStepId = step.sourceStepId || 'step2';
  const filterJudgments = step.filterJudgments || ['revise', 'verify'];
  const sourceAnswers = answers[sourceStepId] || {};
  const sourceStep = gradeSpec?.steps?.find(s => s.id === sourceStepId);
  const filteredSamples = (sourceStep?.samples || []).filter(s => filterJudgments.includes(sourceAnswers[s.id]));
  const total = filteredSamples.length;
  const [index, setIndex] = useState(0);

  const answer = answers[step.id] || {};
  const setText = (sampleId, text) => setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [sampleId]: text } }));

  if (total === 0) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '14px' }}>
          <p style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', margin: 0 }}>이전 단계에서 수정 또는 재검증을 선택한 응답이 없어요.</p>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(index, total - 1);
  const sample = filteredSamples[safeIndex];
  const currentPlan = answer[sample.id] || '';
  const filledCount = filteredSamples.filter(s => answer[s.id]?.trim()).length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 진행 점 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {filteredSamples.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)} style={{ width: i === safeIndex ? '20px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0, backgroundColor: answer[s.id]?.trim() ? '#22c55e' : i === safeIndex ? domainColor : '#e2e8f0', transition: 'all 0.2s' }} />
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: filledCount === total ? '#16a34a' : '#94a3b8' }}>
          {filledCount === total ? `${total}개 모두 완료!` : `${filledCount} / ${total}개 완료`}
        </span>
      </div>

      {/* 샘플 카드 */}
      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', letterSpacing: '0.04em' }}>Q: {sample.prompt}</div>
        <div style={{ padding: '7px 11px', backgroundColor: '#fef2f2', borderRadius: '8px', fontSize: 'clamp(0.78rem, 2.2vw, 0.85rem)', color: '#7f1d1d', lineHeight: 1.5, wordBreak: 'keep-all', marginBottom: '12px', border: '1px solid #fca5a5' }}>
          <span style={{ fontWeight: 700, color: '#ef4444' }}>AI: </span>
          {sample.response.length > 70 ? sample.response.slice(0, 70) + '…' : sample.response}
        </div>
        <textarea
          placeholder={step.placeholder || '어떻게 수정하거나 다시 확인할지 계획을 써보세요.'}
          value={currentPlan}
          onChange={e => setText(sample.id, e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `2px solid ${currentPlan?.trim() ? domainColor : '#e2e8f0'}`, fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none', outline: 'none', fontFamily: 'inherit', color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s' }}
        />
      </div>

      {/* 이전/다음 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={safeIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: safeIndex === 0 ? '#cbd5e1' : '#475569', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: safeIndex === 0 ? 'not-allowed' : 'pointer' }}>
          <ChevronLeft size={16} /> 이전
        </button>
        <button onClick={() => { if (currentPlan?.trim()) setIndex(i => Math.min(total - 1, i + 1)); }} disabled={!currentPlan?.trim() || safeIndex === total - 1} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: `2px solid ${currentPlan?.trim() && safeIndex < total - 1 ? domainColor : '#e2e8f0'}`, backgroundColor: currentPlan?.trim() && safeIndex < total - 1 ? domainColor + '18' : '#f8fafc', color: currentPlan?.trim() && safeIndex < total - 1 ? domainColor : '#cbd5e1', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: currentPlan?.trim() && safeIndex < total - 1 ? 'pointer' : 'not-allowed' }}>
          다음 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

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

// ─── E-3-M Clothing Helpers ──────────────────────────────────────────────────

const CLOTHING_TAG_LABEL = {
  bright_color: '밝은색', dark_color: '어두운색', pastel_color: '파스텔', vivid_color: '원색',
  cute_style: '귀여운', sporty_style: '스포티', clean_style: '깔끔한', fancy_style: '화려한',
  tshirt: '티셔츠', pants: '바지', skirt: '치마', hoodie: '후드', hat: '모자', shoes: '신발',
  summer: '여름', winter: '겨울', allseason: '사계절'
};

const computeClothingTopPrefs = (ratings, clothingItems) => {
  const tagCounts = {};
  Object.entries(ratings).forEach(([itemId, rating]) => {
    if (rating >= 4) {
      const item = clothingItems.find(c => c.id === itemId);
      if (item) item.tags.forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
    }
  });
  return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
};

const computeClothingRecommendations = (ratings, clothingItems, recommendationRules, count = 3) => {
  const topPrefs = computeClothingTopPrefs(ratings, clothingItems);
  const highlyRatedIds = Object.entries(ratings).filter(([_, r]) => r >= 4).map(([id]) => id);
  let candidateIds = [];
  for (const pref of topPrefs) {
    (recommendationRules[pref]?.items || []).forEach(id => {
      if (!candidateIds.includes(id)) candidateIds.push(id);
    });
    if (candidateIds.length >= count * 2) break;
  }
  const notHighly = candidateIds.filter(id => !highlyRatedIds.includes(id));
  let result = notHighly.length >= count
    ? notHighly.slice(0, count)
    : [...notHighly, ...candidateIds.filter(id => !notHighly.includes(id))].slice(0, count);
  clothingItems.forEach(item => {
    if (!result.includes(item.id) && result.length < count) result.push(item.id);
  });
  return result.slice(0, count);
};

const getClothingType = (tags = []) => {
  if (tags.includes('tshirt')) return 'tshirt';
  if (tags.includes('pants')) return 'pants';
  if (tags.includes('skirt')) return 'skirt';
  if (tags.includes('hoodie')) return 'hoodie';
  if (tags.includes('hat')) return 'hat';
  if (tags.includes('shoes')) return 'shoes';
  return 'tshirt';
};

const ClothingIllustration = ({ type, colorHex, size = 48 }) => {
  const c = colorHex || '#94a3b8';
  const shadow = '#00000028';
  const detail = '#00000040';
  const s = size;
  const shapes = {
    // 티셔츠: 어깨 넓고 소매 짧게 양쪽으로 뻗음, U넥 칼라
    tshirt: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* 몸통 */}
        <rect x="13" y="16" width="22" height="26" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* 왼쪽 소매 */}
        <polygon points="5,14 13,16 13,24 5,22" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* 오른쪽 소매 */}
        <polygon points="43,14 35,16 35,24 43,22" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* U넥 */}
        <path d="M17 16 Q24 23 31 16" fill="none" stroke={detail} strokeWidth="1.4"/>
      </svg>
    ),
    // 후드티: 티셔츠 + 머리 위로 올라오는 뚜렷한 후드
    hoodie: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* 몸통 */}
        <rect x="13" y="18" width="22" height="24" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* 왼쪽 소매 */}
        <polygon points="5,16 13,18 13,26 5,24" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* 오른쪽 소매 */}
        <polygon points="43,16 35,18 35,26 43,24" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* 후드 (볼록하게 머리 위로) */}
        <path d="M15 18 C13 10 16 4 24 4 C32 4 35 10 33 18 Z" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* 후드 안쪽 라인 */}
        <path d="M18 18 C17 12 19 7 24 7 C29 7 31 12 30 18" fill="none" stroke={detail} strokeWidth="1.4"/>
        {/* 캥거루 포켓 */}
        <rect x="18" y="30" width="12" height="7" rx="3" fill="none" stroke={detail} strokeWidth="1.2"/>
      </svg>
    ),
    // 바지: 허리띠 + 두 다리 분리
    pants: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="9" y="6" width="30" height="8" rx="2" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <rect x="9" y="14" width="13" height="28" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <rect x="26" y="14" width="13" height="28" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* 허리 스티치 */}
        <line x1="12" y1="10" x2="36" y2="10" stroke={detail} strokeWidth="1" strokeDasharray="3,2"/>
      </svg>
    ),
    // 치마: 허리밴드 + 아래로 넓어지는 A라인
    skirt: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* 허리밴드 */}
        <rect x="15" y="6" width="18" height="8" rx="2" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* A라인 스커트 */}
        <path d="M15 14 L5 44 L43 44 L33 14 Z" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* 허리 구분선 */}
        <line x1="15" y1="14" x2="33" y2="14" stroke={detail} strokeWidth="1.2"/>
        {/* 주름선 */}
        <line x1="24" y1="14" x2="22" y2="44" stroke={detail} strokeWidth="0.8" opacity="0.5"/>
      </svg>
    ),
    // 모자: 챙 + 돔형 크라운
    hat: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* 챙 (넓고 납작) */}
        <ellipse cx="24" cy="32" rx="19" ry="5" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* 크라운 (볼록한 반원) */}
        <path d="M10 32 C10 32 10 10 24 10 C38 10 38 32 38 32 Z" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* 크라운 하단 구분선 */}
        <ellipse cx="24" cy="32" rx="14" ry="3" fill="none" stroke={detail} strokeWidth="1.2"/>
        {/* 앞 단추/로고 */}
        <circle cx="24" cy="22" r="2" fill={detail} opacity="0.4"/>
      </svg>
    ),
    // 신발: 옆에서 본 스니커즈 실루엣
    shoes: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* 발등/어퍼 */}
        <path d="M6 30 C6 24 10 18 18 17 L26 17 L26 26 C32 26 40 28 42 34 L6 34 Z" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        {/* 밑창 */}
        <rect x="6" y="34" width="36" height="6" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        {/* 끈 */}
        <path d="M18 22 L22 26 M22 20 L26 24" stroke={detail} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  };
  return shapes[type] || shapes.tshirt;
};

const ClothingItemCard = ({ item, domainColor, compact = false }) => (
  <div style={{
    backgroundColor: '#fff', borderRadius: compact ? '10px' : '12px',
    border: '2px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column'
  }}>
    <div style={{
      backgroundColor: item.colorHex ? `${item.colorHex}22` : '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: compact ? 'clamp(54px, 13vw, 68px)' : 'clamp(70px, 17vw, 88px)',
    }}>
      <ClothingIllustration type={getClothingType(item.tags)} colorHex={item.colorHex} size={compact ? 36 : 48} />
    </div>
    <div style={{ padding: compact ? '4px 6px 6px' : '7px 10px 9px' }}>
      <div style={{
        fontSize: compact ? 'clamp(0.58rem, 1.5vw, 0.66rem)' : 'clamp(0.72rem, 2vw, 0.8rem)',
        fontWeight: 800, color: '#1e293b', marginBottom: '2px', lineHeight: 1.3, wordBreak: 'keep-all'
      }}>
        {item.name}
      </div>
      <div style={{
        fontSize: compact ? 'clamp(0.5rem, 1.2vw, 0.56rem)' : 'clamp(0.6rem, 1.5vw, 0.66rem)',
        color: '#94a3b8', fontWeight: 600, lineHeight: 1.4
      }}>
        {item.tags.slice(0, 2).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
      </div>
    </div>
  </div>
);

export default SJRenderer;
