import React from 'react';
import { ImageViewStep, DefectSelectStep, SingleSelectStep, ImageCompareStep } from './gc/imageSteps';
import { TaskAndPromptStep, PromptWithConditionsStep, PromptBuilderStep, PromptSingleInputStep } from './gc/promptSteps';
import { TextCompareABStep, ResultCompareFinalStep } from './gc/compareSteps';
import { AiOptionPickerStep, AiChatTurnStep } from './gc/aiChatSteps';
import { FreeTextWithRefs, SentencePickWithReason, OptionAdoptHold } from './gc/creativeSteps';
// C영역 재활용: TD/SJ 기존 컴포넌트
import { SingleSelectCards, FreeText } from './td/selectModes';
import { MultiSelectChips, MultiFreeText } from './sj/listModes';
import { PerCaseJudge } from './sj/judgeModes';

/**
 * GCRenderer — Generation & Critical Evaluation renderer.
 * Dispatches to uiMode-specific components in ./gc/ (and reused TD/SJ components for C영역).
 */
const MODE_MAP = {
  // GC native
  image_view: ImageViewStep,
  defect_select: DefectSelectStep,
  single_select_buttons: SingleSelectStep,
  image_compare_ab: ImageCompareStep,
  task_and_prompt: TaskAndPromptStep,
  prompt_with_conditions: PromptWithConditionsStep,
  text_compare_ab: TextCompareABStep,
  prompt_builder: PromptBuilderStep,
  prompt_single_input: PromptSingleInputStep,
  result_compare_final: ResultCompareFinalStep,
  // C영역 신규
  ai_option_picker: AiOptionPickerStep,
  ai_chat_turn: AiChatTurnStep,
  free_text_with_refs: FreeTextWithRefs,
  sentence_pick_with_reason: SentencePickWithReason,
  option_adopt_hold: OptionAdoptHold,
  // C영역 재활용
  single_select_cards: SingleSelectCards,
  free_text: FreeText,
  multi_select_chips: MultiSelectChips,
  multi_free_text: MultiFreeText,
  per_case_judge: PerCaseJudge,
};

const GCRenderer = ({ gradeSpec, ...props }) => {
  const Component = MODE_MAP[props.step.uiMode];
  if (Component) return <Component gradeSpec={gradeSpec} {...props} />;
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 GC UI 유형: {props.step.uiMode}
    </div>
  );
};

export default GCRenderer;
