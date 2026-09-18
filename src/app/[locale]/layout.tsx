import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { MobileShell } from "@/components/layout/mobile-shell";
import { ToastProvider } from "@/components/ui/toast";
import { fontVariables } from "../fonts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("title"), template: `%s · A.OULL` },
    description: t("description"),
    appleWebApp: { capable: true, title: "A.OULL", statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5ef",
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="antialiased">
        <NextIntlClientProvider>
          <AnalyticsProvider />
          <ToastProvider>
            <MobileShell>{children}</MobileShell>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
