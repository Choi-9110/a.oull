import type { Locale } from "@/i18n/routing";

/** 다국어 텍스트. ko는 필수, 나머지는 비어 있으면 ko로 fallback (pickLocale). */
export type I18n = { ko: string } & Partial<Record<Exclude<Locale, "ko">, string>>;

export type Region = {
  slug: string;
  name: I18n;
  tagline: I18n;
  intro: I18n[];
};

export type Craft = {
  slug: string;
  regionSlug: string;
  name: I18n;
  hanja?: string;
  /** 카드 캡션용 대표 키워드 (예: 장석, 옻칠) */
  keyword: I18n;
  summary: I18n;
  history: I18n[];
  techniques: { title: I18n; body: I18n }[];
  materials: I18n[];
};

export type DocentTrack = {
  id: string;
  title: I18n;
  durationSec: number;
  /** locale별 오디오 storage path. 없는 locale은 ko로 fallback */
  src: Partial<Record<Locale, string>> & { ko: string };
};

export type Artisan = {
  slug: string;
  craftSlug: string;
  regionSlug: string;
  name: I18n;
  title: I18n;
  /** 이름 아래 한 줄 소개 */
  oneLiner: I18n;
  quote: I18n;
  bio: I18n[];
  storeUrl: string | null;
  tracks: DocentTrack[];
  stories: { title: I18n; body: I18n }[];
  works: { name: I18n; material: I18n }[];
};

export type Post = {
  slug: string;
  category: I18n;
  title: I18n;
  excerpt: I18n;
  body: I18n[];
  publishedAt: string;
  readMinutes: number;
  artisanSlug?: string;
  craftSlug?: string;
};
