import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { TrackPayload } from "@/lib/analytics/events";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * 행동 데이터 저장소.
 * - Supabase 연결 전: 로컬 파일(.data/events.ndjson)에 한 줄씩 기록한다. 개발·데모용이고 git에는 올라가지 않는다.
 * - Supabase 연결 후: visitors / sessions / events 테이블에 저장한다 (supabase/migrations 참고).
 */
export async function saveEvents(payload: TrackPayload, meta: { userAgent: string }) {
  if (isSupabaseConfigured && process.env.SUPABASE_SECRET_KEY) {
    return saveToSupabase(payload);
  }
  return saveToFile(payload, meta);
}

const FILE = path.join(process.cwd(), ".data", "events.ndjson");

async function saveToFile(payload: TrackPayload, meta: { userAgent: string }) {
  const receivedAt = new Date().toISOString();
  const lines = payload.events.map((e) =>
    JSON.stringify({
      receivedAt,
      visitorId: payload.visitorId,
      sessionId: payload.sessionId,
      ...(e.type === "session_start"
        ? { entry: payload.entry, ua: meta.userAgent.slice(0, 200) }
        : {}),
      ...e,
    }),
  );
  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    await appendFile(FILE, lines.join("\n") + "\n", "utf8");
  } catch {
    // 읽기 전용 파일시스템(서버리스 등)에서는 로그로만 남긴다
    console.info("[track]", lines.join("\n"));
  }
}

async function saveToSupabase(payload: TrackPayload) {
  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const db = createSupabaseAdminClient();
  const now = new Date().toISOString();

  await db.from("visitors").upsert(
    {
      id: payload.visitorId,
      last_seen_at: now,
      ...(payload.entry ? { os: payload.entry.os, browser: payload.entry.browser } : {}),
    },
    { onConflict: "id" },
  );

  if (payload.entry) {
    const e = payload.entry;
    await db.from("sessions").upsert(
      {
        id: payload.sessionId,
        visitor_id: payload.visitorId,
        entry_type: e.type,
        qr_code: e.qr ?? null,
        utm_source: e.utmSource ?? null,
        utm_medium: e.utmMedium ?? null,
        utm_campaign: e.utmCampaign ?? null,
        referrer: e.referrer ?? null,
        landing_path: e.landing,
        os: e.os,
        browser: e.browser,
        in_app: e.inApp ?? null,
        locale: payload.events[0]?.locale ?? null,
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
  }

  await db.from("sessions").update({ last_event_at: now }).eq("id", payload.sessionId);

  await db.from("events").insert(
    payload.events.map((e) => ({
      session_id: payload.sessionId,
      type: e.type,
      occurred_at: new Date(e.at).toISOString(),
      path: e.path,
      locale: e.locale ?? null,
      artisan: e.artisan ?? null,
      craft: e.craft ?? null,
      track: e.track ?? null,
      position_sec: e.position ?? null,
      listened_sec: e.listened ?? null,
      progress_pct: e.progress ?? null,
      dwell_sec: e.dwell ?? null,
      scroll_pct: e.scroll ?? null,
      props: e.props ?? {},
    })),
  );
}
