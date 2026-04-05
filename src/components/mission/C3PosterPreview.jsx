import React from 'react';

/**
 * Mission_backup.jsx C-3 동적 포스터 미리보기 (저학년: 고정 배경 / 중·고: 생성 이미지)
 */
const C3PosterPreview = ({
    gradeGroup,
    creativeEditText,
    generatedImageUrl,
    isGeneratingImage
}) => {
    return (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div
                style={{
                    width: '100%',
                    aspectRatio: '1 / 1.15',
                    backgroundColor: gradeGroup === 'lower' ? 'transparent' : '#ffffff',
                    backgroundImage:
                        gradeGroup === 'lower'
                            ? 'url("/c3_diverse_poster_2026.png")'
                            : generatedImageUrl
                              ? `url("${generatedImageUrl}")`
                              : 'url("/c3_poster_pure_bg.png")',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '25px',
                    border: '12px solid #fdcb6e',
                    position: 'relative',
                    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    backgroundPosition: 'center',
                    transition: 'all 0.5s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {gradeGroup !== 'lower' && !generatedImageUrl && !isGeneratingImage && (
                    <div
                        style={{
                            color: '#dfe6e9',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🖼️</div>
                        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#b2bec3' }}>
                            포스터가 여기에 생성됩니다.
                        </div>
                    </div>
                )}

                {isGeneratingImage && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255,255,255,0.85)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            backdropFilter: 'blur(3px)'
                        }}
                    >
                        <div
                            className="ai-loader"
                            style={{
                                fontSize: '3.5rem',
                                marginBottom: '10px',
                                animation: 'bounce 1s infinite'
                            }}
                        >
                            🎨
                        </div>
                        <div style={{ fontWeight: '900', color: '#6c5ce7', fontSize: '1.2rem' }}>
                            AI가 포스터를 그리는 중...
                        </div>
                    </div>
                )}

                {gradeGroup !== 'lower' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '85%',
                            maxHeight: '40%',
                            display: creativeEditText ? 'flex' : 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.85)',
                            padding: '15px',
                            borderRadius: '15px',
                            border: '2px dashed #fab1a0',
                            fontFamily: "'Jua', sans-serif",
                            fontSize: creativeEditText?.length > 30 ? '1.1rem' : '1.4rem',
                            lineHeight: 1.4,
                            color: '#2d3436',
                            wordBreak: 'keep-all',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            backdropFilter: 'blur(2px)'
                        }}
                    >
                        {creativeEditText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default C3PosterPreview;
