import type { Post } from "@/lib/content/types";

// 매거진 목업. 본문은 모두 샘플이다.
export const posts: Post[] = [
  {
    slug: "voice-of-the-artisan",
    category: { ko: "프로젝트", ja: "プロジェクト", zh: "项目" },
    title: {
      ko: "장인의 목소리로 듣는 전시",
      ja: "職人の声で聴く展示",
      zh: "用匠人的声音聆听展览",
    },
    excerpt: {
      ko: "A.OULL AI 도슨트는 장인의 구술 인터뷰를 바탕으로, 작품 앞에서 장인의 목소리로 이야기를 들려줍니다.",
      ja: "A.OULL AIドーセントは職人の口述インタビューをもとに、作品の前で職人の声で物語を届けます。",
      zh: "A.OULL AI导览以匠人口述访谈为基础，在作品前以匠人的声音讲述故事。",
    },
    body: [
      {
        ko: "전시장에서 작품 옆 QR을 스캔하면, 그 작품을 만든 장인의 목소리로 이야기가 시작됩니다. A.OULL은 참여 장인의 구술 인터뷰와 프로필 촬영을 진행하고, 이를 바탕으로 AI 음성 도슨트 콘텐츠를 제작합니다.",
      },
      {
        ko: "콘텐츠는 한국어·일본어·중국어 3개 언어로 제공되며, 관람을 마친 뒤에는 체험 프로그램 예약이나 작품 구매로 이어질 수 있습니다.",
      },
      { ko: "[샘플] 이후 문단은 확정 원고로 교체됩니다." },
    ],
    publishedAt: "2026-09-18",
    readMinutes: 3,
  },
  {
    slug: "brass-and-wood",
    category: { ko: "공예 노트", ja: "工芸ノート", zh: "工艺笔记" },
    title: {
      ko: "[샘플] 나무를 지키는 쇠, 두석",
      ja: "[サンプル] 木を守る金属、豆錫",
      zh: "[示例] 守护木头的金属——豆锡",
    },
    excerpt: {
      ko: "[샘플] 가구 모서리와 문에 달린 작은 쇠붙이, 장석은 어떻게 만들어질까요.",
    },
    body: [{ ko: "[샘플] 매거진 본문이 들어갑니다." }],
    publishedAt: "2026-09-10",
    readMinutes: 5,
    artisanSlug: "kim-jinhwan",
    craftSlug: "duseok",
  },
  {
    slug: "time-of-lacquer",
    category: { ko: "공예 노트", ja: "工芸ノート", zh: "工艺笔记" },
    title: {
      ko: "[샘플] 옻이 마르기를 기다리는 일",
      ja: "[サンプル] 漆が乾くのを待つこと",
      zh: "[示例] 等待漆干的日子",
    },
    excerpt: { ko: "[샘플] 칠하고, 말리고, 갈아내기를 수십 번. 옻칠의 시간에 대하여." },
    body: [{ ko: "[샘플] 매거진 본문이 들어갑니다." }],
    publishedAt: "2026-09-02",
    readMinutes: 4,
    artisanSlug: "cheon-giyeong",
    craftSlug: "chil",
  },
];
