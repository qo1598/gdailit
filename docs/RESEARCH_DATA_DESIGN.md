# LearnAILIT V4 · 연구용 데이터 수집 확장 설계

> **목적**: 현재 플랫폼을 박사 학위 논문 수준의 실증 연구를 뒷받침할 수 있는 데이터 수집 인프라로 확장한다.
> **대상 독자**: 연구자(박사과정생), 공동 연구 교사, Claude Code
> **범위**: Supabase 스키마 확장, 클라이언트 이벤트 로깅, IRB 대응, 분석 가능한 연구 주제 목록

---

## 1. 현재 상태 진단

### 1-1. 지금 수집되는 것
- `mission_submissions_v4.answers` (jsonb): 각 step 최종 응답만
- `mission_submissions_v4.submitted_at`, `started_at`: 전체 소요 시간
- `user_progress`: 미션 완료 여부
- `activity_logs`: 범용 활동 로그 (현재 미션에서 활용 제한적)

### 1-2. 지금 수집되지 않는 것 (박사 논문에 필요한 것)
| 데이터 층 | 현재 상태 | 박사 논문 필수도 |
|---|---|---|
| 과정 로그 (클릭·선택 변경·힌트 열기) | 없음 | ★★★ 필수 |
| AI 대화 원문 (프롬프트·응답·수용 여부) | 없음 | ★★★ 필수 (C영역) |
| 자기평가·확신도 | 없음 | ★★☆ 강력 권장 |
| 교사 평정 | 없음 | ★★☆ 강력 권장 |
| 학생 맥락 변인 (성별·AI 경험·성취 수준) | 부분 (students 테이블) | ★★☆ 권장 |
| 사전-사후 AI 인식 설문 | 없음 | ★★☆ 권장 |

### 1-3. 설계의 핵심 원칙
- **개발 중 심기**: 완성 후 추가하면 플랫폼을 재설계해야 함. 지금이 가장 저렴.
- **raw 우선 저장**: 나중에 파생 변수를 뽑을 수 있게 원본을 최대한 보존.
- **스키마 분리**: 연구 데이터는 서비스 운영과 분리된 테이블로 저장 (장애 영향 격리, IRB 관리 용이).
- **익명화 경로 확보**: `user_id`는 익명 코드 기반이지만, 교실 단위 변인과 연결되도록 매핑 테이블 관리.

---

## 2. Supabase 스키마 확장 (신규 5개 테이블)

### 2-1. `mission_events` — 과정 로그 (1층)
학생의 모든 상호작용을 이벤트 스트림으로 저장.

```sql
CREATE TABLE public.mission_events (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  session_id uuid NOT NULL,                -- 한 번의 미션 수행 세션
  mission_code text NOT NULL,
  grade_band text NOT NULL,
  step_id text,                            -- 해당되는 경우
  stage text NOT NULL,                     -- 'start'|'intro'|'core'|'task'|'submit'|'complete'
  event_type text NOT NULL,
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  client_ts timestamp with time zone NOT NULL,    -- 클라이언트 기록 시각
  server_ts timestamp with time zone DEFAULT now(),
  school_id text DEFAULT 'gyeongdong'::text
);

CREATE INDEX idx_mission_events_session ON public.mission_events (session_id, client_ts);
CREATE INDEX idx_mission_events_user_mission ON public.mission_events (user_id, mission_code);
CREATE INDEX idx_mission_events_type ON public.mission_events (event_type);
```

**event_type 목록** (필수 17종, 확장 가능):

| 카테고리 | event_type | payload 예시 |
|---|---|---|
| 네비게이션 | `stage_enter` | `{from:"intro", to:"task"}` |
|  | `step_enter` | `{step_id:"step2"}` |
|  | `step_exit` | `{step_id:"step2", duration_ms:45000}` |
| 선택 | `option_click` | `{option_id:"robot_vacuum"}` |
|  | `option_change` | `{from:"calculator", to:"robot_vacuum"}` |
|  | `judgment_set` | `{case_id:"scene1", judgment:"ai"}` |
| 입력 | `text_input_start` | `{field:"first_sentence"}` |
|  | `text_input_edit` | `{field:"first_sentence", length:45, backspace_count:3}` |
|  | `text_input_submit` | `{field:"first_sentence", final_length:67}` |
| 힌트 | `hint_open` | `{step_id:"step3"}` |
|  | `hint_close` | `{step_id:"step3", duration_ms:8200}` |
| AI 호출 (C영역) | `prompt_submit` | `{step_id:"step4", prompt_text:"...", attempt:1}` |
|  | `ai_response_received` | `{step_id:"step4", response_id, latency_ms, fallback_used}` |
|  | `regenerate_click` | `{step_id:"step4", previous_response_id}` |
|  | `option_accept` | `{step_id:"step4", chosen_option_index:1}` |
|  | `custom_input_choose` | `{step_id:"step4"}` |
| 제출 | `validation_fail` | `{step_id:"step3", reason:"minLength"}` |
|  | `mission_submit` | `{session_duration_ms:540000}` |

**설계 근거**
- `session_id`로 같은 학생의 재도전을 구분 (한 미션 여러 번 풀 수 있음)
- `client_ts`로 타이핑 속도 등 세밀한 분석 가능, `server_ts`로 시간 왜곡 보정
- `event_payload`는 jsonb라 나중에 필드 추가 자유로움

### 2-2. `ai_interactions` — AI 대화 원문 (2층)
C영역에서 가장 가치 있는 데이터. 별도 테이블로 분리하는 이유는 (1) 용량이 크고 (2) 연구 윤리상 접근 권한을 달리 관리해야 해서.

```sql
CREATE TABLE public.ai_interactions (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  session_id uuid NOT NULL,
  mission_code text NOT NULL,
  step_id text NOT NULL,
  attempt integer NOT NULL DEFAULT 1,      -- 같은 step에서 몇 번째 호출인지
  provider text NOT NULL,                  -- 'gemini-text'|'gemini-image'
  model_name text NOT NULL,                -- 'gemini-2.5-flash-lite' 등
  system_prompt text,
  user_prompt text NOT NULL,
  ai_response text,                        -- 텍스트 응답 또는 이미지 URL
  response_type text NOT NULL,             -- 'text'|'options_list'|'image_url'
  response_metadata jsonb DEFAULT '{}'::jsonb,   -- latency_ms, token_count 등
  fallback_used boolean NOT NULL DEFAULT false,
  student_action text,                     -- 'accepted'|'modified'|'rejected'|'regenerated'|null
  student_action_payload jsonb,            -- 수정 시 diff, 선택 시 index 등
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_ai_interactions_user ON public.ai_interactions (user_id, mission_code);
CREATE INDEX idx_ai_interactions_session ON public.ai_interactions (session_id);
```

**연구 분석 예**
- 학년군별 프롬프트 길이·구체성 발달 궤적
- `student_action` 분포로 AI 수용·수정·기각 패턴 유형화
- `regenerated` 횟수와 최종 산출물 품질의 관계

### 2-3. `student_reflections` — 자기평가·확신도 (3층)
각 미션 완료 후 짧은 자기평가. 미션 설계에서 submit 직전에 추가.

```sql
CREATE TABLE public.student_reflections (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  session_id uuid NOT NULL,
  mission_code text NOT NULL,
  grade_band text NOT NULL,
  difficulty_rating integer,               -- 1-5: 어려움
  ai_helpfulness_rating integer,           -- 1-5: AI 도움 유용성
  confidence_rating integer,               -- 1-5: 내 답에 대한 확신
  self_contribution_rating integer,        -- 1-5: 내 생각이 반영된 정도 (C영역)
  free_comment text,
  submitted_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_reflections_user_mission ON public.student_reflections (user_id, mission_code);
```

**저학년 UI 배려**
- L 학년군은 별점 3단계 또는 이모지(😀😐😟)로 축소 표시
- `free_comment`는 저학년 선택 사항

### 2-4. `teacher_ratings` — 교사 평정 (4층)
협력 교사가 학생 산출물을 루브릭 5축으로 채점. 박사 논문의 타당도 검증 핵심 데이터.

```sql
CREATE TABLE public.teacher_ratings (
  id bigserial PRIMARY KEY,
  submission_id bigint REFERENCES public.mission_submissions_v4(id) ON DELETE CASCADE,
  rater_id text NOT NULL,                  -- 교사 식별자 (익명 코드)
  rater_school text,
  rubric_scores jsonb NOT NULL,            -- {intent:4, ai_use:3, revision:5, ...}
  qualitative_comment text,
  rating_duration_sec integer,             -- 채점에 걸린 시간
  rated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_teacher_ratings_submission ON public.teacher_ratings (submission_id);
CREATE INDEX idx_teacher_ratings_rater ON public.teacher_ratings (rater_id);
```

**연구 분석 예**
- rater 간 일치도 (Cohen's kappa, ICC)
- 시스템 자동 채점과 교사 채점의 일치도
- 영역(E/C/M/D)별 자동 채점 가능성 차이

### 2-5. `student_contexts` — 맥락 변인 (5층)
학기 초 1회 수집. 매 미션마다 join하여 다변량 분석 가능.

```sql
CREATE TABLE public.student_contexts (
  user_id text PRIMARY KEY REFERENCES public.students(id),
  gender text,
  grade integer NOT NULL,
  class_id text NOT NULL,                  -- 학급 군집 분석용
  ai_usage_frequency integer,              -- 1(없음)-5(매일)
  ai_tools_used text[],                    -- ['chatgpt','gemini','clova']
  digital_access_level integer,            -- 1(제한)-3(자유)
  pre_ailit_survey jsonb,                  -- 사전 AI 인식 설문 원응답
  post_ailit_survey jsonb,                 -- 사후 AI 인식 설문 원응답 (학기말)
  collected_at timestamp with time zone DEFAULT now()
);
```

---

## 3. 클라이언트 이벤트 로깅 구현

### 3-1. 로깅 서비스 신규 파일
**파일**: `src/services/eventLogger.js`

```js
// 주요 인터페이스
export function initSession(userId, missionCode, gradeBand);
export function logEvent(eventType, payload);
export function endSession();
export function flushQueue();   // 배치 전송
```

**설계 원칙**
- 이벤트는 로컬 큐에 쌓고 5초마다 또는 50개 모이면 배치 전송
- 실패 시 localStorage 백업 → 다음 세션에서 재전송
- `VITE_ENABLE_RESEARCH_LOGGING` 환경변수로 on/off (연구 승인 학급에서만 활성화)

### 3-2. MissionRunner 훅 추가
기존 `MissionRunner.jsx`는 건드리지 않고 **최소 침습**으로 추가:

- `stage` 변경 시 `stage_enter`, `step_enter`, `step_exit` 자동 기록
- `handleHintUsed` 안에 `hint_open` 추가
- `setAnswers` 래퍼로 `option_click`, `option_change` 추적

### 3-3. AI 호출 래퍼 업데이트
기존 `imagenService.js` / 신규 `geminiTextService.js` 호출을 `ai_interactions` 테이블에 기록하도록 래핑. 실패 시에도 `fallback_used: true`로 반드시 기록.

---

## 4. IRB 대응 사전 고려 사항

### 4-1. 동의서에 명시해야 할 조항
- **수집 데이터 종류**: 응답·선택 변경·타이핑 과정·AI 대화·자기평가·교사 평정
- **수집 목적**: 평가도구 개발 및 타당화 연구, AI 협업 패턴 분석, 학위 논문
- **저장 기간**: 연구 종료 후 5년 보관 후 파기
- **익명화**: `user_id`는 학번이 아닌 난수 기반 코드, 원본 매핑 테이블은 분리 보관
- **철회 가능성**: 학생·보호자가 언제든 데이터 삭제 요청 가능

### 4-2. 민감 영역 주의 사항
- **AI 대화 원문**에 학생 개인정보(이름·주소)가 들어갈 가능성 → 수집 전 필터링 또는 저장 후 익명화 스크립트 실행
- **free_text 응답**에 학생이 민감한 정보를 쓸 가능성 → 분석 전 검토 절차
- **교사 평정**의 교사 식별 → 평정자는 코드로만 관리, 실명 매핑은 연구자만 접근

### 4-3. 데이터 접근 권한 분리
- Supabase Row Level Security(RLS) 활성화
- 운영자(학생 로그인): 본인 데이터만 읽기/쓰기
- 교사: 본인 학급 산출물 읽기 + `teacher_ratings` 쓰기
- 연구자: 익명화된 view에만 접근 (raw 테이블 직접 접근 금지)

---

## 5. 박사 논문 연구 주제 지도

이 데이터를 확보하면 가능해지는 논문 주제들. 박사 논문은 이 중 3개를 묶는 구조가 현실적.

### 5-1. 단독 연구 1: 평가도구 개발 및 타당화
- **데이터**: `mission_submissions_v4`, `student_reflections`, `teacher_ratings`, `student_contexts`
- **방법**: Rasch 분석, 확인적 요인 분석, 내용 타당도(CVI), 준거 타당도
- **산출 저널**: 『교육평가연구』, Educational and Psychological Measurement
- **기여**: 초등용 AI 리터러시 수행평가 도구의 심리측정학적 속성 최초 보고

### 5-2. 단독 연구 2: 학습자 AI 상호작용 패턴 유형화
- **데이터**: `ai_interactions`, `mission_events`, `student_contexts`
- **방법**: 군집 분석, 시계열 분석, 잠재 프로파일 분석(LPA)
- **산출 저널**: Computers & Education, British Journal of Educational Technology
- **기여**: 초등학생의 AI 협업 유형 최초 실증, 학년군별 발달 경로 제시

### 5-3. 단독 연구 3: 자동 채점과 교사 평정 일치도
- **데이터**: `mission_submissions_v4`, `teacher_ratings`
- **방법**: Cohen's kappa, ICC, many-facet Rasch
- **산출 저널**: Assessment in Education, Journal of Educational Measurement
- **기여**: 시나리오 기반 평가의 자동 채점 가능성 규명

### 5-4. 단독 연구 4: 과정 데이터 기반 AI 리터러시 행동 지표 도출
- **데이터**: `mission_events` 중심
- **방법**: 과정 마이닝(process mining), 순차 패턴 분석
- **산출 저널**: Journal of Learning Analytics, Computers in Human Behavior
- **기여**: "AI 리터러시"를 행동 수준에서 조작적으로 측정하는 지표 제안

### 5-5. 단독 연구 5: 메타인지와 AI 활용의 관계
- **데이터**: `student_reflections`(확신도) + `ai_interactions`(수용·수정 행동)
- **방법**: 다층 회귀, 매개 분석
- **산출 저널**: Metacognition and Learning
- **기여**: 확신도와 AI 결과 수용의 관계 (과신·과의존 현상)

### 5-6. 박사 논문 추천 구조
연구 1 (평가도구 타당화) + 연구 2 (상호작용 패턴) + 연구 3 (자동 채점 일치도) 조합.

- 1장 서론 · 2장 이론 배경
- 3장 플랫폼 개발 방법론 (DBR)
- 4장 연구 1: 평가도구 타당화
- 5장 연구 2: 상호작용 패턴 유형화
- 6장 연구 3: 자동 채점 일치도
- 7장 종합 논의

---

## 6. 단계별 마일스톤

### 마일스톤 1: 연구 설계 확정 (2~4주)
- [ ] 지도교수와 박사 논문 방향 명시적 공유
- [ ] IRB 신청서 초안 작성 (본 문서 4장 기반)
- [ ] 연구 동의서 학부모·학생용 문안 작성
- [ ] 공동 연구 교사와 역할·보상 협의

### 마일스톤 2: 데이터 인프라 구축 (2주)
- [ ] Supabase에 5개 신규 테이블 생성 (2장)
- [ ] RLS 정책 수립
- [ ] `src/services/eventLogger.js` 구현
- [ ] `VITE_ENABLE_RESEARCH_LOGGING` 환경변수 추가
- [ ] MissionRunner에 이벤트 훅 삽입 (최소 침습)

### 마일스톤 3: AI 대화 로깅 (1주, C영역 개발과 병행)
- [ ] `geminiTextService.js`와 `imagenService.js`에 로깅 래퍼 추가
- [ ] `student_action` 기록 지점 심기 (수용·수정·기각·재생성 버튼)

### 마일스톤 4: 자기평가·교사 평정 UI (2주)
- [ ] 미션 submit 직전 자기평가 UI 추가 (저학년 이모지, 고학년 5점 척도)
- [ ] 교사용 평정 대시보드 신규 페이지 (기존 라우트와 분리)
- [ ] 교사 계정 인증 체계

### 마일스톤 5: 파일럿 운영 (4주)
- [ ] 협력 교사 중 1개 학급에서 먼저 운영
- [ ] 데이터 수집 정상성 검증 (이벤트 누락, 타임스탬프 왜곡)
- [ ] 익명화 스크립트 검증

### 마일스톤 6: 본 조사 운영 및 데이터 수집 (한 학기)
- [ ] 협력 학교 전체로 확대
- [ ] 월 1회 데이터 품질 점검
- [ ] 학기말 사후 설문 배포

### 마일스톤 7: 분석 및 논문화 (박사 과정 후반부)
- [ ] 연구 1부터 순차적으로 학술대회 발표
- [ ] 저널 투고
- [ ] 박사 논문으로 종합

---

## 7. 기술적 주의 사항

### 7-1. 용량과 비용
- `mission_events`는 학생 1인·미션 1회에 평균 80~200개 이벤트 예상
- 학생 300명 × 12미션 × 평균 120 이벤트 = 약 43만 행 → Supabase Free tier로도 가능하나 Pro 권장
- `ai_interactions`의 raw 프롬프트·응답 때문에 용량 예상의 대부분 차지 → 90일 이후 콜드 스토리지 이전 스크립트 준비

### 7-2. 성능 영향
- 이벤트 로깅이 미션 수행 UX를 방해하면 안 됨
- `eventLogger`는 반드시 비동기·배치 전송, 실패해도 UI 흐름은 진행
- 네트워크 끊김 시 localStorage 백업

### 7-3. 데이터 품질 점검 스크립트
`scripts/research_data_qa.cjs` 파일로 주기적 점검:
- 이벤트 누락 비율 (expected vs actual)
- `session_id` 중복 여부
- 타임스탬프 역순 기록
- AI 응답 `fallback_used` 비율

---

## 8. 문서 위치 및 관리

이 문서는 다음 위치에 둔다:

```
docs/research/data_collection_design.md
```

관련 하위 문서:
```
docs/research/irb_application_draft.md       (마일스톤 1에서 작성)
docs/research/consent_form_templates.md      (학부모·학생 동의서)
docs/research/anonymization_policy.md        (익명화 정책)
docs/research/analysis_plan_study1.md        (연구 1 분석 계획)
docs/research/analysis_plan_study2.md        (연구 2)
docs/research/analysis_plan_study3.md        (연구 3)
```

---

## 9. 체크리스트 (지금 바로 확인)

- [ ] 지도교수와 박사 논문 방향 합의되었는가
- [ ] 공동 연구 교사 수와 학급 수 확정되었는가 (N 산출 기준)
- [ ] `.env`에 `VITE_ENABLE_RESEARCH_LOGGING` 추가 가능한가
- [ ] Supabase 플랜이 Pro 이상인가 (용량 대비)
- [ ] IRB 기관이 교육대학교 내에 있는가 (외부 기관 의뢰 필요 여부)
- [ ] 학기 시작 전까지 파일럿 운영할 시간이 있는가

---

## 10. 핵심 메시지

**한 줄로**: 박사 논문을 염두에 둔다면, 지금 이 개발 단계에서 5개 테이블과 이벤트 로깅을 심어야 한다. 나중에 추가하면 플랫폼을 다시 뜯어야 한다.

**가장 아까운 손실**: 지금 개발 중인 C영역의 AI 대화 원문은 한 번 버리면 복구가 불가능하다. `ai_interactions` 테이블과 로깅 래퍼는 C영역 구현 전에 준비해야 한다.

**가장 임팩트 있는 데이터**: `mission_events` (과정 로그)와 `ai_interactions` (AI 대화) 조합. 국제 학계에서 초등학생 대상 이 수준 데이터는 희소해 가치가 크다.
