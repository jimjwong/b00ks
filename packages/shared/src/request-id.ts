/** Generates a short request id for correlating logs without leaking internal identifiers. */
export function generateRequestId(): string {
  return `req_${crypto.randomUUID().replace(/-/g, "")}`;
}
