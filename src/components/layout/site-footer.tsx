import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** 먹 위 워드마크는 백자 (브랜드 키트 03: 푸터 · 인트로) */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="mt-auto bg-meok px-gutter pt-10 pb-8 text-baekja">
      <p className="text-[11px] font-bold tracking-[0.18em] text-jae">
        {t("aboutEyebrow")}
      </p>
      <p className="mt-3 font-serif text-xl leading-snug font-semibold whitespace-pre-line">
        {t("aboutTitle")}
      </p>
      <p className="mt-3 text-caption text-jae">{t("aboutBody")}</p>
      <nav className="mt-6 flex flex-wrap gap-x-5 text-body">
        <Link href="/about" className="flex min-h-12 items-center border-b border-jae/60">
          {t("aboutCta")}
        </Link>
        <Link href="/apply" className="flex min-h-12 items-center border-b border-jae/60">
          {t("applyCta")}
        </Link>
        <Link
          href="/contact"
          className="flex min-h-12 items-center border-b border-jae/60"
        >
          {t("contactCta")}
        </Link>
      </nav>
      <div className="mt-10 flex items-end justify-between">
        <span className="wordmark text-lg">A.OULL</span>
        <span className="flex flex-col items-end gap-1 text-[11px] text-jae">
          <Link
            href="/privacy"
            className="font-bold text-baekja underline underline-offset-2"
          >
            {tf("privacy")}
          </Link>
          {tf("copyright")}
        </span>
      </div>
    </footer>
  );
}
