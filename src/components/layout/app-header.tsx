"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { LanguageSheetButton, LanguageSwitcher } from "./language-switcher";

/**
 * 상단 헤더 (브랜드 키트: 58px, 하단 1px 재 보더 / TDS: 하위 화면은 뒤로가기 + 화면 제목)
 * - backHref 없음: 탭 루트 화면 → 워드마크
 * - backHref 있음: 뒤로가기 + 제목. titleOnScroll이면 본문 제목이 지나간 뒤에 헤더 제목이 나타난다.
 */
export function AppHeader({
  backHref,
  title,
  titleOnScroll = false,
  onBack,
}: {
  backHref?: string;
  title?: string;
  titleOnScroll?: boolean;
  /** 퍼널처럼 화면 안에서 이전 단계로 돌아가야 할 때 */
  onBack?: () => void;
}) {
  const t = useTranslations("header");
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!titleOnScroll) return;
    const onScroll = () => setScrolled(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [titleOnScroll]);

  const showTitle = title && (!titleOnScroll || scrolled);
  const goBack = () => {
    if (onBack) return onBack();
    if (window.history.length > 1) router.back();
    else router.push(backHref ?? "/");
  };

  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-jae bg-baekja">
      <div className="relative flex h-header items-center justify-between pr-3 pl-1">
        {backHref || onBack ? (
          <button
            type="button"
            onClick={goBack}
            aria-label={t("back")}
            className="tap flex size-12 items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden>
              <path
                d="M11.5 2.5 L4.5 9 L11.5 15.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <Link href="/" className="wordmark flex min-h-12 items-center px-3 text-base">
            A.OULL
          </Link>
        )}

        {(backHref || onBack) && (
          <p
            aria-hidden={!showTitle}
            className={`pointer-events-none absolute inset-x-20 truncate text-center text-[16px] font-bold transition-opacity duration-200 ${
              showTitle ? "opacity-100" : "opacity-0"
            }`}
          >
            {title}
          </p>
        )}

        {backHref || onBack ? <LanguageSheetButton /> : <LanguageSwitcher />}
      </div>
    </header>
  );
}
