/**
 * Structured logger that never accepts raw secrets, tokens, or book content.
 * Callers should pass identifiers (ids, counts, status codes) — not payloads.
 */
const REDACTED_KEYS = new Set([
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "presignedUrl",
  "uploadUrl",
  "secretAccessKey",
  "accessKeyId",
  "serviceRoleKey",
  "content",
  "note",
  "selectedText",
]);

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        REDACTED_KEYS.has(k) ? "[redacted]" : redact(v),
      ]),
    );
  }
  return value;
}

export type LogContext = Record<string, unknown>;

function log(level: "info" | "warn" | "error", event: string, context?: LogContext) {
  const entry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...(context ? (redact(context) as LogContext) : {}),
  };
  // eslint-disable-next-line no-console
  console[level === "info" ? "log" : level](JSON.stringify(entry));
}

export const logger = {
  info: (event: string, context?: LogContext) => log("info", event, context),
  warn: (event: string, context?: LogContext) => log("warn", event, context),
  error: (event: string, context?: LogContext) => log("error", event, context),
};
