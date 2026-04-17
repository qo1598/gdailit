import React, { useState, useEffect, useRef } from 'react';
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
  const isTestAccount = userId?.startsWith('test');
  // 단계별 최소 머무름 시간 (ms) — test 계정은 0으로 스킵
  const MIN_DWELL_MS = isTestAccount ? {} : { intro: 4000, core: 6000, task: 4000 };
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

  // ── 최소 머무름 시간 ──────────────────────────────────────────
  const [dwellRemaining, setDwellRemaining] = useState(0);
  const dwellCountdownRef = useRef(null);

  useEffect(() => {
    if (dwellCountdownRef.current) clearInterval(dwellCountdownRef.current);
    const minMs = MIN_DWELL_MS[stage] || 0;
    if (minMs <= 0) { setDwellRemaining(0); return; }
    const startTime = Date.now();
    setDwellRemaining(minMs);
    dwellCountdownRef.current = setInterval(() => {
      const remaining = Math.max(0, minMs - (Date.now() - startTime));
      setDwellRemaining(remaining);
      if (remaining === 0) clearInterval(dwellCountdownRef.current);
    }, 500);
    return () => clearInterval(dwellCountdownRef.current);
  }, [stage, stepIndex, slideIndex]);

  // ── 화면 체류 시간 측정 (task 단계) ──────────────────────────
  const [timeSpent, setTimeSpent] = useState({});   // { step1: 초, step2: 초, ... }
  const taskStepEnteredAt = useRef({});

  useEffect(() => {
    if (stage !== 'task') return;
    const stepId = gradeSpec?.steps[stepIndex]?.id;
    if (stepId) taskStepEnteredAt.current[stepId] = Date.now();
  }, [stage, stepIndex]);

  const recordTaskStepTime = () => {
    if (stage !== 'task') return;
    const stepId = gradeSpec?.steps[stepIndex]?.id;
    if (stepId && taskStepEnteredAt.current[stepId]) {
      const elapsed = Math.round((Date.now() - taskStepEnteredAt.current[stepId]) / 1000);
      setTimeSpent(prev => ({ ...prev, [stepId]: elapsed }));
    }
  };

  // ── 힌트 사용 추적 ────────────────────────────────────────────
  const [hintUsed, setHintUsed] = useState({});   // { step1: true, ... }

  const handleHintUsed = (stepId) => {
    setHintUsed(prev => ({ ...prev, [stepId]: true }));
  };

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
      if (answer.includes('other') && !answers[`${step.id}_other_text`]?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '기타 내용을 직접 적어주세요!' }));
        return false;
      }
    }
    if (step.uiMode === 'single_select_buttons') {
      if (!answer && step.validation?.required !== false) {
        setUiState(prev => ({ ...prev, validationError: '항목을 선택해주세요.' }));
        return false;
      }
      if (answer === 'other' && !answers[`${step.id}_other_text`]?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '기타 내용을 직접 적어주세요!' }));
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
      if ((answer.reasons || []).includes('other') && !answer?.other_text?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '기타 이유를 직접 적어주세요!' }));
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
    if (step.uiMode === 'prompt_single_input') {
      const minLen = step.validation?.minLength || 20;
      if (!answer?.prompt_revised?.trim() || answer.prompt_revised.trim().length < minLen) {
        setUiState(prev => ({ ...prev, validationError: `프롬프트를 ${minLen}자 이상 직접 작성해주세요.` }));
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
    // ─── E-3-L uiModes ───
    if (step.uiMode === 'single_select_cards') {
      if (!answer) {
        setUiState(prev => ({ ...prev, validationError: '주제를 하나 선택해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'yesno_quiz') {
      const topic = answers['step1'];
      const questions = topic ? (step.questionsByTopic?.[topic] || []) : [];
      const answered = (answer || []).length;
      if (answered < questions.length) {
        setUiState(prev => ({ ...prev, validationError: `질문에 모두 답해주세요. (${answered}/${questions.length}개 완료)` }));
        return false;
      }
    }
    if (step.uiMode === 'recommendation_reveal') {
      if (!answer) {
        setUiState(prev => ({ ...prev, validationError: '추천 결과를 확인해주세요.' }));
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
        setUiState(prev => ({ ...prev, validationError: `${min}개 이상 선택해주세요.` }));
        return false;
      }
      if (answer.includes('other') && !answers[`${step.id}_other_text`]?.trim()) {
        setUiState(prev => ({ ...prev, validationError: '기타 내용을 직접 적어주세요!' }));
        return false;
      }
    }
    if (step.uiMode === 'sample_full_carousel') {
      const samples = step.samples || [];
      const isSampleDone = (sa) => {
        if (!sa?.judgment) return false;
        if (sa.judgment !== 'use') {
          if (!sa.reason) return false;
          if (sa.reason === 'other' && !sa.reason_other?.trim()) return false;
          if (!sa.plan?.trim()) return false;
        }
        return true;
      };
      const done = samples.filter(s => isSampleDone(answer?.[s.id])).length;
      if (done < samples.length) {
        setUiState(prev => ({ ...prev, validationError: `모든 응답을 처리해주세요. (${done}/${samples.length}개 완료)` }));
        return false;
      }
    }
    if (step.uiMode === 'monitor_display') {
      // 읽기 확인 불필요 시 항상 통과
      return true;
    }
    if (step.uiMode === 'per_response_judge') {
      const total = (step.samples || []).length;
      const judged = Object.keys(answer || {}).length;
      if (judged < total) {
        setUiState(prev => ({ ...prev, validationError: `모든 응답에 판단을 선택해주세요. (${judged}/${total}개 완료)` }));
        return false;
      }
    }
    if (step.uiMode === 'filtered_reason_select') {
      const sourceStepId = step.sourceStepId || 'step2';
      const filterJudgments = step.filterJudgments || ['revise', 'verify'];
      const sourceAnswers = answers[sourceStepId] || {};
      const sourceStep = gradeSpec?.steps?.find(s => s.id === sourceStepId);
      const filteredSamples = (sourceStep?.samples || []).filter(s => filterJudgments.includes(sourceAnswers[s.id]));
      if (filteredSamples.length === 0) return true;
      const allDone = filteredSamples.every(s => answer?.[s.id]);
      if (!allDone) {
        setUiState(prev => ({ ...prev, validationError: '모든 응답에 이유를 선택해주세요.' }));
        return false;
      }
      const otherTexts = answers[`${step.id}_other_text`] || {};
      const missingOther = filteredSamples.some(s => answer?.[s.id] === 'other' && !otherTexts[s.id]?.trim());
      if (missingOther) {
        setUiState(prev => ({ ...prev, validationError: '기타 이유를 직접 적어주세요!' }));
        return false;
      }
    }
    if (step.uiMode === 'filtered_plan_text') {
      const sourceStepId = step.sourceStepId || 'step2';
      const filterJudgments = step.filterJudgments || ['revise', 'verify'];
      const sourceAnswers = answers[sourceStepId] || {};
      const sourceStep = gradeSpec?.steps?.find(s => s.id === sourceStepId);
      const filteredSamples = (sourceStep?.samples || []).filter(s => filterJudgments.includes(sourceAnswers[s.id]));
      if (filteredSamples.length === 0) return true;
      const allFilled = filteredSamples.every(s => answer?.[s.id]?.trim());
      if (!allFilled) {
        setUiState(prev => ({ ...prev, validationError: '모든 응답에 계획을 작성해주세요.' }));
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
    // ─── E-3-M uiModes ───
    if (step.uiMode === 'clothing_grid_with_rec') {
      return true; // 읽기 전용 단계
    }
    if (step.uiMode === 'star_rating_carousel') {
      const minRated = step.validation?.minRated || 10;
      const ratedCount = Object.keys(answer || {}).length;
      if (ratedCount < minRated) {
        setUiState(prev => ({ ...prev, validationError: `옷 ${minRated}개 이상에 별점을 주세요. (현재 ${ratedCount}개)` }));
        return false;
      }
    }
    if (step.uiMode === 'recommendation_grid') {
      if (!answer?.confirmed) {
        setUiState(prev => ({ ...prev, validationError: '추천 결과를 확인해주세요.' }));
        return false;
      }
    }
    if (step.uiMode === 'multi_free_text') {
      const minAnswered = step.validation?.minAnswered || 1;
      const answeredCount = (step.questions || []).filter(q => answer?.[q.id]?.trim()).length;
      if (answeredCount < minAnswered) {
        setUiState(prev => ({ ...prev, validationError: `질문 ${minAnswered}개 모두 답해주세요. (현재 ${answeredCount}개)` }));
        return false;
      }
    }
    // ─── E-4-L uiModes ───
    if (step.uiMode === 'case_view_carousel') {
      return true;
    }
    if (step.uiMode === 'person_reason_select') {
      if (!answer?.person) {
        setUiState(prev => ({ ...prev, validationError: '더 어려울 것 같은 사람을 선택해주세요.' }));
        return false;
      }
      if (!answer?.reasons || answer.reasons.length === 0) {
        setUiState(prev => ({ ...prev, validationError: '이유를 1개 이상 선택해주세요.' }));
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
      recordTaskStepTime();
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
      recordTaskStepTime();
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
      await submitMissionV3({ userId, gradeSpec, mission, answers, startedAt, hintUsed, timeSpent });
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
      dwellRemaining={dwellRemaining}
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
        onHintUsed={handleHintUsed}
      />
    </MissionShell>
  );
};

export default MissionRunner;
