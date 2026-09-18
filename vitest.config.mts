import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node", // 컴포넌트 테스트는 파일 상단에 @vitest-environment jsdom
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
