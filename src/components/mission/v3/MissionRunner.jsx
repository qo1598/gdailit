import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MISSIONS_V3 } from '../../../data/missionsV3';
import MissionShell from './MissionShell';
import StageRenderer from './StageRenderer';

/**
 * V3 MissionRunner - Schema-driven mission engine.
 * stage flow: start → intro → core → task(step1..n) → submit → complete
 */
const MissionRunner = () => {
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
    setUiState(prev => ({ ...prev, loading: true }));
    try {
      const payload = buildPayload();
      console.log('[V3] Submission payload:', payload);
      // TODO: await supabase submit here
      setTimeout(() => {
        setStage('complete');
        setUiState(prev => ({ ...prev, loading: false }));
      }, 800);
    } catch (err) {
      setUiState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const buildPayload = () => {
    // Serialize each step's answer in a generic way
    const stepAnswers = {};
    gradeSpec.steps.forEach(step => {
      const ans = answers[step.id];
      if (ans === undefined || ans === null) return;
      stepAnswers[step.id] = ans;
    });

    return {
      mission_code: gradeSpec.cardCode,
      mission_base_code: mission.meta.code,
      domain: mission.meta.domain,
      grade_band: gradeSpec.cardCode.split('-').pop(),
      performance_type: gradeSpec.performanceType,
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      ...stepAnswers,
      step_trace: gradeSpec.steps.map(s => ({ step: s.id, completed: !!answers[s.id] })),
      completed: true
    };
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
