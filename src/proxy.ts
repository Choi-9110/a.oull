import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateAdminSession } from "./lib/supabase/proxy";

// Next.js 16: middleware → proxy.
// - 공개 페이지: next-intl locale 협상
// - /admin: Supabase 세션 쿠키 갱신 + 비로그인 시 로그인 페이지로 (최종 권한 확인은 서버에서)
// - /q(QR 진입), /api, 정적 파일은 통과
const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) return updateAdminSession(request);
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|q/|_next|_vercel|.*\\..*).*)"],
};
