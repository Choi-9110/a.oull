import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function Page({ params }: PageProps<"/[locale]/crafts">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title="전통공예 8종" featureId="F-02" />;
}
