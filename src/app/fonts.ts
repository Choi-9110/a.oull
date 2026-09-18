import {
  Cormorant_Garamond,
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Serif_JP,
  Noto_Serif_KR,
  Noto_Serif_SC,
} from "next/font/google";

/**
 * 브랜드 키트 02: 제목·이야기 = Noto Serif, UI = Noto Sans, 영문·숫자 = Cormorant Garamond.
 * CJK 웹폰트는 언어당 수 MB라 preload하지 않는다. tokens.css의 html[lang] 규칙이
 * 현재 언어의 폰트만 참조하므로, 브라우저는 그 언어의 폰트 파일만 내려받는다.
 * (next/font 옵션은 리터럴이어야 해서 spread를 쓰지 않는다)
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

/** 영문 본문·UI (브랜드 키트 02: en = Cormorant 제목 / Noto Sans 본문) */
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: false,
});

export const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});
export const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "600"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});
export const notoSansJp = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});
export const notoSerifJp = Noto_Serif_JP({
  weight: ["400", "600"],
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false,
});
export const notoSansSc = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});
export const notoSerifSc = Noto_Serif_SC({
  weight: ["400", "600"],
  variable: "--font-noto-serif-sc",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  cormorant,
  notoSans,
  notoSansKr,
  notoSerifKr,
  notoSansJp,
  notoSerifJp,
  notoSansSc,
  notoSerifSc,
]
  .map((f) => f.variable)
  .join(" ");
