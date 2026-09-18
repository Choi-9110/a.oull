"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

/**
 * 상단 헤더 (브랜드 키트 적용 예시: 58px, 하단 1px 재 보더, 워드마크 단독)
 * backHref를 주면 뒤로가기 + 작은 워드마크.
 */
export function AppHeader({ backHref }: { backHref?: string }) {
  const t = useTranslations("header");
  const router = useRouter();

  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-jae bg-baekja">
      <div className="flex h-header items-center justify-between pr-3 pl-2">
        <div className="flex items-center gap-1">
          {backHref ? (
            <>
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1 ? router.back() : router.push(backHref)
                }
                aria-label={t("back")}
                className="flex size-12 items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <path
                    d="M11.5 2.5 L4.5 9 L11.5 15.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <Link href="/" className="wordmark text-[15px]">
                A.OULL
              </Link>
            </>
          ) : (
            <Link href="/" className="wordmark flex min-h-12 items-center px-3 text-base">
              A.OULL
            </Link>
          )}
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
