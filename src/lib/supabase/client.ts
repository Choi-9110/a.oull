"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/** 브라우저용 (관리자 화면의 로그인·업로드). */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
