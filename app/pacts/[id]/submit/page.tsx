"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { fetchPact, getWriteContract } from "@/lib/pacts";
import { cn } from "@/lib/utils";
import type { Pact } from "@/types/pact";

type SubmissionMode = "text" | "url" | "file";

interface UploadInfo {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

const ACCEPT_ATTR = ".png,.jpg,.jpeg,.webp,.pdf,.txt,.md,.mp3,.wav,.m4a,.mp4,.mov,.webm";

const MODE_OPTIONS: Array<{ value: SubmissionMode; label: string; hint: string }> = [
  { value: "text", label: "Text", hint: "Inline written work." },
  { value: "url", label: "URL", hint: "Public link to evidence." },
  { value: "file", label: "File", hint: "Image / PDF / audio / video." },
];

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function detectFileKind(mime: string, name: string): string {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime.includes("pdf")) return "pdf";
  if (mime.startsWith("text/")) return "document";
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return "image";
  if (["mp3", "wav", "m4a"].includes(ext)) return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["txt", "md"].includes(ext)) return "document";
  return "file";
}

export default function SubmitWorkPage() {
  const params = useParams<{ id: string }>();
  const pactId = Number(params.id);
  const [pact, setPact] = useState<Pact | null>(null);
  const [mode, setMode] = useState<SubmissionMode>("text");
  const [workURI, setWorkURI] = useState("");
  const [workText, setWorkText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    void fetchPact(pactId)
      .then(setPact)
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Failed to load pact."));
  }, [pactId]);

  const filePreviewUrl = useMemo(() => {
    if (!pendingFile) return "";
    if (!pendingFile.type.startsWith("image/")) return "";
    return URL.createObjectURL(pendingFile);
  }, [pendingFile]);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  function resetEvidenceState() {
    setWorkURI("");
    setPendingFile(null);
    setUploadInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function selectMode(next: SubmissionMode) {
    if (next === mode) return;
    setMode(next);
    setError("");
    resetEvidenceState();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPendingFile(file);
    setUploadInfo(null);
    setError("");
  }

  async function handleUpload() {
    if (!pendingFile) return;
    try {
      setUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", pendingFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as UploadInfo & { error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setUploadInfo(data);
      setWorkURI(data.url);
    } catch (cause) {
      setUploadInfo(null);
      setWorkURI("");
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "file" && !uploadInfo) {
      setError("Upload the file before submitting on-chain.");
      return;
    }
    if (mode === "url" && !workURI.trim()) {
      setError("Provide a URL to evidence before submitting.");
      return;
    }
    if (mode === "text" && !workText.trim()) {
      setError("Add your text submission before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const contract = await getWriteContract();
      const tx = await contract.submitWork(pactId, workURI.trim(), workText);
      await tx.wait();
      router.push(`/pacts/${pactId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to submit work.");
    } finally {
      setSubmitting(false);
    }
  }

  const detectedKind = pendingFile ? detectFileKind(pendingFile.type || "", pendingFile.name) : "";
  const submitDisabled =
    submitting ||
    uploading ||
    (mode === "file" && !uploadInfo) ||
    (mode === "url" && !workURI.trim()) ||
    (mode === "text" && !workText.trim());

  return (
    <section className="py-8">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-6">
          <div className="protocol-label text-cyan-200/70">Worker Submission</div>
          <h1 className="mt-3 font-[var(--font-display)] text-2xl font-semibold leading-tight tracking-[-0.02em] text-white">
            Attach proof to the Pact.
          </h1>

          <div className="mt-6">
            <div className="protocol-label mb-3 block">Evidence Type</div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectMode(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-left transition",
                    mode === option.value
                      ? "border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(168,85,247,0.16))] shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                      : "border border-transparent hover:border-white/10 hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em]",
                      mode === option.value ? "text-cyan-100" : "text-white/55",
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="text-[11px] leading-4 text-white/45">{option.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            {mode === "url" ? (
              <div>
                <label className="protocol-label mb-2 block">Work URL</label>
                <input
                  value={workURI}
                  onChange={(event) => setWorkURI(event.target.value)}
                  placeholder="https://..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-[var(--font-mono)] text-[13px] text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/30"
                />
                <div className="mt-2 text-[11px] leading-5 text-white/40">
                  The AI judge will fetch the URL and analyze its page text, image, or PDF content.
                </div>
              </div>
            ) : null}

            {mode === "file" ? (
              <div>
                <label className="protocol-label mb-2 block">File Upload</label>
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_ATTR}
                    onChange={handleFileChange}
                    className="block w-full text-[12px] text-white/70 file:mr-3 file:rounded-full file:border file:border-cyan-300/25 file:bg-cyan-300/10 file:px-3 file:py-1.5 file:font-[var(--font-mono)] file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.16em] file:text-cyan-100 hover:file:bg-cyan-300/15"
                  />
                  <div className="mt-3 text-[11px] leading-5 text-white/40">
                    Images (png/jpg/webp), PDF, txt/md, audio (mp3/wav/m4a), or video (mp4/mov/webm). Max 15 MB.
                  </div>

                  {pendingFile ? (
                    <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-slate-950/45 p-4 sm:grid-cols-[auto_1fr]">
                      {filePreviewUrl ? (
                        <img
                          src={filePreviewUrl}
                          alt={pendingFile.name}
                          className="h-20 w-20 rounded-lg border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cyan-100/80">
                          {detectedKind || "file"}
                        </div>
                      )}
                      <div className="min-w-0 space-y-1.5">
                        <div className="truncate font-[var(--font-mono)] text-[12px] text-white">{pendingFile.name}</div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-white/50">
                          <span className="protocol-chip">{detectedKind || "file"}</span>
                          <span className="protocol-chip">{pendingFile.type || "unknown mime"}</span>
                          <span className="protocol-chip">{formatBytes(pendingFile.size)}</span>
                        </div>
                        <div className="pt-2">
                          {uploadInfo ? (
                            <div className="rounded-lg border border-emerald-300/24 bg-emerald-300/10 px-3 py-2 font-[var(--font-mono)] text-[11px] text-emerald-100">
                              Uploaded — stored at {uploadInfo.url}
                            </div>
                          ) : (
                            <GlowButton
                              type="button"
                              variant="secondary"
                              onClick={() => void handleUpload()}
                              disabled={uploading}
                            >
                              {uploading ? "Uploading..." : "Upload to TruthPact"}
                            </GlowButton>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div>
              <label className="protocol-label mb-2 block">
                {mode === "text" ? "Work Text" : "Work Summary"}
              </label>
              <textarea
                value={workText}
                onChange={(event) => setWorkText(event.target.value)}
                placeholder={
                  mode === "text"
                    ? "Paste or write the deliverable here. The judge will read it directly."
                    : "Optional: briefly describe what the attached evidence demonstrates."
                }
                className="min-h-[200px] w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/30"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <GlowButton type="submit" fullWidth disabled={submitDisabled}>
              {submitting ? "Submitting..." : "Submit Work"}
            </GlowButton>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="protocol-label">Pact Context</div>
          {pact ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
                <div className="protocol-label text-white/35">Task Prompt</div>
                <p className="mt-3 text-sm leading-7 text-white/70">{pact.prompt}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
                <div className="protocol-label text-white/35">Evidence Pipeline</div>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-white/65">
                  <li>• Text submissions are sent directly into the Truth Verification Engine.</li>
                  <li>• URLs are fetched server-side; text, images and PDFs are extracted.</li>
                  <li>• Uploaded files are processed as inline evidence by the AI Verification Layer.</li>
                  <li>• Unsupported or oversized evidence falls back to manual judge review.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-white/60">Loading Pact context...</div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
