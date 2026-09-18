import { supabaseUrl } from "@/lib/supabase/env";

/**
 * 미디어 스토리지 어댑터. 코드에서는 반드시 이 모듈을 통해서만 미디어 URL을 만든다.
 * DB에는 storage_path만 저장하므로 드라이버 교체(supabase ↔ r2)는 환경변수 변경만으로 끝난다.
 * docs/storage-decision.md 참고.
 */
export type StorageDriver = "supabase" | "r2";

export const MEDIA_BUCKET = "media";

const driver = (process.env.NEXT_PUBLIC_STORAGE_DRIVER ?? "supabase") as StorageDriver;
const r2PublicBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

export function getPublicUrl(storagePath: string): string {
  const path = storagePath.replace(/^\/+/, "");
  if (driver === "r2") return `${r2PublicBaseUrl.replace(/\/+$/, "")}/${path}`;
  return `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

type AudioPathInput = {
  ownerType: string;
  slug: string;
  locale: string;
  order: number;
  name: string;
  version?: number;
  ext?: "m4a" | "mp3";
};

/** audio/{owner_type}/{slug}/{locale}/{nn}-{name}.v{n}.m4a */
export function buildAudioPath({
  ownerType,
  slug,
  locale,
  order,
  name,
  version = 1,
  ext = "m4a",
}: AudioPathInput): string {
  const nn = String(order).padStart(2, "0");
  return `audio/${ownerType}/${slug}/${locale}/${nn}-${name}.v${version}.${ext}`;
}

export const IMAGE_WIDTHS = [480, 960, 1440] as const;
export type ImageWidth = (typeof IMAGE_WIDTHS)[number];

/** images/{owner_type}/{slug}/{name}.{width}.webp */
export function buildImagePath(
  ownerType: string,
  slug: string,
  name: string,
  width: ImageWidth,
): string {
  return `images/${ownerType}/${slug}/${name}.${width}.webp`;
}

/** 업로드 시 생성한 3개 사이즈로 srcset 문자열을 만든다. */
export function buildImageSrcSet(ownerType: string, slug: string, name: string): string {
  return IMAGE_WIDTHS.map(
    (w) => `${getPublicUrl(buildImagePath(ownerType, slug, name, w))} ${w}w`,
  ).join(", ");
}
