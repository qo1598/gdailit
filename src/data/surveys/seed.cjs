// src/data/surveys/seed.cjs
// 실행: node src/data/surveys/seed.cjs
// 필요 환경변수: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js');
const items = require('./post_mission_items.json');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log(`총 ${items.items.length}개 문항 upsert 시작...`);

  const { error, count } = await supabase
    .from('ksa_item_bank')
    .upsert(items.items, {
      onConflict: 'survey_type,ksa_code,grade_band',
      count: 'exact'
    });

  if (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }

  console.log(`✅ 완료: ${items.items.length}개 문항 저장`);

  const { data: check } = await supabase
    .from('ksa_item_bank')
    .select('ksa_category, grade_band', { count: 'exact' });

  const summary = {};
  check.forEach(({ ksa_category, grade_band }) => {
    const key = `${ksa_category}-${grade_band}`;
    summary[key] = (summary[key] || 0) + 1;
  });
  console.log('\n[카테고리별 현황]');
  Object.entries(summary).sort().forEach(([k, v]) => console.log(`  ${k}: ${v}개`));
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
