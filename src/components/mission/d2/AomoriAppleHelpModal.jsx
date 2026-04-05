import React, { useEffect, useCallback } from 'react';

const MODAL_IMG = '/d2_aomori_help.png';

/** 미션 문장·라벨에 삽입: `① {{AOMORI}}(다 익어도…` → 클릭 가능한 「아오리사과」 */
export const AOMORI_HELP_TOKEN = '{{AOMORI}}';

export function renderAomoriFragments(text, onOpen) {
    if (typeof text !== 'string' || !text.includes(AOMORI_HELP_TOKEN)) {
        return text;
    }
    const parts = text.split(AOMORI_HELP_TOKEN);
    return parts.map((part, i) => (
        <React.Fragment key={`aomori-${i}`}>
            {part}
            {i < parts.length - 1 ? (
                <AomoriTermButton onOpen={onOpen}>아오리사과</AomoriTermButton>
            ) : null}
        </React.Fragment>
    ));
}

/**
 * 5–6학년 D-2: "아오리사과" 설명 모달 (터치·클릭)
 */
export function AomoriAppleHelpModal({ open, onClose }) {
    const handleKey = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose?.();
        },
        [onClose]
    );

    useEffect(() => {
        if (!open) return;
        document.addEventListener('keydown', handleKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = prev;
        };
    }, [open, handleKey]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="aomori-modal-title"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(12px, 4vw, 24px)',
                background: 'rgba(45, 52, 54, 0.55)',
                WebkitTapHighlightColor: 'transparent'
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 'min(100%, 400px)',
                    maxHeight: 'min(88vh, 560px)',
                    overflow: 'auto',
                    background: 'white',
                    borderRadius: 'clamp(16px, 4vw, 22px)',
                    border: '3px solid #fdcb6e',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    padding: 'clamp(16px, 4vw, 22px)'
                }}
            >
                <h2
                    id="aomori-modal-title"
                    style={{
                        fontSize: 'clamp(1.05rem, 4vw, 1.25rem)',
                        fontWeight: 900,
                        color: '#2d3436',
                        margin: '0 0 12px 0',
                        textAlign: 'center'
                    }}
                >
                    아오리사과란?
                </h2>
                <div
                    style={{
                        borderRadius: '14px',
                        overflow: 'hidden',
                        marginBottom: '14px',
                        border: '2px solid #dfe6e9',
                        background: '#f8f9fa'
                    }}
                >
                    <img
                        src={MODAL_IMG}
                        alt="초록빛 아오리사과 한 알, 잎과 줄기가 달린 모습"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            verticalAlign: 'middle'
                        }}
                    />
                </div>
                <p
                    style={{
                        fontSize: 'clamp(0.92rem, 3.4vw, 1rem)',
                        lineHeight: 1.55,
                        color: '#2d3436',
                        margin: '0 0 16px 0',
                        fontWeight: 600
                    }}
                >
                    <strong>아오리사과</strong>는 일본에서 많이 먹는 품종이에요.{' '}
                    원래 다 익으면 붉은색으로 변하지만, 7월 말~8월 초 여름에 맛볼 수 있는 아오리는 품종 특성상 껍질이 초록색일 때 수확하는 것이 일반적입니다.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'linear-gradient(180deg, #fdcb6e 0%, #f39c12 100%)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 'clamp(1rem, 3.6vw, 1.1rem)',
                        cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(243, 156, 18, 0.35)',
                        touchAction: 'manipulation',
                        minHeight: '48px'
                    }}
                >
                    알겠어요!
                </button>
            </div>
        </div>
    );
}

/** 인라인으로 열 수 있는 트리거 (밑줄·손가락 모양) */
export function AomoriTermButton({ onOpen, children }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                onOpen?.();
            }}
            style={{
                display: 'inline',
                padding: 0,
                margin: 0,
                border: 'none',
                borderBottom: '2px dashed #e17055',
                background: 'transparent',
                color: '#d63031',
                font: 'inherit',
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'none',
                verticalAlign: 'baseline',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
            }}
        >
            {children}
        </button>
    );
}
