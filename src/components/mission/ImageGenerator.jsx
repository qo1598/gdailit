import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI2 = new GoogleGenAI({ apiKey: API_KEY });

/**
 * M-3 미션용 이미지 생성 컴포넌트
 */
const ImageGenerator = ({ 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onImageGenerated 
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');

    const generateM3Image = async () => {
        let prompt = '';
        
        // M-3 저학년: good_prompt 사용
        if (gradeGroup === 'lower') {
            prompt = stackedAnswers.good_prompt;
            if (!prompt || prompt.trim() === '') {
                alert("먼저 마법 주문서를 완성해주세요!");
                return;
            }
        }
        // M-3 중학년: final_prompt 사용
        else if (gradeGroup === 'middle') {
            prompt = stackedAnswers.final_prompt;
            if (!prompt || prompt.trim() === '') {
                alert("먼저 완성된 그림 주문서를 써주세요!");
                return;
            }
        }
        else {
            alert("이미지 생성은 저학년과 중학년에서만 가능합니다.");
            return;
        }

        setIsGenerating(true);
        setGeneratedImageUrl('');
        try {
            // 2D 일러스트 스타일로 이미지 생성
            const imagePrompt = `2D illustration, cute cartoon style, colorful and vibrant, child-friendly art style, simple and clear composition: ${prompt}`;

            console.log("[M-3 AI Image] 학생 프롬프트로 이미지 생성 중...", prompt);
            const response = await genAI2.models.generateImages({
                model: 'imagen-4.0-fast-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1 },
            });
            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;

            if (imageBytes) {
                const dataUrl = `data:image/png;base64,${imageBytes}`;
                setGeneratedImageUrl(dataUrl);
                onImageGenerated?.(dataUrl);
                console.log("[M-3 AI Image] 이미지 생성 성공!");
            } else {
                throw new Error("응답에 이미지 데이터가 없습니다.");
            }
        } catch (err) {
            console.error("[M-3 AI Image] 이미지 생성 실패:", err);
            alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsGenerating(false);
        }
    };

    // M-3 미션이 아니거나 고학년인 경우 렌더링하지 않음
    if (missionId !== 'M-3' || gradeGroup === 'upper') {
        return null;
    }

    const shouldShowButton = 
        (gradeGroup === 'lower' && stackedAnswers.good_prompt) ||
        (gradeGroup === 'middle' && stackedAnswers.final_prompt);

    return (
        <div style={{ marginTop: '20px' }}>
            {shouldShowButton && (
                <button
                    type="button"
                    onClick={generateM3Image}
                    disabled={isGenerating}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(253, 121, 168, 0.25)',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '20px'
                    }}
                >
                    <span style={{ fontSize: '1.4rem' }}>🎨</span>
                    {isGenerating ? '그림 그리는 중...' : 'AI로 그림 그려보기!'}
                    <span style={{ fontSize: '1.4rem' }}>✨</span>
                </button>
            )}

            {generatedImageUrl && (
                <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #fff5f5 0%, #fff0f6 100%)',
                    borderRadius: '20px',
                    border: '3px solid #fd79a8',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(253, 121, 168, 0.15)'
                }}>
                    <div style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        color: '#e84393',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <span>🎨</span>
                        AI가 그려준 마법의 그림!
                        <span>✨</span>
                    </div>
                    <img
                        src={generatedImageUrl}
                        alt="AI가 생성한 이미지"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '15px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            border: '2px solid #fd79a8'
                        }}
                    />
                    <div style={{
                        marginTop: '15px',
                        fontSize: '1rem',
                        color: '#636e72',
                        fontStyle: 'italic'
                    }}>
                        {gradeGroup === 'lower' 
                            ? '마법 주문서가 이렇게 멋진 그림으로 변했어요!' 
                            : '완성된 그림 주문서로 AI가 그려준 작품이에요!'
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;