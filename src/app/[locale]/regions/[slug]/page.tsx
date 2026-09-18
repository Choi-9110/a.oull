import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArtisanRow, CraftTile } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { PhotoPlaceholder } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import {
  getArtisansByRegion,
  getCrafts,
  getCraftsByRegion,
  getRegion,
  getRegions,
} from "@/server/queries/content";

// F-05 지역 페이지 템플릿 (통영 · 마산)
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getRegions()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/regions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const region = await getRegion(slug);
  return region ? { title: L(region.name, locale as Locale) } : {};
}

export default async function RegionPage({
  params,
}: PageProps<"/[locale]/regions/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);

  const region = await getRegion(slug);
  if (!region) notFound();
  const [crafts, artisans, allCrafts] = await Promise.all([
    getCraftsByRegion(slug),
    getArtisansByRegion(slug),
    getCrafts(),
  ]);

  const t = await getTranslations({ locale, namespace: "region" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <AppHeader backHref="/more" />
      <PhotoPlaceholder
        label={`${tc("photo")} — 16:10`}
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-col gap-2 px-gutter pt-5.5">
        <p className="font-en text-lg tracking-[0.04em] text-nambit capitalize">
          {region.slug}
        </p>
        <h1 className="font-serif text-[30px] leading-[1.3] font-semibold">
          {L(region.name, locale)}
        </h1>
        <p className="font-serif text-lg text-nambit">{L(region.tagline, locale)}</p>
      </div>

      <section className="flex flex-col gap-3 px-gutter pt-6">
        {region.intro.map((p, i) => (
          <p key={i} className="font-serif text-body-l text-pretty">
            {L(p, locale)}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-3.5 px-gutter pt-8">
        <h2 className="font-serif text-lg font-semibold">{t("crafts")}</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {crafts.map((c) => (
            <CraftTile key={c.slug} craft={c} region={region} locale={locale} />
          ))}
        </div>
      </section>

      {artisans.length > 0 && (
        <section className="flex flex-col gap-3.5 px-gutter pt-8 pb-10">
          <h2 className="font-serif text-lg font-semibold">{t("artisans")}</h2>
          <div>
            {artisans.map((a) => (
              <ArtisanRow
                key={a.slug}
                artisan={a}
                craft={allCrafts.find((c) => c.slug === a.craftSlug)}
                region={region}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
