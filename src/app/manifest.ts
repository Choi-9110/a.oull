import type { MetadataRoute } from "next";

// 홈 화면에 추가 시 앱처럼 보이도록 (standalone). 아이콘은 public/icons/ 에 추가 예정.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A.OULL 아울 — 전통공예 AI 도슨트",
    short_name: "A.OULL",
    start_url: "/ko",
    display: "standalone",
    background_color: "#f7f4e9",
    theme_color: "#f7f4e9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
