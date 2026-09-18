-- 로컬 개발용 시드: 지역 2, 공예 8종, 확보 장인 2인 (RFP §10)
-- 번역(ja/zh)과 본문은 콘텐츠 확정 후 관리자 화면에서 입력한다.

insert into public.regions (slug, name, sort, is_published) values
  ('tongyeong', '{"ko": "통영", "en": "Tongyeong", "ja": "統営", "zh": "统营"}', 1, true),
  ('masan', '{"ko": "마산", "en": "Masan", "ja": "馬山", "zh": "马山"}', 2, true);

insert into public.crafts (slug, region_id, name, sort, is_published)
select c.slug, r.id, c.name::jsonb, c.sort, true
from (values
  ('somok',   'tongyeong', '{"ko": "소목장"}', 1),
  ('najeon',  'tongyeong', '{"ko": "나전장"}', 2),
  ('buchae',  'tongyeong', '{"ko": "부채장"}', 3),
  ('nubi',    'tongyeong', '{"ko": "누비장"}', 4),
  ('onggi',   'tongyeong', '{"ko": "옹기장(도예)"}', 5),
  ('duseok',  'tongyeong', '{"ko": "두석장"}', 6),
  ('chil',    'tongyeong', '{"ko": "칠장(옻칠)"}', 7),
  ('maedeup', 'masan',     '{"ko": "매듭장"}', 8)
) as c(slug, region_slug, name, sort)
join public.regions r on r.slug = c.region_slug;

insert into public.artisans (slug, craft_id, region_id, name, sort, is_published)
select a.slug, c.id, c.region_id, a.name::jsonb, a.sort, true
from (values
  ('kim-jinhwan',  'duseok', '{"ko": "김진환"}', 1),
  ('cheon-giyeong', 'chil',  '{"ko": "천기영"}', 2)
) as a(slug, craft_slug, name, sort)
join public.crafts c on c.slug = a.craft_slug;

-- 테스트용 QR 코드
insert into public.qr_codes (code, target_type, target_id, location_label)
select 'TY-DUSEOK-01', 'artisan', id, '통영전통공예관 · 두석장' from public.artisans where slug = 'kim-jinhwan';
insert into public.qr_codes (code, target_type, target_id, location_label)
select 'TY-CHIL-01', 'artisan', id, '통영전통공예관 · 칠장' from public.artisans where slug = 'cheon-giyeong';

-- [샘플] 체험 일정: 매주 토요일 10:00 · 14:00, 회차당 6명 (확정 전 임시값 — docs/features.md §7)
insert into public.experience_rules (artisan_id, weekday, start_time, duration_min, capacity)
select a.id, 6, t.start_time, 120, 6
from public.artisans a
cross join (values (time '10:00'), (time '14:00')) as t(start_time)
where a.slug in ('kim-jinhwan', 'cheon-giyeong');

select public.generate_experience_slots(current_date, current_date + 60);
