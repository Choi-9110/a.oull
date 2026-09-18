import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PagePlaceholder title="문의하기" featureId="F-07" />;
}
