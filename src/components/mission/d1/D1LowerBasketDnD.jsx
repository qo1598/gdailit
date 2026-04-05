import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners,
    useDraggable,
    useDroppable
} from '@dnd-kit/core';
import { D1_FRUITS } from './d1-fruits';
import './d1-play.css';

const POOL_ID = 'lower-pool';
const BASKET_ID = 'lower-basket';

function fruitDragId(key) {
    return `fruit-${key}`;
}

function parseDragFruitId(id) {
    const s = String(id);
    return s.startsWith('fruit-') ? s.slice(6) : null;
}

function zonesFromColorSort(value) {
    const z = {};
    D1_FRUITS.forEach((f) => {
        z[f.key] = 'pool';
    });
    if (!value || typeof value !== 'string') return z;
    const names = value.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
    D1_FRUITS.forEach((f) => {
        if (names.includes(f.name)) z[f.key] = 'basket';
    });
    return z;
}

function DraggableFruit({ fruit }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: fruitDragId(fruit.key)
    });
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: isDragging ? 50 : 1,
              opacity: isDragging ? 0.85 : 1
          }
        : undefined;

    return (
        <button
            type="button"
            ref={setNodeRef}
            style={{
                ...style,
                touchAction: 'none',
                minWidth: '72px',
                minHeight: '76px',
                padding: '10px 8px',
                borderRadius: '18px',
                border: '3px solid #fab1a0',
                background: 'linear-gradient(180deg, #fff 0%, #fff5f5 100%)',
                cursor: 'grab',
                boxShadow: '0 6px 16px rgba(225, 112, 85, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
            }}
            {...listeners}
            {...attributes}
            aria-label={`${fruit.name} 끌어서 옮기기`}
        >
            <span style={{ fontSize: 'clamp(1.85rem, 8vw, 2.35rem)', lineHeight: 1 }}>{fruit.emoji}</span>
            <span style={{ fontSize: 'clamp(0.72rem, 3vw, 0.82rem)', fontWeight: 800, color: '#2d3436' }}>
                {fruit.name}
            </span>
        </button>
    );
}

function DropZone({ id, title, children, variant }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const isBasket = variant === 'basket';
    return (
        <div
            ref={setNodeRef}
            className={isBasket ? 'd1-drop-basket' : 'd1-drop-pool'}
            style={{
                minHeight: isBasket ? 'clamp(160px, 38vw, 220px)' : 'clamp(130px, 32vw, 180px)',
                borderRadius: 'clamp(16px, 4vw, 22px)',
                border: isOver ? '3px solid #00cec9' : isBasket ? '3px solid #e17055' : '3px dashed #b2bec3',
                background: isBasket
                    ? isOver
                        ? 'linear-gradient(180deg, #ffeaa7 0%, #fdcb6e 55%, #fab1a0 100%)'
                        : 'linear-gradient(180deg, #fff9e6 0%, #ffeaa7 100%)'
                    : isOver
                      ? '#e8f8f5'
                      : '#f8f9fa',
                padding: 'clamp(12px, 3vw, 16px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                transition: 'border-color 0.2s, background 0.2s',
                boxShadow: isBasket ? 'inset 0 2px 12px rgba(255,255,255,0.65)' : 'none',
                position: 'relative',
                WebkitTapHighlightColor: 'transparent'
            }}
        >
            <div
                style={{
                    fontWeight: 900,
                    fontSize: 'clamp(0.88rem, 3.2vw, 1rem)',
                    color: isBasket ? '#d63031' : '#636e72',
                    marginBottom: '10px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                {isBasket && <span style={{ fontSize: '1.4rem' }}></span>}
                {title}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    flex: 1
                }}
            >
                {children}
            </div>
        </div>
    );
}

/**
 * 저학년: 드래그앤드롭으로 빨간 바구니에 담기 (터치·포인터)
 */
const D1LowerBasketDnD = ({ value, onAnswerChange }) => {
    const [zones, setZones] = useState(() => zonesFromColorSort(value));
    const [activeKey, setActiveKey] = useState(null);
    const onAnswerChangeRef = useRef(onAnswerChange);
    onAnswerChangeRef.current = onAnswerChange;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } })
    );

    useEffect(() => {
        const inBasket = D1_FRUITS.filter((f) => zones[f.key] === 'basket')
            .map((f) => f.name)
            .join(', ');
        onAnswerChangeRef.current(inBasket);
    }, [zones]);

    const handleDragStart = useCallback((e) => {
        const k = parseDragFruitId(e.active.id);
        setActiveKey(k);
    }, []);

    const handleDragEnd = useCallback((e) => {
        setActiveKey(null);
        const { active, over } = e;
        const fruitKey = parseDragFruitId(active.id);
        if (!fruitKey || !over) return;
        const overId = String(over.id);
        if (overId === POOL_ID || overId === BASKET_ID) {
            setZones((prev) => ({
                ...prev,
                [fruitKey]: overId === BASKET_ID ? 'basket' : 'pool'
            }));
        }
    }, []);

    const handleDragCancel = useCallback(() => setActiveKey(null), []);

    const byZone = (z) => D1_FRUITS.filter((f) => zones[f.key] === z);

    const basketFruits = byZone('basket');
    const redIn = basketFruits.filter((f) => f.hue === 'red').length;
    const activeFruit = activeKey ? D1_FRUITS.find((f) => f.key === activeKey) : null;

    return (
        <div className="d1-play-root">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(14px, 4vw, 20px)'
                    }}
                >
                    <DropZone id={BASKET_ID} title="빨간색 과일 바구니" variant="basket">
                        {basketFruits.map((f) => (
                            <DraggableFruit key={f.key} fruit={f} />
                        ))}
                    </DropZone>

                    <DropZone id={POOL_ID} title="과일 데이터" variant="pool">
                        {byZone('pool').map((f) => (
                            <DraggableFruit key={f.key} fruit={f} />
                        ))}
                    </DropZone>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeFruit ? (
                        <div
                            style={{
                                minWidth: '72px',
                                minHeight: '76px',
                                padding: '10px 8px',
                                borderRadius: '18px',
                                border: '3px solid #00cec9',
                                background: 'white',
                                boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.95
                            }}
                        >
                            <span style={{ fontSize: '2.2rem' }}>{activeFruit.emoji}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{activeFruit.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {basketFruits.length > 0 && (
                <p
                    style={{
                        marginTop: '14px',
                        textAlign: 'center',
                        fontSize: 'clamp(0.82rem, 3vw, 0.92rem)',
                        fontWeight: 800,
                        color: redIn === basketFruits.length ? '#00b894' : '#e17055'
                    }}
                >
                    {redIn === basketFruits.length
                        ? '✨ 바구니 안이 모두 빨간 계열 과일이에요!'
                        : `💡 빨간 과일 ${redIn}개 · 바구니 전체 ${basketFruits.length}개 (색을 다시 생각해 봐도 좋아요)`}
                </p>
            )}
        </div>
    );
};

export default D1LowerBasketDnD;
