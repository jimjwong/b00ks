import type { SupabaseClient } from "@supabase/supabase-js";

type Client = Pick<SupabaseClient, "auth">;

/**
 * Thin, framework-agnostic wrapper around Supabase Auth. Accepts whichever
 * client (browser/server) the caller already has — this package never
 * constructs its own client so it stays usable from web and mobile alike.
 */
export function createAuthService(client: Client) {
  return {
    async signUp(email: string, password: string, emailRedirectTo?: string) {
      return client.auth.signUp({
        email,
        password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      });
    },

    async signInWithPassword(email: string, password: string) {
      return client.auth.signInWithPassword({ email, password });
    },

    async signOut() {
      return client.auth.signOut();
    },

    async sendPasswordReset(email: string, redirectTo: string) {
      return client.auth.resetPasswordForEmail(email, { redirectTo });
    },

    async updatePassword(newPassword: string) {
      return client.auth.updateUser({ password: newPassword });
    },

    async resendVerificationEmail(email: string) {
      return client.auth.resend({ type: "signup", email });
    },

    /** Only resolves when Google OAuth has actually been configured server-side. */
    async signInWithGoogle(redirectTo: string) {
      return client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
    },

    async getSession() {
      return client.auth.getSession();
    },

    async getUser() {
      return client.auth.getUser();
    },

    async refreshSession() {
      return client.auth.refreshSession();
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
