import React from 'react';
import { Lightbulb } from 'lucide-react';

export const StepHeader = ({ step, domainColor, hint, onHintClick }) => (
  <div className="v3-card" style={{ marginBottom: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <span style={{ width: 'clamp(12px, 3vw, 16px)', height: '4px', borderRadius: '999px', backgroundColor: domainColor, flexShrink: 0 }} />
      <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {step.title}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 900, color: '#1e293b', lineHeight: 1.3, margin: 0, wordBreak: 'keep-all', flex: 1 }}>
        {step.question}
      </h3>
      {hint && (
        <button
          onClick={onHintClick}
          title="힌트 보기"
          style={{
            flexShrink: 0,
            width: '36px', height: '36px',
            borderRadius: '50%',
            backgroundColor: '#fef9c3',
            border: '2px solid #fde047',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s, background-color 0.15s',
            marginTop: '2px'
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef08a'; e.currentTarget.style.transform = 'scale(1.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fef9c3'; e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(1.12)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Lightbulb size={18} color="#ca8a04" strokeWidth={2.2} />
        </button>
      )}
    </div>
  </div>
);

export const SelectionHint = ({ count, mode }) => (
  <div style={{
    padding: 'clamp(10px, 3vw, 14px) 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px dashed #e2e8f0',
    textAlign: 'center'
  }}>
    <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 700, color: count > 0 ? '#64748b' : '#94a3b8', margin: 0 }}>
      {mode === 'multi'
        ? count > 0 ? `${count}개를 선택했어요!` : '카드를 눌러서 선택해보세요.'
        : count > 0 ? '선택 완료!' : '항목을 하나 선택해보세요.'
      }
    </p>
  </div>
);

export const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
          else { width = Math.round((width / height) * MAX); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
