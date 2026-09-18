import { expect, test } from "@playwright/test";

test("루트 접속 시 locale 경로로 이동하고 하단 탭바가 보인다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(ko|ja|zh)$/);
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("알 수 없는 QR 코드는 메인홈으로 보낸다", async ({ page }) => {
  await page.goto("/q/UNKNOWN-CODE");
  await expect(page).toHaveURL(/\/(ko|ja|zh)$/);
});
