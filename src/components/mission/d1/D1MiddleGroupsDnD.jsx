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
import {
    D1_FRUITS,
    D1_FRUIT_KEYS,
    D1_UPPER_ITEMS,
    D1_UPPER_KEYS,
    parseD1GroupAssignments
} from './d1-fruits';
import './d1-play.css';

const POOL_ID = 'middle-pool';
const A_ID = 'middle-a';
const B_ID = 'middle-b';

const DEFAULT_DND_LABELS = {
    aTitle: 'A 그룹',
    bTitle: 'B 그룹',
    poolTitle: '과일 데이터',
    progressDone: '✨ 10개 모두 A 또는 B에 들어갔어요!',
    progressPartial: (n) => `📌 A/B에 넣은 과일: ${n} / 10`
};

/** 고학년: 학교 행사·모임 심사 — 통과/보류 톤 */
const DND_VARIANT_LABELS = {
    upper: {
        aTitle: '통과 ✅',
        bTitle: '보류 ⚠️',
        poolTitle: '올라온 활동 후보',
        progressDone: '✨ 10개 모두 통과 또는 보류로 정했어요!',
        progressPartial: (n) => `📌 통과·보류에 넣은 활동: ${n} / 10`
    }
};

function fruitDragId(key) {
    return `fruit-${key}`;
}

function parseDragFruitId(id) {
    const s = String(id);
    return s.startsWith('fruit-') ? s.slice(6) : null;
}

function zonesFromAssignments(raw, keys) {
    const z = {};
    keys.forEach((k) => {
        z[k] = 'pool';
    });
    const o = parseD1GroupAssignments(raw);
    if (!o) return z;
    keys.forEach((k) => {
        if (o[k] === 'A' || o[k] === 'B') z[k] = o[k];
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
                minWidth: '68px',
                minHeight: '72px',
                padding: '8px 6px',
                borderRadius: '16px',
                border: '3px solid #74b9ff',
                background: 'linear-gradient(180deg, #fff 0%, #eaf4fb 100%)',
                cursor: 'grab',
                boxShadow: '0 4px 14px rgba(116, 185, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
            }}
            {...listeners}
            {...attributes}
            aria-label={`${fruit.name} 끌어서 옮기기`}
        >
            <span style={{ fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', lineHeight: 1 }}>{fruit.emoji}</span>
            <span style={{ fontSize: 'clamp(0.68rem, 2.8vw, 0.78rem)', fontWeight: 800, color: '#2d3436' }}>
                {fruit.name}
            </span>
        </button>
    );
}

function GroupDropZone({ id, title, children, accent }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const border = accent === 'a' ? '#0984e3' : accent === 'b' ? '#6c5ce7' : '#b2bec3';
    const bg =
        accent === 'a'
            ? isOver
                ? 'linear-gradient(165deg, #bbdefb 0%, #e3f2fd 100%)'
                : 'linear-gradient(165deg, #e3f2fd 0%, #ffffff 100%)'
            : accent === 'b'
              ? isOver
                  ? 'linear-gradient(165deg, #e1bee7 0%, #f3e5f5 100%)'
                  : 'linear-gradient(165deg, #f3e5f5 0%, #ffffff 100%)'
              : isOver
                ? '#e8f8f5'
                : '#f8f9fa';

    return (
        <div
            ref={setNodeRef}
            style={{
                minHeight: 'clamp(120px, 30vw, 160px)',
                borderRadius: 'clamp(14px, 3.5vw, 20px)',
                border: `3px solid ${isOver ? '#00cec9' : border}`,
                background: bg,
                padding: '12px',
                transition: 'border-color 0.2s, background 0.2s',
                WebkitTapHighlightColor: 'transparent'
            }}
        >
            <div
                style={{
                    fontWeight: 900,
                    fontSize: 'clamp(0.85rem, 3.1vw, 0.98rem)',
                    marginBottom: '10px',
                    textAlign: 'center',
                    color: accent === 'a' ? '#1565c0' : accent === 'b' ? '#6a1b9a' : '#636e72'
                }}
            >
                {title}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    minHeight: '72px'
                }}
            >
                {children}
            </div>
        </div>
    );
}

function mergeDndLabels(partial) {
    if (!partial || typeof partial !== 'object') return { ...DEFAULT_DND_LABELS };
    return { ...DEFAULT_DND_LABELS, ...partial };
}

/**
 * 3–4학년: 과일 10종 / 5–6학년(upper): 학교·친구 활동 10가지 → A·B(또는 통과·보류)·풀로 드래그, JSON 저장
 * @param {'upper'|undefined} [dndVariant] — upper면 게임 아이템 + 통과/보류 라벨
 * @param {object} [dndLabels] — variant 위에 덮어쓸 라벨
 */
const D1MiddleGroupsDnD = ({ value, onAnswerChange, dndVariant, dndLabels: dndLabelsProp }) => {
    const isUpper = dndVariant === 'upper';
    const items = isUpper ? D1_UPPER_ITEMS : D1_FRUITS;
    const itemKeys = isUpper ? D1_UPPER_KEYS : D1_FRUIT_KEYS;

    const variantBase = dndVariant && DND_VARIANT_LABELS[dndVariant] ? DND_VARIANT_LABELS[dndVariant] : {};
    const lbl = mergeDndLabels({ ...variantBase, ...(dndLabelsProp || {}) });
    const [zones, setZones] = useState(() => zonesFromAssignments(value, itemKeys));
    const [activeKey, setActiveKey] = useState(null);
    const onAnswerChangeRef = useRef(onAnswerChange);
    onAnswerChangeRef.current = onAnswerChange;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } })
    );

    useEffect(() => {
        const payload = {};
        itemKeys.forEach((k) => {
            payload[k] = zones[k] ?? 'pool';
        });
        onAnswerChangeRef.current(JSON.stringify(payload));
    }, [zones, itemKeys]);

    const handleDragStart = useCallback((e) => {
        setActiveKey(parseDragFruitId(e.active.id));
    }, []);

    const handleDragEnd = useCallback((e) => {
        setActiveKey(null);
        const { active, over } = e;
        const fruitKey = parseDragFruitId(active.id);
        if (!fruitKey || !over) return;
        const overId = String(over.id);
        let nextZone = null;
        if (overId === POOL_ID) nextZone = 'pool';
        else if (overId === A_ID) nextZone = 'A';
        else if (overId === B_ID) nextZone = 'B';
        if (nextZone) {
            setZones((prev) => ({ ...prev, [fruitKey]: nextZone }));
        }
    }, []);

    const handleDragCancel = useCallback(() => setActiveKey(null), []);

    const byZone = (z) => items.filter((f) => zones[f.key] === z);
    const assignedCount = items.filter((f) => zones[f.key] === 'A' || zones[f.key] === 'B').length;

    const activeFruit = activeKey ? items.find((f) => f.key === activeKey) : null;

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
                        gap: '12px'
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}
                        className="d1-middle-ab-grid"
                    >
                        <GroupDropZone id={A_ID} title={lbl.aTitle} accent="a">
                            {byZone('A').map((f) => (
                                <DraggableFruit key={f.key} fruit={f} />
                            ))}
                        </GroupDropZone>
                        <GroupDropZone id={B_ID} title={lbl.bTitle} accent="b">
                            {byZone('B').map((f) => (
                                <DraggableFruit key={f.key} fruit={f} />
                            ))}
                        </GroupDropZone>
                    </div>

                    <GroupDropZone id={POOL_ID} title={lbl.poolTitle} accent="pool">
                        {byZone('pool').map((f) => (
                            <DraggableFruit key={f.key} fruit={f} />
                        ))}
                    </GroupDropZone>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeFruit ? (
                        <div
                            style={{
                                minWidth: '68px',
                                minHeight: '72px',
                                padding: '8px 6px',
                                borderRadius: '16px',
                                border: '3px solid #00cec9',
                                background: 'white',
                                boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>{activeFruit.emoji}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{activeFruit.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <p
                style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                    fontWeight: 800,
                    color: assignedCount === 10 ? '#00b894' : '#e17055'
                }}
            >
                {assignedCount === 10 ? lbl.progressDone : lbl.progressPartial(assignedCount)}
            </p>
        </div>
    );
};

export default D1MiddleGroupsDnD;
