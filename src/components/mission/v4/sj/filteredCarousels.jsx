import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepHeader } from './shared';

const getFilteredSamples = (step, answers, gradeSpec) => {
  const sourceStepId = step.sourceStepId || 'step2';
  const filterJudgments = step.filterJudgments || ['revise', 'verify'];
  const sourceAnswers = answers[sourceStepId] || {};
  const sourceStep = gradeSpec?.steps?.find(s => s.id === sourceStepId);
  return (sourceStep?.samples || []).filter(s => filterJudgments.includes(sourceAnswers[s.id]));
};

const EmptyFiltered = ({ step, domainColor, hint, onHintClick }) => (
  <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
    <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '14px' }}>
      <p style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', margin: 0 }}>이전 단계에서 수정 또는 재검증을 선택한 응답이 없어요.</p>
    </div>
  </div>
);

// ─── FilteredReasonCarousel (filtered_reason_select) ─────────────
export const FilteredReasonCarousel = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const filteredSamples = getFilteredSamples(step, answers, gradeSpec);
  const total = filteredSamples.length;
  const [index, setIndex] = useState(0);

  const answer = answers[step.id] || {};
  const otherText = answers[`${step.id}_other_text`] || {};

  const setReason = (sampleId, reasonId) => setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [sampleId]: reasonId } }));
  const setOther = (sampleId, text) => setAnswers(prev => ({ ...prev, [`${step.id}_other_text`]: { ...(prev[`${step.id}_other_text`] || {}), [sampleId]: text } }));

  if (total === 0) return <EmptyFiltered step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;

  const safeIndex = Math.min(index, total - 1);
  const sample = filteredSamples[safeIndex];
  const selected = answer[sample.id] || null;
  const currentOther = typeof otherText === 'object' ? (otherText[sample.id] || '') : '';
  const doneCount = filteredSamples.filter(s => answer[s.id]).length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

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

// ─── FollowUpQuestionCarousel (followup_question_carousel) ───────
// step.branch.sourceStepId 의 aiBubbles 중 학생이 선택한(ans[id].selected === true) 말풍선만
// 한 개씩 카드로 보여주고, 각 말풍선에 대해 "다시 확인할 질문"을 자유 텍스트로 입력받는다.
export const FollowUpQuestionCarousel = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const branch = step.branch || {};
  const sourceStep = gradeSpec?.steps?.find(s => s.id === branch.sourceStepId);
  const sourceAns = answers[branch.sourceStepId] || {};
  const filteredBubbles = (sourceStep?.aiBubbles || []).filter(b => !!sourceAns[b.id]?.selected);
  const total = filteredBubbles.length;
  const [index, setIndex] = useState(0);

  const rawAnswer = answers[step.id];
  const answer = (rawAnswer && typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)) ? rawAnswer : {};
  const setText = (bubbleId, text) => setAnswers(prev => {
    const prevStep = prev[step.id];
    const base = (prevStep && typeof prevStep === 'object' && !Array.isArray(prevStep)) ? prevStep : {};
    return { ...prev, [step.id]: { ...base, [bubbleId]: text } };
  });

  if (total === 0) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '14px' }}>
          <p style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', margin: 0 }}>
            이전 단계에서 의심 말풍선을 고르지 않았어요. 먼저 STEP 2로 돌아가 틀린 답으로 보이는 말풍선을 선택해 주세요.
          </p>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(index, total - 1);
  const bubble = filteredBubbles[safeIndex];
  const currentText = answer[bubble.id] || '';
  const filledCount = filteredBubbles.filter(b => (answer[b.id] || '').trim()).length;
  const canGoNext = currentText.trim().length > 0;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {filteredBubbles.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              style={{
                width: i === safeIndex ? '20px' : '10px',
                height: '10px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                backgroundColor: (answer[b.id] || '').trim() ? '#22c55e' : i === safeIndex ? domainColor : '#e2e8f0',
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: filledCount === total ? '#16a34a' : '#94a3b8' }}>
          {filledCount === total ? `${total}개 모두 완료!` : `${filledCount} / ${total}개 완료`}
        </span>
      </div>

      <div className="v3-card" style={{ marginBottom: 0 }}>
        {bubble.context && (
          <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', letterSpacing: '0.04em' }}>
            Q: {bubble.context}
          </div>
        )}
        <div style={{
          padding: '9px 12px',
          backgroundColor: '#fef2f2',
          borderRadius: '8px',
          fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
          color: '#7f1d1d',
          lineHeight: 1.55,
          wordBreak: 'keep-all',
          marginBottom: '14px',
          border: '1px solid #fca5a5'
        }}>
          <span style={{ fontWeight: 700, color: '#ef4444' }}>AI: </span>{bubble.text}
        </div>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 800, color: domainColor, marginBottom: '8px', letterSpacing: '0.04em' }}>
          이 말풍선에 대해 AI에게 다시 확인할 질문
        </div>
        <textarea
          placeholder={step.placeholder || 'AI에게 다시 물어볼 질문을 써보세요. 예: 정말 그런가요? 근거가 있나요?'}
          value={currentText}
          onChange={e => setText(bubble.id, e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `2px solid ${currentText.trim() ? domainColor : '#e2e8f0'}`,
            fontSize: 'clamp(0.85rem, 2.5vw, 0.92rem)',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            color: '#1e293b',
            boxSizing: 'border-box',
            lineHeight: 1.5,
            transition: 'border-color 0.15s'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={safeIndex === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: safeIndex === 0 ? '#cbd5e1' : '#475569', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: safeIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          <ChevronLeft size={16} /> 이전
        </button>
        <button
          onClick={() => { if (canGoNext) setIndex(i => Math.min(total - 1, i + 1)); }}
          disabled={!canGoNext || safeIndex === total - 1}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: `2px solid ${canGoNext && safeIndex < total - 1 ? domainColor : '#e2e8f0'}`, backgroundColor: canGoNext && safeIndex < total - 1 ? domainColor + '18' : '#f8fafc', color: canGoNext && safeIndex < total - 1 ? domainColor : '#cbd5e1', fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', cursor: canGoNext && safeIndex < total - 1 ? 'pointer' : 'not-allowed' }}
        >
          다음 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── FilteredPlanCarousel (filtered_plan_text) ───────────────────
export const FilteredPlanCarousel = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const filteredSamples = getFilteredSamples(step, answers, gradeSpec);
  const total = filteredSamples.length;
  const [index, setIndex] = useState(0);

  const answer = answers[step.id] || {};
  const setText = (sampleId, text) => setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [sampleId]: text } }));

  if (total === 0) return <EmptyFiltered step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />;

  const safeIndex = Math.min(index, total - 1);
  const sample = filteredSamples[safeIndex];
  const currentPlan = answer[sample.id] || '';
  const filledCount = filteredSamples.filter(s => answer[s.id]?.trim()).length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

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
