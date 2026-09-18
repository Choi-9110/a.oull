import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function Page({ params }: PageProps<"/[locale]/magazine">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title="매거진" featureId="M-01" />;
}
