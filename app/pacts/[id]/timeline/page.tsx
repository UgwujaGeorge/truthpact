"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ExecutionTimeline } from "@/components/pacts/execution-timeline";
import { JudgeResultCard, type JudgeResponse } from "@/components/pacts/judge-result-card";
import { PactDetailHeader } from "@/components/pacts/pact-detail-header";
import { GlassCard } from "@/components/ui/glass-card";
import { fetchPact } from "@/lib/pacts";
import type { Pact } from "@/types/pact";

export default function PactTimelinePage() {
  const params = useParams<{ id: string }>();
  const pactId = Number(params.id);
  const [pact, setPact] = useState<Pact | null>(null);

  useEffect(() => {
    void fetchPact(pactId).then(setPact).catch(() => null);
  }, [pactId]);

  const derivedJudgeResult: JudgeResponse | null =
    pact && pact.status >= 3
      ? {
          verdict: pact.status === 3 ? "approve" : "reject",
          score: pact.status === 3 ? 91 : 34,
          reason:
            pact.status === 3
              ? "Pact reached an approval state and ETH was released to the worker."
              : "Pact reached a rejection or refund state, so worker payment was not released.",
          checklist: ["Onchain state has already reached a terminal judge outcome."],
          settlementStatus: "settled",
        }
      : null;

  if (!pact) {
    return <GlassCard className="p-6 text-sm text-white/60">Loading execution timeline...</GlassCard>;
  }

  return (
    <section className="py-8">
      <PactDetailHeader pact={pact} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <div className="protocol-label text-cyan-200/70">Execution Timeline</div>
          <h2 className="mt-3 font-[var(--font-display)] text-xl font-semibold leading-tight tracking-[-0.02em] text-white">Every transition from agreement to settlement.</h2>
          <div className="mt-6">
            <ExecutionTimeline pact={pact} />
          </div>
        </GlassCard>
        <div className="space-y-6">
          <JudgeResultCard result={derivedJudgeResult} />
          <GlassCard className="p-5">
            <div className="protocol-label">Execution Notes</div>
            <p className="mt-4 text-sm leading-7 text-white/65">
              This timeline is designed to be narrated in a live demo: create a Pact, fund ETH escrow, submit work, invoke the judge, and show the reactive settlement state shift.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
