import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArtisanCard, PostRow } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { PhotoPlaceholder } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import {
  getArtisansByCraft,
  getCraft,
  getCrafts,
  getPosts,
  getRegion,
} from "@/server/queries/content";

// F-02 전통공예 종목 템플릿 — 8종 모두 같은 구조, 콘텐츠만 교체
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCrafts()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/crafts/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const craft = await getCraft(slug);
  return craft ? { title: L(craft.name, locale as Locale) } : {};
}

export default async function CraftPage({
  params,
}: PageProps<"/[locale]/crafts/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);

  const craft = await getCraft(slug);
  if (!craft) notFound();
  const [region, artisans, posts] = await Promise.all([
    getRegion(craft.regionSlug),
    getArtisansByCraft(craft.slug),
    getPosts(),
  ]);
  const related = posts.filter((p) => p.craftSlug === craft.slug);

  const t = await getTranslations({ locale, namespace: "craft" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <AppHeader backHref="/crafts" title={L(craft.name, locale)} titleOnScroll />
      <PhotoPlaceholder
        label={`${tc("photo")} — 16:10`}
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-col gap-1.5 px-gutter pt-5.5">
        <p className="label">
          {region && L(region.name, locale)}
          {craft.hanja && ` · ${craft.hanja}`}
        </p>
        <h1 className="font-serif text-[30px] leading-[1.3] font-semibold">
          {L(craft.name, locale)}
        </h1>
        <p className="text-body text-mukhoe">{L(craft.summary, locale)}</p>
      </div>

      <section className="flex flex-col gap-2.5 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("history")}</h2>
        {craft.history.map((p, i) => (
          <p key={i} className="font-read text-body-l text-pretty">
            {L(p, locale)}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-3 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("technique")}</h2>
        <ol className="border-t border-jae">
          {craft.techniques.map((s, i) => (
            <li key={i} className="flex gap-4 border-b border-jae py-4">
              <span className="w-7 font-en text-2xl leading-none text-cheongja lining-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[15px] font-bold">{L(s.title, locale)}</span>
                <span className="text-caption text-mukhoe">{L(s.body, locale)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("materials")}</h2>
        <ul className="flex flex-wrap gap-2">
          {craft.materials.map((m, i) => (
            <li
              key={i}
              className="flex h-10 items-center rounded-btn border border-jae px-4 text-sm font-medium"
            >
              {L(m, locale)}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3.5 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("artisans")}</h2>
        {artisans.length ? (
          artisans.map((a) => (
            <ArtisanCard
              key={a.slug}
              artisan={a}
              craft={craft}
              region={region ?? undefined}
              locale={locale}
            />
          ))
        ) : (
          <p className="rounded-card bg-hanji p-5 text-body text-mukhoe">
            {t("noArtisan")}
          </p>
        )}
      </section>

      {related.length > 0 && (
        <section className="flex flex-col gap-3 px-gutter pt-8">
          <h2 className="font-serif text-[19px] font-semibold">{t("relatedMagazine")}</h2>
          <div>
            {related.map((p) => (
              <PostRow key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
      <div className="h-10" />
    </>
  );
}
