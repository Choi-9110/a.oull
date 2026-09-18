import type { Metadata } from "next";
import { getFunnelStats } from "@/server/analytics/stats";

export const metadata: Metadata = { title: "대시보드" };
export const dynamic = "force-dynamic";

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "–");

// A-05 행동 데이터 대시보드 — MVP 핵심 검증: 도슨트 경험 → 구매·예약 전환
export default async function AdminDashboard() {
  const s = await getFunnelStats();

  const funnel = [
    { label: "방문 세션", value: s.sessions, rate: "", note: `QR 진입 ${s.qrSessions}` },
    {
      label: "도슨트 재생",
      value: s.played,
      rate: pct(s.played, s.sessions),
      note: `평균 청취 ${s.avgListenSec}초`,
    },
    {
      label: "완청",
      value: s.completed,
      rate: pct(s.completed, s.played),
      note: `재생 중 이탈 ${s.abandoned}`,
    },
    {
      label: "스토어 이동",
      value: s.storeClicks,
      rate: pct(s.storeClicks, s.sessions),
      note: "작품 구하기 클릭",
    },
    {
      label: "체험 예약",
      value: s.reservations,
      rate: pct(s.reservations, s.sessions),
      note: "신청 완료",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between border-b border-meok pb-3">
        <div>
          <p className="label">DASHBOARD</p>
          <h1 className="font-serif text-heading font-semibold">행동 데이터</h1>
        </div>
        <p className="text-label text-mukhoe">
          {s.source === "local"
            ? "로컬 기록(.data/events.ndjson) 기준 · Supabase 연결 전"
            : "최근 30일 · Supabase"}
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[15px] font-bold">세션 퍼널</h2>
        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-jae bg-jae sm:grid-cols-5">
          {funnel.map((f, i) => (
            <li key={f.label} className="flex flex-col gap-1 bg-baekja p-4">
              <span className="font-en text-sm text-mukhoe lining-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-caption font-bold">{f.label}</span>
              <span className="font-en text-4xl leading-none lining-nums tabular-nums">
                {f.value}
              </span>
              <span className="text-label font-bold text-cheongja-deep">{f.rate}</span>
              <span className="text-[11px] text-mukhoe">{f.note}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[11px] text-mukhoe">
          재생률·스토어·예약은 전체 세션 대비, 완청률은 재생 세션 대비. 스마트스토어 실제
          구매는 스마트스토어 통계(nt_source=aoull)에서 확인.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-[15px] font-bold">장인별</h2>
        {s.byArtisan.length ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-meok text-left text-label text-mukhoe">
                <th className="py-2 font-bold">장인</th>
                <th className="py-2 text-right font-bold">세션</th>
                <th className="py-2 text-right font-bold">재생</th>
                <th className="py-2 text-right font-bold">완청</th>
                <th className="py-2 text-right font-bold">스토어</th>
                <th className="py-2 text-right font-bold">예약</th>
              </tr>
            </thead>
            <tbody>
              {s.byArtisan.map((a) => (
                <tr key={a.artisan} className="border-b border-jae tabular-nums">
                  <td className="py-2.5">{a.artisan}</td>
                  <td className="py-2.5 text-right">{a.sessions}</td>
                  <td className="py-2.5 text-right">{a.played}</td>
                  <td className="py-2.5 text-right">{a.completed}</td>
                  <td className="py-2.5 text-right">{a.store}</td>
                  <td className="py-2.5 text-right">{a.reserved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="rounded-card bg-baekja p-4 text-caption text-mukhoe">
            아직 수집된 데이터가 없습니다.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[15px] font-bold">언어별 세션</h2>
        <ul className="flex flex-wrap gap-2">
          {s.byLocale.map((l) => (
            <li
              key={l.locale}
              className="rounded-btn border border-jae bg-baekja px-3 py-2 text-sm"
            >
              <span className="font-bold uppercase">{l.locale}</span>{" "}
              <span className="tabular-nums">{l.sessions}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
