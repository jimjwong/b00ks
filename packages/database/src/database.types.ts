/**
 * Hand-maintained mirror of supabase/migrations/*.sql.
 *
 * Regenerate against a running local Supabase instance with:
 *   pnpm supabase gen types typescript --local > packages/database/src/database.types.ts
 * (then re-add this header comment, which the CLI overwrites).
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          onboarding_completed: boolean;
          preferred_theme: "light" | "sepia" | "dark";
          preferred_font_family: "literata" | "source-serif" | "inter" | "system";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      devices: {
        Row: {
          id: string;
          user_id: string;
          device_name: string;
          platform: "web" | "ios" | "android";
          app_version: string | null;
          last_seen_at: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["devices"]["Row"]> & {
          user_id: string;
          device_name: string;
          platform: "web" | "ios" | "android";
        };
        Update: Partial<Database["public"]["Tables"]["devices"]["Row"]>;
      };
      books: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subtitle: string | null;
          author: string | null;
          description: string | null;
          language: string | null;
          publisher: string | null;
          published_date: string | null;
          isbn: string | null;
          format: "epub" | "pdf";
          mime_type: string;
          original_filename: string;
          file_size_bytes: number;
          file_hash: string;
          r2_object_key: string;
          cover_r2_object_key: string | null;
          processing_status: "pending_upload" | "uploaded" | "processing" | "ready" | "failed";
          processing_error: string | null;
          page_count: number | null;
          word_count: number | null;
          epub_identifier: string | null;
          metadata_source: "extracted" | "user_edited" | "mixed" | null;
          created_at: string;
          updated_at: string;
          last_opened_at: string | null;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["books"]["Row"]> & {
          user_id: string;
          title: string;
          format: "epub" | "pdf";
          mime_type: string;
          original_filename: string;
          file_size_bytes: number;
          file_hash: string;
          r2_object_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["books"]["Row"]>;
      };
      upload_jobs: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          object_key: string;
          expected_size_bytes: number;
          expected_mime_type: string;
          status: "pending" | "uploaded" | "verified" | "failed" | "expired";
          expires_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["upload_jobs"]["Row"]> & {
          user_id: string;
          book_id: string;
          object_key: string;
          expected_size_bytes: number;
          expected_mime_type: string;
          expires_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["upload_jobs"]["Row"]>;
      };
      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          format: "epub" | "pdf";
          locator_json: Json;
          percentage: number;
          current_page: number | null;
          total_pages: number | null;
          current_chapter: string | null;
          device_id: string | null;
          version: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reading_progress"]["Row"]> & {
          user_id: string;
          book_id: string;
          format: "epub" | "pdf";
          locator_json: Json;
        };
        Update: Partial<Database["public"]["Tables"]["reading_progress"]["Row"]>;
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          locator_json: Json;
          label: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]> & {
          user_id: string;
          book_id: string;
          locator_json: Json;
        };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]>;
      };
      annotations: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          annotation_type: "highlight" | "note";
          locator_json: Json;
          selected_text: string | null;
          prefix_text: string | null;
          suffix_text: string | null;
          note: string | null;
          color: "yellow" | "green" | "blue" | "pink" | "purple" | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["annotations"]["Row"]> & {
          user_id: string;
          book_id: string;
          annotation_type: "highlight" | "note";
          locator_json: Json;
        };
        Update: Partial<Database["public"]["Tables"]["annotations"]["Row"]>;
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["collections"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
      };
      collection_books: {
        Row: {
          collection_id: string;
          book_id: string;
          user_id: string;
          added_at: string;
        };
        Insert: Database["public"]["Tables"]["collection_books"]["Row"];
        Update: Partial<Database["public"]["Tables"]["collection_books"]["Row"]>;
      };
      reading_sessions: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          device_id: string | null;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          start_percentage: number | null;
          end_percentage: number | null;
        };
        Insert: Partial<Database["public"]["Tables"]["reading_sessions"]["Row"]> & {
          user_id: string;
          book_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["reading_sessions"]["Row"]>;
      };
      user_storage_usage: {
        Row: {
          user_id: string;
          used_bytes: number;
          book_count: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_storage_usage"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_storage_usage"]["Row"]>;
      };
    };
    Functions: {
      recalculate_storage_usage: {
        Args: { target_user_id: string };
        Returns: void;
      };
    };
  };
}
