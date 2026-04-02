const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'components', 'Mission.jsx');
let code = fs.readFileSync(targetPath, 'utf8');

// Normalize CRLF to LF just in case
code = code.replace(/\r\n/g, '\n');

// 1. Inject visibleHints state
const searchState = "const [modWarning, setModWarning] = useState({ show: false, message: '' });";
if (code.includes(searchState) && !code.includes('const [visibleHints, setVisibleHints] = useState({});')) {
    code = code.replace(
        searchState,
        searchState + '\n\n    const [visibleHints, setVisibleHints] = useState({});\n    const toggleHint = (id) => {\n        setVisibleHints(prev => ({ ...prev, [id]: !prev[id] }));\n    };'
    );
}

// 2. Replace stackedInputs rendering with Hint UI version
const targetBlock = `                            {currentStackedInputs?.length > 0 ? (
                                <div className="stacked-inputs-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                                    {currentStackedInputs.map((inputDef) => (
                                        <div key={inputDef.id} className="stacked-input-group">
                                            {inputDef.label && <div style={{ fontWeight: 'bold', color: '#2d3436', marginBottom: '10px', fontSize: '1.05rem' }}>{inputDef.label}</div>}
                                            {inputDef.type === 'textarea' ? (
                                                <textarea
                                                    rows={3}
                                                    value={stackedAnswers[inputDef.id] || ''}
                                                    onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                    placeholder={inputDef.placeholder}
                                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                    required
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={stackedAnswers[inputDef.id] || ''}
                                                    onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                    placeholder={inputDef.placeholder}
                                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (`;

const newBlock = `                            {currentStackedInputs?.length > 0 ? (
                                <div className="stacked-inputs-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                                    {currentStackedInputs.map((inputDef) => (
                                        <div key={inputDef.id} className="stacked-input-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                {inputDef.label && <div style={{ fontWeight: 'bold', color: '#2d3436', fontSize: '1.05rem' }}>{inputDef.label}</div>}
                                                {inputDef.placeholder && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleHint(inputDef.id)}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: 'pointer',
                                                            fontSize: '1.3rem', padding: '0 5px', opacity: 0.8,
                                                            transition: 'transform 0.2s, text-shadow 0.2s',
                                                            transform: visibleHints[inputDef.id] ? 'scale(1.15)' : 'scale(1)',
                                                            textShadow: visibleHints[inputDef.id] ? '0 0 10px rgba(255,215,0,0.8)' : 'none'
                                                        }}
                                                        title="힌트 보기"
                                                    >
                                                        💡
                                                    </button>
                                                )}
                                            </div>
                                            {visibleHints[inputDef.id] && inputDef.placeholder && (
                                                <div style={{
                                                    background: '#fff9c4', border: '2px dashed #fbc02d', borderRadius: '10px',
                                                    padding: '12px 15px', marginBottom: '15px', color: '#f57f17', fontSize: '0.95rem',
                                                    display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5,
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in'
                                                }}>
                                                    <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>💁</span>
                                                    <span><strong>힌트 도우미:</strong> <VocabHighlighter text={inputDef.placeholder} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
                                                </div>
                                            )}
                                            {inputDef.type === 'textarea' ? (
                                                <textarea
                                                    rows={3}
                                                    value={stackedAnswers[inputDef.id] || ''}
                                                    onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                    placeholder="여기에 생각이나 분석을 자유롭게 적어보세요..."
                                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                    required
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={stackedAnswers[inputDef.id] || ''}
                                                    onChange={(e) => handleStackedChange(inputDef.id, e.target.value)}
                                                    placeholder="핵심 단어나 문장을 적어보세요..."
                                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #dfe6e9', fontSize: '1.05rem', fontFamily: "'Nunito', sans-serif" }}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (`

// Now, handle potential indentation differences smoothly by using regex space ignoring
const patternMatch = new RegExp(targetBlock.replace(/\\s+/g, '\\\\s+').replace(/[.*+?^$\{()|\\[\\]\\\\]/g, '\\\\$&').replace(/\\\\s\\\+/g, '\\s+'));

if (code.includes(targetBlock)) {
    code = code.replace(targetBlock, newBlock);
    fs.writeFileSync(targetPath, code, 'utf8');
    console.log('Successfully injected Hint UI!');
} else {
    // Try regex-based loose space matching
    // Wait, regex might be too complex and throw error.
    // Let's just strip spaces and find index
    const codeNoSpaces = code.replace(/\\s+/g, '');
    const targetNoSpaces = targetBlock.replace(/\\s+/g, '');
    if (codeNoSpaces.includes(targetNoSpaces)) {
        // Find exact start and end in original code? Much harder.
        // I will just use a simpler replace block.
        console.log('Target block has slight mismatch in whitespaces, attempting naive fallback...');
        const lines = code.split('\\n');
        // Let's just try to fallback to modifying textarea placeholders if I can't overwrite the whole block
    } else {
        console.error('Could not find target block even without spaces.');
    }
}
