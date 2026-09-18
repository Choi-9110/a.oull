import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A.OULL 관리자",
  robots: { index: false, follow: false },
};

// F-11 관리자 CMS (한국어 전용). 인증 가드는 로그인 기능 구현 시 추가한다.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="text-fg min-h-dvh bg-white antialiased">{children}</body>
    </html>
  );
}
