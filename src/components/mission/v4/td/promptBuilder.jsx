import React, { useState } from 'react';
import { Check, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { StepHeader } from './shared';
import { generateImage } from '../../../../services/imagenService';
import { GeneratedImageResult, GenerateError } from '../gc/shared';

export const PromptBuilder = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const selections = answers[step.id] || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const phase = selections._phase || 'select';
  const generatedImage = selections._generatedImage;

  const selectChip = (slotId, optionId) => {
    const next = { ...selections, [slotId]: optionId };
    setAnswers(prev => ({ ...prev, [step.id]: next }));
  };

  const allFilled = (step.slots || []).every(s => selections[s.id]);

  const buildPromptText = () => {
    if (!step.promptTemplate) return null;
    let text = step.promptTemplate;
    for (const slot of step.slots || []) {
      const chosen = slot.options.find(o => o.id === selections[slot.id]);
      text = text.replace(`{${slot.id}}`, chosen ? chosen.label : `[${slot.label}]`);
    }
    return text;
  };

  const promptText = buildPromptText();

  const handleGenerate = async () => {
    if (!allFilled || isGenerating) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const taskType = step.aiCall?.taskType || 'event_notice';
      const imageUrl = await generateImage(promptText, taskType, 'detailed');
      setAnswers(prev => ({
        ...prev,
        [step.id]: { ...prev[step.id], _generatedImage: imageUrl }
      }));
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 페이즈 1: 빈칸 채우기
  if (phase === 'select') {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3.5vw, 20px)' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

        {(step.slots || []).map((slot, si) => (
          <div key={slot.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', animationDelay: `${si * 80}ms` }}>
            <div style={{
              fontSize: 'clamp(0.8rem, 2.5vw, 0.92rem)',
              fontWeight: 800,
              color: selections[slot.id] ? domainColor : '#64748b',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'color 0.2s'
            }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%',
                backgroundColor: selections[slot.id] ? domainColor : '#e2e8f0',
                color: selections[slot.id] ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 900,
                transition: 'all 0.2s'
              }}>
                {selections[slot.id] ? <Check size={13} strokeWidth={3} /> : si + 1}
              </span>
              {slot.label}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {slot.options.map(opt => {
                const active = selections[slot.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => selectChip(slot.id, opt.id)}
                    style={{
                      padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3vw, 18px)',
                      borderRadius: '999px',
                      border: `2px solid ${active ? domainColor : '#e2e8f0'}`,
                      backgroundColor: active ? `${domainColor}15` : '#fff',
                      color: active ? domainColor : '#475569',
                      fontWeight: active ? 800 : 600,
                      fontSize: 'clamp(0.82rem, 2.6vw, 0.95rem)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: active ? `0 2px 8px ${domainColor}25` : 'none'
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 페이즈 2: 완성된 요청 문장 + AI 그림 생성
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3.5vw, 20px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {promptText && (
        <div style={{
          padding: 'clamp(16px, 4vw, 22px)',
          borderRadius: '16px',
          backgroundColor: `${domainColor}08`,
          border: `2px solid ${domainColor}40`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px',
            fontSize: 'clamp(0.7rem, 2vw, 0.78rem)', fontWeight: 800, color: domainColor, textTransform: 'uppercase', letterSpacing: '0.06em'
          }}>
            <Sparkles size={14} />
            완성된 요청 문장
          </div>
          <p style={{
            margin: 0,
            fontSize: 'clamp(1rem, 3.2vw, 1.15rem)',
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.6,
            wordBreak: 'keep-all'
          }}>
            {promptText}
          </p>
        </div>
      )}

      {!generatedImage && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            padding: 'clamp(16px, 4vw, 20px)',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: isGenerating ? '#94a3b8' : domainColor,
            color: '#fff',
            fontSize: 'clamp(1rem, 3.2vw, 1.15rem)',
            fontWeight: 800,
            fontFamily: 'inherit',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: isGenerating ? 'none' : `0 4px 14px ${domainColor}40`,
            transition: 'all 0.2s'
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              AI가 그림을 그리고 있어요...
            </>
          ) : (
            <>
              <ImageIcon size={22} />
              AI에게 그림 요청하기
            </>
          )}
        </button>
      )}

      <GenerateError error={genError} onRetry={handleGenerate} />

      {generatedImage && (
        <GeneratedImageResult
          imageUrl={generatedImage}
          label="내 요청으로 만든 그림"
          domainColor={domainColor}
        />
      )}
    </div>
  );
};
