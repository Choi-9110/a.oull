"use server";

import { z } from "zod";
import { bookingPolicy } from "@/data/fixtures/experiences";
import { routing } from "@/i18n/routing";
import { normalizePhone, type Slot } from "@/lib/reservations/slots";
import { reserve } from "@/server/reservations/store";

const input = z.object({
  slotId: z.string().min(1).max(80),
  partySize: z.coerce.number().int().min(1).max(bookingPolicy.maxPartySize),
  name: z.string().trim().min(1).max(50),
  phone: z.string().trim().min(8).max(25),
  message: z.string().trim().max(500).optional().default(""),
  locale: z.enum(routing.locales),
  sessionId: z.string().max(80).optional(),
  privacy: z.literal("on"),
  age14: z.literal("on"),
  // honeypot: 사람은 비워 둔다
  website: z.string().max(0).optional().default(""),
});

export type ReservationState =
  | { status: "idle" }
  | { status: "error"; error: "INVALID" | "PHONE" | "SLOT_FULL" | "SLOT_UNAVAILABLE" }
  | { status: "done"; slot: Slot; partySize: number; name: string };

/**
 * F-08 체험 예약 생성
 * 데모 모드에서는 정원 계산만 하고 이름·연락처는 저장하지 않는다.
 * Supabase 연결 시 create_reservation RPC(정원 잠금 + 보유기간 설정)로 교체한다.
 */
export async function createReservation(
  _prev: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const parsed = input.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", error: "INVALID" };

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return { status: "error", error: "PHONE" };

  const result = await reserve(parsed.data.slotId, parsed.data.partySize);
  if (!result.ok) return { status: "error", error: result.error };

  return {
    status: "done",
    slot: result.slot,
    partySize: result.partySize,
    name: parsed.data.name,
  };
}
