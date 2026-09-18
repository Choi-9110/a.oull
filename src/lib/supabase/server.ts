import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/** 로그인 세션이 필요한 서버 코드(관리자, Server Action)용. 호출하면 해당 요청은 동적 렌더링된다. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component에서 호출된 경우 쿠키를 쓸 수 없다. 세션 갱신은 proxy/Server Action에서 처리된다.
        }
      },
    },
  });
}
