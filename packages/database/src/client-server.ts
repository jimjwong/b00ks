import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export interface CookieAdapter {
  getAll(): { name: string; value: string }[];
  setAll(cookies: { name: string; value: string; options?: Record<string, unknown> }[]): void;
}

/**
 * Server-side Supabase client scoped to the requesting user's session
 * (anon key + cookies). RLS applies — this client can only see what the
 * signed-in user is allowed to see. Use createSupabaseAdminClient for
 * privileged operations.
 */
export function createSupabaseServerClient(
  url: string,
  anonKey: string,
  cookies: CookieAdapter,
) {
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (list) => cookies.setAll(list),
    },
  });
}
