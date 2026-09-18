import { describe, expect, it } from "vitest";
import { buildAudioPath, buildImagePath } from "@/lib/storage";

describe("storage paths", () => {
  it("오디오 경로 규칙: audio/{owner}/{slug}/{locale}/{nn}-{name}.v{n}.m4a", () => {
    expect(
      buildAudioPath({
        ownerType: "artisan",
        slug: "kim-jinhwan",
        locale: "ja",
        order: 1,
        name: "intro",
      }),
    ).toBe("audio/artisan/kim-jinhwan/ja/01-intro.v1.m4a");
  });

  it("이미지 경로 규칙: images/{owner}/{slug}/{name}.{w}.webp", () => {
    expect(buildImagePath("craft", "duseok", "cover", 960)).toBe(
      "images/craft/duseok/cover.960.webp",
    );
  });
});
