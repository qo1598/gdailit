import React, { useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCenter
} from '@dnd-kit/core';
import { StepHeader } from './shared';
import { deriveCases } from '../deriveCases';

const POOL_ID = '__pool__';

function DraggableCard({ card, image, domainColor, isAssigned }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    touchAction: 'none'
  };
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: '#fff',
        border: `2px solid ${isAssigned ? domainColor + '88' : '#e2e8f0'}`,
        borderRadius: '14px',
        padding: '10px 12px',
        boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        userSelect: 'none'
      }}
      {...listeners}
      {...attributes}
    >
      {image && (
        <img
          src={image}
          alt=""
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <div style={{ fontWeight: 800, fontSize: 'clamp(0.78rem, 2.3vw, 0.88rem)', color: '#1e293b', lineHeight: 1.35, wordBreak: 'keep-all' }}>
        {card.question || card.title}
      </div>
      <div style={{
        fontSize: 'clamp(0.72rem, 2.1vw, 0.8rem)',
        color: '#475569',
        background: '#f1f5f9',
        borderRadius: '8px',
        padding: '6px 8px',
        lineHeight: 1.45,
        wordBreak: 'keep-all'
      }}>
        <span style={{ fontWeight: 700, color: '#94a3b8', marginRight: '4px' }}>AI:</span>
        {card.answer || card.description}
      </div>
    </div>
  );
}

function DropBoard({ id, label, emoji, accent, children, count, hint }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? accent + '18' : '#f8fafc',
        border: `2.5px dashed ${isOver ? accent : '#cbd5e1'}`,
        borderRadius: '16px',
        padding: '12px',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'background 0.15s, border-color 0.15s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {emoji && <span style={{ fontSize: '1.1rem' }}>{emoji}</span>}
          <span style={{ fontWeight: 800, color: accent, fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>{label}</span>
        </div>
        <span style={{
          background: accent,
          color: '#fff',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '999px'
        }}>{count}</span>
      </div>
      {hint && (
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', wordBreak: 'keep-all' }}>{hint}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function PoolArea({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: POOL_ID });
  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? '#eff6ff' : '#fff',
        border: `2px dashed ${isOver ? '#60a5fa' : '#e2e8f0'}`,
        borderRadius: '16px',
        padding: '12px',
        minHeight: '120px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px',
        transition: 'background 0.15s, border-color 0.15s'
      }}
    >
      {children}
    </div>
  );
}

const BOARD_ACCENTS = ['#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6'];

export const CardDropBoard = ({ step, gradeSpec, answers, setAnswers, domainColor, hint, onHintClick }) => {
  const cases = useMemo(() => deriveCases(step, gradeSpec, answers), [step, gradeSpec, answers]);
  const cardImages = step.cardImages || {};
  const judgmentOptions = step.judgmentOptions || [];
  const answer = answers[step.id] || {};

  const assignments = useMemo(() => {
    const map = { [POOL_ID]: [] };
    judgmentOptions.forEach(opt => { map[opt.id] = []; });
    cases.forEach(c => {
      const j = answer[c.id]?.judgment;
      if (j && map[j]) map[j].push(c.id);
      else map[POOL_ID].push(c.id);
    });
    return map;
  }, [cases, judgmentOptions, answer]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const cardId = active.id;
    const targetId = over.id;
    setAnswers(prev => {
      const prevStep = prev[step.id] || {};
      const next = { ...prevStep };
      if (targetId === POOL_ID) {
        delete next[cardId];
      } else {
        next[cardId] = { ...(prevStep[cardId] || {}), judgment: targetId };
      }
      return { ...prev, [step.id]: next };
    });
  };

  const findCase = (id) => cases.find(c => c.id === id);
  const remaining = assignments[POOL_ID].length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
      <StepHeader step={step} domainColor={domainColor} hint={hint} onHintClick={onHintClick} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* 카드 풀 */}
        <div>
          <div style={{
            fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
            fontWeight: 800,
            color: '#64748b',
            marginBottom: '6px',
            letterSpacing: '0.04em'
          }}>
            카드 보관함 · 남은 카드 {remaining}개
          </div>
          <PoolArea>
            {assignments[POOL_ID].length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '20px' }}>
                모든 카드를 게시판에 분류했어요!
              </div>
            ) : (
              assignments[POOL_ID].map(cid => {
                const c = findCase(cid);
                if (!c) return null;
                return (
                  <DraggableCard key={cid} card={c} image={cardImages[cid]} domainColor={domainColor} isAssigned={false} />
                );
              })
            )}
          </PoolArea>
        </div>

        {/* 분류 보드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {judgmentOptions.map((opt, idx) => {
            const accent = opt.color || BOARD_ACCENTS[idx % BOARD_ACCENTS.length];
            const ids = assignments[opt.id] || [];
            return (
              <DropBoard
                key={opt.id}
                id={opt.id}
                label={opt.label}
                emoji={opt.emoji}
                accent={accent}
                count={ids.length}
                hint={opt.hint}
              >
                {ids.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '0.78rem', padding: '14px 0', wordBreak: 'keep-all' }}>
                    여기로 카드를 끌어와요
                  </div>
                ) : (
                  ids.map(cid => {
                    const c = findCase(cid);
                    if (!c) return null;
                    return (
                      <DraggableCard key={cid} card={c} image={cardImages[cid]} domainColor={accent} isAssigned />
                    );
                  })
                )}
              </DropBoard>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};
