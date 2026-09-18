import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/layout/app-header";
import { LanguageSegment } from "@/components/layout/language-switcher";
import { PageTitle } from "@/components/layout/page-title";
import { RowLink } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getRegions } from "@/server/queries/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/more">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "more" });
  return { title: t("title") };
}

// 탭바 "더보기": 지역 · 아울 소개 · 문의 · 체험 신청 · 언어
export default async function MorePage({ params }: PageProps<"/[locale]/more">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const tf = await getTranslations({ locale, namespace: "footer" });
  const t = await getTranslations({ locale, namespace: "more" });
  const regions = await getRegions();

  return (
    <>
      <AppHeader />
      <PageTitle en="More" title={t("title")} />

      <section className="px-gutter">
        <h2 className="label border-b border-meok pb-2">{t("regions")}</h2>
        {regions.map((r) => (
          <RowLink key={r.slug} href={`/regions/${r.slug}`}>
            <span className="flex flex-col gap-0.5">
              <span className="font-serif text-lg font-semibold">
                {L(r.name, locale)}
              </span>
              <span className="text-caption text-mukhoe">{L(r.tagline, locale)}</span>
            </span>
          </RowLink>
        ))}
      </section>

      <section className="px-gutter pt-8">
        <h2 className="label border-b border-meok pb-2">{t("service")}</h2>
        <RowLink href="/about">
          <span className="text-body font-medium">{t("about")}</span>
        </RowLink>
        <RowLink href="/apply">
          <span className="text-body font-medium">{t("apply")}</span>
        </RowLink>
        <RowLink href="/contact">
          <span className="text-body font-medium">{t("contact")}</span>
        </RowLink>
        <RowLink href="/privacy">
          <span className="text-body font-medium">{tf("privacy")}</span>
        </RowLink>
      </section>

      <section className="flex flex-col gap-3 px-gutter pt-8 pb-10">
        <h2 className="label border-b border-meok pb-2">{t("language")}</h2>
        <LanguageSegment />
      </section>
    </>
  );
}
