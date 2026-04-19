import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { StepHeader, SelectionHint } from './shared';

// ─── text_compare_ab ──────────────────────────────────────────────
export const TextCompareABStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const outputA = answers['step1']?.output_initial;
  const outputB = answers['step2']?.output_detailed;

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const toggleReason = (id) => {
    const cur = data.reasons || [];
    const next = cur.includes(id) ? cur.filter(r => r !== id) : [...cur, id];
    const updates = { reasons: next };
    if (id === 'other' && !next.includes('other')) updates.other_text = '';
    patch(updates);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* A/B 비교 패널 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(8px, 2.5vw, 12px)' }}>
        {[
          { key: 'A', label: step.labelA, output: outputA },
          { key: 'B', label: step.labelB, output: outputB }
        ].map(({ key, label, output }) => {
          const isActive = data.choice === key;
          return (
            <button key={key} onClick={() => patch({ choice: key })}
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px',
                padding: 'clamp(12px, 3.5vw, 16px)',
                borderRadius: '18px',
                border: isActive ? `2.5px solid ${domainColor}` : '2.5px solid #e2e8f0',
                backgroundColor: isActive ? `${domainColor}0C` : 'white',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 6px 18px ${domainColor}28` : '0 1px 4px rgba(0,0,0,0.05)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                fontFamily: 'inherit', textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 900, color: isActive ? domainColor : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </span>
                {isActive && (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: domainColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={10} color="white" strokeWidth={3} />
                  </div>
                )}
              </div>
              {output
                ? <img src={output} alt={label} style={{ width: '100%', borderRadius: '10px', display: 'block', aspectRatio: '1/1', objectFit: 'cover' }} />
                : <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', color: '#94a3b8' }}>이전 단계 결과가 없어요.</span>
                  </div>
              }
            </button>
          );
        })}
      </div>

      {/* 이유 태그 */}
      {data.choice && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)', fontWeight: 800, color: '#475569', margin: 0 }}>
            어떤 점이 더 좋았나요? (여러 개 선택 가능)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {step.reasonOptions.map(reason => {
              const isActive = (data.reasons || []).includes(reason.id);
              return (
                <button key={reason.id} onClick={() => toggleReason(reason.id)}
                  style={{
                    padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3.5vw, 16px)',
                    borderRadius: '999px',
                    border: isActive ? `2px solid ${domainColor}` : '2px solid #e2e8f0',
                    backgroundColor: isActive ? domainColor : 'white',
                    color: isActive ? 'white' : '#64748b',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease'
                  }}
                >
                  {reason.label}
                </button>
              );
            })}
          </div>
          {/* 기타 선택 시 주관식 입력 */}
          {(data.reasons || []).includes('other') && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)', fontWeight: 700, color: '#475569' }}>
                어떤 점이 좋았나요? <span style={{ color: domainColor }}>*</span>
              </label>
              <input
                type="text"
                placeholder="직접 이유를 써보세요..."
                value={data.other_text || ''}
                onChange={e => patch({ other_text: e.target.value })}
                autoFocus
                maxLength={80}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)',
                  border: `2px solid ${data.other_text?.trim() ? domainColor : '#fbbf24'}`,
                  borderRadius: '12px',
                  fontSize: 'clamp(0.875rem, 2.8vw, 1rem)',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  color: '#1e293b',
                  backgroundColor: 'white',
                  transition: 'border-color 0.2s'
                }}
              />
              {!data.other_text?.trim() && (
                <p style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', color: '#f59e0b', fontWeight: 700, margin: 0 }}>
                  기타를 선택했다면 내용을 꼭 적어주세요!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <SelectionHint
        count={(data.choice ? 1 : 0) + ((data.reasons?.length || 0) > 0 ? 1 : 0)}
        mode="compare"
        chosenImage={data.choice}
        chosenReason={(data.reasons?.length || 0) > 0}
      />
    </div>
  );
};

// ─── result_compare_final ─────────────────────────────────────────
export const ResultCompareFinalStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const [modalImage, setModalImage] = useState(null); // { url, label }

  const outputs = {
    initial: answers['step1']?.output_initial,
    detailed: answers['step2']?.output_detailed,
    revised: answers['step4']?.output_revised
  };

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const toggleCheck = (id) => {
    const cur = data.self_checks || [];
    const next = cur.includes(id) ? cur.filter(c => c !== id) : [...cur, id];
    patch({ self_checks: next });
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 3열 썸네일 그리드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
          이미지를 눌러 크게 보고, 가장 좋은 결과를 선택하세요
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {step.panels.map(panel => {
            const isActive = data.best === panel.key;
            const output = outputs[panel.key];
            return (
              <div key={panel.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* 썸네일 — 클릭 시 모달 */}
                <button
                  onClick={() => output && setModalImage({ url: output, label: panel.label })}
                  style={{
                    padding: 0, border: 'none', borderRadius: '12px', overflow: 'hidden',
                    cursor: output ? 'zoom-in' : 'default',
                    boxShadow: isActive ? `0 0 0 3px ${domainColor}` : '0 1px 4px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.15s ease', display: 'block', width: '100%',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  {output
                    ? <img src={output} alt={panel.label} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                    : <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>없음</span>
                      </div>
                  }
                </button>
                {/* 선택 버튼 */}
                <button
                  onClick={() => patch({ best: panel.key })}
                  style={{
                    padding: '6px 4px', borderRadius: '8px',
                    border: isActive ? `2px solid ${domainColor}` : '2px solid #e2e8f0',
                    backgroundColor: isActive ? domainColor : 'white',
                    color: isActive ? 'white' : '#64748b',
                    fontSize: 'clamp(0.68rem, 2vw, 0.75rem)', fontWeight: 800,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                  }}
                >
                  {isActive && <Check size={10} strokeWidth={3} />}
                  {panel.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 자기 점검 체크리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
          자기 점검
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {step.selfCheckItems.map(item => {
            const isActive = (data.self_checks || []).includes(item.id);
            return (
              <button key={item.id} onClick={() => toggleCheck(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: 'clamp(11px, 3vw, 14px) clamp(12px, 3.5vw, 16px)',
                  borderRadius: '14px',
                  border: isActive ? `2px solid ${domainColor}` : '2px solid #e2e8f0',
                  backgroundColor: isActive ? `${domainColor}0A` : 'white',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: 'clamp(18px, 4.5vw, 22px)', height: 'clamp(18px, 4.5vw, 22px)',
                  borderRadius: '6px',
                  border: isActive ? `2px solid ${domainColor}` : '2px solid #cbd5e1',
                  backgroundColor: isActive ? domainColor : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s ease'
                }}>
                  {isActive && <Check size={10} color="white" strokeWidth={3} />}
                </div>
                <span style={{
                  fontSize: 'clamp(0.85rem, 2.7vw, 0.95rem)',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#1e293b' : '#64748b',
                  lineHeight: 1.35, wordBreak: 'keep-all'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <SelectionHint count={data.best ? 1 : 0} mode="single" />

      {/* 이미지 확대 모달 */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '16px'
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh' }}>
            <img
              src={modalImage.url}
              alt={modalImage.label}
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: '-36px', left: '50%', transform: 'translateX(-50%)',
              color: 'white', fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap'
            }}>
              {modalImage.label}
            </div>
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: 'absolute', top: '-14px', right: '-14px',
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}
            >
              <X size={18} color="#1e293b" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
