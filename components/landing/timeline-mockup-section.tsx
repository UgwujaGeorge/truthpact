import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const timelineRows = [
  ["00:00", "Pact created", "Agreement deployed with client, worker, judge, and deadline."],
  ["00:07", "Escrow funded", "Payment locked in contract and visible to the worker."],
  ["01:14", "Work submitted", "Submission attached as URI with supporting text."],
  ["01:17", "Judge invoked", "Truth-source evaluation begins in the backend."],
  ["01:18", "Verdict written", "Approval returned with confidence and rationale."],
  ["01:18", "Reactive settlement", "ETH released to worker without manual coordination."],
];

export function TimelineMockupSection() {
  return (
    <section className="py-16">
      <SectionHeading
        eyebrow="Execution Log"
        title="The timeline is the demo centerpiece."
        description="Instead of hiding automation, TruthPact surfaces every transition as a premium execution trace."
      />
      <GlassCard className="mt-10 overflow-hidden p-6">
        <div className="grid gap-3">
          {timelineRows.map(([time, title, copy], index) => (
            <div
              key={title}
              className="grid gap-4 rounded-[26px] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[90px_1fr]"
            >
              <div className="font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">{time}</div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.65)]" />
                {index < timelineRows.length - 1 ? (
                  <div className="absolute left-[5px] top-6 h-[calc(100%+8px)] w-px bg-gradient-to-b from-cyan-300/40 to-transparent" />
                ) : null}
                <div className="font-[var(--font-mono)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white">{title}</div>
                <div className="mt-1 text-sm leading-6 text-white/60">{copy}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
