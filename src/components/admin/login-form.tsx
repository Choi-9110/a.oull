"use client";

import { useActionState } from "react";
import { Field, TextInput } from "@/components/forms/fields";
import { button } from "@/components/ui/primitives";
import { signIn, type LoginState } from "@/server/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <Field label="이메일" required>
        {(id) => (
          <TextInput id={id} name="email" type="email" autoComplete="username" required />
        )}
      </Field>
      <Field label="비밀번호" required>
        {(id) => (
          <TextInput
            id={id}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        )}
      </Field>
      {state.error && (
        <p role="alert" className="text-caption font-bold text-onggi">
          {state.error === "NOT_CONFIGURED"
            ? "Supabase 연결 후 로그인할 수 있습니다."
            : "이메일 또는 비밀번호를 확인해 주세요."}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`${button.base} ${button.solid} mt-2`}
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
