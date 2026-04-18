import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepHeader, ChipGroup } from './shared';

// ─── CaseJudgeCarousel (case_judge_carousel) ──────────────────────
// 케이스를 캐러셀로 하나씩 보여주면서 단계별 판단을 수집하는 컴포넌트.
// judgmentOptions / reasonOptions / fairnessOptions / allowText 각각 독립적으로 표시.
export const CaseJudgeCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const cases = step.cases || [];
  const answer = answers[step.id] || {};
  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [step.id]);

  const c = cases[index];
  if (!c) return null;

  const ca = answer[c.id] || {};

  const setField = (caseId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), [caseId]: { ...(prev[step.id]?.[caseId] || {}), [field]: value } }
    }));
  };

  const goTo = (i) => setIndex(i);

  const toggleMulti = (caseId, field, itemId) => {
    const current = (answer[caseId] || {})[field] || [];
    const next = current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId];
    setField(caseId, field, next);
  };

  // 완료 기준: 각 스텝에서 필요한 항목이 채워진 케이스 수
  const isComplete = (cs) => {
    const a = answer[cs.id] || {};
    if (step.judgmentOptions && !a.judgment) return false;
    if (step.reasonOptions && (!a.reasons || a.reasons.length === 0)) return false;
    if (step.fairnessOptions && !a.fairness) return false;
    return true;
  };
  const completedCount = cases.filter(isComplete).length;
  const allDone = completedCount === cases.length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 진행 점 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
        {cases.map((cs, i) => {
          const done = isComplete(cs);
          const isCurrent = i === index;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: isCurrent ? '28px' : '10px', height: '10px',
                borderRadius: '5px', border: 'none', padding: 0, cursor: 'pointer',
                backgroundColor: done ? '#22c55e' : isCurrent ? domainColor : '#cbd5e1',
                transition: 'all 0.2s'
              }}
            />
          );
        })}
      </div>

      {/* 케이스 카드 */}
      <div className="v3-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
        {c.image && (
          <img
            src={c.image}
            alt={c.title}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', borderRadius: '16px 16px 0 0' }}
          />
        )}
        <div style={{ padding: 'clamp(14px, 4vw, 20px)' }}>
          {/* 제목 */}
          <div style={{ fontWeight: 900, fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', color: '#1e293b', marginBottom: '10px', wordBreak: 'keep-all' }}>
            {c.title}
          </div>

          {/* 설명 */}
          {c.description && (
            <p style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)', color: '#475569', marginBottom: '12px', lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {c.description}
            </p>
          )}

          {/* 학생 A / B 비교 */}
          {(c.userA || c.userB) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[c.userA, c.userB].filter(Boolean).map((user, i) => (
                <div key={user.id || i} style={{
                  borderRadius: '12px', padding: 'clamp(9px, 2.5vw, 12px) clamp(10px, 3vw, 14px)',
                  background: i === 0 ? '#f0fdf4' : '#fff1f2',
                  border: '1.5px solid ' + (i === 0 ? '#86efac' : '#fca5a5')
                }}>
                  <div style={{ fontWeight: 800, fontSize: 'clamp(0.78rem, 2.2vw, 0.84rem)', color: i === 0 ? '#15803d' : '#dc2626', marginBottom: '4px' }}>
                    {user.label}
                  </div>
                  <div style={{ fontSize: 'clamp(0.75rem, 2.1vw, 0.82rem)', color: '#334155', lineHeight: 1.45, wordBreak: 'keep-all' }}>
                    {user.status}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 판단 버튼 (누가 더 불편?) */}
          {step.judgmentOptions && (
            <>
              {step.judgmentLabel && (
                <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {step.judgmentLabel}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                {step.judgmentOptions.map(opt => {
                  const isSelected = ca.judgment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setField(c.id, 'judgment', opt.id)}
                      style={{
                        flex: 1, padding: 'clamp(9px, 2.5vw, 12px)',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                        backgroundColor: isSelected ? domainColor + '18' : '#f8fafc',
                        color: isSelected ? domainColor : '#64748b',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                        cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all',
                        fontFamily: 'inherit'
                      }}
                    >
                      {isSelected && <span style={{ marginRight: '4px' }}>✓</span>}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* 이유 태그 */}
          {step.reasonOptions && (
            <ChipGroup
              label={step.reasonLabel || '왜 그런 결과가 생겼을까요?'}
              options={step.reasonOptions}
              selected={step.reasonMulti ? (ca.reasons || []) : (ca.reason ? [ca.reason] : [])}
              onToggle={id => step.reasonMulti ? toggleMulti(c.id, 'reasons', id) : setField(c.id, 'reason', id)}
              domainColor={domainColor}
              style={{ marginTop: step.judgmentOptions ? '14px' : '0' }}
            />
          )}

          {/* 공정성 판단 */}
          {step.fairnessOptions && (
            <div style={{ marginTop: step.reasonOptions || step.judgmentOptions ? '14px' : '0' }}>
              {step.fairnessLabel && (
                <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {step.fairnessLabel}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                {step.fairnessOptions.map(opt => {
                  const isSelected = ca.fairness === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setField(c.id, 'fairness', opt.id)}
                      style={{
                        flex: 1, padding: 'clamp(8px, 2vw, 11px)',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#ef4444' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#fef2f2' : '#f8fafc',
                        color: isSelected ? '#ef4444' : '#64748b',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
                        cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all',
                        fontFamily: 'inherit'
                      }}
                    >
                      {isSelected && <span style={{ marginRight: '4px' }}>✓</span>}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 한 줄 설명 */}
          {step.allowText && (
            <textarea
              placeholder={step.textPlaceholder || '왜 그렇게 생각했나요? 한 줄로 적어보세요.'}
              value={ca.text || ''}
              onChange={e => setField(c.id, 'text', e.target.value)}
              rows={2}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: `2px solid ${ca.text?.trim() ? domainColor : '#e2e8f0'}`,
                fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
                outline: 'none', fontFamily: 'inherit', color: '#1e293b',
                boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s',
                marginTop: step.fairnessOptions || step.reasonOptions || step.judgmentOptions ? '14px' : '0'
              }}
            />
          )}
        </div>
      </div>

      {/* 이전 / 다음 버튼 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0',
            backgroundColor: index === 0 ? '#f8fafc' : '#fff',
            color: index === 0 ? '#cbd5e1' : '#475569',
            fontWeight: 700, cursor: index === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontFamily: 'inherit'
          }}
        >
          <ChevronLeft size={16} /> 이전 사례
        </button>
        <button
          onClick={() => goTo(Math.min(cases.length - 1, index + 1))}
          disabled={index === cases.length - 1}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: `2px solid ${index === cases.length - 1 ? '#e2e8f0' : domainColor}`,
            backgroundColor: index === cases.length - 1 ? '#f8fafc' : domainColor + '18',
            color: index === cases.length - 1 ? '#cbd5e1' : domainColor,
            fontWeight: 700, cursor: index === cases.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontFamily: 'inherit'
          }}
        >
          다음 사례 <ChevronRight size={16} />
        </button>
      </div>

      {/* 완료 상태 */}
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
