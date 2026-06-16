import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Admin client using the service role key. Bypasses RLS entirely.
 *
 * MUST only ever be constructed in server-only code (route handlers, server
 * actions, background jobs) — never imported into anything bundled for the
 * browser or Expo client. Every call site is expected to perform its own
 * explicit ownership check before touching data with this client.
 */
export function createSupabaseAdminClient(url: string, serviceRoleKey: string) {
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
