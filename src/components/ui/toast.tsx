"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

/**
 * 토스트 (TDS 패턴): 저장·오류 같은 짧은 결과는 화면 하단에 잠깐 띄우고 자동으로 사라진다.
 * 탭바·하단 CTA 위에 뜨도록 bottom 여백을 둔다.
 */
type Toast = { id: number; message: string; tone: "default" | "error" };
const ToastContext = createContext<(message: string, tone?: Toast["tone"]) => void>(
  () => {},
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const show = useCallback((message: string, tone: Toast["tone"] = "default") => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] mx-auto flex w-full max-w-[var(--shell-max-width)] flex-col items-center gap-2 px-gutter"
        style={{ bottom: "calc(var(--cta-height) + env(safe-area-inset-bottom) + 16px)" }}
      >
        {toasts.map((t) => (
          <p
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={`animate-toast rounded-full px-5 py-3 text-sm font-medium text-baekja ${
              t.tone === "error" ? "bg-onggi" : "bg-meok/95"
            }`}
          >
            {t.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
