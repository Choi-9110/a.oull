# A.OULL (아울)

전통공예 장인의 목소리로 듣는 **AI 음성 도슨트 모바일 웹앱**.
전시장 QR → 장인 페이지 → 도슨트 청취 → 구매 · 체험 예약.

- 스택: Next.js 16 · React 19 · Tailwind v4 · next-intl (ko/ja/zh) · Supabase · Vercel
- 프로젝트 규칙과 구조: [`CLAUDE.md`](./CLAUDE.md)
- 스토리지 결정: [`docs/storage-decision.md`](./docs/storage-decision.md)

## 시작하기

```bash
pnpm install
cp .env.example .env.local   # Supabase 키 입력 (없어도 화면은 뜸)
pnpm dev                     # http://localhost:3000
```

## 검증

```bash
pnpm lint && pnpm typecheck && pnpm test
```
