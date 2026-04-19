import React, { useState } from 'react';
import { Check, ZoomIn } from 'lucide-react';
import { StepHeader, SelectionHint, ImageModal } from './shared';

// ─── image_view ────────────────────────────────────────────────────
export const ImageViewStep = ({ step, domainColor, hint, onHintClick }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div
        onClick={() => setModalOpen(true)}
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: `3px solid ${domainColor}30`,
          boxShadow: `0 8px 24px ${domainColor}20`,
          cursor: 'zoom-in',
          position: 'relative'
        }}
      >
        <img
          src={step.imageUrl}
          alt="AI가 그린 그림"
          style={{ width: '100%', display: 'block', maxHeight: 'clamp(220px, 50vw, 360px)', objectFit: 'contain', backgroundColor: '#f8fafc' }}
        />
        <div style={{
          position: 'absolute', bottom: '10px', right: '10px',
          backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: '8px',
          padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          <ZoomIn size={14} color="white" />
          <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700 }}>크게 보기</span>
        </div>
      </div>

      {step.description && (
        <div className="v3-card" style={{ padding: 'clamp(14px, 4vw, 18px)', marginBottom: 0 }}>
          <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#475569', lineHeight: 1.65, margin: 0, wordBreak: 'keep-all' }}>
            {step.description}
          </p>
        </div>
      )}

      <div style={{
        padding: 'clamp(10px, 3vw, 14px) 16px',
        backgroundColor: `${domainColor}0D`, borderRadius: '12px',
        border: `2px dashed ${domainColor}50`, textAlign: 'center'
      }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: '#64748b', margin: 0 }}>
          그림을 잘 살펴보고 다음 단계로 이동하세요.
        </p>
      </div>

      {modalOpen && <ImageModal src={step.imageUrl} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

// ─── defect_select ─────────────────────────────────────────────────
export const DefectSelectStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const selected = answers[step.id] || [];
  const otherText = answers[`${step.id}_other_text`] || '';
  const hasOther = selected.includes('other_error');

  const toggleDefect = (id) => {
    const next = selected.includes(id)
      ? selected.filter(d => d !== id)
      : [...selected, id];
    setAnswers(prev => ({ ...prev, [step.id]: next }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 이미지 — 클릭 시 모달 */}
      <div
        onClick={() => setModalOpen(true)}
        style={{
          borderRadius: '18px',
          overflow: 'hidden',
          border: `2px solid ${domainColor}30`,
          boxShadow: `0 4px 16px ${domainColor}15`,
          cursor: 'zoom-in',
          position: 'relative'
        }}
      >
        <img
          src={step.imageUrl}
          alt="오류 찾기 그림"
          style={{ width: '100%', display: 'block', maxHeight: 'clamp(160px, 38vw, 260px)', objectFit: 'contain', backgroundColor: '#f8fafc' }}
        />
        <div style={{
          position: 'absolute', bottom: '8px', right: '8px',
          backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: '7px',
          padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          <ZoomIn size={12} color="white" />
          <span style={{ fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>크게 보기</span>
        </div>
      </div>

      {/* 오류 유형 체크박스 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: '#64748b', margin: 0 }}>
          이상한 부분을 모두 선택해보세요:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(8px, 2.5vw, 12px)' }}>
          {step.defectTypes.map((defect) => {
            const isActive = selected.includes(defect.id);
            return (
              <button
                key={defect.id}
                onClick={() => toggleDefect(defect.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2.5vw, 12px)',
                  padding: 'clamp(12px, 3.5vw, 16px) clamp(10px, 3vw, 14px)',
                  borderRadius: '16px',
                  border: isActive ? `2.5px solid ${domainColor}` : '2.5px solid #e2e8f0',
                  backgroundColor: isActive ? `${domainColor}12` : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 4px 12px ${domainColor}28` : '0 1px 4px rgba(0,0,0,0.05)',
                  fontFamily: 'inherit',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)',
                  borderRadius: '6px',
                  border: isActive ? `2px solid ${domainColor}` : '2px solid #cbd5e1',
                  backgroundColor: isActive ? domainColor : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s ease'
                }}>
                  {isActive && <Check size={12} color="white" strokeWidth={3} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}>{defect.icon}</span>
                  <span style={{
                    fontSize: 'clamp(0.78rem, 2.5vw, 0.9rem)',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#1e293b' : '#64748b',
                    lineHeight: 1.25, wordBreak: 'keep-all'
                  }}>
                    {defect.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 기타 선택 시 텍스트 입력 */}
        {hasOther && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
            <label style={{
              fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)', fontWeight: 700, color: '#475569'
            }}>
              어떤 부분이 이상한가요? <span style={{ color: domainColor }}>*</span>
            </label>
            <input
              type="text"
              placeholder="예: 나무 모양이 이상해요, 사람 얼굴이 뭉개져 있어요..."
              value={otherText}
              onChange={(e) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: e.target.value }))}
              autoFocus
              maxLength={60}
              style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 14px) clamp(12px, 3.5vw, 16px)',
                border: `2.5px solid ${otherText.trim() ? domainColor : '#fbbf24'}`,
                borderRadius: '14px',
                fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                color: '#1e293b',
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease'
              }}
            />
            {!otherText.trim() && (
              <p style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', color: '#f59e0b', fontWeight: 700, margin: 0 }}>
                기타를 선택했다면 내용을 꼭 적어주세요!
              </p>
            )}
          </div>
        )}
      </div>

      <SelectionHint count={selected.length} mode="multi" />

      {modalOpen && <ImageModal src={step.imageUrl} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

// ─── single_select_buttons ─────────────────────────────────────────
export const SingleSelectStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || null;
  const otherText = answers[`${step.id}_other_text`] || '';

  const selectOption = (id) => {
    setAnswers(prev => ({ ...prev, [step.id]: id }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 3vw, 14px)' }}>
        {step.options.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => selectOption(option.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                gap: '6px',
                padding: 'clamp(14px, 4vw, 18px) clamp(12px, 3.5vw, 16px)',
                borderRadius: '18px',
                border: isActive ? `2.5px solid ${domainColor}` : '2.5px solid #e2e8f0',
                backgroundColor: isActive ? `${domainColor}12` : 'white',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 4px 14px ${domainColor}28` : '0 1px 4px rgba(0,0,0,0.05)',
                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                fontFamily: 'inherit', textAlign: 'left'
              }}
            >
              <span style={{
                fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#1e293b' : '#64748b',
                lineHeight: 1.3, wordBreak: 'keep-all'
              }}>
                {option.label}
              </span>
              {isActive && (
                <div style={{
                  width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)',
                  borderRadius: '50%', backgroundColor: domainColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end'
                }}>
                  <Check size={10} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected === 'other' && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', fontWeight: 700, color: '#64748b' }}>
            어떤 내용인지 써보세요!
          </label>
          <input
            type="text"
            placeholder="직접 써보세요..."
            value={otherText}
            onChange={(e) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: e.target.value }))}
            autoFocus
            maxLength={40}
            style={{
              width: '100%', padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 18px)',
              border: `2.5px solid ${domainColor}`, borderRadius: '14px',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: 700,
              outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              color: '#1e293b', backgroundColor: 'white'
            }}
          />
        </div>
      )}

      <SelectionHint count={selected ? 1 : 0} mode="single" />
    </div>
  );
};

// ─── image_compare_ab ──────────────────────────────────────────────
export const ImageCompareStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const chosenImage = answers[step.id]?.image || null;
  const chosenReasons = answers[step.id]?.reasons || [];
  const otherText = answers[step.id]?.other_text || '';

  const selectImage = (img) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], image: img } }));
  };

  const toggleReason = (reasonId) => {
    const next = chosenReasons.includes(reasonId)
      ? chosenReasons.filter(r => r !== reasonId)
      : [...chosenReasons, reasonId];
    const updates = { reasons: next };
    if (!next.includes('other')) updates.other_text = '';
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], ...updates } }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* A/B 이미지 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 3vw, 14px)' }}>
        {[{ key: 'A', data: step.imageA }, { key: 'B', data: step.imageB }].map(({ key, data }) => {
          const isActive = chosenImage === key;
          return (
            <button
              key={key}
              onClick={() => selectImage(key)}
              style={{
                display: 'flex', flexDirection: 'column', gap: '0',
                borderRadius: '18px', overflow: 'hidden',
                border: isActive ? `3px solid ${domainColor}` : '3px solid #e2e8f0',
                backgroundColor: 'white', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 8px 24px ${domainColor}35` : '0 2px 8px rgba(0,0,0,0.06)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                fontFamily: 'inherit', padding: 0
              }}
            >
              <img src={data.url} alt={data.label}
                style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                padding: 'clamp(8px, 2.5vw, 12px)',
                backgroundColor: isActive ? `${domainColor}12` : '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
                {isActive && (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: domainColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Check size={10} color="white" strokeWidth={3} />
                  </div>
                )}
                <span style={{
                  fontSize: 'clamp(0.85rem, 3vw, 1rem)', fontWeight: 900,
                  color: isActive ? domainColor : '#94a3b8'
                }}>
                  {data.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 이유 다중 체크박스 */}
      {chosenImage && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)', fontWeight: 800, color: '#475569', margin: 0 }}>
            어떤 점이 더 자연스러워졌나요? (여러 개 선택 가능)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {step.reasonOptions.map((reason) => {
              const isActive = chosenReasons.includes(reason.id);
              return (
                <button
                  key={reason.id}
                  onClick={() => toggleReason(reason.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: 'clamp(12px, 3.5vw, 14px) clamp(12px, 3.5vw, 16px)',
                    borderRadius: '14px',
                    border: isActive ? `2.5px solid ${domainColor}` : '2px solid #e2e8f0',
                    backgroundColor: isActive ? `${domainColor}10` : 'white',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    fontFamily: 'inherit', textAlign: 'left', width: '100%'
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
                    fontSize: 'clamp(0.875rem, 2.8vw, 1rem)',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#1e293b' : '#64748b',
                    lineHeight: 1.3, wordBreak: 'keep-all'
                  }}>
                    {reason.label}
                  </span>
                </button>
              );
            })}
          </div>
          {chosenReasons.includes('other') && (
            <div className="animate-slide-up" style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="직접 써보세요..."
                value={otherText}
                onChange={(e) => setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], other_text: e.target.value } }))}
                autoFocus
                maxLength={40}
                style={{
                  width: '100%', padding: 'clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 16px)',
                  border: `2.5px solid ${domainColor}`, borderRadius: '12px',
                  fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', fontWeight: 700,
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                  color: '#1e293b', backgroundColor: 'white'
                }}
              />
            </div>
          )}
        </div>
      )}

      <SelectionHint
        count={(chosenImage ? 1 : 0) + (chosenReasons.length > 0 ? 1 : 0)}
        mode="compare"
        chosenImage={chosenImage}
        chosenReason={chosenReasons.length > 0}
      />
    </div>
  );
};
