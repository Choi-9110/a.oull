import type { Craft } from "@/lib/content/types";

// 목업 데이터 — 일반적인 공예 설명만 담았다. 종목별 확정 원고로 교체 예정.
const SAMPLE_HISTORY = {
  ko: "[샘플] 종목의 역사·유래를 소개하는 두 번째 문단입니다. 확정 원고가 들어오면 교체됩니다.",
};

export const crafts: Craft[] = [
  {
    slug: "duseok",
    keyword: { ko: "장석", ja: "金具", zh: "饰件" },
    regionSlug: "tongyeong",
    name: { ko: "두석장", ja: "豆錫匠", zh: "豆锡匠" },
    hanja: "豆錫匠",
    summary: {
      ko: "목가구를 단단히 여미고 아름답게 꾸미는 금속 장식, 장석을 만드는 장인",
      ja: "木製家具を留め、美しく飾る金具「装錫」を作る職人",
      zh: "制作加固并装饰木制家具的金属饰件的匠人",
    },
    history: [
      {
        ko: "두석은 구리에 아연이나 니켈을 섞은 황동·백동을 이르는 말입니다. 두석장은 이 금속을 두드리고 오려 장롱과 반닫이, 함에 붙이는 경첩과 자물쇠, 들쇠 같은 장석을 만듭니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "합금과 판 만들기" },
        body: { ko: "금속을 녹여 섞고 두드려 고른 두께의 판으로 폅니다." },
      },
      {
        title: { ko: "본뜨기와 오리기" },
        body: { ko: "나비, 박쥐, 원형 등 문양을 본떠 정으로 따냅니다." },
      },
      {
        title: { ko: "새김과 마감" },
        body: { ko: "선을 새기고 표면을 다듬어 가구에 맞춰 답니다." },
      },
    ],
    materials: [{ ko: "황동" }, { ko: "백동" }, { ko: "정·망치" }],
  },
  {
    slug: "chil",
    keyword: { ko: "옻칠", ja: "漆塗り", zh: "漆艺" },
    regionSlug: "tongyeong",
    name: { ko: "칠장(옻칠)", ja: "漆匠", zh: "漆匠" },
    hanja: "漆匠",
    summary: {
      ko: "옻나무 수액을 정제해 기물에 수십 번 칠하고 말리는 장인",
      ja: "漆の木の樹液を精製し、器物に幾度も塗り重ねる職人",
      zh: "提炼漆树汁液，在器物上反复髹涂的匠人",
    },
    history: [
      {
        ko: "옻칠은 옻나무에서 얻은 수액을 기물에 발라 방수·방충 효과와 깊은 광택을 내는 기술입니다. 한 번 칠하고 습도 속에서 말리기를 수없이 반복해야 하는 인내의 공예입니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "생칠 정제" },
        body: { ko: "채취한 옻을 걸러 불순물을 없애고 용도에 맞게 정제합니다." },
      },
      {
        title: { ko: "칠하기와 말리기" },
        body: { ko: "얇게 바르고 습도를 맞춘 칠장에서 말리기를 반복합니다." },
      },
      {
        title: { ko: "연마와 광내기" },
        body: { ko: "숫돌과 숯으로 갈아내고 마지막 칠로 광을 올립니다." },
      },
    ],
    materials: [{ ko: "생옻" }, { ko: "삼베" }, { ko: "토회" }],
  },
  {
    slug: "najeon",
    keyword: { ko: "자개", ja: "螺鈿", zh: "螺钿" },
    regionSlug: "tongyeong",
    name: { ko: "나전장", ja: "螺鈿匠", zh: "螺钿匠" },
    hanja: "螺鈿匠",
    summary: {
      ko: "전복·조개 껍데기를 얇게 갈아 옻칠 위에 문양으로 박는 장인",
      ja: "アワビや貝殻を薄く削り、漆の上に文様として嵌める職人",
      zh: "将鲍鱼壳、贝壳磨薄后镶嵌于漆面上的匠人",
    },
    history: [
      {
        ko: "나전은 자개를 오려 기물 표면에 붙이고 옻칠로 마감하는 기법입니다. 바다와 가까운 통영은 좋은 자개를 얻기 쉬워 나전칠기의 고장으로 알려져 왔습니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "자개 켜기" },
        body: { ko: "껍데기를 갈아 얇은 자개판을 만듭니다." },
      },
      {
        title: { ko: "끊음질·줄음질" },
        body: { ko: "자개를 끊어 붙이거나 실톱으로 오려 문양을 만듭니다." },
      },
      {
        title: { ko: "칠과 연마" },
        body: { ko: "옻칠로 덮은 뒤 갈아내 자개빛을 드러냅니다." },
      },
    ],
    materials: [{ ko: "전복 껍데기" }, { ko: "옻" }, { ko: "목태" }],
  },
  {
    slug: "somok",
    keyword: { ko: "목가구", ja: "木工家具", zh: "木家具" },
    regionSlug: "tongyeong",
    name: { ko: "소목장", ja: "小木匠", zh: "小木匠" },
    hanja: "小木匠",
    summary: {
      ko: "못 없이 나무를 짜맞춰 장롱·문갑·소반 같은 목가구를 만드는 장인",
      ja: "釘を使わず木を組み、箪笥や文箱などの家具を作る職人",
      zh: "不用钉子、以榫卯制作衣柜、文匣等木家具的匠人",
    },
    history: [
      {
        ko: "소목장은 집을 짓는 대목장과 달리 생활 속 목가구와 문짝을 만드는 장인입니다. 나뭇결을 살리고 짜맞춤으로 결합해 오래 쓰는 가구를 만듭니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "나무 고르기" },
        body: { ko: "결과 색이 좋은 나무를 골라 충분히 말립니다." },
      },
      { title: { ko: "짜맞춤" }, body: { ko: "장부와 홈을 파서 못 없이 결합합니다." } },
      { title: { ko: "마감" }, body: { ko: "표면을 다듬고 기름이나 칠로 마감합니다." } },
    ],
    materials: [{ ko: "오동나무" }, { ko: "느티나무" }, { ko: "먹감나무" }],
  },
  {
    slug: "buchae",
    keyword: { ko: "선자", ja: "扇子", zh: "折扇" },
    regionSlug: "tongyeong",
    name: { ko: "부채장", ja: "扇子匠", zh: "扇子匠" },
    summary: {
      ko: "대나무 살과 한지로 접부채와 둥근부채를 만드는 장인",
      ja: "竹の骨と韓紙で扇子や団扇を作る職人",
      zh: "以竹骨与韩纸制作折扇与团扇的匠人",
    },
    history: [
      {
        ko: "부채는 바람을 일으키는 도구이자 선비의 멋을 드러내는 소품이었습니다. 대나무를 쪼개 살을 만들고 한지를 발라 접고 펴는 구조를 완성합니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "살 만들기" },
        body: { ko: "대나무를 쪼개고 깎아 부챗살을 만듭니다." },
      },
      { title: { ko: "종이 바르기" }, body: { ko: "한지를 붙여 접힘선을 잡습니다." } },
      { title: { ko: "사북 끼우기" }, body: { ko: "살을 모아 사북으로 고정합니다." } },
    ],
    materials: [{ ko: "대나무" }, { ko: "한지" }],
  },
  {
    slug: "nubi",
    keyword: { ko: "누비", ja: "ヌビ", zh: "绗缝" },
    regionSlug: "tongyeong",
    name: { ko: "누비장", ja: "ヌビ匠", zh: "绗缝匠" },
    summary: {
      ko: "두 겹 천 사이에 솜을 두고 촘촘한 홈질로 누벼 옷과 생활용품을 짓는 장인",
      ja: "二枚の布の間に綿を挟み、細かな運針で縫い重ねる職人",
      zh: "在两层布之间铺棉，以细密针脚绗缝衣物与用品的匠人",
    },
    history: [
      {
        ko: "누비는 천을 겹쳐 일정한 간격으로 바느질해 보온성과 내구성을 높이는 기법입니다. 바늘땀이 곧고 고를수록 뛰어난 솜씨로 여겨집니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "마름질" },
        body: { ko: "겉감과 안감을 재단하고 솜을 고르게 폅니다." },
      },
      {
        title: { ko: "누비기" },
        body: { ko: "일정한 간격으로 곧게 홈질을 이어갑니다." },
      },
      { title: { ko: "짓기" }, body: { ko: "누빈 천으로 옷이나 소품을 완성합니다." } },
    ],
    materials: [{ ko: "무명" }, { ko: "명주" }, { ko: "솜" }],
  },
  {
    slug: "onggi",
    keyword: { ko: "옹기", ja: "甕器", zh: "瓮器" },
    regionSlug: "tongyeong",
    name: { ko: "옹기장(도예)", ja: "甕器匠", zh: "瓮器匠" },
    hanja: "甕器匠",
    summary: {
      ko: "흙을 빚어 숨 쉬는 그릇, 옹기를 만드는 장인",
      ja: "土をこねて「呼吸する器」甕器を作る職人",
      zh: "揉捏陶土、制作会呼吸的瓮器的匠人",
    },
    history: [
      {
        ko: "옹기는 잿물을 입혀 구운 그릇으로, 미세한 숨구멍이 있어 장과 김치를 발효·저장하는 데 쓰여 왔습니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "흙 준비" },
        body: { ko: "흙을 반죽해 공기를 빼고 고르게 만듭니다." },
      },
      { title: { ko: "타렴질" }, body: { ko: "흙가래를 쌓고 두드려 형태를 올립니다." } },
      { title: { ko: "잿물과 굽기" }, body: { ko: "잿물을 입혀 가마에서 굽습니다." } },
    ],
    materials: [{ ko: "옹기토" }, { ko: "잿물" }],
  },
  {
    slug: "maedeup",
    keyword: { ko: "매듭", ja: "組紐", zh: "绳结" },
    regionSlug: "masan",
    name: { ko: "매듭장", ja: "結び匠", zh: "绳结匠" },
    summary: {
      ko: "명주실로 끈을 짜고 매듭을 맺어 장식을 만드는 장인",
      ja: "絹糸で紐を組み、結びを作って装飾を仕上げる職人",
      zh: "以丝线编绳、打结制作装饰的匠人",
    },
    history: [
      {
        ko: "매듭은 실을 꼬고 짠 끈으로 다양한 모양을 맺는 공예로, 노리개와 유소 등 장신구와 의례용 장식에 쓰였습니다.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      { title: { ko: "염색" }, body: { ko: "명주실을 원하는 색으로 물들입니다." } },
      {
        title: { ko: "끈목 짜기" },
        body: { ko: "실을 꼬고 짜서 단단한 끈을 만듭니다." },
      },
      { title: { ko: "매듭 맺기" }, body: { ko: "도래·국화·나비 등 매듭을 맺습니다." } },
    ],
    materials: [{ ko: "명주실" }, { ko: "천연염료" }],
  },
];
