import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { formatDate, formatEth, shortAddress } from "@/lib/format";
import type { Pact } from "@/types/pact";

import { PactStatusBadge } from "./pact-status-badge";

export function PactCard({ pact, viewerAddress }: { pact: Pact; viewerAddress?: string }) {
  const normalizedViewer = viewerAddress?.toLowerCase() || "";
  const roles = [
    pact.client.toLowerCase() === normalizedViewer && "Client",
    pact.worker.toLowerCase() === normalizedViewer && "Worker",
    pact.judge.toLowerCase() === normalizedViewer && "Judge",
  ].filter((role): role is string => Boolean(role));

  return (
    <GlassCard className="p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/15">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="protocol-label text-white/35">Pact #{pact.id}</div>
          <h3 className="mt-2 truncate font-[var(--font-display)] text-base font-semibold leading-tight tracking-[-0.01em] text-white">{pact.prompt.slice(0, 64) || "Untitled Pact"}</h3>
        </div>
        <PactStatusBadge status={pact.status} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Escrow Amount", formatEth(pact.escrowAmount)],
            ["Deadline", formatDate(pact.deadline)],
            ["Worker", shortAddress(pact.worker)],
            ["Judge", shortAddress(pact.judge)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[20px] border border-white/8 bg-white/[0.035] px-3 py-3">
              <div className="protocol-label text-white/35">{label}</div>
              <div className="mt-1 font-[var(--font-mono)] text-[12px] font-semibold uppercase text-white">{value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-[22px] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(139,92,246,0.08))] p-4">
          <div className="protocol-label text-white/35">Execution View</div>
          <div className="mt-2 text-sm leading-6 text-white/64">
            Open the pact to fund escrow, submit work, run judging, or inspect settlement.
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <span key={role} className="protocol-chip text-white/60">
              {role}
            </span>
          ))}
        </div>
        <Link href={`/pacts/${pact.id}`} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/[0.08] px-3 py-2 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-300/30 hover:text-white">
          View
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}
