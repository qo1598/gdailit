import React from 'react';

const ModerationModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.6)', 
      zIndex: 10000, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }}>
      <div className="page-enter" style={{ 
        background: 'white', 
        padding: '35px 30px', 
        borderRadius: '30px', 
        maxWidth: '400px', 
        width: '100%', 
        textAlign: 'center', 
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '4px solid #fab1a0'
      }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '15px' }}>🛑</div>
        <h3 style={{ 
          fontFamily: "'NanumSquareNeo-Variable', 'Jua', sans-serif", 
          fontSize: '1.8rem', 
          color: '#d63031', 
          margin: '0 0 15px 0',
          fontWeight: '900'
        }}>잠깐만요!</h3>
        <p style={{ 
          color: '#2d3436', 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          lineHeight: 1.6, 
          marginBottom: '30px', 
          wordBreak: 'keep-all' 
        }}>
          {message || '예쁜 말을 사용해주세요! 우리 모두를 존중하는 대화를 나눠요. 🌻'}
        </p>
        <button 
          onClick={onClose} 
          style={{ 
            background: 'linear-gradient(135deg, #d63031, #ff7675)', 
            color: 'white', 
            border: 'none', 
            padding: '18px', 
            width: '100%', 
            borderRadius: '20px', 
            fontWeight: '900', 
            fontSize: '1.2rem', 
            cursor: 'pointer',
            boxShadow: '0 8px 0 #af2323',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          네, 알겠습니다!
        </button>
      </div>
    </div>
  );
};

export default ModerationModal;
