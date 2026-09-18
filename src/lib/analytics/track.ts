/**
 * 행동 데이터 전송. 모든 이벤트는 반드시 track()을 통해서만 보낸다. (CLAUDE.md §7, docs/features.md §2)
 * - 우리 DB(/api/track)가 원본. GA4(gtag)가 로드돼 있으면 보조로 같이 보낸다.
 * - 페이지 이탈 중에도 유실되지 않게 sendBeacon을 우선 사용한다.
 */
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { EventType, TrackEvent, TrackPayload } from "./events";
import { getVisitorId, readEntry, touchSession } from "./session";

export type TrackInput = Omit<TrackEvent, "type" | "at" | "path"> & {
  /** 기본은 현재 주소. 이탈 이벤트처럼 이전 페이지를 기록할 때만 지정 */
  path?: string;
};

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

const ENDPOINT = "/api/track";

export function track(type: EventType, input: TrackInput = {}) {
  if (typeof window === "undefined") return;

  const { id: sessionId, isNew } = touchSession();
  const lang = document.documentElement.lang;
  const locale = input.locale ?? (hasLocale(routing.locales, lang) ? lang : undefined);
  const event: TrackEvent = {
    ...input,
    type,
    at: Date.now(),
    path: (input.path ?? window.location.pathname).slice(0, 300),
    locale,
  };

  const events: TrackEvent[] =
    isNew && type !== "session_start"
      ? [{ type: "session_start", at: event.at, path: event.path, locale }, event]
      : [event];

  const payload: TrackPayload = {
    visitorId: getVisitorId(),
    sessionId,
    ...(isNew ? { entry: readEntry() } : {}),
    events,
  };
  send(payload);

  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", type, { ...input, locale });

  if (process.env.NODE_ENV === "development") console.debug("[track]", type, input);
}

function send(payload: TrackPayload) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" })))
      return;
  } catch {}
  fetch(ENDPOINT, {
    method: "POST",
    body,
    keepalive: true,
    headers: { "content-type": "application/json" },
  }).catch(() => {});
}
