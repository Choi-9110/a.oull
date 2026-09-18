import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: middleware → proxy. 공개 페이지의 locale 협상만 담당한다.
// /admin(관리자), /q(QR 진입), /api 는 locale 프리픽스 없이 동작한다.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|admin|q/|_next|_vercel|.*\\..*).*)"],
};
