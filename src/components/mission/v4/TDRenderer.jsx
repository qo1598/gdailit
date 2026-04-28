import React from 'react';
import { ChoiceCards, SingleSelectButtons, SingleSelectCards, FreeText, CaseViewCarousel, PersonReasonSelect } from './td/selectModes';
import { JudgeQaCarousel } from './td/judgeModes';
import { PhotoUpload } from './td/photoMode';
import { YesNoQuiz, RecommendationReveal } from './td/recommendationModes';
import { PerCaseJudge } from './sj/judgeModes';
import { CardDropBoard } from './td/cardDropBoard';
import { PromptBuilder } from './td/promptBuilder';

export { computeRecommendation } from './td/recommendationModes';

/**
 * TDRenderer — Exploration & Identification renderer.
 * Dispatches to uiMode-specific components in ./td/.
 */
const MODE_MAP = {
  choice_cards: ChoiceCards,
  single_select_buttons: SingleSelectButtons,
  photo_or_card_select: PhotoUpload,
  judge_qa_carousel: JudgeQaCarousel,
  single_select_cards: SingleSelectCards,
  yesno_quiz: YesNoQuiz,
  recommendation_reveal: RecommendationReveal,
  free_text: FreeText,
  case_view_carousel: CaseViewCarousel,
  person_reason_select: PersonReasonSelect,
  per_case_judge: PerCaseJudge,
  card_drop_board: CardDropBoard,
  prompt_builder: PromptBuilder,
};

const TDRenderer = ({ gradeSpec, ...props }) => {
  const Component = MODE_MAP[props.step.uiMode];
  if (Component) return <Component gradeSpec={gradeSpec} {...props} />;
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 TD UI 유형: {props.step.uiMode}
    </div>
  );
};

export default TDRenderer;
