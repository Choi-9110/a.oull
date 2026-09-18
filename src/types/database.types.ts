// ⚠️ 임시 수기 작성본 — supabase/migrations/*.sql 기준.
// Supabase 프로젝트 연결 후 `pnpm db:types` 로 자동 생성본으로 덮어쓴다. (이후 수정 금지)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Locale = "ko" | "en" | "ja" | "zh";
type MediaKind = "audio" | "image";
type OwnerType = "craft" | "artisan" | "story" | "region" | "post";
type RequestStatus = "new" | "in_progress" | "done" | "canceled";
type ReservationStatus = "pending" | "confirmed" | "canceled" | "no_show";

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
      visitors: Table<
        {
          id: string;
          first_seen_at: string;
          last_seen_at: string;
          os: string | null;
          browser: string | null;
        },
        "id"
      >;
      sessions: Table<
        {
          id: string;
          visitor_id: string;
          started_at: string;
          last_event_at: string;
          entry_type: "qr" | "utm" | "referral" | "direct";
          qr_code: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          referrer: string | null;
          landing_path: string | null;
          os: string | null;
          browser: string | null;
          in_app: string | null;
          locale: Locale | null;
        },
        "id" | "visitor_id" | "entry_type"
      >;
      events: Table<
        {
          id: number;
          session_id: string;
          type: string;
          occurred_at: string;
          received_at: string;
          path: string | null;
          locale: Locale | null;
          artisan: string | null;
          craft: string | null;
          track: string | null;
          position_sec: number | null;
          listened_sec: number | null;
          progress_pct: number | null;
          dwell_sec: number | null;
          scroll_pct: number | null;
          props: Json;
        },
        "session_id" | "type" | "occurred_at"
      >;
      experience_rules: Table<
        {
          id: string;
          artisan_id: string;
          weekday: number;
          start_time: string;
          duration_min: number;
          capacity: number;
          valid_from: string;
          valid_to: string | null;
          is_active: boolean;
        } & Timestamps,
        "artisan_id" | "weekday" | "start_time" | "capacity"
      >;
      experience_slots: Table<
        {
          id: string;
          rule_id: string | null;
          artisan_id: string;
          starts_at: string;
          duration_min: number;
          capacity: number;
          status: "open" | "closed";
          note: string | null;
        } & Timestamps,
        "artisan_id" | "starts_at" | "capacity"
      >;
      reservations: Table<
        {
          id: string;
          slot_id: string;
          party_size: number;
          name: string | null;
          phone: string | null;
          message: string | null;
          locale: Locale;
          session_id: string | null;
          status: ReservationStatus;
          privacy_agreed_at: string;
          age14_confirmed: boolean;
          purge_after: string;
          purged_at: string | null;
        } & Timestamps,
        "slot_id" | "party_size" | "privacy_agreed_at" | "age14_confirmed" | "purge_after"
      >;
      admin_access_logs: Table<
        {
          id: number;
          admin_id: string;
          action: "view_list" | "reveal_phone" | "update_status" | "export";
          target: string | null;
          at: string;
        },
        "admin_id" | "action"
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      get_available_slots: {
        Args: { p_artisan: string; p_from: string; p_to: string };
        Returns: {
          slot_id: string;
          starts_at: string;
          duration_min: number;
          capacity: number;
          remaining: number;
        }[];
      };
      create_reservation: {
        Args: {
          p_slot_id: string;
          p_party_size: number;
          p_name: string;
          p_phone: string;
          p_message: string;
          p_locale: Locale;
          p_session_id: string | null;
          p_privacy_agreed: boolean;
          p_age14_confirmed: boolean;
        };
        Returns: string;
      };
    };
    Enums: {
      locale: Locale;
      media_kind: MediaKind;
      owner_type: OwnerType;
      request_status: RequestStatus;
      reservation_status: ReservationStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
