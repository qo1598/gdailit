# 설문 시스템 Supabase 스키마 (SURVEY_SCHEMA)

> **목적**: 사전-사후 설문과 미션 후 자기평가를 저장·관리하는 DB 스키마
> **원칙**: 문항 마스터는 DB로 관리(ksa_item_bank), 응답은 구조화된 테이블로 저장
> **기존 테이블과의 관계**: `mission_submissions_v4`, `students` 참조

---

## 1. 테이블 설계 개요

| 테이블 | 용도 | 비고 |
|---|---|---|
| `ksa_item_bank` | 문항 풀 (사전-사후 + 미션 후 공통) | 운영 중 수정 가능 |
| `pre_post_surveys` | 사전-사후 설문 응답 저장 | 학생당 사전 1회 + 사후 1회 |
| `post_mission_evaluations` | 미션 후 자기평가 응답 저장 | 미션당 1회씩 다수 |
| (기존 참조) `mission_submissions_v4` | 미션 수행 점수·응답 | 이미 존재 |

---

## 2. `ksa_item_bank` — 문항 마스터 테이블

### 2-1. 스키마

```sql
CREATE TABLE public.ksa_item_bank (
  id bigserial PRIMARY KEY,
  survey_type text NOT NULL,                   -- 'pre_post' | 'post_mission'
  ksa_code text NOT NULL,                      -- 'K1.1', 'S.critical_thinking', 'A.responsible' 등
  ksa_category text NOT NULL,                  -- 'K' | 'S' | 'A'
  grade_band text NOT NULL,                    -- 'L' | 'M' | 'H'
  item_text text NOT NULL,                     -- 실제 문항 텍스트
  scale_type text NOT NULL,                    -- '3point_emoji' | '5point_likert' | 'multiple_choice_4' | 'multiple_choice_3' | 'multi_select'
  is_reverse_coded boolean NOT NULL DEFAULT false,
  -- 선다형 문항용
  choice_options jsonb,                        -- [{id, text, isCorrect}] 구조
  correct_answer_id text,                      -- 정답 선택지 id (선다형만)
  -- 메타 정보
  display_order integer,
  cvi_score numeric,                           -- 전문가 내용 타당도 점수
  is_active boolean NOT NULL DEFAULT true,     -- 비활성화로 이력 보존
  notes text,                                  -- 연구자 메모
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  UNIQUE (survey_type, ksa_code, grade_band, is_active)
    DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_item_bank_survey ON public.ksa_item_bank (survey_type, grade_band);
CREATE INDEX idx_item_bank_ksa ON public.ksa_item_bank (ksa_code);
CREATE INDEX idx_item_bank_active ON public.ksa_item_bank (is_active);
```

### 2-2. ksa_code 명명 규칙

| 카테고리 | 형식 | 예시 |
|---|---|---|
| 지식 K | `K{장}.{절}` | `K1.1`, `K5.4` |
| 기술 S | `S.{snake_case}` | `S.critical_thinking`, `S.self_social_awareness` |
| 태도 A | `A.{snake_case}` | `A.responsible`, `A.empathetic` |
| 맥락 변인 (사전-사후만) | `C.{snake_case}` | `C.gender`, `C.ai_usage_frequency` |

### 2-3. scale_type 종류

| scale_type | 설명 | 응답 값 범위 |
|---|---|---|
| `3point_emoji` | L학년군 리커트 | 1~3 (1=😟, 2=😐, 3=😀) |
| `5point_likert` | M·H학년군 리커트 | 1~5 |
| `multiple_choice_3` | L학년군 3지선다 | 선택지 id |
| `multiple_choice_4` | M·H학년군 4지선다 | 선택지 id |
| `multi_select` | 맥락 변인용 복수 선택 | 선택지 id 배열 |

### 2-4. 예시 INSERT

```sql
-- 미션 후 자기평가: K1.4 / L학년군 / 리커트
INSERT INTO public.ksa_item_bank (
  survey_type, ksa_code, ksa_category, grade_band, item_text, scale_type
) VALUES (
  'post_mission', 'K1.4', 'K', 'L',
  '이 미션으로 AI는 하는 일마다 다르게 움직인다는 걸 알게 되었다.',
  '3point_emoji'
);

-- 사전-사후: K1.4 / M학년군 / 4지선다
INSERT INTO public.ksa_item_bank (
  survey_type, ksa_code, ksa_category, grade_band,
  item_text, scale_type,
  choice_options, correct_answer_id
) VALUES (
  'pre_post', 'K1.4', 'K', 'M',
  '다음 설명 중 옳은 것은?',
  'multiple_choice_4',
  '[
    {"id": "a", "text": "모든 AI는 똑같이 만들어진다"},
    {"id": "b", "text": "AI는 쓰임새에 따라 다르게 설계되고 다르게 작동한다"},
    {"id": "c", "text": "AI는 무엇이든 할 수 있다"},
    {"id": "d", "text": "AI는 영화에만 나온다"}
  ]'::jsonb,
  'b'
);
```

### 2-5. 문항 업데이트 정책

- **수정 금지 원칙**: 활성 문항은 직접 수정하지 않음 (응답 데이터와 불일치 방지)
- **변경 방법**: 기존 문항 `is_active=false` + 새 문항 INSERT
- **이유**: 종단 데이터 분석에서 "이 문항은 시점 t1과 t2에 똑같았는가"를 확인 가능해야 함

---

## 3. `pre_post_surveys` — 사전-사후 응답 저장

### 3-1. 스키마

```sql
CREATE TABLE public.pre_post_surveys (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  school_id text DEFAULT 'gyeongdong'::text,
  survey_phase text NOT NULL,                  -- 'pre' | 'post'
  grade_band text NOT NULL,                    -- 'L' | 'M' | 'H'
  
  -- 응답 원본
  item_responses jsonb NOT NULL,               -- {item_id: response_value} 형태
  -- 예: {"K1.4": "b", "S.critical_thinking_1": 4, "A.responsible_1": 5}
  
  -- 파생 점수 (응답 후 자동 계산)
  k_score_by_construct jsonb,                  -- {"K1.1": 1, "K1.2": 0, ...} (정답 여부 0/1)
  s_score_by_construct jsonb,                  -- {"S.critical_thinking": 4.5, ...} (평균)
  a_score_by_construct jsonb,                  -- {"A.responsible": 4.0, ...}
  
  -- 맥락 변인 별도 저장
  context_variables jsonb,                     -- {"gender": "F", "ai_usage": 4, ...}
  
  -- 메타
  started_at timestamp with time zone,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  completion_duration_sec integer,
  
  -- 사후 설문 추가 문항 (자유 서술 등)
  post_extra_responses jsonb,                  -- 사후에만 사용
  
  UNIQUE (user_id, survey_phase)
);

CREATE INDEX idx_pre_post_user ON public.pre_post_surveys (user_id, survey_phase);
CREATE INDEX idx_pre_post_school ON public.pre_post_surveys (school_id, survey_phase);
```

### 3-2. item_responses JSON 구조

```json
{
  "K1.1": "b",                        // 선다형: 선택지 id
  "K1.2": "b",
  "S.critical_thinking_1": 4,         // 리커트: 1-5 정수
  "S.critical_thinking_2": 3,
  "A.responsible_1": 5,
  "A.responsible_2": 2,               // 역코딩 문항은 그대로 저장, 분석 시 6-x로 반전
  "C.gender": "F",
  "C.ai_usage_frequency": 4,
  "C.ai_tools_used": ["chatgpt", "ai_speaker"]
}
```

---

## 4. `post_mission_evaluations` — 미션 후 자기평가 응답

### 4-1. 스키마

```sql
CREATE TABLE public.post_mission_evaluations (
  id bigserial PRIMARY KEY,
  submission_id bigint REFERENCES public.mission_submissions_v4(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  mission_code text NOT NULL,                  -- 'E-1', 'C-2' 등
  grade_band text NOT NULL,                    -- 'L' | 'M' | 'H'
  
  -- 구인별 응답 (이 미션의 ksa에 매핑된 구인만)
  k_responses jsonb,                           -- {"K1.4": 3}
  s_responses jsonb,                           -- {"S.critical_thinking": 4}
  a_responses jsonb,                           -- {"A.curious": 5}
  
  -- 일반 평가 (모든 미션 공통)
  difficulty_rating integer,                   -- 1-5 or 1-3 by grade
  ai_helpfulness_rating integer,
  
  -- 자유 서술 (선택)
  free_comment text,
  
  -- 메타
  submitted_at timestamp with time zone DEFAULT now(),
  duration_sec integer,

  UNIQUE (submission_id)                       -- 한 submission당 자기평가 1회
);

CREATE INDEX idx_post_mission_eval_user ON public.post_mission_evaluations (user_id);
CREATE INDEX idx_post_mission_eval_mission ON public.post_mission_evaluations (mission_code, grade_band);
```

### 4-2. 구인별 응답 구조

미션별로 측정되는 구인이 다르므로 `k_responses`, `s_responses`, `a_responses`에는 해당 미션의 KSA에 있는 구인만 키로 들어감.

예시: E-2-H 미션 (K=["K4.3","K3.3"], S=["Critical Thinking"], A=["Responsible"])
```json
{
  "k_responses": { "K4.3": 4, "K3.3": 5 },
  "s_responses": { "S.critical_thinking": 4 },
  "a_responses": { "A.responsible": 5 },
  "difficulty_rating": 3,
  "ai_helpfulness_rating": 4
}
```

---

## 5. RLS (Row Level Security) 정책

### 5-1. 학생 본인 데이터 접근만 허용

```sql
-- ksa_item_bank: 모든 인증 사용자 읽기 가능 (문항 표시용)
ALTER TABLE public.ksa_item_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "item_bank_read_all"
  ON public.ksa_item_bank FOR SELECT
  USING (is_active = true);

-- pre_post_surveys: 본인만 읽기·쓰기
ALTER TABLE public.pre_post_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pre_post_own_read"
  ON public.pre_post_surveys FOR SELECT
  USING (user_id = auth.uid()::text);
CREATE POLICY "pre_post_own_insert"
  ON public.pre_post_surveys FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- post_mission_evaluations: 본인만
ALTER TABLE public.post_mission_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_mission_own_read"
  ON public.post_mission_evaluations FOR SELECT
  USING (user_id = auth.uid()::text);
CREATE POLICY "post_mission_own_insert"
  ON public.post_mission_evaluations FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);
```

### 5-2. 연구자 계정 접근 (분석용)

```sql
-- 연구자 계정은 별도 service role로 분리
-- 익명화된 view를 통해서만 접근하도록 권장
CREATE VIEW public.research_pre_post_anonymized AS
  SELECT
    id,
    MD5(user_id || 'salt_key_here') AS anon_user_id,
    school_id,
    survey_phase,
    grade_band,
    k_score_by_construct,
    s_score_by_construct,
    a_score_by_construct,
    context_variables,
    submitted_at
  FROM public.pre_post_surveys;
```

---

## 6. 마이그레이션 파일 예시

### 6-1. `supabase/migrations/20260421_survey_system.sql`

```sql
-- ═══════════════════════════════════════════════════
-- 설문 시스템 테이블 생성
-- ═══════════════════════════════════════════════════

BEGIN;

-- 1. 문항 풀
CREATE TABLE IF NOT EXISTS public.ksa_item_bank (
  -- [2-1 스키마 그대로]
);

-- 2. 사전-사후 응답
CREATE TABLE IF NOT EXISTS public.pre_post_surveys (
  -- [3-1 스키마 그대로]
);

-- 3. 미션 후 자기평가
CREATE TABLE IF NOT EXISTS public.post_mission_evaluations (
  -- [4-1 스키마 그대로]
);

-- 4. RLS 정책
-- [5-1 정책 그대로]

-- 5. 익명화 view
-- [5-2 view 그대로]

COMMIT;
```

### 6-2. 문항 초기 데이터 적재 스크립트

```
scripts/seed_ksa_item_bank.cjs
```

이 스크립트는 `POST_MISSION_SELF_EVAL_MASTER.md`와 `PRE_POST_SURVEY_MASTER.md`의 문항을 파싱해 INSERT 문을 생성. 수동 SQL 대신 JSON 파일로 관리 권장:

```
src/data/surveys/
  ├── pre_post_items.json           -- 사전-사후 48문항
  ├── post_mission_items.json       -- 미션 후 89문항
  └── seed.js                       -- Supabase에 upsert
```

---

## 7. 분석용 쿼리 예시

### 7-1. 학생별 사전-사후 K 점수 변화
```sql
SELECT
  pre.user_id,
  pre.grade_band,
  pre.k_score_by_construct AS pre_k,
  post.k_score_by_construct AS post_k
FROM pre_post_surveys pre
JOIN pre_post_surveys post
  ON pre.user_id = post.user_id
WHERE pre.survey_phase = 'pre'
  AND post.survey_phase = 'post';
```

### 7-2. 구인별 미션 후 자기평가 종단 궤적
```sql
SELECT
  user_id,
  mission_code,
  (k_responses->>'K1.4')::int AS k14_score,
  submitted_at
FROM post_mission_evaluations
WHERE k_responses ? 'K1.4'
ORDER BY user_id, submitted_at;
```

### 7-3. Calibration gap: 자기보고 K vs 수행 점수
```sql
SELECT
  e.user_id,
  e.mission_code,
  (e.k_responses->>'K4.3')::int AS self_reported_k43,
  -- mission_submissions_v4.answers에서 rubric 점수 추출 필요
  s.data->>'rubric_score' AS performance_score
FROM post_mission_evaluations e
JOIN mission_submissions_v4 s ON s.id = e.submission_id
WHERE e.k_responses ? 'K4.3';
```

---

## 8. 구현 마일스톤

1. 마이그레이션 SQL 작성 및 적용
2. `src/data/surveys/` 폴더 생성 및 JSON 문항 파일 작성
3. Seed 스크립트로 `ksa_item_bank` 초기 데이터 적재
4. 사전-사후 설문 UI 컴포넌트 신규 작성 (라우팅 `/survey/pre`, `/survey/post`)
5. 미션 submit 후 자기평가 UI 추가 (기존 `MissionRunner` submit 직전에 삽입)
6. RLS 정책 적용 및 테스트 (본인 데이터만 보이는지)
7. 연구자용 익명화 view 생성 및 접근 제어

각 단계의 Claude Code 작업은 다음 문서(`CLAUDE_CODE_RESEARCH_BUILD_GUIDE.md`)에서 다룬다.
