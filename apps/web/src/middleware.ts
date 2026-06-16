import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@b00ks/database";
import { publicEnv } from "@/lib/env";

const PROTECTED_PREFIXES = ["/library", "/book", "/collections", "/highlights", "/settings"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createSupabaseServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    getAll: () => request.cookies.getAll(),
    setAll: (list) => {
      list.forEach(({ name, value }) => {
        response.cookies.set(name, value);
      });
    },
  });

  // Refreshes the session if the access token is expired, keeping users
  // signed in without forcing a manual re-login.
  const { data } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (isProtected && !data.user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
