import React from 'react';
import { ChoiceCards, SingleSelectButtons, TagSelect, SingleSelectCards, FreeText } from './td/selectModes';
import { JudgeQaCards, JudgeQaCarousel } from './td/judgeModes';
import { PhotoUpload } from './td/photoMode';
import { YesNoQuiz, RecommendationReveal, ReasonReflect } from './td/recommendationModes';

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
  judge_qa_cards: JudgeQaCards,
  tag_select: TagSelect,
  single_select_cards: SingleSelectCards,
  yesno_quiz: YesNoQuiz,
  recommendation_reveal: RecommendationReveal,
  reason_reflect: ReasonReflect,
  free_text: FreeText,
};

const TDRenderer = (props) => {
  const Component = MODE_MAP[props.step.uiMode];
  if (Component) return <Component {...props} />;
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 TD UI 유형: {props.step.uiMode}
    </div>
  );
};

export default TDRenderer;
