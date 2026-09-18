import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { supabaseUrl } from "./env";

/**
 * RLS를 우회하는 secret key 클라이언트. 서버 전용.
 * 관리자 권한 확인을 마친 코드 경로에서만 사용한다.
 */
export function createSupabaseAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set");

  return createClient<Database>(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
