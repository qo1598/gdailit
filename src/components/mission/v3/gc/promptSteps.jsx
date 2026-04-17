import React, { useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { generateImage } from '../../../../services/imagenService';
import { StepHeader, GeneratedImageResult, GenerateError } from './shared';
import { buildFullPrompt } from './utils';

// ─── task_and_prompt ──────────────────────────────────────────────
export const TaskAndPromptStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
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
      const imageUrl = await generateImage(data.prompt_initial, data.task_type, 'simple');
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
export const PromptWithConditionsStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
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
      const imageUrl = await generateImage(data.prompt_detailed, taskType, 'detailed');
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

// ─── prompt_builder ───────────────────────────────────────────────
export const PromptBuilderStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
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

// ─── prompt_single_input ──────────────────────────────────────────
export const PromptSingleInputStep = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const data = answers[step.id] || {};
  const taskType = answers['step1']?.task_type;
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const patch = (updates) =>
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), ...updates } }));

  const handleGenerate = async () => {
    if (!data.prompt_revised?.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const imageUrl = await generateImage(data.prompt_revised, taskType, 'expert');
      patch({ output_revised: imageUrl });
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = (data.prompt_revised || '').length;
  const minLength = step.validation?.minLength || 20;
  const isLongEnough = charCount >= minLength;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {/* 요소 참고 배지 */}
      {step.reminderElements && (
        <div style={{
          padding: 'clamp(10px, 3vw, 12px) 14px',
          backgroundColor: `${domainColor}0D`, borderRadius: '12px',
          border: `1.5px solid ${domainColor}30`
        }}>
          <p style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.8rem)', fontWeight: 800, color: '#64748b', margin: '0 0 8px' }}>
            포함하면 좋은 요소들 (참고만 해요)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {step.reminderElements.map(el => (
              <span key={el} style={{
                padding: '3px 10px', borderRadius: '999px',
                backgroundColor: `${domainColor}18`,
                border: `1px solid ${domainColor}40`,
                fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 700,
                color: '#475569'
              }}>
                {el}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 프롬프트 입력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.88rem)', fontWeight: 800, color: '#64748b', margin: 0 }}>
            나만의 프롬프트 작성
          </p>
          <span style={{
            fontSize: 'clamp(0.72rem, 2.2vw, 0.78rem)', fontWeight: 900,
            color: isLongEnough ? domainColor : '#94a3b8',
            padding: '3px 8px', borderRadius: '999px',
            backgroundColor: isLongEnough ? `${domainColor}15` : '#f1f5f9'
          }}>
            {charCount}자{!isLongEnough && ` (최소 ${minLength}자)`}
          </span>
        </div>
        <textarea
          value={data.prompt_revised || ''}
          onChange={e => patch({ prompt_revised: e.target.value, output_revised: '' })}
          placeholder={step.promptPlaceholder || '앞에서 배운 요소들을 활용해 나만의 프롬프트를 직접 써보세요.'}
          rows={5}
          style={{
            width: '100%', padding: 'clamp(12px, 3vw, 14px)',
            border: `2px solid ${isLongEnough ? domainColor + '80' : '#e2e8f0'}`,
            borderRadius: '14px', fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            fontWeight: 600, outline: 'none', resize: 'vertical',
            fontFamily: 'inherit', color: '#1e293b', backgroundColor: 'white',
            transition: 'border-color 0.2s', boxSizing: 'border-box',
            lineHeight: 1.6
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={!isLongEnough || isGenerating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: 'clamp(12px, 3.5vw, 14px)', borderRadius: '14px',
            backgroundColor: isLongEnough && !isGenerating ? domainColor : '#e2e8f0',
            color: isLongEnough && !isGenerating ? 'white' : '#94a3b8',
            border: 'none', cursor: isLongEnough && !isGenerating ? 'pointer' : 'default',
            fontWeight: 900, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
            fontFamily: 'inherit', transition: 'all 0.15s ease'
          }}
        >
          {isGenerating
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> AI 이미지 생성 중...</>
            : !isLongEnough
              ? `${minLength - charCount}자 더 입력해주세요`
              : <><Sparkles size={16} /> AI 이미지 만들기</>
          }
        </button>
        <GenerateError error={genError} onRetry={handleGenerate} />
      </div>

      {data.output_revised && (
        <GeneratedImageResult
          imageUrl={data.output_revised}
          label="내가 설계한 프롬프트 결과"
          domainColor={domainColor}
        />
      )}
    </div>
  );
};
