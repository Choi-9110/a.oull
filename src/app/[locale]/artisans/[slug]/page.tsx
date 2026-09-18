import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DocentPlayer, type PlayerTrack } from "@/components/audio/docent-player";
import { StickyCta } from "@/components/cta/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PhotoPlaceholder, TextLink } from "@/components/ui/primitives";
import { routing, type Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getPublicUrl } from "@/lib/storage";
import { getArtisan, getArtisans, getCraft, getRegion } from "@/server/queries/content";

// F-03 장인 소개 (QR 도착 페이지) — 브랜드 키트 "적용 — 장인 페이지"
export const dynamicParams = true;

export async function generateStaticParams() {
  const artisans = await getArtisans();
  return artisans.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/artisans/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const artisan = await getArtisan(slug);
  if (!artisan) return {};
  return {
    title: `${L(artisan.title, locale as Locale)} ${L(artisan.name, locale as Locale)}`,
  };
}

export default async function ArtisanPage({
  params,
}: PageProps<"/[locale]/artisans/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);

  const artisan = await getArtisan(slug);
  if (!artisan) notFound();
  const [craft, region] = await Promise.all([
    getCraft(artisan.craftSlug),
    getRegion(artisan.regionSlug),
  ]);

  const t = await getTranslations({ locale, namespace: "artisan" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const tracks: PlayerTrack[] = artisan.tracks.map((tr) => ({
    id: tr.id,
    title: L(tr.title, locale),
    durationSec: tr.durationSec,
    src: Object.fromEntries(
      routing.locales.map((lc) => [lc, getPublicUrl(tr.src[lc] ?? tr.src.ko)]),
    ) as PlayerTrack["src"],
  }));

  const craftName = craft ? L(craft.name, locale) : "";

  return (
    <>
      <AppHeader backHref="/artisans" />

      <PhotoPlaceholder
        label={`${tc("photo")} — 16:10`}
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-col gap-4.5 px-gutter pt-5.5">
        <div className="flex flex-col gap-1.5">
          <p className="label">
            {craftName}
            {region && ` · ${L(region.name, locale)}`}
          </p>
          <h1 className="font-serif text-[30px] leading-[1.3] font-semibold">
            {L(artisan.name, locale)}
          </h1>
          <p className="text-caption text-mukhoe">{L(artisan.oneLiner, locale)}</p>
        </div>

        <DocentPlayer
          tracks={tracks}
          artisanId={artisan.slug}
          artisanName={L(artisan.name, locale)}
        />
      </div>

      <section className="flex flex-col gap-2.5 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("stories")}</h2>
        {artisan.stories.map((s, i) => (
          <article key={i} className="flex flex-col gap-2 pt-2">
            <h3 className="font-serif text-base font-semibold">{L(s.title, locale)}</h3>
            <p className="font-read text-body-l text-pretty">{L(s.body, locale)}</p>
          </article>
        ))}
      </section>

      <figure className="mx-gutter mt-8 border-y border-jae py-6">
        <blockquote className="font-serif text-lg leading-relaxed text-nambit">
          “{L(artisan.quote, locale)}”
        </blockquote>
        <figcaption className="mt-3 text-caption text-mukhoe">
          — {craftName} {L(artisan.name, locale)}
        </figcaption>
      </figure>

      <section className="flex flex-col gap-2.5 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("bio")}</h2>
        {artisan.bio.map((p, i) => (
          <p key={i} className="text-body text-meok">
            {L(p, locale)}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-3.5 px-gutter pt-8">
        <h2 className="font-serif text-[19px] font-semibold">{t("works")}</h2>
        <ul className="grid grid-cols-2 gap-x-2.5 gap-y-4">
          {artisan.works.map((w, i) => (
            <li key={i} className="flex flex-col gap-2">
              <PhotoPlaceholder
                label={tc("photo")}
                className="aspect-square w-full rounded-card"
              />
              <span className="font-serif text-[15px] font-semibold">
                {L(w.name, locale)}
              </span>
              <span className="-mt-1 text-caption text-mukhoe">
                {L(w.material, locale)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-x-6 px-gutter pt-6 pb-10">
        {craft && (
          <TextLink href={`/crafts/${craft.slug}`}>
            {t("aboutCraft", { craft: craftName })}
          </TextLink>
        )}
        <TextLink href="/artisans">{tc("otherArtisans")}</TextLink>
      </div>

      {/* 하단 고정 CTA 높이만큼 여백 (탭바는 이 페이지에서 숨김) */}
      <div aria-hidden className="h-[calc(var(--cta-height)-var(--tabbar-height))]" />
      <StickyCta artisanSlug={artisan.slug} storeUrl={artisan.storeUrl} />
    </>
  );
}
