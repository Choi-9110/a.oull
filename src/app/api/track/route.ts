import { NextResponse, type NextRequest } from "next/server";
import { trackPayloadSchema } from "@/lib/analytics/events";
import { saveEvents } from "@/server/analytics/store";

/**
 * 행동 데이터 수집 엔드포인트 (docs/features.md §2-1)
 * - 클라이언트는 DB에 직접 쓰지 않는다. 여기서 형식 검증 + 요청 제한 후 저장한다.
 * - sendBeacon은 응답을 보지 않으므로 항상 204로 빠르게 끝낸다.
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) return new NextResponse(null, { status: 429 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = trackPayloadSchema.safeParse(json);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  try {
    await saveEvents(parsed.data, { userAgent: request.headers.get("user-agent") ?? "" });
  } catch (err) {
    console.error("[track] save failed", err);
  }
  return new NextResponse(null, { status: 204 });
}

// 간이 요청 제한: IP당 1분에 120회 (서버리스 인스턴스 단위 — 남용 방지용 최소 장치)
const WINDOW_MS = 60_000;
const LIMIT = 120;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}
