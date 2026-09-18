"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { button } from "@/components/ui/primitives";
import { Field, PrivacyConsent, TextArea, TextInput } from "./fields";

/**
 * F-07 문의 폼 — 현재는 디자인 확인용(데모). Supabase 연결 시 Server Action으로 inquiries에 저장.
 */
export function ContactForm() {
  const t = useTranslations("form");
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok =
      ["name", "contact", "message"].every((k) => String(form.get(k) ?? "").trim()) &&
      agreed;
    setState(ok ? "done" : "error");
  };

  if (state === "done") return <Done message={t("success")} notice={t("demoNotice")} />;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label={t("name")} required>
        {(id) => (
          <TextInput
            id={id}
            name="name"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
          />
        )}
      </Field>
      <Field label={t("contact")} required>
        {(id) => (
          <TextInput id={id} name="contact" placeholder={t("contactPlaceholder")} />
        )}
      </Field>
      <Field label={t("message")} required>
        {(id) => (
          <TextArea id={id} name="message" placeholder={t("messagePlaceholder")} />
        )}
      </Field>
      {/* 스팸 방지 honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <PrivacyConsent
        label={t("privacy")}
        detail={t("privacyDetail")}
        checked={agreed}
        onChange={setAgreed}
      />
      {state === "error" && (
        <p role="alert" className="text-caption font-bold text-onggi">
          {t("required")}
        </p>
      )}
      <button type="submit" className={`${button.base} ${button.solid}`}>
        {t("submit")}
      </button>
      <p className="text-label text-mukhoe">{t("demoNotice")}</p>
    </form>
  );
}

export function Done({ message, notice }: { message: string; notice: string }) {
  return (
    <div role="status" className="flex flex-col gap-2 rounded-card bg-hanji p-6">
      <p className="font-serif text-lg font-semibold">{message}</p>
      <p className="text-caption text-mukhoe">{notice}</p>
    </div>
  );
}
