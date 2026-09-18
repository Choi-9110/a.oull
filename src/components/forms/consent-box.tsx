"use client";

import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Link } from "@/i18n/navigation";

export type ConsentState = { privacy: boolean; age14: boolean };

/**
 * 개인정보 수집·이용 동의 — TDS 동의 패턴(전체 동의 + [필수] 항목별 행 + 보기)
 * 법적 요건(개인정보 보호법 제15조 제2항 4가지 고지, 제22조 구분 동의)은 그대로 지킨다:
 * - 고지 4항목은 "보기"로 펼쳐 확인할 수 있고, 처음부터 체크돼 있지 않다
 * - 폼 전송 값: privacy="on", age14="on"(예약만)
 */
export function ConsentBox({
  kind,
  value,
  onChange,
  showError = false,
}: {
  kind: "reserve" | "contact";
  value: ConsentState;
  onChange: (next: ConsentState) => void;
  showError?: boolean;
}) {
  const t = useTranslations("consent");
  const [open, setOpen] = useState(false);
  const detailId = useId();

  const needsAge = kind === "reserve";
  const allChecked = value.privacy && (!needsAge || value.age14);
  const setAll = (v: boolean) =>
    onChange({ privacy: v, age14: needsAge ? v : value.age14 });

  const rows = [
    [t("items"), t(`${kind}Items`)],
    [t("purpose"), t(`${kind}Purpose`)],
    [t("retention"), t(`${kind}Retention`)],
    [
      t("refuse"),
      t("refuseBody", {
        service: t(kind === "reserve" ? "serviceReserve" : "serviceContact"),
      }),
    ],
  ] as const;

  return (
    <fieldset className="flex flex-col rounded-card border border-jae">
      <legend className="sr-only">{t("title")}</legend>
      {value.privacy && <input type="hidden" name="privacy" value="on" />}
      {needsAge && value.age14 && <input type="hidden" name="age14" value="on" />}

      <CheckRow checked={allChecked} onChange={setAll} strong>
        {t("all")}
      </CheckRow>

      <div className="border-t border-jae">
        <div className="flex items-center">
          <CheckRow
            checked={value.privacy}
            onChange={(v) => onChange({ ...value, privacy: v })}
          >
            <span className="text-mukhoe">{t("requiredTag")}</span> {t("privacyRow")}
          </CheckRow>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={detailId}
            className="tap flex h-14 shrink-0 items-center gap-0.5 px-4 text-label text-mukhoe"
          >
            {open ? t("hide") : t("view")}
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>
        <dl
          id={detailId}
          hidden={!open}
          className="mx-4 mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-card bg-hanji p-3 text-label leading-relaxed"
        >
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-bold whitespace-nowrap text-mukhoe">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        {needsAge && (
          <CheckRow
            checked={value.age14}
            onChange={(v) => onChange({ ...value, age14: v })}
            hint={t("age14Hint")}
          >
            <span className="text-mukhoe">{t("requiredTag")}</span> {t("age14")}
          </CheckRow>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-jae px-4 py-2.5">
        {showError && !allChecked ? (
          <p role="alert" className="text-label font-bold text-onggi">
            {t("error")}
          </p>
        ) : (
          <span />
        )}
        <Link
          href="/privacy"
          className="tap text-label text-nambit underline underline-offset-2"
        >
          {t("policyLink")}
        </Link>
      </div>
    </fieldset>
  );
}

function CheckRow({
  checked,
  onChange,
  strong,
  hint,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  strong?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="tap-row flex min-h-14 w-full flex-1 items-center gap-3 px-4 py-2 text-left"
    >
      <span
        aria-hidden
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked ? "border-meok bg-meok text-baekja" : "border-jae text-jae"
        }`}
      >
        <Check size={15} strokeWidth={2.6} />
      </span>
      <span className="flex flex-col">
        <span className={strong ? "text-body-l font-bold" : "text-body"}>{children}</span>
        {hint && <span className="text-label text-mukhoe">{hint}</span>}
      </span>
    </button>
  );
}
