import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * 쿠키를 읽지 않는 공개 콘텐츠 조회용 클라이언트.
 * 공개 페이지를 정적(SSG/ISR)으로 유지하려면 콘텐츠 조회는 반드시 이 클라이언트를 쓴다.
 */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
