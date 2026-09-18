// 스캐폴딩용 임시 페이지. 각 기능 구현 시 교체한다.
export function PagePlaceholder({
  title,
  featureId,
}: {
  title: string;
  featureId?: string;
}) {
  return (
    <section className="flex flex-col gap-2 px-5 py-8">
      {featureId && <p className="text-xs text-muted">{featureId}</p>}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted">TODO</p>
    </section>
  );
}
