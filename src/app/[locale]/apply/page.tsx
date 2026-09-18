import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ApplyForm } from "@/components/forms/apply-form";
import { AppHeader } from "@/components/layout/app-header";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getArtisans, getCrafts } from "@/server/queries/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/apply">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return { title: t("title") };
}

// F-08 체험 신청 (장인 페이지 "체험 예약" CTA의 도착지)
export default async function ApplyPage({ params }: PageProps<"/[locale]/apply">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "apply" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const [artisans, crafts] = await Promise.all([getArtisans(), getCrafts()]);

  const craftName = (slug: string) => {
    const c = crafts.find((x) => x.slug === slug);
    return c ? L(c.name, locale) : "";
  };

  return (
    <>
      <AppHeader backHref="/more" />
      <div className="flex flex-col gap-2 px-gutter pt-8 pb-6">
        <p className="font-en text-lg tracking-[0.04em] text-nambit">Experience</p>
        <h1 className="font-serif text-display font-semibold">{t("title")}</h1>
        <p className="text-caption text-mukhoe">{t("sub")}</p>
      </div>
      <div className="px-gutter pb-10">
        <ApplyForm
          artisanGroupLabel={tn("artisans")}
          craftGroupLabel={tn("crafts")}
          artisanOptions={artisans.map((a) => ({
            value: `artisan:${a.slug}`,
            label: `${L(a.name, locale)} · ${craftName(a.craftSlug)}`,
          }))}
          craftOptions={crafts.map((c) => ({
            value: `craft:${c.slug}`,
            label: L(c.name, locale),
          }))}
        />
      </div>
    </>
  );
}
