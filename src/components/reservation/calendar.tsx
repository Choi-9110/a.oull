"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

/**
 * 예약 달력 (KST 날짜 문자열 기준). 예약 가능한 날만 선택할 수 있다.
 * availability: 날짜 → 남은 자리 합계 (0이면 마감 표시)
 */
export function ReservationCalendar({
  availability,
  selected,
  onSelect,
}: {
  availability: Map<string, number>;
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const t = useTranslations("reserve");
  const locale = useLocale();
  const dates = [...availability.keys()].sort();
  const first = dates[0];
  const last = dates.at(-1);

  const [month, setMonth] = useState(() =>
    (selected ?? first ?? todayMonth()).slice(0, 7),
  );
  const minMonth = first?.slice(0, 7) ?? month;
  const maxMonth = last?.slice(0, 7) ?? month;

  const fmtMonth = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      }),
    [locale],
  );
  const weekdays = useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
    // 2023-01-01은 일요일
    return Array.from({ length: 7 }, (_, i) =>
      f.format(new Date(Date.UTC(2023, 0, 1 + i))),
    );
  }, [locale]);

  const cells = monthCells(month);

  return (
    <div className="rounded-card border border-jae">
      <div className="flex items-center justify-between border-b border-jae px-1">
        <button
          type="button"
          onClick={() => setMonth(shiftMonth(month, -1))}
          disabled={month <= minMonth}
          aria-label={t("prevMonth")}
          className="flex size-12 items-center justify-center disabled:opacity-25"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <p className="font-serif text-base font-semibold" aria-live="polite">
          {fmtMonth.format(new Date(`${month}-01T00:00:00Z`))}
        </p>
        <button
          type="button"
          onClick={() => setMonth(shiftMonth(month, 1))}
          disabled={month >= maxMonth}
          aria-label={t("nextMonth")}
          className="flex size-12 items-center justify-center disabled:opacity-25"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div role="grid" className="grid grid-cols-7 px-2 pt-2 pb-3 text-center">
        {weekdays.map((w, i) => (
          <span
            key={i}
            role="columnheader"
            className="py-2 text-[11px] font-bold text-mukhoe"
          >
            {w}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const remaining = availability.get(date);
          const bookable = remaining !== undefined && remaining > 0;
          const isFull = remaining === 0;
          const isSelected = date === selected;
          const day = Number(date.slice(8));
          return (
            <button
              key={date}
              type="button"
              role="gridcell"
              disabled={!bookable}
              onClick={() => onSelect(date)}
              aria-selected={isSelected}
              aria-label={`${date}${bookable ? ` · ${t("available")}` : isFull ? ` · ${t("closed")}` : ""}`}
              className={`mx-auto flex size-11 flex-col items-center justify-center rounded-full font-en text-[17px] lining-nums tabular-nums ${
                isSelected
                  ? "bg-meok text-baekja"
                  : bookable
                    ? "text-meok hover:bg-hanji"
                    : "text-jae"
              }`}
            >
              {day}
              <span
                aria-hidden
                className={`mt-0.5 size-1 rounded-full ${
                  bookable
                    ? isSelected
                      ? "bg-baekja"
                      : "bg-meok"
                    : isFull
                      ? "bg-jae"
                      : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function todayMonth() {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 7);
}

function shiftMonth(month: string, delta: number) {
  const d = new Date(`${month}-01T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + delta);
  return d.toISOString().slice(0, 7);
}

/** 해당 월의 달력 칸 (앞쪽 빈칸 포함) */
function monthCells(month: string): (string | null)[] {
  const start = new Date(`${month}-01T00:00:00Z`);
  const lead = start.getUTCDay();
  const days = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: days },
      (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
    ),
  ];
}
