import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function PactPreviewSection() {
  return (
    <section className="grid gap-8 py-16 lg:grid-cols-[0.95fr_1.05fr]">
      <SectionHeading
        eyebrow="State View"
        title="A live Pact reads like an execution ledger, not a crypto toy."
        description="Every stage carries a visible state transition so clients, workers, and judges understand who acts next and why."
      />
      <GlassCard className="overflow-hidden p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <div className="protocol-label">Participants</div>
            <div className="mt-4 space-y-3 text-sm text-white/65">
              <div className="flex justify-between gap-3"><span>Client</span><span className="text-white">0x91c7...42aa</span></div>
              <div className="flex justify-between gap-3"><span>Worker</span><span className="text-white">0x6ed1...1b90</span></div>
              <div className="flex justify-between gap-3"><span>Judge</span><span className="text-white">0x2f95...b0cd</span></div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <div className="protocol-label">Pact State</div>
            <div className="mt-4 space-y-3 text-sm text-white/65">
              <div className="flex justify-between gap-3"><span>Escrow Amount</span><span className="text-white">0.1800 ETH</span></div>
              <div className="flex justify-between gap-3"><span>Status</span><span className="rounded-full bg-cyan-300/10 px-3 py-1 font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">Submitted</span></div>
              <div className="flex justify-between gap-3"><span>Deadline</span><span className="text-white">6h 18m</span></div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(99,102,241,0.06))] p-5">
          <div className="protocol-label">Prompt</div>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Produce a concise diligence memo explaining why the covenant monitor should flag deteriorating collateral coverage.
          </p>
        </div>
      </GlassCard>
    </section>
  );
}
