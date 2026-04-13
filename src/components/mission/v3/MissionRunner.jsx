import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MISSIONS_V3 } from '../../../data/missionsV3/index.js';
import { submitMissionV3 } from '../../../lib/submitMissionV3.js';
import MissionShell from './MissionShell';
import StageRenderer from './StageRenderer';

/**
 * V3 MissionRunner - Schema-driven mission engine.
 * stage flow: start → intro → core → task(step1..n) → submit → complete
 */
const MissionRunner = ({ userId }) => {
  const { missionId, gradeGroup: gradeBand } = useParams();
  const navigate = useNavigate();

  const mission = MISSIONS_V3[missionId];
  const gradeSpec = mission?.grades[gradeBand];

  const [stage, setStage] = useState('start');
  const [stepIndex, setStepIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startedAt] = useState(() => new Date().toISOString());
  const [uiState, setUiState] = useState({
    loading: false,
    error: null,
    validationError: null
  });

  // Clear validation error whenever stage/step/answer changes
  useEffect(() => {
    setUiState(prev => ({ ...prev, validationError: null }));
  }, [stage, stepIndex, slideIndex, answers]);

  if (!mission || !gradeSpec) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
          미션을 찾을 수 없습니다.
        </h2>
        <button
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const totalSlides = gradeSpec.intro.length;
  const totalSteps = gradeSpec.steps.length;

  // --- Validation ---
  const validateCurrentStep = () => {
    if (stage !== 'task') return true;
    const step = gradeSpec.steps[stepIndex];
    const answer = answers[step.id];

    if (step.uiMode === 'choice_cards') {
      if (!answer || answer.length < (step.validation?.minSelections || 1)) {
        setUiState(prev => ({ ...prev, validationError: '최소 1개 이상 선택해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'single_select_buttons') {
      if (!answer && step.validation?.required !== false) {
        setUiState(prev => ({ ...prev, validationError: '항목을 선택해주세요.' }));
        return false;
      }
      if (answer === 'other' && !answers[`${step.id}_other_text`]?.trim()) {
        const label = step.id === 'step3' ? '장소' : '내용';
        setUiState(prev => ({ ...prev, validationError: `어떤 ${label}인지 직접 써주세요!` }));
        return false;
      }
    }
    if (step.uiMode === 'photo_or_card_select') {
      if (!answer?.value) {
        setUiState(prev => ({ ...prev, validationError: '항목을 선택해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'free_text') {
      if (step.validation?.required !== false && !answer?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '생각을 짧게 적어주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'defect_select') {
      if (!answer || answer.length < (step.validation?.minSelections || 1)) {
        setUiState(prev => ({ ...prev, validationError: '이상한 부분을 1개 이상 선택해주세요.' }));
        return false;
      }
      if (answer.includes('other_error') && !answers[`${step.id}_other_text`]?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '기타 내용을 직접 적어주세요!' }));
        return false;
      }
    }
    if (step.uiMode === 'image_compare_ab') {
      if (!answer?.image) {
        setUiState(prev => ({ ...prev, validationError: '그림을 선택해주세요.' }));
        return false;
      }
      if (!answer?.reasons || answer.reasons.length === 0) {
        setUiState(prev => ({ ...prev, validationError: '자연스러운 이유를 1개 이상 선택해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'task_and_prompt') {
      if (!answer?.task_type) {
        setUiState(prev => ({ ...prev, validationError: '과제를 선택해주세요.' }));
        return false;
      }
      if (!answer?.prompt_initial?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '프롬프트를 입력해주세요.' }));
        return false;
      }
      if (!answer?.output_initial) {
        setUiState(prev => ({ ...prev, validationError: 'AI 결과 보기 버튼을 눌러주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'prompt_with_conditions') {
      if (!answer?.prompt_detailed?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '자세한 프롬프트를 입력해주세요.' }));
        return false;
      }
      if (!answer?.output_detailed) {
        setUiState(prev => ({ ...prev, validationError: 'AI 결과 보기 버튼을 눌러주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'text_compare_ab') {
      if (!answer?.choice) {
        setUiState(prev => ({ ...prev, validationError: '더 좋은 결과를 선택해주세요.' }));
        return false;
      }
      if (!answer?.reasons || answer.reasons.length === 0) {
        setUiState(prev => ({ ...prev, validationError: '이유를 1개 이상 선택해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'prompt_builder') {
      const filledCount = (step.fields || []).filter(f => answer?.[f.id]?.trim()).length;
      if (filledCount < (step.validation?.minFields || 3)) {
        setUiState(prev => ({ ...prev, validationError: `요소를 ${step.validation?.minFields || 3}개 이상 채워주세요.` }));
        return false;
      }
      if (!answer?.output_revised) {
        setUiState(prev => ({ ...prev, validationError: 'AI 결과 보기 버튼을 눌러주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'result_compare_final') {
      if (!answer?.best) {
        setUiState(prev => ({ ...prev, validationError: '가장 좋은 결과를 선택해주세요.' }));
        return false;
      }
    }
    // ─── SJ uiModes ───
    if (step.uiMode === 'classify_cards_carousel') {
      const classified = Object.keys(answer || {}).length;
      const total = step.cards.length;
      if (classified < total) {
        setUiState(prev => ({ ...prev, validationError: `모든 항목을 분류해주세요. (${classified}/${total}개 완료)` }));
        return false;
      }
    }
    if (step.uiMode === 'multi_select_chips') {
      const min = step.validation?.minSelections || 1;
      if (!answer || answer.length < min) {
        setUiState(prev => ({ ...prev, validationError: `기준을 ${min}개 이상 선택해주세요.` }));
        return false;
      }
    }
    if (step.uiMode === 'per_case_judge') {
      const allDone = (step.cases || []).every(c => {
        const ca = answer?.[c.id] || {};
        if (!ca.judgment) return false;
        if (step.validation?.textRequired && !ca.text?.trim()) return false;
        return true;
      });
      if (!allDone) {
        const msg = step.validation?.textRequired
          ? '모든 사례에 판단을 선택하고 이유를 작성해주세요.'
          : '모든 사례에 판단을 선택해주세요.';
        setUiState(prev => ({ ...prev, validationError: msg }));
        return false;
      }
    }
    if (step.uiMode === 'judge_qa_carousel') {
      const cards = step.qaCards || [];
      const allDone = cards.every(c => {
        const ca = (answer || {})[c.id] || {};
        return ca.judge === 'correct' || (ca.judge === 'strange' && ca.reason);
      });
      if (!allDone) {
        setUiState(prev => ({ ...prev, validationError: '모든 질문에 판단과 이유를 선택해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'bubble_select_correct') {
      const selected = Object.entries(answer || {}).filter(([, v]) => v.selected);
      if (selected.length === 0) {
        setUiState(prev => ({ ...prev, validationError: '틀렸다고 생각하는 말풍선을 1개 이상 선택해주세요.' }));
        return false;
      }
      const missingReason = selected.some(([, v]) => !v.reason);
      if (missingReason) {
        setUiState(prev => ({ ...prev, validationError: '선택한 말풍선마다 틀린 이유를 골라주세요.' }));
        return false;
      }
    }
    // ─── DS uiModes ───
    if (step.uiMode === 'ds_training_cards') {
      const min = step.validation?.minHighlights || 2;
      if (!answer?.highlighted || answer.highlighted.length < min) {
        setUiState(prev => ({ ...prev, validationError: `특징을 ${min}개 이상 선택해주세요.` }));
        return false;
      }
    }
    if (step.uiMode === 'ds_rule_builder' || step.uiMode === 'ds_rule_revise') {
      const min = step.validation?.minConditions || 1;
      if (!answer?.conditions || answer.conditions.length < min) {
        setUiState(prev => ({ ...prev, validationError: '규칙 조건을 1개 이상 추가해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'ds_classify') {
      const allClassified = (step.newCards || []).every(c => answer?.[c.id]);
      if (!allClassified) {
        setUiState(prev => ({ ...prev, validationError: '모든 카드를 분류해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'ds_rule_save') {
      if (!answer?.best_rule) {
        setUiState(prev => ({ ...prev, validationError: '저장할 규칙을 선택해주세요.' }));
        return false;
      }
    }
    return true;
  };

  // --- Navigation ---
  const handleStart = () => {
    setSlideIndex(0);
    setStage('intro');
  };

  const handleNext = () => {
    if (stage === 'intro') {
      if (slideIndex < totalSlides - 1) {
        setSlideIndex(prev => prev + 1);
      } else {
        setStage('core');
      }
      return;
    }
    if (stage === 'core') {
      setStage('task');
      setStepIndex(0);
      return;
    }
    if (stage === 'task') {
      if (!validateCurrentStep()) return;
      if (stepIndex < totalSteps - 1) {
        setStepIndex(prev => prev + 1);
      } else {
        setStage('submit');
      }
      return;
    }
    if (stage === 'submit') {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (stage === 'intro') {
      if (slideIndex > 0) {
        setSlideIndex(prev => prev - 1);
      } else {
        setStage('start');
      }
      return;
    }
    if (stage === 'core') {
      setStage('intro');
      setSlideIndex(totalSlides - 1);
      return;
    }
    if (stage === 'task') {
      if (stepIndex > 0) {
        setStepIndex(prev => prev - 1);
      } else {
        setStage('core');
      }
      return;
    }
    if (stage === 'submit') {
      setStage('task');
      setStepIndex(totalSteps - 1);
    }
  };

  const handleSubmit = async () => {
    setUiState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await submitMissionV3({ userId, gradeSpec, mission, answers, startedAt });
      setStage('complete');
    } catch (err) {
      console.error('[V3] Submit failed:', err);
      setUiState(prev => ({ ...prev, error: err.message }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <MissionShell
      meta={mission.meta}
      gradeSpec={gradeSpec}
      stage={stage}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      onPrev={handlePrev}
      onNext={handleNext}
      onStart={handleStart}
      uiState={uiState}
    >
      <StageRenderer
        stage={stage}
        mission={mission}
        gradeSpec={gradeSpec}
        stepIndex={stepIndex}
        slideIndex={slideIndex}
        answers={answers}
        setAnswers={setAnswers}
        uiState={uiState}
        onStart={handleStart}
      />
    </MissionShell>
  );
};

export default MissionRunner;
