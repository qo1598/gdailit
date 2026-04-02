const fs = require('fs');

let code = fs.readFileSync('src/components/Mission.jsx', 'utf8');

// Normalize line endings to LF for reliable processing
code = code.replace(/\r\n/g, '\n');

// 1. 왜 중요할까요? (why)
code = code.replace(
  '<p>{mission.why}</p>', 
  '<p><VocabHighlighter text={mission.why} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></p>'
);

// 2. 예를 들어볼까요? (example)
code = code.replace(
  '<p>{mission.example}</p>', 
  '<p><VocabHighlighter text={mission.example} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></p>'
);

// 3. 목표 프롬프트
code = code.replace(
  /\{\s*prompt\s*\}/,
  '<VocabHighlighter text={prompt} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />'
);

// 4. Extract Modals
const modalBlock = `                            {/* Modals */}
                            {vocabModal.show && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                                <div className="page-enter" style={{ background: 'white', padding: '30px', borderRadius: '25px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💡</div>
                                <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.8rem', color: '#0984e3', margin: '0 0 15px 0' }}>{vocabModal.word}</h3>
                                <p style={{ color: '#2d3436', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, marginBottom: '25px', wordBreak: 'keep-all' }}>
                                    {vocabModal.desc}
                                </p>
                                <button type="button" onClick={() => setVocabModal({ show: false, word: '', desc: '' })} style={{ background: '#0984e3', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                                    이해했어요!
                                </button>
                                </div>
                            </div>
                            )}
                            {modWarning.show && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                                <div className="page-enter" style={{ background: 'white', padding: '30px', borderRadius: '25px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛑</div>
                                <h3 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.5rem', color: '#d63031', margin: '0 0 15px 0' }}>안내 메시지</h3>
                                <p style={{ color: '#2d3436', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, marginBottom: '25px', wordBreak: 'keep-all' }}>
                                    {modWarning.message}
                                </p>
                                <button type="button" onClick={() => setModWarning({ show: false, message: '' })} style={{ background: '#d63031', color: 'white', border: 'none', padding: '15px', width: '100%', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                                    네, 알겠습니다!
                                </button>
                                </div>
                            </div>
                            )}`;

if (code.includes(modalBlock)) {
  code = code.replace(modalBlock, '');
  code = code.replace(
    '            {showSuccess && (', 
    modalBlock + '\\n\\n            {showSuccess && ('
  );
  console.log('Successfully swapped Modals!');
} else {
  console.log('Could not find exact modalBlock string!');
}

// Write back with local CRLF just in case
// (VS Code and Vite handle LF fine anyway)
fs.writeFileSync('src/components/Mission.jsx', code, 'utf8');
