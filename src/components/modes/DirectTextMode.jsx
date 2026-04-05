import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useGradeLogic } from '../../hooks/useGradeLogic';
import StackedInputs from '../mission/StackedInputs';
import MissionScenarioPanel from '../mission/MissionScenarioPanel';
import C3PosterPreview from '../mission/C3PosterPreview';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI2 = new GoogleGenAI({ apiKey: API_KEY });

const DirectTextMode = ({
    mission,
    missionId,
    gradeGroup,
    stackedAnswers,
    onStackedChange,
    onSubmit
}) => {
    const {
        currentType,
        currentStackedInputs,
        currentPrompts,
        currentScenarioImage,
        currentScenarioDescription
    } = useGradeLogic(mission, gradeGroup);
    const showPhotoUpload = currentType === 'upload-text';

    const [isGeneratingC3Image, setIsGeneratingC3Image] = useState(false);
    const [generatedC3ImageUrl, setGeneratedC3ImageUrl] = useState('');

    const generateC3Poster = useCallback(async () => {
        const prompt = stackedAnswers.creative_edit;
        if (!prompt || prompt.trim() === '') {
            alert('먼저 수정하고 싶은 포스터의 내용을 적어주세요.');
            return;
        }

        setIsGeneratingC3Image(true);
        setGeneratedC3ImageUrl('');
        try {
            const imagePrompt = `Colorful school festival poster background, 2D flat vector illustration, warm vibrant autumn colors, festive trees, banners and decorations on a school campus, no text, no letters. Theme: ${prompt}`;

            const response = await genAI2.models.generateImages({
                model: 'imagen-4.0-fast-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1 }
            });
            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;

            if (imageBytes) {
                const dataUrl = `data:image/png;base64,${imageBytes}`;
                setGeneratedC3ImageUrl(dataUrl);
            } else {
                throw new Error('응답에 이미지 데이터가 없습니다.');
            }
        } catch (err) {
            console.error('[AI Image] Imagen 이미지 생성 실패:', err);
            const presetBgs = ['/c3_poster_pure_bg.png', '/c3_diverse_poster_2026.png'];
            setGeneratedC3ImageUrl(presetBgs[Math.floor(Math.random() * presetBgs.length)]);
        } finally {
            setIsGeneratingC3Image(false);
        }
    }, [stackedAnswers.creative_edit]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div
                style={{
                    background: '#fff9e6',
                    border: '3px solid #fdcb6e',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '20px',
                    position: 'relative'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}
                >
                    <img
                        src="/robot_2d_base.png"
                        alt="알리 캐릭터"
                        style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            background: 'transparent'
                        }}
                    />
                    <div
                        style={{
                            color: '#2d3436',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            flex: 1
                        }}
                    >
                        <span
                            style={{
                                background: '#fdcb6e',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: '15px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginRight: '15px'
                            }}
                        >
                            알리(Alli)
                        </span>
                        좋아! 이제 본격적으로 미션을 수행해 보자. 파이팅!
                    </div>
                </div>
            </div>

            <div
                style={{
                    background: '#fff9e6',
                    border: '3px solid #fdcb6e',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '20px'
                }}
            >
                {mission?.referenceImage && missionId !== 'C-3' && (
                    <div
                        style={{
                            width: '100%',
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '3px solid #fdcb6e',
                            marginBottom: '20px',
                            padding: '10px',
                            boxShadow: '0 4px 12px rgba(253, 203, 110, 0.12)'
                        }}
                    >
                        <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                            <img
                                src={mission.referenceImage}
                                alt="미션 참고 그림"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                        {mission.referenceImageCaption && (
                            <div
                                style={{
                                    color: '#2d3436',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    fontSize: '0.95rem',
                                    background: '#fff9e6',
                                    padding: '10px',
                                    borderRadius: '8px'
                                }}
                            >
                                {mission.referenceImageCaption}
                            </div>
                        )}
                    </div>
                )}

                {missionId === 'C-3' && (
                    <C3PosterPreview
                        gradeGroup={gradeGroup}
                        creativeEditText={stackedAnswers.creative_edit}
                        generatedImageUrl={generatedC3ImageUrl}
                        isGeneratingImage={isGeneratingC3Image}
                    />
                )}

                <h3
                    className="mission-task-header"
                    style={{
                        color: '#e67e22',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}
                >
                    탐구 과제
                </h3>

                <MissionScenarioPanel
                    imageUrl={currentScenarioImage}
                    description={currentScenarioDescription}
                />

                {currentPrompts && currentPrompts.length > 0 && (
                    <div
                        style={{
                            marginBottom: '15px',
                            textAlign: 'left',
                            color: '#2d3436',
                            background: 'white',
                            padding: '18px',
                            borderRadius: '15px',
                            border: '3px solid #dfe6e9',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                        }}
                    >
                        {currentPrompts.map((prompt, idx) => (
                            <p
                                key={idx}
                                style={{
                                    marginBottom: idx === currentPrompts.length - 1 ? 0 : '12px',
                                    fontWeight: '900',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.5',
                                    color: '#2d3436'
                                }}
                            >
                                {prompt}
                            </p>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit?.(e);
                    }}
                >
                    {showPhotoUpload && (
                        <div style={{ marginBottom: '20px' }}>
                            <div
                                style={{
                                    marginBottom: '10px',
                                    fontWeight: 'bold',
                                    color: '#2d3436'
                                }}
                            >
                                관련 사진을 업로드해주세요. 📸
                            </div>
                            <div
                                style={{
                                    border: '2px dashed #fdcb6e',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    background: 'white',
                                    marginBottom: '20px'
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: 'none',
                                        background: 'transparent'
                                    }}
                                />
                                <div
                                    style={{
                                        color: '#666',
                                        fontSize: '14px',
                                        marginTop: '10px'
                                    }}
                                >
                                    파일을 선택하거나 여기로 드래그하세요
                                </div>
                            </div>
                        </div>
                    )}

                    <StackedInputs
                        missionId={missionId}
                        gradeGroup={gradeGroup}
                        stackedInputs={currentStackedInputs}
                        stackedAnswers={stackedAnswers}
                        onAnswerChange={onStackedChange}
                        onC3GeneratePoster={missionId === 'C-3' ? generateC3Poster : undefined}
                        isGeneratingC3Image={missionId === 'C-3' ? isGeneratingC3Image : undefined}
                    />

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button
                            type="submit"
                            style={{
                                background: '#fdcb6e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '15px 40px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            미션 내용 수정하기!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DirectTextMode;
