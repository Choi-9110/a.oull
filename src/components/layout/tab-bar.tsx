"use client";

import { BookOpen, Ellipsis, House, Shapes, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const TABS = [
  { href: "/", key: "home", Icon: House },
  { href: "/crafts", key: "crafts", Icon: Shapes },
  { href: "/artisans", key: "artisans", Icon: UserRound },
  { href: "/magazine", key: "magazine", Icon: BookOpen },
  { href: "/more", key: "more", Icon: Ellipsis },
] as const;

/** 장인 상세(구매·예약 CTA)와 예약·문의 폼(다음·보내기 버튼)에서는 하단 고정 버튼이 탭바 자리를 대신한다. */
const HIDDEN_ON = /^\/(artisans\/[^/]+|apply|contact)$/;

export function TabBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  if (HIDDEN_ON.test(pathname)) return null;

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[var(--shell-max-width)] border-t border-jae bg-baekja">
      <ul className="grid h-tabbar grid-cols-5">
        {TABS.map(({ href, key, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`tap flex h-full flex-col items-center justify-center gap-1 text-[11px] ${
                  active ? "font-bold text-meok" : "text-mukhoe"
                }`}
              >
                <Icon size={21} strokeWidth={active ? 1.9 : 1.5} aria-hidden />
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
