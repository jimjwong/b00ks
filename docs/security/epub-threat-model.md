# EPUB threat model

EPUB files are zip archives containing XHTML, CSS, images, and metadata.
Because b00ks lets users upload arbitrary EPUB files, every uploaded EPUB
must be treated as **untrusted input**, even though the user uploading it
legitimately owns it — the file may have come from anywhere, and our job is
to render its content without letting it do anything beyond rendering text
and images.

## Risks and mitigations

### 1. Embedded scripts
EPUB XHTML can contain `<script>` tags. The EPUB spec doesn't require
reading systems to execute them, and b00ks must not.

- **Mitigation**: the reader renders chapter content inside a sandboxed
  `<iframe sandbox="allow-same-origin">` (no `allow-scripts`). EPUB.js
  supports rendering into an iframe; we additionally strip `<script>`
  elements and `on*` event handler attributes from chapter HTML before it
  is handed to the renderer, as a second layer beneath the sandbox.

### 2. Embedded remote content (tracking / exfiltration)
A chapter could reference `https://attacker.example/pixel.gif` to track
when/whether a user opens a book, or attempt to load remote stylesheets.

- **Mitigation**: a strict Content-Security-Policy scoped to the reader
  iframe blocks all network fetches except to our own R2-signed-URL origin
  for the book's own assets (`default-src 'none'; img-src 'self' data:;
  style-src 'self' 'unsafe-inline'`). Remote `<img>`/`<link>` URLs outside
  the archive's own asset set are rewritten to a blocked placeholder rather
  than fetched.

### 3. Unsafe links
A chapter could contain a link designed to look trustworthy but navigate to
a phishing page, or use a `javascript:` URI.

- **Mitigation**: all anchor clicks inside the reader iframe are intercepted
  by the host page; internal links (table of contents, footnotes within the
  same book) are resolved against the EPUB's own manifest, and any link
  whose resolved target leaves the book's asset set opens — if at all — in
  a new top-level browser tab with `rel="noopener noreferrer"`, never by
  navigating the iframe or the host app. `javascript:` and `data:`-scheme
  anchors are stripped entirely.

### 4. Attempts to access the parent application
Sandboxed content with `allow-same-origin` could otherwise reach
`window.parent` and poke at the host page's DOM or JavaScript state.

- **Mitigation**: the iframe is served from a distinct origin context
  where possible (a `srcdoc`/blob URL rather than same-origin document),
  and the host never grants `allow-top-navigation` or
  `allow-popups-to-escape-sandbox`. The postMessage channel between the
  iframe and host (used for things like reporting the current CFI for
  progress tracking) only accepts a fixed, narrow set of message shapes,
  validated before use.

### 5. Attempts to access authentication state
Supabase session tokens are stored via `@supabase/ssr` (httpOnly cookies on
web where supported, plus the JS client's in-memory/local storage as a
fallback). Book content must never run in a context that can read these.

- **Mitigation**: because chapter content runs sandboxed without
  `allow-scripts`, it cannot execute JavaScript at all, so it cannot read
  `document.cookie`, `localStorage`, or any in-memory token regardless of
  origin. This is the primary mitigation — the CSP and link handling above
  are defence in depth on top of "the content cannot execute code."

### 6. Malformed or malicious archive contents
A "EPUB" could be a zip bomb, contain path-traversal entry names
(`../../etc/passwd`), or be a corrupted/non-EPUB file with a spoofed
extension.

- **Mitigation**:
  - File size is capped (`MAX_UPLOAD_SIZE_BYTES`) before any unzip happens.
  - The MIME type is checked both client-side and server-side; the server
    additionally validates the file is a real zip archive containing
    `mimetype`/`META-INF/container.xml` before treating it as EPUB.
  - Archive entries are read with a decompressed-size ceiling per entry and
    in aggregate (zip-bomb guard) and any entry name that resolves outside
    the extraction root after normalization is rejected outright.
  - Metadata/cover extraction runs in a try/catch per book; a parsing
    failure marks `processing_status = 'failed'` with a stored
    `processing_error`, but the original file remains downloadable and the
    book row is not lost.

### 7. PDF-specific notes
PDF.js (used for both metadata extraction and rendering) disables
JavaScript execution embedded in PDFs by default; b00ks does not enable it.
PDF rendering happens via `<canvas>`, which has no script execution surface
of its own. PDFs are subject to the same size cap and MIME/signature
validation as EPUBs before processing.

## What this does not cover

- This is not a DRM system. b00ks does not attempt to verify a user
  legitimately owns a file beyond a clear in-product statement that uploads
  must be DRM-free files the user has the legal right to use; it does not
  and will not implement DRM circumvention.
- This document covers the EPUB/PDF rendering surface specifically. See
  `ARCHITECTURE.md` for the broader security model (auth, RLS, presigned
  URLs, object-key randomness) that protects the files themselves at rest
  and in transit.
