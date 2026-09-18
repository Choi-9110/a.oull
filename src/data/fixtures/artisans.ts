import type { Artisan } from "@/lib/content/types";

// 목업 데이터. 실존 장인의 약력·인용문은 구술 인터뷰 후 확정 원고로 교체한다.
// [샘플] 표시가 있는 문구는 사실 정보가 아니다.
const SAMPLE_AUDIO = "samples/docent-sample.wav";

export const artisans: Artisan[] = [
  {
    slug: "kim-jinhwan",
    craftSlug: "duseok",
    regionSlug: "tongyeong",
    name: { ko: "김진환", ja: "キム・ジンファン", zh: "김진환 (Kim Jinhwan)" },
    title: { ko: "두석장", ja: "豆錫匠", zh: "豆锡匠" },
    oneLiner: {
      ko: "[장인 소개 한 줄 — 인터뷰 후 작성]",
      ja: "[職人紹介の一文 — インタビュー後に作成]",
      zh: "[匠人一句话介绍 — 访谈后撰写]",
    },
    quote: {
      ko: "[샘플 인용문] 장인 인터뷰에서 발췌한 한 문장이 이 자리에 들어갑니다.",
      ja: "[サンプル] 職人インタビューから抜粋した一文がここに入ります。",
      zh: "[示例] 此处将放入摘自匠人访谈的一句话。",
    },
    bio: [
      {
        ko: "[샘플] 장인의 약력이 들어갑니다. 공예를 시작한 계기, 사사한 스승, 활동 이력 등을 구술 인터뷰를 바탕으로 정리합니다.",
      },
      {
        ko: "[샘플] 두 번째 문단입니다. 대표 작품과 전시, 지금 공방에서 이어가는 작업을 소개합니다.",
      },
    ],
    storeUrl: "https://smartstore.naver.com/",
    tracks: [
      {
        id: "kim-jinhwan-01",
        title: { ko: "장인의 인사", ja: "職人のあいさつ", zh: "匠人的问候" },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
      {
        id: "kim-jinhwan-02",
        title: { ko: "쇠를 다루는 일", ja: "金属を扱う仕事", zh: "与金属打交道" },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
      {
        id: "kim-jinhwan-03",
        title: { ko: "장석에 담긴 문양", ja: "金具に込めた文様", zh: "饰件上的纹样" },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
    ],
    stories: [
      {
        title: { ko: "[샘플] 공방의 하루" },
        body: {
          ko: "[샘플] 작업 스토리 본문이 들어갑니다. 사진과 함께 2~3문단으로 구성합니다.",
        },
      },
      {
        title: { ko: "[샘플] 나비 장석 이야기" },
        body: { ko: "[샘플] 대표 문양에 얽힌 이야기가 들어갑니다." },
      },
    ],
    works: [
      { name: { ko: "[샘플] 나비 경첩" }, material: { ko: "황동" } },
      { name: { ko: "[샘플] 반닫이 장석" }, material: { ko: "백동" } },
      { name: { ko: "[샘플] 들쇠" }, material: { ko: "황동" } },
    ],
  },
  {
    slug: "cheon-giyeong",
    craftSlug: "chil",
    regionSlug: "tongyeong",
    name: { ko: "천기영", ja: "チョン・ギヨン", zh: "천기영 (Cheon Giyeong)" },
    title: { ko: "칠장", ja: "漆匠", zh: "漆匠" },
    oneLiner: {
      ko: "[장인 소개 한 줄 — 인터뷰 후 작성]",
      ja: "[職人紹介の一文 — インタビュー後に作成]",
      zh: "[匠人一句话介绍 — 访谈后撰写]",
    },
    quote: {
      ko: "[샘플 인용문] 장인 인터뷰에서 발췌한 한 문장이 이 자리에 들어갑니다.",
      ja: "[サンプル] 職人インタビューから抜粋した一文がここに入ります。",
      zh: "[示例] 此处将放入摘自匠人访谈的一句话。",
    },
    bio: [
      {
        ko: "[샘플] 장인의 약력이 들어갑니다. 공예를 시작한 계기, 사사한 스승, 활동 이력 등을 구술 인터뷰를 바탕으로 정리합니다.",
      },
    ],
    storeUrl: "https://smartstore.naver.com/",
    tracks: [
      {
        id: "cheon-giyeong-01",
        title: { ko: "장인의 인사", ja: "職人のあいさつ", zh: "匠人的问候" },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
      {
        id: "cheon-giyeong-02",
        title: { ko: "옻이 마르는 시간", ja: "漆が乾く時間", zh: "等待漆干的时间" },
        durationSec: 20,
        src: { ko: SAMPLE_AUDIO },
      },
    ],
    stories: [
      {
        title: { ko: "[샘플] 백 번의 칠" },
        body: { ko: "[샘플] 작업 스토리 본문이 들어갑니다." },
      },
    ],
    works: [
      { name: { ko: "[샘플] 옻칠 찻상" }, material: { ko: "옻칠 · 느티나무" } },
      { name: { ko: "[샘플] 칠기 합" }, material: { ko: "옻칠 · 삼베" } },
    ],
  },
];
