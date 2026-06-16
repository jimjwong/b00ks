/** Allowed upload MIME types, mapped to the format they represent. */
export const ALLOWED_MIME_TYPES: Record<string, "epub" | "pdf"> = {
  "application/epub+zip": "epub",
  "application/pdf": "pdf",
};

export const ALLOWED_EXTENSIONS: Record<string, "epub" | "pdf"> = {
  epub: "epub",
  pdf: "pdf",
};

export const FILE_HASH_REGEX = /^[a-f0-9]{64}$/i; // sha-256 hex
