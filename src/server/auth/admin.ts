import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSession =
  { mode: "demo" } | { mode: "live"; userId: string; email: string | null };

/**
 * 관리자 권한 확인 (서버 레이아웃·Server Action에서 호출)
 * - Supabase 연결 전: 데모 모드 — 저장 기능 없이 화면만 확인 (지킬 데이터가 없음)
 * - 연결 후: 로그인 + admins 테이블 등록 사용자만 통과, 아니면 로그인 페이지로
 */
export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured) return { mode: "demo" };

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=forbidden");

  return { mode: "live", userId: data.user.id, email: data.user.email ?? null };
}
