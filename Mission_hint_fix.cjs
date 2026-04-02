const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'components', 'Mission.jsx');
let code = fs.readFileSync(targetPath, 'utf8');

// Normalize line endings to LF for reliable processing
code = code.replace(/\r\n/g, '\n');

// 1. Inject visibleHints state & toggleHint function
const searchState = "const [modWarning, setModWarning] = useState({ show: false, message: '' });";
const stateChunk = `    const [visibleHints, setVisibleHints] = useState({});
    const toggleHint = (id) => {
        setVisibleHints(prev => ({ ...prev, [id]: !prev[id] }));
    };`;

if (code.includes(searchState) && !code.includes('setVisibleHints')) {
    code = code.replace(searchState, searchState + '\n' + stateChunk);
    console.log('Injected visibleHints state.');
}

// 2. Modify stackedInputs rendering (the loop)
// Identification: the entire block starting from {currentStackedInputs?.length > 0 ? (
const stackedBlockStart = "{currentStackedInputs?.length > 0 ? (";
const stackedBlockEnd = ") : (";

// We want to find the sequence until currentType !== 'rules'
// Let's use a simpler marker replacement for the inner loop content
const loopSearchPattern = `{inputDef.label && <div style={{ fontWeight: 'bold', color: '#2d3436', marginBottom: '10px', fontSize: '1.05rem' }}>{inputDef.label}</div>}`;
const loopReplacement = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                {inputDef.label && <div style={{ fontWeight: 'bold', color: '#2d3436', fontSize: '1.05rem' }}>{inputDef.label}</div>}
                                                {inputDef.placeholder && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => toggleHint(inputDef.id)}
                                                        style={{ 
                                                            background: 'none', border: 'none', cursor: 'pointer', 
                                                            fontSize: '1.3rem', padding: '0 5px', opacity: 0.8,
                                                            transition: 'transform 0.2s',
                                                            transform: visibleHints[inputDef.id] ? 'scale(1.15)' : 'scale(1)'
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
                                                    <span><strong>힌트 도무미:</strong> <VocabHighlighter text={inputDef.placeholder} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
                                                </div>
                                            )}`;

if (code.includes(loopSearchPattern)) {
    code = code.replace(loopSearchPattern, loopReplacement);
    console.log('Modified stackedInputs header for hints.');
}

// 3. Neutralize placeholders in stackedInputs
// Find placeholders inside textarea/input and replace with neutral ones
code = code.replace(
    /placeholder=\{inputDef\.placeholder\}/g,
    `placeholder="여기에 생각이나 분석 내용을 자유롭게 적어보세요..."`
);

// 4. Handle direct-text (non-stacked) textarea hint (using mission.example)
const directTextHeader = `<div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#2d3436' }}>📝 미션 답변 쓰기</div>`;
const directTextReplacement = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#2d3436' }}>📝 미션 답변 쓰기</div>
                                            {mission.example && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => toggleHint('main_hint')}
                                                    style={{ 
                                                        background: 'none', border: 'none', cursor: 'pointer', 
                                                        fontSize: '1.3rem', padding: '0 5px', opacity: 0.8,
                                                        transition: 'transform 0.2s',
                                                        transform: visibleHints['main_hint'] ? 'scale(1.15)' : 'scale(1)'
                                                    }}
                                                    title="힌트 보기"
                                                >
                                                    💡
                                                </button>
                                            )}
                                        </div>
                                        {visibleHints['main_hint'] && mission.example && (
                                            <div style={{ 
                                                background: '#fff9c4', border: '2px dashed #fbc02d', borderRadius: '10px', 
                                                padding: '12px 15px', marginBottom: '15px', color: '#f57f17', fontSize: '0.95rem',
                                                display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5,
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in'
                                            }}>
                                                <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>💁</span>
                                                <span><strong>힌트 도우미:</strong> <VocabHighlighter text={mission.example} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} /></span>
                                            </div>
                                        )}`;

if (code.includes(directTextHeader)) {
    code = code.replace(directTextHeader, directTextReplacement);
    console.log('Modified direct-text header for hints.');
}

// 5. Neutralize direct-text textarea placeholder
code = code.replace(
    'placeholder="이 미션에 대한 나만의 생각을 적어주세요!"',
    'placeholder="여기에 나만의 생각을 자유롭게 적어주세요..."'
);

// 6. Final write
fs.writeFileSync(targetPath, code, 'utf8');
console.log('Mission.jsx hint system updated successfully.');
