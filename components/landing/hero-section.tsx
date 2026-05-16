import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { StatPill } from "@/components/ui/stat-pill";

export function HeroSection() {
  return (
    <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
      <div>
        <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
          [LIVE] // AI ESCROW PROTOCOL ON BASE SEPOLIA
        </div>
        <h1 className="mt-6 max-w-4xl font-[var(--font-display)] text-[3.15rem] font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-7xl lg:text-[5.35rem]">
          Lock the terms.
          <br />
          Verify the truth.
          <br />
          Settle onchain.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-7 text-white/65">
          TruthPact turns scoped work into an encrypted-feeling execution lane: ETH locked on Base Sepolia,
          deliverables committed, AI judge invoked, settlement resolved from the Pact state.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <GlowButton href="/create">
            Launch a Pact
            <ArrowRight className="ml-2 h-4 w-4" />
          </GlowButton>
          <GlowButton href="/dashboard" variant="ghost">
            Explore Dashboard
          </GlowButton>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <StatPill label="Settlement" value="Reactive ETH release" />
          <StatPill label="Verification" value="AI judge + timeline" />
          <StatPill label="Network" value="Base Sepolia" />
        </div>
      </div>

      <GlassCard className="relative overflow-hidden p-6 sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.18),transparent_35%)]" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="protocol-label">Live Pact Preview</div>
              <div className="mt-2 font-[var(--font-display)] text-xl font-semibold leading-tight tracking-[-0.02em] text-white">Research Sprint #014</div>
            </div>
            <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
              Funded
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 text-cyan-200">
                <Sparkles className="h-4 w-4" />
                <span className="protocol-label">Prompt</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/75">Generate a polished market brief and reference deck.</p>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                <span className="protocol-label">Judge</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/75">AI truth-source checks instruction fit and delivery quality.</p>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 text-indigo-200">
                <Zap className="h-4 w-4" />
                <span className="protocol-label">Escrow Amount</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/75">0.1800 ETH held until verdict lands onchain.</p>
            </GlassCard>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/50 p-5">
            <div className="flex items-center justify-between font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              <span>Execution Timeline</span>
              <span>Autonomous</span>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["Pact Created", "Prompt defined, judge bound, deadline committed."],
                ["Escrow Funded", "Base Sepolia ETH locked and visible on the Pact state."],
                ["Work Submitted", "Worker publishes URI and truth claims."],
                ["AI Judge Approved", "Verification passed. Reactive release armed."],
              ].map(([title, copy], index) => (
                <div key={title} className="flex gap-4">
                  <div className="flex w-6 flex-col items-center">
                    <div className="status-ring h-3.5 w-3.5 rounded-full bg-cyan-300 animate-pulseline" />
                    {index < 3 ? <div className="mt-1 h-full w-px bg-gradient-to-b from-cyan-300/40 to-transparent" /> : null}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-sm text-white/55">{copy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
