-- A.OULL 초기 스키마
-- 다국어 텍스트: jsonb {"ko": "...", "en": "...", "ja": "...", "zh": "..."} — ko 필수
-- 미디어: storage_path만 저장 (전체 URL 저장 금지, docs/storage-decision.md)

create extension if not exists pg_trgm;

-- ─────────────────────────────────────────────────────────────
-- 공통
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_i18n(value jsonb)
returns boolean language sql immutable as $$
  select value is not null and jsonb_typeof(value) = 'object' and value ? 'ko'
$$;

create type public.locale as enum ('ko', 'en', 'ja', 'zh');
create type public.media_kind as enum ('audio', 'image');
create type public.owner_type as enum ('craft', 'artisan', 'story', 'region', 'post');
create type public.request_status as enum ('new', 'in_progress', 'done', 'canceled');

-- 관리자 (초대 방식: auth.users 생성 후 이 테이블에 추가)
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- ─────────────────────────────────────────────────────────────
-- 미디어
-- ─────────────────────────────────────────────────────────────
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null,
  storage_path text not null unique,
  mime text not null,
  bytes bigint,
  duration_sec numeric(8, 2),
  width int,
  height int,
  alt jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 콘텐츠
-- ─────────────────────────────────────────────────────────────
create table public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name jsonb not null check (public.is_i18n(name)),
  intro jsonb,
  cover_image_id uuid references public.media_assets (id) on delete set null,
  sort int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crafts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  region_id uuid references public.regions (id) on delete set null,
  name jsonb not null check (public.is_i18n(name)),
  summary jsonb,
  history jsonb,
  technique jsonb,
  cover_image_id uuid references public.media_assets (id) on delete set null,
  sort int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artisans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  craft_id uuid references public.crafts (id) on delete set null,
  region_id uuid references public.regions (id) on delete set null,
  name jsonb not null check (public.is_i18n(name)),
  title jsonb, -- 예: 국가무형유산 두석장 보유자
  bio jsonb,
  profile_image_id uuid references public.media_assets (id) on delete set null,
  store_url text,
  sort int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  title jsonb not null check (public.is_i18n(title)),
  body jsonb,
  image_id uuid references public.media_assets (id) on delete set null,
  sort int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 도슨트 오디오: 소유자(종목/장인/스토리 등)별, 언어별 트랙
create table public.audio_tracks (
  id uuid primary key default gen_random_uuid(),
  owner_type public.owner_type not null,
  owner_id uuid not null,
  locale public.locale not null,
  asset_id uuid not null references public.media_assets (id) on delete restrict,
  title jsonb,
  is_ai_voice boolean not null default true,
  sort int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_type, owner_id, locale, sort)
);
create index audio_tracks_owner_idx on public.audio_tracks (owner_type, owner_id);

-- 매거진 (블로그형)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null check (public.is_i18n(title)),
  excerpt jsonb,
  body jsonb, -- 에디터 결정 후 형식 확정 (Tiptap JSON 또는 Markdown, locale별)
  cover_image_id uuid references public.media_assets (id) on delete set null,
  artisan_id uuid references public.artisans (id) on delete set null,
  craft_id uuid references public.crafts (id) on delete set null,
  tags text[] not null default '{}',
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_idx on public.posts (published_at desc) where is_published;

-- QR: code는 인쇄물에 들어가므로 절대 변경 금지. 대상만 바꾼다.
create table public.qr_codes (
  code text primary key check (code ~ '^[A-Za-z0-9_-]{4,32}$'),
  target_type public.owner_type not null default 'artisan',
  target_id uuid not null,
  location_label text, -- 예: 통영전통공예관 2층 두석장 부스
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 검색용 trigram 인덱스 (종목명/장인명/지역명)
create index crafts_name_trgm on public.crafts using gin ((name::text) gin_trgm_ops);
create index artisans_name_trgm on public.artisans using gin ((name::text) gin_trgm_ops);
create index regions_name_trgm on public.regions using gin ((name::text) gin_trgm_ops);

-- ─────────────────────────────────────────────────────────────
-- 개인정보 (문의) — anon은 insert만
-- ─────────────────────────────────────────────────────────────
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 50),
  contact text not null check (char_length(contact) between 3 and 100),
  message text not null check (char_length(message) between 1 and 2000),
  locale public.locale not null default 'ko',
  privacy_agreed_at timestamptz not null,
  status public.request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- reservations(체험 예약)는 20260919000000_tracking_reservations.sql에서 정의한다 (슬롯·세션 참조)

-- updated_at 트리거
do $$
declare t text;
begin
  foreach t in array array['regions','crafts','artisans','stories','audio_tracks','posts','qr_codes','inquiries']
  loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
alter table public.admins enable row level security;
alter table public.media_assets enable row level security;
alter table public.regions enable row level security;
alter table public.crafts enable row level security;
alter table public.artisans enable row level security;
alter table public.stories enable row level security;
alter table public.audio_tracks enable row level security;
alter table public.posts enable row level security;
alter table public.qr_codes enable row level security;
alter table public.inquiries enable row level security;

-- admins: 본인 행만 조회 (관리자 여부 확인용)
create policy "admins: self read" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- 콘텐츠: 공개된 것만 누구나 조회, 관리자는 전체 CRUD
do $$
declare t text;
begin
  foreach t in array array['regions','crafts','artisans','stories','audio_tracks','posts']
  loop
    execute format('create policy "%s: public read" on public.%I for select to anon, authenticated using (is_published)', t, t);
    execute format('create policy "%s: admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

create policy "media_assets: public read" on public.media_assets
  for select to anon, authenticated using (true);
create policy "media_assets: admin all" on public.media_assets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "qr_codes: public read active" on public.qr_codes
  for select to anon, authenticated using (is_active);
create policy "qr_codes: admin all" on public.qr_codes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 개인정보(문의): 누구나 insert(동의 필수), 조회·수정은 관리자만
create policy "inquiries: public insert" on public.inquiries
  for insert to anon, authenticated with check (status = 'new');
create policy "inquiries: admin read" on public.inquiries
  for select to authenticated using (public.is_admin());
create policy "inquiries: admin update" on public.inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


-- ─────────────────────────────────────────────────────────────
-- Storage (STORAGE_DRIVER=supabase 일 때)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array['audio/mp4', 'audio/mpeg', 'audio/aac', 'image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

create policy "media bucket: admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media bucket: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media bucket: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
