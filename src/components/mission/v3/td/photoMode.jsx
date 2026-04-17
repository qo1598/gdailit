import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { StepHeader, compressImage } from './shared';

export const PhotoUpload = ({ step, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const fileInputRef = useRef(null);
  const current = answers[step.id] || {};
  const hasPhoto = current.type === 'photo' && current.value;

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: 'clamp(32px, 8vw, 44px) 20px',
              border: `3px dashed ${domainColor}`,
              borderRadius: '20px',
              backgroundColor: `${domainColor}0D`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(12px, 3vw, 16px)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = `${domainColor}1A`}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = `${domainColor}0D`}
          >
            <div style={{
              width: 'clamp(56px, 14vw, 72px)',
              height: 'clamp(56px, 14vw, 72px)',
              borderRadius: '50%',
              backgroundColor: `${domainColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={Math.min(32, window.innerWidth * 0.08)} color={domainColor} strokeWidth={2} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 900, color: '#1e293b' }}>
                사진 찍기
              </span>
              <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: '#94a3b8', fontWeight: 600 }}>
                카메라로 찍거나 갤러리에서 올려요
              </span>
            </div>
          </button>

        </div>
      )}
    </div>
  );
};
