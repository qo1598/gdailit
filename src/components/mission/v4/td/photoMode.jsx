import React, { useRef } from 'react';
import { Camera, Check } from 'lucide-react';
import { StepHeader, compressImage } from './shared';

export const PhotoUpload = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const fileInputRef = useRef(null);
  const current = answers[step.id] || {};
  const hasPhoto = current.type === 'photo' && current.value;
  const selectedCardId = current.type === 'card' ? current.value : null;
  const cardOptions = step.cardOptions || [];

  const selectCard = (cardId) => {
    setAnswers(prev => ({ ...prev, [step.id]: { type: 'card', value: cardId } }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setAnswers(prev => ({ ...prev, [step.id]: { type: 'photo', value: compressed } }));
    e.target.value = '';
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {hasPhoto ? (
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
              style={{ width: '100%', display: 'block', objectFit: 'contain', backgroundColor: '#f8fafc' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: 'clamp(20px, 5vw, 28px) 20px',
              border: `3px dashed ${domainColor}`,
              borderRadius: '20px',
              backgroundColor: `${domainColor}0D`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            <div style={{
              width: 'clamp(40px, 10vw, 52px)',
              height: 'clamp(40px, 10vw, 52px)',
              borderRadius: '50%',
              backgroundColor: `${domainColor}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Camera size={Math.min(24, window.innerWidth * 0.06)} color={domainColor} strokeWidth={2} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
              <span style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 900, color: '#1e293b' }}>
                직접 사진 찍기
              </span>
              <span style={{ fontSize: 'clamp(0.75rem, 2.3vw, 0.85rem)', color: '#94a3b8', fontWeight: 600 }}>
                카메라로 찍거나 갤러리에서 올려요
              </span>
            </div>
          </button>

          {cardOptions.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8' }}>또는 아래에서 고르기</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 3vw, 12px)' }}>
                {cardOptions.map(card => {
                  const isActive = selectedCardId === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => selectCard(card.id)}
                      style={{
                        position: 'relative',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '8px',
                        padding: 'clamp(14px, 4vw, 18px) 10px',
                        borderRadius: '16px',
                        border: `2.5px solid ${isActive ? domainColor : '#e2e8f0'}`,
                        backgroundColor: isActive ? `${domainColor}12` : 'white',
                        boxShadow: isActive ? `0 6px 18px ${domainColor}30` : '0 1px 4px rgba(0,0,0,0.05)',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: 'clamp(28px, 7vw, 36px)', lineHeight: 1 }}>{card.emoji}</span>
                      <span style={{
                        fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', fontWeight: 800,
                        color: isActive ? '#1e293b' : '#475569', textAlign: 'center', wordBreak: 'keep-all'
                      }}>{card.label}</span>
                      {isActive && (
                        <div style={{
                          position: 'absolute', top: '8px', right: '8px',
                          width: '20px', height: '20px', borderRadius: '999px',
                          backgroundColor: domainColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Check size={12} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
