import { describe, expect, it } from "vitest";
import { pickLocale } from "@/lib/i18n/pick-locale";

describe("pickLocale", () => {
  const field = { ko: "두석장", ja: "豆錫匠", zh: "" };

  it("요청한 locale 값을 반환한다", () => {
    expect(pickLocale(field, "ja")).toBe("豆錫匠");
  });

  it("번역이 비어 있으면 ko로 fallback한다", () => {
    expect(pickLocale(field, "zh")).toBe("두석장");
  });

  it("필드가 없거나 객체가 아니면 빈 문자열", () => {
    expect(pickLocale(null, "ko")).toBe("");
    expect(pickLocale("text", "ko")).toBe("");
  });
});
