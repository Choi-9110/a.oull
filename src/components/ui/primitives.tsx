import { ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

/**
 * 브랜드 키트 04 UI 컴포넌트.
 * - 버튼 모서리 2px, 카드 4px, 터치 타깃 48px 이상
 * - 옹기(primary)는 한 화면에 하나 — 구매 CTA 전용
 * - 층은 그림자 대신 한지 면 + 1px 재 보더
 */
export const button = {
  base: "inline-flex h-[52px] items-center justify-center gap-2 rounded-btn px-6 text-[15px] font-bold transition-colors",
  primary: "bg-onggi text-baekja hover:bg-onggi-hover",
  secondary: "border border-meok text-meok hover:bg-meok hover:text-baekja",
  solid: "border border-meok bg-meok text-baekja hover:bg-nambit",
  disabled: "border border-jae bg-hanji text-disabled-ink",
} as const;

export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`inline-flex min-h-12 items-center border-b border-nambit text-[15px] font-medium text-nambit hover:text-meok ${className}`}
    />
  );
}

/** 사진이 들어오기 전 자리표시자 (브랜드 키트: 재 #D8D3C7 면 + 설명) */
export function PhotoPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-jae px-2 text-center text-[11px] leading-snug text-mukhoe ${className}`}
      role="img"
      aria-label={label}
    >
      [{label}]
    </div>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel,
  as: Tag = "h2",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex items-baseline justify-between">
      <Tag className="font-serif text-lg font-semibold">{title}</Tag>
      {href && linkLabel && (
        <Link href={href} className="flex min-h-12 items-center text-caption text-nambit">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/** 섹션 레이블 (Label: 11~12 / 0.18em / 700 / 묵회) */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`label ${className}`}>{children}</p>;
}

/** 목록형 행 링크 (더보기 메뉴, 공예 목록 등) */
export function RowLink({
  href,
  children,
  aside,
}: {
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-14 items-center gap-3 border-b border-jae py-3"
    >
      <span className="min-w-0 flex-1">{children}</span>
      {aside}
      <ChevronRight
        size={18}
        strokeWidth={1.5}
        className="shrink-0 text-mukhoe"
        aria-hidden
      />
    </Link>
  );
}

/** 재생 중 표시 점 (청자 깊은) */
export function DocentDot() {
  return (
    <span className="inline-block size-[5px] rounded-full bg-cheongja-deep" aria-hidden />
  );
}

export function formatDuration(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
