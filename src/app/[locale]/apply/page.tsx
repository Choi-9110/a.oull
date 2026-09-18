import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function Page({ params }: PageProps<"/[locale]/apply">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title="체험 신청" featureId="F-08" />;
}
