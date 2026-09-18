import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { button } from "@/components/ui/primitives";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "로그인" };

// A-01 관리자 로그인 — 회원가입 없음 (계정은 Supabase에서 초대로만 생성)
export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const forbidden = sp.error === "forbidden";

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-sm border border-jae bg-baekja p-8">
        <p className="wordmark text-xl">A.OULL</p>
        <h1 className="mt-6 font-serif text-heading font-semibold">관리자 로그인</h1>
        <p className="mt-1 text-caption text-mukhoe">
          초대받은 계정으로만 로그인할 수 있습니다.
        </p>

        {forbidden && (
          <p role="alert" className="mt-4 text-caption font-bold text-onggi">
            관리자 권한이 없는 계정입니다.
          </p>
        )}

        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <p className="rounded-card bg-hanji p-4 text-caption text-mukhoe">
              <strong className="text-meok">데모 모드</strong> — 아직 Supabase가 연결되지
              않아 실제 로그인은 비활성화되어 있습니다. 연결 후에는 이메일·비밀번호로
              로그인합니다.
            </p>
            <Link href="/admin" className={`${button.base} ${button.solid}`}>
              데모로 둘러보기
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
