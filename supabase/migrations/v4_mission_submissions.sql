-- V4 미션 제출 테이블
-- Supabase 대시보드 > SQL Editor 에서 1회 실행하세요.

create table if not exists public.mission_submissions_v4 (
  id               bigserial primary key,
  user_id          text        not null,
  mission_code     text        not null,  -- 'E-1-L' 등
  grade_band       text        not null,  -- 'L' | 'M' | 'H'
  domain           text        not null,  -- 'Engaging' 등
  performance_type text        not null,  -- 'TD' | 'SJ' | 'GC' | 'DS'
  answers          jsonb       not null default '{}'::jsonb,
  started_at       timestamptz,
  submitted_at     timestamptz not null default now(),
  completed        boolean     not null default false,
  created_at       timestamptz not null default now(),
  unique (user_id, mission_code)
);

create index if not exists mission_submissions_v4_user_idx
  on public.mission_submissions_v4 (user_id);

create index if not exists mission_submissions_v4_mission_idx
  on public.mission_submissions_v4 (mission_code);

-- RLS 사용 (V3 테이블과 동일한 정책을 적용하세요. 예: 익명 insert/upsert 허용)
alter table public.mission_submissions_v4 enable row level security;

-- 예시 정책 (프로젝트 보안 정책에 맞게 수정 필요)
drop policy if exists "v4 submissions: upsert for all" on public.mission_submissions_v4;
create policy "v4 submissions: upsert for all"
  on public.mission_submissions_v4
  for all
  using (true)
  with check (true);
