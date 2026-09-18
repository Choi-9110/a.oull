# 미디어 스토리지 의사결정 (도슨트 오디오 · 이미지)

> 작성: 2026-09-18 · 상태: **제안 (확정 전)**
> 가격 출처: 각 사의 공식 가격 페이지(2026-09-18 조회). 환율은 약 ₩1,400/USD로 계산했다.

## TL;DR

**권장 구성: DB·Auth는 Supabase, 공개 미디어(오디오·이미지)는 Cloudflare R2.**

- 이 서비스에서 트래픽이 늘면 비용이 커지는 곳은 **오디오 전송량(egress)** 이다. R2는 egress가 **무료**라서 방문자가 몇 명이든 미디어 비용이 거의 $0이다.
- Supabase Free는 **1주일 동안 활동이 없으면 프로젝트가 일시정지된다.** 페이지를 SSG로 만들면 DB 호출이 거의 없어서 멈추기 쉽고, 미디어까지 Supabase에 있으면 **현장에서 오디오가 전부 안 나오는 사고**로 이어진다. 미디어를 R2로 분리하면 이 위험이 없다.
- 전제 조건: R2 커스텀 도메인은 Cloudflare에 등록된 도메인이어야 한다. `aoull.com`을 옮기기 부담스러우면 **미디어 전용 도메인을 따로 하나** Cloudflare에서 사면 된다(연 $10 안팎). 그러면 `aoull.com`은 건드리지 않아도 된다(§3-1).

### 업데이트 (2026-09-18): R2가 아니면 비용이 크게 늘까?

**크게 늘지 않는다. 차이는 월 약 $25(약 3.5만 원)이다.**

- R2 없이 Supabase Storage만 쓰면 현장 오픈 시점에 **Supabase Pro($25)** 가 필요하다(일시정지와 5GB egress 한도 때문).
- 그런데 Pro는 문의·예약 데이터 백업과 일시정지 방지 때문에 **어차피 언젠가 올려야 하는 플랜**이다. Pro에는 egress 250GB + 캐시 egress 250GB가 포함되어 있어서, 월 방문 약 15만 명까지 스토리지 추가 비용이 사실상 0이다.
- 즉 **R2는 "Supabase Free를 오래 버티고 싶을 때" 월 $25를 아끼는 선택지**다. 규모가 커서 비용이 폭발하는 문제를 막으려는 목적이 아니다.

**그래서 진행 방식은 이렇게 한다:**
1. 개발은 **Supabase Storage로 시작한다**(추가 설정 0, `STORAGE_DRIVER=supabase`).
2. 현장 오픈 직전에 선택한다: **(A) Supabase Pro로 간다(월 $45, 가장 단순)** 또는 **(B) 미디어를 R2로 옮긴다(월 $20, 가장 저렴)**
3. 스토리지 어댑터가 있으니 (B)로 가도 드는 작업은 파일 복사 + 환경변수 변경 정도다.

---

## 1. 우리 워크로드 추정

### 저장 용량 (작다)

| 항목 | 계산 | 용량 |
|---|---|---|
| 장인 도슨트 | 장인 8명 × 3개 언어 × 트랙 4개 × 1.5MB | ≈ 150MB |
| 종목 해설 | 종목 8개 × 3개 언어 × 트랙 2개 × 1.5MB | ≈ 70MB |
| 이미지 (WebP, 3개 사이즈) | 페이지 약 30개 × 이미지 10장 × 3개 사이즈 × 150KB | ≈ 135MB |
| **합계** | | **< 0.5GB** (장인 20명으로 늘어도 1~2GB) |

> 오디오는 음성용 규격(모노 64~96kbps)으로 계산했다. 1분당 약 0.5MB, 3분 도슨트 1개가 약 1.5MB다.
> 원본 마스터(WAV 등)는 공개 버킷에 두지 않는다(아래 §5).

### 전송량 (여기서 비용이 결정된다)

방문 1회 기준: 도슨트 1~2개 재생(약 2MB) + 이미지(약 1MB) ≈ **3MB**

| 시나리오 | 월 방문 | 월 미디어 전송량 |
|---|---|---|
| S — 파일럿 (통영 1곳) | 3,000 | ≈ 9GB |
| M — 정식 운영 | 20,000 | ≈ 60GB |
| L — 확장 (관광 시즌·다지점) | 100,000 | ≈ 300GB |

## 2. 후보 비교

| | **Supabase Storage** | **Cloudflare R2** | AWS S3 + CloudFront | Vercel Blob |
|---|---|---|---|---|
| 무료 저장 | 1GB | **10GB** | 없음 ($0.023/GB) | 1GB (Hobby) |
| 무료 전송 | egress 5GB + cached 5GB | **무제한 (egress $0)** | CloudFront 무료 한도 내 | 10GB (Hobby) |
| 유료 전환 시 | Pro $25/월: 저장 100GB, egress 250GB + cached 250GB 포함. 초과 시 egress $0.09/GB, cached $0.03/GB | 저장 $0.015/GB, 읽기 $0.36/100만 건 (월 1,000만 건 무료) | 사용량 과금 | Vercel Pro 필요, 전송은 Flat Rate CDN 요금제에 포함 |
| 무료 플랜 제약 | ⚠️ 1주 비활성 시 **프로젝트 일시정지**, 업로드 파일당 50MB | r2.dev 주소는 속도 제한이 있어 개발용. 운영에는 커스텀 도메인 필요 | — | ⚠️ Hobby는 **비상업용만 허용** |
| CDN | 기본 CDN (Smart CDN은 Pro부터) | Cloudflare 캐시 (커스텀 도메인 사용 시) | CloudFront | Vercel CDN |
| Range 요청 (iOS 시크) | ✅ | ✅ | ✅ | ✅ |
| 이미지 변환 | Pro부터 (원본 100장 포함, 이후 1,000장당 $5) | 없음 (업로드 시 직접 리사이즈) | 없음 | 없음 |
| 권한 연동 | ✅ Supabase Auth + RLS로 업로드 정책 작성 | 서버에서 presigned URL 발급 | presigned URL | 서버 토큰 |
| 설정 난이도 | ⭐ 가장 쉬움 (이미 쓰는 스택) | ⭐⭐ 버킷 + 도메인 연결 | ⭐⭐⭐ IAM·OAC·배포 설정 | ⭐ 쉬움 |
| 벤더 수 | 1개 (Supabase에 통합) | +1개 (Cloudflare) | +1개 (AWS) | Vercel에 통합 |

### 시나리오별 월 미디어 비용

| | S (9GB) | M (60GB) | L (300GB) |
|---|---|---|---|
| Supabase Free | $0 (한도에 거의 닿음) | ❌ 한도 초과 → 서비스 제한 | ❌ |
| Supabase Pro | $25 | $25 | ≈ $25 (대부분 캐시 적중 가정) |
| **Cloudflare R2** | **$0** | **$0** | **$0** |
| S3 + CloudFront | ≈ $0 | ≈ $0 ~ 소액 | 소액 (요금제 확인 필요) |
| Vercel Blob | Hobby 불가 (상업용) → Pro에 포함 | Pro에 포함 (Flat Rate 등급 확인 필요) | 등급 상향 가능성 |

> S3 + CloudFront도 비용은 저렴하다. 다만 설정·운영 복잡도가 가장 높고 1인 운영에 맞지 않아 제외했다.
> Vercel Blob은 어차피 Vercel Pro를 쓴다면 괜찮은 선택지다. 하지만 CDN Flat Rate 등급 구조가 트래픽에 따라 바뀌어 예측하기 어렵다.

## 3. 결론 및 단계별 구성

| 단계 | 구성 | 월 고정비 |
|---|---|---|
| **개발 ~ 파일럿 전** | Supabase Free (DB·Auth) + **R2** (미디어) + Vercel Hobby (개발·프리뷰만) | **$0** |
| **현장 오픈 (상업 운영)** | Supabase Free + keep-alive 크론 + 주간 백업 / R2 / **Vercel Pro** | **≈ $20 (약 2.8만 원)** |
| **확장 / 데이터 중요도 상승** | **Supabase Pro** (일시정지 없음, 일일 백업, spend cap) / R2 / Vercel Pro | **≈ $45 (약 6.3만 원)** |

- 미디어를 R2에 두면 **트래픽이 늘어도 고정비가 거의 변하지 않는다.** 비용이 늘어나는 계기는 "DB 안정성이 필요해질 때(Supabase Pro)" 한 가지뿐이다.
- 문의·예약 데이터가 쌓이기 시작하면 Supabase Free에는 **자동 백업이 없다**는 점을 기억해야 한다. 늦어도 이 시점에는 Pro 전환을 권장한다.

### 3-1. R2 도메인 선택지

| 방법 | 비용 | 난이도 | 비고 |
|---|---|---|---|
| `aoull.com` 네임서버를 Cloudflare로 이전 | $0 | 중간 | 기존 홈페이지·메일(MX) 레코드를 빠짐없이 옮겨야 한다 |
| **미디어 전용 도메인 새로 구매** (Cloudflare Registrar) | 연 $10 안팎 | 쉬움 | `aoull.com`은 그대로 두고 예: `media.aoull-cdn.com` |
| Cloudflare CNAME(부분) 설정 | Business 플랜 필요 | — | 비용 때문에 제외 |
| r2.dev 주소 사용 | $0 | 쉬움 | ❌ 속도 제한이 있는 개발용이라 운영 불가 |

### 차선책 (R2를 쓰지 않는 경우)

Supabase Storage만 쓴다. 이 경우 **현장 오픈 시점에 Supabase Pro 전환이 필수**다(일시정지·5GB egress 한도 때문). 월 고정비는 $45가 된다.
코드는 `src/lib/storage/` 어댑터를 거쳐서만 스토리지에 접근하고 DB에는 경로만 저장한다. 그래서 나중에 R2로 옮길 때 드는 비용은 **파일 복사 + 환경변수 변경**뿐이다.

## 4. R2 구성 설계

```
버킷
├─ aoull-media    (공개, 커스텀 도메인 media.aoull.com)
│  ├─ audio/{owner_type}/{slug}/{locale}/{nn}-{name}.v{n}.m4a
│  └─ images/{owner_type}/{slug}/{name}.{480|960|1440}.webp
└─ aoull-masters  (비공개, 공개 도메인 없음) — 원본 WAV, 원본 사진 백업
```

- **업로드 흐름:** 관리자 로그인(Supabase Auth) → `/api/upload-url`에서 세션·관리자 권한 확인 → R2 presigned PUT URL 발급(5분 만료, content-type·용량 제한) → 브라우저가 R2에 직접 업로드 → `media_assets`에 경로 저장 → on-demand revalidate
- **캐시:** `Cache-Control: public, max-age=31536000, immutable`. 파일을 교체할 때는 `.v{n}`을 올려 경로를 바꾼다(캐시 무효화 작업 불필요).
- **CORS:** GET은 `https://aoull.com`, `https://*.vercel.app`(프리뷰)에서 허용. PUT은 관리자 도메인에서만 허용.
- **Cloudflare 캐시:** 커스텀 도메인에서 m4a/mp3가 캐시되도록 Cache Rule을 추가하고 Tiered Cache를 켠다.
- R2 Access Key는 서버 환경변수(`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`)에만 둔다. `NEXT_PUBLIC_`에 넣지 않는다.

## 5. 이미지 처리 방침

- Vercel 이미지 최적화는 Hobby에서 월 5,000건 변환 한도가 있고, Pro에서는 1,000건당 $0.05가 과금된다. 그래서 쓰지 않는다.
- **업로드 시점에 리사이즈**한다. 관리자 화면에서 브라우저 캔버스로 480/960/1440px WebP를 만들어 업로드한다. 필요하면 서버에서 `sharp`로 처리한다.
- 렌더링은 `<img srcset>` 또는 `next/image`에 커스텀 loader(`unoptimized`)를 쓴다.

## 6. 비용 안전장치

| 서비스 | 장치 |
|---|---|
| Vercel Pro | Spend Management에서 예산 설정(기본 $200 → **$50 정도로 낮추기**), 초과 시 알림과 프로젝트 일시정지 |
| Supabase Pro | Spend cap 켜기(기본값 ON 유지) |
| Cloudflare R2 | 자체 지출 상한이 없다 → Billing 알림 설정. egress가 무료라 급증 위험은 **키 유출에 의한 쓰기(Class A) 남용**뿐이다. 키를 최소 권한(해당 버킷만)으로 발급한다 |

## 7. 확정 전에 필요한 결정

- [ ] `aoull.com` 도메인은 현재 어디서 관리하고 있나? (기존 홈페이지·메일 레코드 확인 후 Cloudflare 네임서버로 이전 가능한지)
- [ ] 현장 오픈 목표일 → Vercel Pro 전환 시점
- [ ] 문의·예약 데이터 보존 정책 → Supabase Pro 전환 시점
- [ ] 오디오 원본 전달 형식(보이스 클로닝 툴 출력 포맷)
