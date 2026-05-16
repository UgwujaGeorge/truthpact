import { formatDate, formatEth, formatRelativeDeadline, shortAddress } from "@/lib/format";
import { getPactStatusLabel } from "@/lib/status";
import type { Pact } from "@/types/pact";

import { PactStatusBadge } from "./pact-status-badge";

export function PactDetailHeader({ pact }: { pact: Pact }) {
  const stats = [
    { label: "Escrow Amount", value: formatEth(pact.escrowAmount), tone: "from-cyan-400/16 to-blue-500/10" },
    { label: "Deadline", value: formatDate(pact.deadline), tone: "from-violet-400/14 to-fuchsia-500/10" },
    { label: "Status", value: getPactStatusLabel(pact.status), tone: "from-emerald-400/12 to-cyan-500/10" },
    { label: "Time Left", value: formatRelativeDeadline(pact.deadline), tone: "from-sky-400/14 to-cyan-500/10" },
    { label: "Worker", value: shortAddress(pact.worker), tone: "from-indigo-400/14 to-violet-500/10" },
    { label: "Judge", value: shortAddress(pact.judge), tone: "from-pink-400/12 to-fuchsia-500/10" },
  ];

  return (
    <div className="glass-panel p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl">
          <div className="panel-label">Pact #{pact.id}</div>
          <h1 className="mt-2 max-w-3xl font-[var(--font-display)] text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[1.65rem]">
            Truth-bound work agreement
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
            The task prompt below defines what the worker must deliver and what the judge must verify.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <PactStatusBadge status={pact.status} />
          <div className="protocol-chip">
            Client {shortAddress(pact.client)}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(168,85,247,0.08),rgba(59,130,246,0.06))] p-4">
        <div className="panel-label">Task Prompt</div>
        <div className="mt-3 text-sm leading-7 text-white/78">{pact.prompt}</div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="relative rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] p-4">
            <div className={`absolute inset-0 -z-10 rounded-[22px] bg-gradient-to-br ${stat.tone}`} />
            <div className="protocol-label">{stat.label}</div>
            <div className="mt-2 font-[var(--font-mono)] text-[12px] font-semibold uppercase leading-5 text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
