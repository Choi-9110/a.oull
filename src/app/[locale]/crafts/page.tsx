import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/layout/app-header";
import { PageTitle } from "@/components/layout/page-title";
import { RowLink } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getArtisans, getCrafts, getRegions } from "@/server/queries/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/crafts">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "craft" });
  return { title: t("listTitle") };
}

// F-02 전통공예 8종 목록
export default async function CraftsPage({ params }: PageProps<"/[locale]/crafts">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "craft" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const [crafts, regions, artisans] = await Promise.all([
    getCrafts(),
    getRegions(),
    getArtisans(),
  ]);

  return (
    <>
      <AppHeader />
      <PageTitle
        en="Crafts"
        count={crafts.length}
        title={t("listTitle")}
        sub={t("listSub")}
      />
      <ol className="border-t border-jae px-gutter pb-10">
        {crafts.map((c, i) => {
          const region = regions.find((r) => r.slug === c.regionSlug);
          const hasArtisan = artisans.some((a) => a.craftSlug === c.slug);
          return (
            <li key={c.slug}>
              <RowLink
                href={`/crafts/${c.slug}`}
                aside={
                  !hasArtisan && (
                    <span className="text-[11px] text-mukhoe">{tc("recruiting")}</span>
                  )
                }
              >
                <span className="flex items-baseline gap-4">
                  <span className="w-6 font-en text-lg text-mukhoe lining-nums tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-serif text-lg font-semibold">
                      {L(c.name, locale)}
                      {c.hanja && (
                        <span className="ml-2 text-caption font-normal text-mukhoe">
                          {c.hanja}
                        </span>
                      )}
                    </span>
                    <span className="text-caption text-mukhoe">
                      {L(c.keyword, locale)} · {region && L(region.name, locale)}
                    </span>
                  </span>
                </span>
              </RowLink>
            </li>
          );
        })}
      </ol>
    </>
  );
}
