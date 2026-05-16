import { BrainCircuit, LockKeyhole, ReceiptText, Send } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  {
    title: "Create Pact",
    body: "Define the client, worker, judge, scope, escrow amount, and deadline in one agreement.",
    icon: ReceiptText,
  },
  {
    title: "Fund Escrow",
    body: "Lock Base Sepolia ETH into the contract so the worker knows the payment path is real.",
    icon: LockKeyhole,
  },
  {
    title: "Submit Work",
    body: "The worker posts completed work as text or URI directly into the Pact record.",
    icon: Send,
  },
  {
    title: "Judge + Settle",
    body: "The AI judge checks truth and instruction fit, then the Pact reacts with release or refund.",
    icon: BrainCircuit,
  },
];

export function WorkflowSection() {
  return (
    <section className="py-16">
      <SectionHeading
        eyebrow="Workflow"
        title="Four steps from instruction to verified settlement."
        description="TruthPact compresses scope definition, escrow, verification, and ETH settlement into a single visible flow."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <GlassCard key={item.title} className="group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200 transition group-hover:bg-cyan-300/10">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-[var(--font-display)] text-lg font-semibold leading-tight tracking-[-0.02em] text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{item.body}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
