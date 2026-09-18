import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function Page({ params }: PageProps<"/[locale]/artisans">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title="장인 소개" featureId="F-03" />;
}
