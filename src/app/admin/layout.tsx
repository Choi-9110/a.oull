import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { fontVariables } from "../fonts";

export const metadata: Metadata = {
  title: { default: "A.OULL 관리자", template: "%s · A.OULL 관리자" },
  robots: { index: false, follow: false },
};

// F-11 관리자 (한국어 전용, 공개 사이트와 별도 <html>)
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={fontVariables}>
      <body className="min-h-dvh bg-hanji text-meok antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
