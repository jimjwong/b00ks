import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@b00ks/database";
import { publicEnv } from "@/lib/env";

/** Supabase client scoped to the current request's session via cookies. RLS applies. */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    getAll: () => cookieStore.getAll(),
    setAll: (list) => {
      try {
        list.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Called from a Server Component render, where cookies are read-only.
        // Session refresh still happens via middleware, so this is safe to ignore.
      }
    },
  });
}
