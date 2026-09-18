import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/contact-form";
import { AppHeader } from "@/components/layout/app-header";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

// F-07 문의하기
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <AppHeader backHref="/more" />
      <div className="flex flex-col gap-2 px-gutter pt-8 pb-6">
        <p className="font-en text-lg tracking-[0.04em] text-nambit lining-nums">
          Contact
        </p>
        <h1 className="font-serif text-display font-semibold">{t("title")}</h1>
        <p className="text-caption text-mukhoe">{t("sub")}</p>
      </div>
      <div className="px-gutter pb-10">
        <ContactForm />
      </div>
    </>
  );
}
