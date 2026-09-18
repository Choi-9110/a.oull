"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/** 국기 대신 각 언어를 그 언어 자체로 표기한다 (브랜드 키트 04) */
const SHORT: Record<Locale, string> = { ko: "한", ja: "日", zh: "中" };
export const LOCALE_NAMES: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
};

export function useChangeLocale() {
  const pathname = usePathname();
  const router = useRouter();
  return (next: Locale) => {
    // QR 진입 파라미터(?src=qr 등)를 유지한다
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: next, scroll: false });
  };
}

/** 헤더용 소형 (한 · 日 · 中) */
export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const change = useChangeLocale();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex overflow-hidden rounded-btn border border-jae"
    >
      {routing.locales.map((l, i) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => change(l)}
          aria-pressed={l === locale}
          aria-label={LOCALE_NAMES[l]}
          className={`h-8 px-2.5 text-label ${i > 0 ? "border-l border-jae" : ""} ${
            l === locale ? "bg-meok font-bold text-baekja" : "text-meok"
          }`}
        >
          {SHORT[l]}
        </button>
      ))}
    </div>
  );
}

/** 본문용 대형 (한국어 · 日本語 · 中文, 48px) */
export function LanguageSegment() {
  const t = useTranslations("header");
  const locale = useLocale();
  const change = useChangeLocale();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex w-fit overflow-hidden rounded-btn border border-meok"
    >
      {routing.locales.map((l, i) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => change(l)}
          aria-pressed={l === locale}
          className={`h-12 px-5 text-sm ${i > 0 ? "border-l border-meok" : ""} ${
            l === locale ? "bg-meok font-bold text-baekja" : "font-medium text-meok"
          }`}
        >
          {LOCALE_NAMES[l]}
        </button>
      ))}
    </div>
  );
}
