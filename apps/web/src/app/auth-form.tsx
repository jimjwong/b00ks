"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createAuthService } from "@b00ks/auth";
import { publicEnv } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

function getSafeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/library";
  }
  return value;
}

function isLocalOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function getAuthCallbackUrl(nextPath: string) {
  const configuredOrigin = publicEnv.appUrl.replace(/\/$/, "");
  const runtimeOrigin = window.location.origin;
  const appOrigin = configuredOrigin && !isLocalOrigin(configuredOrigin) ? configuredOrigin : runtimeOrigin;

  return `${appOrigin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNext(searchParams.get("next"));
  const callbackError = searchParams.get("error");
  const isRegister = mode === "register";
  const hasSupabaseConfig = Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
  const auth = useMemo(
    () => (hasSupabaseConfig ? createAuthService(getSupabaseBrowserClient()) : null),
    [hasSupabaseConfig],
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(callbackError);

  async function signInWithGoogle() {
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    if (!auth) {
      setError("Supabase is not configured for this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.");
      setIsSubmitting(false);
      return;
    }
    const authClient = auth!;

    const redirectTo = getAuthCallbackUrl(nextPath);
    const { error: googleError } = await authClient.signInWithGoogle(redirectTo);

    if (googleError) {
      setError(googleError.message);
      setIsSubmitting(false);
    }
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    if (!auth) {
      setError("Supabase is not configured for this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.");
      setIsSubmitting(false);
      return;
    }
    const authClient = auth!;

    const result = isRegister
      ? await authClient.signUp(email, password, getAuthCallbackUrl(nextPath))
      : await authClient.signInWithPassword(email, password);

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    if (isRegister && !result.data.session) {
      setMessage(
        "Registration accepted. If this email can receive mail, Supabase will send a confirmation link. Check your inbox and spam folder, then come back to log in.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!result.data.session) {
      setError("Login did not return a session. Check your email/password and try again.");
      setIsSubmitting(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div className="text-center">
        <Link href="/" className="text-sm font-medium uppercase tracking-[0.2em] text-charcoal-300">
          b00ks
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-charcoal-900">
          {isRegister ? "Create your library" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm text-charcoal-500">
          {isRegister
            ? "Register with Google or email to start your private cloud library."
            : "Log in with Google or email to continue reading on every device."}
        </p>
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-paper-50 p-6 shadow-sm">
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={isSubmitting || !hasSupabaseConfig}
          className="flex w-full items-center justify-center rounded-md border border-charcoal-300 px-4 py-3 text-sm font-medium text-charcoal-800 transition-colors hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-charcoal-300">
          <span className="h-px flex-1 bg-charcoal-100" />
          or use email
          <span className="h-px flex-1 bg-charcoal-100" />
        </div>

        <form onSubmit={submitEmail} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-left text-sm font-medium text-charcoal-700">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border border-charcoal-200 bg-white px-3 py-3 text-charcoal-900 outline-none transition-colors focus:border-accent-500"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-left text-sm font-medium text-charcoal-700">
            Password
            <input
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-charcoal-200 bg-white px-3 py-3 text-charcoal-900 outline-none transition-colors focus:border-accent-500"
              placeholder="At least 8 characters"
            />
          </label>

          {!hasSupabaseConfig ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Supabase is not configured for this deployment. Set
              <code> NEXT_PUBLIC_SUPABASE_URL </code> and
              <code> NEXT_PUBLIC_SUPABASE_ANON_KEY </code> in Vercel, then redeploy.
            </p>
          ) : null}

          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {message ? <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

          {isRegister ? (
            <p className="text-xs leading-5 text-charcoal-400">
              Registration uses Supabase Auth. If email confirmation is enabled, the account is
              pending until the confirmation link is opened. Developers can check Supabase
              Dashboard → Auth → Logs or run <code>pnpm auth:email:test your@email.com</code>.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !hasSupabaseConfig}
            className="rounded-md bg-accent-500 px-6 py-3 text-sm font-medium text-paper-50 transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait…" : isRegister ? "Register with email" : "Log in with email"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-charcoal-500">
        {isRegister ? "Already have an account?" : "New to b00ks?"} {" "}
        <Link
          href={isRegister ? `/login?next=${encodeURIComponent(nextPath)}` : `/register?next=${encodeURIComponent(nextPath)}`}
          className="font-medium text-accent-600 hover:text-accent-700"
        >
          {isRegister ? "Log in" : "Register"}
        </Link>
      </p>
    </div>
  );
}
