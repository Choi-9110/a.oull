// ⚠️ 임시 수기 작성본 — supabase/migrations/20260918000000_init_schema.sql 기준.
// Supabase 프로젝트 연결 후 `pnpm db:types` 로 자동 생성본으로 덮어쓴다. (이후 수정 금지)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Locale = "ko" | "ja" | "zh";
type MediaKind = "audio" | "image";
type OwnerType = "craft" | "artisan" | "story" | "region" | "post";
type RequestStatus = "new" | "in_progress" | "done" | "canceled";

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required>>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamps = { created_at: string; updated_at: string };

export type Database = {
  public: {
    Tables: {
      admins: Table<{ user_id: string; created_at: string }, "user_id">;
      media_assets: Table<
        {
          id: string;
          kind: MediaKind;
          storage_path: string;
          mime: string;
          bytes: number | null;
          duration_sec: number | null;
          width: number | null;
          height: number | null;
          alt: Json | null;
          created_at: string;
        },
        "kind" | "storage_path" | "mime"
      >;
      regions: Table<
        {
          id: string;
          slug: string;
          name: Json;
          intro: Json | null;
          cover_image_id: string | null;
          sort: number;
          is_published: boolean;
        } & Timestamps,
        "slug" | "name"
      >;
      crafts: Table<
        {
          id: string;
          slug: string;
          region_id: string | null;
          name: Json;
          summary: Json | null;
          history: Json | null;
          technique: Json | null;
          cover_image_id: string | null;
          sort: number;
          is_published: boolean;
        } & Timestamps,
        "slug" | "name"
      >;
      artisans: Table<
        {
          id: string;
          slug: string;
          craft_id: string | null;
          region_id: string | null;
          name: Json;
          title: Json | null;
          bio: Json | null;
          profile_image_id: string | null;
          store_url: string | null;
          sort: number;
          is_published: boolean;
        } & Timestamps,
        "slug" | "name"
      >;
      stories: Table<
        {
          id: string;
          artisan_id: string;
          title: Json;
          body: Json | null;
          image_id: string | null;
          sort: number;
          is_published: boolean;
        } & Timestamps,
        "artisan_id" | "title"
      >;
      audio_tracks: Table<
        {
          id: string;
          owner_type: OwnerType;
          owner_id: string;
          locale: Locale;
          asset_id: string;
          title: Json | null;
          is_ai_voice: boolean;
          sort: number;
          is_published: boolean;
        } & Timestamps,
        "owner_type" | "owner_id" | "locale" | "asset_id"
      >;
      posts: Table<
        {
          id: string;
          slug: string;
          title: Json;
          excerpt: Json | null;
          body: Json | null;
          cover_image_id: string | null;
          artisan_id: string | null;
          craft_id: string | null;
          tags: string[];
          published_at: string | null;
          is_published: boolean;
        } & Timestamps,
        "slug" | "title"
      >;
      qr_codes: Table<
        {
          code: string;
          target_type: OwnerType;
          target_id: string;
          location_label: string | null;
          is_active: boolean;
        } & Timestamps,
        "code" | "target_id"
      >;
      inquiries: Table<
        {
          id: string;
          name: string;
          contact: string;
          message: string;
          locale: Locale;
          privacy_agreed_at: string;
          status: RequestStatus;
        } & Timestamps,
        "name" | "contact" | "message" | "privacy_agreed_at"
      >;
      reservations: Table<
        {
          id: string;
          name: string;
          phone: string;
          preferred_date: string | null;
          preferred_time: string | null;
          party_size: number | null;
          artisan_id: string | null;
          craft_id: string | null;
          message: string | null;
          locale: Locale;
          source: string | null;
          privacy_agreed_at: string;
          status: RequestStatus;
        } & Timestamps,
        "name" | "phone" | "privacy_agreed_at"
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      locale: Locale;
      media_kind: MediaKind;
      owner_type: OwnerType;
      request_status: RequestStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
