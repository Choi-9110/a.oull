import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type FunnelStats = {
  source: "local" | "supabase";
  sessions: number;
  qrSessions: number;
  played: number;
  completed: number;
  abandoned: number;
  storeClicks: number;
  reservations: number;
  avgListenSec: number;
  byArtisan: {
    artisan: string;
    sessions: number;
    played: number;
    completed: number;
    store: number;
    reserved: number;
  }[];
  byLocale: { locale: string; sessions: number }[];
};

type Row = {
  sessionId: string;
  type: string;
  artisan?: string;
  locale?: string;
  listened?: number;
  entry?: { type: string };
};

/**
 * A-05 행동 데이터 퍼널 (docs/features.md §2-3)
 * 세션 단위로 "재생 → 완청 → 스토어/예약" 전환을 센다.
 */
export async function getFunnelStats(): Promise<FunnelStats> {
  if (isSupabaseConfigured && process.env.SUPABASE_SECRET_KEY) return fromSupabase();
  return fromLocalFile();
}

async function fromLocalFile(): Promise<FunnelStats> {
  let rows: Row[] = [];
  try {
    const text = await readFile(
      path.join(process.cwd(), ".data", "events.ndjson"),
      "utf8",
    );
    rows = text
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Row);
  } catch {
    rows = [];
  }
  return aggregate(rows, "local");
}

async function fromSupabase(): Promise<FunnelStats> {
  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const db = createSupabaseAdminClient();
  const since = new Date(Date.now() - 30 * 86400_000).toISOString();
  const [{ data: sessions }, { data: events }] = await Promise.all([
    db
      .from("sessions")
      .select("id, entry_type, locale")
      .gte("started_at", since)
      .limit(50_000),
    db
      .from("events")
      .select("session_id, type, artisan, locale, listened_sec")
      .gte("occurred_at", since)
      .in("type", [
        "docent_play",
        "docent_complete",
        "docent_abandon",
        "docent_pause",
        "store_click",
        "reservation_submit",
        "page_view",
      ])
      .limit(200_000),
  ]);
  const rows: Row[] = [
    ...(sessions ?? []).map((s) => ({
      sessionId: s.id,
      type: "session_start",
      locale: s.locale ?? undefined,
      entry: { type: s.entry_type },
    })),
    ...(events ?? []).map((e) => ({
      sessionId: e.session_id,
      type: e.type,
      artisan: e.artisan ?? undefined,
      locale: e.locale ?? undefined,
      listened: e.listened_sec ?? undefined,
    })),
  ];
  return aggregate(rows, "supabase");
}

function aggregate(rows: Row[], source: FunnelStats["source"]): FunnelStats {
  type S = {
    qr: boolean;
    locale?: string;
    played: boolean;
    completed: boolean;
    abandoned: boolean;
    store: boolean;
    reserved: boolean;
    listened: number;
  };
  const sessions = new Map<string, S>();
  const get = (id: string) => {
    let s = sessions.get(id);
    if (!s) {
      s = {
        qr: false,
        played: false,
        completed: false,
        abandoned: false,
        store: false,
        reserved: false,
        listened: 0,
      };
      sessions.set(id, s);
    }
    return s;
  };

  for (const r of rows) {
    const s = get(r.sessionId);
    if (r.type === "session_start") {
      s.qr = r.entry?.type === "qr";
      s.locale = r.locale;
    }
    if (r.type === "docent_play") s.played = true;
    if (r.type === "docent_complete") s.completed = true;
    if (r.type === "docent_abandon") s.abandoned = true;
    if (r.type === "store_click") s.store = true;
    if (r.type === "reservation_submit") s.reserved = true;
    if (["docent_pause", "docent_complete", "docent_abandon"].includes(r.type))
      s.listened += r.listened ?? 0;
  }

  const all = [...sessions.values()];
  const count = (f: (s: S) => boolean) => all.filter(f).length;
  const played = all.filter((s) => s.played);

  // 장인별: 그 장인에 대한 이벤트로만 판단 (한 세션이 여러 장인을 봐도 섞이지 않게)
  const perArtisan = new Map<
    string,
    Map<
      string,
      { played: boolean; completed: boolean; store: boolean; reserved: boolean }
    >
  >();
  for (const r of rows) {
    if (!r.artisan) continue;
    const bySession = perArtisan.get(r.artisan) ?? new Map();
    const f = bySession.get(r.sessionId) ?? {
      played: false,
      completed: false,
      store: false,
      reserved: false,
    };
    if (r.type === "docent_play") f.played = true;
    if (r.type === "docent_complete") f.completed = true;
    if (r.type === "store_click") f.store = true;
    if (r.type === "reservation_submit") f.reserved = true;
    bySession.set(r.sessionId, f);
    perArtisan.set(r.artisan, bySession);
  }
  const byArtisan: FunnelStats["byArtisan"] = [...perArtisan.entries()].map(
    ([artisan, m]) => {
      const v = [...m.values()];
      return {
        artisan,
        sessions: v.length,
        played: v.filter((x) => x.played).length,
        completed: v.filter((x) => x.completed).length,
        store: v.filter((x) => x.store).length,
        reserved: v.filter((x) => x.reserved).length,
      };
    },
  );

  const localeMap = new Map<string, number>();
  for (const s of all)
    localeMap.set(s.locale ?? "-", (localeMap.get(s.locale ?? "-") ?? 0) + 1);

  return {
    source,
    sessions: all.length,
    qrSessions: count((s) => s.qr),
    played: played.length,
    completed: count((s) => s.completed),
    abandoned: count((s) => s.abandoned),
    storeClicks: count((s) => s.store),
    reservations: count((s) => s.reserved),
    avgListenSec: played.length
      ? Math.round(played.reduce((n, s) => n + s.listened, 0) / played.length)
      : 0,
    byArtisan: byArtisan.sort((a, b) => b.sessions - a.sessions),
    byLocale: [...localeMap.entries()].map(([locale, sessions]) => ({
      locale,
      sessions,
    })),
  };
}
