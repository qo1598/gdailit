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
            flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: '#fef9c3', border: '2px solid #fde047',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.15s, background-color 0.15s', marginTop: '2px'
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

export const ChipGroup = ({ label, options, selected, onToggle, domainColor, style = {} }) => (
  <div style={style}>
    <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.78rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            style={{
              padding: 'clamp(7px, 2vw, 9px) clamp(12px, 3vw, 16px)',
              borderRadius: '999px',
              border: `2px solid ${isSelected ? domainColor : '#e2e8f0'}`,
              backgroundColor: isSelected ? domainColor : '#f8fafc',
              color: isSelected ? '#fff' : '#64748b',
              fontWeight: isSelected ? 800 : 600,
              fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              wordBreak: 'keep-all'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);
