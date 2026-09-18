import { TabBar } from "./tab-bar";

// 데스크톱에서도 모바일 폭(480px) 셸로 보여 "앱처럼" 보이게 한다. (CLAUDE.md 절대 원칙 1)
export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--shell-max-width)] flex-col bg-bg shadow-sm">
      <main className="flex flex-1 flex-col pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
