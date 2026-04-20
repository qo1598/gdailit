import React, { useState } from 'react';
import { Check, Sparkles, Loader2, RefreshCw, Edit3 } from 'lucide-react';
import { generateText } from '../../../../services/geminiTextService';
import { StepHeader, GenerateError, PrevContextPanel } from './shared';

// aiCall.userPromptTemplate의 {stepN}, {stepN_field} 토큰을 answers에서 치환
function resolveTemplate(template, answers, steps) {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    // stepN_field (객체 답의 하위 필드) — multi_free_text·ai_chat_turn 등
    const sub = key.match(/^(step\d+)_(\w+)$/);
    if (sub) {
      const [, stepKey, field] = sub;
      const v = answers[stepKey];
      if (v && typeof v === 'object' && v[field] != null) return String(v[field]);
      if (v && typeof v === 'object' && field === 'selected' && typeof v.text === 'string') return v.text;
      return '';
    }
    // stepN — 답이 문자열/배열/객체일 때 표시용 텍스트로 변환
    const v = answers[key];
    if (v == null) return '';
    if (typeof v === 'string') {
      // 옵션 id면 라벨로 치환
      const step = steps?.find(s => s.id === key);
      if (step?.options) {
        const opt = step.options.find(o => o.id === v);
        if (opt) return opt.label;
      }
      return v;
    }
    if (Array.isArray(v)) {
      const step = steps?.find(s => s.id === key);
      if (step?.chips) {
        return step.chips.filter(c => v.includes(c.id)).map(c => c.label).join(', ');
      }
      if (step?.options) {
        return step.options.filter(o => v.includes(o.id)).map(o => o.label).join(', ');
      }
      return v.join(', ');
    }
    if (typeof v === 'object') {
      if (typeof v.text === 'string') return v.text;
      if (typeof v.input === 'string') return v.input;
    }
    return '';
  });
}

// ─── ai_option_picker ─────────────────────────────────────────────
export const AiOptionPickerStep = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const saved = answers[step.id];
  const meta = answers[step.id + '_meta'] || {};
  const options = meta.options || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState(typeof saved === 'string' && !options.includes(saved) ? saved : '');

  const setMeta = (patch) =>
    setAnswers(prev => ({ ...prev, [step.id + '_meta']: { ...(prev[step.id + '_meta'] || {}), ...patch } }));

  const setSelection = (value) =>
    setAnswers(prev => ({ ...prev, [step.id]: value }));

  const runGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const userPrompt = resolveTemplate(step.aiCall.userPromptTemplate, answers, gradeSpec.steps);
      const parseMode = step.aiCall.outputSchema === 'options_block' ? 'options_block' : 'options_list';
      const result = await generateText({
        systemPrompt: step.aiCall.systemPrompt,
        userPrompt,
        mode: parseMode,
        maxTokens: step.aiCall.maxTokens,
        temperature: step.aiCall.temperature,
      });
      const limited = result.slice(0, step.optionCount || 3);
      setMeta({ options: limited, generated: true });
    } catch (e) {
      const fb = step.aiCall?.fallback?.options || [];
      if (fb.length > 0) {
        setMeta({ options: fb.slice(0, step.optionCount || 3), generated: true, usedFallback: true });
        setError('AI 응답이 느려요. 미리 준비된 후보를 보여드릴게요.');
      } else {
        setError(e.message || 'AI 호출에 실패했어요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setSelection(undefined);
    setMeta({ options: [], generated: false, usedFallback: false });
    runGenerate();
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) return;
    setSelection(customText.trim());
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {!meta.generated && !loading && (
        <button
          onClick={runGenerate}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: 'clamp(14px, 4vw, 16px)', borderRadius: '14px',
            backgroundColor: domainColor, color: 'white', border: 'none', cursor: 'pointer',
            fontWeight: 900, fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', fontFamily: 'inherit',
            boxShadow: `0 4px 14px ${domainColor}40`
          }}
        >
          <Sparkles size={18} /> AI에게 후보 요청하기
        </button>
      )}

      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          padding: 'clamp(18px, 5vw, 24px)', borderRadius: '14px',
          backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1'
        }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: domainColor }} />
          <span style={{ fontSize: 'clamp(0.85rem, 2.6vw, 0.95rem)', fontWeight: 700, color: '#64748b' }}>
            AI가 후보를 만들고 있어요…
          </span>
        </div>
      )}

      {error && !loading && options.length === 0 && (
        <GenerateError error={error} onRetry={runGenerate} />
      )}

      {options.length > 0 && (
        <>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '12px',
              backgroundColor: '#fefce8', border: '1.5px solid #fde68a',
              fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)', color: '#713f12', fontWeight: 700
            }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map((opt, i) => {
              const isActive = saved === opt;
              const selectable = step.selectable !== false;
              const Tag = selectable ? 'button' : 'div';
              return (
                <Tag key={i}
                  {...(selectable ? { onClick: () => { setSelection(opt); setShowCustom(false); } } : {})}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: 'clamp(12px, 3.5vw, 16px)', borderRadius: '14px',
                    border: isActive ? `2.5px solid ${domainColor}` : '2px solid #e2e8f0',
                    backgroundColor: isActive ? `${domainColor}10` : 'white',
                    cursor: selectable ? 'pointer' : 'default',
                    textAlign: 'left', fontFamily: 'inherit', width: '100%',
                    boxShadow: isActive ? `0 4px 14px ${domainColor}25` : '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s'
                  }}>
                  {selectable && (
                    <div style={{
                      width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)',
                      borderRadius: '50%',
                      border: isActive ? `2px solid ${domainColor}` : '2px solid #cbd5e1',
                      backgroundColor: isActive ? domainColor : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                    }}>
                      {isActive && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)', fontWeight: 900,
                      color: domainColor, letterSpacing: '0.04em', marginBottom: '6px'
                    }}>
                      후보 {i + 1}
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.98rem, 3vw, 1.08rem)',
                      fontWeight: isActive ? 700 : 600,
                      color: '#1e293b', lineHeight: 1.75, wordBreak: 'keep-all', whiteSpace: 'pre-wrap'
                    }}>
                      {opt}
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {step.allowRegenerate !== false && (
              <button onClick={handleRegenerate} disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 14px', borderRadius: '10px',
                  backgroundColor: 'white', color: domainColor,
                  border: `1.5px solid ${domainColor}55`, cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 2.4vw, 0.88rem)', fontWeight: 800, fontFamily: 'inherit'
                }}>
                <RefreshCw size={14} /> 다른 후보 받기
              </button>
            )}
            {step.allowCustomInput && (
              <button onClick={() => setShowCustom(s => !s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 14px', borderRadius: '10px',
                  backgroundColor: 'white', color: '#475569',
                  border: '1.5px solid #cbd5e1', cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 2.4vw, 0.88rem)', fontWeight: 800, fontFamily: 'inherit'
                }}>
                <Edit3 size={14} /> {step.customInputLabel || '내 말로 쓰기'}
              </button>
            )}
          </div>

          {showCustom && step.allowCustomInput && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="내 문장을 직접 써보세요"
                rows={3}
                style={{
                  width: '100%', padding: '12px', border: '2px solid #e2e8f0',
                  borderRadius: '12px', fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
                  fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box'
                }}
              />
              <button onClick={handleCustomSubmit} disabled={!customText.trim()}
                style={{
                  alignSelf: 'flex-start', padding: '10px 16px', borderRadius: '10px',
                  backgroundColor: customText.trim() ? domainColor : '#e2e8f0',
                  color: customText.trim() ? 'white' : '#94a3b8',
                  border: 'none', cursor: customText.trim() ? 'pointer' : 'default',
                  fontWeight: 800, fontSize: 'clamp(0.85rem, 2.5vw, 0.92rem)', fontFamily: 'inherit'
                }}>
                이 문장으로 확정하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── ai_chat_turn ─────────────────────────────────────────────────
export const AiChatTurnStep = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const [input, setInput] = useState(data.input ?? step.studentInputDefault ?? '');
  const [applyText, setApplyText] = useState(data.apply || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const retries = data.retries || 0;
  const maxRetries = step.maxRetries ?? 3;

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const runAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    patch({ input: input.trim() });
    try {
      // userPromptTemplate에 {stepN_input} 형태로 현재 입력을 참조할 수 있도록 임시 주입
      const tempAnswers = { ...answers, [step.id]: { input: input.trim() } };
      const userPrompt = resolveTemplate(step.aiCall.userPromptTemplate, tempAnswers, gradeSpec.steps);
      const result = await generateText({
        systemPrompt: step.aiCall.systemPrompt,
        userPrompt,
        mode: 'chat',
        maxTokens: step.aiCall.maxTokens,
        temperature: step.aiCall.temperature,
      });
      patch({ input: input.trim(), aiResponse: result, retries });
    } catch (e) {
      const fallbackText = step.aiCall?.fallback?.text || step.aiCall?.fallback?.options?.[0];
      if (fallbackText) {
        patch({ input: input.trim(), aiResponse: fallbackText, usedFallback: true, retries });
        setError('AI 응답이 느려요. 미리 준비된 답변을 보여드릴게요.');
      } else {
        setError(e.message || 'AI 호출에 실패했어요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retries >= maxRetries) return;
    patch({ retries: retries + 1, aiResponse: '' });
    runAI();
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <PrevContextPanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
          {step.studentInputLabel || '내 질문'}
        </p>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={step.studentInputPlaceholder || ''}
          rows={3}
          disabled={loading}
          style={{
            width: '100%', padding: 'clamp(12px, 3vw, 14px)',
            border: `2px solid ${input.trim() ? domainColor + '80' : '#e2e8f0'}`,
            borderRadius: '14px', fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box'
          }}
        />
        {!data.aiResponse && (
          <button onClick={runAI} disabled={!input.trim() || loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: 'clamp(12px, 3.5vw, 14px)', borderRadius: '14px',
              backgroundColor: input.trim() && !loading ? domainColor : '#e2e8f0',
              color: input.trim() && !loading ? 'white' : '#94a3b8',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontWeight: 900, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)', fontFamily: 'inherit'
            }}>
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> AI가 답변 중…</>
              : <><Sparkles size={16} /> AI에게 보내기</>}
          </button>
        )}
      </div>

      {error && !data.aiResponse && <GenerateError error={error} onRetry={runAI} />}

      {data.aiResponse && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '12px',
              backgroundColor: '#fefce8', border: '1.5px solid #fde68a',
              fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)', color: '#713f12', fontWeight: 700
            }}>
              {error}
            </div>
          )}
          <div style={{
            padding: 'clamp(14px, 3.5vw, 18px)',
            borderRadius: '14px',
            backgroundColor: `${domainColor}0C`,
            border: `1.5px solid ${domainColor}33`
          }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.78rem)', fontWeight: 900, color: domainColor,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px'
            }}>
              {step.aiResponseLabel || 'AI의 답변'}
            </div>
            <div style={{
              fontSize: 'clamp(0.9rem, 2.8vw, 0.98rem)',
              color: '#1e293b', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'keep-all'
            }}>
              {data.aiResponse}
            </div>
          </div>

          {step.allowRetry && retries < maxRetries && (
            <button onClick={handleRetry} disabled={loading}
              style={{
                alignSelf: 'flex-start',
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 14px', borderRadius: '10px',
                backgroundColor: 'white', color: domainColor,
                border: `1.5px solid ${domainColor}55`, cursor: 'pointer',
                fontSize: 'clamp(0.8rem, 2.4vw, 0.88rem)', fontWeight: 800, fontFamily: 'inherit'
              }}>
              <RefreshCw size={14} /> 질문 다시 보내기 ({retries}/{maxRetries})
            </button>
          )}

          {step.applyInputLabel && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
                {step.applyInputLabel}
              </p>
              <textarea
                value={applyText}
                onChange={e => setApplyText(e.target.value)}
                onBlur={() => patch({ apply: applyText.trim() })}
                placeholder={step.applyInputPlaceholder || ''}
                rows={3}
                style={{
                  width: '100%', padding: 'clamp(12px, 3vw, 14px)',
                  border: `2px solid ${applyText.trim() ? domainColor + '80' : '#e2e8f0'}`,
                  borderRadius: '14px', fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
                  fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
