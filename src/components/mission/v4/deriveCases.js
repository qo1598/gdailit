/**
 * deriveCases — per_case_judge 등에서 step.cases 가 명시되지 않고
 * branch(sourceStepId/filterBy)로 동적으로 산출되어야 할 때,
 * 이전 step의 응답을 바탕으로 cases 배열을 만들어 준다.
 */
export function deriveCases(step, gradeSpec, answers) {
  if (Array.isArray(step?.cases) && step.cases.length > 0) return step.cases;
  const branch = step?.branch;
  if (!branch || !gradeSpec) return step?.cases || [];

  const sourceStep = gradeSpec.steps?.find(s => s.id === branch.sourceStepId);
  const sourceAns = answers?.[branch.sourceStepId] || {};
  if (!sourceStep) return [];

  // judge_qa_carousel / judge_qa_cards: { [cardId]: { judge, reason } } 또는 { [cardId]: judgeId }
  if (Array.isArray(sourceStep.qaCards)) {
    return sourceStep.qaCards
      .filter(c => {
        if (!branch.filterBy) return true;
        const a = sourceAns[c.id];
        const judge = (a && typeof a === 'object') ? a.judge : a;
        return judge === branch.filterBy;
      })
      .map(c => ({
        id: c.id,
        title: c.question,
        description: `AI 답: ${c.answer}`,
        question: c.question,
        answer: c.answer
      }));
  }

  // bubble_select_correct: { [bubbleId]: { selected, reason, correction } }
  if (Array.isArray(sourceStep.aiBubbles)) {
    return sourceStep.aiBubbles
      .filter(b => {
        if (!branch.filterBy) return true;
        const a = sourceAns[b.id] || {};
        if (branch.filterBy === 'strange' || branch.filterBy === 'selected') return !!a.selected;
        return false;
      })
      .map(b => ({
        id: b.id,
        title: b.context || (b.text || '').slice(0, 40),
        description: b.text
      }));
  }

  return step?.cases || [];
}
