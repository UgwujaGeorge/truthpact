import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const ALLOWED_EXT = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "pdf",
  "txt",
  "md",
  "mp3",
  "wav",
  "m4a",
  "mp4",
  "mov",
  "webm",
]);

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB limit.` },
        { status: 413 },
      );
    }

    const originalName = file.name || "upload";
    const rawExt = originalName.split(".").pop() || "";
    const ext = rawExt.toLowerCase();

    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: `Unsupported file extension: .${ext || "(none)"}.` },
        { status: 400 },
      );
    }

    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || `upload.${ext}`;
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safeName}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, uniqueName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;
    const mime = file.type && file.type !== "application/octet-stream" ? file.type : MIME_BY_EXT[ext] || "application/octet-stream";

    return NextResponse.json({
      url,
      fileName: originalName,
      fileType: mime,
      fileSize: file.size,
    });
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "Upload failed." },
      { status: 500 },
    );
  }
}
