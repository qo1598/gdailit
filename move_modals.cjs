const fs = require('fs');

let code = fs.readFileSync('src/components/Mission.jsx', 'utf8');

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

// 3. 목표 프롬프트 (currentPrompts mapping)
// Find {prompt} inside <p>...</p> inside currentPrompts.map
code = code.replace(
  /\{prompt\}/,
  '<VocabHighlighter text={prompt} onWordClick={(word, desc) => setVocabModal({ show: true, word, desc })} />'
);

// 4. Modals 추출 
const startTag = '{/* Modals */}';
const endTagMarker = '</div>\\n                    ) : (\\n                        <form onSubmit={handleSubmit}>'; // Need to be careful with indentation

// To be safe, let's use a regex to find everything from {/* Modals */} until '</div>' followed by ') : ('
const modalMatch = code.match(/\{\/\*\s*Modals\s*\*\/\}\s*\{vocabModal\.show && \([\s\S]*?\{\s*modWarning\.show && \([\s\S]*?\}\)/);

if (modalMatch) {
  const modalBlock = modalMatch[0];
  
  // Remove from original place
  code = code.replace(modalBlock, '');
  
  // Re-insert at the end before final closing div
  code = code.replace(
    '{showSuccess && (', 
    modalBlock + '\\n\\n            {showSuccess && ('
  );
  console.log('Successfully moved modals!');
} else {
  console.log('Could not find modals block to move.');
}

fs.writeFileSync('src/components/Mission.jsx', code, 'utf8');
console.log('VocabHighlighter injection complete!');
