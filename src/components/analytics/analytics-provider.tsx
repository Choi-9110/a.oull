"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";

/**
 * 페이지 단위 행동 데이터: page_view(진입) / page_leave(체류 시간·스크롤 깊이).
 * 첫 이벤트에서 세션이 시작되며, QR·UTM 진입 정보가 session_start에 함께 기록된다.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const enteredAt = useRef(0);
  const maxScroll = useRef(0);
  const currentPath = useRef<string | null>(null);

  // 스크롤 깊이(%) 추적
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 100;
        maxScroll.current = Math.max(maxScroll.current, Math.min(100, pct));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // 페이지 진입/이탈
  useEffect(() => {
    const leave = () => {
      if (!currentPath.current) return;
      track("page_leave", {
        ...pageContext(currentPath.current),
        path: currentPath.current,
        dwell: Math.round((Date.now() - enteredAt.current) / 1000),
        scroll: maxScroll.current,
      });
      currentPath.current = null;
    };

    leave(); // 이전 페이지 (클라이언트 내비게이션)
    currentPath.current = pathname;
    enteredAt.current = Date.now();
    maxScroll.current = 0;
    track("page_view", pageContext(pathname));

    window.addEventListener("pagehide", leave);
    return () => window.removeEventListener("pagehide", leave);
  }, [pathname]);

  return null;
}

/** 경로에서 장인·공예 식별자를 뽑아 이벤트에 붙인다 */
function pageContext(path: string) {
  const m = path.match(/^\/[a-z]{2}\/(artisans|crafts)\/([a-z0-9-]+)/);
  if (!m) return {};
  return m[1] === "artisans" ? { artisan: m[2] } : { craft: m[2] };
}
