import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Browser-side Supabase client. Uses only the public URL + anon key, both of
 * which are safe to ship to the client — RLS enforces real access control.
 */
export function createSupabaseBrowserClient(url: string, anonKey: string) {
  return createBrowserClient<Database>(url, anonKey);
}
