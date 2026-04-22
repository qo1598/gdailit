// scripts/verify_ksa_migration.cjs
const path = require('path');
const missionsPath = path.resolve(__dirname, '../src/data/missionsV4');

const EXPECTED = {
  'E-1': {
    lower:  { K: ["K1.4"], S: ["Self and Social Awareness"], A: ["Curious"] },
    middle: { K: ["K1.4"], S: ["Self and Social Awareness"], A: ["Curious"] },
    upper:  { K: ["K1.4"], S: ["Critical Thinking"], A: ["Curious"] },
  },
  'E-2': {
    lower:  { K: ["K4.3"], S: ["Critical Thinking"], A: ["Responsible"] },
    middle: { K: ["K4.3"], S: ["Critical Thinking"], A: ["Responsible"] },
    upper:  { K: ["K4.3", "K3.3"], S: ["Critical Thinking"], A: ["Responsible"] },
  },
  'E-3': {
    lower:  { K: ["K1.1"], S: ["Self and Social Awareness"], A: ["Curious"] },
    middle: { K: ["K1.1", "K5.1"], S: ["Self and Social Awareness"], A: ["Curious"] },
    upper:  { K: ["K1.1", "K5.1"], S: ["Self and Social Awareness"], A: ["Curious"] },
  },
  'E-4': {
    lower:  { K: ["K2.5"], S: ["Self and Social Awareness"], A: ["Empathetic"] },
    middle: { K: ["K2.5", "K5.4"], S: ["Critical Thinking"], A: ["Empathetic"] },
    upper:  { K: ["K2.5", "K5.4"], S: ["Critical Thinking"], A: ["Empathetic"] },
  },
  'C-1': {
    lower:  { K: ["K1.3"], S: ["Creativity"], A: ["Innovative"] },
    middle: { K: ["K1.3"], S: ["Creativity", "Collaboration"], A: ["Innovative"] },
    upper:  { K: ["K1.3", "K5.3"], S: ["Creativity", "Collaboration"], A: ["Responsible"] },
  },
};

const arrEq = (a, b) =>
  Array.isArray(a) && Array.isArray(b) &&
  a.length === b.length && a.every((x, i) => x === b[i]);

async function run() {
  let allPass = true;
  for (const [code, gradeExp] of Object.entries(EXPECTED)) {
    const filePath = path.join(missionsPath, `${code}.js`);
    const fileUrl = new URL(`file:///${filePath.replace(/\\/g, '/')}`);
    const mod = await import(fileUrl);
    const mission = Object.values(mod)[0];

    if (mission.meta.ksa !== undefined) {
      console.log(`✗ ${code}: meta.ksa가 아직 남아있음`);
      allPass = false;
      continue;
    }

    for (const grade of ['lower', 'middle', 'upper']) {
      const g = mission.grades[grade];
      if (!g) continue;
      const exp = gradeExp[grade];
      if (!g.ksa) {
        console.log(`✗ ${code}.${grade}: ksa 필드 누락`);
        allPass = false;
        continue;
      }
      const ok =
        arrEq(g.ksa.K || [], exp.K) &&
        arrEq(g.ksa.S || [], exp.S) &&
        arrEq(g.ksa.A || [], exp.A);
      if (ok) {
        console.log(`✓ ${code}.${grade}`);
      } else {
        console.log(`✗ ${code}.${grade}`);
        console.log(`  expected: K=${JSON.stringify(exp.K)} S=${JSON.stringify(exp.S)} A=${JSON.stringify(exp.A)}`);
        console.log(`  actual:   K=${JSON.stringify(g.ksa.K)} S=${JSON.stringify(g.ksa.S)} A=${JSON.stringify(g.ksa.A)}`);
        allPass = false;
      }
    }
  }
  console.log(allPass ? '\n✅ 모든 파일 검증 통과' : '\n❌ 일부 파일 검증 실패');
  process.exit(allPass ? 0 : 1);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
