import { TabBar } from "./tab-bar";

// 데스크톱에서도 모바일 폭(480px) 셸로 보여 "앱처럼" 보이게 한다. (CLAUDE.md 절대 원칙 1)
// 바깥은 한지, 앱 지면은 백자. 그림자 대신 1px 재 보더로 경계를 만든다 (브랜드 키트 05).
export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[var(--shell-max-width)] flex-col bg-baekja min-[481px]:border-x min-[481px]:border-jae">
      <main className="flex flex-1 flex-col pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
