"use client";

import { useId } from "react";

/** 브랜드 키트 04 입력 필드: 52px, 백자 면, 1px 재 보더, 포커스는 먹 테두리만 (글로우·채움 없음) */
const control =
  "w-full rounded-btn border border-jae bg-baekja px-3.5 text-body text-meok outline-none placeholder:text-mukhoe focus:border-meok";

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-bold">
        {label}
        {required && <span className="ml-1 text-onggi">*</span>}
      </label>
      {children(id)}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`h-[52px] ${control}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={5} {...props} className={`py-3 ${control}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%235F5E57%22 stroke-width=%221.5%22/></svg>')] h-[52px] appearance-none bg-[length:12px_8px] bg-[right_14px_center] bg-no-repeat pr-10 ${control}`}
    />
  );
}

export function PrivacyConsent({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2 rounded-card bg-hanji p-4">
      <label htmlFor={id} className="flex min-h-12 cursor-pointer items-center gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="size-5 shrink-0 accent-meok"
        />
        <span className="text-body font-medium">{label}</span>
      </label>
      <p className="text-label leading-relaxed text-mukhoe">{detail}</p>
    </div>
  );
}
