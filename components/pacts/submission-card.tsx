import { ExternalLink } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import type { Pact } from "@/types/pact";

function detectEvidenceKind(uri: string): string {
  if (!uri) return "";
  const ext = uri.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["txt", "md"].includes(ext)) return "document";
  if (["mp3", "wav", "m4a"].includes(ext)) return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (uri.startsWith("ipfs://") || uri.startsWith("ar://")) return "opaque";
  if (uri.startsWith("http://") || uri.startsWith("https://")) return "url";
  if (uri.startsWith("/uploads/")) return "file";
  return "";
}

function evidenceHref(uri: string): string | null {
  if (!uri) return null;
  if (uri.startsWith("/uploads/") || uri.startsWith("http://") || uri.startsWith("https://")) return uri;
  return null;
}

export function SubmissionCard({ pact }: { pact: Pact }) {
  const evidenceKind = detectEvidenceKind(pact.workURI);
  const href = evidenceHref(pact.workURI);
  const isImage = evidenceKind === "image" && href;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="panel-label">Submitted Work</div>
        {evidenceKind ? <span className="protocol-chip">Evidence: {evidenceKind}</span> : null}
      </div>
      {pact.workURI || pact.workText ? (
        <div className="mt-4 space-y-4">
          <div>
            <div className="protocol-label text-white/35">Work URI</div>
            {pact.workURI ? (
              <div className="mt-2 rounded-[18px] border border-cyan-300/10 bg-cyan-300/[0.05] px-3 py-3">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 break-all font-[var(--font-mono)] text-[12px] text-cyan-100 hover:text-white"
                  >
                    {pact.workURI}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                ) : (
                  <div className="break-all font-[var(--font-mono)] text-[12px] text-cyan-100">{pact.workURI}</div>
                )}
                {isImage ? (
                  <img
                    src={href}
                    alt="Submitted evidence"
                    className="mt-3 max-h-64 w-full rounded-xl border border-white/10 object-contain"
                  />
                ) : null}
              </div>
            ) : (
              <div className="mt-2 rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3 font-[var(--font-mono)] text-[12px] text-white/55">
                No URI attached
              </div>
            )}
          </div>
          <div>
            <div className="protocol-label text-white/35">Work Text</div>
            <div className="mt-2 rounded-[20px] border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-white/72">
              {pact.workText || "No inline text attached."}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/55">
          No submission has been posted yet.
        </div>
      )}
    </GlassCard>
  );
}
