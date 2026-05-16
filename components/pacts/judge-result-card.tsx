import { AlertTriangle, ExternalLink } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { TRUTHPACT_JUDGE_ENGINE_LABEL, sanitizeJudgeCopy } from "@/lib/judge-copy";
import { BASE_SEPOLIA_EXPLORER_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

export interface JudgeResponse {
  verdict: "approve" | "reject" | "manual_review";
  score: number;
  reason: string;
  checklist: string[];
  evidenceSummary?: string;
  evidenceType?: string;
  model?: string;
  txHash?: string;
  settlementStatus?: "manual" | "settled" | "skipped" | "failed";
  settlementError?: string;
  autoJudgeEnabled?: boolean;
}

const VERDICT_STYLE: Record<JudgeResponse["verdict"], string> = {
  approve:
    "border-emerald-300/24 bg-emerald-300/10 text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.18)]",
  reject:
    "border-rose-300/24 bg-rose-300/10 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,0.18)]",
  manual_review:
    "border-amber-300/30 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.18)]",
};

const VERDICT_LABEL: Record<JudgeResponse["verdict"], string> = {
  approve: "approve",
  reject: "reject",
  manual_review: "manual review",
};

export function JudgeResultCard({
  result,
  isLoading = false,
}: {
  result: JudgeResponse | null;
  isLoading?: boolean;
}) {
  const judgeReasoning = sanitizeJudgeCopy(result?.reason);
  const settlementMessage = sanitizeJudgeCopy(result?.settlementError);

  return (
    <GlassCard className="p-4">
      <div className="panel-label">Judge Result</div>
      {isLoading ? (
        <div className="mt-4 rounded-[20px] border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-4">
          <div className="protocol-label text-cyan-100">AI Evaluation</div>
          <div className="mt-2 text-sm leading-7 text-white/65">
            Analyzing submission evidence, running the Truth Verification Engine, and checking settlement eligibility...
          </div>
        </div>
      ) : result ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="protocol-label">AI Verdict</div>
              <div
                className={cn(
                  "rounded-full border px-3 py-1 font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em]",
                  VERDICT_STYLE[result.verdict],
                )}
              >
                {VERDICT_LABEL[result.verdict]}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="protocol-chip">AI Evaluation</span>
              {result.model ? <span className="protocol-chip">Judge Engine: {TRUTHPACT_JUDGE_ENGINE_LABEL}</span> : null}
              {result.evidenceType ? <span className="protocol-chip">Evidence: {result.evidenceType}</span> : null}
              {result.settlementStatus ? <span className="protocol-chip">Settlement: {result.settlementStatus}</span> : null}
            </div>
            {result.verdict !== "manual_review" ? (
              <div className="mt-4 flex items-end gap-4">
                <div>
                  <div className="protocol-label">Confidence</div>
                  <div className="mt-2 font-[var(--font-mono)] text-2xl font-semibold text-white">{result.score}%</div>
                </div>
                <div className="mb-1 h-2 flex-1 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.9),rgba(168,85,247,0.9),rgba(217,70,239,0.9))]"
                    style={{ width: `${Math.max(8, Math.min(result.score, 100))}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {result.verdict === "manual_review" ? (
            <div className="rounded-[20px] border border-amber-300/24 bg-amber-300/[0.08] p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-200" />
                <div>
                  <div className="protocol-label text-amber-100">Manual Review Required</div>
                  <div className="mt-2 text-sm leading-7 text-amber-50/85">
                    Auto-settlement is disabled for this verdict. The human judge must inspect the submission and call approve or reject on-chain.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {result.evidenceSummary ? (
            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
              <div className="protocol-label">Evidence Summary</div>
              <div className="mt-2 text-sm leading-7 text-white/70">{result.evidenceSummary}</div>
            </div>
          ) : null}

          <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
            <div className="protocol-label">Judge Reasoning</div>
            <div className="mt-2 text-sm leading-7 text-white/70">{judgeReasoning}</div>
          </div>

          {result.checklist?.length ? (
            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
              <div className="protocol-label">Verification Checklist</div>
              <div className="mt-3 space-y-2">
                {result.checklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-[16px] border border-white/8 bg-white/[0.025] px-3 py-2 text-sm leading-6 text-white/65"
                  >
                    {sanitizeJudgeCopy(item)}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {result.txHash ? (
            <div className="rounded-[20px] border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="protocol-label">Settlement Tx</div>
                <a
                  href={`${BASE_SEPOLIA_EXPLORER_URL}/tx/${result.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100 hover:text-white"
                >
                  View
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-2 break-all font-[var(--font-mono)] text-[12px] text-cyan-100">{result.txHash}</div>
            </div>
          ) : null}

          {result.settlementError ? (
            <div
              className={cn(
                "rounded-[20px] border p-4",
                result.settlementStatus === "manual"
                  ? "border-amber-300/24 bg-amber-300/[0.08]"
                  : "border-rose-300/20 bg-rose-300/10",
              )}
            >
              <div
                className={cn(
                  "protocol-label",
                  result.settlementStatus === "manual" ? "text-amber-100" : "text-rose-100",
                )}
              >
                {result.settlementStatus === "manual" ? "Settlement Notice" : "Settlement Error"}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm leading-7",
                  result.settlementStatus === "manual" ? "text-amber-50/85" : "text-rose-100",
                )}
              >
                {settlementMessage}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/55">
          No AI evaluation yet. Run the AI judge after the worker submits their proof.
        </div>
      )}
    </GlassCard>
  );
}
