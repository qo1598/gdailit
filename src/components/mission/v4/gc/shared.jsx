import React from 'react';
import { X, Lightbulb } from 'lucide-react';

// ─── 이미지 모달 ───────────────────────────────────────────────────
export const ImageModal = ({ src, onClose }) => (
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
export const StepHeader = ({ step, domainColor, hint, onHintClick }) => (
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

export const SelectionHint = ({ count, mode, chosenImage, chosenReason }) => {
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

// ─── 공통: 생성된 이미지 카드 ────────────────────────────────────
export const GeneratedImageResult = ({ imageUrl, label, domainColor }) => (
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

// ─── 이전 단계 맥락 패널 ──────────────────────────────────────────
// branch.sourceStepId (string) 또는 step.contextStepIds (array) 로 지정된
// 이전 단계들의 응답을 요약해 보여준다. uiMode별로 포맷을 달리한다.
export const PrevContextPanel = ({ step, gradeSpec, answers, domainColor }) => {
  if (!gradeSpec) return null;
  const ids = step.contextStepIds
    || (step.branch?.sourceStepId ? [step.branch.sourceStepId] : []);
  if (ids.length === 0) return null;

  const blocks = ids.map(id => {
    const src = gradeSpec.steps?.find(s => s.id === id);
    const ans = answers?.[id];
    if (!src || ans == null) return null;
    const title = src.title?.replace(/^STEP\s*\d+\s*·\s*/i, '').trim() || src.id;

    // ai_chat_turn
    if (src.uiMode === 'ai_chat_turn' && typeof ans === 'object') {
      const rows = [];
      if (ans.input) rows.push({ k: '내 질문', v: ans.input });
      if (ans.aiResponse) rows.push({ k: 'AI 제안', v: ans.aiResponse });
      if (ans.apply) rows.push({ k: '내가 반영한 점', v: ans.apply });
      return { id, title, rows };
    }

    // multi_free_text
    if (src.uiMode === 'multi_free_text' && typeof ans === 'object') {
      const rows = (src.questions || [])
        .map(q => ({ k: q.text.split('(')[0].trim().replace(/[?？]$/, ''), v: ans[q.id] }))
        .filter(r => r.v && String(r.v).trim());
      return { id, title, rows };
    }

    // chips / array
    if (Array.isArray(ans) && src.chips) {
      const labels = src.chips.filter(c => ans.includes(c.id)).map(c => c.label);
      if (labels.length === 0) return null;
      return { id, title, rows: [{ k: null, v: labels.join(', ') }] };
    }

    if (typeof ans === 'string' && ans.trim()) {
      return { id, title, rows: [{ k: null, v: ans }] };
    }

    return null;
  }).filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div style={{
      padding: 'clamp(12px, 3vw, 14px)',
      borderRadius: '14px',
      background: `${domainColor}08`,
      border: `1.5px dashed ${domainColor}55`,
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{
        fontSize: 'clamp(0.7rem, 2vw, 0.76rem)', fontWeight: 900,
        color: domainColor, letterSpacing: '0.08em', textTransform: 'uppercase'
      }}>
        이전 단계에서 내가 쓴 내용
      </div>
      {blocks.map(b => (
        <div key={b.id} style={{
          padding: '10px 12px', background: '#fff',
          borderRadius: '10px', border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: 'clamp(0.74rem, 2.2vw, 0.8rem)', fontWeight: 800,
            color: '#475569', marginBottom: '6px'
          }}>
            {b.title}
          </div>
          {b.rows.map((r, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : '6px' }}>
              {r.k && (
                <div style={{
                  fontSize: 'clamp(0.68rem, 2vw, 0.74rem)', fontWeight: 800,
                  color: '#94a3b8', marginBottom: '2px'
                }}>
                  {r.k}
                </div>
              )}
              <div style={{
                fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                color: '#1e293b', lineHeight: 1.55,
                whiteSpace: 'pre-wrap', wordBreak: 'keep-all'
              }}>
                {r.v}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── 공통: 생성 에러 메시지 ────────────────────────────────────────
export const GenerateError = ({ error, onRetry }) => {
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
