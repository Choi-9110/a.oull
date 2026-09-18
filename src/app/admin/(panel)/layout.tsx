import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOut } from "@/server/actions/auth";
import { requireAdmin } from "@/server/auth/admin";

// 관리자 화면은 항상 요청 시점에 권한을 확인한다 (정적 생성 금지)
export const dynamic = "force-dynamic";

// 관리자 화면 공통: 권한 확인 + 상단 내비게이션
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-jae bg-baekja">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-5">
          <Link href="/admin" className="wordmark text-base">
            A.OULL{" "}
            <span className="ml-1 text-[11px] tracking-normal text-mukhoe">관리자</span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-3 text-label text-mukhoe">
            {session.mode === "demo" ? (
              <span className="rounded-btn bg-onggi-pale px-2 py-1 font-bold text-onggi">
                데모 모드
              </span>
            ) : (
              <span>{session.email}</span>
            )}
            <form action={signOut}>
              <button type="submit" className="min-h-10 underline underline-offset-2">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      {session.mode === "demo" && (
        <p className="border-b border-jae bg-onggi-pale px-5 py-2 text-center text-label text-onggi">
          Supabase 연결 전이라 저장되지 않습니다. 화면과 흐름 확인용입니다.
        </p>
      )}
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
