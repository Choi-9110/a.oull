import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

// 콘텐츠 등록만으로 페이지가 생긴다: 빌드 시 알려진 slug는 정적 생성, 새 slug는 요청 시 생성 후 캐시
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: PageProps<"/[locale]/regions/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title={`지역: ${slug}`} featureId="F-05" />;
}
