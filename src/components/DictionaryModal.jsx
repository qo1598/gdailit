import React from 'react';

const DictionaryModal = ({ isOpen, word, definition, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '30px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          textAlign: 'center',
          border: '4px solid #74b9ff',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📖</div>
        
        <h2 style={{ 
          margin: '0 0 15px 0', 
          color: '#0984e3', 
          fontSize: '1.8rem',
          fontFamily: "'Jua', sans-serif"
        }}>
          {word}
        </h2>
        
        <div style={{
          background: '#f1f2f6',
          padding: '20px',
          borderRadius: '20px',
          color: '#2d3436',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '20px',
          textAlign: 'left',
          wordBreak: 'keep-all'
        }}>
          {definition}
        </div>
        
        <button 
          onClick={onClose}
          style={{
            background: '#74b9ff',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '20px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 0 #0097e6'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          확인했어요!
        </button>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DictionaryModal;
