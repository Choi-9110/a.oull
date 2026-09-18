"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/magazine", label: "매거진" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-4 text-sm">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-14 items-center border-b-2 ${active ? "border-meok font-bold" : "border-transparent text-mukhoe"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
