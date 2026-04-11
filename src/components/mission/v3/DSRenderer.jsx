import React, { useEffect } from 'react';
import { Check, X, Lightbulb, Plus } from 'lucide-react';

/**
 * DSRenderer - Data & Design type UI for D-1-H.
 * uiModes: ds_training_cards | ds_rule_builder | ds_classify |
 *          ds_result_check | ds_rule_revise | ds_rule_save
 */
const DSRenderer = ({ step, answers, setAnswers, domainColor }) => {
  switch (step.uiMode) {
    case 'ds_training_cards':
      return <TrainingCardsStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} />;
    case 'ds_rule_builder':
      return <RuleBuilderStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} />;
    case 'ds_rule_revise':
      return <RuleBuilderStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} isRevise />;
    case 'ds_classify':
      return <ClassifyStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} />;
    case 'ds_result_check':
      return <ResultCheckStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} />;
    case 'ds_rule_save':
      return <RuleSaveStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} />;
    default:
      return <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>알 수 없는 UI: {step.uiMode}</div>;
  }
};

// ─── Shared ───────────────────────────────────────────────────────

const StepHeader = ({ step, domainColor }) => (
  <div style={{ marginBottom: '4px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: '4px', height: '18px', borderRadius: '2px', backgroundColor: domainColor, flexShrink: 0 }} />
      <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {step.title}
      </span>
    </div>
    <p style={{ fontSize: 'clamp(1rem, 3.2vw, 1.1rem)', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1.45, wordBreak: 'keep-all' }}>
      {step.question}
    </p>
  </div>
);

const GROUP_COLORS = {
  A: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', light: '#fee2e2' },
  B: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', light: '#dcfce7' }
};

// ─── ds_training_cards ────────────────────────────────────────────

const TrainingCardsStep = ({ step, answers, setAnswers, domainColor }) => {
  const highlighted = answers[step.id]?.highlighted || [];
  const { labelNames, cards, featureChips } = step;

  const toggle = (chip) => {
    const next = highlighted.includes(chip)
      ? highlighted.filter(c => c !== chip)
      : [...highlighted, chip];
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], highlighted: next } }));
  };

  const groupA = cards.filter(c => c.label === 'A');
  const groupB = cards.filter(c => c.label === 'B');

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} />

      {/* Cards side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[{ label: 'A', cards: groupA }, { label: 'B', cards: groupB }].map(({ label, cards: group }) => {
          const col = GROUP_COLORS[label];
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '6px 10px', borderRadius: '10px',
                backgroundColor: col.bg, border: `2px solid ${col.border}`
              }}>
                <span style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', fontWeight: 900, color: col.text }}>
                  그룹 {label} · {labelNames[label]}
                </span>
              </div>
              {group.map(card => (
                <div key={card.id} style={{
                  padding: 'clamp(8px, 2.5vw, 12px)',
                  backgroundColor: col.bg,
                  border: `1.5px solid ${col.border}`,
                  borderRadius: '12px',
                  fontSize: 'clamp(0.75rem, 2.3vw, 0.875rem)',
                  color: '#374151',
                  lineHeight: 1.55,
                  wordBreak: 'keep-all'
                }}>
                  {card.text}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Feature chips */}
      <div className="v3-card" style={{ padding: 'clamp(14px, 4vw, 18px)' }}>
        <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', fontWeight: 900, color: '#64748b', marginBottom: '10px', letterSpacing: '0.05em' }}>
          스팸 메일에서 자주 보이는 특징을 눌러보세요
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {featureChips.map(chip => {
            const active = highlighted.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggle(chip)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: `2px solid ${active ? domainColor : '#e2e8f0'}`,
                  backgroundColor: active ? `${domainColor}15` : 'white',
                  color: active ? domainColor : '#64748b',
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}
              >
                {active && <Check size={12} strokeWidth={3} />}
                {chip}
              </button>
            );
          })}
        </div>
        {highlighted.length > 0 && (
          <div style={{
            marginTop: '12px', padding: '10px 14px',
            backgroundColor: `${domainColor}0D`, borderRadius: '10px',
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: domainColor, fontWeight: 700
          }}>
            선택한 특징: {highlighted.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ds_rule_builder / ds_rule_revise ─────────────────────────────

const RuleBuilderStep = ({ step, answers, setAnswers, domainColor, isRevise }) => {
  const stepId = step.id;
  const { labelNames, availableFeatures, targetLabel } = step;

  // Pre-populate from step2 if revising
  const initConditions = (() => {
    if (!isRevise) return answers[stepId]?.conditions || [];
    const prev = answers[step.refStepId]?.conditions || [];
    // Keep current if already touched
    return answers[stepId]?.conditions ?? prev;
  })();

  const conditions = answers[stepId]?.conditions ?? initConditions;

  const setConditions = (next) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: { conditions: next, target_label: targetLabel }
    }));
  };

  const addCondition = (feat) => {
    if (!conditions.includes(feat)) setConditions([...conditions, feat]);
  };

  const removeCondition = (feat) => {
    setConditions(conditions.filter(c => c !== feat));
  };

  const available = availableFeatures.filter(f => !conditions.includes(f));
  const col = GROUP_COLORS[targetLabel];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} />

      {isRevise && answers.step2?.conditions?.length > 0 && (
        <div style={{
          padding: '10px 14px', backgroundColor: '#f8fafc',
          borderRadius: '12px', border: '1.5px dashed #cbd5e1'
        }}>
          <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', fontWeight: 700, color: '#94a3b8' }}>
            이전 규칙(v1): {answers.step2.conditions.join(', ')} → {labelNames[targetLabel]}
          </span>
        </div>
      )}

      {/* Available blocks */}
      <div className="v3-card" style={{ padding: 'clamp(14px, 4vw, 18px)' }}>
        <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', fontWeight: 900, color: '#64748b', marginBottom: '10px', letterSpacing: '0.05em' }}>
          특징 블록 (눌러서 규칙에 추가)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '36px' }}>
          {available.map(feat => (
            <button
              key={feat}
              onClick={() => addCondition(feat)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 14px', borderRadius: '999px',
                border: '2px solid #e2e8f0', backgroundColor: 'white',
                color: '#475569', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={12} strokeWidth={3} />
              {feat}
            </button>
          ))}
          {available.length === 0 && (
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>모든 블록을 추가했어요</span>
          )}
        </div>
      </div>

      {/* Rule conditions area */}
      <div style={{
        padding: 'clamp(14px, 4vw, 18px)',
        backgroundColor: conditions.length > 0 ? col.bg : '#f8fafc',
        borderRadius: '16px',
        border: `2px solid ${conditions.length > 0 ? col.border : '#e2e8f0'}`,
        transition: 'all 0.2s ease'
      }}>
        <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', fontWeight: 900, color: '#64748b', marginBottom: '10px', letterSpacing: '0.05em' }}>
          내 규칙 조건
        </div>

        {conditions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            위에서 블록을 눌러 추가해보세요
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {conditions.map((cond, i) => (
                <React.Fragment key={cond}>
                  {i > 0 && (
                    <span style={{ alignSelf: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '0 2px' }}>OR</span>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '999px',
                    backgroundColor: col.light, border: `2px solid ${col.border}`
                  }}>
                    <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 800, color: col.text }}>
                      {cond}
                    </span>
                    <button
                      onClick={() => removeCondition(cond)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={13} color={col.text} strokeWidth={3} />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{
              padding: '10px 14px', backgroundColor: 'white',
              borderRadius: '10px', border: `1.5px solid ${col.border}`
            }}>
              <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: '#374151' }}>
                이 단어 중 하나라도 포함되면 →{' '}
                <span style={{ color: col.text, fontWeight: 900 }}>{labelNames[targetLabel]}</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── ds_classify ─────────────────────────────────────────────────

const ClassifyStep = ({ step, answers, setAnswers, domainColor }) => {
  const { newCards, labelNames } = step;
  const selections = answers[step.id] || {};

  const select = (cardId, label) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], [cardId]: label } }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {newCards.map((card, idx) => {
          const chosen = selections[card.id];
          return (
            <div key={card.id} className="v3-card" style={{ padding: 'clamp(14px, 4vw, 18px)', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: 'clamp(22px, 5vw, 26px)', height: 'clamp(22px, 5vw, 26px)',
                  borderRadius: '50%', backgroundColor: domainColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'white' }}>{idx + 1}</span>
                </div>
                <p style={{
                  fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', color: '#1e293b',
                  fontWeight: 600, margin: 0, lineHeight: 1.5, wordBreak: 'keep-all'
                }}>
                  {card.text}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['A', 'B']).map(label => {
                  const col = GROUP_COLORS[label];
                  const active = chosen === label;
                  return (
                    <button
                      key={label}
                      onClick={() => select(card.id, label)}
                      style={{
                        padding: 'clamp(10px, 3vw, 14px) 8px',
                        borderRadius: '12px',
                        border: `2px solid ${active ? col.border : '#e2e8f0'}`,
                        backgroundColor: active ? col.bg : 'white',
                        color: active ? col.text : '#64748b',
                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                        fontWeight: active ? 900 : 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      {active && <Check size={14} strokeWidth={3} />}
                      그룹 {label} · {labelNames[label]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        textAlign: 'center', fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
        color: '#94a3b8', fontWeight: 600
      }}>
        {Object.keys(selections).length} / {newCards.length}개 분류 완료
      </div>
    </div>
  );
};

// ─── ds_result_check ─────────────────────────────────────────────

const ResultCheckStep = ({ step, answers, setAnswers, domainColor }) => {
  const { newCards, labelNames } = step;
  const userPredictions = answers.step3 || {};

  // Auto-save result
  useEffect(() => {
    const wrongIds = newCards.filter(c => userPredictions[c.id] !== c.answer).map(c => c.id);
    const correctCount = newCards.length - wrongIds.length;
    setAnswers(prev => ({
      ...prev,
      [step.id]: { correct_count: correctCount, wrong_card_ids: wrongIds }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrongIds = newCards.filter(c => userPredictions[c.id] !== c.answer).map(c => c.id);
  const correctCount = newCards.length - wrongIds.length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} />

      {/* Score */}
      <div style={{
        textAlign: 'center', padding: 'clamp(16px, 5vw, 24px)',
        backgroundColor: correctCount === newCards.length ? '#f0fdf4' : '#fef9c3',
        borderRadius: '16px',
        border: `2px solid ${correctCount === newCards.length ? '#86efac' : '#fde047'}`
      }}>
        <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 900, color: correctCount === newCards.length ? '#16a34a' : '#ca8a04', lineHeight: 1 }}>
          {correctCount} / {newCards.length}
        </div>
        <div style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', fontWeight: 700, color: '#475569', marginTop: '6px' }}>
          {correctCount === newCards.length ? '완벽해요! 모두 맞혔어요' : `${wrongIds.length}개 틀렸어요. 규칙을 수정해볼까요?`}
        </div>
      </div>

      {/* Card by card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {newCards.map((card, idx) => {
          const userLabel = userPredictions[card.id];
          const isCorrect = userLabel === card.answer;
          const correctCol = GROUP_COLORS[card.answer];

          return (
            <div key={card.id} style={{
              padding: 'clamp(12px, 3.5vw, 16px)',
              borderRadius: '14px',
              border: `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
              backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  backgroundColor: isCorrect ? '#16a34a' : '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isCorrect
                    ? <Check size={13} color="white" strokeWidth={3} />
                    : <X size={13} color="white" strokeWidth={3} />
                  }
                </div>
                <span style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', color: '#1e293b', fontWeight: 600, lineHeight: 1.45, wordBreak: 'keep-all' }}>
                  {card.text}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingLeft: '32px' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: '999px',
                  backgroundColor: userLabel ? GROUP_COLORS[userLabel]?.light : '#f1f5f9',
                  border: `1.5px solid ${userLabel ? GROUP_COLORS[userLabel]?.border : '#e2e8f0'}`,
                  fontSize: '0.8rem', fontWeight: 700,
                  color: userLabel ? GROUP_COLORS[userLabel]?.text : '#94a3b8'
                }}>
                  내 답: {userLabel ? `${labelNames[userLabel]}(${userLabel})` : '미분류'}
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: '999px',
                  backgroundColor: correctCol.light,
                  border: `1.5px solid ${correctCol.border}`,
                  fontSize: '0.8rem', fontWeight: 700, color: correctCol.text
                }}>
                  정답: {labelNames[card.answer]}({card.answer})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ds_rule_save ─────────────────────────────────────────────────

const RuleSaveStep = ({ step, answers, setAnswers, domainColor }) => {
  const { refStepIds, labelNames } = step;
  const v1 = answers[refStepIds.v1] || {};
  const v2 = answers[refStepIds.v2] || {};
  const chosen = answers[step.id]?.best_rule;

  const select = (ver) => {
    setAnswers(prev => ({ ...prev, [step.id]: { best_rule: ver, saved: true } }));
  };

  const renderRule = (rule, version) => {
    const isChosen = chosen === version;
    const conditions = rule.conditions || [];
    const targetLabel = rule.target_label || 'A';
    const col = GROUP_COLORS[targetLabel];

    return (
      <button
        key={version}
        onClick={() => select(version)}
        style={{
          width: '100%', textAlign: 'left', padding: 'clamp(14px, 4vw, 18px)',
          borderRadius: '16px',
          border: `2.5px solid ${isChosen ? domainColor : '#e2e8f0'}`,
          backgroundColor: isChosen ? `${domainColor}0C` : 'white',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
          boxShadow: isChosen ? `0 4px 12px ${domainColor}25` : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: 900, color: isChosen ? domainColor : '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            규칙 {version.toUpperCase()}
          </span>
          {isChosen && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', borderRadius: '999px',
              backgroundColor: domainColor, color: 'white'
            }}>
              <Check size={11} strokeWidth={3} />
              <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>선택됨</span>
            </div>
          )}
        </div>

        {conditions.length === 0 ? (
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>규칙 없음</span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
            {conditions.map((cond, i) => (
              <React.Fragment key={cond}>
                {i > 0 && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>OR</span>}
                <span style={{
                  padding: '4px 10px', borderRadius: '999px',
                  backgroundColor: col.light, border: `1.5px solid ${col.border}`,
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 800, color: col.text
                }}>
                  {cond}
                </span>
              </React.Fragment>
            ))}
            <span style={{ fontSize: 'clamp(0.75rem, 2.3vw, 0.85rem)', color: '#475569', fontWeight: 600 }}>
              → {labelNames[targetLabel]}
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {renderRule(v1, 'v1')}
        {renderRule(v2, 'v2')}
      </div>

      {chosen && (
        <div style={{
          padding: '12px 16px', backgroundColor: `${domainColor}0D`,
          borderRadius: '12px', textAlign: 'center',
          border: `1.5px dashed ${domainColor}50`
        }}>
          <span style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', fontWeight: 700, color: domainColor }}>
            규칙 {chosen.toUpperCase()} 저장 완료!
          </span>
        </div>
      )}
    </div>
  );
};

export default DSRenderer;
