import { NextResponse, type NextRequest } from "next/server";
import { negotiateLocale } from "@/lib/i18n/negotiate-locale";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// F-09 QR 다이렉트 라우팅
// 인쇄된 QR: https://aoull.com/q/{code} → qr_codes 조회 → /{locale}/artisans/{slug}?src=qr&qr={code}
// 없거나 비활성인 코드는 404 대신 메인홈으로 보낸다. qr_scan_entry 이벤트는 도착 페이지에서 전송한다.
export async function GET(request: NextRequest, ctx: RouteContext<"/q/[code]">) {
  const { code } = await ctx.params;
  const locale = negotiateLocale(request.headers.get("accept-language"));
  const home = new URL(`/${locale}`, request.url);

  if (!isSupabaseConfigured) return NextResponse.redirect(home);

  const supabase = createPublicClient();
  const { data: qr } = await supabase
    .from("qr_codes")
    .select("target_type, target_id")
    .eq("code", code)
    .maybeSingle();

  if (!qr || qr.target_type !== "artisan") return NextResponse.redirect(home);

  const { data: artisan } = await supabase
    .from("artisans")
    .select("slug")
    .eq("id", qr.target_id)
    .maybeSingle();

  if (!artisan) return NextResponse.redirect(home);

  const target = new URL(`/${locale}/artisans/${artisan.slug}`, request.url);
  target.searchParams.set("src", "qr");
  target.searchParams.set("qr", code);
  return NextResponse.redirect(target);
}
