const MENUS = ["장인", "공예 종목", "지역", "매거진", "QR 코드", "문의", "체험 예약"];

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">A.OULL 관리자</h1>
      <p className="text-muted mt-2 text-sm">TODO: Supabase Auth 로그인 + 콘텐츠 관리</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MENUS.map((m) => (
          <li key={m} className="border-line rounded-lg border p-4 text-sm">
            {m}
          </li>
        ))}
      </ul>
    </main>
  );
}
