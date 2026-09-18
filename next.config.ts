import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // 이미지 리사이즈는 업로드 시점에 처리한다 (docs/storage-decision.md §5)
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
