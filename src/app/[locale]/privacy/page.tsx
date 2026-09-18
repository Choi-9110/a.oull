import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/layout/app-header";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title") };
}

/**
 * 개인정보 처리방침 (개인정보 보호법 제30조) — 초안
 * ⚠️ [대괄호] 항목은 운영 측 정보로 채워야 하며, 공개 전 검토가 필요하다 (docs/features.md §4-2, §7-5).
 * 한국어가 정본. 다른 언어 화면에서도 한국어 원문을 보여주고 안내 문구를 붙인다.
 */
const SECTIONS: { title: string; body: (string | string[])[] }[] = [
  {
    title: "1. 개인정보의 처리 목적",
    body: [
      "[상호](이하 “아울”)는 다음 목적을 위해서만 개인정보를 처리하며, 목적이 변경되는 경우 사전에 동의를 받습니다.",
      [
        "체험 예약: 예약 접수, 체험 전날 참석 확정 연락",
        "문의: 문의 내용 확인 및 답변",
        "서비스 개선: 방문·이용 통계 분석(개인을 식별하지 않는 형태)",
      ],
    ],
  },
  {
    title: "2. 처리하는 개인정보 항목 및 보유 기간",
    body: [
      [
        "체험 예약 — 이름, 휴대전화번호 / 체험일로부터 30일 후 파기",
        "문의 — 이름, 연락처(전화 또는 이메일), 문의 내용 / 문의 처리 완료 후 1년",
        "서비스 이용기록(자동 수집) — 익명 방문자 식별값, 방문 일시, 방문 경로(QR·링크), 기기·브라우저 종류, 이용 기록(페이지 열람, 도슨트 재생, 버튼 클릭) / 수집일로부터 [2년]",
      ],
      "체험 예약 시 해당 예약과 서비스 이용기록이 연결될 수 있으며, 이는 예약 전환 분석 목적으로만 이용합니다.",
    ],
  },
  {
    title: "3. 개인정보의 파기 절차 및 방법",
    body: [
      "보유 기간이 지난 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제하며, 예약 기록 중 통계 목적의 인원·일시 정보는 개인을 알아볼 수 없도록 이름·연락처를 삭제한 뒤 보관합니다.",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: [
      "아울은 정보주체의 개인정보를 제3자에게 제공하지 않습니다. [체험 장인(공방)에 예약 명단을 전달하는 경우 별도 동의를 받도록 변경 예정]",
    ],
  },
  {
    title: "5. 개인정보 처리의 위탁 및 국외 이전",
    body: [
      "원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있으며, 일부는 국외에서 처리·보관될 수 있습니다.",
      [
        "Supabase Inc. (미국) — 데이터베이스·파일 저장 / 서버 소재지: [리전 확인 필요] / 이전 항목: 위 2항 전체 / 서비스 이용 시 네트워크를 통해 이전 / 위탁 계약 종료 시까지",
        "Vercel Inc. (미국) — 웹사이트 호스팅 및 전송 / 위 2항 전체 / 서비스 이용 시 네트워크를 통해 이전 / 위탁 계약 종료 시까지",
      ],
      "국외 이전을 원하지 않는 경우 예약·문의를 하지 않거나 [전화 연락처]로 요청할 수 있습니다. 다만 이 경우 온라인 예약 서비스 이용이 제한됩니다.",
    ],
  },
  {
    title: "6. 정보주체의 권리와 행사 방법",
    body: [
      "정보주체는 언제든지 자신의 개인정보 열람·정정·삭제·처리정지를 요구할 수 있으며, 아래 개인정보 보호책임자에게 연락하시면 지체 없이 조치합니다. 만 14세 미만 아동의 경우 법정대리인이 권리를 행사할 수 있습니다.",
    ],
  },
  {
    title: "7. 자동 수집 장치의 설치·운영 및 거부",
    body: [
      "아울은 방문 통계를 위해 브라우저 저장소(로컬 스토리지)에 익명 식별값을 저장합니다. 이 값으로는 개인을 직접 식별할 수 없습니다.",
      "브라우저 설정에서 사이트 데이터를 삭제하거나 저장을 차단할 수 있으며, 이 경우에도 서비스 이용에는 제한이 없습니다.",
    ],
  },
  {
    title: "8. 개인정보의 안전성 확보 조치",
    body: [
      [
        "전송 구간 암호화(HTTPS)",
        "개인정보 접근 권한을 관리자로 제한하고, 관리자 계정은 초대 방식으로만 발급",
        "관리자의 개인정보 열람 기록을 1년 이상 보관",
        "관리자 화면에서 연락처 일부 가림 처리",
        "보유 기간이 지난 개인정보 자동 파기",
      ],
    ],
  },
  {
    title: "9. 개인정보 보호책임자",
    body: [["성명: [이름]", "연락처: [전화번호] / [이메일]"]],
  },
  {
    title: "10. 권익침해 구제 방법",
    body: [
      [
        "개인정보분쟁조정위원회 1833-6972 (www.kopico.go.kr)",
        "개인정보침해신고센터 (국번없이) 118 (privacy.kisa.or.kr)",
        "대검찰청 (국번없이) 1301",
        "경찰청 (국번없이) 182",
      ],
    ],
  },
  {
    title: "11. 처리방침의 변경",
    body: ["이 개인정보 처리방침은 [YYYY년 MM월 DD일]부터 적용됩니다."],
  },
];

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <>
      <AppHeader backHref="/more" />
      <div className="flex flex-col gap-2 px-gutter pt-8 pb-4">
        <p className="font-en text-lg tracking-[0.04em] text-nambit lining-nums">
          Privacy
        </p>
        <h1 className="font-serif text-display font-semibold">{t("title")}</h1>
        {locale !== "ko" && t("notice") && (
          <p className="rounded-card bg-hanji p-3 text-caption text-mukhoe">
            {t("notice")}
          </p>
        )}
      </div>
      <article lang="ko" className="flex flex-col px-gutter pb-12">
        {SECTIONS.map((s) => (
          <section key={s.title} className="flex flex-col gap-2 border-b border-jae py-5">
            <h2 className="text-[15px] font-bold">{s.title}</h2>
            {s.body.map((b, i) =>
              Array.isArray(b) ? (
                <ul
                  key={i}
                  className="flex list-disc flex-col gap-1 pl-5 text-caption text-meok"
                >
                  {b.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="text-caption text-meok">
                  {b}
                </p>
              ),
            )}
          </section>
        ))}
      </article>
    </>
  );
}
