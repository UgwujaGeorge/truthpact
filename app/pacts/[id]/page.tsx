"use client";

import Link from "next/link";
import { ArrowUpRight, FileCheck2, Layers3, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ExecutionTimeline } from "@/components/pacts/execution-timeline";
import { JudgeResultCard, type JudgeResponse } from "@/components/pacts/judge-result-card";
import { PactDetailHeader } from "@/components/pacts/pact-detail-header";
import { PactMetadataCard } from "@/components/pacts/pact-metadata-card";
import { SubmissionCard } from "@/components/pacts/submission-card";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { BASE_SEPOLIA_CHAIN_NAME } from "@/lib/config";
import { sanitizeJudgeCopy } from "@/lib/judge-copy";
import { fetchPact, getWriteContract } from "@/lib/pacts";
import { useWallet } from "@/lib/wallet-context";
import type { Pact } from "@/types/pact";

export default function PactDetailPage() {
  const params = useParams<{ id: string }>();
  const pactId = Number(params.id);
  const [pact, setPact] = useState<Pact | null>(null);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [judgeResult, setJudgeResult] = useState<JudgeResponse | null>(null);
  const { address, isConnected, isBaseSepolia } = useWallet();

  async function load() {
    try {
      setError("");
      setPact(await fetchPact(pactId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load pact.");
    }
  }

  useEffect(() => {
    void load();
  }, [pactId]);

  const role = useMemo(() => {
    if (!pact || !address) return null;
    const wallet = address.toLowerCase();
    if (wallet === pact.client.toLowerCase()) return "client";
    if (wallet === pact.worker.toLowerCase()) return "worker";
    if (wallet === pact.judge.toLowerCase()) return "judge";
    return null;
  }, [address, pact]);

  const expired = pact ? Number(pact.deadline) < Math.floor(Date.now() / 1000) : false;

  async function runContractAction(action: "fund" | "approve" | "reject" | "refund") {
    if (!pact) return;
    if (!isConnected || !isBaseSepolia) {
      setError(`Connect a ${BASE_SEPOLIA_CHAIN_NAME} wallet to perform this action.`);
      return;
    }

    try {
      setBusyAction(action);
      setError("");
      const contract = await getWriteContract();

      if (action === "fund") {
        const tx = await contract.fundPact(pact.id, { value: pact.escrowAmount });
        await tx.wait();
      }

      if (action === "approve") {
        const tx = await contract.approvePact(pact.id);
        await tx.wait();
      }

      if (action === "reject") {
        const tx = await contract.rejectPact(pact.id);
        await tx.wait();
      }

      if (action === "refund") {
        const tx = await contract.refundExpiredPact(pact.id);
        await tx.wait();
      }

      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Action failed.");
    } finally {
      setBusyAction("");
    }
  }

  async function runJudge() {
    if (!pact) return;

    try {
      setBusyAction("judge");
      setError("");
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pactId: pact.id }),
      });
      const data = (await response.json()) as JudgeResponse & { error?: string };
      if (!response.ok) {
        setJudgeResult(data.verdict ? data : null);
        throw new Error(sanitizeJudgeCopy(data.error || "Judge request failed."));
      }
      setJudgeResult(data);
      await load();
    } catch (cause) {
      setError(sanitizeJudgeCopy(cause instanceof Error ? cause.message : "Judge request failed."));
    } finally {
      setBusyAction("");
    }
  }

  if (!pact && !error) {
    return <GlassCard className="p-6 text-sm text-white/60">Loading Pact details...</GlassCard>;
  }

  if (error && !pact) {
    return <GlassCard className="p-6 text-sm text-rose-100">{error}</GlassCard>;
  }

  if (!pact) return null;

  return (
    <section className="py-8">
      <PactDetailHeader pact={pact} />
      {error ? <div className="mt-5 rounded-[20px] border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="panel-label">Execution Timeline</div>
                <div className="mt-2 panel-title">Reactive settlement path</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.08] text-cyan-100">
                <Layers3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-5">
              <ExecutionTimeline pact={pact} />
            </div>
          </GlassCard>

          <SubmissionCard pact={pact} />
        </div>

        <div className="space-y-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="panel-label">Execution Controls</div>
                <div className="mt-2 panel-title">Role-aware actions</div>
              </div>
              <Link
                href={`/pacts/${pact.id}/timeline`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-300/18 hover:text-white"
              >
                Full Timeline
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 rounded-[22px] border border-white/8 bg-[linear-gradient(135deg,rgba(34,211,238,0.06),rgba(168,85,247,0.06))] p-4">
              <div className="protocol-label flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                Current access
              </div>
              <p className="mt-2 text-sm leading-7 text-white/62">
                Actions only appear when the connected wallet matches the required Pact role and the Pact status allows that action.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {role === "client" && pact.status === 0 ? (
                <GlowButton onClick={() => void runContractAction("fund")} disabled={busyAction === "fund"}>
                  {busyAction === "fund" ? "Funding..." : "Fund Escrow"}
                </GlowButton>
              ) : null}
              {role === "worker" && pact.status === 1 ? <GlowButton href={`/pacts/${pact.id}/submit`}>Submit Work</GlowButton> : null}
              {role === "judge" && pact.status === 2 && !expired ? (
                <>
                  <GlowButton onClick={() => void runContractAction("approve")} disabled={busyAction === "approve"}>
                    {busyAction === "approve" ? "Approving..." : "Approve"}
                  </GlowButton>
                  <GlowButton variant="danger" onClick={() => void runContractAction("reject")} disabled={busyAction === "reject"}>
                    {busyAction === "reject" ? "Rejecting..." : "Reject"}
                  </GlowButton>
                </>
              ) : null}
              {pact.status === 2 ? (
                <GlowButton variant="secondary" onClick={() => void runJudge()} disabled={busyAction === "judge"}>
                  {busyAction === "judge" ? "Analyzing Submission..." : "Run AI Judge"}
                </GlowButton>
              ) : null}
              {role === "client" && expired && pact.status <= 2 ? (
                <GlowButton variant="danger" onClick={() => void runContractAction("refund")} disabled={busyAction === "refund"}>
                  {busyAction === "refund" ? "Refunding..." : "Refund Client"}
                </GlowButton>
              ) : null}
            </div>

            {!role ? (
              <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/55">
                Connect the wallet that matches the client, worker, or judge role to unlock the appropriate action.
              </div>
            ) : null}
          </GlassCard>

          <JudgeResultCard result={judgeResult} isLoading={busyAction === "judge"} />
          <PactMetadataCard pact={pact} />

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/12 bg-violet-300/[0.08] text-violet-100">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <div className="panel-label">Role Reminder</div>
                <div className="mt-1 text-sm leading-6 text-white/65">
                  Client creates and funds. Worker submits. Judge settles. The contract enforces the path.
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
