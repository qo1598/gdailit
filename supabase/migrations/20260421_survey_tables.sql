-- ═══════════════════════════════════════════════════════════════
-- M3: 설문·평가 테이블 3개 추가
-- pre_post_surveys 제외 (구글 설문으로 대체)
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────
-- 1. ksa_item_bank — 문항 풀
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ksa_item_bank (
  id                bigserial PRIMARY KEY,
  survey_type       text        NOT NULL,   -- 'post_mission'
  ksa_code          text        NOT NULL,   -- 'K1.4', 'S.critical_thinking', 'A.responsible'
  ksa_category      text        NOT NULL,   -- 'K' | 'S' | 'A'
  grade_band        text        NOT NULL,   -- 'L' | 'M' | 'H'
  item_text         text        NOT NULL,
  scale_type        text        NOT NULL,   -- '3point_emoji' | '5point_likert'
  is_reverse_coded  boolean     NOT NULL DEFAULT false,
  choice_options    jsonb,
  correct_answer_id text,
  display_order     integer,
  cvi_score         numeric,
  is_active         boolean     NOT NULL DEFAULT true,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (survey_type, ksa_code, grade_band)
);

CREATE INDEX IF NOT EXISTS idx_item_bank_survey
  ON public.ksa_item_bank (survey_type, grade_band);
CREATE INDEX IF NOT EXISTS idx_item_bank_ksa
  ON public.ksa_item_bank (ksa_code);
CREATE INDEX IF NOT EXISTS idx_item_bank_active
  ON public.ksa_item_bank (is_active);

ALTER TABLE public.ksa_item_bank ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "item_bank_read_all" ON public.ksa_item_bank;
CREATE POLICY "item_bank_read_all"
  ON public.ksa_item_bank FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "item_bank_insert_service" ON public.ksa_item_bank;
CREATE POLICY "item_bank_insert_service"
  ON public.ksa_item_bank FOR INSERT
  WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 2. post_mission_evaluations — 미션 후 자기평가
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_mission_evaluations (
  id                   bigserial PRIMARY KEY,
  submission_id        bigint REFERENCES public.mission_submissions_v4(id) ON DELETE CASCADE,
  user_id              text        NOT NULL,
  mission_code         text        NOT NULL,
  grade_band           text        NOT NULL,

  -- KSA 구인별 응답 (해당 미션의 ksa에 매핑된 구인만)
  k_responses          jsonb,   -- {"K1.4": 3}
  s_responses          jsonb,   -- {"S.critical_thinking": 4}
  a_responses          jsonb,   -- {"A.curious": 5}

  -- 공통 일반 평가
  difficulty_rating    integer,
  ai_helpfulness_rating integer,

  free_comment         text,
  submitted_at         timestamptz NOT NULL DEFAULT now(),
  duration_sec         integer,

  UNIQUE (submission_id)
);

CREATE INDEX IF NOT EXISTS idx_post_mission_eval_user
  ON public.post_mission_evaluations (user_id);
CREATE INDEX IF NOT EXISTS idx_post_mission_eval_mission
  ON public.post_mission_evaluations (mission_code, grade_band);

ALTER TABLE public.post_mission_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_mission_own_insert" ON public.post_mission_evaluations;
CREATE POLICY "post_mission_own_insert"
  ON public.post_mission_evaluations FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "post_mission_own_select" ON public.post_mission_evaluations;
CREATE POLICY "post_mission_own_select"
  ON public.post_mission_evaluations FOR SELECT
  USING (true);


-- ─────────────────────────────────────────────
-- 3. teachers — 교사 계정
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teachers (
  id          text PRIMARY KEY,
  password    text NOT NULL,
  name        text,
  school_id   text NOT NULL DEFAULT 'gyeongdong',
  class_ids   text[]
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teachers_select_own" ON public.teachers;
CREATE POLICY "teachers_select_own"
  ON public.teachers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "teachers_insert" ON public.teachers;
CREATE POLICY "teachers_insert"
  ON public.teachers FOR INSERT
  WITH CHECK (true);

COMMIT;
