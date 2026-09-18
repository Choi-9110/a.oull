# 프로젝트 에이전트 구성안

> 작성: 2026-09-18 · 상태: **필수 4개 생성 완료** (`.claude/agents/`), 선택 2개는 보류
> 원칙: 에이전트가 많으면 호출이 헷갈리고 결과가 서로 충돌한다. **전역 에이전트는 최대한 재사용하고, 이 프로젝트에만 필요한 전문성만 새로 만든다.**

## 1. 기존 전역 에이전트 적합도 (`~/.claude/agents/`)

| 에이전트 | 이 프로젝트 적합도 | 판단 |
|---|---|---|
| `ag_ops_infra` | ✅ 높음 | Supabase·Vercel·도메인·배포 담당. **그대로 사용** |
| `ag_ops_security` | ✅ 높음 | RLS, 폼 스팸, 관리자 인증, 개인정보 점검. **그대로 사용** |
| `ag_ops_crypto-env` | ✅ 중간 | R2 키·Supabase 키·env 관리. **그대로 사용** |
| `ag_biz_korean-psych` | ✅ 중간 | CTA 문구, 체험 예약 전환 카피 담당. **그대로 사용** |
| `ag_biz_bm` / `ag_biz_research` / `ag_qa_devils-advocate` | 🔸 필요할 때만 | 전환 전략·지원사업 논의가 있을 때 |
| `ag_dev_app-designer` | 🔸 부분 적합 | 모바일 UX 감각은 맞지만 결과물이 Flutter 코드 중심이다 → 웹용 에이전트 신규 생성 |
| `ag_dev_flutter` / `ag_dev_nestjs` / `ag_qa_test` | ❌ 사용 안 함 | 스택 불일치 (Flutter / NestJS / Flutter 테스트) |

## 2. 신규 생성 제안 (프로젝트 전용, `.claude/agents/`)

### 필수 4개

| 이름 | 역할 | 담당 기능 |
|---|---|---|
| **`ag_dev_nextjs`** | Next.js App Router 개발. SSG/ISR·on-demand revalidate, next-intl 다국어, Server Actions, PWA(앱처럼 보이는 셸), **도슨트 오디오 플레이어** | F-01~F-10 |
| **`ag_dev_supabase`** | 스키마·마이그레이션·RLS·시드, 스토리지 어댑터(R2 presigned / Supabase Storage), 타입 생성, 관리자 Auth | F-11, 데이터 모델 |
| **`ag_dev_web-designer`** | 모바일 웹 UI/UX. 앱 같은 셸(탭바·전환·safe-area), 전통공예 톤앤매너 디자인 토큰, Tailwind 컴포넌트, 접근성 | 전 화면 |
| **`ag_qa_web`** | Playwright 모바일 E2E(iPhone Safari / Android Chrome 뷰포트), **QR 진입 → 탭 재생 → CTA 전환** 시나리오, Lighthouse·저속 네트워크(3G) 성능 점검, 오디오 Range·시크 검증 | 전체 QA |

### 선택 2개 (필요해지면 추가)

| 이름 | 역할 | 추가 시점 |
|---|---|---|
| `ag_data_analytics` | GA4 이벤트 스펙·퍼널 리포트, 완청률 계산, UTM·QR 코드 설계, 전환 분석 | 현장 오픈 직전. 그 전에는 `ag_dev_nextjs`가 `track()`만 구현 |
| `ag_content_i18n` | ko/ja/zh 번역 품질, 공예 용어집(두석·옻칠·나전 등 고유명사 표기 통일), 도슨트 스크립트 교정, AI 음성 고지 문구 | 번역 원고가 들어오기 시작할 때 |

## 3. 협업 흐름 예시

```
새 장인 페이지 기능
  ag_dev_web-designer  → 화면 설계·토큰
  ag_dev_supabase      → 테이블·RLS·시드
  ag_dev_nextjs        → 페이지·플레이어·CTA 구현
  ag_qa_web            → 모바일 E2E·성능
  ag_ops_security      → 배포 전 점검 (RLS·폼·키)
```

## 4. 에이전트 공통 규칙 (각 에이전트 프롬프트에 포함)

- 작업 시작 전에 `CLAUDE.md`와 관련 `docs/*.md`를 먼저 읽는다.
- 스토리지 접근은 `src/lib/storage/` 어댑터를 통해서만 한다. DB에는 경로만 저장한다.
- 이벤트 전송은 `src/lib/analytics/track()`을 통해서만 한다.
- 사용자 노출 문자열은 `src/messages/{ko,ja,zh}.json`에 둔다(하드코딩 금지).
- 한국어로 보고한다.
