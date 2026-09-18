import type { Json } from "@/types/database.types";
import { routing, type Locale } from "@/i18n/routing";

/** DB의 다국어 jsonb 필드({ko, en, ja, zh})에서 locale 값을 꺼낸다. 비어 있으면 ko로 fallback. */
export function pickLocale(field: Json | null | undefined, locale: Locale): string {
  if (!field || typeof field !== "object" || Array.isArray(field)) return "";
  const value = field[locale];
  if (typeof value === "string" && value.trim() !== "") return value;
  const fallback = field[routing.defaultLocale];
  return typeof fallback === "string" ? fallback : "";
}
