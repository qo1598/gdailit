import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { StepHeader, BranchReferencePanel } from './shared';
import { GeneratedImageResult, GenerateError, ImageModal } from '../gc/shared';
import { generateImage } from '../../../../services/imagenService';

// ─── image_view ─────────────────────────────────────────────────
export const ImageView = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => (
  <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
    <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
    <div className="v3-card" style={{ textAlign: 'center', marginBottom: 0 }}>
      {step.imageLabel && (
        <p style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>
          {step.imageLabel}
        </p>
      )}
      <img
        src={step.imageUrl}
        alt={step.imageLabel || '이미지'}
        style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #e2e8f0' }}
      />
      {!answers[step.id] && (
        <button
          onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true } }))}
          style={{
            marginTop: '16px', padding: '10px 28px', borderRadius: '12px',
            backgroundColor: domainColor, color: '#fff', fontWeight: 700,
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', border: 'none', cursor: 'pointer'
          }}
        >
          확인했어요
        </button>
      )}
      {answers[step.id] && (
        <p style={{ marginTop: '12px', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: domainColor, fontWeight: 700 }}>
          ✓ 확인 완료
        </p>
      )}
    </div>
  </div>
);

// ─── defect_select ──────────────────────────────────────────────
export const DefectSelect = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || { markers: [] };
  const markers = answer.markers || [];
  const [activeIdx, setActiveIdx] = useState(null);

  const imgRef = React.useRef(null);

  const handleImageClick = (e) => {
    if (markers.length >= (step.maxMarkers || 6)) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newMarker = { id: Date.now(), x, y, category: null };
    const newMarkers = [...markers, newMarker];
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], markers: newMarkers } }));
    setActiveIdx(newMarkers.length - 1);
  };

  const setCategory = (idx, categoryId) => {
    const updated = markers.map((m, i) => i === idx ? { ...m, category: categoryId } : m);
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], markers: updated } }));
    setActiveIdx(null);
  };

  const removeMarker = (idx) => {
    const updated = markers.filter((_, i) => i !== idx);
    setAnswers(prev => ({ ...prev, [step.id]: { ...prev[step.id], markers: updated } }));
    if (activeIdx === idx) setActiveIdx(null);
  };

  const catColors = { nature: '#ef4444', physics: '#f59e0b', anatomy: '#8b5cf6', scene: '#06b6d4', visual_error: '#ef4444', style_issue: '#f59e0b', purpose_gap: '#8b5cf6', info_delivery: '#06b6d4' };
  const getCatColor = (catId) => catColors[catId] || domainColor;
  const categorized = markers.filter(m => m.category).length;
  const minMarkers = step.minMarkers || 2;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div className="v3-card" style={{ marginBottom: 0, padding: 'clamp(8px, 2vw, 12px)' }}>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.8rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textAlign: 'center' }}>
          그림에서 이상한 부분을 터치하세요 ({categorized}/{minMarkers}개 이상)
        </div>
        <div
          style={{ position: 'relative', cursor: markers.length < (step.maxMarkers || 6) ? 'crosshair' : 'default', userSelect: 'none' }}
          onClick={handleImageClick}
        >
          <img
            ref={imgRef}
            src={step.imageUrl}
            alt="분석할 이미지"
            draggable={false}
            style={{ width: '100%', display: 'block', borderRadius: '10px', border: '1px solid #e2e8f0' }}
          />
          {markers.map((m, i) => (
            <div
              key={m.id}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(activeIdx === i ? null : i); }}
              style={{
                position: 'absolute',
                left: `${m.x}%`, top: `${m.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 'clamp(28px, 6vw, 36px)', height: 'clamp(28px, 6vw, 36px)',
                borderRadius: '50%',
                backgroundColor: m.category ? getCatColor(m.category) : domainColor,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontWeight: 900,
                border: `3px solid #fff`,
                boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
                cursor: 'pointer',
                zIndex: activeIdx === i ? 10 : 2,
                transition: 'transform 0.15s',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {markers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {markers.map((marker, mi) => {
            const cat = (step.defectCategories || []).find(c => c.id === marker.category);
            const isActive = activeIdx === mi;
            return (
              <div key={marker.id} className="v3-card" style={{
                marginBottom: 0, padding: 'clamp(10px, 2.5vw, 14px)',
                borderLeft: `4px solid ${marker.category ? getCatColor(marker.category) : '#cbd5e1'}`,
                boxShadow: isActive ? `0 0 0 2px ${domainColor}40` : undefined,
              }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: marker.category && !isActive ? 0 : '8px', cursor: marker.category ? 'pointer' : 'default' }}
                  onClick={() => { if (marker.category) setActiveIdx(isActive ? null : mi); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      backgroundColor: marker.category ? getCatColor(marker.category) : '#cbd5e1',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 900, flexShrink: 0,
                    }}>
                      {mi + 1}
                    </span>
                    <span style={{ fontSize: 'clamp(0.82rem, 2.4vw, 0.92rem)', fontWeight: 700, color: marker.category ? '#1e293b' : '#94a3b8' }}>
                      {cat ? `${cat.label}${isActive ? '' : ' ✎'}` : '오류 유형을 선택하세요'}
                    </span>
                  </div>
                  <button onClick={() => removeMarker(mi)} style={{
                    width: '24px', height: '24px', borderRadius: '50%', border: 'none',
                    backgroundColor: '#fee2e2', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <X size={13} color="#ef4444" />
                  </button>
                </div>

                {(!marker.category || isActive) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(step.defectCategories || []).map(c => {
                      const selected = marker.category === c.id;
                      const color = getCatColor(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCategory(mi, c.id)}
                          style={{
                            padding: 'clamp(5px, 1.5vw, 7px) clamp(10px, 2.5vw, 14px)',
                            borderRadius: '999px',
                            border: `2px solid ${selected ? color : '#e2e8f0'}`,
                            backgroundColor: selected ? `${color}18` : '#f8fafc',
                            color: selected ? color : '#64748b',
                            fontWeight: selected ? 800 : 600,
                            fontSize: 'clamp(0.75rem, 2.2vw, 0.85rem)',
                            cursor: 'pointer', transition: 'all 0.12s',
                          }}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
        border: `2px dashed ${categorized >= minMarkers ? '#22c55e' : '#e2e8f0'}`,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700, margin: 0,
          color: categorized >= minMarkers ? '#16a34a' : '#94a3b8'
        }}>
          {categorized >= minMarkers
            ? `${categorized}개 오류를 분류했어요!`
            : `${categorized} / ${minMarkers}개 이상 표시하고 유형을 선택해야 해요`}
        </p>
      </div>
    </div>
  );
};

// ─── defect_reason ──────────────────────────────────────────────
export const DefectReason = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const sourceStepId = step.branch?.sourceStepId;
  const sourceAnswer = answers[sourceStepId] || {};
  const markers = sourceAnswer.markers || [];
  const sourceStep = gradeSpec?.steps?.find(s => s.id === sourceStepId);
  const categories = sourceStep?.defectCategories || step.defectCategories || [];

  const answer = answers[step.id] || {};

  const catColors = { nature: '#ef4444', physics: '#f59e0b', anatomy: '#8b5cf6', scene: '#06b6d4', visual_error: '#ef4444', style_issue: '#f59e0b', purpose_gap: '#8b5cf6', info_delivery: '#06b6d4' };
  const getCatColor = (catId) => catColors[catId] || domainColor;

  const answeredCount = markers.filter((_, i) => answer[`reason_${i}`]?.trim()).length;

  if (markers.length === 0) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
        <div className="v3-card" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: 0 }}>
          이전 단계에서 오류를 먼저 표시해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {markers.map((marker, mi) => {
        const cat = categories.find(c => c.id === marker.category);
        const color = getCatColor(marker.category);
        const reasonKey = `reason_${mi}`;
        return (
          <div key={mi} className="v3-card" style={{
            marginBottom: 0, padding: 'clamp(10px, 2.5vw, 14px)',
            borderLeft: `4px solid ${color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 900, flexShrink: 0,
              }}>
                {mi + 1}
              </span>
              <span style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', fontWeight: 800, color: '#1e293b' }}>
                {cat?.label || '오류'} — 왜 이상한가요?
              </span>
            </div>
            <textarea
              placeholder={step.placeholder || '이 부분이 왜 이상한지 이유를 써보세요.'}
              value={answer[reasonKey] || ''}
              onChange={e => setAnswers(prev => ({
                ...prev,
                [step.id]: { ...(prev[step.id] || {}), [reasonKey]: e.target.value }
              }))}
              rows={2}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: `1.5px solid ${answer[reasonKey]?.trim() ? color : '#e2e8f0'}`,
                fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', resize: 'none',
                outline: 'none', fontFamily: 'inherit', color: '#1e293b',
                boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s'
              }}
            />
          </div>
        );
      })}

      <div style={{
        padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
        border: `2px dashed ${answeredCount === markers.length ? '#22c55e' : '#e2e8f0'}`,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700, margin: 0,
          color: answeredCount === markers.length ? '#16a34a' : '#94a3b8'
        }}>
          {answeredCount === markers.length
            ? `${markers.length}개 모두 이유를 적었어요!`
            : `${answeredCount} / ${markers.length}개 이유 작성됨`}
        </p>
      </div>
    </div>
  );
};

// ─── prompt_single_input ────────────────────────────────────────
export const PromptSingleInput = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const revisedPrompt = answer._revisedPrompt || '';
  const generatedImage = answer._generatedImage;
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const setPromptText = (text) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), _revisedPrompt: text } }));
  };

  const handleGenerate = async () => {
    if (!revisedPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const imageUrl = await generateImage(revisedPrompt, 'poster', 'detailed');
      setAnswers(prev => ({
        ...prev,
        [step.id]: { ...prev[step.id], _generatedImage: imageUrl }
      }));
      setModalOpen(true);
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const minLen = step.validation?.minLength || 0;
  const canGenerate = revisedPrompt.trim().length >= minLen;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <BranchReferencePanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />

      {step.showSideBySide && step.originalImageUrl && (
        <div className="v3-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            원본 이미지
          </div>
          <img src={step.originalImageUrl} alt="원본" style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
          {step.originalPrompt && (
            <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: 'clamp(0.78rem, 2.3vw, 0.85rem)', color: '#64748b', fontWeight: 600 }}>
              원래 요청: "{step.originalPrompt}"
            </div>
          )}
        </div>
      )}

      {step.revisionGuide && (
        <div style={{
          padding: '10px 14px', backgroundColor: '#fef9c3', borderRadius: '10px',
          border: '1.5px solid #fde047', fontSize: 'clamp(0.78rem, 2.3vw, 0.85rem)',
          color: '#854d0e', fontWeight: 600, lineHeight: 1.5
        }}>
          {step.revisionGuide}
        </div>
      )}

      <div className="v3-card" style={{ marginBottom: 0 }}>
        <textarea
          placeholder={step.placeholder || '수정 요청문을 작성하세요.'}
          value={revisedPrompt}
          onChange={e => setPromptText(e.target.value)}
          rows={5}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: `2px solid ${canGenerate ? domainColor : '#e2e8f0'}`,
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
            outline: 'none', fontFamily: 'inherit', color: '#1e293b',
            boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.15s'
          }}
        />
        {minLen > 0 && (
          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: revisedPrompt.length >= minLen ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
            {revisedPrompt.length} / {minLen}자 이상
          </div>
        )}
      </div>

      {!generatedImage && (
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          style={{
            padding: 'clamp(14px, 3.5vw, 18px)',
            borderRadius: '14px', border: 'none',
            backgroundColor: !canGenerate ? '#cbd5e1' : isGenerating ? '#94a3b8' : domainColor,
            color: '#fff', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 800,
            fontFamily: 'inherit',
            cursor: !canGenerate || isGenerating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: canGenerate && !isGenerating ? `0 4px 14px ${domainColor}40` : 'none',
            transition: 'all 0.2s'
          }}
        >
          {isGenerating ? (
            <><Loader2 size={20} className="animate-spin" /> AI가 그림을 그리고 있어요...</>
          ) : (
            <><ImageIcon size={20} /> AI에게 수정된 그림 요청하기</>
          )}
        </button>
      )}

      <GenerateError error={genError} onRetry={handleGenerate} />

      {generatedImage && (
        <GeneratedImageResult imageUrl={generatedImage} label="수정 요청으로 만든 그림" domainColor={domainColor} />
      )}
      {modalOpen && generatedImage && (
        <ImageModal src={generatedImage} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

// ─── prompt_with_conditions ─────────────────────────────────────
export const PromptWithConditions = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const conditions = answer._conditions || {};
  const revisedPrompt = answer._revisedPrompt || '';
  const generatedImage = answer._generatedImage;
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const setCondition = (fieldId, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), _conditions: { ...(prev[step.id]?._conditions || {}), [fieldId]: value } }
    }));
  };

  const setPromptText = (text) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), _revisedPrompt: text } }));
  };

  const handleGenerate = async () => {
    if (!revisedPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const imageUrl = await generateImage(revisedPrompt, 'poster', 'expert');
      setAnswers(prev => ({
        ...prev,
        [step.id]: { ...prev[step.id], _generatedImage: imageUrl }
      }));
      setModalOpen(true);
    } catch (err) {
      setGenError(err.message || '이미지 생성에 실패했어요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const conditionFields = step.conditionFields || [];
  const filledConditions = conditionFields.filter(f => conditions[f.id]?.trim()).length;
  const minLen = step.validation?.minLength || 0;
  const canGenerate = revisedPrompt.trim().length >= minLen;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <BranchReferencePanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />

      {step.showSideBySide && step.originalImageUrl && (
        <div className="v3-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            원본 이미지
          </div>
          <img src={step.originalImageUrl} alt="원본" style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
          {step.originalPrompt && (
            <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: 'clamp(0.78rem, 2.3vw, 0.85rem)', color: '#64748b', fontWeight: 600 }}>
              원래 요청: "{step.originalPrompt}"
            </div>
          )}
        </div>
      )}

      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 'clamp(0.75rem, 2.3vw, 0.85rem)', fontWeight: 800, color: '#64748b', marginBottom: '12px' }}>
          조건 정리 ({filledConditions}/{conditionFields.length})
        </div>
        {conditionFields.map(field => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: 'clamp(0.78rem, 2.3vw, 0.85rem)', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={conditions[field.id] || ''}
              onChange={e => setCondition(field.id, e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                border: `1.5px solid ${conditions[field.id]?.trim() ? domainColor : '#e2e8f0'}`,
                fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', outline: 'none',
                fontFamily: 'inherit', color: '#1e293b', boxSizing: 'border-box',
                transition: 'border-color 0.15s'
              }}
            />
          </div>
        ))}
      </div>

      <div className="v3-card" style={{ marginBottom: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px',
          fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 800, color: domainColor, textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>
          <Sparkles size={14} /> 최종 프롬프트
        </div>
        <textarea
          placeholder={step.placeholder || '조건을 모두 담아 최종 프롬프트를 작성하세요.'}
          value={revisedPrompt}
          onChange={e => setPromptText(e.target.value)}
          rows={6}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: `2px solid ${canGenerate ? domainColor : '#e2e8f0'}`,
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
            outline: 'none', fontFamily: 'inherit', color: '#1e293b',
            boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.15s'
          }}
        />
        {minLen > 0 && (
          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: revisedPrompt.length >= minLen ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
            {revisedPrompt.length} / {minLen}자 이상
          </div>
        )}
      </div>

      {!generatedImage && (
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          style={{
            padding: 'clamp(14px, 3.5vw, 18px)',
            borderRadius: '14px', border: 'none',
            backgroundColor: !canGenerate ? '#cbd5e1' : isGenerating ? '#94a3b8' : domainColor,
            color: '#fff', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 800,
            fontFamily: 'inherit',
            cursor: !canGenerate || isGenerating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: canGenerate && !isGenerating ? `0 4px 14px ${domainColor}40` : 'none',
            transition: 'all 0.2s'
          }}
        >
          {isGenerating ? (
            <><Loader2 size={20} className="animate-spin" /> AI가 그림을 그리고 있어요...</>
          ) : (
            <><ImageIcon size={20} /> 최종 프롬프트로 AI 그림 요청하기</>
          )}
        </button>
      )}

      <GenerateError error={genError} onRetry={handleGenerate} />

      {generatedImage && (
        <GeneratedImageResult imageUrl={generatedImage} label="개선된 프롬프트로 만든 그림" domainColor={domainColor} />
      )}
      {modalOpen && generatedImage && (
        <ImageModal src={generatedImage} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

// ─── image_carousel_text (이미지 참조 캐러셀 + 서술형) ──────────
export const ImageCarouselText = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const questions = step.questions || [];
  const placeholders = step.placeholders || [];
  const total = questions.length;
  const answeredCount = questions.filter(q => answer[q.id]?.trim()).length;
  const minAnswered = step.validation?.minAnswered || total;

  const firstEmpty = questions.findIndex(q => !answer[q.id]?.trim());
  const [idx, setIdx] = useState(firstEmpty === -1 ? 0 : firstEmpty);
  const safeIdx = Math.min(idx, total - 1);
  const q = questions[safeIdx];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {step.imageUrl && (
        <div className="v3-card" style={{ marginBottom: 0, padding: 'clamp(6px, 1.5vw, 10px)' }}>
          <img
            src={step.imageUrl}
            alt="참고 이미지"
            style={{ width: '100%', display: 'block', borderRadius: '10px', border: '1px solid #e2e8f0' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 'clamp(22px, 5.5vw, 28px)', height: 'clamp(22px, 5.5vw, 28px)',
                borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                backgroundColor: answer[questions[i].id]?.trim() ? domainColor : i === safeIdx ? domainColor + '40' : '#e2e8f0',
                color: answer[questions[i].id]?.trim() || i === safeIdx ? '#fff' : '#94a3b8',
                fontSize: 'clamp(0.68rem, 1.8vw, 0.78rem)', fontWeight: 900,
                transition: 'all 0.15s',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: answeredCount >= minAnswered ? '#16a34a' : '#94a3b8' }}>
          {answeredCount} / {total}개
        </span>
      </div>

      {q && (
        <div className="v3-card" style={{
          marginBottom: 0,
          borderLeft: `4px solid ${answer[q.id]?.trim() ? domainColor : '#e2e8f0'}`,
        }}>
          <div style={{
            fontSize: 'clamp(0.92rem, 2.8vw, 1.02rem)', fontWeight: 800,
            color: '#1e293b', lineHeight: 1.5, marginBottom: '12px', wordBreak: 'keep-all',
          }}>
            {q.text}
          </div>
          <textarea
            placeholder={placeholders[safeIdx] || '여기에 답을 써보세요.'}
            value={answer[q.id] || ''}
            onChange={e => setAnswers(prev => ({
              ...prev,
              [step.id]: { ...(prev[step.id] || {}), [q.id]: e.target.value }
            }))}
            rows={step.rowsPerField || 3}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: `2px solid ${answer[q.id]?.trim() ? domainColor : '#e2e8f0'}`,
              fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', resize: 'none',
              outline: 'none', fontFamily: 'inherit', color: '#1e293b',
              boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={safeIdx === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: '2px solid #e2e8f0', backgroundColor: '#f8fafc',
            color: safeIdx === 0 ? '#cbd5e1' : '#475569',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: safeIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeft size={16} /> 이전
        </button>
        <button
          onClick={() => setIdx(i => Math.min(total - 1, i + 1))}
          disabled={safeIdx === total - 1}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: `2px solid ${safeIdx < total - 1 ? domainColor : '#e2e8f0'}`,
            backgroundColor: safeIdx < total - 1 ? domainColor + '18' : '#f8fafc',
            color: safeIdx < total - 1 ? domainColor : '#cbd5e1',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: safeIdx < total - 1 ? 'pointer' : 'not-allowed',
          }}
        >
          다음 <ChevronRight size={16} />
        </button>
      </div>

      <div style={{
        padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
        border: `2px dashed ${answeredCount >= minAnswered ? '#22c55e' : '#e2e8f0'}`,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700, margin: 0,
          color: answeredCount >= minAnswered ? '#16a34a' : '#94a3b8',
        }}>
          {answeredCount >= minAnswered
            ? `${answeredCount}개 질문 모두 답했어요!`
            : `${answeredCount} / ${minAnswered}개 답함`}
        </p>
      </div>
    </div>
  );
};

// ─── criteria_star_rating (기준별 별점 + 이유) ──────────────────
export const CriteriaStarRating = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const answer = answers[step.id] || {};
  const criteria = step.criteria || [];
  const total = criteria.length;
  const doneCount = criteria.filter(c => answer[c.id]?.rating > 0 && answer[c.id]?.reason?.trim()).length;

  const setCriterion = (criterionId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: {
        ...(prev[step.id] || {}),
        [criterionId]: { ...(prev[step.id]?.[criterionId] || {}), [field]: value }
      }
    }));
  };

  const starLabels = ['', '많이 부족해요', '부족해요', '보통이에요', '잘 됐어요', '아주 잘 됐어요'];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />
      <BranchReferencePanel step={step} gradeSpec={gradeSpec} answers={answers} domainColor={domainColor} />

      {criteria.map((c, ci) => {
        const data = answer[c.id] || {};
        const rating = data.rating || 0;
        return (
          <div key={c.id} className="v3-card" style={{
            marginBottom: 0,
            borderLeft: `4px solid ${rating > 0 ? domainColor : '#e2e8f0'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: rating > 0 && data.reason?.trim() ? domainColor : '#e2e8f0',
                color: rating > 0 && data.reason?.trim() ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 900,
              }}>
                {ci + 1}
              </span>
              <span style={{ fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                {c.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setCriterion(c.id, 'rating', star)}
                  style={{
                    width: 'clamp(34px, 8vw, 42px)', height: 'clamp(34px, 8vw, 42px)',
                    border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                    fontSize: 'clamp(22px, 5.5vw, 28px)',
                    color: star <= rating ? '#f59e0b' : '#e2e8f0',
                    transition: 'color 0.1s, transform 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span style={{ marginLeft: '6px', fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: '#f59e0b' }}>
                  {starLabels[rating]}
                </span>
              )}
            </div>

            {rating > 0 && (
              <textarea
                placeholder={c.placeholder || '왜 그렇게 생각했는지 이유를 써보세요.'}
                value={data.reason || ''}
                onChange={e => setCriterion(c.id, 'reason', e.target.value)}
                rows={2}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px',
                  border: `1.5px solid ${data.reason?.trim() ? domainColor : '#e2e8f0'}`,
                  fontSize: 'clamp(0.82rem, 2.4vw, 0.88rem)', resize: 'none',
                  outline: 'none', fontFamily: 'inherit', color: '#1e293b',
                  boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s',
                }}
              />
            )}
          </div>
        );
      })}

      <div style={{
        padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
        border: `2px dashed ${doneCount === total ? '#22c55e' : '#e2e8f0'}`,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', fontWeight: 700, margin: 0,
          color: doneCount === total ? '#16a34a' : '#94a3b8',
        }}>
          {doneCount === total
            ? `${total}개 기준 모두 평가 완료!`
            : `${doneCount} / ${total}개 기준 평가됨 (별점 + 이유 모두 필요)`}
        </p>
      </div>
    </div>
  );
};
