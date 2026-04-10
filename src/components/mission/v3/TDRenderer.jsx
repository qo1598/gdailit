import React from 'react';
import { Check } from 'lucide-react';

/**
 * TDRenderer - Exploration & Identification type UI.
 * Used for missions like E-1-L where students find and identify AI.
 */
const TDRenderer = ({ step, answers, setAnswers, domainColor }) => {
  const selected = answers[step.id] || [];

  const toggleOption = (optionId) => {
    const isSelected = selected.includes(optionId);
    let newSelected;
    if (isSelected) {
      newSelected = selected.filter(id => id !== optionId);
    } else {
      newSelected = [...selected, optionId];
    }
    setAnswers(prev => ({ ...prev, [step.id]: newSelected }));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
      <div className="v3-card" style={{ marginBottom: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ width: '16px', height: '4px', borderRadius: '999px', backgroundColor: domainColor }}></span>
             {step.title}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', lineHeight: 1.2, breakKeep: 'auto' }}>
            {step.question}
          </h3>
        </div>
        
        {step.uiMode === 'choice_cards' && (
          <div className="v3-choice-grid">
            {step.options.map((option, idx) => {
              const isActive = selected.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`v3-choice-btn ${isActive ? 'active' : ''}`}
                  style={{ 
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
                  <div 
                    className={`v3-icon-circle ${isActive ? 'active' : ''}`}
                    style={{ 
                      backgroundColor: isActive ? domainColor : '#f1f5f9', 
                      color: isActive ? 'white' : '#cbd5e1'
                    }}
                  >
                    <Check size={32} strokeWidth={isActive ? 4 : 2} />
                  </div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: isActive ? '#1e293b' : '#94a3b8' }}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '16px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
         <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#94a3b8' }}>
           {selected.length > 0 
             ? `총 ${selected.length}개를 선택했어요!` 
             : '그림을 눌러서 선택해보세요.'}
         </p>
      </div>
    </div>
  );
};

export default TDRenderer;
