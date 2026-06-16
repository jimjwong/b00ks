function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Public env — safe to read from client components. */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "b00ks",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

/** Server-only env. Importing this module from a client component is a bug. */
export function getServerEnv() {
  return {
    supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    r2: {
      accountId: requireEnv("CLOUDFLARE_ACCOUNT_ID"),
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
      bucketName: requireEnv("R2_BUCKET_NAME"),
      endpoint: process.env.R2_ENDPOINT || undefined,
    },
    maxUploadSizeBytes: Number(process.env.MAX_UPLOAD_SIZE_BYTES ?? 209_715_200),
    defaultUserStorageQuotaBytes: Number(
      process.env.DEFAULT_USER_STORAGE_QUOTA_BYTES ?? 5_368_709_120,
    ),
  };
}
