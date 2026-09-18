import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/layout/app-header";
import { ReservationFlow } from "@/components/reservation/reservation-flow";
import { bookingPolicy } from "@/data/fixtures/experiences";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getArtisans, getCrafts } from "@/server/queries/content";
import { getSlots } from "@/server/reservations/store";

// 남은 자리는 예약이 들어올 때마다 바뀌므로 요청 시점에 계산한다
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/apply">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return { title: t("title") };
}

// F-08 체험 예약 (장인 페이지 "체험 예약" CTA의 도착지)
export default async function ApplyPage({ params }: PageProps<"/[locale]/apply">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "apply" });
  const [artisans, crafts, slots] = await Promise.all([
    getArtisans(),
    getCrafts(),
    getSlots(),
  ]);

  const craftName = (slug: string) => {
    const c = crafts.find((x) => x.slug === slug);
    return c ? L(c.name, locale) : "";
  };

  return (
    <>
      <AppHeader backHref="/more" />
      <div className="flex flex-col gap-2 px-gutter pt-8 pb-6">
        <p className="font-en text-lg tracking-[0.04em] text-nambit lining-nums">
          Experience
        </p>
        <h1 className="font-serif text-display font-semibold">{t("title")}</h1>
        <p className="text-caption text-mukhoe">{t("sub")}</p>
      </div>
      <div className="px-gutter pb-12">
        <ReservationFlow
          artisans={artisans.map((a) => ({
            slug: a.slug,
            label: `${L(a.name, locale)} · ${craftName(a.craftSlug)}`,
          }))}
          slots={slots}
          maxPartySize={bookingPolicy.maxPartySize}
        />
      </div>
    </>
  );
}
