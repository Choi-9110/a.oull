import "server-only";
import { artisans } from "@/data/fixtures/artisans";
import { crafts } from "@/data/fixtures/crafts";
import { posts } from "@/data/fixtures/posts";
import { regions } from "@/data/fixtures/regions";
import type { Artisan, Craft, I18n, Post, Region } from "@/lib/content/types";

/**
 * 콘텐츠 조회 레이어. 페이지는 반드시 이 함수들로만 데이터를 읽는다.
 * 현재는 목업(fixtures). Supabase 연결 시 이 파일 내부 구현만 교체한다 (DATA_SOURCE=supabase).
 */

export async function getRegions(): Promise<Region[]> {
  return regions;
}

export async function getRegion(slug: string): Promise<Region | null> {
  return regions.find((r) => r.slug === slug) ?? null;
}

export async function getCrafts(): Promise<Craft[]> {
  return crafts;
}

export async function getCraft(slug: string): Promise<Craft | null> {
  return crafts.find((c) => c.slug === slug) ?? null;
}

export async function getCraftsByRegion(regionSlug: string): Promise<Craft[]> {
  return crafts.filter((c) => c.regionSlug === regionSlug);
}

export async function getArtisans(): Promise<Artisan[]> {
  return artisans;
}

export async function getArtisan(slug: string): Promise<Artisan | null> {
  return artisans.find((a) => a.slug === slug) ?? null;
}

export async function getArtisansByCraft(craftSlug: string): Promise<Artisan[]> {
  return artisans.filter((a) => a.craftSlug === craftSlug);
}

export async function getArtisansByRegion(regionSlug: string): Promise<Artisan[]> {
  return artisans.filter((a) => a.regionSlug === regionSlug);
}

export async function getPosts(): Promise<Post[]> {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string): Promise<Post | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}

export type SearchResults = { crafts: Craft[]; artisans: Artisan[]; regions: Region[] };

const matches = (field: I18n, q: string) =>
  Object.values(field).some((v) => v?.toLowerCase().includes(q));

/** F-01 통합 검색: 종목명·장인명·지역명 (모든 언어 표기 대상) */
export async function search(query: string): Promise<SearchResults> {
  const q = query.trim().toLowerCase();
  if (!q) return { crafts: [], artisans: [], regions: [] };

  const matchedRegions = regions.filter((r) => matches(r.name, q));
  const regionSlugs = new Set(matchedRegions.map((r) => r.slug));
  const matchedCrafts = crafts.filter(
    (c) =>
      matches(c.name, q) || (c.hanja ?? "").includes(q) || regionSlugs.has(c.regionSlug),
  );
  const craftSlugs = new Set(matchedCrafts.map((c) => c.slug));
  const matchedArtisans = artisans.filter(
    (a) =>
      matches(a.name, q) || craftSlugs.has(a.craftSlug) || regionSlugs.has(a.regionSlug),
  );

  return { crafts: matchedCrafts, artisans: matchedArtisans, regions: matchedRegions };
}
