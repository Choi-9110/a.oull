import { routing, type Locale } from "@/i18n/routing";

/** Accept-Language 헤더에서 지원 locale(ko/ja/zh)을 고른다. 없으면 기본 locale. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return routing.defaultLocale;

  const candidates = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...rest] = part.trim().split(";");
      const q = rest.find((p) => p.trim().startsWith("q="));
      return {
        base: tag.toLowerCase().split("-")[0],
        q: q ? Number(q.split("=")[1]) : 1,
      };
    })
    .filter((c) => c.base && !Number.isNaN(c.q))
    .sort((a, b) => b.q - a.q);

  for (const { base } of candidates) {
    if ((routing.locales as readonly string[]).includes(base)) return base as Locale;
  }
  return routing.defaultLocale;
}
