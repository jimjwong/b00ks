"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthService } from "@b00ks/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    const auth = createAuthService(getSupabaseBrowserClient());
    await auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isSigningOut}
      className="rounded-md border border-charcoal-300 px-4 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSigningOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
