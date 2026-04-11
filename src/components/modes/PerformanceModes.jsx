import React, { useState } from 'react';
import { 
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import DictionaryText from '../DictionaryText';

// --- Sub-components for Sorting ---

const SortableItem = ({ id, content, onWordClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: 'white',
        border: '3px solid #dfe6e9',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '10px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span style={{ fontSize: '1.2rem', color: '#b2bec3' }}>☰</span>
            <div style={{ flex: 1, fontWeight: '700', color: '#2d3436' }}>
                <DictionaryText text={content} onWordClick={onWordClick} />
            </div>
        </div>
    );
};

// --- Main Sorting Mode ---

export const SortingMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onStackedChange, 
    onWordClick,
    onSubmit,
    onFocus,
    onChange
}) => {
    const { 
        currentStackedInputs,
        currentScenarioDescription 
    } = useGradeLogic(mission, gradeGroup);

    const inputDef = currentStackedInputs?.[0]; // 기본적으로 첫 번째 입력을 분류 대상으로 함
    const items = stackedAnswers[inputDef?.id] || inputDef?.list || [];

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            const newOrder = arrayMove(items, oldIndex, newIndex);
            
            onFocus?.(inputDef.id);
            onChange?.(inputDef.id, newOrder);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div style={{ 
                background: '#fff9e6', 
                border: '3px solid #fdcb6e', 
                borderRadius: '24px', 
                padding: '24px',
                marginBottom: '20px'
            }}>
                <h3 style={{ 
                    color: '#e67e22', 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>카드 순서 맞추기 🧩</h3>
                
                <div style={{ 
                    background: 'white', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    border: '2px dashed #fdcb6e',
                    marginBottom: '20px',
                    color: '#2d3436',
                    lineHeight: 1.6
                }}>
                    <DictionaryText text={currentScenarioDescription} onWordClick={onWordClick} />
                </div>

                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext 
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableItem key={item} id={item} content={item} onWordClick={onWordClick} />
                        ))}
                    </SortableContext>
                </DndContext>

                <button 
                    onClick={onSubmit}
                    style={{
                        marginTop: '24px',
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #fdcb6e, #f39c12)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 0 #d35400'
                    }}
                >
                    순서 구성 완료!
                </button>
            </div>
        </div>
    );
};

// --- Matching Mode (Left items -> Right targets) ---

const DraggableMatchItem = ({ id, content, isMatched }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ 
        id,
        disabled: isMatched 
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        background: isMatched ? '#f1f2f6' : 'white',
        border: isMatched ? '2px solid #dfe6e9' : '3px solid #00cec9',
        borderRadius: '16px',
        padding: '12px 16px',
        marginBottom: '12px',
        cursor: isMatched ? 'default' : 'grab',
        opacity: isMatched ? 0.6 : 1,
        touchAction: 'none',
        fontWeight: '700',
        color: '#2d3436'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {content}
        </div>
    );
};

const DroppableTarget = ({ id, label, matchedItem, onWordClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div 
            ref={setNodeRef}
            style={{
                background: isOver ? '#e0fcfb' : '#f8f9fa',
                border: isOver ? '3px dashed #00cec9' : '2px dashed #b2bec3',
                borderRadius: '16px',
                padding: '16px',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.2s'
            }}
        >
            <div style={{ fontSize: '0.9rem', color: '#636e72', marginBottom: '8px', fontWeight: 'bold' }}>
                {label}
            </div>
            {matchedItem ? (
                <div style={{ 
                    background: '#00cec9', 
                    color: 'white', 
                    padding: '8px 12px', 
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {matchedItem}
                </div>
            ) : (
                <div style={{ color: '#b2bec3', textAlign: 'center', fontSize: '0.85rem' }}>
                    여기에 드래그하여 맞추세요
                </div>
            )}
        </div>
    );
};

export const MatchingMode = ({
    mission,
    missionId,
    gradeGroup,
    stackedAnswers,
    onWordClick,
    onSubmit,
    onFocus,
    onChange
}) => {
    const { currentStackedInputs, currentScenarioDescription } = useGradeLogic(mission, gradeGroup);
    const inputDef = currentStackedInputs?.[0]; // matching_pairs 가 들어있는 입력 정의
    
    // pairs: [{ id: 'p1', question: '사람의 일', answer: '창의성' }, ...]
    const pairs = inputDef?.pairs || [];
    const sourceItems = inputDef?.sources || pairs.map(p => p.answer);
    
    // matches: { targetId: sourceId }
    const matches = stackedAnswers[inputDef?.id] || {};

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && over.id) {
            onFocus?.(inputDef.id);
            const newMatches = { ...matches, [over.id]: active.id };
            onChange?.(inputDef.id, newMatches);
        }
    };

    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div style={{ 
                background: '#f0fff4', 
                border: '3px solid #55efc4', 
                borderRadius: '24px', 
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ 
                    color: '#00b894', 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>알맞은 짝 찾기 🤝</h3>

                <div style={{ 
                    background: 'white', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    border: '2px dashed #55efc4',
                    marginBottom: '24px',
                    color: '#2d3436'
                }}>
                    <DictionaryText text={currentScenarioDescription} onWordClick={onWordClick} />
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        {/* Left: Sources */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#636e72', marginBottom: '12px' }}>
                                보기 카드
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {sourceItems.map(item => {
                                    const isMatched = Object.values(matches).includes(item);
                                    return <DraggableMatchItem key={item} id={item} content={item} isMatched={isMatched} />;
                                })}
                            </div>
                        </div>

                        {/* Right: Targets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#636e72', marginBottom: '12px' }}>
                                알맞은 자리
                            </h4>
                            {pairs.map(pair => (
                                <DroppableTarget 
                                    key={pair.id} 
                                    id={pair.id} 
                                    label={pair.question} 
                                    matchedItem={matches[pair.id]} 
                                />
                            ))}
                        </div>
                    </div>
                </DndContext>

                <button 
                    onClick={onSubmit}
                    style={{
                        marginTop: '30px',
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #55efc4, #00b894)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 0 #00897b'
                    }}
                >
                    짝 맞추기 완료!
                </button>
            </div>
        </div>
    );
};

// --- Highlight/Critical Mode ---

export const HighlightMode = ({
    mission,
    missionId,
    gradeGroup,
    stackedAnswers,
    onStackedChange,
    onWordClick,
    onSubmit,
    onFocus,
    onChange
}) => {
    const { 
        currentScenarioDescription,
        currentStackedInputs 
    } = useGradeLogic(mission, gradeGroup);

    const inputDef = currentStackedInputs?.[0];
    const selectedIndices = stackedAnswers[inputDef?.id] || [];
    
    // 단순 공백 기준으로 단어를 나눔 (고도화 시 데이터에서 관리 가능)
    const words = currentScenarioDescription.split(' ');

    const toggleWord = (index) => {
        onFocus?.(inputDef.id);
        const newSelection = selectedIndices.includes(index)
            ? selectedIndices.filter(i => i !== index)
            : [...selectedIndices, index];
        onChange?.(inputDef.id, newSelection);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div style={{ 
                background: '#e8f4fd', 
                border: '3px solid #74b9ff', 
                borderRadius: '24px', 
                padding: '24px'
            }}>
                <h3 style={{ 
                    color: '#0984e3', 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>오류나 이상한 점 찾기 🔍</h3>
                
                <div style={{ 
                    background: 'white', 
                    padding: '24px', 
                    borderRadius: '20px', 
                    border: '3px solid #74b9ff',
                    lineHeight: 2.2,
                    fontSize: '1.2rem',
                    marginBottom: '24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px 4px'
                }}>
                    {words.map((word, idx) => (
                        <span 
                            key={idx}
                            onClick={() => toggleWord(idx)}
                            style={{
                                padding: '2px 8px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: selectedIndices.includes(idx) ? '#ffeaa7' : 'transparent',
                                borderBottom: selectedIndices.includes(idx) ? '3px solid #fab1a0' : '3px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </div>

                <div style={{ color: '#636e72', fontSize: '1rem', textAlign: 'center', marginBottom: '20px' }}>
                    문장에서 이상하다고 생각되는 단어를 클릭해 보세요!
                </div>

                <button 
                    onClick={onSubmit}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 0 #06528e'
                    }}
                >
                    발견한 내용 제출하기
                </button>
            </div>
        </div>
    );
};

// 통합 컴포넌트
const PerformanceModes = (props) => {
    const { mission, gradeGroup } = props;
    const { currentType } = useGradeLogic(mission, gradeGroup);

    switch (currentType) {
        case 'performance-sorting':
            return <SortingMode {...props} />;
        case 'performance-matching':
            return <MatchingMode {...props} />;
        case 'performance-highlight':
            return <HighlightMode {...props} />;
        default:
            return <div>알 수 없는 수행 모드입니다.</div>;
    }
};

export default PerformanceModes;
