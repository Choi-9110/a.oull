// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { trackPayloadSchema } from "@/lib/analytics/events";
import { SESSION_TIMEOUT_MS, touchSession } from "@/lib/analytics/session";
import { withStoreTracking } from "@/lib/analytics/store-link";

describe("touchSession", () => {
  beforeEach(() => localStorage.clear());

  it("첫 호출은 새 세션, 30분 안의 다음 호출은 같은 세션", () => {
    const a = touchSession(1_000);
    const b = touchSession(1_000 + 60_000);
    expect(a.isNew).toBe(true);
    expect(b.isNew).toBe(false);
    expect(b.id).toBe(a.id);
  });

  it("30분 무활동 후에는 새 세션", () => {
    const a = touchSession(1_000);
    const b = touchSession(1_000 + SESSION_TIMEOUT_MS + 1);
    expect(b.isNew).toBe(true);
    expect(b.id).not.toBe(a.id);
  });
});

describe("trackPayloadSchema", () => {
  const base = {
    visitorId: "0b6b3f4e-9f6a-4a51-9d1e-6b1d6f1f2a10",
    sessionId: "5f0c2c55-0a57-4e4b-8f0b-2d7c7d9a2b11",
  };

  it("정상 이벤트는 통과", () => {
    const r = trackPayloadSchema.safeParse({
      ...base,
      events: [
        {
          type: "docent_pause",
          at: Date.now(),
          path: "/ko/artisans/kim-jinhwan",
          position: 12.3,
          listened: 11,
        },
      ],
    });
    expect(r.success).toBe(true);
  });

  it("알 수 없는 이벤트·너무 긴 값은 거부", () => {
    expect(
      trackPayloadSchema.safeParse({
        ...base,
        events: [{ type: "hack", at: 1, path: "/" }],
      }).success,
    ).toBe(false);
    expect(
      trackPayloadSchema.safeParse({
        ...base,
        events: [{ type: "page_view", at: 1, path: "x".repeat(400) }],
      }).success,
    ).toBe(false);
  });
});

describe("withStoreTracking", () => {
  it("스마트스토어 링크에만 유입 파라미터를 붙인다", () => {
    const url = new URL(
      withStoreTracking("https://smartstore.naver.com/aoull/products/1", "kim-jinhwan"),
    );
    expect(url.searchParams.get("nt_source")).toBe("aoull");
    expect(url.searchParams.get("nt_detail")).toBe("kim-jinhwan");
    expect(withStoreTracking("https://example.com/shop", "x")).toBe(
      "https://example.com/shop",
    );
  });
});
