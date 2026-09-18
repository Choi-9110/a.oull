import "@/styles/globals.css";

// 실제 <html>은 [locale]/layout.tsx(공개 사이트)와 admin/layout.tsx(관리자)가 각각 렌더링한다.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
