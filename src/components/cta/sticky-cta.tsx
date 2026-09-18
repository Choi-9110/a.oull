"use client";

import { useTranslations } from "next-intl";
import { button } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import { withStoreTracking } from "@/lib/analytics/store-link";
import { track } from "@/lib/analytics/track";

/**
 * F-10 하단 고정 CTA (브랜드 키트 04)
 * 옹기 연한 면 + 옹기 채움 "작품 구하기"(외부 스토어) / 먹 테두리 "체험 예약"(신청 페이지).
 * 두 버튼의 위계는 같게 만들지 않는다. 그림자가 허용되는 유일한 요소.
 */
export function StickyCta({
  artisanSlug,
  storeUrl,
}: {
  artisanSlug: string;
  storeUrl: string | null;
}) {
  const t = useTranslations("cta");

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[var(--shell-max-width)] border-t border-jae bg-onggi-pale shadow-[0_-6px_18px_rgba(22,40,60,0.06)]">
      <div className="flex h-cta items-center gap-2.5 px-gutter">
        {storeUrl ? (
          <a
            href={withStoreTracking(storeUrl, artisanSlug)}
            target="_blank"
            rel="noopener"
            onClick={(e) =>
              track("store_click", {
                artisan: artisanSlug,
                props: { url: e.currentTarget.href },
              })
            }
            className={`${button.base} ${button.primary} flex-1 px-0`}
          >
            {t("buy")}
          </a>
        ) : (
          <span className={`${button.base} ${button.disabled} flex-1 px-0`} aria-disabled>
            {t("buyUnavailable")}
          </span>
        )}
        <Link
          href={{ pathname: "/apply", query: { artisan: artisanSlug } }}
          onClick={() =>
            track("reservation_start", {
              artisan: artisanSlug,
              props: { from: "artisan_cta" },
            })
          }
          className={`${button.base} ${button.secondary} flex-1 px-0`}
        >
          {t("reserve")}
        </Link>
      </div>
    </div>
  );
}
