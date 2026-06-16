import { createSupabaseBrowserClient } from "@b00ks/database";
import { publicEnv } from "@/lib/env";

export function getSupabaseBrowserClient() {
  return createSupabaseBrowserClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
}
