import type { Craft } from "@/lib/content/types";

// 목업 데이터 — 일반적인 공예 설명만 담았다. 종목별 확정 원고로 교체 예정.
const SAMPLE_HISTORY = {
  ko: "[샘플] 종목의 역사·유래를 소개하는 두 번째 문단입니다. 확정 원고가 들어오면 교체됩니다.",
  en: "[Sample] A second paragraph on the history of this craft. It will be replaced with the final text.",
};

export const crafts: Craft[] = [
  {
    slug: "duseok",
    keyword: { ko: "장석", en: "Metal fittings", ja: "金具", zh: "饰件" },
    regionSlug: "tongyeong",
    name: { ko: "두석장", en: "Duseokjang", ja: "豆錫匠", zh: "豆锡匠" },
    hanja: "豆錫匠",
    summary: {
      ko: "목가구를 단단히 여미고 아름답게 꾸미는 금속 장식, 장석을 만드는 장인",
      en: "Master of the metal fittings that hold wooden furniture together and adorn it",
      ja: "木製家具を留め、美しく飾る金具「装錫」を作る職人",
      zh: "制作加固并装饰木制家具的金属饰件的匠人",
    },
    history: [
      {
        ko: "두석은 구리에 아연이나 니켈을 섞은 황동·백동을 이르는 말입니다. 두석장은 이 금속을 두드리고 오려 장롱과 반닫이, 함에 붙이는 경첩과 자물쇠, 들쇠 같은 장석을 만듭니다.",
        en: "Duseok refers to brass and nickel-silver, copper alloyed with zinc or nickel. The duseokjang hammers and cuts this metal into hinges, locks and handles for wardrobes, chests and boxes.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "합금과 판 만들기", en: "Alloying and sheeting" },
        body: {
          ko: "금속을 녹여 섞고 두드려 고른 두께의 판으로 폅니다.",
          en: "Metals are melted, mixed and hammered into sheets of even thickness.",
        },
      },
      {
        title: { ko: "본뜨기와 오리기", en: "Tracing and cutting" },
        body: {
          ko: "나비, 박쥐, 원형 등 문양을 본떠 정으로 따냅니다.",
          en: "Butterfly, bat and circle motifs are traced and cut out with a chisel.",
        },
      },
      {
        title: { ko: "새김과 마감", en: "Engraving and finishing" },
        body: {
          ko: "선을 새기고 표면을 다듬어 가구에 맞춰 답니다.",
          en: "Lines are engraved, surfaces smoothed, and the pieces fitted to the furniture.",
        },
      },
    ],
    materials: [
      { ko: "황동", en: "Brass" },
      { ko: "백동", en: "Nickel silver" },
      { ko: "정·망치", en: "Chisel & hammer" },
    ],
  },
  {
    slug: "chil",
    keyword: { ko: "옻칠", en: "Lacquer", ja: "漆塗り", zh: "漆艺" },
    regionSlug: "tongyeong",
    name: { ko: "칠장(옻칠)", en: "Chiljang", ja: "漆匠", zh: "漆匠" },
    hanja: "漆匠",
    summary: {
      ko: "옻나무 수액을 정제해 기물에 수십 번 칠하고 말리는 장인",
      en: "Master who refines lacquer sap and applies it to objects, coat after coat",
      ja: "漆の木の樹液を精製し、器物に幾度も塗り重ねる職人",
      zh: "提炼漆树汁液，在器物上反复髹涂的匠人",
    },
    history: [
      {
        ko: "옻칠은 옻나무에서 얻은 수액을 기물에 발라 방수·방충 효과와 깊은 광택을 내는 기술입니다. 한 번 칠하고 습도 속에서 말리기를 수없이 반복해야 하는 인내의 공예입니다.",
        en: "Lacquering coats objects with sap from the lacquer tree, making them waterproof, insect-resistant and deeply lustrous. It is a craft of patience: apply a coat, cure it in humidity, and repeat countless times.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "생칠 정제", en: "Refining raw lacquer" },
        body: {
          ko: "채취한 옻을 걸러 불순물을 없애고 용도에 맞게 정제합니다.",
          en: "Harvested sap is filtered and refined for its purpose.",
        },
      },
      {
        title: { ko: "칠하기와 말리기", en: "Coating and curing" },
        body: {
          ko: "얇게 바르고 습도를 맞춘 칠장에서 말리기를 반복합니다.",
          en: "Thin coats are applied and cured in a humidity-controlled cabinet, again and again.",
        },
      },
      {
        title: { ko: "연마와 광내기", en: "Polishing" },
        body: {
          ko: "숫돌과 숯으로 갈아내고 마지막 칠로 광을 올립니다.",
          en: "Each layer is ground with whetstone and charcoal; a final coat brings up the shine.",
        },
      },
    ],
    materials: [
      { ko: "생옻", en: "Raw lacquer" },
      { ko: "삼베", en: "Hemp cloth" },
      { ko: "토회", en: "Clay primer" },
    ],
  },
  {
    slug: "najeon",
    keyword: { ko: "자개", en: "Mother-of-pearl", ja: "螺鈿", zh: "螺钿" },
    regionSlug: "tongyeong",
    name: { ko: "나전장", en: "Najeonjang", ja: "螺鈿匠", zh: "螺钿匠" },
    hanja: "螺鈿匠",
    summary: {
      ko: "전복·조개 껍데기를 얇게 갈아 옻칠 위에 문양으로 박는 장인",
      en: "Master who grinds abalone and shell into thin pieces and inlays them into lacquer",
      ja: "アワビや貝殻を薄く削り、漆の上に文様として嵌める職人",
      zh: "将鲍鱼壳、贝壳磨薄后镶嵌于漆面上的匠人",
    },
    history: [
      {
        ko: "나전은 자개를 오려 기물 표면에 붙이고 옻칠로 마감하는 기법입니다. 바다와 가까운 통영은 좋은 자개를 얻기 쉬워 나전칠기의 고장으로 알려져 왔습니다.",
        en: "Najeon is the art of cutting mother-of-pearl, setting it on an object and finishing it in lacquer. Close to the sea and its shells, Tongyeong has long been known as the home of mother-of-pearl lacquerware.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "자개 켜기", en: "Preparing the shell" },
        body: {
          ko: "껍데기를 갈아 얇은 자개판을 만듭니다.",
          en: "Shell is ground into thin sheets of mother-of-pearl.",
        },
      },
      {
        title: { ko: "끊음질·줄음질", en: "Cutting and sawing" },
        body: {
          ko: "자개를 끊어 붙이거나 실톱으로 오려 문양을 만듭니다.",
          en: "Pieces are snapped into strips or cut with a fret saw to form patterns.",
        },
      },
      {
        title: { ko: "칠과 연마", en: "Lacquer and polish" },
        body: {
          ko: "옻칠로 덮은 뒤 갈아내 자개빛을 드러냅니다.",
          en: "The piece is covered in lacquer, then ground back to reveal the shimmer.",
        },
      },
    ],
    materials: [
      { ko: "전복 껍데기", en: "Abalone shell" },
      { ko: "옻", en: "Lacquer" },
      { ko: "목태", en: "Wooden base" },
    ],
  },
  {
    slug: "somok",
    keyword: { ko: "목가구", en: "Wooden furniture", ja: "木工家具", zh: "木家具" },
    regionSlug: "tongyeong",
    name: { ko: "소목장", en: "Somokjang", ja: "小木匠", zh: "小木匠" },
    hanja: "小木匠",
    summary: {
      ko: "못 없이 나무를 짜맞춰 장롱·문갑·소반 같은 목가구를 만드는 장인",
      en: "Master who joins wood without nails to make chests, cabinets and small tables",
      ja: "釘を使わず木を組み、箪笥や文箱などの家具を作る職人",
      zh: "不用钉子、以榫卯制作衣柜、文匣等木家具的匠人",
    },
    history: [
      {
        ko: "소목장은 집을 짓는 대목장과 달리 생활 속 목가구와 문짝을 만드는 장인입니다. 나뭇결을 살리고 짜맞춤으로 결합해 오래 쓰는 가구를 만듭니다.",
        en: "Unlike the carpenters who build houses, the somokjang makes the furniture and doors of daily life, joining wood to show its grain and last for generations.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "나무 고르기", en: "Choosing the wood" },
        body: {
          ko: "결과 색이 좋은 나무를 골라 충분히 말립니다.",
          en: "Wood with fine grain and color is chosen and dried thoroughly.",
        },
      },
      {
        title: { ko: "짜맞춤", en: "Joinery" },
        body: {
          ko: "장부와 홈을 파서 못 없이 결합합니다.",
          en: "Tenons and grooves are cut so the pieces join without nails.",
        },
      },
      {
        title: { ko: "마감", en: "Finishing" },
        body: {
          ko: "표면을 다듬고 기름이나 칠로 마감합니다.",
          en: "Surfaces are smoothed and finished with oil or lacquer.",
        },
      },
    ],
    materials: [
      { ko: "오동나무", en: "Paulownia" },
      { ko: "느티나무", en: "Zelkova" },
      { ko: "먹감나무", en: "Black persimmon" },
    ],
  },
  {
    slug: "buchae",
    keyword: { ko: "선자", en: "Fans", ja: "扇子", zh: "折扇" },
    regionSlug: "tongyeong",
    name: { ko: "부채장", en: "Buchaejang", ja: "扇子匠", zh: "扇子匠" },
    summary: {
      ko: "대나무 살과 한지로 접부채와 둥근부채를 만드는 장인",
      en: "Master who makes folding and round fans from bamboo ribs and hanji paper",
      ja: "竹の骨と韓紙で扇子や団扇を作る職人",
      zh: "以竹骨与韩纸制作折扇与团扇的匠人",
    },
    history: [
      {
        ko: "부채는 바람을 일으키는 도구이자 선비의 멋을 드러내는 소품이었습니다. 대나무를 쪼개 살을 만들고 한지를 발라 접고 펴는 구조를 완성합니다.",
        en: "A fan was both a tool for a breeze and an accessory of the scholar's style. Bamboo is split into ribs and covered with hanji paper to make it fold and open.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "살 만들기", en: "Making the ribs" },
        body: {
          ko: "대나무를 쪼개고 깎아 부챗살을 만듭니다.",
          en: "Bamboo is split and shaved into ribs.",
        },
      },
      {
        title: { ko: "종이 바르기", en: "Applying paper" },
        body: {
          ko: "한지를 붙여 접힘선을 잡습니다.",
          en: "Hanji is pasted on and the folds are set.",
        },
      },
      {
        title: { ko: "사북 끼우기", en: "Riveting" },
        body: {
          ko: "살을 모아 사북으로 고정합니다.",
          en: "The ribs are gathered and fixed with a rivet.",
        },
      },
    ],
    materials: [
      { ko: "대나무", en: "Bamboo" },
      { ko: "한지", en: "Hanji paper" },
    ],
  },
  {
    slug: "nubi",
    keyword: { ko: "누비", en: "Quilting", ja: "ヌビ", zh: "绗缝" },
    regionSlug: "tongyeong",
    name: { ko: "누비장", en: "Nubijang", ja: "ヌビ匠", zh: "绗缝匠" },
    summary: {
      ko: "두 겹 천 사이에 솜을 두고 촘촘한 홈질로 누벼 옷과 생활용품을 짓는 장인",
      en: "Master who quilts cotton between two layers of cloth with fine, even stitches",
      ja: "二枚の布の間に綿を挟み、細かな運針で縫い重ねる職人",
      zh: "在两层布之间铺棉，以细密针脚绗缝衣物与用品的匠人",
    },
    history: [
      {
        ko: "누비는 천을 겹쳐 일정한 간격으로 바느질해 보온성과 내구성을 높이는 기법입니다. 바늘땀이 곧고 고를수록 뛰어난 솜씨로 여겨집니다.",
        en: "Nubi layers cloth and stitches it at even intervals for warmth and strength. The straighter and more even the stitches, the finer the hand.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "마름질", en: "Cutting" },
        body: {
          ko: "겉감과 안감을 재단하고 솜을 고르게 폅니다.",
          en: "Outer and inner fabrics are cut and cotton spread evenly.",
        },
      },
      {
        title: { ko: "누비기", en: "Quilting" },
        body: {
          ko: "일정한 간격으로 곧게 홈질을 이어갑니다.",
          en: "Straight running stitches are sewn at even intervals.",
        },
      },
      {
        title: { ko: "짓기", en: "Sewing up" },
        body: {
          ko: "누빈 천으로 옷이나 소품을 완성합니다.",
          en: "The quilted cloth is made into garments or small goods.",
        },
      },
    ],
    materials: [
      { ko: "무명", en: "Cotton cloth" },
      { ko: "명주", en: "Silk" },
      { ko: "솜", en: "Cotton wadding" },
    ],
  },
  {
    slug: "onggi",
    keyword: { ko: "옹기", en: "Earthenware", ja: "甕器", zh: "瓮器" },
    regionSlug: "tongyeong",
    name: { ko: "옹기장(도예)", en: "Onggijang", ja: "甕器匠", zh: "瓮器匠" },
    hanja: "甕器匠",
    summary: {
      ko: "흙을 빚어 숨 쉬는 그릇, 옹기를 만드는 장인",
      en: "Master who shapes clay into onggi, the 'breathing' earthenware jar",
      ja: "土をこねて「呼吸する器」甕器を作る職人",
      zh: "揉捏陶土、制作会呼吸的瓮器的匠人",
    },
    history: [
      {
        ko: "옹기는 잿물을 입혀 구운 그릇으로, 미세한 숨구멍이 있어 장과 김치를 발효·저장하는 데 쓰여 왔습니다.",
        en: "Onggi is ash-glazed earthenware whose tiny pores let it breathe, making it ideal for fermenting and storing soy sauce and kimchi.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "흙 준비", en: "Preparing clay" },
        body: {
          ko: "흙을 반죽해 공기를 빼고 고르게 만듭니다.",
          en: "Clay is kneaded to remove air and even it out.",
        },
      },
      {
        title: { ko: "타렴질", en: "Coiling" },
        body: {
          ko: "흙가래를 쌓고 두드려 형태를 올립니다.",
          en: "Coils of clay are stacked and beaten to raise the form.",
        },
      },
      {
        title: { ko: "잿물과 굽기", en: "Glazing and firing" },
        body: {
          ko: "잿물을 입혀 가마에서 굽습니다.",
          en: "The jar is coated with ash glaze and fired in the kiln.",
        },
      },
    ],
    materials: [
      { ko: "옹기토", en: "Onggi clay" },
      { ko: "잿물", en: "Ash glaze" },
    ],
  },
  {
    slug: "maedeup",
    keyword: { ko: "매듭", en: "Knotting", ja: "組紐", zh: "绳结" },
    regionSlug: "masan",
    name: { ko: "매듭장", en: "Maedeupjang", ja: "結び匠", zh: "绳结匠" },
    summary: {
      ko: "명주실로 끈을 짜고 매듭을 맺어 장식을 만드는 장인",
      en: "Master who braids silk cord and ties it into decorative knots",
      ja: "絹糸で紐を組み、結びを作って装飾を仕上げる職人",
      zh: "以丝线编绳、打结制作装饰的匠人",
    },
    history: [
      {
        ko: "매듭은 실을 꼬고 짠 끈으로 다양한 모양을 맺는 공예로, 노리개와 유소 등 장신구와 의례용 장식에 쓰였습니다.",
        en: "Maedeup twists and braids thread into cord and ties it into many shapes, used for norigae pendants and ceremonial tassels.",
      },
      SAMPLE_HISTORY,
    ],
    techniques: [
      {
        title: { ko: "염색", en: "Dyeing" },
        body: {
          ko: "명주실을 원하는 색으로 물들입니다.",
          en: "Silk thread is dyed the desired color.",
        },
      },
      {
        title: { ko: "끈목 짜기", en: "Braiding cord" },
        body: {
          ko: "실을 꼬고 짜서 단단한 끈을 만듭니다.",
          en: "Thread is twisted and braided into firm cord.",
        },
      },
      {
        title: { ko: "매듭 맺기", en: "Tying knots" },
        body: {
          ko: "도래·국화·나비 등 매듭을 맺습니다.",
          en: "Knots such as the dorae, chrysanthemum and butterfly are tied.",
        },
      },
    ],
    materials: [
      { ko: "명주실", en: "Silk thread" },
      { ko: "천연염료", en: "Natural dyes" },
    ],
  },
];
