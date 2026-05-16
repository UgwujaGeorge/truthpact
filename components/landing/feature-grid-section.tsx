import { Cpu, FileCheck2, Gauge, Orbit, Shield, Workflow } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  { title: "Escrow certainty", copy: "Workers see real ETH commitment before they begin.", icon: Shield },
  { title: "AI judge", copy: "A backend judge produces fast pass/fail reasoning for the Pact.", icon: Cpu },
  { title: "Reactive settlement", copy: "Approval and refund flows resolve from state, not manual chasing.", icon: Workflow },
  { title: "Execution-grade UI", copy: "Timeline, badges, and roles make the process legible to anyone.", icon: Gauge },
  { title: "Truth-source narrative", copy: "Every submission has a rationale trail, not just a yes/no state.", icon: FileCheck2 },
  { title: "Protocol dashboard", copy: "Readable controls keep the dApp surface sharp without exposing rough edges.", icon: Orbit },
];

export function FeatureGridSection() {
  return (
    <section className="py-16">
      <SectionHeading
        eyebrow="Why It Wins"
        title="Everything about the MVP says precision, automation, and trust."
        description="This is narrow enough to ship quickly and visual enough to demo confidently."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <GlassCard key={feature.title} className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-[var(--font-display)] text-lg font-semibold leading-tight tracking-[-0.02em] text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{feature.copy}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
