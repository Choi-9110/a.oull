import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArtisanCard } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { PageTitle } from "@/components/layout/page-title";
import type { Locale } from "@/i18n/routing";
import { getArtisans, getCrafts, getRegions } from "@/server/queries/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/artisans">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "artisan" });
  return { title: t("listTitle") };
}

export default async function ArtisansPage({ params }: PageProps<"/[locale]/artisans">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "artisan" });
  const [artisans, crafts, regions] = await Promise.all([
    getArtisans(),
    getCrafts(),
    getRegions(),
  ]);

  return (
    <>
      <AppHeader />
      <PageTitle
        en="Artisans"
        count={artisans.length}
        title={t("listTitle")}
        sub={t("listSub")}
      />
      <div className="flex flex-col gap-4 px-gutter pb-10">
        {artisans.map((a) => (
          <ArtisanCard
            key={a.slug}
            artisan={a}
            craft={crafts.find((c) => c.slug === a.craftSlug)}
            region={regions.find((r) => r.slug === a.regionSlug)}
            locale={locale}
          />
        ))}
      </div>
    </>
  );
}
