/**
 * 분석 이벤트 (RFP §6 퍼널 4단계). 모든 이벤트는 반드시 track()을 통해서만 보낸다.
 * GA4(gtag)가 로드돼 있으면 전송하고, 없으면 개발 환경에서만 콘솔에 남긴다.
 */
export type AnalyticsEvent =
  | {
      name: "qr_scan_entry";
      params: {
        qr_code: string;
        artisan_id?: string;
        craft_id?: string;
        locale: string;
        device_os?: string;
      };
    }
  | {
      name: "content_engagement";
      params: { page_type: string; dwell_time_sec: number; scroll_depth: number };
    }
  | {
      name: "audio_docent_action";
      params: {
        play_action: "play" | "pause" | "seek" | "complete" | "locale_change";
        track_id: string;
        locale: string;
        completion_rate?: 25 | 50 | 75 | 100;
      };
    }
  | {
      name: "conversion_cta_click";
      params: {
        cta_type: "buy_store" | "reservation";
        artisan_id?: string;
        utm_source?: string;
      };
    };

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

type EventName = AnalyticsEvent["name"];
type ParamsOf<N extends EventName> = Extract<AnalyticsEvent, { name: N }>["params"];

export function track<N extends EventName>(name: N, params: ParamsOf<N>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (gtag) {
    gtag("event", name, params);
  } else if (process.env.NODE_ENV === "development") {
    console.debug("[track]", name, params);
  }
}
