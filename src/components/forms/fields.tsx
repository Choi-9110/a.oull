"use client";

import { useId } from "react";

/**
 * 입력 필드 (브랜드 키트 04 + TDS 입력 패턴)
 * - 52px, 백자 면, 1px 재 보더, 포커스는 먹 테두리만 (글로우·채움 없음)
 * - 오류는 필드 바로 아래에 한 줄로 알려 주고 aria-invalid/aria-describedby로 연결
 */
const control =
  "w-full rounded-btn border border-jae bg-baekja px-3.5 text-body-l text-meok outline-none placeholder:text-mukhoe/70 focus:border-meok aria-[invalid=true]:border-onggi";

type A11y = { "aria-invalid"?: boolean; "aria-describedby"?: string };

export function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  children: (id: string, a11y: A11y) => React.ReactNode;
}) {
  const id = useId();
  const msgId = `${id}-msg`;
  const a11y: A11y = error
    ? { "aria-invalid": true, "aria-describedby": msgId }
    : hint
      ? { "aria-describedby": msgId }
      : {};
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-bold">
        {label}
        {required && <span className="ml-1 text-onggi">*</span>}
      </label>
      {children(id, a11y)}
      {error ? (
        <p id={msgId} role="alert" className="text-label font-bold text-onggi">
          {error}
        </p>
      ) : (
        hint && (
          <p id={msgId} className="text-label text-mukhoe">
            {hint}
          </p>
        )
      )}
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

/**
 * 하단 고정 주요 버튼 (TDS: 다음 행동은 엄지가 닿는 아래에 하나)
 * 탭바가 숨겨진 화면(퍼널·폼)에서 쓴다.
 */
export function BottomCta({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="h-24" />
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[var(--shell-max-width)] border-t border-jae bg-baekja px-gutter pt-3">
        <div className="pb-3">{children}</div>
      </div>
    </>
  );
}
