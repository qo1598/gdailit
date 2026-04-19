import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepHeader } from './shared';

const JUDGMENT_COLORS = { use: '#22c55e', revise: '#f59e0b', verify: '#3b82f6' };

// ─── SampleFullCarousel (sample_full_carousel) ────────────────────
export const SampleFullCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
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

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          이 답변을 어떻게 처리할까요?
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(step.judgmentOptions || []).map(opt => {
            const isSelected = sampleAns.judgment === opt.id;
            const accent = JUDGMENT_COLORS[opt.id] || domainColor;
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

// ─── MonitorCarousel (monitor_display) ───────────────────────────
export const MonitorCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const samples = step.samples || [];
  const total = samples.length;
  const [index, setIndex] = useState(0);
  const confirmed = answers[step.id]?.confirmed;
  const sample = samples[index];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {samples.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)} style={{ width: i === index ? '20px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0, backgroundColor: i === index ? domainColor : '#e2e8f0', transition: 'all 0.2s' }} />
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: '#94a3b8' }}>{index + 1} / {total}</span>
      </div>

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

// ─── PerResponseJudgeCarousel (per_response_judge) ───────────────
export const PerResponseJudgeCarousel = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const samples = step.samples || [];
  const total = samples.length;
  const answer = answers[step.id] || {};

  const firstUnjudged = samples.findIndex(s => !answer[s.id]);
  const [index, setIndex] = useState(firstUnjudged === -1 ? 0 : firstUnjudged);

  const sample = samples[index];
  const selected = answer[sample.id] || null;
  const judgedCount = Object.keys(answer).length;

  const setJudgment = (judgeId) => {
    const next = { ...answer, [sample.id]: judgeId };
    setAnswers(prev => ({ ...prev, [step.id]: next }));
    const nextUnjudged = samples.findIndex((s, i) => i !== index && !next[s.id]);
    if (nextUnjudged !== -1) setTimeout(() => setIndex(nextUnjudged), 350);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

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
            const accent = JUDGMENT_COLORS[opt.id] || domainColor;
            return (
              <button key={opt.id} onClick={() => setJudgment(opt.id)} style={{ flex: 1, padding: 'clamp(10px, 2.5vw, 13px) clamp(4px, 1vw, 8px)', borderRadius: '12px', border: `2px solid ${isSelected ? accent : '#e2e8f0'}`, backgroundColor: isSelected ? accent + '18' : '#f8fafc', color: isSelected ? accent : '#64748b', fontWeight: isSelected ? 800 : 600, fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', cursor: 'pointer', transition: 'all 0.15s', wordBreak: 'keep-all', textAlign: 'center' }}>
                {isSelected && '✓ '}{opt.label}
                {opt.desc && <div style={{ fontSize: 'clamp(0.6rem, 1.6vw, 0.68rem)', opacity: 0.8, marginTop: '2px' }}>{opt.desc}</div>}
              </button>
            );
          })}
        </div>
      </div>

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
