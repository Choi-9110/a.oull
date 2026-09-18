/** 탭 루트 페이지 제목: Cormorant 영문 + 숫자, Noto Serif 제목 (브랜드 키트 02) */
export function PageTitle({
  en,
  count,
  title,
  sub,
}: {
  en: string;
  count?: number;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-gutter pt-8 pb-6">
      <p className="font-en text-lg tracking-[0.04em] text-nambit">
        {en}
        {count !== undefined && ` ${String(count).padStart(2, "0")}`}
      </p>
      <h1 className="font-serif text-display font-semibold">{title}</h1>
      {sub && <p className="text-caption text-mukhoe">{sub}</p>}
    </div>
  );
}
