"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const TABS = [
  { href: "/", key: "home" },
  { href: "/crafts", key: "crafts" },
  { href: "/artisans", key: "artisans" },
  { href: "/magazine", key: "magazine" },
  { href: "/about", key: "more" },
] as const;

export function TabBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[var(--shell-max-width)] border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid h-tabbar grid-cols-5">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full items-center justify-center text-sm ${
                  active ? "font-semibold text-fg" : "text-muted"
                }`}
              >
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
