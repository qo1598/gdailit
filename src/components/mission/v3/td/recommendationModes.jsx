import React, { useState } from 'react';
import { StepHeader } from './shared';

export const YesNoQuiz = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const topic = answers['step1'] || null;
  const questions = topic ? (step.questionsByTopic?.[topic] || []) : [];
  const total = questions.length;
  const [currentIdx, setCurrentIdx] = useState(0);

  const responses = answers[step.id] || [];

  const getAnswer = (qId) => {
    const found = responses.find(r => r.question_id === qId);
    return found ? found.answer : null;
  };

  const setAnswer = (qId, value) => {
    const next = responses.filter(r => r.question_id !== qId);
    next.push({ question_id: qId, answer: value });
    setAnswers(prev => ({ ...prev, [step.id]: next }));
  };

  const answeredCount = responses.length;
  const allDone = answeredCount >= total && total > 0;

  if (!topic) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
        먼저 STEP 1에서 주제를 골라주세요.
      </div>
    );
  }

  const card = questions[currentIdx];
  if (!card) return null;
  const cardAns = getAnswer(card.id);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
        {questions.map((q, i) => {
          const done = getAnswer(q.id) !== null;
          const isCurrent = i === currentIdx;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              style={{
                width: isCurrent ? '24px' : '10px', height: '10px',
                borderRadius: '999px', border: 'none', padding: 0,
                backgroundColor: done ? '#22c55e' : isCurrent ? domainColor : '#e2e8f0',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            />
          );
        })}
        <span style={{ marginLeft: '6px', fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', fontWeight: 700, color: '#94a3b8' }}>
          {currentIdx + 1} / {total}
        </span>
      </div>

      <div className="v3-card" style={{ padding: 'clamp(20px, 5vw, 28px)', marginBottom: 0, minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
        <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.77rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          질문 {currentIdx + 1}
        </div>
        <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', fontWeight: 900, color: '#1e293b', lineHeight: 1.4, wordBreak: 'keep-all' }}>
          {card.text}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[{ id: true, label: '예', color: '#22c55e' }, { id: false, label: '아니오', color: '#ef4444' }].map(opt => {
            const isSelected = cardAns === opt.id;
            return (
              <button
                key={String(opt.id)}
                onClick={() => {
                  setAnswer(card.id, opt.id);
                  if (currentIdx < total - 1) {
                    setTimeout(() => setCurrentIdx(i => i + 1), 200);
                  }
                }}
                style={{
                  flex: 1, padding: 'clamp(14px, 4vw, 18px)',
                  borderRadius: '16px',
                  border: `2.5px solid ${isSelected ? opt.color : '#e2e8f0'}`,
                  backgroundColor: isSelected ? `${opt.color}18` : '#f8fafc',
                  color: isSelected ? opt.color : '#64748b',
                  fontWeight: isSelected ? 900 : 700,
                  fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit'
                }}
              >
                {isSelected && '✓ '}{opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {currentIdx > 0 && (
          <button
            onClick={() => setCurrentIdx(i => i - 1)}
            style={{
              flex: 1, padding: 'clamp(10px, 2.5vw, 13px)',
              borderRadius: '12px', border: '2px solid #e2e8f0',
              backgroundColor: '#f8fafc', color: '#64748b',
              fontWeight: 700, fontSize: 'clamp(0.85rem, 2.5vw, 0.93rem)',
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            ← 이전
          </button>
        )}
        {currentIdx < total - 1 && (
          <button
            onClick={() => { if (cardAns !== null) setCurrentIdx(i => i + 1); }}
            style={{
              flex: 2, padding: 'clamp(10px, 2.5vw, 13px)',
              borderRadius: '12px',
              border: `2px solid ${cardAns !== null ? domainColor : '#e2e8f0'}`,
              backgroundColor: cardAns !== null ? domainColor : '#f1f5f9',
              color: cardAns !== null ? '#fff' : '#94a3b8',
              fontWeight: 800, fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)',
              cursor: cardAns !== null ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s', fontFamily: 'inherit'
            }}
          >
            다음 →
          </button>
        )}
      </div>

      {allDone && (
        <div style={{ padding: 'clamp(10px, 3vw, 14px) 16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #bbf7d0', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', fontWeight: 800, color: '#16a34a', margin: 0 }}>
            {total}개 질문 모두 답했어요!
          </p>
        </div>
      )}
    </div>
  );
};

// 1차: matchCount / totalRules 비율 (규칙 수 차이 보정)
// 2차(동점): raw matchCount (더 많은 증거 = 더 강한 일치)
export const computeRecommendation = (step, topic, responses) => {
  if (!topic || !responses?.length) return null;
  const items = step.recommendationsByTopic?.[topic]?.items || [];
  const answerMap = {};
  responses.forEach(r => { answerMap[r.question_id] = r.answer; });

  let best = null;
  let bestRatio = -1;
  let bestRaw = -1;

  items.forEach(item => {
    const total = item.matchRules.length;
    const matched = item.matchRules.filter(rule => answerMap[rule.qId] === rule.answer).length;
    const ratio = total > 0 ? matched / total : 0;

    if (ratio > bestRatio || (ratio === bestRatio && matched > bestRaw)) {
      bestRatio = ratio;
      bestRaw = matched;
      best = item;
    }
  });
  return best;
};

export const RecommendationReveal = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const topic = answers['step1'] || null;
  const responses = answers['step2'] || [];
  const recommended = computeRecommendation(step, topic, responses);

  const TOPIC_LABEL = { animal: '동물', cooking: '요리', vehicle: '탈것' };
  const ITEM_ICONS = {
    rabbit: '🐰', dog: '🐶', cat: '🐱', dolphin: '🐬', eagle: '🦅',
    penguin: '🐧', tiger: '🐯', giraffe: '🦒',
    cookie: '🍪', pizza: '🍕', fruit_skewer: '🍡', gimbap: '🍙',
    icecream: '🍦', sandwich: '🥪', pancake: '🥞', riceball: '🍙',
    sports_car: '🏎️', train: '🚆', airplane: '✈️', ship: '🚢',
    fire_truck: '🚒', police_car: '🚓', excavator: '🚜', bus: '🚌'
  };

  React.useEffect(() => {
    if (recommended && !answers[step.id]) {
      setAnswers(prev => ({ ...prev, [step.id]: recommended.id }));
    }
  }, [recommended?.id]);

  if (!topic || !recommended) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
        이전 단계를 먼저 완료해주세요.
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div className="v3-card" style={{
        padding: 'clamp(28px, 6vw, 36px) clamp(20px, 5vw, 28px)',
        textAlign: 'center', marginBottom: 0,
        border: `3px solid ${domainColor}`,
        boxShadow: `0 8px 28px ${domainColor}25`
      }}>
        <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.77rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          {TOPIC_LABEL[topic] || topic} 추천 결과
        </div>
        <div style={{ fontSize: 'clamp(56px, 16vw, 80px)', lineHeight: 1, marginBottom: '12px' }}>
          {ITEM_ICONS[recommended.id] || '🎯'}
        </div>
        <div style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
          {recommended.label}
        </div>
        <div style={{
          display: 'inline-block',
          padding: 'clamp(8px, 2vw, 10px) clamp(14px, 4vw, 20px)',
          backgroundColor: `${domainColor}15`,
          borderRadius: '999px',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
          fontWeight: 700, color: domainColor
        }}>
          너에게는 {recommended.label}이(가) 잘 어울릴 것 같아!
        </div>
      </div>
    </div>
  );
};

export const ReasonReflect = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const topic = answers['step1'] || null;
  const recommendedId = answers['step3'] || null;
  const ans = answers[step.id] || { reason_selected: [], reason_expression: '' };

  const allTags = topic ? (step.reasonTagsByTopic?.[topic] || []) : [];

  // Find recommended item to get its reasonTags for highlighting
  const topicItems = Object.values(step.reasonTagsByTopic || {});
  let highlightedTagIds = [];
  if (topic && recommendedId) {
    // We need to find the item from step3 data — passed via answers context
    // Use a data lookup from the parent step (not available here directly)
    // Instead highlight nothing — user selects freely
  }

  const toggleTag = (tagId) => {
    const current = ans.reason_selected || [];
    const next = current.includes(tagId)
      ? current.filter(id => id !== tagId)
      : [...current, tagId];
    setAnswers(prev => ({ ...prev, [step.id]: { ...ans, reason_selected: next } }));
  };

  const setText = (text) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...ans, reason_expression: text } }));
  };

  if (!topic) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
        이전 단계를 먼저 완료해주세요.
      </div>
    );
  }

  const selected = ans.reason_selected || [];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 18px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', fontWeight: 800, color: '#64748b', marginBottom: '12px', wordBreak: 'keep-all' }}>
          맞다고 생각하는 이유를 골라보세요.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: step.allowTextExpression ? '16px' : '0' }}>
          {allTags.map(tag => {
            const isSelected = selected.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                style={{
                  padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
                  borderRadius: '999px',
                  border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
                  backgroundColor: isSelected ? domainColor : '#f8fafc',
                  color: isSelected ? '#fff' : '#475569',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  wordBreak: 'keep-all', fontFamily: 'inherit'
                }}
              >
                {isSelected && '✓ '}{tag.label}
              </button>
            );
          })}
        </div>
        {step.allowTextExpression && (
          <textarea
            placeholder={step.textExpressionPlaceholder || '직접 써보세요. (선택)'}
            value={ans.reason_expression || ''}
            onChange={e => setText(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: `2px solid ${ans.reason_expression ? domainColor : '#e2e8f0'}`,
              fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              color: '#1e293b', boxSizing: 'border-box', lineHeight: 1.5,
              transition: 'border-color 0.15s'
            }}
            rows={2}
          />
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ padding: 'clamp(10px, 3vw, 14px) 16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #bbf7d0', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', fontWeight: 800, color: '#16a34a', margin: 0 }}>
            {selected.length}개 이유를 골랐어요!
          </p>
        </div>
      )}
    </div>
  );
};
