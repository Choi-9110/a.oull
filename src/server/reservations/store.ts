import "server-only";
import { bookingPolicy, experienceRules } from "@/data/fixtures/experiences";
import { addDays, buildSlots, kstToday, type Slot } from "@/lib/reservations/slots";

/**
 * 예약 저장소 (데모 모드)
 * - Supabase 연결 전: 회차는 규칙으로 계산하고, 예약 인원은 서버 메모리에만 보관한다.
 *   이름·연락처는 저장하지 않는다(재시작하면 사라짐). 디자인·흐름 확인용.
 * - Supabase 연결 후: get_available_slots / create_reservation RPC로 교체한다.
 */
const booked = new Map<string, number>();

/** 데모 화면이 비어 보이지 않도록 일부 회차에 이미 예약이 있는 것처럼 보여준다 */
function demoBooked(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const seeded = [0, 2, 3, 5, 6][h % 5];
  return seeded + (booked.get(id) ?? 0);
}

export function bookingRange() {
  const today = kstToday();
  return {
    from: addDays(today, bookingPolicy.minDaysAhead),
    to: addDays(today, bookingPolicy.maxDaysAhead),
  };
}

export async function getSlots(artisanSlug?: string): Promise<Slot[]> {
  const { from, to } = bookingRange();
  const rules = artisanSlug
    ? experienceRules.filter((r) => r.artisanSlug === artisanSlug)
    : experienceRules;
  return buildSlots(rules, from, to, demoBooked);
}

export type ReserveResult =
  | { ok: true; slot: Slot; partySize: number }
  | { ok: false; error: "SLOT_UNAVAILABLE" | "SLOT_FULL" };

export async function reserve(slotId: string, partySize: number): Promise<ReserveResult> {
  const slot = (await getSlots()).find((s) => s.id === slotId);
  if (!slot) return { ok: false, error: "SLOT_UNAVAILABLE" };
  if (partySize > slot.remaining) return { ok: false, error: "SLOT_FULL" };
  booked.set(slotId, (booked.get(slotId) ?? 0) + partySize);
  return {
    ok: true,
    slot: { ...slot, remaining: slot.remaining - partySize },
    partySize,
  };
}
