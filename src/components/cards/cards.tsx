import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Artisan, Craft, Post, Region } from "@/lib/content/types";
import { pickLocale as L } from "@/lib/i18n/pick-locale";
import { DocentDot, formatDuration, PhotoPlaceholder } from "@/components/ui/primitives";

const totalDuration = (a: Artisan) => a.tracks.reduce((s, t) => s + t.durationSec, 0);

/** 공예 종목 타일 (메인홈 2열 그리드) */
export function CraftTile({
  craft,
  region,
  locale,
}: {
  craft: Craft;
  region?: Region;
  locale: Locale;
}) {
  return (
    <Link
      href={`/crafts/${craft.slug}`}
      className="tap flex min-h-[72px] flex-col gap-1 rounded-card bg-hanji p-3.5"
    >
      <span className="font-serif text-base font-semibold">{L(craft.name, locale)}</span>
      <span className="text-label text-mukhoe">
        {L(craft.keyword, locale)}
        {region && ` · ${L(region.name, locale)}`}
      </span>
    </Link>
  );
}

/** 장인 행 (메인홈 "새로 등록된 장인") */
export async function ArtisanRow({
  artisan,
  craft,
  region,
  locale,
}: {
  artisan: Artisan;
  craft?: Craft;
  region?: Region;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "docent" });
  const tc = await getTranslations({ locale, namespace: "common" });
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="tap-row flex items-center gap-3.5 border-t border-jae py-3.5"
    >
      <PhotoPlaceholder
        label={tc("photo")}
        className="size-[72px] shrink-0 rounded-card"
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="label">
          {craft && L(craft.name, locale)}
          {region && ` · ${L(region.name, locale)}`}
        </span>
        <span className="font-serif text-lg font-semibold">
          {L(artisan.name, locale)}
        </span>
        <span className="flex items-center gap-1.5 text-label font-bold text-cheongja-deep">
          <DocentDot />
          {t("badge", { time: formatDuration(totalDuration(artisan)) })}
        </span>
      </span>
    </Link>
  );
}

/** 장인 카드 (브랜드 키트 04: 한지 면 + 사진 + 레이블 + 이름 + 한 줄) */
export async function ArtisanCard({
  artisan,
  craft,
  region,
  locale,
}: {
  artisan: Artisan;
  craft?: Craft;
  region?: Region;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "docent" });
  const tc = await getTranslations({ locale, namespace: "common" });
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="tap block overflow-hidden rounded-card bg-hanji"
    >
      <PhotoPlaceholder
        label={`${tc("photo")} — 16:10`}
        className="aspect-[16/10] w-full"
      />
      <span className="flex flex-col gap-1.5 p-4">
        <span className="label">
          {craft && L(craft.name, locale)}
          {region && ` · ${L(region.name, locale)}`}
        </span>
        <span className="font-serif text-[19px] font-semibold">
          {L(artisan.name, locale)}
        </span>
        <span className="text-caption text-mukhoe">{L(artisan.oneLiner, locale)}</span>
        <span className="mt-1 flex items-center gap-1.5 text-label font-bold text-cheongja-deep">
          <DocentDot />
          {t("badge", { time: formatDuration(totalDuration(artisan)) })}
        </span>
      </span>
    </Link>
  );
}

/** 매거진 행 */
export async function PostRow({ post, locale }: { post: Post; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  return (
    <Link
      href={`/magazine/${post.slug}`}
      className="tap-row flex gap-3.5 border-t border-jae py-4"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="label">{L(post.category, locale)}</span>
        <span className="font-serif text-base leading-snug font-semibold">
          {L(post.title, locale)}
        </span>
        <span className="font-en text-[15px] tracking-[0.04em] text-mukhoe lining-nums">
          {post.publishedAt.replaceAll("-", ".")} ·{" "}
          {t("minutes", { n: post.readMinutes })}
        </span>
      </span>
      <PhotoPlaceholder
        label={t("photo")}
        className="size-[88px] shrink-0 rounded-card"
      />
    </Link>
  );
}
