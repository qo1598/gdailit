import React from 'react';

export const CLOTHING_TAG_LABEL = {
  bright_color: '밝은색', dark_color: '어두운색', pastel_color: '파스텔', vivid_color: '원색',
  cute_style: '귀여운', sporty_style: '스포티', clean_style: '깔끔한', fancy_style: '화려한',
  tshirt: '티셔츠', pants: '바지', skirt: '치마', hoodie: '후드', hat: '모자', shoes: '신발',
  summer: '여름', winter: '겨울', allseason: '사계절'
};

export const computeClothingTopPrefs = (ratings, clothingItems) => {
  const tagCounts = {};
  Object.entries(ratings).forEach(([itemId, rating]) => {
    if (rating >= 4) {
      const item = clothingItems.find(c => c.id === itemId);
      if (item) item.tags.forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
    }
  });
  return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
};

export const computeClothingRecommendations = (ratings, clothingItems, recommendationRules, count = 3) => {
  const topPrefs = computeClothingTopPrefs(ratings, clothingItems);
  const highlyRatedIds = Object.entries(ratings).filter(([_, r]) => r >= 4).map(([id]) => id);
  let candidateIds = [];
  for (const pref of topPrefs) {
    (recommendationRules[pref]?.items || []).forEach(id => {
      if (!candidateIds.includes(id)) candidateIds.push(id);
    });
    if (candidateIds.length >= count * 2) break;
  }
  const notHighly = candidateIds.filter(id => !highlyRatedIds.includes(id));
  let result = notHighly.length >= count
    ? notHighly.slice(0, count)
    : [...notHighly, ...candidateIds.filter(id => !notHighly.includes(id))].slice(0, count);
  clothingItems.forEach(item => {
    if (!result.includes(item.id) && result.length < count) result.push(item.id);
  });
  return result.slice(0, count);
};

export const getClothingType = (tags = []) => {
  if (tags.includes('tshirt')) return 'tshirt';
  if (tags.includes('pants')) return 'pants';
  if (tags.includes('skirt')) return 'skirt';
  if (tags.includes('hoodie')) return 'hoodie';
  if (tags.includes('hat')) return 'hat';
  if (tags.includes('shoes')) return 'shoes';
  return 'tshirt';
};

export const ClothingIllustration = ({ type, colorHex, size = 48 }) => {
  const c = colorHex || '#94a3b8';
  const shadow = '#00000028';
  const detail = '#00000040';
  const s = size;
  const shapes = {
    tshirt: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="13" y="16" width="22" height="26" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <polygon points="5,14 13,16 13,24 5,22" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="43,14 35,16 35,24 43,22" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M17 16 Q24 23 31 16" fill="none" stroke={detail} strokeWidth="1.4"/>
      </svg>
    ),
    hoodie: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="13" y="18" width="22" height="24" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <polygon points="5,16 13,18 13,26 5,24" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="43,16 35,18 35,26 43,24" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M15 18 C13 10 16 4 24 4 C32 4 35 10 33 18 Z" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M18 18 C17 12 19 7 24 7 C29 7 31 12 30 18" fill="none" stroke={detail} strokeWidth="1.4"/>
        <rect x="18" y="30" width="12" height="7" rx="3" fill="none" stroke={detail} strokeWidth="1.2"/>
      </svg>
    ),
    pants: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="9" y="6" width="30" height="8" rx="2" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <rect x="9" y="14" width="13" height="28" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <rect x="26" y="14" width="13" height="28" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <line x1="12" y1="10" x2="36" y2="10" stroke={detail} strokeWidth="1" strokeDasharray="3,2"/>
      </svg>
    ),
    skirt: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="15" y="6" width="18" height="8" rx="2" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <path d="M15 14 L5 44 L43 44 L33 14 Z" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="15" y1="14" x2="33" y2="14" stroke={detail} strokeWidth="1.2"/>
        <line x1="24" y1="14" x2="22" y2="44" stroke={detail} strokeWidth="0.8" opacity="0.5"/>
      </svg>
    ),
    hat: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="32" rx="19" ry="5" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <path d="M10 32 C10 32 10 10 24 10 C38 10 38 32 38 32 Z" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <ellipse cx="24" cy="32" rx="14" ry="3" fill="none" stroke={detail} strokeWidth="1.2"/>
        <circle cx="24" cy="22" r="2" fill={detail} opacity="0.4"/>
      </svg>
    ),
    shoes: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <path d="M6 30 C6 24 10 18 18 17 L26 17 L26 26 C32 26 40 28 42 34 L6 34 Z" fill={c} stroke={shadow} strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="6" y="34" width="36" height="6" rx="3" fill={c} stroke={shadow} strokeWidth="1.5"/>
        <path d="M18 22 L22 26 M22 20 L26 24" stroke={detail} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  };
  return shapes[type] || shapes.tshirt;
};

export const ClothingItemCard = ({ item, domainColor, compact = false }) => (
  <div style={{
    backgroundColor: '#fff', borderRadius: compact ? '10px' : '12px',
    border: '2px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column'
  }}>
    <div style={{
      backgroundColor: item.colorHex ? `${item.colorHex}22` : '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: compact ? 'clamp(54px, 13vw, 68px)' : 'clamp(70px, 17vw, 88px)',
    }}>
      <ClothingIllustration type={getClothingType(item.tags)} colorHex={item.colorHex} size={compact ? 36 : 48} />
    </div>
    <div style={{ padding: compact ? '4px 6px 6px' : '7px 10px 9px' }}>
      <div style={{
        fontSize: compact ? 'clamp(0.58rem, 1.5vw, 0.66rem)' : 'clamp(0.72rem, 2vw, 0.8rem)',
        fontWeight: 800, color: '#1e293b', marginBottom: '2px', lineHeight: 1.3, wordBreak: 'keep-all'
      }}>
        {item.name}
      </div>
      <div style={{
        fontSize: compact ? 'clamp(0.5rem, 1.2vw, 0.56rem)' : 'clamp(0.6rem, 1.5vw, 0.66rem)',
        color: '#94a3b8', fontWeight: 600, lineHeight: 1.4
      }}>
        {item.tags.slice(0, 2).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
      </div>
    </div>
  </div>
);
