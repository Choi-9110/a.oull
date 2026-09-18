import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArtisanRow, PostRow } from "@/components/cards/cards";
import { AppHeader } from "@/components/layout/app-header";
import { PhotoPlaceholder } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/routing";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import {
  getArtisan,
  getCraft,
  getPost,
  getPosts,
  getRegion,
} from "@/server/queries/content";

// M-01 매거진 글
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/magazine/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  return post
    ? {
        title: L(post.title, locale as Locale),
        description: L(post.excerpt, locale as Locale),
      }
    : {};
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/magazine/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);

  const post = await getPost(slug);
  if (!post) notFound();
  const artisan = post.artisanSlug ? await getArtisan(post.artisanSlug) : null;
  const [craft, region, others] = await Promise.all([
    artisan ? getCraft(artisan.craftSlug) : null,
    artisan ? getRegion(artisan.regionSlug) : null,
    getPosts().then((ps) => ps.filter((p) => p.slug !== post.slug).slice(0, 2)),
  ]);

  const t = await getTranslations({ locale, namespace: "magazine" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <AppHeader backHref="/magazine" />

      <header className="flex flex-col gap-3 px-gutter pt-8 pb-6">
        <p className="label">{L(post.category, locale)}</p>
        <h1 className="font-serif text-[27px] leading-[1.45] font-semibold">
          {L(post.title, locale)}
        </h1>
        <p className="font-en text-[15px] tracking-[0.04em] text-mukhoe">
          {post.publishedAt.replaceAll("-", ".")} ·{" "}
          {tc("minutes", { n: post.readMinutes })}
        </p>
      </header>

      <PhotoPlaceholder
        label={`${tc("photo")} — 16:10`}
        className="aspect-[16/10] w-full"
      />

      <article className="flex flex-col gap-5 px-gutter pt-8">
        <p className="font-serif text-lg leading-relaxed text-nambit">
          {L(post.excerpt, locale)}
        </p>
        {post.body.map((p, i) => (
          <p key={i} className="font-serif text-body-l text-pretty">
            {L(p, locale)}
          </p>
        ))}
      </article>

      {artisan && (
        <section className="flex flex-col gap-2 px-gutter pt-10">
          <h2 className="font-serif text-lg font-semibold">{t("relatedArtisan")}</h2>
          <ArtisanRow
            artisan={artisan}
            craft={craft ?? undefined}
            region={region ?? undefined}
            locale={locale}
          />
        </section>
      )}

      {others.length > 0 && (
        <section className="flex flex-col gap-2 px-gutter pt-10 pb-10">
          <h2 className="font-serif text-lg font-semibold">{t("moreStories")}</h2>
          <div>
            {others.map((p) => (
              <PostRow key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
