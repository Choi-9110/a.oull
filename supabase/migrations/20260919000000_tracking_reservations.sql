-- 행동 데이터(세션 추적) + 캘린더 체험 예약 + 개인정보 안전조치
-- 스펙: docs/features.md §2 ~ §4, §6

-- ─────────────────────────────────────────────────────────────
-- 1. 행동 데이터 — 익명 ID 기반. 쓰기는 /api/track(service role)만, 읽기는 관리자만
-- ─────────────────────────────────────────────────────────────
create table public.visitors (
  id uuid primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  os text,
  browser text
);

create table public.sessions (
  id uuid primary key,
  visitor_id uuid not null references public.visitors (id) on delete cascade,
  started_at timestamptz not null default now(),
  last_event_at timestamptz not null default now(),
  entry_type text not null check (entry_type in ('qr', 'utm', 'referral', 'direct')),
  qr_code text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  landing_path text,
  os text,
  browser text,
  in_app text,
  locale public.locale
);
create index sessions_started_idx on public.sessions (started_at desc);
create index sessions_qr_idx on public.sessions (qr_code) where qr_code is not null;

create table public.events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.sessions (id) on delete cascade,
  type text not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  path text,
  locale public.locale,
  artisan text, -- slug (콘텐츠 교체와 무관하게 분석 가능하도록 slug로 기록)
  craft text,
  track text,
  position_sec numeric(8, 1),
  listened_sec numeric(8, 1),
  progress_pct smallint,
  dwell_sec integer,
  scroll_pct smallint,
  props jsonb not null default '{}'
);
create index events_session_idx on public.events (session_id, occurred_at);
create index events_type_time_idx on public.events (type, occurred_at desc);
create index events_artisan_idx on public.events (artisan, type) where artisan is not null;

alter table public.visitors enable row level security;
alter table public.sessions enable row level security;
alter table public.events enable row level security;

create policy "visitors: admin read" on public.visitors for select to authenticated using (public.is_admin());
create policy "sessions: admin read" on public.sessions for select to authenticated using (public.is_admin());
create policy "events: admin read" on public.events for select to authenticated using (public.is_admin());

-- 세션 단위 퍼널 (대시보드용)
create view public.session_funnel with (security_invoker = true) as
select
  s.id as session_id,
  s.started_at,
  s.entry_type,
  s.qr_code,
  s.locale,
  bool_or(e.type = 'docent_play') as played,
  bool_or(e.type = 'docent_complete') as completed,
  bool_or(e.type = 'docent_abandon') as abandoned,
  coalesce(sum(e.listened_sec) filter (where e.type in ('docent_pause', 'docent_complete', 'docent_abandon')), 0) as listened_sec,
  bool_or(e.type = 'store_click') as store_clicked,
  bool_or(e.type = 'reservation_start') as reservation_started,
  bool_or(e.type = 'reservation_submit') as reserved
from public.sessions s
left join public.events e on e.session_id = s.id
group by s.id;

-- ─────────────────────────────────────────────────────────────
-- 2. 체험 일정 — 요일 규칙 → 회차(slot) 생성, 예외는 회차를 직접 수정
-- ─────────────────────────────────────────────────────────────
create table public.experience_rules (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), -- 0=일 ... 6=토 (KST)
  start_time time not null,
  duration_min integer not null default 120 check (duration_min between 30 and 480),
  capacity integer not null check (capacity between 1 and 100),
  valid_from date not null default current_date,
  valid_to date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_slots (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references public.experience_rules (id) on delete set null,
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  starts_at timestamptz not null,
  duration_min integer not null default 120,
  capacity integer not null check (capacity between 1 and 100),
  status text not null default 'open' check (status in ('open', 'closed')),
  note text, -- 예: 공방 사정으로 휴무
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (artisan_id, starts_at)
);
create index experience_slots_time_idx on public.experience_slots (starts_at);

-- 규칙으로 회차를 미리 생성 (이미 있는 회차는 건드리지 않음 → 관리자가 바꾼 예외 유지)
create or replace function public.generate_experience_slots(p_from date, p_to date)
returns integer language plpgsql security definer set search_path = '' as $$
declare inserted integer;
begin
  insert into public.experience_slots (rule_id, artisan_id, starts_at, duration_min, capacity)
  select r.id, r.artisan_id,
         ((d::date + r.start_time) at time zone 'Asia/Seoul'),
         r.duration_min, r.capacity
  from public.experience_rules r
  cross join generate_series(p_from::timestamp, p_to::timestamp, interval '1 day') as d
  where r.is_active
    and extract(dow from d)::smallint = r.weekday
    and d::date >= r.valid_from
    and (r.valid_to is null or d::date <= r.valid_to)
  on conflict (artisan_id, starts_at) do nothing;
  get diagnostics inserted = row_count;
  return inserted;
end;
$$;
revoke all on function public.generate_experience_slots(date, date) from public, anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 3. 예약 — 개인정보 최소 수집(이름·연락처), 보유기간 경과 시 자동 파기
-- ─────────────────────────────────────────────────────────────
create type public.reservation_status as enum ('pending', 'confirmed', 'canceled', 'no_show');

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.experience_slots (id) on delete restrict,
  party_size integer not null check (party_size between 1 and 20),
  name text check (char_length(name) between 1 and 50),
  phone text check (char_length(phone) between 8 and 20),
  message text check (char_length(message) <= 500),
  locale public.locale not null default 'ko',
  session_id uuid references public.sessions (id) on delete set null,
  status public.reservation_status not null default 'pending',
  privacy_agreed_at timestamptz not null,
  age14_confirmed boolean not null check (age14_confirmed),
  purge_after date not null,
  purged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- 파기 전에는 이름·연락처 필수
  check (purged_at is not null or (name is not null and phone is not null))
);
create index reservations_slot_idx on public.reservations (slot_id);
create index reservations_purge_idx on public.reservations (purge_after) where purged_at is null;

alter table public.experience_rules enable row level security;
alter table public.experience_slots enable row level security;
alter table public.reservations enable row level security;

create policy "experience_rules: admin all" on public.experience_rules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "experience_slots: admin all" on public.experience_slots
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- 예약: 공개 쪽은 테이블에 직접 접근 불가 — create_reservation() RPC로만 생성
create policy "reservations: admin read" on public.reservations
  for select to authenticated using (public.is_admin());
create policy "reservations: admin update" on public.reservations
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- 공개: 예약 가능한 회차와 남은 자리 수만 반환 (명단은 절대 노출하지 않음)
create or replace function public.get_available_slots(p_artisan text, p_from date, p_to date)
returns table (slot_id uuid, starts_at timestamptz, duration_min integer, capacity integer, remaining integer)
language sql stable security definer set search_path = '' as $$
  select s.id, s.starts_at, s.duration_min, s.capacity,
         greatest(s.capacity - coalesce(sum(r.party_size) filter (where r.status in ('pending', 'confirmed')), 0), 0)::integer
  from public.experience_slots s
  join public.artisans a on a.id = s.artisan_id and a.slug = p_artisan and a.is_published
  left join public.reservations r on r.slot_id = s.id
  where s.status = 'open'
    and s.starts_at >= ((p_from::timestamp) at time zone 'Asia/Seoul')
    and s.starts_at < (((p_to + 1)::timestamp) at time zone 'Asia/Seoul')
    and s.starts_at > now() + interval '1 day' -- 당일 예약 불가
  group by s.id
  order by s.starts_at;
$$;
grant execute on function public.get_available_slots(text, date, date) to anon, authenticated;

-- 공개: 예약 생성. 회차 행을 잠근 뒤 정원을 확인해 초과 예약을 막는다.
create or replace function public.create_reservation(
  p_slot_id uuid,
  p_party_size integer,
  p_name text,
  p_phone text,
  p_message text,
  p_locale public.locale,
  p_session_id uuid,
  p_privacy_agreed boolean,
  p_age14_confirmed boolean
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_slot public.experience_slots%rowtype;
  v_booked integer;
  v_id uuid;
begin
  if not coalesce(p_privacy_agreed, false) then raise exception 'PRIVACY_REQUIRED'; end if;
  if not coalesce(p_age14_confirmed, false) then raise exception 'AGE14_REQUIRED'; end if;
  if p_party_size is null or p_party_size < 1 then raise exception 'INVALID_PARTY'; end if;

  select * into v_slot from public.experience_slots where id = p_slot_id for update;
  if not found or v_slot.status <> 'open' then raise exception 'SLOT_UNAVAILABLE'; end if;
  if v_slot.starts_at <= now() + interval '1 day' then raise exception 'SLOT_UNAVAILABLE'; end if;

  select coalesce(sum(party_size), 0) into v_booked
  from public.reservations
  where slot_id = p_slot_id and status in ('pending', 'confirmed');
  if v_booked + p_party_size > v_slot.capacity then raise exception 'SLOT_FULL'; end if;

  insert into public.reservations (
    slot_id, party_size, name, phone, message, locale, session_id,
    privacy_agreed_at, age14_confirmed, purge_after
  ) values (
    p_slot_id, p_party_size, trim(p_name), trim(p_phone), nullif(trim(p_message), ''), p_locale,
    (select id from public.sessions where id = p_session_id),
    now(), true,
    -- 보유기간: 체험일로부터 30일 (docs/features.md §4-1)
    ((v_slot.starts_at at time zone 'Asia/Seoul')::date + 30)
  ) returning id into v_id;
  return v_id;
end;
$$;
grant execute on function public.create_reservation(uuid, integer, text, text, text, public.locale, uuid, boolean, boolean) to anon, authenticated;

-- 보유기간 경과 예약의 개인정보 파기 (통계용 행은 남기고 이름·연락처·요청사항만 삭제)
create or replace function public.purge_expired_reservations()
returns integer language plpgsql security definer set search_path = '' as $$
declare purged integer;
begin
  update public.reservations
     set name = null, phone = null, message = null, purged_at = now()
   where purged_at is null and purge_after < (now() at time zone 'Asia/Seoul')::date;
  get diagnostics purged = row_count;
  return purged;
end;
$$;
revoke all on function public.purge_expired_reservations() from public, anon, authenticated;
-- 운영 시: Supabase 대시보드에서 pg_cron 활성화 후
--   select cron.schedule('purge-reservations', '0 18 * * *', 'select public.purge_expired_reservations()');  -- 매일 03:00 KST

-- ─────────────────────────────────────────────────────────────
-- 4. 관리자 개인정보 열람 기록 (안전성 확보조치 기준: 1년 이상 보관)
-- ─────────────────────────────────────────────────────────────
create table public.admin_access_logs (
  id bigint generated always as identity primary key,
  admin_id uuid not null references auth.users (id),
  action text not null check (action in ('view_list', 'reveal_phone', 'update_status', 'export')),
  target text,
  at timestamptz not null default now()
);
alter table public.admin_access_logs enable row level security;
create policy "admin_access_logs: admin insert own" on public.admin_access_logs
  for insert to authenticated with check (public.is_admin() and admin_id = (select auth.uid()));
create policy "admin_access_logs: admin read" on public.admin_access_logs
  for select to authenticated using (public.is_admin());

-- updated_at 트리거
create trigger experience_rules_updated_at before update on public.experience_rules
  for each row execute function public.set_updated_at();
create trigger experience_slots_updated_at before update on public.experience_slots
  for each row execute function public.set_updated_at();
create trigger reservations_updated_at before update on public.reservations
  for each row execute function public.set_updated_at();
