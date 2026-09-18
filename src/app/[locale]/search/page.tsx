import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function Page({ params }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title="검색" featureId="F-01" />;
}
