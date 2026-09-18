"use client";

import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { button } from "@/components/ui/primitives";
import { Done } from "./contact-form";
import { Field, PrivacyConsent, Select, TextArea, TextInput } from "./fields";

export type ApplyOption = { value: string; label: string };

/**
 * F-08 체험 예약 폼 — 장인 페이지 CTA에서 ?artisan={slug}로 들어오면 미리 선택된다.
 * 현재는 디자인 확인용(데모). Supabase 연결 시 reservations에 저장.
 */
export function ApplyForm({
  artisanOptions,
  craftOptions,
  artisanGroupLabel,
  craftGroupLabel,
}: {
  artisanOptions: ApplyOption[];
  craftOptions: ApplyOption[];
  artisanGroupLabel: string;
  craftGroupLabel: string;
}) {
  const t = useTranslations("apply");
  const tf = useTranslations("form");
  // 장인 페이지 CTA에서 넘어온 ?artisan= 을 기본 선택으로 (사용자가 고르면 그 값 우선)
  const preselected = useSyncExternalStore(
    noopSubscribe,
    () => {
      const slug = new URLSearchParams(window.location.search).get("artisan");
      const value = `artisan:${slug}`;
      return slug && artisanOptions.some((o) => o.value === value) ? value : "";
    },
    () => "",
  );
  const [picked, setPicked] = useState<string | null>(null);
  const target = picked ?? preselected;
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok =
      ["name", "phone"].every((k) => String(form.get(k) ?? "").trim()) &&
      target &&
      agreed;
    setState(ok ? "done" : "error");
  };

  if (state === "done") return <Done message={tf("success")} notice={tf("demoNotice")} />;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label={t("artisan")} required>
        {(id) => (
          <Select
            id={id}
            name="target"
            value={target}
            onChange={(e) => setPicked(e.target.value)}
          >
            <option value="" disabled>
              {t("artisanPlaceholder")}
            </option>
            <optgroup label={artisanGroupLabel}>
              {artisanOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
            <optgroup label={craftGroupLabel}>
              {craftOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          </Select>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("date")}>
          {(id) => <TextInput id={id} name="date" type="date" min={today} />}
        </Field>
        <Field label={t("people")}>
          {(id) => (
            <TextInput
              id={id}
              name="people"
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              defaultValue={1}
            />
          )}
        </Field>
      </div>
      <Field label={t("time")}>
        {(id) => (
          <Select id={id} name="time" defaultValue="">
            <option value="" disabled>
              {t("artisanPlaceholder")}
            </option>
            <option value="am">{t("timeMorning")}</option>
            <option value="pm">{t("timeAfternoon")}</option>
          </Select>
        )}
      </Field>
      <Field label={tf("name")} required>
        {(id) => (
          <TextInput
            id={id}
            name="name"
            autoComplete="name"
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
            autoComplete="tel"
            placeholder={tf("phonePlaceholder")}
          />
        )}
      </Field>
      <Field label={t("note")}>
        {(id) => (
          <TextArea id={id} name="note" rows={3} placeholder={t("notePlaceholder")} />
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
      <PrivacyConsent
        label={tf("privacy")}
        detail={tf("privacyDetail")}
        checked={agreed}
        onChange={setAgreed}
      />
      {state === "error" && (
        <p role="alert" className="text-caption font-bold text-onggi">
          {tf("required")}
        </p>
      )}
      <button type="submit" className={`${button.base} ${button.solid}`}>
        {t("submit")}
      </button>
      <p className="text-label text-mukhoe">{tf("demoNotice")}</p>
    </form>
  );
}

const noopSubscribe = () => () => {};
