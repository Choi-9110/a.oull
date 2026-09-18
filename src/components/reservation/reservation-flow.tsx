"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { ConsentBox } from "@/components/forms/consent-box";
import { Field, TextArea, TextInput } from "@/components/forms/fields";
import { button, TextLink } from "@/components/ui/primitives";
import { peekSessionId } from "@/lib/analytics/session";
import { track } from "@/lib/analytics/track";
import type { Slot } from "@/lib/reservations/slots";
import { createReservation, type ReservationState } from "@/server/actions/reservations";
import { ReservationCalendar } from "./calendar";

export type ArtisanOption = { slug: string; label: string };

/**
 * F-08 캘린더 예약 (docs/features.md §3)
 * 장인 → 날짜(정해진 요일만) → 회차(남은 자리) → 인원 → 이름·연락처 → 필수 동의 → 신청
 */
export function ReservationFlow({
  artisans,
  slots,
  maxPartySize,
}: {
  artisans: ArtisanOption[];
  slots: Slot[];
  maxPartySize: number;
}) {
  const t = useTranslations("reserve");
  const tf = useTranslations("form");
  const locale = useLocale();

  // 장인 페이지 CTA에서 ?artisan= 으로 들어오면 미리 선택 (사용자가 바꾸면 그 값 우선)
  const preselected = useSyncExternalStore(
    noopSubscribe,
    () => {
      const slug = new URLSearchParams(window.location.search).get("artisan");
      return artisans.some((a) => a.slug === slug) ? slug : null;
    },
    () => null,
  );
  const [pickedArtisan, setPickedArtisan] = useState<string | null>(null);
  const artisan = pickedArtisan ?? preselected ?? artisans[0]?.slug ?? null;

  const [date, setDate] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [party, setParty] = useState(1);

  const [state, formAction, pending] = useActionState<ReservationState, FormData>(
    createReservation,
    { status: "idle" },
  );

  const artisanSlots = useMemo(
    () => slots.filter((s) => s.artisanSlug === artisan),
    [slots, artisan],
  );
  const availability = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of artisanSlots) map.set(s.date, (map.get(s.date) ?? 0) + s.remaining);
    return map;
  }, [artisanSlots]);
  const daySlots = artisanSlots.filter((s) => s.date === date);
  const slot = daySlots.find((s) => s.id === slotId) ?? null;
  const partyMax = Math.max(1, Math.min(maxPartySize, slot?.remaining ?? maxPartySize));

  const fmtDate = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        weekday: "short",
        timeZone: "UTC",
      }),
    [locale],
  );

  useEffect(() => {
    if (state.status === "done") {
      track("reservation_submit", {
        artisan: state.slot.artisanSlug,
        props: { slot: state.slot.id, party: state.partySize },
      });
    }
  }, [state]);

  if (state.status === "done") {
    const who = artisans.find((a) => a.slug === state.slot.artisanSlug)?.label ?? "";
    return (
      <div role="status" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 rounded-card bg-hanji p-5">
          <p className="font-serif text-heading font-semibold">{t("doneTitle")}</p>
          <p className="text-body text-mukhoe">{t("doneBody")}</p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-y border-jae py-4 text-body">
          <dt className="text-mukhoe">{t("summaryArtisan")}</dt>
          <dd className="font-medium">{who}</dd>
          <dt className="text-mukhoe">{t("summaryWhen")}</dt>
          <dd className="font-medium">
            {fmtDate.format(new Date(`${state.slot.date}T00:00:00Z`))} {state.slot.time}
          </dd>
          <dt className="text-mukhoe">{t("summaryParty")}</dt>
          <dd className="font-medium">{t("people", { n: state.partySize })}</dd>
        </dl>
        <p className="text-label text-mukhoe">{tf("demoNotice")}</p>
        <TextLink href="/artisans" className="self-start">
          {t("doneAnother")}
        </TextLink>
      </div>
    );
  }

  const selectArtisan = (slug: string) => {
    setPickedArtisan(slug);
    setDate(null);
    setSlotId(null);
  };

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="slotId" value={slotId ?? ""} />
      <input type="hidden" name="partySize" value={party} />
      <input type="hidden" name="locale" value={locale} />
      <SessionField />

      <Step n={1} title={t("artisan")}>
        <div className="flex flex-wrap gap-2.5">
          {artisans.map((a) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => selectArtisan(a.slug)}
              aria-pressed={a.slug === artisan}
              className={`h-12 rounded-btn border px-5 text-sm font-medium ${
                a.slug === artisan
                  ? "border-meok bg-meok text-baekja"
                  : "border-jae text-meok"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Step>

      <Step n={2} title={t("date")} hint={t("weekdayRule")}>
        {availability.size ? (
          <ReservationCalendar
            key={artisan}
            availability={availability}
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setSlotId(null);
            }}
          />
        ) : (
          <p className="rounded-card bg-hanji p-4 text-body text-mukhoe">
            {t("noSlots")}
          </p>
        )}
      </Step>

      <Step n={3} title={t("time")}>
        {!date ? (
          <p className="text-caption text-mukhoe">{t("selectDateFirst")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {daySlots.map((s) => {
              const full = s.remaining === 0;
              const active = s.id === slotId;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={full}
                  onClick={() => {
                    setSlotId(s.id);
                    setParty((p) =>
                      Math.min(p, Math.max(1, Math.min(maxPartySize, s.remaining))),
                    );
                  }}
                  aria-pressed={active}
                  className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-btn border ${
                    active
                      ? "border-meok bg-meok text-baekja"
                      : full
                        ? "border-jae bg-hanji text-disabled-ink"
                        : "border-jae text-meok"
                  }`}
                >
                  <span className="font-en text-xl leading-none lining-nums tabular-nums">
                    {s.time}
                  </span>
                  <span className="text-[11px]">
                    {full
                      ? t("closed")
                      : t("slot", { remaining: s.remaining, capacity: s.capacity })}
                    {" · "}
                    {t("duration", { h: s.durationMin / 60 })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Step>

      <Step n={4} title={t("party")} hint={t("partyMax", { n: maxPartySize })}>
        <div className="flex w-fit items-center overflow-hidden rounded-btn border border-meok">
          <button
            type="button"
            onClick={() => setParty((p) => Math.max(1, p - 1))}
            disabled={party <= 1}
            aria-label={t("decrease")}
            className="flex size-12 items-center justify-center text-xl disabled:text-jae"
          >
            −
          </button>
          <output
            aria-live="polite"
            className="min-w-16 text-center font-en text-xl lining-nums tabular-nums"
          >
            {party}
          </output>
          <button
            type="button"
            onClick={() => setParty((p) => Math.min(partyMax, p + 1))}
            disabled={party >= partyMax}
            aria-label={t("increase")}
            className="flex size-12 items-center justify-center text-xl disabled:text-jae"
          >
            +
          </button>
        </div>
      </Step>

      <Step n={5} title={t("info")}>
        <div className="flex flex-col gap-5">
          <Field label={tf("name")} required>
            {(id) => (
              <TextInput
                id={id}
                name="name"
                autoComplete="name"
                required
                maxLength={50}
                placeholder={tf("namePlaceholder")}
              />
            )}
          </Field>
          <Field label={tf("phone")} required>
            {(id) => (
              <TextInput
                id={id}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                maxLength={25}
                placeholder={tf("phonePlaceholder")}
              />
            )}
          </Field>
          <Field label={tf("message")}>
            {(id) => (
              <>
                <TextArea id={id} name="message" rows={3} maxLength={500} />
                <span className="text-label text-mukhoe">{t("messageHint")}</span>
              </>
            )}
          </Field>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />
          <ConsentBox kind="reserve" />
        </div>
      </Step>

      {state.status === "error" && (
        <p role="alert" className="text-caption font-bold text-onggi">
          {t(`error${state.error}`)}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!slotId || pending}
          className={`${button.base} ${slotId && !pending ? button.solid : button.disabled}`}
        >
          {pending ? t("submitting") : t("submit")}
        </button>
        <p className="text-label text-mukhoe">{tf("demoNotice")}</p>
      </div>
    </form>
  );
}

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3 border-b border-meok pb-2">
        <span className="font-en text-lg leading-none text-mukhoe lining-nums tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="text-[15px] font-bold">{title}</h2>
        {hint && <span className="ml-auto text-[11px] text-mukhoe">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/** 예약과 행동 데이터를 세션 ID로 연결 (익명 ID, 개인정보 아님) */
function SessionField() {
  const sessionId = useSyncExternalStore(
    noopSubscribe,
    () => peekSessionId() ?? "",
    () => "",
  );
  return <input type="hidden" name="sessionId" value={sessionId} />;
}

const noopSubscribe = () => () => {};
