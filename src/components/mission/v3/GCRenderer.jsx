import React from 'react';
import { ImageViewStep, DefectSelectStep, SingleSelectStep, ImageCompareStep } from './gc/imageSteps';
import { TaskAndPromptStep, PromptWithConditionsStep, PromptBuilderStep, PromptSingleInputStep } from './gc/promptSteps';
import { TextCompareABStep, ResultCompareFinalStep } from './gc/compareSteps';

/**
 * GCRenderer — Generation & Critical Evaluation renderer.
 * Dispatches to uiMode-specific components in ./gc/.
 */
const MODE_MAP = {
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
};

const GCRenderer = (props) => {
  const Component = MODE_MAP[props.step.uiMode];
  if (Component) return <Component {...props} />;
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 GC UI 유형: {props.step.uiMode}
    </div>
  );
};

export default GCRenderer;
