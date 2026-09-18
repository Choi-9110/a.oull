import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArtisanRow, CraftTile } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { RowLink } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getCrafts, getRegions, search } from "@/server/queries/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return { title: t("title"), robots: { index: false } };
}

// F-01 통합 검색 결과 (종목명 · 장인명 · 지역명)
export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/search">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? "";

  const t = await getTranslations({ locale, namespace: "search" });
  const th = await getTranslations({ locale, namespace: "home" });
  const [results, crafts, regions] = await Promise.all([
    search(q),
    getCrafts(),
    getRegions(),
  ]);
  const empty =
    !results.crafts.length && !results.artisans.length && !results.regions.length;

  return (
    <>
      <AppHeader backHref="/" title={t("title")} />
      <div className="flex flex-col gap-4 px-gutter pt-6 pb-4">
        <form role="search">
          <label className="flex h-[52px] items-center gap-2.5 rounded-btn border border-meok bg-white px-3.5">
            <span className="sr-only">{th("searchPlaceholder")}</span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={th("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-mukhoe"
            />
          </label>
        </form>
        <h1 className="font-serif text-lg font-semibold">
          {q ? t("results", { q }) : t("title")}
        </h1>
        {(!q || empty) && (
          <p className="text-body text-mukhoe">{q ? t("empty") : t("hint")}</p>
        )}
      </div>

      {results.regions.length > 0 && (
        <section className="px-gutter pt-4">
          <h2 className="label border-b border-meok pb-2">{t("regions")}</h2>
          {results.regions.map((r) => (
            <RowLink key={r.slug} href={`/regions/${r.slug}`}>
              <span className="font-serif text-lg font-semibold">
                {L(r.name, locale)}
              </span>
            </RowLink>
          ))}
        </section>
      )}
      {results.crafts.length > 0 && (
        <section className="flex flex-col gap-3 px-gutter pt-8">
          <h2 className="label border-b border-meok pb-2">{t("crafts")}</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {results.crafts.map((c) => (
              <CraftTile
                key={c.slug}
                craft={c}
                region={regions.find((r) => r.slug === c.regionSlug)}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
      {results.artisans.length > 0 && (
        <section className="flex flex-col gap-1 px-gutter pt-8 pb-10">
          <h2 className="label border-b border-meok pb-2">{t("artisans")}</h2>
          {results.artisans.map((a) => (
            <ArtisanRow
              key={a.slug}
              artisan={a}
              craft={crafts.find((c) => c.slug === a.craftSlug)}
              region={regions.find((r) => r.slug === a.regionSlug)}
              locale={locale}
            />
          ))}
        </section>
      )}
    </>
  );
}
