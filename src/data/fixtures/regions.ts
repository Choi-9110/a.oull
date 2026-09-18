import type { Region } from "@/lib/content/types";

// 목업 데이터 — Supabase 연결 전 디자인·개발용. 확정 콘텐츠로 교체 예정.
export const regions: Region[] = [
  {
    slug: "tongyeong",
    name: { ko: "통영", en: "Tongyeong", ja: "統営", zh: "统营" },
    tagline: {
      ko: "바다와 공방이 함께 자란 도시",
      en: "A city where the sea and the workshops grew up together",
      ja: "海と工房が共に育った街",
      zh: "大海与工坊共同孕育的城市",
    },
    intro: [
      {
        ko: "조선 시대 삼도수군통제영이 자리했던 통영에는 군영에 필요한 물품을 만들던 12공방이 있었습니다. 그 손기술은 나전칠기, 두석, 소목, 누비 같은 공예로 오늘까지 이어지고 있습니다.",
        en: "Tongyeong was home to the Joseon-era naval headquarters of the three southern provinces, where twelve workshops made what the garrison needed. Their skills live on today in crafts such as mother-of-pearl lacquerware, metal fittings, wooden furniture and nubi quilting.",
        ja: "朝鮮時代に三道水軍統制営が置かれた統営には、軍営の品々を作る12の工房がありました。その技は螺鈿漆器や豆錫、小木、ヌビなどの工芸として今に受け継がれています。",
        zh: "朝鲜时代三道水军统制营所在的统营，曾有为军营制作器物的十二工坊。这些手艺以螺钿漆器、豆锡、小木、绗缝等工艺延续至今。",
      },
      {
        ko: "[샘플] 지역 소개 두 번째 문단이 들어갑니다. 공예관 위치, 관람 정보, 지역 공방 이야기 등을 담을 수 있습니다.",
        en: "[Sample] A second paragraph about the region goes here — museum location, visitor information, stories of local workshops.",
      },
    ],
  },
  {
    slug: "masan",
    name: { ko: "마산", en: "Masan", ja: "馬山", zh: "马山" },
    tagline: {
      ko: "실과 매듭으로 잇는 손의 기억",
      en: "Memories of the hand, tied in thread and knots",
      ja: "糸と結びでつなぐ手の記憶",
      zh: "以丝线与绳结相连的手之记忆",
    },
    intro: [
      {
        ko: "[샘플] 마산 지역 소개 문단이 들어갑니다. 매듭장과 지역 공예의 흐름을 소개합니다.",
        en: "[Sample] An introduction to Masan goes here, covering knotting and the local craft tradition.",
      },
    ],
  },
];
