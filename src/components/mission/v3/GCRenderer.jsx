import React, { useState } from 'react';
import { Check, X, ZoomIn, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { generateImage } from '../../../services/imagenService';

const buildFullPrompt = (fields, taskLabel) => {
  const parts = [];
  if (fields.audience) parts.push(`${fields.audience}을(를) 대상으로`);
  if (fields.goal) parts.push(fields.goal);
  if (fields.tone) parts.push(`${fields.tone} 분위기로`);
  if (fields.format) parts.push(`${fields.format} 형식으로`);
  if (fields.must_include) parts.push(`"${fields.must_include}" 내용을 포함해서`);
  if (fields.length) parts.push(`${fields.length}으로`);
  if (parts.length === 0) return '';
  return `${taskLabel} ${parts.join(', ')} 써줘.`;
};

/**
 * GCRenderer - Generation & Critical Evaluation type UI.
 * Handles uiModes: image_view | defect_select | single_select_buttons | image_compare_ab
 */
const GCRenderer = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  switch (step.uiMode) {
    case 'image_view':
      return <ImageViewStep step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'defect_select':
      return <DefectSelectStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'single_select_buttons':
      return <SingleSelectStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'image_compare_ab':
      return <ImageCompareStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'task_and_prompt':
      return <TaskAndPromptStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'prompt_with_conditions':
      return <PromptWithConditionsStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'text_compare_ab':
      return <TextCompareABStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'prompt_builder':
      return <PromptBuilderStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    case 'result_compare_final':
      return <ResultCompareFinalStep step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
    default:
      return (
        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
          알 수 없는 UI 유형: {step.uiMode}
        </div>
      );
  }
};

// ─── image_view ────────────────────────────────────────────────────
const ImageViewStep = ({ step, domainColor, hint, onHintClick }) => {
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
const DefectSelectStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
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
const SingleSelectStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selected = answers[step.id] || null;

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

      <SelectionHint count={selected ? 1 : 0} mode="single" />
    </div>
  );
};

// ─── image_compare_ab ──────────────────────────────────────────────
const ImageCompareStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const chosenImage = answers[step.id]?.image || null;
  const chosenReasons = answers[step.id]?.reasons || [];

  const selectImage = (img) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], image: img } }));
  };

  const toggleReason = (reasonId) => {
    const next = chosenReasons.includes(reasonId)
      ? chosenReasons.filter(r => r !== reasonId)
      : [...chosenReasons, reasonId];
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], reasons: next } }));
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

// ─── 이미지 모달 ───────────────────────────────────────────────────
const ImageModal = ({ src, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px'
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh' }}
    >
      <img
        src={src}
        alt="그림 크게 보기"
        style={{
          maxWidth: '100%', maxHeight: '84vh',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          display: 'block'
        }}
      />
      <button
        onClick={onClose}
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
);

// ─── 공통 서브 컴포넌트 ───────────────────────────────────────────
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
            flexShrink: 0,
            width: '36px', height: '36px',
            borderRadius: '50%',
            backgroundColor: '#fef9c3',
            border: '2px solid #fde047',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s, background-color 0.15s',
            marginTop: '2px'
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

const SelectionHint = ({ count, mode, chosenImage, chosenReason }) => {
  let message = '';
  if (mode === 'multi') {
    message = count > 0 ? `${count}개의 오류를 찾았어요!` : '이상한 부분을 눌러서 선택하세요.';
  } else if (mode === 'single') {
    message = count > 0 ? '선택 완료!' : '항목을 하나 선택해보세요.';
  } else if (mode === 'compare') {
    if (!chosenImage) message = '그림을 선택해보세요.';
    else if (!chosenReason) message = '이유도 선택해주세요!';
    else message = '선택 완료!';
  }

  return (
    <div style={{
      padding: 'clamp(10px, 3vw, 14px) 16px',
      backgroundColor: '#f8fafc', borderRadius: '12px',
      border: '2px dashed #e2e8f0', textAlign: 'center'
    }}>
      <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: count > 0 ? '#64748b' : '#94a3b8', margin: 0 }}>
        {message}
      </p>
    </div>
  );
};

// ─── task_and_prompt ──────────────────────────────────────────────
const TaskAndPromptStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const handleSelectTask = (taskId) => {
    patch({ task_type: taskId, prompt_initial: '', output_initial: '' });
    setGenError(null);
  };

  const handleGenerate = async () => {
    if (!data.task_type || !data.prompt_initial?.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const imageUrl = await generateImage(data.prompt_initial, data.task_type);
      patch({ output_initial: imageUrl });
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 과제 선택 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
          과제 선택
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {step.taskOptions.map(task => {
            const isActive = data.task_type === task.id;
            return (
              <button key={task.id} onClick={() => handleSelectTask(task.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: 'clamp(12px, 3.5vw, 16px) clamp(12px, 3.5vw, 16px)',
                  borderRadius: '16px',
                  border: isActive ? `2.5px solid ${domainColor}` : '2.5px solid #e2e8f0',
                  backgroundColor: isActive ? `${domainColor}10` : 'white',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 4px 14px ${domainColor}25` : '0 1px 4px rgba(0,0,0,0.05)',
                  fontFamily: 'inherit', textAlign: 'left', width: '100%'
                }}
              >
                <div style={{
                  width: 'clamp(18px, 4.5vw, 22px)', height: 'clamp(18px, 4.5vw, 22px)',
                  borderRadius: '50%',
                  border: isActive ? `2px solid ${domainColor}` : '2px solid #cbd5e1',
                  backgroundColor: isActive ? domainColor : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isActive && <Check size={10} color="white" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', fontWeight: isActive ? 800 : 600, color: isActive ? '#1e293b' : '#475569', wordBreak: 'keep-all' }}>
                    {task.label}
                  </div>
                  <div style={{ fontSize: 'clamp(0.75rem, 2.3vw, 0.82rem)', color: '#94a3b8', marginTop: '2px', wordBreak: 'keep-all' }}>
                    {task.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 프롬프트 입력 */}
      {data.task_type && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
            짧고 단순하게 부탁하기
          </p>
          <p style={{ fontSize: 'clamp(0.75rem, 2.3vw, 0.82rem)', color: '#94a3b8', margin: 0 }}>
            {step.promptHint}
          </p>
          <textarea
            value={data.prompt_initial || ''}
            onChange={e => patch({ prompt_initial: e.target.value, output_initial: '' })}
            placeholder={step.promptPlaceholder}
            rows={3}
            style={{
              width: '100%', padding: 'clamp(12px, 3vw, 14px)',
              border: `2px solid ${data.prompt_initial?.trim() ? domainColor + '80' : '#e2e8f0'}`,
              borderRadius: '14px', fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
              fontWeight: 600, outline: 'none', resize: 'vertical',
              fontFamily: 'inherit', color: '#1e293b', backgroundColor: 'white',
              transition: 'border-color 0.2s', boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!data.prompt_initial?.trim() || isGenerating}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: 'clamp(12px, 3.5vw, 14px)', borderRadius: '14px',
              backgroundColor: data.prompt_initial?.trim() && !isGenerating ? domainColor : '#e2e8f0',
              color: data.prompt_initial?.trim() && !isGenerating ? 'white' : '#94a3b8',
              border: 'none', cursor: data.prompt_initial?.trim() && !isGenerating ? 'pointer' : 'default',
              fontWeight: 900, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
              fontFamily: 'inherit', transition: 'all 0.15s ease'
            }}
          >
            {isGenerating
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> AI 이미지 생성 중...</>
              : <><Sparkles size={16} /> AI 이미지 만들기</>
            }
          </button>
          <GenerateError error={genError} onRetry={handleGenerate} />
        </div>
      )}

      {/* 생성된 이미지 */}
      {data.output_initial && (
        <GeneratedImageResult
          imageUrl={data.output_initial}
          label="첫 번째 결과"
          domainColor={domainColor}
        />
      )}
    </div>
  );
};

// ─── prompt_with_conditions ───────────────────────────────────────
const PromptWithConditionsStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const taskType = answers['step1']?.task_type;
  const taskLabel = { poster: '환경 보호 포스터 문구', event_notice: '학교 행사 안내문', book_intro: '책 소개 글' }[taskType] || '선택한 주제';
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const insertChip = (example) => {
    const cur = data.prompt_detailed || '';
    const separator = cur && !cur.endsWith(' ') ? ', ' : '';
    patch({ prompt_detailed: cur + separator + example, output_detailed: '' });
  };

  const handleGenerate = async () => {
    if (!data.prompt_detailed?.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const imageUrl = await generateImage(data.prompt_detailed, taskType);
      patch({ output_detailed: imageUrl });
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 선택된 주제 표시 */}
      <div style={{
        padding: 'clamp(10px, 3vw, 12px) 14px',
        backgroundColor: `${domainColor}0E`, borderRadius: '12px',
        border: `1.5px solid ${domainColor}30`, display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <span style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.8rem)', fontWeight: 700, color: '#94a3b8' }}>선택한 주제</span>
        <span style={{ fontSize: 'clamp(0.875rem, 2.8vw, 0.95rem)', fontWeight: 900, color: domainColor }}>{taskLabel}</span>
      </div>

      {/* 조건 칩 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
          조건 추가하기 <span style={{ fontWeight: 500, color: '#94a3b8' }}>(클릭하면 프롬프트에 추가돼요)</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {step.conditionChips.map((chip, i) => (
            <button key={i} onClick={() => insertChip(chip.example)}
              style={{
                padding: '6px 12px', borderRadius: '999px',
                border: `1.5px solid ${domainColor}50`,
                backgroundColor: `${domainColor}0A`, color: '#475569',
                fontSize: 'clamp(0.75rem, 2.3vw, 0.82rem)', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
              }}
            >
              + {chip.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', color: '#94a3b8', margin: '2px 0 0' }}>
          {step.promptHint}
        </p>
      </div>

      {/* 프롬프트 입력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
          자세한 프롬프트 작성
        </p>
        <textarea
          value={data.prompt_detailed || ''}
          onChange={e => patch({ prompt_detailed: e.target.value, output_detailed: '' })}
          placeholder={step.promptPlaceholder}
          rows={4}
          style={{
            width: '100%', padding: 'clamp(12px, 3vw, 14px)',
            border: `2px solid ${data.prompt_detailed?.trim() ? domainColor + '80' : '#e2e8f0'}`,
            borderRadius: '14px', fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            fontWeight: 600, outline: 'none', resize: 'vertical',
            fontFamily: 'inherit', color: '#1e293b', backgroundColor: 'white',
            transition: 'border-color 0.2s', boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={!data.prompt_detailed?.trim() || isGenerating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: 'clamp(12px, 3.5vw, 14px)', borderRadius: '14px',
            backgroundColor: data.prompt_detailed?.trim() && !isGenerating ? domainColor : '#e2e8f0',
            color: data.prompt_detailed?.trim() && !isGenerating ? 'white' : '#94a3b8',
            border: 'none', cursor: data.prompt_detailed?.trim() && !isGenerating ? 'pointer' : 'default',
            fontWeight: 900, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            fontFamily: 'inherit', transition: 'all 0.15s ease'
          }}
        >
          {isGenerating
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> AI 이미지 생성 중...</>
            : <><Sparkles size={16} /> AI 이미지 만들기</>
          }
        </button>
        <GenerateError error={genError} onRetry={handleGenerate} />
      </div>

      {data.output_detailed && (
        <GeneratedImageResult
          imageUrl={data.output_detailed}
          label="두 번째 결과"
          domainColor={domainColor}
        />
      )}
    </div>
  );
};

// ─── text_compare_ab ──────────────────────────────────────────────
const TextCompareABStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const outputA = answers['step1']?.output_initial;
  const outputB = answers['step2']?.output_detailed;

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const toggleReason = (id) => {
    const cur = data.reasons || [];
    const next = cur.includes(id) ? cur.filter(r => r !== id) : [...cur, id];
    patch({ reasons: next });
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

// ─── prompt_builder ───────────────────────────────────────────────
const PromptBuilderStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const taskType = answers['step1']?.task_type;
  const taskLabel = { poster: '환경 보호 포스터 문구', event_notice: '학교 행사 안내문', book_intro: '책 소개 글' }[taskType] || '선택한 주제';
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const patchField = (fieldId, value) => {
    const newFields = { ...data, [fieldId]: value };
    const builtPrompt = buildFullPrompt(newFields, taskLabel);
    patch({ [fieldId]: value, full_text: builtPrompt, output_revised: '' });
  };

  const filledCount = step.fields.filter(f => data[f.id]?.trim()).length;

  const handleGenerate = async () => {
    if (!data.full_text?.trim() || filledCount < (step.validation?.minFields || 3)) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const imageUrl = await generateImage(data.full_text, taskType);
      patch({ output_revised: imageUrl });
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 요소 입력 필드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
            프롬프트 요소 채우기
          </p>
          <span style={{
            fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 900,
            color: filledCount >= 3 ? domainColor : '#94a3b8',
            padding: '3px 8px', borderRadius: '999px',
            backgroundColor: filledCount >= 3 ? `${domainColor}15` : '#f1f5f9'
          }}>
            {filledCount}/{step.fields.length} 채움
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {step.fields.map(field => (
            <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 800, color: '#64748b' }}>
                {field.label}
              </label>
              <input
                type="text"
                value={data[field.id] || ''}
                onChange={e => patchField(field.id, e.target.value)}
                placeholder={field.placeholder}
                style={{
                  width: '100%', padding: 'clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px)',
                  border: `2px solid ${data[field.id]?.trim() ? domainColor + '60' : '#e2e8f0'}`,
                  borderRadius: '10px', fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)',
                  fontWeight: 600, outline: 'none',
                  fontFamily: 'inherit', color: '#1e293b', backgroundColor: 'white',
                  transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 자동 조합된 프롬프트 미리보기 */}
      {data.full_text && (
        <div className="animate-slide-up" style={{
          padding: 'clamp(12px, 3.5vw, 16px)',
          backgroundColor: '#f8fafc', borderRadius: '14px',
          border: '2px dashed #cbd5e1'
        }}>
          <p style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 900, color: '#64748b', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            완성된 프롬프트
          </p>
          <p style={{ fontSize: 'clamp(0.875rem, 2.8vw, 0.95rem)', color: '#334155', lineHeight: 1.6, margin: 0, wordBreak: 'keep-all' }}>
            {data.full_text}
          </p>
        </div>
      )}

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerate}
        disabled={filledCount < 3 || !data.full_text?.trim() || isGenerating}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: 'clamp(12px, 3.5vw, 14px)', borderRadius: '14px',
          backgroundColor: filledCount >= 3 && !isGenerating ? domainColor : '#e2e8f0',
          color: filledCount >= 3 && !isGenerating ? 'white' : '#94a3b8',
          border: 'none', cursor: filledCount >= 3 && !isGenerating ? 'pointer' : 'default',
          fontWeight: 900, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
          fontFamily: 'inherit', transition: 'all 0.15s ease'
        }}
      >
        {isGenerating
          ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> AI 이미지 생성 중...</>
          : filledCount < 3
            ? `요소를 ${3 - filledCount}개 더 채워주세요`
            : <><Sparkles size={16} /> AI 이미지 만들기</>
        }
      </button>
      <GenerateError error={genError} onRetry={handleGenerate} />

      {data.output_revised && (
        <GeneratedImageResult
          imageUrl={data.output_revised}
          label="내가 고친 결과"
          domainColor={domainColor}
        />
      )}
    </div>
  );
};

// ─── result_compare_final ─────────────────────────────────────────
const ResultCompareFinalStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
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

// ─── 공통: 생성된 이미지 카드 ────────────────────────────────────
const GeneratedImageResult = ({ imageUrl, label, domainColor }) => (
  <div className="animate-slide-up" style={{
    borderRadius: '16px', overflow: 'hidden',
    border: `2px solid ${domainColor}40`,
    boxShadow: `0 6px 20px ${domainColor}18`
  }}>
    <div style={{
      padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 16px)',
      backgroundColor: `${domainColor}0E`
    }}>
      <span style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.8rem)', fontWeight: 900, color: domainColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        AI가 만든 이미지 · {label}
      </span>
    </div>
    <img
      src={imageUrl}
      alt={`AI 생성 이미지 - ${label}`}
      style={{ width: '100%', display: 'block', aspectRatio: '1/1', objectFit: 'cover' }}
    />
  </div>
);

// ─── 공통: 생성 에러 메시지 ────────────────────────────────────────
const GenerateError = ({ error, onRetry }) => {
  if (!error) return null;
  return (
    <div className="animate-slide-up" style={{
      padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)',
      backgroundColor: '#fff1f2', borderRadius: '12px',
      border: '2px solid #fca5a5',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
    }}>
      <span style={{ fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)', color: '#b91c1c', fontWeight: 700, lineHeight: 1.4 }}>
        {error}
      </span>
      <button
        onClick={onRetry}
        style={{
          padding: '6px 12px', borderRadius: '8px',
          backgroundColor: '#b91c1c', color: 'white',
          border: 'none', cursor: 'pointer',
          fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 800,
          fontFamily: 'inherit', flexShrink: 0
        }}
      >
        다시 시도
      </button>
    </div>
  );
};

export default GCRenderer;
