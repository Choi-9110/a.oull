import { z } from "zod";
import { routing } from "@/i18n/routing";

/**
 * 행동 데이터 이벤트 스펙 (docs/features.md §2). 클라이언트·서버(/api/track)가 같은 스키마를 쓴다.
 * 개인정보(이름·연락처)는 절대 이벤트에 넣지 않는다.
 */
export const EVENT_TYPES = [
  "session_start",
  "page_view",
  "page_leave",
  "docent_play",
  "docent_pause",
  "docent_progress",
  "docent_complete",
  "docent_abandon",
  "docent_seek",
  "docent_locale",
  "store_click",
  "reservation_start",
  "reservation_submit",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const id = z.string().max(80);

export const eventSchema = z.object({
  type: z.enum(EVENT_TYPES),
  /** 클라이언트 기준 발생 시각 (ms) */
  at: z.number().int().positive(),
  path: z.string().max(300),
  locale: z.enum(routing.locales).optional(),
  artisan: id.optional(),
  craft: id.optional(),
  track: id.optional(),
  /** 도슨트 재생 위치(초) */
  position: z.number().min(0).max(36000).optional(),
  /** 이번 재생 구간에서 실제로 들은 누적 시간(초) */
  listened: z.number().min(0).max(36000).optional(),
  /** 진행률 (25/50/75/100) */
  progress: z.number().int().min(0).max(100).optional(),
  /** 페이지 체류 시간(초) · 스크롤 깊이(%) */
  dwell: z.number().min(0).max(86400).optional(),
  scroll: z.number().int().min(0).max(100).optional(),
  props: z
    .record(z.string(), z.union([z.string().max(300), z.number(), z.boolean()]))
    .optional(),
});

export type TrackEvent = z.infer<typeof eventSchema>;

export const sessionSchema = z.object({
  visitorId: z.uuid(),
  sessionId: z.uuid(),
  /** 새 세션이면 진입 정보 포함 */
  entry: z
    .object({
      type: z.enum(["qr", "utm", "referral", "direct"]),
      qr: id.optional(),
      utmSource: z.string().max(100).optional(),
      utmMedium: z.string().max(100).optional(),
      utmCampaign: z.string().max(100).optional(),
      referrer: z.string().max(300).optional(),
      landing: z.string().max(300),
      os: z.string().max(20),
      browser: z.string().max(20),
      inApp: z.string().max(20).optional(),
    })
    .optional(),
});

export const trackPayloadSchema = sessionSchema.extend({
  events: z.array(eventSchema).min(1).max(50),
});

export type TrackPayload = z.infer<typeof trackPayloadSchema>;
