import React from 'react';
import { VOCAB_DICTIONARY } from '../utils/dictionary';

// 정적 캐싱: 단어 목록을 길순으로 정렬 (긴 단어가 우선 매칭되도록)
const vocabKeys = Object.keys(VOCAB_DICTIONARY).sort((a, b) => b.length - a.length);
const vocabRegex = new RegExp(`(${vocabKeys.join('|')})`, 'g');

/**
 * 텍스트 내의 어려운 단어를 자동으로 찾아 하이라이트하고,
 * 클릭 시 사전 모달을 띄울 수 있도록 트리거하는 컴포넌트
 */
export default function DictionaryText({ text, onWordClick, style = {} }) {
  if (!text) return null;

  // 정규식을 이용해 텍스트 분할
  const parts = text.split(vocabRegex);

  return (
    <span style={{ 
      lineHeight: '1.6', 
      wordBreak: 'keep-all', 
      overflowWrap: 'break-word',
      ...style 
    }}>
      {parts.map((part, index) => {
        // 단어 사전에 정의된 단어인지 확인
        if (VOCAB_DICTIONARY[part]) {
          return (
            <span 
              key={index} 
              onClick={(e) => {
                e.stopPropagation();
                onWordClick(part, VOCAB_DICTIONARY[part]);
              }}
              style={{
                borderBottom: '2px dashed #0984e3',
                color: '#0984e3',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0 1px',
                borderRadius: '2px',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
              className="dictionary-word"
              title="클릭해서 뜻을 알아보세요!"
            >
              {part}
            </span>
          );
        }
        // 일반 텍스트는 그대로 출력
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
