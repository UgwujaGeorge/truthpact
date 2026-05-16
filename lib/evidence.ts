import { promises as fs } from "fs";
import path from "path";

export type EvidenceKind =
  | "text"
  | "url"
  | "image"
  | "pdf"
  | "document"
  | "audio"
  | "video"
  | "unknown";

export interface GeminiInlinePart {
  inlineData: { mimeType: string; data: string };
}
export interface GeminiTextPart {
  text: string;
}
export type GeminiPart = GeminiInlinePart | GeminiTextPart;

export interface PreparedEvidence {
  evidenceType: EvidenceKind;
  summary: string;
  parts: GeminiPart[];
  manualReview: boolean;
  manualReviewReason?: string;
  fetchedTextPreview?: string;
  bytesLoaded?: number;
  fileMime?: string;
}

const MAX_INLINE_BYTES = 15 * 1024 * 1024;
const MAX_URL_TEXT = 20_000;
const MAX_DOC_TEXT = 60_000;
const FETCH_TIMEOUT_MS = 15_000;

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

function extOf(uri: string): string {
  try {
    const url = new URL(uri);
    return path.extname(url.pathname).slice(1).toLowerCase();
  } catch {
    return path.extname(uri).slice(1).toLowerCase();
  }
}

function kindFromExt(ext: string): EvidenceKind {
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["txt", "md"].includes(ext)) return "document";
  if (["mp3", "wav", "m4a"].includes(ext)) return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  return "unknown";
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function stripHtml(html: string): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).trim().slice(0, 200) : "";
  const cleaned = decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  return { title, text: cleaned.slice(0, MAX_URL_TEXT) };
}

function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function readLocalOrFetch(uri: string): Promise<{ bytes: Buffer; mime: string }> {
  if (uri.startsWith("/uploads/")) {
    const safe = path.normalize(uri).replace(/^\/+/, "");
    if (!safe.startsWith("uploads/") || safe.includes("..")) {
      throw new Error("Invalid local evidence path.");
    }
    const filePath = path.join(process.cwd(), "public", safe);
    const data = await fs.readFile(filePath);
    return { bytes: data, mime: MIME_BY_EXT[extOf(uri)] || "application/octet-stream" };
  }
  const res = await fetchWithTimeout(uri, {
    headers: { "user-agent": "TruthPactBot/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Failed to fetch evidence: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type")?.split(";")[0]?.trim() || MIME_BY_EXT[extOf(uri)] || "application/octet-stream";
  return { bytes: buf, mime };
}

export async function prepareEvidence({
  workText,
  workURI,
}: {
  workText: string;
  workURI: string;
}): Promise<PreparedEvidence> {
  const trimmedURI = workURI.trim();
  const trimmedText = workText.trim();

  if (!trimmedURI) {
    if (!trimmedText) {
      return {
        evidenceType: "text",
        summary: "No evidence provided.",
        parts: [{ text: "(empty submission)" }],
        manualReview: true,
        manualReviewReason: "Submission contains no work text or URI.",
      };
    }
    return {
      evidenceType: "text",
      summary: `Text-only submission (${trimmedText.length} chars).`,
      parts: [{ text: `Worker submission text:\n${trimmedText}` }],
      manualReview: false,
    };
  }

  let isHttp = false;
  try {
    const u = new URL(trimmedURI);
    isHttp = u.protocol === "http:" || u.protocol === "https:";
  } catch {
    // not a URL
  }

  const isLocal = trimmedURI.startsWith("/uploads/");
  const ext = extOf(trimmedURI);
  const kindByExt = kindFromExt(ext);

  if (
    (isLocal || isHttp) &&
    (kindByExt === "image" ||
      kindByExt === "pdf" ||
      kindByExt === "audio" ||
      kindByExt === "video" ||
      kindByExt === "document")
  ) {
    try {
      const { bytes, mime } = await readLocalOrFetch(trimmedURI);

      if (bytes.length > MAX_INLINE_BYTES) {
        return {
          evidenceType: kindByExt,
          summary: `${kindByExt} evidence (${formatBytes(bytes.length)}) exceeds inline limit (${formatBytes(MAX_INLINE_BYTES)}).`,
          parts: [{ text: trimmedText || `Reference: ${trimmedURI}` }],
          manualReview: true,
          manualReviewReason: `Evidence file size exceeds Gemini inline payload limit (${formatBytes(MAX_INLINE_BYTES)}).`,
          bytesLoaded: bytes.length,
          fileMime: mime,
        };
      }

      if (kindByExt === "document") {
        const textContent = bytes.toString("utf8").slice(0, MAX_DOC_TEXT);
        const parts: GeminiPart[] = [
          {
            text: trimmedText
              ? `Worker description:\n${trimmedText}\n\nExtracted document content (truncated to ${MAX_DOC_TEXT} chars):\n${textContent}`
              : `Extracted document content (truncated to ${MAX_DOC_TEXT} chars):\n${textContent}`,
          },
        ];
        return {
          evidenceType: "document",
          summary: `Document evidence (${formatBytes(bytes.length)}, ${textContent.length} chars extracted).`,
          parts,
          manualReview: false,
          fetchedTextPreview: textContent.slice(0, 1200),
          bytesLoaded: bytes.length,
          fileMime: mime,
        };
      }

      const base64 = bytes.toString("base64");
      const parts: GeminiPart[] = [];
      if (trimmedText) parts.push({ text: `Worker description:\n${trimmedText}` });
      parts.push({ inlineData: { mimeType: mime, data: base64 } });

      return {
        evidenceType: kindByExt,
        summary: `${kindByExt} evidence (${formatBytes(bytes.length)}, ${mime}).`,
        parts,
        manualReview: false,
        bytesLoaded: bytes.length,
        fileMime: mime,
      };
    } catch (cause) {
      return {
        evidenceType: kindByExt,
        summary: `${kindByExt} evidence at ${trimmedURI} could not be loaded.`,
        parts: [{ text: trimmedText || `Reference: ${trimmedURI}` }],
        manualReview: true,
        manualReviewReason: cause instanceof Error ? cause.message : "Failed to load evidence file.",
      };
    }
  }

  if (isHttp) {
    try {
      const res = await fetchWithTimeout(trimmedURI, {
        headers: { "user-agent": "TruthPactBot/1.0" },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching URL`);
      const contentType = (res.headers.get("content-type") || "").split(";")[0]?.trim() || "";

      if (contentType.startsWith("image/")) {
        const bytes = Buffer.from(await res.arrayBuffer());
        if (bytes.length > MAX_INLINE_BYTES) {
          return {
            evidenceType: "image",
            summary: `Image (${formatBytes(bytes.length)}) exceeds inline limit.`,
            parts: [{ text: trimmedText || `Reference: ${trimmedURI}` }],
            manualReview: true,
            manualReviewReason: `Image size exceeds Gemini inline payload limit.`,
          };
        }
        const base64 = bytes.toString("base64");
        return {
          evidenceType: "image",
          summary: `Image evidence from URL (${formatBytes(bytes.length)}, ${contentType}).`,
          parts: trimmedText
            ? [{ text: `Worker description:\n${trimmedText}` }, { inlineData: { mimeType: contentType, data: base64 } }]
            : [{ inlineData: { mimeType: contentType, data: base64 } }],
          manualReview: false,
          bytesLoaded: bytes.length,
          fileMime: contentType,
        };
      }

      if (contentType.includes("pdf")) {
        const bytes = Buffer.from(await res.arrayBuffer());
        if (bytes.length > MAX_INLINE_BYTES) {
          return {
            evidenceType: "pdf",
            summary: `PDF (${formatBytes(bytes.length)}) exceeds inline limit.`,
            parts: [{ text: trimmedText || `Reference: ${trimmedURI}` }],
            manualReview: true,
            manualReviewReason: `PDF size exceeds Gemini inline payload limit.`,
          };
        }
        const base64 = bytes.toString("base64");
        return {
          evidenceType: "pdf",
          summary: `PDF evidence from URL (${formatBytes(bytes.length)}).`,
          parts: trimmedText
            ? [{ text: `Worker description:\n${trimmedText}` }, { inlineData: { mimeType: "application/pdf", data: base64 } }]
            : [{ inlineData: { mimeType: "application/pdf", data: base64 } }],
          manualReview: false,
          bytesLoaded: bytes.length,
          fileMime: "application/pdf",
        };
      }

      const html = await res.text();
      const { title, text } = stripHtml(html);
      const headerBits = [
        `URL: ${trimmedURI}`,
        title ? `Page title: ${title}` : "",
        trimmedText ? `Worker description:\n${trimmedText}` : "",
        `Extracted page text (truncated to ${MAX_URL_TEXT} chars):\n${text || "(no readable text)"}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      return {
        evidenceType: "url",
        summary: `Webpage evidence${title ? `: ${title}` : ""} (${text.length} chars extracted).`,
        parts: [{ text: headerBits }],
        manualReview: text.length === 0,
        manualReviewReason: text.length === 0 ? "Fetched page had no extractable text." : undefined,
        fetchedTextPreview: text.slice(0, 1200),
      };
    } catch (cause) {
      return {
        evidenceType: "url",
        summary: `Failed to fetch URL: ${trimmedURI}`,
        parts: [{ text: trimmedText || `Reference: ${trimmedURI}` }],
        manualReview: true,
        manualReviewReason: cause instanceof Error ? cause.message : "Failed to fetch URL.",
      };
    }
  }

  return {
    evidenceType: "unknown",
    summary: `Opaque URI (${trimmedURI}). Cannot be inspected automatically.`,
    parts: [{ text: trimmedText || `Reference: ${trimmedURI}` }],
    manualReview: true,
    manualReviewReason:
      "Submission references an opaque URI scheme (e.g., ipfs://) that the judge cannot resolve. Provide a public URL or upload the file.",
  };
}
