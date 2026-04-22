# Claude Code 통합 작업 지시서 — 연구용 데이터 인프라 구축

> **목적**: LearnAILIT V4를 박사 학위 논문 수준의 실증 연구를 뒷받침할 수 있는 플랫폼으로 확장한다.
> **범위**: Supabase 스키마 확장(8개 테이블) + 클라이언트 로깅 + 설문 시스템 + 교사 평정 UI
> **원칙**: 프로젝트 `CLAUDE.md` 준수 — 토큰 절약·범위 최소화·계획→실행→검증→요약
> **참조 문서**:
> - `docs/research/research_data_design.md` (5개 연구용 테이블)
> - `docs/research/survey_schema.md` (3개 설문 테이블)
> - `docs/research/pre_post_survey_master.md` (사전-사후 48문항)
> - `docs/research/post_mission_self_eval_master.md` (미션 후 89문항 풀)
> - `docs/research/v4_mission_overview_v2.md` (48개 미션 KSA 최종 매핑)

---

## 0. 작업 전 필수 확인

### 0-1. 환경 변수
```
.env에 다음 키가 있는지 확인:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_GEMINI_API_KEY
- VITE_ENABLE_RESEARCH_LOGGING=true   (새로 추가)
```

### 0-2. 기존 코드 영향 확인
```bash
grep -rn "mission_submissions_v4\|submitMissionV4\|meta.ksa" src/
```
이 결과를 기반으로 기존 로직을 건드리지 않는지 확인. **E영역 12개는 이미 운영 중이므로 회귀 주의.**

### 0-3. 커밋 전략
- 각 마일스톤 완료 시 단일 커밋
- 커밋 메시지: `[research] M{번호}: {제목}`
- 예: `[research] M2: Add 5 research tables for process logging and AI interactions`

---

## 1. 전체 마일스톤 요약

| 마일스톤 | 제목 | 예상 범위 | 비고 |
|---|---|---|---|
| M1 | KSA 학년별 분리 | 파일 8개 수정 | 별도 `KSA_MIGRATION_INSTRUCTION.md` 참조 |
| M2 | 연구용 테이블 5개 추가 | 마이그레이션 1개 | process log, AI interactions 등 |
| M3 | 설문용 테이블 3개 추가 | 마이그레이션 1개 | item bank, pre-post, post-mission |
| M4 | 문항 데이터 JSON 작성 및 seed | 파일 3개 | 사전-사후 + 미션 후 |
| M5 | `eventLogger` 서비스 | 신규 파일 1개 | 과정 로그 |
| M6 | `aiLogger` 래퍼 | 기존 서비스 2개 확장 | AI 호출 로깅 |
| M7 | `MissionRunner` 훅 주입 | 기존 파일 수정 | 최소 침습 |
| M8 | 미션 후 자기평가 UI | 신규 파일 1~2개 | submit 직전 |
| M9 | 사전-사후 설문 페이지 | 신규 페이지 2개 | 별도 라우트 |
| M10 | 교사 평정 대시보드 | 신규 페이지 1개 | 교사 전용 |
| M11 | 데이터 품질 점검 스크립트 | 신규 스크립트 1개 | 주기 실행용 |
| M12 | 통합 검증 | 스크립트 실행 | 전체 통합 테스트 |

**권장 진행 속도**: 1~2개 마일스톤/세션. 한 번에 모두 하지 말 것.

---

## 2. 마일스톤 M1 — KSA 학년별 분리

### 2-1. 지시
별도 문서 `docs/instructions/KSA_MIGRATION_INSTRUCTION.md`를 참조하여 작업.

### 2-2. 완료 기준
- `node scripts/verify_ksa_migration.cjs` 실행 시 24/24 통과
- 기존 E영역 미션 L/M/H가 정상 동작 (회귀 없음)

---

## 3. 마일스톤 M2 — 연구용 테이블 5개

### 3-1. 작업 파일
```
supabase/migrations/{YYYYMMDD}_research_tables.sql
```

### 3-2. 테이블 목록 (`research_data_design.md` 2장 참조)
1. `mission_events` — 과정 로그 (가장 중요)
2. `ai_interactions` — AI 대화 원문 (C영역 핵심)
3. `student_reflections` — (M3와 중복 가능 검토 — 아래 3-3 참조)
4. `teacher_ratings` — 교사 평정
5. `student_contexts` — 맥락 변인

### 3-3. ⚠️ 중요: `student_reflections`와 `post_mission_evaluations` 관계
두 테이블은 목적이 유사하지만 설계가 다름:
- `student_reflections` (research_data_design.md 제안): 단순 리커트 필드만
- `post_mission_evaluations` (survey_schema.md 제안): 구인별 응답 구조화

**결정**: `post_mission_evaluations`로 **통합**한다. `student_reflections`는 만들지 않는다. 이유는 KSA 구인별 분석이 박사 논문 핵심이므로 구조화된 테이블 하나만 두는 것이 관리 쉽다.

### 3-4. 실행
```bash
supabase db push
# 또는 로컬: psql -f supabase/migrations/{...}.sql
```

### 3-5. 완료 기준
- Supabase Studio에서 4개 테이블(reflections 제외) 생성 확인
- RLS 정책 적용 확인
- 기존 `mission_submissions_v4` 외래키 관계 확인 (`teacher_ratings`의 `submission_id`)

---

## 4. 마일스톤 M3 — 설문용 테이블 3개

### 4-1. 작업 파일
```
supabase/migrations/{YYYYMMDD}_survey_tables.sql
```

### 4-2. 테이블 목록 (`survey_schema.md` 참조)
1. `ksa_item_bank` — 문항 풀
2. `pre_post_surveys` — 사전-사후 응답
3. `post_mission_evaluations` — 미션 후 자기평가

### 4-3. 완료 기준
- Supabase Studio에서 3개 테이블 생성 확인
- 익명화 view `research_pre_post_anonymized` 확인

---

## 5. 마일스톤 M4 — 문항 데이터 작성 및 seed

### 5-1. 작업 파일
```
src/data/surveys/
  ├── pre_post_items.json       (사전-사후 48문항, 학년군별 3배 = 144 row)
  ├── post_mission_items.json   (미션 후 89문항)
  └── seed.cjs                  (Supabase upsert 스크립트)
```

### 5-2. 문항 JSON 구조 예시

`pre_post_items.json`:
```json
{
  "items": [
    {
      "survey_type": "pre_post",
      "ksa_code": "K1.4",
      "ksa_category": "K",
      "grade_band": "L",
      "item_text": "추천 영상을 고르는 AI와 길을 안내하는 AI는?",
      "scale_type": "multiple_choice_3",
      "choice_options": [
        {"id": "a", "text": "하는 일이 다르다"},
        {"id": "b", "text": "같은 AI이다"},
        {"id": "c", "text": "둘 다 움직이지 않는다"}
      ],
      "correct_answer_id": "a",
      "display_order": 1
    }
  ]
}
```

### 5-3. 데이터 소스
- 사전-사후 문항: `docs/research/pre_post_survey_master.md` 2장~5장
- 미션 후 문항: `docs/research/post_mission_self_eval_master.md` 2장~4장

### 5-4. seed 스크립트 (참고용)
```js
// src/data/surveys/seed.cjs
const { createClient } = require('@supabase/supabase-js');
const prePostItems = require('./pre_post_items.json');
const postMissionItems = require('./post_mission_items.json');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  const all = [...prePostItems.items, ...postMissionItems.items];
  const { error } = await supabase
    .from('ksa_item_bank')
    .upsert(all, { onConflict: 'survey_type,ksa_code,grade_band' });
  if (error) throw error;
  console.log(`Seeded ${all.length} items`);
}

seed().catch(console.error);
```

### 5-5. 완료 기준
- `node src/data/surveys/seed.cjs` 실행 성공
- Supabase에서 `SELECT COUNT(*) FROM ksa_item_bank` 실행 시 예상 row 수 일치:
  - 사전-사후: 48문항 × 3학년군 ≈ 144 row (학년군별 문구 다름)
  - 미션 후: 약 89 row (문항 풀)

---

## 6. 마일스톤 M5 — `eventLogger` 서비스

### 6-1. 작업 파일
```
src/services/eventLogger.js
```

### 6-2. 핵심 인터페이스
```js
export function initSession(userId, missionCode, gradeBand);
export function logEvent(eventType, payload);
export function endSession();
export function flushQueue();
```

### 6-3. 설계 포인트 (`research_data_design.md` 3-1 참조)
- 로컬 큐에 쌓다가 5초마다 또는 50개 모이면 배치 전송
- 네트워크 실패 시 localStorage 백업 → 다음 세션에서 재시도
- `VITE_ENABLE_RESEARCH_LOGGING=false`이면 no-op (연구 미승인 학급 보호)
- 이벤트 타입: `research_data_design.md`의 17종 참조

### 6-4. 완료 기준
- 브라우저 콘솔에서 `window.__eventLogger.logEvent('test', {})` 호출 시 Supabase에 이벤트 저장 확인
- `VITE_ENABLE_RESEARCH_LOGGING=false`로 설정 후 아무것도 저장되지 않는지 확인

---

## 7. 마일스톤 M6 — AI 호출 로깅 래퍼

### 7-1. 작업 파일
```
src/services/aiLogger.js          (신규)
src/services/imagenService.js     (수정 — 래핑)
src/services/geminiTextService.js (신규 또는 수정 — C영역용)
```

### 7-2. 작업 순서
1. `aiLogger.js`에 `ai_interactions` 테이블에 insert하는 단일 함수 작성
2. `imagenService.js`의 `generateImage` 호출 전후로 로깅 훅 삽입
3. `geminiTextService.js` 신규 작성 (아직 없으면) — Gemini 2.5 Flash Lite 호출 + 로깅 래핑

### 7-3. 로깅 데이터 구조
```js
{
  user_id,
  session_id,
  mission_code,
  step_id,
  attempt,
  provider: "gemini-text" | "gemini-image",
  model_name: "gemini-2.5-flash-lite" | "imagen-3.0",
  system_prompt,
  user_prompt,
  ai_response,
  response_type: "text" | "options_list" | "image_url",
  response_metadata: { latency_ms, token_count },
  fallback_used: boolean,
  student_action: null       // 나중에 업데이트됨 (M8에서)
}
```

### 7-4. 완료 기준
- C-2-L 미션 실행 후 `SELECT * FROM ai_interactions` 실행 시 호출 기록 확인
- `fallback_used`가 정상 케이스에선 false, 의도적 실패 시 true

---

## 8. 마일스톤 M7 — MissionRunner 이벤트 훅 주입

### 8-1. 작업 파일
```
src/components/Mission/v4/MissionRunner.jsx    (수정 — 최소 침습)
```

### 8-2. 주입 지점
- `stage` 변경 `useEffect` 안 → `stage_enter` 이벤트
- `stepIndex` 변경 → `step_enter`, 이전 step은 `step_exit`
- `handleHintUsed` 안 → `hint_open`
- `setAnswers` 래퍼 → `option_click`, `option_change`
- 제출 시 → `mission_submit`

### 8-3. 주의: 기존 로직 훼손 금지
모든 이벤트 로깅은 **try-catch로 감싸고 실패 시 조용히 무시**. UX 흐름 절대 방해 금지.

```js
try {
  eventLogger.logEvent('step_enter', { step_id: stepId });
} catch (e) {
  // 연구용 로깅 실패는 UX에 영향 없음
}
```

### 8-4. 완료 기준
- E-1-L 플레이 후 `mission_events` 테이블에 최소 10개 이상 이벤트 저장 확인
- 기존 미션 동작 회귀 없음

---

## 9. 마일스톤 M8 — 미션 후 자기평가 UI

### 9-1. 작업 파일
```
src/components/Mission/v4/PostMissionSelfEval.jsx   (신규)
src/components/Mission/v4/MissionRunner.jsx         (수정 — submit 직전 삽입)
```

### 9-2. UI 흐름
1. 미션 수행 완료 → 기존 submit 화면 **직전**에 자기평가 화면 표시
2. 해당 미션의 `grade.ksa`를 읽어 `ksa_item_bank`에서 문항 조회
3. 학년군별 척도(L: 이모지, M·H: 5점 리커트)로 표시
4. 일반 평가(난이도·AI 유용성) 2문항 추가
5. 응답 제출 → `post_mission_evaluations`에 저장 후 기존 submit 화면으로

### 9-3. 컴포넌트 인터페이스
```jsx
<PostMissionSelfEval
  missionCode="E-2"
  gradeBand="H"
  ksa={{ K: ["K4.3", "K3.3"], S: ["Critical Thinking"], A: ["Responsible"] }}
  submissionId={123}
  onComplete={(responses) => { /* 저장 후 submit 진행 */ }}
/>
```

### 9-4. 문항 로딩 쿼리
```js
const { data: items } = await supabase
  .from('ksa_item_bank')
  .select('*')
  .eq('survey_type', 'post_mission')
  .eq('grade_band', gradeBand)
  .in('ksa_code', [...ksa.K, ...ksa.S.map(s => `S.${slug(s)}`), ...ksa.A.map(a => `A.${a.toLowerCase()}`)]);
```

### 9-5. 완료 기준
- E-2-H 완료 후 자기평가 5문항(K4.3 + K3.3 + Critical Thinking + Responsible + 일반 2) 표시 확인
- 응답 후 `post_mission_evaluations`에 저장 확인
- 기존 submit 정상 진행

---

## 10. 마일스톤 M9 — 사전-사후 설문 페이지

### 10-1. 작업 파일
```
src/pages/SurveyPrePost.jsx               (신규)
src/components/Survey/SurveyRunner.jsx    (신규 — 공용 엔진)
src/components/Survey/SurveyItem.jsx      (신규 — 문항 렌더러)
```

### 10-2. 라우트 추가
```
/survey/pre   → SurveyPrePost (phase=pre)
/survey/post  → SurveyPrePost (phase=post)
```

### 10-3. UI 흐름
1. 페이지 진입 시 로그인 확인 및 `grade_band` 확인 (students 테이블)
2. 이미 제출했는지 확인 (`pre_post_surveys` where user_id AND phase)
3. 제출 이력 있으면 "이미 완료됨" 화면
4. 없으면 문항 목록 로드 (약 48개)
5. 페이지당 5~10문항씩 진행 (응답 피로 완화)
6. 마지막 페이지에서 제출 → `pre_post_surveys`에 저장

### 10-4. 문항 로딩
```js
const { data: items } = await supabase
  .from('ksa_item_bank')
  .select('*')
  .eq('survey_type', 'pre_post')
  .eq('grade_band', gradeBand)
  .eq('is_active', true)
  .order('display_order');
```

### 10-5. 완료 기준
- 학년군별로 48문항 표시 확인
- 제출 후 `pre_post_surveys`에 저장
- 재방문 시 "이미 완료" 화면 표시
- K 자동 채점(정답 여부)이 `k_score_by_construct` 필드에 저장

### 10-6. 서비스 제공 시점 관리
사전 설문은 교사가 학기 초에 학생에게 링크 배포, 사후 설문은 학기 말에 배포. 메뉴에서는 기본적으로 숨기고, 교사 대시보드에서 "설문 활성화" 버튼으로 특정 기간에만 노출.

---

## 11. 마일스톤 M10 — 교사 평정 대시보드

### 11-1. 작업 파일
```
src/pages/TeacherDashboard.jsx                  (신규)
src/components/Teacher/SubmissionList.jsx       (신규)
src/components/Teacher/RubricRatingForm.jsx     (신규)
```

### 11-2. 기능
- 교사 로그인 (`students` 테이블과 분리된 `teachers` 테이블 필요 — M3에 추가 고려)
- 본인 학급 학생 제출 목록 조회
- 각 제출을 클릭하면 산출물 표시 + 루브릭 5축 평정 UI
- 평정 완료 시 `teacher_ratings` 테이블에 저장

### 11-3. 선행 작업
`teachers` 테이블이 없으므로 **M10 시작 전 M3에 추가**하거나 별도 마이그레이션:
```sql
CREATE TABLE public.teachers (
  id text PRIMARY KEY,
  password text NOT NULL,
  name text,
  school_id text DEFAULT 'gyeongdong',
  class_ids text[]                    -- 담당 학급 id 배열
);
```

### 11-4. 완료 기준
- 교사 로그인 → 학생 제출 목록 조회 → 1건 평정 → `teacher_ratings` 저장 확인

---

## 12. 마일스톤 M11 — 데이터 품질 점검 스크립트

### 12-1. 작업 파일
```
scripts/research_data_qa.cjs
```

### 12-2. 점검 항목
```
1. 이벤트 누락 검증
   - 각 mission_submissions_v4 건에 대응하는 mission_events가 최소 5개 이상 있는가
2. 세션 ID 무결성
   - 같은 session_id 안에서 timestamp가 단조 증가하는가
3. AI 호출 완전성
   - C영역 submission 건에 대응하는 ai_interactions가 존재하는가
4. 자기평가 완전성
   - mission_submissions_v4 건에 대응하는 post_mission_evaluations가 존재하는가
5. 사전-사후 쌍
   - 사전 설문 제출자 중 사후 미제출자 비율
6. AI 호출 실패율
   - fallback_used=true 비율 (5% 이상이면 경고)
```

### 12-3. 실행 방법
```bash
node scripts/research_data_qa.cjs > reports/qa_$(date +%Y%m%d).txt
```

### 12-4. 완료 기준
- 스크립트 실행 시 위 6개 항목의 요약 리포트 출력
- 경고 조건 트리거 시 exit code 1

---

## 13. 마일스톤 M12 — 통합 검증

### 13-1. 시나리오 기반 통합 테스트
다음을 수동으로 실행하며 각 단계에서 데이터가 정상 저장되는지 확인:

1. 학생 계정으로 로그인
2. `/survey/pre` 접속 → 사전 설문 48문항 응답 → 제출
   - `pre_post_surveys` 테이블에 1건 확인
3. 메인 페이지에서 E-1-L 미션 플레이
   - `mission_events`에 이벤트 기록 확인
   - 완료 후 자기평가 3문항 응답
   - `post_mission_evaluations`에 1건 확인
   - `mission_submissions_v4`에도 1건 확인
4. C-2-L 미션 플레이 (이미지 생성 포함)
   - `ai_interactions`에 이미지 생성 로그 확인
5. 교사 계정으로 로그인 → 학생 제출 평정
   - `teacher_ratings`에 1건 확인
6. `/survey/post` 접속 → 사후 설문 응답
   - `pre_post_surveys`에 사후 건 추가 확인
7. QA 스크립트 실행 → 경고 없음 확인

### 13-2. 완료 기준
- 7단계 모두 통과
- QA 리포트 clean

---

## 14. 진행 순서 및 브랜치 전략

### 14-1. 권장 브랜치
```
main
 └── research/m1-ksa-migration
 └── research/m2-research-tables
 └── research/m3-survey-tables
 └── research/m4-seed-items
 └── research/m5-event-logger
 └── research/m6-ai-logger
 └── research/m7-runner-hooks
 └── research/m8-self-eval-ui
 └── research/m9-pre-post-pages
 └── research/m10-teacher-dashboard
 └── research/m11-qa-script
 └── research/m12-integration
```

각 마일스톤 완료 시 PR → main 머지. 순서 준수.

### 14-2. 종속성
- M2는 M1과 독립 (병렬 가능)
- M3은 M2 이후 (같은 DB)
- M4는 M3 이후
- M5, M6은 M2 이후 (병렬 가능)
- M7은 M5 이후
- M8은 M3, M4, M1 이후
- M9는 M3, M4 이후
- M10은 M3 이후 (teachers 테이블 추가 필요)
- M11은 M2~M10 이후
- M12는 모두 이후

---

## 15. 위험 관리

| 위험 | 대응 |
|---|---|
| 기존 E영역 12개 미션 회귀 | 각 마일스톤 후 E-1-L/M/H 플레이 테스트 필수 |
| `mission_events` 용량 폭발 | 90일 이후 콜드 스토리지 이전 스크립트 사전 준비 |
| AI 대화 원문에 개인정보 포함 | M6 구현 시 정규식 필터 (전화번호·이름 패턴) 추가 고려 |
| IRB 승인 전 데이터 수집 | M7~M10 구현 완료해도 `VITE_ENABLE_RESEARCH_LOGGING=false`로 배포 유지 |
| Supabase Free tier 용량 초과 | M2 시작 전 Pro 전환 여부 결정 |

---

## 16. IRB 대응 체크리스트

기술 구현과 병행해 진행:

- [ ] 교육대학교 IRB 기관 확인
- [ ] 신청서 초안 작성 (`research_data_design.md` 4장 기반)
- [ ] 학부모·학생 동의서 문안 2종 작성
- [ ] 익명화 정책 문서 작성
- [ ] 연구자 외 접근 권한 분리 설계 검증
- [ ] 승인 완료 전까지 `VITE_ENABLE_RESEARCH_LOGGING=false` 유지

---

## 17. 요약 — Claude Code가 기억할 핵심

1. **한 번에 한 마일스톤만**: 12개를 한 세션에 다 하지 말 것. 1~2개 단위.
2. **기존 E영역 동작 보존**: 모든 수정은 try-catch와 fallback으로 보호.
3. **환경 변수 gate**: 연구 로깅은 기본 off, 명시적으로 on.
4. **문서 참조 우선**: 본 문서 외 `research_data_design.md`, `survey_schema.md`, 각 문항 마스터를 먼저 읽고 작업.
5. **검증 없이 진행 금지**: 각 마일스톤 완료 기준 달성 전 다음 마일스톤 금지.
6. **커밋 메시지 규약**: `[research] M{번호}: {영문 제목}`.
