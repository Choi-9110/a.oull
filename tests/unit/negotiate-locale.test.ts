import { describe, expect, it } from "vitest";
import { negotiateLocale } from "@/lib/i18n/negotiate-locale";

describe("negotiateLocale", () => {
  it("일본어 브라우저 → ja", () => {
    expect(negotiateLocale("ja-JP,ja;q=0.9,en;q=0.8")).toBe("ja");
  });

  it("중국어(간체/번체) → zh", () => {
    expect(negotiateLocale("zh-CN,zh;q=0.9")).toBe("zh");
    expect(negotiateLocale("zh-TW")).toBe("zh");
  });

  it("q 값 우선순위를 따른다", () => {
    expect(negotiateLocale("fr;q=1,ko;q=0.5,ja;q=0.8")).toBe("ja");
  });

  it("영어 브라우저 → en", () => {
    expect(negotiateLocale("en-US,en;q=0.9")).toBe("en");
  });

  it("지원하지 않거나 헤더가 없으면 ko", () => {
    expect(negotiateLocale("fr-FR,fr;q=0.9")).toBe("ko");
    expect(negotiateLocale(null)).toBe("ko");
  });
});
