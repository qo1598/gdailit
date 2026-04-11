import React, { useRef } from 'react';
import { Check, Camera, Lightbulb } from 'lucide-react';
import { getIcon } from './MissionIcons';

/**
 * TDRenderer - Exploration & Identification type UI.
 * Handles uiModes: choice_cards | single_select_buttons | photo_or_card_select | judge_qa_cards | tag_select
 */
const TDRenderer = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {

  // ─── choice_cards (multi-select) ─────────────────────────────
  if (step.uiMode === 'choice_cards') {
    const selected = answers[step.id] || [];

    const toggleOption = (optionId) => {
      const isSelected = selected.includes(optionId);
      const next = isSelected
        ? selected.filter(id => id !== optionId)
        : [...selected, optionId];
      setAnswers(prev => ({ ...prev, [step.id]: next }));
    };

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        <div className="v3-choice-grid">
          {step.options.map((option, idx) => {
            const isActive = selected.includes(option.id);
            const iconEl = getIcon(option.id, Math.min(56, window.innerWidth * 0.13));
            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`v3-choice-btn ${isActive ? 'active' : ''}`}
                style={{
                  animationDelay: `${idx * 70}ms`,
                  borderColor: isActive ? domainColor : undefined,
                  boxShadow: isActive ? `0 6px 18px ${domainColor}30` : undefined
                }}
              >
                <div style={{ lineHeight: 0 }}>
                  {iconEl || (
                    <div style={{
                      width: 'clamp(44px, 12vw, 56px)',
                      height: 'clamp(44px, 12vw, 56px)',
                      borderRadius: '50%',
                      backgroundColor: `${domainColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(16px, 4vw, 20px)',
                      fontWeight: 900,
                      color: domainColor
                    }}>
                      {option.label[0]}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
                  fontWeight: 800,
                  color: isActive ? '#1e293b' : '#64748b',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  {option.label}
                </span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: 'clamp(18px, 4vw, 22px)',
                    height: 'clamp(18px, 4vw, 22px)',
                    borderRadius: '999px',
                    backgroundColor: domainColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} color="white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <SelectionHint count={selected.length} mode="multi" />
      </div>
    );
  }

  // ─── single_select_buttons ────────────────────────────────────
  if (step.uiMode === 'single_select_buttons') {
    const selected = answers[step.id] || null;
    const otherText = answers[`${step.id}_other_text`] || '';

    const selectOption = (optionId) => {
      setAnswers(prev => ({ ...prev, [step.id]: optionId }));
    };

    const iconSize = Math.min(48, window.innerWidth * 0.11);

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(10px, 3vw, 14px)'
        }}>
          {step.options.map((option, idx) => {
            const isActive = selected === option.id;
            const iconEl = getIcon(option.id, iconSize);
            return (
              <button
                key={option.id}
                onClick={() => selectOption(option.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(8px, 2vw, 10px)',
                  padding: 'clamp(16px, 4vw, 22px) clamp(10px, 3vw, 14px)',
                  borderRadius: '18px',
                  border: isActive ? `2.5px solid ${domainColor}` : '2.5px solid #e2e8f0',
                  backgroundColor: isActive ? `${domainColor}12` : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 4px 14px ${domainColor}28` : '0 1px 4px rgba(0,0,0,0.05)',
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  fontFamily: 'inherit'
                }}
              >
                <div style={{ lineHeight: 0 }}>
                  {iconEl || (
                    <div style={{
                      width: 'clamp(36px, 9vw, 48px)',
                      height: 'clamp(36px, 9vw, 48px)',
                      borderRadius: '50%',
                      backgroundColor: `${domainColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(14px, 3.5vw, 18px)',
                      fontWeight: 900,
                      color: domainColor
                    }}>
                      {option.label[0]}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
                  fontWeight: 800,
                  color: isActive ? '#1e293b' : '#64748b',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 기타 선택 시 텍스트 입력 */}
        {selected === 'other' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', fontWeight: 700, color: '#64748b' }}>
              어떤 {step.id === 'step3' ? '장소' : '도움'}인지 써보세요!
            </label>
            <input
              type="text"
              placeholder={step.id === 'step3' ? '예: 마트, 병원, 공원...' : '예: 번역하기, 그림 그리기...'}
              value={otherText}
              onChange={(e) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: e.target.value }))}
              autoFocus
              maxLength={30}
              style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 18px)',
                border: `2.5px solid ${domainColor}`,
                borderRadius: '14px',
                fontSize: 'clamp(1rem, 3vw, 1.125rem)',
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

        <SelectionHint count={selected ? 1 : 0} mode="single" />
      </div>
    );
  }

  // ─── photo_or_card_select → 사진 업로드 only ──────────────────
  if (step.uiMode === 'photo_or_card_select') {
    return <PhotoUpload step={step} answers={answers} setAnswers={setAnswers} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;
  }

  // ─── judge_qa_cards ─────────────────────────────────────────────
  // E-2-L: show QA pairs, student marks each as correct/strange
  // step.qaCards: [{ id, question, answer, correctJudgment }]
  // step.judgeOptions: [{ id, label }]
  if (step.uiMode === 'judge_qa_cards') {
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
  }

  // ─── tag_select ──────────────────────────────────────────────────
  // E-1-M step4: tag chips (single select) + optional short text
  // step.tags: [{ id, label }]
  // step.allowText?: boolean
  if (step.uiMode === 'tag_select') {
    const ans = answers[step.id] || {};
    const setTag = (tagId) => setAnswers(prev => ({ ...prev, [step.id]: { ...ans, tag: tagId } }));
    const setText = (text) => setAnswers(prev => ({ ...prev, [step.id]: { ...ans, text } }));

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
        <div className="v3-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: step.allowText ? '14px' : '0' }}>
            {step.tags.map(tag => {
              const isSelected = ans.tag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => setTag(tag.id)}
                  style={{
                    padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3.5vw, 18px)',
                    borderRadius: '999px',
                    border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                    backgroundColor: isSelected ? domainColor : '#f8fafc',
                    color: isSelected ? '#fff' : '#475569',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                    cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all'
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
          {step.allowText && (
            <textarea
              placeholder="직접 써도 좋아요. (선택)"
              value={ans.text || ''}
              onChange={e => setText(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: '2px solid #e2e8f0', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
                resize: 'none', outline: 'none', fontFamily: 'inherit',
                color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.5
              }}
              rows={2}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 UI 유형: {step.uiMode}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────

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

const SelectionHint = ({ count, mode }) => (
  <div style={{
    padding: 'clamp(10px, 3vw, 14px) 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px dashed #e2e8f0',
    textAlign: 'center'
  }}>
    <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: count > 0 ? '#64748b' : '#94a3b8', margin: 0 }}>
      {mode === 'multi'
        ? count > 0 ? `${count}개를 선택했어요!` : '카드를 눌러서 선택해보세요.'
        : count > 0 ? '선택 완료!' : '항목을 하나 선택해보세요.'
      }
    </p>
  </div>
);

// ─── Photo Upload Component ───────────────────────────────────────
const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
          else { width = Math.round((width / height) * MAX); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const PhotoUpload = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const fileInputRef = useRef(null);
  const current = answers[step.id] || {};
  const hasPhoto = current.type === 'photo' && current.value;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setAnswers(prev => ({ ...prev, [step.id]: { type: 'photo', value: compressed } }));
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* Hidden file input - camera on mobile */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {hasPhoto ? (
        /* ── 사진 있을 때: 미리보기 ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: `3px solid ${domainColor}`,
            boxShadow: `0 6px 20px ${domainColor}30`
          }}>
            <img
              src={current.value}
              alt="찍은 사진"
              style={{ width: '100%', display: 'block', maxHeight: 'clamp(200px, 45vw, 300px)', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            padding: 'clamp(10px, 3vw, 14px)',
            backgroundColor: '#f0fdf4',
            borderRadius: '14px',
            border: '2px solid #bbf7d0',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 0.95rem)', fontWeight: 700, color: '#166534', margin: 0 }}>
              사진이 잘 찍혔어요!
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: 'clamp(12px, 3vw, 14px)',
              border: `2px dashed ${domainColor}`,
              borderRadius: '14px',
              backgroundColor: 'transparent',
              color: '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 'clamp(0.875rem, 2.5vw, 0.95rem)',
              fontFamily: 'inherit'
            }}
          >
            다시 찍기
          </button>
        </div>
      ) : (
        /* ── 사진 없을 때: 업로드 버튼 ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: 'clamp(32px, 8vw, 44px) 20px',
              border: `3px dashed ${domainColor}`,
              borderRadius: '20px',
              backgroundColor: `${domainColor}0D`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(12px, 3vw, 16px)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = `${domainColor}1A`}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = `${domainColor}0D`}
          >
            <div style={{
              width: 'clamp(56px, 14vw, 72px)',
              height: 'clamp(56px, 14vw, 72px)',
              borderRadius: '50%',
              backgroundColor: `${domainColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={Math.min(32, window.innerWidth * 0.08)} color={domainColor} strokeWidth={2} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 900, color: '#1e293b' }}>
                사진 찍기
              </span>
              <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: '#94a3b8', fontWeight: 600 }}>
                카메라로 찍거나 갤러리에서 올려요
              </span>
            </div>
          </button>

          <SelectionHint count={0} mode="single" />
        </div>
      )}
    </div>
  );
};

export default TDRenderer;
