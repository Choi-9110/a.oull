/**
 * 스마트스토어 링크에 네이버 유입 추적 파라미터를 붙인다 (docs/features.md §2-4).
 * 우리 쪽에서는 구매 여부를 알 수 없으므로, 스마트스토어 통계(마케팅 채널 분석)에서
 * "아울에서 넘어온 유입·구매"를 따로 볼 수 있게 하는 용도다.
 * ※ 파라미터 규칙(nt_source 등)은 스토어 연결 시 스마트스토어센터에서 실제 집계되는지 확인할 것.
 */
export function withStoreTracking(
  storeUrl: string,
  artisanSlug: string,
  medium = "docent",
) {
  try {
    const url = new URL(storeUrl);
    if (!/naver\.com$/.test(url.hostname)) return storeUrl;
    url.searchParams.set("nt_source", "aoull");
    url.searchParams.set("nt_medium", medium);
    url.searchParams.set("nt_detail", artisanSlug);
    return url.toString();
  } catch {
    return storeUrl;
  }
}
