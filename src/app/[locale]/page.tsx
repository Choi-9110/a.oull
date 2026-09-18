import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArtisanRow, CraftTile, PostRow } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionHeader } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { getArtisans, getCrafts, getPosts, getRegions } from "@/server/queries/content";

// F-01 메인홈 (브랜드 키트 "적용 — 메인홈")
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const [crafts, artisans, regions, posts] = await Promise.all([
    getCrafts(),
    getArtisans(),
    getRegions(),
    getPosts(),
  ]);
  const regionOf = (slug: string) => regions.find((r) => r.slug === slug);
  const craftOf = (slug: string) => crafts.find((c) => c.slug === slug);

  return (
    <>
      <AppHeader />

      <section className="relative overflow-hidden border-b border-jae px-gutter pt-8 pb-6.5">
        {/* 표지의 청자 번짐 — UI 안에서 허용되는 유일한 그라디언트 (브랜드 키트 01) */}
        <div
          aria-hidden
          className="absolute -top-[90px] -right-[110px] size-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(110,158,139,0.34), rgba(110,158,139,0.08) 58%, rgba(247,245,239,0) 74%)",
          }}
        />
        <div className="relative flex flex-col gap-4.5">
          <p className="label">{t("heroEyebrow")}</p>
          <h1 className="font-serif text-[27px] leading-[1.45] font-semibold whitespace-pre-line">
            {t("heroTitle")}
          </h1>
          <form action={`/${locale}/search`} role="search">
            <label className="flex h-[52px] items-center gap-2.5 rounded-btn border border-jae bg-white px-3.5 focus-within:border-meok">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle
                  cx="7"
                  cy="7"
                  r="5.2"
                  fill="none"
                  stroke="var(--mukhoe)"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11 L14.5 14.5"
                  stroke="var(--mukhoe)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="sr-only">{t("searchPlaceholder")}</span>
              <input
                type="search"
                name="q"
                placeholder={t("searchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-mukhoe"
              />
            </label>
          </form>
        </div>
      </section>

      <section className="flex flex-col gap-3.5 px-gutter pt-6">
        <SectionHeader title={t("craftsTitle")} href="/crafts" linkLabel={tc("seeAll")} />
        <div className="grid grid-cols-2 gap-2.5">
          {crafts.map((c) => (
            <CraftTile
              key={c.slug}
              craft={c}
              region={regionOf(c.regionSlug)}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3.5 px-gutter pt-8">
        <SectionHeader
          title={t("artisansTitle")}
          href="/artisans"
          linkLabel={tc("seeAll")}
        />
        <div>
          {artisans.map((a) => (
            <ArtisanRow
              key={a.slug}
              artisan={a}
              craft={craftOf(a.craftSlug)}
              region={regionOf(a.regionSlug)}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3.5 px-gutter pt-8 pb-8">
        <SectionHeader
          title={t("magazineTitle")}
          href="/magazine"
          linkLabel={tc("seeAll")}
        />
        <div>
          {posts.slice(0, 3).map((p) => (
            <PostRow key={p.slug} post={p} locale={locale} />
          ))}
        </div>
      </section>

      <SiteFooter locale={locale} />
    </>
  );
}
