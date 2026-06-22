import { NextResponse, type NextRequest } from "next/server";
import { createR2Client } from "@b00ks/api";
import { createSupabaseAdminClient } from "@b00ks/database";
import { getServerEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createUploadSession, type AdminClientLike } from "./upload-session";

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const serverEnv = getServerEnv();
  const adminClient = createSupabaseAdminClient(
    serverEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
  );
  const r2Client = createR2Client(serverEnv.r2);

  const result = await createUploadSession(payload, {
    user,
    adminClient: adminClient as unknown as AdminClientLike,
    r2Client,
  });

  return NextResponse.json(result.body, { status: result.status });
}
