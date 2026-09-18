"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import { Link } from "@/i18n/navigation";

/**
 * 개인정보 수집·이용 동의 (개인정보 보호법 제15조 제2항 필수 고지 4가지 + 제22조 구분 동의)
 * - 미리 체크해 두지 않는다
 * - 체크박스 name="privacy"(필수), 예약은 name="age14"(만 14세 이상 확인) 추가
 */
export function ConsentBox({ kind }: { kind: "reserve" | "contact" }) {
  const t = useTranslations("consent");
  const id = useId();

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
    <fieldset className="flex flex-col gap-3 rounded-card bg-hanji p-4">
      <legend className="sr-only">{t("title")}</legend>
      <p className="text-caption font-bold">{t("title")}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-y border-jae py-3 text-label leading-relaxed">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-bold whitespace-nowrap text-mukhoe">{k}</dt>
            <dd className="text-meok">{v}</dd>
          </div>
        ))}
      </dl>
      <label
        htmlFor={`${id}-privacy`}
        className="flex min-h-12 cursor-pointer items-center gap-3"
      >
        <input
          id={`${id}-privacy`}
          type="checkbox"
          name="privacy"
          required
          className="size-5 shrink-0 accent-meok"
        />
        <span className="text-body font-medium">{t("agree")}</span>
      </label>
      {kind === "reserve" && (
        <label
          htmlFor={`${id}-age`}
          className="flex min-h-12 cursor-pointer items-start gap-3 pt-1"
        >
          <input
            id={`${id}-age`}
            type="checkbox"
            name="age14"
            required
            className="mt-0.5 size-5 shrink-0 accent-meok"
          />
          <span className="flex flex-col">
            <span className="text-body font-medium">{t("age14")}</span>
            <span className="text-label text-mukhoe">{t("age14Hint")}</span>
          </span>
        </label>
      )}
      <Link
        href="/privacy"
        className="self-start text-label text-nambit underline underline-offset-2"
      >
        {t("policyLink")}
      </Link>
    </fieldset>
  );
}
