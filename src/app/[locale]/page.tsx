import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";

const SECTIONS = [
  { href: "/crafts", key: "crafts" },
  { href: "/artisans", key: "artisans" },
  { href: "/regions/tongyeong", key: "regions" },
  { href: "/magazine", key: "magazine" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/apply", key: "apply" },
] as const;

// F-01 메인홈
export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      <h1 className="text-3xl tracking-[0.2em]">A.OULL</h1>

      <form action={`/${locale}/search`} className="w-full">
        <input
          type="search"
          name="q"
          placeholder={t("searchPlaceholder")}
          className="h-12 w-full rounded-xl border border-line bg-white/60 px-4 text-base outline-none focus:border-fg"
        />
      </form>

      <ul className="grid grid-cols-2 gap-3">
        {SECTIONS.map((s) => (
          <li key={s.key}>
            <Link
              href={s.href}
              className="flex h-24 items-end rounded-2xl border border-line p-4 text-base font-medium"
            >
              {t(`sections.${s.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
