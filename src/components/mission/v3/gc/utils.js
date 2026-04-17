export const buildFullPrompt = (fields, taskLabel) => {
  const parts = [];
  if (fields.audience) parts.push(`${fields.audience}을(를) 대상으로`);
  if (fields.goal) parts.push(fields.goal);
  if (fields.tone) parts.push(`${fields.tone} 분위기로`);
  if (fields.format) parts.push(`${fields.format} 형식으로`);
  if (fields.must_include) parts.push(`"${fields.must_include}" 내용을 포함해서`);
  if (fields.length) parts.push(`${fields.length}으로`);
  if (parts.length === 0) return '';
  return `${taskLabel} ${parts.join(', ')} 써줘.`;
};
