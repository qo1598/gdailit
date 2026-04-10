import React from 'react';
import TaskStepRenderer from './TaskStepRenderer';

/**
 * StageRenderer - Switches between start, intro, core, task, submit, and complete stages.
 */
const StageRenderer = ({ stage, mission, gradeSpec, stepIndex, answers, setAnswers, uiState, onStart }) => {
  const currentStep = gradeSpec.steps[stepIndex];
  const domainColor = 'var(--v3-color-' + mission.meta.domain.toLowerCase() + ')';

  switch (stage) {
    case 'start':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '48px 0', gap: '32px' }}>
          <div style={{ width: '128px', height: '128px', backgroundColor: '#f1f5f9', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', border: '2px solid #f8fafc' }}>
            🎯
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h1 className="v3-title-lg" style={{ fontSize: '2.25rem' }}>{mission.meta.title}</h1>
            <p className="v3-text-body" style={{ fontSize: '1.25rem' }}>미션을 시작할 준비가 되었나요?</p>
          </div>
          <button 
            onClick={onStart}
            className="v3-btn-next"
            style={{ backgroundColor: domainColor, width: '100%', maxWidth: '240px', padding: '20px', fontSize: '1.25rem' }}
          >
            시작하기
          </button>
        </div>
      );

    case 'intro':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {gradeSpec.intro.map((slide, idx) => (
            <div 
              key={idx} 
              className="v3-card animate-slide-up"
              style={{ animationDelay: `${idx * 150}ms`, marginBottom: '0' }}
            >
              {slide.image && (
                <div className="v3-illustration-placeholder">
                  [이미지: {slide.image.split('/').pop()}]
                </div>
              )}
              <p className="v3-text-body" style={{ color: '#1e293b' }}>
                {slide.text}
              </p>
            </div>
          ))}
        </div>
      );

    case 'core':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="v3-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <span style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '1.125rem' }}>💡</span>
               함께 생각해보아요
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {gradeSpec.coreUnderstanding.map((item) => (
                <div key={item.id} className="v3-core-question" style={{ borderColor: domainColor }}>
                   <div className="v3-core-label">질문 {item.id}</div>
                   <div className="v3-core-q-text">{item.question}</div>
                   <div className="v3-core-a-box">
                     {item.answer}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'task':
      return (
        <TaskStepRenderer
          step={currentStep}
          gradeSpec={gradeSpec}
          answers={answers}
          setAnswers={setAnswers}
          domainColor={domainColor}
        />
      );

    case 'submit':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '32px', padding: '32px 16px' }}>
          <div style={{ fontSize: '64px', animation: 'bounce 1s infinite' }}>📮</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 className="v3-title-lg">미션을 제출할까요?</h2>
            <p className="v3-text-body">지금까지 활동한 내용을 저장하고 미션을 마무리합니다.</p>
          </div>
          <div className="v3-card" style={{ width: '100%', textAlign: 'left', marginBottom: '0' }}>
             <h3 className="v3-core-label" style={{ marginBottom: '16px' }}>활동 요약</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(answers).map(key => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 700 }}>{key}</span>
                    <span style={{ color: '#334155', fontWeight: 900 }}>완료됨</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      );

    case 'complete':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '24px', padding: '48px 0' }}>
          <div style={{ width: '128px', height: '128px', backgroundColor: '#facc15', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'pulse 2s infinite' }}>
            👑
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className="v3-title-lg" style={{ fontSize: '1.875rem' }}>완벽해요!</h1>
            <p className="v3-text-body">미션을 훌륭하게 완수했습니다.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ padding: '16px 32px', backgroundColor: '#1e293b', color: 'white', fontWeight: 700, borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: 'none', cursor: 'pointer', marginTop: '24px' }}
          >
            홈으로 돌아가기
          </button>
        </div>
      );

    default:
      return null;
  }
};

export default StageRenderer;
