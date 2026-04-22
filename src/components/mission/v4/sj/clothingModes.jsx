import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepHeader } from './shared';
import {
  CLOTHING_TAG_LABEL,
  computeClothingTopPrefs,
  computeClothingRecommendations,
  getClothingType,
  ClothingIllustration,
  ClothingItemCard
} from './clothing';

// ─── clothing_grid_with_rec ──────────────────────────────────────
export const ClothingGridWithRec = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const confirmed = answers[step.id]?.confirmed;
  const items = gradeSpec?.clothingItems || [];
  const initialRecIds = step.initialRecommendedIds || items.slice(0, 3).map(i => i.id);
  const initialRecItems = initialRecIds.map(id => items.find(i => i.id === id)).filter(Boolean);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ backgroundColor: domainColor + '10', borderRadius: '14px', padding: 'clamp(12px, 3vw, 16px)', border: `2px solid ${domainColor}30` }}>
        <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 900, color: domainColor, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          AI 추천 TOP 3
        </div>
        <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.8rem)', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', wordBreak: 'keep-all' }}>
          아직 취향 정보가 없어서 임의로 추천했어요. 별점을 주면 바뀔 거예요!
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {initialRecItems.map(item => <ClothingItemCard key={item.id} item={item} domainColor={domainColor} compact />)}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 900, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          전체 상품 (20개)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: 'clamp(6px, 1.5vw, 10px)' }}>
          {items.map(item => <ClothingItemCard key={item.id} item={item} domainColor={domainColor} compact />)}
        </div>
      </div>

      {!confirmed ? (
        <button
          onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true } }))}
          style={{
            padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
            border: `2px solid ${domainColor}`, backgroundColor: '#fff', color: domainColor,
            fontWeight: 800, fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)', cursor: 'pointer', width: '100%'
          }}
        >
          다 봤어요!
        </button>
      ) : (
        <div style={{
          padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
          backgroundColor: domainColor + '14', border: `2px solid ${domainColor}`,
          textAlign: 'center', fontWeight: 800, color: domainColor,
          fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)'
        }}>
          ✓ 옷 20개를 모두 확인했어요
        </div>
      )}
    </div>
  );
};

// ─── star_rating_carousel ─────────────────────────────────────────
export const StarRatingCarousel = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const ratings = answers[step.id] || {};
  const items = gradeSpec?.clothingItems || [];
  const total = items.length;
  const ratedCount = Object.keys(ratings).length;
  const minRated = step.validation?.minRated || 10;

  const firstUnrated = items.findIndex(i => !ratings[i.id]);
  const [carouselIndex, setCarouselIndex] = useState(firstUnrated === -1 ? 0 : firstUnrated);
  const safeIndex = Math.min(carouselIndex, total - 1);
  const item = items[safeIndex];
  const currentRating = item ? (ratings[item.id] || 0) : 0;

  const setRating = (itemId, val) => {
    setAnswers(prev => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [itemId]: val } }));
  };

  const topPrefs = computeClothingTopPrefs(ratings, items);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.5vw, 14px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '72%' }}>
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => setCarouselIndex(i)}
              style={{
                width: '10px', height: '10px', borderRadius: '50%',
                border: 'none', cursor: 'pointer', padding: 0,
                backgroundColor: ratings[it.id] ? '#f59e0b' : i === safeIndex ? domainColor : '#e2e8f0',
                transition: 'all 0.15s'
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.82rem)', fontWeight: 700, color: ratedCount >= minRated ? '#16a34a' : '#94a3b8' }}>
          {ratedCount} / {total}개
        </span>
      </div>

      {item && (
        <div style={{
          backgroundColor: '#fff', borderRadius: '16px',
          border: `2px solid ${currentRating ? domainColor + '50' : '#e2e8f0'}`,
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%', height: 'clamp(150px, 38vw, 190px)',
            backgroundColor: item.colorHex ? `${item.colorHex}22` : '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ClothingIllustration type={getClothingType(item.tags)} colorHex={item.colorHex} size={90} />
          </div>
          <div style={{ padding: 'clamp(14px, 3.5vw, 18px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: 'clamp(1rem, 3.2vw, 1.15rem)', fontWeight: 900, color: '#1e293b', textAlign: 'center' }}>
              {item.name}
            </div>
            <div style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em' }}>
              {item.tags.map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(item.id, star)}
                  style={{
                    width: 'clamp(34px, 8.5vw, 42px)', height: 'clamp(34px, 8.5vw, 42px)',
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 'clamp(22px, 5.5vw, 28px)', padding: 0,
                    color: star <= currentRating ? '#f59e0b' : '#e2e8f0',
                    transition: 'color 0.1s, transform 0.1s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#f59e0b'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = star <= currentRating ? '#f59e0b' : '#e2e8f0'; }}
                >
                  ★
                </button>
              ))}
            </div>
            {currentRating > 0 && (
              <div style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)', fontWeight: 700, color: domainColor }}>
                {currentRating}점
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
          disabled={safeIndex === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: '2px solid #e2e8f0', backgroundColor: '#f8fafc',
            color: safeIndex === 0 ? '#cbd5e1' : '#475569',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: safeIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={16} /> 이전
        </button>
        <button
          onClick={() => setCarouselIndex(i => Math.min(total - 1, i + 1))}
          disabled={safeIndex === total - 1}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: '12px',
            border: `2px solid ${safeIndex < total - 1 ? domainColor : '#e2e8f0'}`,
            backgroundColor: safeIndex < total - 1 ? domainColor + '18' : '#f8fafc',
            color: safeIndex < total - 1 ? domainColor : '#cbd5e1',
            fontWeight: 700, fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)',
            cursor: safeIndex < total - 1 ? 'pointer' : 'not-allowed'
          }}
        >
          다음 <ChevronRight size={16} />
        </button>
      </div>

      <div style={{
        padding: 'clamp(10px, 2.5vw, 14px) 14px', backgroundColor: '#f8fafc',
        borderRadius: '12px', border: `2px solid ${topPrefs.length > 0 ? domainColor + '40' : '#e2e8f0'}`
      }}>
        <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          사용자의 취향
        </div>
        {topPrefs.length > 0 ? (
          <div style={{ fontSize: 'clamp(0.9rem, 2.7vw, 1rem)', fontWeight: 800, color: domainColor, wordBreak: 'keep-all' }}>
            {topPrefs.slice(0, 3).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
          </div>
        ) : (
          <div style={{ fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)', color: '#94a3b8', fontWeight: 600 }}>
            별점 4~5점 준 옷이 생기면 취향이 나타나요!
          </div>
        )}
      </div>

      <div style={{
        padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px',
        border: `2px dashed ${ratedCount >= minRated ? '#22c55e' : '#e2e8f0'}`,
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 'clamp(0.78rem, 2.3vw, 0.86rem)', fontWeight: 700, margin: 0, color: ratedCount >= minRated ? '#16a34a' : '#94a3b8' }}>
          {ratedCount >= minRated
            ? `${ratedCount}개 평가 완료! 다음 단계로 넘어갈 수 있어요.`
            : `${minRated}개 이상 평가해야 해요 (현재 ${ratedCount}개)`}
        </p>
      </div>
    </div>
  );
};

// ─── recommendation_grid ──────────────────────────────────────────
export const RecommendationGrid = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const confirmed = answers[step.id]?.confirmed;
  const ratings = answers['step2'] || {};
  const items = gradeSpec?.clothingItems || [];
  const rules = gradeSpec?.recommendationRules || {};
  const count = step.recommendationCount || 3;

  const topPrefs = computeClothingTopPrefs(ratings, items);
  const recIds = computeClothingRecommendations(ratings, items, rules, count);
  const recItems = recIds.map(id => items.find(i => i.id === id)).filter(Boolean);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      {topPrefs.length > 0 && (
        <div style={{ padding: '12px 16px', backgroundColor: domainColor + '10', borderRadius: '12px', border: `1.5px solid ${domainColor}30` }}>
          <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 700, color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            분석된 취향
          </div>
          <div style={{ fontSize: 'clamp(0.92rem, 2.8vw, 1.02rem)', fontWeight: 800, color: domainColor, wordBreak: 'keep-all' }}>
            {topPrefs.slice(0, 3).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.75rem)', fontWeight: 900, color: domainColor, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          AI 추천 TOP 3
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(8px, 2vw, 12px)' }}>
          {recItems.map((item, idx) => (
            <div key={item.id} style={{
              backgroundColor: '#fff', borderRadius: '14px', border: `2px solid ${domainColor}40`,
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  height: 'clamp(80px, 20vw, 100px)',
                  backgroundColor: item.colorHex ? `${item.colorHex}22` : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ClothingIllustration type={getClothingType(item.tags)} colorHex={item.colorHex} size={56} />
                </div>
                <div style={{
                  position: 'absolute', top: '6px', left: '6px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  backgroundColor: domainColor, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', fontWeight: 900
                }}>
                  {idx + 1}
                </div>
              </div>
              <div style={{ padding: 'clamp(7px, 1.8vw, 10px)' }}>
                <div style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.78rem)', fontWeight: 800, color: '#1e293b', marginBottom: '3px', lineHeight: 1.3, wordBreak: 'keep-all' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 'clamp(0.55rem, 1.4vw, 0.62rem)', color: '#94a3b8', fontWeight: 600 }}>
                  {item.tags.slice(0, 2).map(t => `#${CLOTHING_TAG_LABEL[t] || t}`).join(' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!confirmed ? (
        <button
          onClick={() => setAnswers(prev => ({ ...prev, [step.id]: { confirmed: true, topPrefs, recommendedIds: recIds } }))}
          style={{
            padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
            border: `2px solid ${domainColor}`, backgroundColor: '#fff', color: domainColor,
            fontWeight: 800, fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)', cursor: 'pointer', width: '100%'
          }}
        >
          추천 결과를 확인했어요!
        </button>
      ) : (
        <div style={{
          padding: 'clamp(10px, 3vw, 14px)', borderRadius: '14px',
          backgroundColor: domainColor + '14', border: `2px solid ${domainColor}`,
          textAlign: 'center', fontWeight: 800, color: domainColor,
          fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)'
        }}>
          ✓ 추천 결과를 확인했어요
        </div>
      )}
    </div>
  );
};
