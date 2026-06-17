#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(path) {
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  return { response, body };
}

const email = process.argv[2];
const password = process.argv[3] ?? `B00ks-test-${Date.now()}!`;
const envPath = resolve(process.cwd(), ".env.local");
const env = loadEnv(envPath);
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

if (!supabaseUrl || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

console.log("Supabase Auth email diagnostics");
console.log(`Project: ${supabaseUrl}`);
console.log(`App URL: ${appUrl}`);

const settings = await requestJson(`${supabaseUrl}/auth/v1/settings`, {
  headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
});

if (!settings.response.ok) {
  console.error(`Settings check failed: HTTP ${settings.response.status}`);
  console.error(settings.body);
  process.exit(1);
}

console.log(`Signup disabled: ${settings.body.disable_signup}`);
console.log(`Email provider enabled: ${settings.body.external?.email === true}`);
console.log(`Email confirmations required: ${settings.body.mailer_autoconfirm === false}`);

if (!email) {
  console.log("");
  console.log("No signup email supplied, so no test email was sent.");
  console.log("To send a real Supabase confirmation email, run:");
  console.log("  pnpm auth:email:test you@example.com");
  process.exit(0);
}

console.log("");
console.log(`Attempting signup for: ${email}`);
console.log("Password: provided/generated locally; not printed");

const redirectTo = `${appUrl}/auth/callback?next=%2Flibrary`;
const signup = await requestJson(`${supabaseUrl}/auth/v1/signup`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    "X-Client-Info": "b00ks-auth-email-diagnostics",
  },
  body: JSON.stringify({
    email,
    password,
    options: { emailRedirectTo: redirectTo },
  }),
});

console.log(`Signup HTTP status: ${signup.response.status}`);

if (!signup.response.ok) {
  const message = signup.body?.msg ?? signup.body?.message ?? signup.body?.error_description ?? "Unknown error";
  console.log(`Signup error: ${message}`);
  if (signup.response.status === 429 || signup.body?.error_code === "over_email_send_rate_limit") {
    console.log("Result: Supabase rejected the email because the built-in email sender is rate-limited.");
    console.log("Wait before retrying, or configure custom SMTP in Supabase Auth settings.");
  }
  process.exit(1);
}

const userCreated = Boolean(signup.body?.user?.id);
const sessionReturned = Boolean(signup.body?.session);
console.log(`User object returned: ${userCreated}`);
console.log(`Session returned immediately: ${sessionReturned}`);

if (sessionReturned) {
  console.log("Result: signup succeeded and email confirmation is not required for this project.");
} else {
  console.log("Result: signup accepted by Supabase; email confirmation should be required.");
  console.log("Check the recipient inbox/spam folder and Supabase Dashboard -> Auth -> Logs.");
  console.log("If no email arrives, the usual causes are rate limiting, redirect URL mismatch, or missing custom SMTP.");
}
