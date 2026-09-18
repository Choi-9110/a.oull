import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostRow } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { PageTitle } from "@/components/layout/page-title";
import { PhotoPlaceholder } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { getPosts } from "@/server/queries/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/magazine">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "magazine" });
  return { title: t("title") };
}

// M-01 매거진 목록
export default async function MagazinePage({ params }: PageProps<"/[locale]/magazine">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "magazine" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const [featured, ...rest] = await getPosts();

  return (
    <>
      <AppHeader />
      <PageTitle en="Magazine" title={t("title")} sub={t("sub")} />

      {featured && (
        <Link href={`/magazine/${featured.slug}`} className="mx-gutter block">
          <PhotoPlaceholder
            label={`${tc("photo")} — 16:10`}
            className="aspect-[16/10] w-full rounded-card"
          />
          <span className="mt-4 flex flex-col gap-2">
            <span className="label">{L(featured.category, locale)}</span>
            <span className="font-serif text-heading font-semibold">
              {L(featured.title, locale)}
            </span>
            <span className="text-body text-mukhoe">{L(featured.excerpt, locale)}</span>
            <span className="font-en text-[15px] tracking-[0.04em] text-mukhoe lining-nums">
              {featured.publishedAt.replaceAll("-", ".")} ·{" "}
              {tc("minutes", { n: featured.readMinutes })}
            </span>
          </span>
        </Link>
      )}

      <div className="px-gutter pt-8 pb-10">
        {rest.map((p) => (
          <PostRow key={p.slug} post={p} locale={locale} />
        ))}
      </div>
    </>
  );
}
