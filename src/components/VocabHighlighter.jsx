import React from 'react';
import { VOCAB_DICTIONARY } from '../utils/dictionary';

// Create a regex to match all dictionary keys safely
// Sort by length descending to match longer phrases first if they overlap
const vocabKeys = Object.keys(VOCAB_DICTIONARY).sort((a, b) => b.length - a.length);
const vocabRegex = new RegExp(`(${vocabKeys.join('|')})`, 'g');

export default function VocabHighlighter({ text, onWordClick }) {
  if (!text) return null;

  // Split text by the keywords
  const parts = text.split(vocabRegex);

  return (
    <span>
      {parts.map((part, index) => {
        // If part matches a vocabulary key exactly
        if (VOCAB_DICTIONARY[part]) {
          return (
            <span 
              key={index} 
              className="vocab-highlight" 
              onClick={() => onWordClick(part, VOCAB_DICTIONARY[part])}
              style={{
                borderBottom: '2px dashed #0984e3',
                color: '#0984e3',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0 2px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e1f5fe'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="클릭해서 뜻을 알아보세요!"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
