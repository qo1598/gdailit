import React from 'react';
import { ClassifyCards, MultiSelectChips, PerCardTags, MultiFreeText, FreeText } from './sj/listModes';
import { PerCaseJudge, ChatDisplay, BubbleSelectCorrect, MatchSelect } from './sj/judgeModes';
import { SampleFullCarousel, MonitorCarousel, PerResponseJudgeCarousel } from './sj/sampleCarousels';
import { FilteredReasonCarousel, FilteredPlanCarousel } from './sj/filteredCarousels';
import { ClassifyCarousel, CaseCarouselReason } from './sj/classifyModes';
import { ClothingGridWithRec, StarRatingCarousel, RecommendationGrid } from './sj/clothingModes';

/**
 * SJRenderer — Statement & Judgement renderer.
 * Dispatches to uiMode-specific components in ./sj/.
 */
const MODE_MAP = {
  sample_full_carousel: SampleFullCarousel,
  classify_cards_carousel: ClassifyCarousel,
  classify_cards: ClassifyCards,
  multi_select_chips: MultiSelectChips,
  per_case_judge: PerCaseJudge,
  per_card_tags: PerCardTags,
  chat_display: ChatDisplay,
  bubble_select_correct: BubbleSelectCorrect,
  match_select: MatchSelect,
  clothing_grid_with_rec: ClothingGridWithRec,
  star_rating_carousel: StarRatingCarousel,
  recommendation_grid: RecommendationGrid,
  multi_free_text: MultiFreeText,
  monitor_display: MonitorCarousel,
  per_response_judge: PerResponseJudgeCarousel,
  filtered_reason_select: FilteredReasonCarousel,
  filtered_plan_text: FilteredPlanCarousel,
  case_carousel_reason: CaseCarouselReason,
  free_text: FreeText,
};

const SJRenderer = (props) => {
  const Component = MODE_MAP[props.step.uiMode];
  if (Component) return <Component {...props} />;
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
      알 수 없는 SJ UI 유형: {props.step.uiMode}
    </div>
  );
};

export default SJRenderer;
