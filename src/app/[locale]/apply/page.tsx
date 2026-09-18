import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

// F-08 체험 예약 (장인 페이지 "체험 예약" CTA의 도착지) — 헤더·단계는 ReservationFlow가 그린다
export default async function ApplyPage({ params }: PageProps<"/[locale]/apply">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const [artisans, crafts, slots] = await Promise.all([
    getArtisans(),
    getCrafts(),
    getSlots(),
  ]);

  return (
    <ReservationFlow
      artisans={artisans.map((a) => ({
        slug: a.slug,
        name: L(a.name, locale),
        craft: L(crafts.find((c) => c.slug === a.craftSlug)?.name ?? { ko: "" }, locale),
      }))}
      slots={slots}
      maxPartySize={bookingPolicy.maxPartySize}
    />
  );
}
