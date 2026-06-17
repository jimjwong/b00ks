import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function LibraryPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/library");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-charcoal-100 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-charcoal-300">b00ks</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal-900">Your library</h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Signed in as {user.email ?? "your Supabase account"}.
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="rounded-2xl border border-dashed border-charcoal-200 bg-paper-50 p-8 text-center">
        <h2 className="font-serif text-2xl text-charcoal-900">Ready for your first book</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-500">
          Email registration and login are connected. The next step is wiring uploads to Cloudflare R2 and storing book metadata in Supabase.
        </p>
      </section>
    </main>
  );
}
