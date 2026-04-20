import React from 'react';
import { Check } from 'lucide-react';
import { StepHeader } from './shared';

// answers[stepId]가 string/object 어느 쪽이든 "한 문장"으로 뽑아낸다.
function extractSentence(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object') {
    if (typeof val.text === 'string') return val.text.trim();
    if (typeof val.input === 'string') return val.input.trim();
  }
  return '';
}

// 하위 필드 추출기: answers[stepId][field] 또는 answers[stepId]
function extractRef(answers, ref) {
  const v = answers[ref.stepId];
  if (v == null) return '';
  if (ref.field && typeof v === 'object') {
    const fv = v[ref.field];
    return typeof fv === 'string' ? fv.trim() : '';
  }
  return extractSentence(v);
}

// ─── free_text_with_refs ──────────────────────────────────────────
// 앞 스텝의 결과를 읽기 전용으로 보여주고, 마지막 문장을 작성.
// step.refs: [{ stepId, label, field? }]
export const FreeTextWithRefs = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const value = answers[step.id] || '';

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {(step.refs || []).length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          padding: 'clamp(12px, 3vw, 16px)', borderRadius: '14px',
          backgroundColor: `${domainColor}08`, border: `1.5px solid ${domainColor}33`
        }}>
          <div style={{
            fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 900,
            color: domainColor, letterSpacing: '0.06em'
          }}>
            지금까지 쓴 장면
          </div>
          {(step.refs || []).map((ref, i) => {
            const text = extractRef(answers, ref);
            return (
              <div key={`${ref.stepId}:${ref.field || ''}:${i}`} style={{
                display: 'flex', flexDirection: 'column', gap: '6px',
                padding: '10px 12px', borderRadius: '10px',
                backgroundColor: 'white', border: '1px solid #e2e8f0'
              }}>
                <span style={{
                  alignSelf: 'flex-start',
                  fontSize: 'clamp(0.68rem, 2vw, 0.74rem)', fontWeight: 800,
                  color: '#64748b', backgroundColor: '#f1f5f9',
                  padding: '3px 8px', borderRadius: '999px'
                }}>
                  {i + 1}. {ref.label}
                </span>
                <span style={{
                  fontSize: 'clamp(0.88rem, 2.7vw, 0.96rem)', color: '#1e293b',
                  fontWeight: 600, lineHeight: 1.7, wordBreak: 'keep-all', whiteSpace: 'pre-wrap'
                }}>
                  {text || '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="v3-card" style={{ marginBottom: 0 }}>
        <textarea
          placeholder={step.placeholder || '마지막 문장을 써보세요.'}
          value={value}
          onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: `2px solid ${value ? domainColor : '#e2e8f0'}`,
            fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            resize: 'none', outline: 'none', fontFamily: 'inherit',
            color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.6,
            transition: 'border-color 0.15s'
          }}
          rows={3}
        />
      </div>
    </div>
  );
};

// ─── option_adopt_hold ────────────────────────────────────────────
// step2 aiOptionPicker(_meta).options 에서 채택/보류 각 1개를 라디오로 고르고
// 각각의 이유를 작성한다.
// answer: { adopt_index, adopt_text, adopt_reason, hold_index, hold_text, hold_reason }
export const OptionAdoptHold = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const ans = answers[step.id] || {};
  const sourceId = step.branch?.sourceStepId || 'step2';
  const options = (answers[`${sourceId}_meta`]?.options) || [];

  const update = (patch) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...patch } }));

  const renderBlock = (kind, title, indexKey, textKey, reasonKey, placeholder, disabledIndex) => (
    <div className="v3-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        fontSize: 'clamp(0.9rem, 2.6vw, 1rem)', fontWeight: 900,
        color: domainColor, letterSpacing: '0.04em'
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => {
          const isActive = ans[indexKey] === i;
          const isDisabled = disabledIndex === i;
          return (
            <button key={i}
              onClick={() => !isDisabled && update({ [indexKey]: i, [textKey]: opt })}
              disabled={isDisabled}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: 'clamp(10px, 3vw, 14px)', borderRadius: '12px',
                border: isActive ? `2.5px solid ${domainColor}` : '2px solid #e2e8f0',
                backgroundColor: isDisabled ? '#f1f5f9' : (isActive ? `${domainColor}10` : 'white'),
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                textAlign: 'left', fontFamily: 'inherit', width: '100%',
                transition: 'all 0.15s'
              }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                border: isActive ? `2px solid ${domainColor}` : '2px solid #cbd5e1',
                backgroundColor: isActive ? domainColor : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '2px'
              }}>
                {isActive && <Check size={12} color="white" strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', fontWeight: 900,
                  color: domainColor, marginBottom: '4px'
                }}>
                  후보 {i + 1}{isDisabled ? ' (다른 쪽에서 선택함)' : ''}
                </div>
                <div style={{
                  fontSize: 'clamp(0.95rem, 2.9vw, 1.05rem)',
                  fontWeight: isActive ? 700 : 500,
                  color: '#1e293b', lineHeight: 1.7, wordBreak: 'keep-all', whiteSpace: 'pre-wrap'
                }}>
                  {opt}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <textarea
        placeholder={placeholder}
        value={ans[reasonKey] || ''}
        onChange={e => update({ [reasonKey]: e.target.value })}
        rows={3}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: '10px',
          border: `2px solid ${ans[reasonKey] ? domainColor : '#e2e8f0'}`,
          fontSize: 'clamp(0.98rem, 2.9vw, 1.05rem)',
          resize: 'none', outline: 'none', fontFamily: 'inherit',
          color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.6
        }}
      />
    </div>
  );

  if (options.length === 0) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
        <div style={{
          padding: '20px', borderRadius: '12px',
          backgroundColor: '#fef3c7', border: '1.5px solid #fcd34d',
          fontSize: '0.9rem', color: '#78350f', fontWeight: 700, textAlign: 'center'
        }}>
          이전 STEP에서 AI 줄거리 후보를 먼저 받아주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      {renderBlock(
        'adopt', '✅ 채택안 — 어떤 줄거리를 고를까요?',
        'adopt_index', 'adopt_text', 'adopt_reason',
        step.adoptPlaceholder || '왜 이 줄거리를 채택했나요?',
        ans.hold_index
      )}
      {renderBlock(
        'hold', '⏸ 보류안 — 어떤 줄거리를 보류할까요?',
        'hold_index', 'hold_text', 'hold_reason',
        step.holdPlaceholder || '왜 이 줄거리는 보류했나요?',
        ans.adopt_index
      )}
    </div>
  );
};

// ─── sentence_pick_with_reason ────────────────────────────────────
// step.sources: [{ stepId, label }] — 각 소스 스텝의 문장을 라디오 카드로 제시.
// answer: { pickedStepId, pickedText, reason }
export const SentencePickWithReason = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const ans = answers[step.id] || {};
  const picked = ans.pickedStepId || null;
  const reason = ans.reason || '';

  const pick = (stepId, text) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), pickedStepId: stepId, pickedText: text }
    }));
  };
  const setReason = (text) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), reason: text }
    }));
  };

  const sources = (step.sources || []).map(src => ({
    ...src, text: extractSentence(answers[src.stepId])
  })).filter(s => s.text);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sources.map((src, i) => {
          const isActive = picked === src.stepId;
          return (
            <button key={src.stepId} onClick={() => pick(src.stepId, src.text)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: 'clamp(12px, 3.5vw, 16px)', borderRadius: '14px',
                border: isActive ? `2.5px solid ${domainColor}` : '2px solid #e2e8f0',
                backgroundColor: isActive ? `${domainColor}10` : 'white',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%',
                boxShadow: isActive ? `0 4px 14px ${domainColor}25` : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s'
              }}>
              <div style={{
                width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)',
                borderRadius: '50%',
                border: isActive ? `2px solid ${domainColor}` : '2px solid #cbd5e1',
                backgroundColor: isActive ? domainColor : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '2px'
              }}>
                {isActive && <Check size={12} color="white" strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'clamp(0.7rem, 2vw, 0.76rem)', fontWeight: 900,
                  color: domainColor, letterSpacing: '0.04em', marginBottom: '6px'
                }}>
                  문장 {i + 1} · {src.label}
                </div>
                <div style={{
                  fontSize: 'clamp(0.9rem, 2.8vw, 0.98rem)',
                  fontWeight: isActive ? 700 : 600,
                  color: '#1e293b', lineHeight: 1.6, wordBreak: 'keep-all'
                }}>
                  {src.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="animate-slide-up v3-card" style={{ marginBottom: 0 }}>
          <label style={{
            display: 'block',
            fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)', fontWeight: 800, color: '#64748b',
            marginBottom: '8px'
          }}>
            이 문장을 고른 이유는?
          </label>
          <textarea
            placeholder={step.placeholder || '왜 이 문장을 가장 남기고 싶은지 써보세요.'}
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '10px',
              border: `2px solid ${reason ? domainColor : '#e2e8f0'}`,
              fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.6
            }}
            rows={3}
          />
        </div>
      )}
    </div>
  );
};
