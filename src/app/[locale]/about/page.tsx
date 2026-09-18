import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/layout/app-header";
import { button, TextLink } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

// F-06 아울 소개 (브랜드 키트 표지의 원칙 3단 구성 차용)
export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const th = await getTranslations({ locale, namespace: "home" });

  const sections = [1, 2, 3] as const;

  return (
    <>
      <AppHeader backHref="/more" />

      <section className="relative overflow-hidden border-b border-jae px-gutter pt-12 pb-10">
        <div
          aria-hidden
          className="absolute -bottom-[180px] -left-[140px] size-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(110,158,139,0.40), rgba(110,158,139,0.12) 55%, rgba(247,245,239,0) 73%)",
          }}
        />
        <div className="relative flex flex-col gap-5">
          <p className="wordmark text-[40px] leading-none">A.OULL</p>
          <div className="h-px w-[88px] bg-meok" />
          <p className="font-serif text-body-l text-nambit">{t("lead")}</p>
        </div>
      </section>

      <ol className="flex flex-col px-gutter pt-4">
        {sections.map((n) => (
          <li key={n} className="flex flex-col gap-2.5 border-b border-jae py-6">
            <span className="font-en text-[26px] leading-none text-cheongja">
              {String(n).padStart(2, "0")}
            </span>
            <h2 className="text-[15px] font-bold">{t(`section${n}Title`)}</h2>
            <p className="text-caption text-mukhoe">{t(`section${n}Body`)}</p>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 px-gutter pt-8 pb-10">
        <Link href="/apply" className={`${button.base} ${button.secondary}`}>
          {th("applyCta")}
        </Link>
        <TextLink href="/contact" className="self-start">
          {th("contactCta")}
        </TextLink>
      </div>
    </>
  );
}
