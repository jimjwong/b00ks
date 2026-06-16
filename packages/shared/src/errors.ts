import type { ApiError, ApiErrorCode } from "@b00ks/types";
import { API_ERROR_CODES } from "@b00ks/types";

/** Throwable error carrying a structured, client-safe payload. */
export class AppError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  toApiError(requestId?: string): ApiError {
    return {
      code: this.code,
      message: this.message,
      fieldErrors: this.fieldErrors,
      requestId,
    };
  }
}

export const Errors = {
  unauthenticated: () =>
    new AppError(API_ERROR_CODES.UNAUTHENTICATED, "You must be signed in to do this.", 401),
  forbidden: (message = "You do not have access to this resource.") =>
    new AppError(API_ERROR_CODES.FORBIDDEN, message, 403),
  notFound: (message = "Resource not found.") =>
    new AppError(API_ERROR_CODES.NOT_FOUND, message, 404),
  validation: (fieldErrors: Record<string, string[]>, message = "Validation failed.") =>
    new AppError(API_ERROR_CODES.VALIDATION_FAILED, message, 422, fieldErrors),
  quotaExceeded: (message = "You have reached your storage quota.") =>
    new AppError(API_ERROR_CODES.QUOTA_EXCEEDED, message, 413),
  fileTooLarge: (message = "This file exceeds the maximum upload size.") =>
    new AppError(API_ERROR_CODES.FILE_TOO_LARGE, message, 413),
  unsupportedFileType: (message = "Only EPUB and PDF files are supported.") =>
    new AppError(API_ERROR_CODES.UNSUPPORTED_FILE_TYPE, message, 415),
  rateLimited: (message = "Too many requests. Please slow down.") =>
    new AppError(API_ERROR_CODES.RATE_LIMITED, message, 429),
  conflict: (message = "This resource was modified elsewhere.") =>
    new AppError(API_ERROR_CODES.CONFLICT, message, 409),
  internal: (message = "Something went wrong. Please try again.") =>
    new AppError(API_ERROR_CODES.INTERNAL_ERROR, message, 500),
};
