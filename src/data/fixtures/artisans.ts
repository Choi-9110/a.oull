import type { Artisan } from "@/lib/content/types";

// 목업 데이터. 실존 장인의 약력·인용문은 구술 인터뷰 후 확정 원고로 교체한다.
// [샘플] 표시가 있는 문구는 사실 정보가 아니다.
const SAMPLE_AUDIO = "samples/docent-sample.wav";

export const artisans: Artisan[] = [
  {
    slug: "kim-jinhwan",
    craftSlug: "duseok",
    regionSlug: "tongyeong",
    name: {
      ko: "김진환",
      en: "Kim Jinhwan",
      ja: "キム・ジンファン",
      zh: "김진환 (Kim Jinhwan)",
    },
    title: { ko: "두석장", en: "Duseokjang", ja: "豆錫匠", zh: "豆锡匠" },
    oneLiner: {
      ko: "[장인 소개 한 줄 — 인터뷰 후 작성]",
      en: "[One-line introduction — to be written after the interview]",
      ja: "[職人紹介の一文 — インタビュー後に作成]",
      zh: "[匠人一句话介绍 — 访谈后撰写]",
    },
    quote: {
      ko: "[샘플 인용문] 장인 인터뷰에서 발췌한 한 문장이 이 자리에 들어갑니다.",
      en: "[Sample quote] A line from the artisan's interview goes here.",
      ja: "[サンプル] 職人インタビューから抜粋した一文がここに入ります。",
      zh: "[示例] 此处将放入摘自匠人访谈的一句话。",
    },
    bio: [
      {
        ko: "[샘플] 장인의 약력이 들어갑니다. 공예를 시작한 계기, 사사한 스승, 활동 이력 등을 구술 인터뷰를 바탕으로 정리합니다.",
        en: "[Sample] The artisan's biography goes here — how they began, who they trained under and their career, based on the oral-history interview.",
      },
      {
        ko: "[샘플] 두 번째 문단입니다. 대표 작품과 전시, 지금 공방에서 이어가는 작업을 소개합니다.",
        en: "[Sample] A second paragraph on major works, exhibitions and current work in the studio.",
      },
    ],
    storeUrl: "https://smartstore.naver.com/",
    tracks: [
      {
        id: "kim-jinhwan-01",
        title: {
          ko: "장인의 인사",
          en: "A greeting from the artisan",
          ja: "職人のあいさつ",
          zh: "匠人的问候",
        },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
      {
        id: "kim-jinhwan-02",
        title: {
          ko: "쇠를 다루는 일",
          en: "Working with metal",
          ja: "金属を扱う仕事",
          zh: "与金属打交道",
        },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
      {
        id: "kim-jinhwan-03",
        title: {
          ko: "장석에 담긴 문양",
          en: "Motifs in the fittings",
          ja: "金具に込めた文様",
          zh: "饰件上的纹样",
        },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
    ],
    stories: [
      {
        title: { ko: "[샘플] 공방의 하루", en: "[Sample] A day in the workshop" },
        body: {
          ko: "[샘플] 작업 스토리 본문이 들어갑니다. 사진과 함께 2~3문단으로 구성합니다.",
          en: "[Sample] The workshop story goes here, in two or three paragraphs with photos.",
        },
      },
      {
        title: { ko: "[샘플] 나비 장석 이야기", en: "[Sample] The butterfly fitting" },
        body: {
          ko: "[샘플] 대표 문양에 얽힌 이야기가 들어갑니다.",
          en: "[Sample] The story behind a signature motif goes here.",
        },
      },
    ],
    works: [
      {
        name: { ko: "[샘플] 나비 경첩", en: "[Sample] Butterfly hinge" },
        material: { ko: "황동", en: "Brass" },
      },
      {
        name: { ko: "[샘플] 반닫이 장석", en: "[Sample] Chest fittings" },
        material: { ko: "백동", en: "Nickel silver" },
      },
      {
        name: { ko: "[샘플] 들쇠", en: "[Sample] Drop handle" },
        material: { ko: "황동", en: "Brass" },
      },
    ],
  },
  {
    slug: "cheon-giyeong",
    craftSlug: "chil",
    regionSlug: "tongyeong",
    name: {
      ko: "천기영",
      en: "Cheon Giyeong",
      ja: "チョン・ギヨン",
      zh: "천기영 (Cheon Giyeong)",
    },
    title: { ko: "칠장", en: "Chiljang", ja: "漆匠", zh: "漆匠" },
    oneLiner: {
      ko: "[장인 소개 한 줄 — 인터뷰 후 작성]",
      en: "[One-line introduction — to be written after the interview]",
      ja: "[職人紹介の一文 — インタビュー後に作成]",
      zh: "[匠人一句话介绍 — 访谈后撰写]",
    },
    quote: {
      ko: "[샘플 인용문] 장인 인터뷰에서 발췌한 한 문장이 이 자리에 들어갑니다.",
      en: "[Sample quote] A line from the artisan's interview goes here.",
      ja: "[サンプル] 職人インタビューから抜粋した一文がここに入ります。",
      zh: "[示例] 此处将放入摘自匠人访谈的一句话。",
    },
    bio: [
      {
        ko: "[샘플] 장인의 약력이 들어갑니다. 공예를 시작한 계기, 사사한 스승, 활동 이력 등을 구술 인터뷰를 바탕으로 정리합니다.",
        en: "[Sample] The artisan's biography goes here — how they began, who they trained under and their career, based on the oral-history interview.",
      },
    ],
    storeUrl: "https://smartstore.naver.com/",
    tracks: [
      {
        id: "cheon-giyeong-01",
        title: {
          ko: "장인의 인사",
          en: "A greeting from the artisan",
          ja: "職人のあいさつ",
          zh: "匠人的问候",
        },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
      {
        id: "cheon-giyeong-02",
        title: {
          ko: "옻이 마르는 시간",
          en: "Waiting for lacquer to cure",
          ja: "漆が乾く時間",
          zh: "等待漆干的时间",
        },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
    ],
    stories: [
      {
        title: { ko: "[샘플] 백 번의 칠", en: "[Sample] A hundred coats" },
        body: {
          ko: "[샘플] 작업 스토리 본문이 들어갑니다.",
          en: "[Sample] The workshop story goes here.",
        },
      },
    ],
    works: [
      {
        name: { ko: "[샘플] 옻칠 찻상", en: "[Sample] Lacquered tea table" },
        material: { ko: "옻칠 · 느티나무", en: "Lacquer · Zelkova" },
      },
      {
        name: { ko: "[샘플] 칠기 합", en: "[Sample] Lacquer box" },
        material: { ko: "옻칠 · 삼베", en: "Lacquer · Hemp cloth" },
      },
    ],
  },
];
