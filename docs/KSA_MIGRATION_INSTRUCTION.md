# KSA 매핑 수정 지시서 (Claude Code용)

> **작업 범위**: `src/data/missionsV4/` 하위 8개 미션 파일의 KSA 매핑을 학년별로 분리하고, 학술적 검증을 통과한 최종안으로 수정한다.
> **원칙**: 각 파일별 최소 침습. 다른 필드는 건드리지 않음.
> **대상 파일**: E-1, E-2, E-3, E-4, C-1, C-2, C-3, C-4 (총 8개)

---

## 1. 구조 변경 개요

**현재 구조**
```js
meta: {
  code: "E-1",
  title: "...",
  domain: "Engaging",
  ksa: { K: [...], S: [...], A: [...] }   // ← 카드 전체 공유
}
```

**변경 후 구조**
```js
meta: {
  code: "E-1",
  title: "...",
  domain: "Engaging"
  // meta.ksa 필드 제거
},
grades: {
  lower: {
    cardCode: "E-1-L",
    performanceType: "TD",
    ksa: { K: [...], S: [...], A: [...] },   // ← 새로 추가
    description: "...",
    ...
  },
  middle: {
    cardCode: "E-1-M",
    performanceType: "TD",
    ksa: { K: [...], S: [...], A: [...] },   // ← 새로 추가
    ...
  },
  upper: {
    cardCode: "E-1-H",
    performanceType: "SJ",
    ksa: { K: [...], S: [...], A: [...] },   // ← 새로 추가
    ...
  }
}
```

**위치 규칙**: 각 grade 블록 안에서 `cardCode`, `performanceType` 바로 다음 줄에 `ksa` 필드를 삽입한다. `description` 앞.

---

## 2. 렌더러 사전 점검 (작업 전 확인)

KSA를 학년별로 분리하기 전, **렌더러가 `meta.ksa`를 직접 참조하고 있는지** 확인한다.

### 2-1. 영향 확인 대상 파일
```
src/components/Mission/v4/MissionRunner.jsx
src/components/Mission/v4/StageRenderer.jsx
src/components/Mission/v4/MissionShell.jsx
src/lib/submitMissionV4.js
```

### 2-2. 확인 명령
```bash
grep -rn "meta.ksa\|mission.meta.ksa\|meta\?.ksa" src/
```

### 2-3. 검색 결과별 조치
- **결과 없음** → 그대로 파일 수정 진행 (권장 경로)
- **결과 있음** → 해당 위치를 `gradeSpec.ksa || mission.meta.ksa`로 변경. 기존 meta.ksa는 fallback으로 남김
- **submit payload에 ksa 저장 로직이 있으면** → `gradeSpec.ksa`를 우선 저장하도록 수정

---

## 3. 파일별 최종 KSA 매핑

각 grade 블록에 삽입할 `ksa` 값의 최종안이다. 이 표를 그대로 적용하면 된다.

### 3-1. E-1.js (변경: meta.ksa 제거, grade별 ksa 추가)

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K1.4"]` | `["Self and Social Awareness"]` | `["Curious"]` |
| middle | `["K1.4"]` | `["Self and Social Awareness"]` | `["Curious"]` |
| upper | `["K1.4"]` | `["Critical Thinking"]` | `["Curious"]` |

### 3-2. E-2.js (⚠️ K4.4 제거, H에 K3.3 추가)

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K4.3"]` | `["Critical Thinking"]` | `["Responsible"]` |
| middle | `["K4.3"]` | `["Critical Thinking"]` | `["Responsible"]` |
| upper | `["K4.3", "K3.3"]` | `["Critical Thinking"]` | `["Responsible"]` |

### 3-3. E-3.js

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K1.1"]` | `["Self and Social Awareness"]` | `["Curious"]` |
| middle | `["K1.1", "K5.1"]` | `["Self and Social Awareness"]` | `["Curious"]` |
| upper | `["K1.1", "K5.1"]` | `["Self and Social Awareness"]` | `["Curious"]` |

### 3-4. E-4.js

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K2.5"]` | `["Self and Social Awareness"]` | `["Empathetic"]` |
| middle | `["K2.5", "K5.4"]` | `["Critical Thinking"]` | `["Empathetic"]` |
| upper | `["K2.5", "K5.4"]` | `["Critical Thinking"]` | `["Empathetic"]` |

### 3-5. C-1.js (⚠️ Collaboration 유지, H에 K5.3 추가)

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K1.3"]` | `["Creativity"]` | `["Innovative"]` |
| middle | `["K1.3"]` | `["Creativity", "Collaboration"]` | `["Innovative"]` |
| upper | `["K1.3", "K5.3"]` | `["Creativity", "Collaboration"]` | `["Responsible"]` |

### 3-6. C-2.js

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K4.1"]` | `["Creativity"]` | `["Curious"]` |
| middle | `["K4.1"]` | `["Creativity"]` | `["Adaptable"]` |
| upper | `["K4.1"]` | `["Creativity"]` | `["Adaptable"]` |

### 3-7. C-3.js (⚠️ K4.2 전체 제거, K5.3으로 교체)

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K5.3"]` | `["Creativity"]` | `["Curious"]` |
| middle | `["K5.3"]` | `["Creativity"]` | `["Adaptable"]` |
| upper | `["K5.3"]` | `["Creativity", "Critical Thinking"]` | `["Responsible"]` |

### 3-8. C-4.js (⚠️ H에 K3.3 추가)

| Grade | K | S | A |
|---|---|---|---|
| lower | `["K5.3"]` | `["Self and Social Awareness"]` | `["Responsible"]` |
| middle | `["K5.3"]` | `["Communication"]` | `["Responsible"]` |
| upper | `["K5.3", "K3.3"]` | `["Communication"]` | `["Responsible"]` |

---

## 4. 파일별 구체 작업 지시 (Claude Code 실행 순서)

### 공통 작업 패턴 (모든 파일)

1. 파일 열기
2. `meta.ksa` 필드 전체 라인 제거 (meta 블록의 마지막 필드가 되면 직전 라인 끝의 콤마도 제거)
3. `grades.lower.cardCode` 다음 줄에 `ksa` 필드 삽입
4. `grades.middle.cardCode` 다음 줄에 `ksa` 필드 삽입
5. `grades.upper.cardCode` 다음 줄에 `ksa` 필드 삽입 (upper가 있는 경우만)

### 삽입 위치 예시

```js
// 변경 전
lower: {
  cardCode: "E-1-L",
  performanceType: "TD",
  description: "생활 속에서 AI가 들어 있는 것을 찾아보는 미션이에요.",
  ...
}

// 변경 후
lower: {
  cardCode: "E-1-L",
  performanceType: "TD",
  ksa: { K: ["K1.4"], S: ["Self and Social Awareness"], A: ["Curious"] },
  description: "생활 속에서 AI가 들어 있는 것을 찾아보는 미션이에요.",
  ...
}
```

### meta 수정 예시

```js
// 변경 전
meta: {
  code: "E-1",
  title: "생활 속 AI 찾기",
  domain: "Engaging",
  ksa: { K: ["K1.4"], S: ["Self and Social Awareness"], A: ["Curious"] }
},

// 변경 후
meta: {
  code: "E-1",
  title: "생활 속 AI 찾기",
  domain: "Engaging"
},
```

---

## 5. 검증 스크립트

작업 완료 후 `scripts/verify_ksa_migration.cjs`를 생성하여 실행한다. 실행 결과가 아래와 정확히 일치해야 작업 완료.

### 5-1. 스크립트 코드

```js
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
  'C-2': {
    lower:  { K: ["K4.1"], S: ["Creativity"], A: ["Curious"] },
    middle: { K: ["K4.1"], S: ["Creativity"], A: ["Adaptable"] },
    upper:  { K: ["K4.1"], S: ["Creativity"], A: ["Adaptable"] },
  },
  'C-3': {
    lower:  { K: ["K5.3"], S: ["Creativity"], A: ["Curious"] },
    middle: { K: ["K5.3"], S: ["Creativity"], A: ["Adaptable"] },
    upper:  { K: ["K5.3"], S: ["Creativity", "Critical Thinking"], A: ["Responsible"] },
  },
  'C-4': {
    lower:  { K: ["K5.3"], S: ["Self and Social Awareness"], A: ["Responsible"] },
    middle: { K: ["K5.3"], S: ["Communication"], A: ["Responsible"] },
    upper:  { K: ["K5.3", "K3.3"], S: ["Communication"], A: ["Responsible"] },
  },
};

const arrEq = (a, b) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

async function run() {
  let allPass = true;
  for (const [code, gradeExp] of Object.entries(EXPECTED)) {
    const filePath = path.join(missionsPath, `${code}.js`);
    const mod = await import(filePath);
    const mission = Object.values(mod)[0];

    // meta.ksa가 남아있으면 실패
    if (mission.meta.ksa !== undefined) {
      console.log(`✗ ${code}: meta.ksa가 아직 남아있음. 제거 필요.`);
      allPass = false;
      continue;
    }

    for (const grade of ['lower', 'middle', 'upper']) {
      const g = mission.grades[grade];
      if (!g) continue; // upper가 없는 카드 대비
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
```

### 5-2. 실행
```bash
node scripts/verify_ksa_migration.cjs
```

### 5-3. 기대 출력 (24개 grade 모두 통과)
```
✓ E-1.lower
✓ E-1.middle
✓ E-1.upper
✓ E-2.lower
✓ E-2.middle
✓ E-2.upper
... (총 24줄)
✅ 모든 파일 검증 통과
```

---

## 6. 커버리지 최종 확인 (선택)

검증 스크립트 통과 후, `scripts/ksa_coverage_check.cjs`를 추가로 실행하면 AILit 31개 구인 모두 최소 1회 이상 매핑됐는지 확인할 수 있다.

```js
// scripts/ksa_coverage_check.cjs
const path = require('path');
const missionsPath = path.resolve(__dirname, '../src/data/missionsV4');

const AILIT_K = ["K1.1","K1.2","K1.3","K1.4","K2.1","K2.2","K2.3","K2.4","K2.5",
                 "K3.1","K3.2","K3.3","K4.1","K4.2","K4.3","K5.1","K5.2","K5.3","K5.4"];
const AILIT_S = ["Critical Thinking","Creativity","Computational Thinking",
                 "Self and Social Awareness","Collaboration","Communication","Problem Solving"];
const AILIT_A = ["Responsible","Curious","Innovative","Adaptable","Empathetic"];

async function run() {
  const codes = ['E-1','E-2','E-3','E-4','C-1','C-2','C-3','C-4',
                 'M-1','M-2','M-3','M-4','D-1','D-2','D-3','D-4'];
  const kCov = {}, sCov = {}, aCov = {};
  [...AILIT_K].forEach(k => kCov[k] = []);
  [...AILIT_S].forEach(s => sCov[s] = []);
  [...AILIT_A].forEach(a => aCov[a] = []);

  for (const code of codes) {
    const filePath = path.join(missionsPath, `${code}.js`);
    let mod;
    try {
      mod = await import(filePath);
    } catch {
      console.log(`⚠ ${code}.js 파일 없음 (스킵)`);
      continue;
    }
    const mission = Object.values(mod)[0];
    for (const grade of ['lower','middle','upper']) {
      const g = mission.grades?.[grade];
      if (!g?.ksa) continue;
      g.ksa.K?.forEach(k => { if (kCov[k]) kCov[k].push(`${code}-${grade[0].toUpperCase()}`); });
      g.ksa.S?.forEach(s => { if (sCov[s]) sCov[s].push(`${code}-${grade[0].toUpperCase()}`); });
      g.ksa.A?.forEach(a => { if (aCov[a]) aCov[a].push(`${code}-${grade[0].toUpperCase()}`); });
    }
  }

  console.log('\n[K 19개]');
  AILIT_K.forEach(k => console.log(`  ${kCov[k].length ? '✓' : '✗'} ${k}: ${kCov[k].length}회`));
  console.log('\n[S 7개]');
  AILIT_S.forEach(s => console.log(`  ${sCov[s].length ? '✓' : '✗'} ${s}: ${sCov[s].length}회`));
  console.log('\n[A 5개]');
  AILIT_A.forEach(a => console.log(`  ${aCov[a].length ? '✓' : '✗'} ${a}: ${aCov[a].length}회`));
}

run();
```

**M, D 파일이 아직 기존 구조라면** 해당 파일은 "스킵"으로 표시되고, E/C만으로 부분 커버리지가 나온다. M, D도 나중에 같은 구조로 마이그레이션하면 전체 커버리지 확인 가능.

---

## 7. 작업 체크리스트

Claude Code가 작업 완료 후 다음을 순서대로 확인:

- [ ] 2-2의 grep 명령으로 렌더러 영향 확인
- [ ] E-1.js 수정 (meta.ksa 제거 + grade별 ksa 3개 추가)
- [ ] E-2.js 수정 (K4.4 제거 주의, upper에 K3.3)
- [ ] E-3.js 수정
- [ ] E-4.js 수정
- [ ] C-1.js 수정 (middle/upper에 Collaboration 유지)
- [ ] C-2.js 수정
- [ ] C-3.js 수정 (K4.2 전체 제거, K5.3으로 교체)
- [ ] C-4.js 수정 (upper에 K3.3)
- [ ] 5-1 검증 스크립트 생성 및 실행
- [ ] 검증 통과 확인 (24/24)
- [ ] (선택) 6의 커버리지 스크립트 실행

---

## 8. 주의 사항

- **다른 필드 건드리지 말 것**: `scenario`, `steps`, `submit`, `intro`, `coreUnderstanding` 등은 이번 작업 범위 밖
- **JS 객체 키 순서**: JavaScript 객체 키 순서는 동작에 영향 없음. `ksa` 위치는 가독성을 위해 `cardCode`, `performanceType` 바로 다음에 두는 것을 권장할 뿐
- **ESLint 경고**: 일부 프로젝트는 객체 속성 순서에 lint 규칙이 있을 수 있음. 오류 뜨면 해당 규칙을 무시하거나 순서 조정
- **배열 순서 중요**: `K: ["K4.3", "K3.3"]`와 `K: ["K3.3", "K4.3"]`은 검증 스크립트가 다르게 판단함. 표에 적힌 순서 그대로 입력할 것
