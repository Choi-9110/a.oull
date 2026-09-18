import { describe, expect, it } from "vitest";
import {
  addDays,
  buildSlots,
  kstToday,
  normalizePhone,
  weekdayOf,
} from "@/lib/reservations/slots";

const rules = [
  { artisanSlug: "a", weekday: 6, startTime: "10:00", durationMin: 120, capacity: 6 },
  { artisanSlug: "a", weekday: 6, startTime: "14:00", durationMin: 120, capacity: 6 },
];

describe("buildSlots", () => {
  it("규칙의 요일(토)에만 회차를 만든다", () => {
    // 2026-09-19 는 토요일
    const slots = buildSlots(rules, "2026-09-14", "2026-09-27");
    expect(slots.map((s) => `${s.date} ${s.time}`)).toEqual([
      "2026-09-19 10:00",
      "2026-09-19 14:00",
      "2026-09-26 10:00",
      "2026-09-26 14:00",
    ]);
    expect(slots.every((s) => weekdayOf(s.date) === 6)).toBe(true);
  });

  it("예약 인원만큼 남은 자리를 줄이고 0 아래로 내려가지 않는다", () => {
    const [slot] = buildSlots(rules, "2026-09-19", "2026-09-19", (id) =>
      id.endsWith("1000") ? 9 : 2,
    );
    expect(slot.remaining).toBe(0);
    const [, afternoon] = buildSlots(rules, "2026-09-19", "2026-09-19", () => 2);
    expect(afternoon.remaining).toBe(4);
  });
});

describe("dates (KST)", () => {
  it("UTC 15:00 이후는 KST로 다음 날", () => {
    expect(kstToday(new Date("2026-09-18T15:30:00Z"))).toBe("2026-09-19");
    expect(kstToday(new Date("2026-09-18T14:59:00Z"))).toBe("2026-09-18");
  });
  it("월말을 넘어 날짜를 더한다", () => {
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
  });
});

describe("normalizePhone", () => {
  it("국내 휴대전화를 하이픈 형식으로 맞춘다", () => {
    expect(normalizePhone("01012345678")).toBe("010-1234-5678");
    expect(normalizePhone("010 1234 5678")).toBe("010-1234-5678");
  });
  it("국제번호(+)를 허용한다", () => {
    expect(normalizePhone("+81 90-1234-5678")).toBe("+819012345678");
  });
  it("형식이 틀리면 null", () => {
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("02-123-4567")).toBeNull();
  });
});
