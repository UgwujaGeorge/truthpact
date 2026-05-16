"use client";

import { Activity, Layers3, ScanSearch, UserRound } from "lucide-react";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";

import { PactCard } from "@/components/pacts/pact-card";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { fetchAllPacts } from "@/lib/pacts";
import { useWallet } from "@/lib/wallet-context";
import type { Pact } from "@/types/pact";

export default function DashboardPage() {
  const [pacts, setPacts] = useState<Pact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { address } = useWallet();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        setPacts(await fetchAllPacts());
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load pacts.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const stats = useMemo(() => {
    const mine = address
      ? pacts.filter((pact) => [pact.client, pact.worker, pact.judge].some((item) => item.toLowerCase() === address.toLowerCase()))
      : [];
    return {
      total: pacts.length,
      active: pacts.filter((pact) => pact.status <= 2).length,
      awaitingJudge: pacts.filter((pact) => pact.status === 2).length,
      mine: mine.length,
    };
  }, [address, pacts]);

  return (
    <section className="py-8">
      <div className="glass-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="panel-label">Command Center</div>
            <h1 className="mt-3 font-[var(--font-display)] text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.1rem]">Pact Dashboard</h1>
            <p className="mt-4 text-sm leading-7 text-white/62">
              Track every agreement from creation to funding, submission, judgment, and final settlement. TruthPact keeps the workflow readable at a glance.
            </p>
          </div>
          <GlowButton href="/create">New Pact</GlowButton>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <HeroStat icon={Layers3} label="Total Pacts" value={`${stats.total}`} tone="from-cyan-400/16 to-blue-500/12" />
          <HeroStat icon={Activity} label="Active" value={`${stats.active}`} tone="from-violet-400/14 to-fuchsia-500/12" />
          <HeroStat icon={ScanSearch} label="Awaiting Judge" value={`${stats.awaitingJudge}`} tone="from-sky-400/14 to-cyan-500/12" />
          <HeroStat icon={UserRound} label="My Roles" value={`${stats.mine}`} tone="from-pink-400/12 to-violet-500/12" />
        </div>
      </div>

      {error ? <div className="mt-6 rounded-[20px] border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

      <div className="mt-6 grid gap-4">
        {loading ? (
          <GlassCard className="p-5 text-sm text-white/60">Loading TruthPact state from Base Sepolia...</GlassCard>
        ) : pacts.length ? (
          pacts.map((pact) => <PactCard key={pact.id} pact={pact} viewerAddress={address} />)
        ) : (
          <GlassCard className="p-6 text-sm text-white/60">
            No Pact exists yet. Create the first one and start the execution timeline.
          </GlassCard>
        )}
      </div>
    </section>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="relative rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <div className={`absolute inset-0 -z-10 rounded-[22px] bg-gradient-to-br ${tone}`} />
      <div className="flex items-center justify-between gap-3">
        <div className="protocol-label">{label}</div>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 font-[var(--font-mono)] text-2xl font-semibold uppercase text-white">{value}</div>
    </div>
  );
}
