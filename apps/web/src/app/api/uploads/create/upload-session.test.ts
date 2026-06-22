import { describe, expect, it, vi } from "vitest";
import { createUploadSession, type AdminClientLike } from "./upload-session";

const user = { id: "11111111-1111-4111-8111-111111111111" };
const validRequest = {
  filename: "Clean Code.pdf",
  mimeType: "application/pdf",
  sizeBytes: 12345,
  fileHash: "a".repeat(64),
};

function createTableMock() {
  const calls: Array<{ table: string; values?: unknown }> = [];
  const duplicateQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  const bookInsert = {
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: "22222222-2222-4222-8222-222222222222" }, error: null }),
  };
  const uploadJobInsert = {
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        id: "33333333-3333-4333-8333-333333333333",
        expires_at: "2026-06-22T14:00:00.000Z",
      },
      error: null,
    }),
  };
  const db = {
    from: vi.fn((table: string) => {
      if (table === "books") {
        return {
          select: duplicateQuery.select,
          eq: duplicateQuery.eq,
          is: duplicateQuery.is,
          maybeSingle: duplicateQuery.maybeSingle,
          insert: vi.fn((values: unknown) => {
            calls.push({ table, values });
            return bookInsert;
          }),
        };
      }
      if (table === "upload_jobs") {
        return {
          insert: vi.fn((values: unknown) => {
            calls.push({ table, values });
            return uploadJobInsert;
          }),
        };
      }
      throw new Error(`Unexpected table ${table}`);
    }),
  };

  return { db, calls };
}

describe("createUploadSession", () => {
  it("creates a pending book, upload job, and presigned R2 upload URL", async () => {
    const { db, calls } = createTableMock();
    const createUploadUrl = vi.fn().mockResolvedValue("https://r2.example/upload-url");

    const result = await createUploadSession(validRequest, {
      user,
      adminClient: db as unknown as AdminClientLike,
      r2Client: { createUploadUrl },
      now: () => new Date("2026-06-22T13:45:00.000Z"),
      randomUUID: vi
        .fn()
        .mockReturnValueOnce("22222222-2222-4222-8222-222222222222")
        .mockReturnValueOnce("44444444-4444-4444-8444-444444444444"),
    });

    expect(result.status).toBe(201);
    if (result.status !== 201) {
      throw new Error("Expected upload session creation to succeed");
    }
    expect(result.body).toMatchObject({
      bookId: "22222222-2222-4222-8222-222222222222",
      uploadJobId: "33333333-3333-4333-8333-333333333333",
      uploadUrl: "https://r2.example/upload-url",
      expiresAt: "2026-06-22T14:00:00.000Z",
    });
    expect(result.body.objectKey).toBe(
      "users/11111111-1111-4111-8111-111111111111/books/22222222-2222-4222-8222-222222222222/original/44444444-4444-4444-8444-444444444444.pdf",
    );
    expect(createUploadUrl).toHaveBeenCalledWith(result.body.objectKey, "application/pdf", 900);
    expect(calls).toEqual([
      {
        table: "books",
        values: expect.objectContaining({
          user_id: user.id,
          title: "Clean Code",
          format: "pdf",
          mime_type: "application/pdf",
          original_filename: "Clean Code.pdf",
          file_size_bytes: 12345,
          file_hash: "a".repeat(64),
          processing_status: "pending_upload",
        }),
      },
      {
        table: "upload_jobs",
        values: expect.objectContaining({
          user_id: user.id,
          book_id: "22222222-2222-4222-8222-222222222222",
          object_key: result.body.objectKey,
          expected_size_bytes: 12345,
          expected_mime_type: "application/pdf",
          status: "pending",
          expires_at: "2026-06-22T14:00:00.000Z",
        }),
      },
    ]);
  });

  it("rejects unsupported upload payloads before writing rows", async () => {
    const { db } = createTableMock();

    const result = await createUploadSession(
      { ...validRequest, mimeType: "text/plain" },
      {
        user,
        adminClient: db as unknown as AdminClientLike,
        r2Client: { createUploadUrl: vi.fn() },
      },
    );

    expect(result.status).toBe(400);
    if (result.status !== 400) {
      throw new Error("Expected invalid payload to be rejected");
    }
    expect(result.body.error).toContain("Unsupported file type");
    expect(db.from).not.toHaveBeenCalled();
  });

  it("returns the existing book id for duplicate active uploads", async () => {
    const { db } = createTableMock();
    const booksTable = db.from("books") as { maybeSingle: { mockResolvedValueOnce: (value: unknown) => void } };
    booksTable.maybeSingle.mockResolvedValueOnce({
      data: { id: "55555555-5555-4555-8555-555555555555" },
      error: null,
    });

    const result = await createUploadSession(validRequest, {
      user,
      adminClient: db as unknown as AdminClientLike,
      r2Client: { createUploadUrl: vi.fn() },
    });

    expect(result.status).toBe(409);
    expect(result.body).toEqual({ duplicateOfBookId: "55555555-5555-4555-8555-555555555555" });
  });
});
