"use client";

import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ConsentBox, type ConsentState } from "@/components/forms/consent-box";
import { BottomCta, Field, TextArea, TextInput } from "@/components/forms/fields";
import { AppHeader } from "@/components/layout/app-header";
import { button, TextLink } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { peekSessionId } from "@/lib/analytics/session";
import { track } from "@/lib/analytics/track";
import { formatPhoneInput } from "@/lib/forms/phone";
import { normalizePhone, type Slot } from "@/lib/reservations/slots";
import { createReservation, type ReservationState } from "@/server/actions/reservations";
import { ReservationCalendar } from "./calendar";

export type ArtisanOption = { slug: string; name: string; craft: string };

type Step = 1 | 2 | 3 | 4;
const TOTAL = 4;

/**
 * F-08 캘린더 예약 — TDS 퍼널: 한 화면에 한 질문, 하단 고정 "다음", 앞 단계 요약·변경
 * 1 장인 → 2 날짜·시간 → 3 인원 → 4 예약자 정보·동의 → 완료
 * 브라우저 뒤로가기는 이전 단계로 돌아간다 (history.state 사용).
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
  const tn = useTranslations("apply");
  const locale = useLocale();
  const toast = useToast();

  // 장인 페이지 CTA(?artisan=)로 들어오면 1단계를 건너뛴다
  const preselected = useSyncExternalStore(
    noopSubscribe,
    () => {
      const slug = new URLSearchParams(window.location.search).get("artisan");
      return artisans.some((a) => a.slug === slug) ? slug : null;
    },
    () => null,
  );
  const firstStep: Step = preselected ? 2 : 1;
  const [pickedArtisan, setPickedArtisan] = useState<string | null>(null);
  const artisan = pickedArtisan ?? preselected;
  const [stepState, setStep] = useState<Step | null>(null);
  const step: Step = stepState ?? firstStep;

  const [date, setDate] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [party, setParty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState<ConsentState>({ privacy: false, age14: false });
  const [touched, setTouched] = useState(false);

  const [state, formAction, pending] = useActionState<ReservationState, FormData>(
    createReservation,
    { status: "idle" },
  );

  // ── 단계 이동: 브라우저 뒤로가기와 연동 ─────────────────────
  const goTo = (next: Step) => {
    window.history.pushState({ ...window.history.state, reserveStep: next }, "");
    setStep(next);
    window.scrollTo({ top: 0 });
  };
  const back = () => window.history.back();
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { reserveStep?: Step } | null)?.reserveStep;
      setStep(s ?? firstStep);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [firstStep]);

  // ── 파생 값 ─────────────────────────────────────────────
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
  const slot = artisanSlots.find((s) => s.id === slotId) ?? null;
  const partyMax = Math.max(1, Math.min(maxPartySize, slot?.remaining ?? maxPartySize));
  const selectedArtisan = artisans.find((a) => a.slug === artisan);

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
  const whenOf = (s: Slot) =>
    `${fmtDate.format(new Date(`${s.date}T00:00:00Z`))} ${s.time}`;

  const nameError = touched && !name.trim() ? tf("nameError") : null;
  const phoneError = touched && !normalizePhone(phone) ? tf("phoneError") : null;
  const consentOk = consent.privacy && consent.age14;

  // 서버 응답 처리: 완료 → 행동 데이터, 실패 → 토스트
  const lastState = useRef(state);
  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.status === "done") {
      track("reservation_submit", {
        artisan: state.slot.artisanSlug,
        props: { slot: state.slot.id, party: state.partySize },
      });
    } else if (state.status === "error") {
      toast(t(`error${state.error}`), "error");
    }
  }, [state, t, toast]);

  // ── 완료 화면 ───────────────────────────────────────────
  if (state.status === "done") {
    const who = artisans.find((a) => a.slug === state.slot.artisanSlug);
    return (
      <>
        <AppHeader backHref="/" title={tn("title")} />
        <div role="status" className="flex flex-col gap-6 px-gutter pt-10 pb-10">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-full bg-meok text-2xl text-baekja"
          >
            ✓
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-heading font-semibold">{t("doneTitle")}</h1>
            <p className="text-body text-mukhoe">{t("doneBody")}</p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 rounded-card bg-hanji p-5 text-body">
            <dt className="text-mukhoe">{t("summaryArtisan")}</dt>
            <dd className="font-bold">{who ? `${who.name} · ${who.craft}` : ""}</dd>
            <dt className="text-mukhoe">{t("summaryWhen")}</dt>
            <dd className="font-bold">{whenOf(state.slot)}</dd>
            <dt className="text-mukhoe">{t("summaryParty")}</dt>
            <dd className="font-bold">{t("people", { n: state.partySize })}</dd>
          </dl>
          <p className="text-label text-mukhoe">{tf("demoNotice")}</p>
          <TextLink href="/artisans" className="self-start">
            {t("doneAnother")}
          </TextLink>
        </div>
      </>
    );
  }

  const titles: Record<Step, string> = {
    1: t("step1"),
    2: t("step2"),
    3: t("step3"),
    4: t("step4"),
  };
  const canGoBack = step > firstStep;

  return (
    <>
      <AppHeader backHref="/" onBack={canGoBack ? back : undefined} title={tn("title")} />

      <div
        role="progressbar"
        aria-label={t("progress", { n: step, total: TOTAL })}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-valuenow={step}
        className="h-[3px] bg-jae"
      >
        <div
          className="h-full bg-meok transition-[width] duration-300"
          style={{ width: `${(step / TOTAL) * 100}%` }}
        />
      </div>

      <form
        action={formAction}
        noValidate
        onSubmit={(e) => {
          if (!name.trim() || !normalizePhone(phone) || !consentOk) {
            e.preventDefault();
            setTouched(true);
          }
        }}
        className="flex flex-col px-gutter pt-7"
      >
        <input type="hidden" name="slotId" value={slotId ?? ""} />
        <input type="hidden" name="partySize" value={party} />
        <input type="hidden" name="locale" value={locale} />
        <SessionField />

        <p className="font-en text-sm text-mukhoe lining-nums">
          {step} / {TOTAL}
        </p>
        <h1 className="mt-1 font-serif text-heading font-semibold">{titles[step]}</h1>

        {/* 앞 단계에서 고른 것 — 눌러서 바로 변경 */}
        {step > 1 && (
          <ul className="mt-5 flex flex-col border-y border-jae">
            {selectedArtisan && (
              <Summary
                label={t("summaryArtisan")}
                value={`${selectedArtisan.name} · ${selectedArtisan.craft}`}
                edit={t("edit")}
                onEdit={() => goTo(1)}
              />
            )}
            {step > 2 && slot && (
              <Summary
                label={t("summaryWhen")}
                value={whenOf(slot)}
                edit={t("edit")}
                onEdit={() => goTo(2)}
              />
            )}
            {step > 3 && (
              <Summary
                label={t("summaryParty")}
                value={t("people", { n: party })}
                edit={t("edit")}
                onEdit={() => goTo(3)}
              />
            )}
          </ul>
        )}

        <div className="mt-6">
          {step === 1 && (
            <ul className="flex flex-col border-t border-jae">
              {artisans.map((a) => (
                <li key={a.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      if (a.slug !== artisan) {
                        setDate(null);
                        setSlotId(null);
                      }
                      setPickedArtisan(a.slug);
                      goTo(2);
                    }}
                    className="tap-row flex min-h-[72px] w-full items-center gap-4 border-b border-jae text-left"
                  >
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="font-serif text-lg font-semibold">{a.name}</span>
                      <span className="text-caption text-mukhoe">{a.craft}</span>
                    </span>
                    <ChevronRight
                      size={20}
                      strokeWidth={1.5}
                      className="text-mukhoe"
                      aria-hidden
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <p className="-mt-2 text-label text-mukhoe">{t("weekdayRule")}</p>
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
              {date && (
                <section className="flex flex-col gap-3">
                  <h2 className="text-[15px] font-bold">{t("timeTitle")}</h2>
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
                              Math.min(
                                p,
                                Math.max(1, Math.min(maxPartySize, s.remaining)),
                              ),
                            );
                          }}
                          aria-pressed={active}
                          className={`tap flex h-[68px] flex-col items-center justify-center gap-1 rounded-btn border ${
                            active
                              ? "border-meok bg-meok text-baekja"
                              : full
                                ? "border-jae bg-hanji text-disabled-ink"
                                : "border-jae text-meok"
                          }`}
                        >
                          <span className="font-en text-xl leading-none lining-nums">
                            {s.time}
                          </span>
                          <span className="text-[12px]">
                            {full
                              ? t("closed")
                              : t("slot", {
                                  remaining: s.remaining,
                                  capacity: s.capacity,
                                })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex items-center gap-6">
                <StepperButton
                  label={t("decrease")}
                  disabled={party <= 1}
                  onClick={() => setParty((p) => Math.max(1, p - 1))}
                >
                  −
                </StepperButton>
                <output
                  aria-live="polite"
                  className="min-w-24 text-center font-en text-6xl leading-none lining-nums"
                >
                  {party}
                </output>
                <StepperButton
                  label={t("increase")}
                  disabled={party >= partyMax}
                  onClick={() => setParty((p) => Math.min(partyMax, p + 1))}
                >
                  +
                </StepperButton>
              </div>
              <p className="text-caption text-mukhoe">
                {t("partyMax", { n: maxPartySize })}
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <p className="-mt-2 text-caption text-mukhoe">{t("step4Sub")}</p>
              <Field label={tf("name")} required error={nameError}>
                {(id, a11y) => (
                  <TextInput
                    id={id}
                    {...a11y}
                    name="name"
                    autoComplete="name"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={tf("namePlaceholder")}
                  />
                )}
              </Field>
              <Field label={tf("phone")} required error={phoneError}>
                {(id, a11y) => (
                  <TextInput
                    id={id}
                    {...a11y}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder={tf("phonePlaceholder")}
                  />
                )}
              </Field>
              <Field label={tf("message")} hint={t("messageHint")}>
                {(id, a11y) => (
                  <TextArea id={id} {...a11y} name="message" rows={3} maxLength={500} />
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
              <ConsentBox
                kind="reserve"
                value={consent}
                onChange={setConsent}
                showError={touched}
              />
              <p className="text-label text-mukhoe">{tf("demoNotice")}</p>
            </div>
          )}
        </div>

        {step > 1 && (
          <BottomCta>
            {step < 4 ? (
              <button
                type="button"
                disabled={step === 2 && !slotId}
                onClick={() => goTo((step + 1) as Step)}
                className={`${button.base} w-full ${step === 2 && !slotId ? button.disabled : button.solid}`}
              >
                {t("next")}
              </button>
            ) : (
              <button
                type="submit"
                disabled={pending}
                className={`${button.base} ${button.solid} w-full`}
              >
                {pending ? t("submitting") : t("submit")}
              </button>
            )}
          </BottomCta>
        )}
      </form>
    </>
  );
}

function Summary({
  label,
  value,
  edit,
  onEdit,
}: {
  label: string;
  value: string;
  edit: string;
  onEdit: () => void;
}) {
  return (
    <li className="flex min-h-12 items-center gap-3 border-b border-jae text-body last:border-b-0">
      <span className="w-14 shrink-0 text-label text-mukhoe">{label}</span>
      <span className="flex-1 truncate font-bold">{value}</span>
      <button
        type="button"
        onClick={onEdit}
        className="tap flex h-10 items-center px-1 text-label text-nambit underline underline-offset-2"
      >
        {edit}
      </button>
    </li>
  );
}

function StepperButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="tap flex size-14 items-center justify-center rounded-full border border-meok text-2xl disabled:border-jae disabled:text-jae"
    >
      {children}
    </button>
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
