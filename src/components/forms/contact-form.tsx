"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { button } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { ConsentBox, type ConsentState } from "./consent-box";
import { BottomCta, Field, TextArea, TextInput } from "./fields";

/**
 * F-07 문의 폼 — TDS 입력 패턴(항목별 즉시 안내, 하단 고정 보내기)
 * 현재는 디자인 확인용(데모). Supabase 연결 시 Server Action으로 inquiries에 저장.
 */
export function ContactForm() {
  const t = useTranslations("form");
  const toast = useToast();
  const [values, setValues] = useState({ name: "", contact: "", message: "" });
  const [consent, setConsent] = useState<ConsentState>({ privacy: false, age14: false });
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  const errors = {
    name: touched && !values.name.trim() ? t("nameError") : null,
    contact: touched && !values.contact.trim() ? t("contactError") : null,
    message: touched && !values.message.trim() ? t("messageError") : null,
  };
  const set = (k: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = Object.values(values).every((v) => v.trim()) && consent.privacy;
    if (!ok) {
      setTouched(true);
      toast(t("required"), "error");
      return;
    }
    setDone(true);
  };

  if (done) return <Done message={t("success")} notice={t("demoNotice")} />;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label={t("name")} required error={errors.name}>
        {(id, a11y) => (
          <TextInput
            id={id}
            {...a11y}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            placeholder={t("namePlaceholder")}
          />
        )}
      </Field>
      <Field label={t("contact")} required error={errors.contact}>
        {(id, a11y) => (
          <TextInput
            id={id}
            {...a11y}
            name="contact"
            autoComplete="email"
            value={values.contact}
            onChange={set("contact")}
            placeholder={t("contactPlaceholder")}
          />
        )}
      </Field>
      <Field label={t("message")} required error={errors.message}>
        {(id, a11y) => (
          <TextArea
            id={id}
            {...a11y}
            name="message"
            value={values.message}
            onChange={set("message")}
            placeholder={t("messagePlaceholder")}
          />
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
      <ConsentBox
        kind="contact"
        value={consent}
        onChange={setConsent}
        showError={touched}
      />
      <p className="text-label text-mukhoe">{t("demoNotice")}</p>
      <BottomCta>
        <button type="submit" className={`${button.base} ${button.solid} w-full`}>
          {t("submit")}
        </button>
      </BottomCta>
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
