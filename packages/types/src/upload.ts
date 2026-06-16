export const UPLOAD_JOB_STATUSES = [
  "pending",
  "uploaded",
  "verified",
  "failed",
  "expired",
] as const;
export type UploadJobStatus = (typeof UPLOAD_JOB_STATUSES)[number];

export interface UploadJob {
  id: string;
  userId: string;
  bookId: string;
  objectKey: string;
  expectedSizeBytes: number;
  expectedMimeType: string;
  status: UploadJobStatus;
  expiresAt: string;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateUploadSessionRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  fileHash: string;
}

export interface CreateUploadSessionResponse {
  uploadJobId: string;
  bookId: string;
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
  /** If the same file hash already exists for this user, points at the existing book. */
  duplicateOfBookId?: string;
}

export interface CompleteUploadRequest {
  uploadJobId: string;
}
