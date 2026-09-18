/**
 * [샘플] 체험 일정 규칙 — 확정 전 임시값 (docs/features.md §7-1, 7-2)
 * Supabase 연결 후에는 experience_rules / experience_slots 테이블이 원본이 된다.
 */
export type ExperienceRule = {
  artisanSlug: string;
  /** 0=일 … 6=토 (KST) */
  weekday: number;
  startTime: string; // "HH:mm"
  durationMin: number;
  capacity: number;
};

export const experienceRules: ExperienceRule[] = [
  {
    artisanSlug: "kim-jinhwan",
    weekday: 6,
    startTime: "10:00",
    durationMin: 120,
    capacity: 6,
  },
  {
    artisanSlug: "kim-jinhwan",
    weekday: 6,
    startTime: "14:00",
    durationMin: 120,
    capacity: 6,
  },
  {
    artisanSlug: "cheon-giyeong",
    weekday: 6,
    startTime: "10:00",
    durationMin: 120,
    capacity: 6,
  },
  {
    artisanSlug: "cheon-giyeong",
    weekday: 6,
    startTime: "14:00",
    durationMin: 120,
    capacity: 6,
  },
];

export const bookingPolicy = {
  /** 당일 예약 불가: 최소 N일 뒤부터 */
  minDaysAhead: 1,
  maxDaysAhead: 60,
  /** 1건당 최대 인원 [샘플] */
  maxPartySize: 4,
  /** 개인정보 보유기간: 체험일로부터 N일 뒤 파기 */
  retentionDays: 30,
} as const;
