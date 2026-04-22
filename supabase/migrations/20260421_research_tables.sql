-- ═══════════════════════════════════════════════════════════════
-- M2: 연구용 테이블 4개 추가
-- student_reflections는 post_mission_evaluations로 통합 (M3에서 생성)
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────
-- 1. mission_events — 과정 로그
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mission_events (
  id              bigserial PRIMARY KEY,
  user_id         text        NOT NULL,
  session_id      uuid        NOT NULL,
  mission_code    text        NOT NULL,
  grade_band      text        NOT NULL,
  step_id         text,
  stage           text        NOT NULL,
  event_type      text        NOT NULL,
  event_payload   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  client_ts       timestamptz NOT NULL,
  server_ts       timestamptz NOT NULL DEFAULT now(),
  school_id       text        NOT NULL DEFAULT 'gyeongdong'
);

CREATE INDEX IF NOT EXISTS idx_mission_events_session
  ON public.mission_events (session_id, client_ts);
CREATE INDEX IF NOT EXISTS idx_mission_events_user_mission
  ON public.mission_events (user_id, mission_code);
CREATE INDEX IF NOT EXISTS idx_mission_events_type
  ON public.mission_events (event_type);

ALTER TABLE public.mission_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mission_events_insert_own" ON public.mission_events;
CREATE POLICY "mission_events_insert_own"
  ON public.mission_events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "mission_events_select_own" ON public.mission_events;
CREATE POLICY "mission_events_select_own"
  ON public.mission_events FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
         OR current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role');


-- ─────────────────────────────────────────────
-- 2. ai_interactions — AI 대화 원문
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id                     bigserial PRIMARY KEY,
  user_id                text        NOT NULL,
  session_id             uuid        NOT NULL,
  mission_code           text        NOT NULL,
  step_id                text        NOT NULL,
  attempt                integer     NOT NULL DEFAULT 1,
  provider               text        NOT NULL,
  model_name             text        NOT NULL,
  system_prompt          text,
  user_prompt            text        NOT NULL,
  ai_response            text,
  response_type          text        NOT NULL,
  response_metadata      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  fallback_used          boolean     NOT NULL DEFAULT false,
  student_action         text,
  student_action_payload jsonb,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user
  ON public.ai_interactions (user_id, mission_code);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session
  ON public.ai_interactions (session_id);

ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_interactions_insert_own" ON public.ai_interactions;
CREATE POLICY "ai_interactions_insert_own"
  ON public.ai_interactions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "ai_interactions_select_own" ON public.ai_interactions;
CREATE POLICY "ai_interactions_select_own"
  ON public.ai_interactions FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
         OR current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role');


-- ─────────────────────────────────────────────
-- 3. teacher_ratings — 교사 평정
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teacher_ratings (
  id                  bigserial PRIMARY KEY,
  submission_id       bigint REFERENCES public.mission_submissions_v4(id) ON DELETE CASCADE,
  rater_id            text        NOT NULL,
  rater_school        text,
  rubric_scores       jsonb       NOT NULL,
  qualitative_comment text,
  rating_duration_sec integer,
  rated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_ratings_submission
  ON public.teacher_ratings (submission_id);
CREATE INDEX IF NOT EXISTS idx_teacher_ratings_rater
  ON public.teacher_ratings (rater_id);

ALTER TABLE public.teacher_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teacher_ratings_insert" ON public.teacher_ratings;
CREATE POLICY "teacher_ratings_insert"
  ON public.teacher_ratings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "teacher_ratings_select" ON public.teacher_ratings;
CREATE POLICY "teacher_ratings_select"
  ON public.teacher_ratings FOR SELECT
  USING (true);


-- ─────────────────────────────────────────────
-- 4. student_contexts — 학생 맥락 변인
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_contexts (
  user_id               text PRIMARY KEY,
  gender                text,
  grade                 integer     NOT NULL,
  class_id              text        NOT NULL,
  ai_usage_frequency    integer,
  ai_tools_used         text[],
  digital_access_level  integer,
  collected_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_contexts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_contexts_own" ON public.student_contexts;
CREATE POLICY "student_contexts_own"
  ON public.student_contexts FOR ALL
  USING (true)
  WITH CHECK (true);

COMMIT;
