"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * 바텀시트 (TDS 패턴): 선택지는 화면을 떠나지 않고 아래에서 올라오는 시트에서 고른다.
 * - 배경 탭·ESC로 닫힘, 열리면 첫 요소로 포커스, 본문 스크롤 잠금
 */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button, [href], input")?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-meok/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pb-safe relative w-full max-w-[var(--shell-max-width)] animate-sheet-up rounded-t-[16px] bg-baekja"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-jae" aria-hidden />
        <div className="flex items-center justify-between px-gutter pt-3 pb-2">
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="tap -mr-2 flex size-12 items-center justify-center"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>
        <div className="max-h-[70dvh] overflow-y-auto px-gutter pb-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
