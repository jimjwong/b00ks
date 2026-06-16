export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export const API_ERROR_CODES = {
  UNAUTHENTICATED: "unauthenticated",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not_found",
  VALIDATION_FAILED: "validation_failed",
  QUOTA_EXCEEDED: "quota_exceeded",
  FILE_TOO_LARGE: "file_too_large",
  UNSUPPORTED_FILE_TYPE: "unsupported_file_type",
  RATE_LIMITED: "rate_limited",
  CONFLICT: "conflict",
  INTERNAL_ERROR: "internal_error",
} as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
