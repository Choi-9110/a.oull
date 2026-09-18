/**
 * 익명 방문자·세션 식별 (docs/features.md §2-1)
 * - visitor_id: 기기 단위, 1년 보관 (재방문 분석용)
 * - session_id: 30분 무활동 시 새로 발급 (GA와 같은 기준)
 * 개인정보는 담지 않는다. 저장소 접근이 막힌 환경(시크릿 모드 등)에서는 메모리로 대체한다.
 */
import type { TrackPayload } from "./events";

const VISITOR_KEY = "aoull:vid";
const SESSION_KEY = "aoull:sid";
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

type StoredSession = { id: string; lastAt: number; announced: boolean };

const memory = new Map<string, string>();
const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
};

export function getVisitorId(): string {
  let id = store.get(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    store.set(VISITOR_KEY, id);
  }
  return id;
}

/** 현재 세션을 가져오거나(만료 시) 새로 만든다. isNew면 진입 정보를 함께 보내야 한다. */
export function touchSession(now = Date.now()): { id: string; isNew: boolean } {
  const raw = store.get(SESSION_KEY);
  let s: StoredSession | null = null;
  try {
    s = raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    s = null;
  }
  const expired = !s || now - s.lastAt > SESSION_TIMEOUT_MS;
  const next: StoredSession = expired
    ? { id: crypto.randomUUID(), lastAt: now, announced: false }
    : { ...s!, lastAt: now };
  const isNew = !next.announced;
  next.announced = true;
  store.set(SESSION_KEY, JSON.stringify(next));
  return { id: next.id, isNew };
}

/** 세션 진입 정보 (첫 이벤트에만 첨부) */
export function readEntry(): NonNullable<TrackPayload["entry"]> {
  const url = new URL(window.location.href);
  const p = url.searchParams;
  const ref =
    document.referrer && !document.referrer.startsWith(url.origin)
      ? document.referrer
      : "";
  const type =
    p.get("src") === "qr"
      ? "qr"
      : p.get("utm_source")
        ? "utm"
        : ref
          ? "referral"
          : "direct";
  const ua = navigator.userAgent;

  return {
    type,
    qr: p.get("qr") ?? undefined,
    utmSource: p.get("utm_source") ?? undefined,
    utmMedium: p.get("utm_medium") ?? undefined,
    utmCampaign: p.get("utm_campaign") ?? undefined,
    referrer: ref ? ref.slice(0, 300) : undefined,
    landing: (url.pathname + url.search).slice(0, 300),
    os: /iphone|ipad|ipod/i.test(ua)
      ? "ios"
      : /android/i.test(ua)
        ? "android"
        : /windows/i.test(ua)
          ? "windows"
          : /mac os/i.test(ua)
            ? "macos"
            : "other",
    browser: /samsungbrowser/i.test(ua)
      ? "samsung"
      : /crios|chrome/i.test(ua)
        ? "chrome"
        : /fxios|firefox/i.test(ua)
          ? "firefox"
          : /safari/i.test(ua)
            ? "safari"
            : "other",
    // QR 스캔 시 카카오톡·네이버 앱 안에서 열리는 경우가 많아 따로 본다
    inApp: /kakaotalk/i.test(ua)
      ? "kakaotalk"
      : /naver\(inapp/i.test(ua)
        ? "naver"
        : /instagram/i.test(ua)
          ? "instagram"
          : undefined,
  };
}

/** 현재 세션 ID (예약과 행동 데이터를 연결할 때 사용). 세션을 새로 만들지 않는다. */
export function peekSessionId(): string | undefined {
  try {
    const raw = store.get(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession).id : undefined;
  } catch {
    return undefined;
  }
}
