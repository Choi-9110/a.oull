/**
 * 체험 회차 계산 (KST 기준). 서버·클라이언트·테스트에서 같이 쓰는 순수 함수만 둔다.
 */
export type Slot = {
  id: string;
  artisanSlug: string;
  /** KST 날짜 "YYYY-MM-DD" */
  date: string;
  /** KST 시작 시각 "HH:mm" */
  time: string;
  durationMin: number;
  capacity: number;
  remaining: number;
};

type Rule = {
  artisanSlug: string;
  weekday: number;
  startTime: string;
  durationMin: number;
  capacity: number;
};

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 현재 시각의 KST 날짜 문자열 */
export function kstToday(now = new Date()): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export const slotId = (artisanSlug: string, date: string, time: string) =>
  `${artisanSlug}_${date}_${time.replace(":", "")}`;

/** 규칙으로 [from, to] 기간의 회차를 만든다. booked(slotId)로 이미 예약된 인원을 넘긴다. */
export function buildSlots(
  rules: readonly Rule[],
  from: string,
  to: string,
  booked: (id: string) => number = () => 0,
): Slot[] {
  const slots: Slot[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const dow = weekdayOf(date);
    for (const r of rules) {
      if (r.weekday !== dow) continue;
      const id = slotId(r.artisanSlug, date, r.startTime);
      slots.push({
        id,
        artisanSlug: r.artisanSlug,
        date,
        time: r.startTime,
        durationMin: r.durationMin,
        capacity: r.capacity,
        remaining: Math.max(0, r.capacity - booked(id)),
      });
    }
  }
  return slots.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

/** 한국 휴대전화 또는 국제번호(+로 시작) 형식 확인 */
export function normalizePhone(input: string): string | null {
  const raw = input.replace(/[\s-]/g, "");
  if (/^01[016789]\d{7,8}$/.test(raw)) {
    return raw.length === 10
      ? `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`
      : `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
  }
  if (/^\+\d{8,15}$/.test(raw)) return raw;
  return null;
}
