# A.OULL (아울) — 전통공예 AI 음성 도슨트 웹앱

> 원본 기획: `docs/rfp/A.OULL_RFP.pdf` (2026-09-16), `docs/rfp/A.OULL_AI_docent_poster.pdf` — **로컬 전용**(레포가 Public이라 .gitignore 처리)
> 이 파일은 프로젝트의 "헌법"이다. 구조·규칙이 바뀌면 여기부터 고친다.

@AGENTS.md

> ⚠️ **Next.js 16**이다. 학습 데이터와 API가 다르다(예: `middleware.ts` → `src/proxy.ts`, 전역 타입 `PageProps<"/route">`·`LayoutProps`·`RouteContext`, `revalidateTag(tag, profile)`). 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 확인한다.

## 1. 한 줄 요약

전시장(통영전통공예관 등) QR → 장인 페이지 → **장인 목소리(Voice Cloning) AI 도슨트** 청취 → **구매(스마트스토어) / 체험 예약** 전환까지 이어지는 **모바일 웹앱**. 앱 설치 없이 모바일 브라우저에서 앱처럼 보이게 만든다.

- 브랜드: A.OULL — 소멸 위기 전통공예 장인과 협업하는 뉴리티지(Newritage) 공예품 브랜드
- 도메인: `aoull.com`, `newritage.com`
- **핵심 KPI: 도슨트 경험 → 구매/체험예약 전환율.** 체류시간·완청률은 전환을 해석하기 위한 보조 지표.
- 범위: RFP 기능 F-01~F-12 + **매거진(M-01, 블로그형 글)**. 구매는 스마트스토어 **외부 링크**로만 처리한다(자체 결제 없음).

## 2. 절대 원칙

1. **모바일 퍼스트, 앱처럼 보이기.** 기준 뷰포트는 360~430px. 데스크톱에서는 가운데 정렬된 모바일 폭 컨테이너(max-w 480px)로 보여준다. PWA manifest + `display: standalone`, safe-area inset, 하단 탭바, 페이지 전환 애니메이션을 쓴다.
2. **정적 우선 (SSG/ISR).** 콘텐츠 페이지는 빌드 시 또는 ISR로 생성한다. 런타임에 DB를 부르는 건 폼 제출, 관리자, 검색 정도로 한정한다. 현장 Wi-Fi가 느려도 버틸 수 있어야 한다.
3. **콘텐츠 = 데이터.** 장인·종목·지역 페이지는 템플릿 1개로 만든다. 관리자가 등록하면 코드 수정·재배포 없이 페이지가 생긴다(on-demand revalidate).
4. **QR은 한 번 인쇄하면 못 바꾼다.** 인쇄되는 URL은 slug가 아니라 **불변 코드**(`/q/{code}`)를 쓰고, 코드 → 대상 매핑은 DB에서 관리한다.
5. **오디오 자동재생은 모바일에서 막힌다.** iOS/Android 모두 소리 있는 자동재생이 차단되므로, QR로 들어오면 "탭해서 듣기" 큰 버튼을 먼저 보여준다. autoplay에 의존하지 않는다.
6. **비용 최소화.** 인프라는 Supabase + Vercel이다. 미디어 스토리지 결정은 `docs/storage-decision.md`를 따른다. 트래픽이 늘면 비용이 가장 먼저 커지는 곳은 오디오 egress다.
7. **다국어 3개(ko / ja / zh).** 모든 사용자 노출 텍스트와 오디오는 locale별로 관리한다. 하드코딩된 한국어 문자열을 컴포넌트에 넣지 않는다.
8. **개인정보.** 문의·예약 폼은 이름·연락처를 받으므로 **개인정보 수집·이용 동의 체크박스가 필수**다. 공개 API로 개인정보를 조회할 수 없어야 한다(RLS: insert만 허용).
9. **AI 음성 고지.** 보이스 클로닝 오디오에는 "AI로 생성한 음성" 표기를 넣는다. 장인 음성 사용 동의서는 운영 측에서 확보한다.

## 3. 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 런타임 | Node.js **24 LTS** (`.nvmrc`, nvm-windows로 관리) | Vercel 프로젝트 설정도 Node 24.x |
| 프레임워크 | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript | RSC, SSG/ISR, Server Actions |
| 스타일 | Tailwind CSS v4 + shadcn/ui (필요한 것만) | 디자인 토큰은 `src/styles/tokens.css` → `globals.css`의 `@theme` |
| 다국어 | next-intl v4 | `/[locale]/...` 라우팅, 기본값 `ko`, 설정은 `src/i18n/` |
| DB / Auth | Supabase (Postgres + Auth + RLS) | 관리자 로그인만 Auth 사용, 일반 방문자는 비로그인 |
| 미디어 스토리지 | `docs/storage-decision.md` 참고 | 코드는 `src/lib/storage/` 어댑터를 통해서만 접근 |
| 호스팅 | Vercel | ⚠️ Hobby는 비상업용 한정. 상업 운영 시 Pro 필요 |
| 분석 | GA4 (gtag) + 필요 시 Supabase `events` 테이블 | 퍼널 이벤트는 §7 참고 |
| 폼 알림 | Resend(이메일) 또는 Discord/Slack Webhook | 확정 전 |
| 스팸 방지 | Cloudflare Turnstile + honeypot + rate limit | |
| 검증 | zod v4 | 폼·Server Action 입력 |
| 매거진 에디터 | Tiptap(오픈소스) 또는 Markdown | 확정 전 |
| 테스트 | Vitest(단위) + Playwright(iPhone 13 / Pixel 7 E2E) | |
| 패키지 매니저 | pnpm | |

## 4. 폴더 구조

```
aoull/
├─ CLAUDE.md / AGENTS.md         # AGENTS.md는 next dev가 관리 (Next 16 안내)
├─ docs/
│  ├─ rfp/                       # 원본 기획서 PDF (로컬 전용, git 제외)
│  ├─ storage-decision.md        # 스토리지 의사결정 기록
│  ├─ agents.md                  # 프로젝트 에이전트 구성
│  ├─ data-model.md              # (예정) ERD·테이블 명세
│  └─ analytics-events.md        # (예정) 이벤트 스펙
├─ .claude/agents/               # 프로젝트 전용 에이전트 4종
├─ public/icons/                 # PWA 아이콘 (icon-192.png, icon-512.png 추가 필요)
├─ src/
│  ├─ proxy.ts                   # (구 middleware) next-intl locale 협상. /admin, /q, /api 제외
│  ├─ i18n/                      # routing.ts, request.ts, navigation.ts (Link/redirect 등)
│  ├─ messages/                  # ko.json, ja.json, zh.json (UI 문구)
│  ├─ app/
│  │  ├─ layout.tsx              # 패스스루 (globals.css만 로드)
│  │  ├─ not-found.tsx           # locale 밖 404
│  │  ├─ manifest.ts             # PWA manifest (standalone)
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx           # <html> + NextIntlClientProvider + MobileShell
│  │  │  ├─ page.tsx             # F-01 메인홈 (검색 + 섹션 진입)
│  │  │  ├─ search/              # F-01 검색 결과
│  │  │  ├─ crafts/ · [slug]/    # F-02 종목 목록 · 템플릿
│  │  │  ├─ artisans/ · [slug]/  # F-03 장인 목록 · 템플릿 (도슨트 F-04 + 고정 CTA F-10)
│  │  │  ├─ regions/[slug]/      # F-05 통영 / 마산
│  │  │  ├─ magazine/ · [slug]/  # M-01 매거진 목록 · 글
│  │  │  ├─ about/               # F-06 아울 소개
│  │  │  ├─ contact/             # F-07 문의
│  │  │  └─ apply/               # F-08 체험 예약
│  │  ├─ q/[code]/route.ts       # F-09 QR 진입 → 장인 페이지로 리다이렉트
│  │  ├─ admin/                  # F-11 관리자 CMS (ko 전용, 자체 <html>)
│  │  └─ api/                    # (예정) revalidate, upload-url
│  ├─ components/
│  │  ├─ layout/                 # MobileShell, TabBar, PagePlaceholder
│  │  └─ ui/ audio/ cta/ search/ forms/
│  ├─ lib/
│  │  ├─ supabase/               # public.ts(쿠키X, 정적 조회용) · server.ts · client.ts · admin.ts(secret, 서버 전용) · env.ts
│  │  ├─ storage/                # 스토리지 어댑터: getPublicUrl, buildAudioPath, buildImagePath
│  │  ├─ analytics/track.ts      # 퍼널 이벤트 (타입 고정)
│  │  └─ i18n/                   # pickLocale(jsonb fallback), negotiateLocale(Accept-Language)
│  ├─ server/queries/ actions/   # 읽기 쿼리 / Server Actions
│  ├─ styles/                    # globals.css, tokens.css
│  └─ types/database.types.ts    # ⚠️ 현재 수기 작성본 → Supabase 연결 후 pnpm db:types로 교체
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/                # 20260918000000_init_schema.sql (전체 테이블 + RLS + media 버킷)
│  └─ seed.sql                   # 지역 2 · 종목 8 · 장인 2 · 테스트 QR 2
├─ scripts/                      # (예정) generate-qr.ts, encode-audio.sh
└─ tests/
   ├─ unit/                      # vitest
   └─ e2e/                       # playwright (QR 진입 → 재생 → CTA 시나리오)
```

## 5. 라우팅 규칙

- 공개 페이지: `/{locale}/...` (`ko` | `ja` | `zh`). `/`로 들어오면 Accept-Language를 보고 locale을 정한다. 판단이 안 되면 `ko`.
- slug는 영문 소문자 kebab-case를 쓴다(예: `dooseok`, `kim-jinhwan`). 한글 slug는 쓰지 않는다.
- **QR:** `https://aoull.com/q/{code}` → `qr_codes` 조회 → `/{locale}/artisans/{slug}?src=qr&qr={code}`로 302. `qr_scan_entry` 이벤트는 도착 페이지(클라이언트)에서 보낸다.
- 매거진: `/{locale}/magazine`, `/{locale}/magazine/{slug}`. 글은 ko 필수, ja/zh는 선택.
- 관리자: `/admin/**`. 세션 검사는 서버(레이아웃/Server Action)에서 하고, proxy에서는 낙관적 리다이렉트만 한다. 한국어만 지원한다.
- 테스트용 QR 코드(seed): `TY-DUSEOK-01` → 김진환, `TY-CHIL-01` → 천기영

## 6. 데이터 모델 (초안 → `docs/data-model.md`로 확정 예정)

- `regions` (slug, name{ko,ja,zh}, intro{…})
- `crafts` (slug, region_id, name{…}, history{…}, technique{…}, cover_image, sort)
- `artisans` (slug, craft_id, region_id, name{…}, bio{…}, profile_image, store_url, is_published, sort)
- `stories` (artisan_id, title{…}, body{…}, image, sort)
- `media_assets` (kind: audio|image, storage_path, mime, bytes, duration_sec)
- `audio_tracks` (owner_type: craft|artisan|story, owner_id, locale, asset_id, is_ai_voice)
- `qr_codes` (code 불변, target_type, target_id, location_label, is_active)
- `posts` (매거진: slug, title{…}, excerpt{…}, body{…}, cover_image, artisan_id/craft_id 연결, tags, published_at)
- `admins` (관리자 user_id) + `is_admin()` 함수로 RLS 판별
- 실제 정의: `supabase/migrations/20260918000000_init_schema.sql`
- `inquiries`, `reservations`: 개인정보가 들어간다. anon은 insert만 가능하고 select는 admin만 가능
- 다국어 텍스트는 `jsonb` `{ "ko": "...", "ja": "...", "zh": "..." }` 형태로 저장한다. 번역이 비어 있으면 `ko`로 fallback.
- DB에는 **스토리지 경로만** 저장하고 전체 URL은 저장하지 않는다(스토리지를 교체할 수 있게).

## 7. 분석 이벤트 (RFP §6 기준)

| 단계 | 이벤트 | 파라미터 |
|---|---|---|
| 현장 유입 | `qr_scan_entry` | craft_id, artisan_id, qr_code, locale, device_os |
| 체류·탐색 | `content_engagement` | dwell_time_sec, scroll_depth |
| 도슨트 몰입 | `audio_docent_action` | play_action(play/pause/seek/complete), completion_rate, locale |
| **전환** | `conversion_cta_click` | cta_type(`buy_store` / `reservation`), artisan_id, utm_source |

- 이벤트는 반드시 `src/lib/analytics/track()`을 통해서만 보낸다. 이벤트 이름과 파라미터는 타입으로 고정한다.
- 완청률은 25/50/75/100% 지점에서 한 번씩만 보낸다.

## 8. 오디오 규격

- 포맷: AAC(m4a) 또는 MP3, **모노, 64~96kbps**. 음성이라 이 정도면 충분하다. 1분에 약 0.5~0.7MB.
- 파일명: `audio/{owner_type}/{slug}/{locale}/{nn}-{name}.m4a`
- `preload="metadata"`로 설정하고, 재생 버튼을 누르기 전에는 본문을 받지 않는다(egress 절감).
- 스토리지는 HTTP Range 요청을 지원해야 한다(iOS Safari 시크에 필요).
- `Cache-Control: public, max-age=31536000, immutable`. 파일을 교체할 때는 경로를 바꾼다(버전 suffix).

## 9. 명령어

```bash
pnpm dev              # 로컬 개발 (http://localhost:3100 → /ko, 3000은 다른 프로젝트가 사용)
pnpm build            # 프로덕션 빌드
pnpm lint             # eslint
pnpm typecheck        # next typegen + tsc (PageProps 등 전역 타입 생성 포함)
pnpm format           # prettier (+ tailwind 클래스 정렬)
pnpm test             # vitest 단위 테스트
pnpm test:e2e         # playwright (최초 1회: pnpm exec playwright install)
pnpm db:start         # 로컬 Supabase (Docker 필요)
pnpm db:reset         # 로컬 DB 초기화 + 마이그레이션 + seed
pnpm db:new <name>    # 새 마이그레이션 파일
pnpm db:types         # 원격 프로젝트 타입 생성 (먼저 pnpm exec supabase link)
pnpm db:types:local   # 로컬 DB 타입 생성
```

- 작업 완료 전 최소 `pnpm lint && pnpm typecheck && pnpm test`를 통과시킨다.
- 환경변수는 `.env.example`을 복사해 `.env.local`로 만든다. Supabase 미설정 상태에서도 빌드·페이지 렌더는 된다(QR은 홈으로 리다이렉트).

## 10. 코딩 컨벤션

- 기본은 Server Component다. `"use client"`는 상호작용이 필요한 리프 컴포넌트에만 붙인다.
- Supabase secret 키(`SUPABASE_SECRET_KEY`)는 `src/lib/supabase/admin.ts`에서만 쓰고, 클라이언트 번들에 절대 포함하지 않는다.
- 공개 콘텐츠 조회는 `createPublicClient()`(쿠키 미사용)로 한다. `createSupabaseServerClient()`는 쿠키를 읽어 페이지를 동적으로 만들므로 관리자·폼에서만 쓴다.
- 링크·리다이렉트는 `next/link`가 아니라 `@/i18n/navigation`의 `Link`/`redirect`를 쓴다(locale 유지).
- 모든 `[locale]` 페이지·레이아웃은 `setRequestLocale(locale)`을 호출한다(정적 렌더링 유지).
- 환경변수: `NEXT_PUBLIC_*`에는 공개해도 되는 값만 넣는다. `.env.local`은 커밋 금지, `.env.example`은 유지한다.
- 이미지: `next/image` 대신 **업로드 시점에 WebP로 리사이즈**해서 저장한다(Vercel 이미지 최적화 과금 회피). 자세한 내용은 storage-decision 참고.
- 커밋 메시지: `feat|fix|chore|docs|refactor(scope): 요약` (한국어 가능)

## 11. 마일스톤 (RFP §8)

1. 사이트 구조·디자인 시안 확정
2. 메인홈 / 종목 / 장인 페이지 + 도슨트 플레이어
3. 지역 / 소개 / 문의 / 신청 + QR 라우팅
4. 현장 QR 테스트 + 트래킹 검수 → 배포

## 12. 현재 확보 콘텐츠

| 종목 | 지역 | 장인 |
|---|---|---|
| 두석장 | 통영 | 김진환 |
| 칠장(옻칠) | 통영 | 천기영 |
| 소목장·나전장·부채장·누비장·옹기장 | 통영 | 섭외 예정 |
| 매듭장 | 마산 | 섭외 예정 |

- 2026-09-28: 통영 장인 대상 AI 도슨트 사업설명회가 있다. 이후 장인이 늘어날 예정이다.
