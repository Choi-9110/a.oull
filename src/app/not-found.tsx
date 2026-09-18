import Link from "next/link";

// locale 밖 경로의 404. locale 안의 404는 [locale]/not-found.tsx가 처리한다.
export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body className="bg-bg text-fg flex min-h-dvh flex-col items-center justify-center gap-4">
        <p className="text-lg">페이지를 찾을 수 없습니다.</p>
        <Link href="/" className="underline">
          홈으로
        </Link>
      </body>
    </html>
  );
}
