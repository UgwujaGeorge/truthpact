import { GlowButton } from "@/components/ui/glow-button";
import { GlassCard } from "@/components/ui/glass-card";

export function CtaSection() {
  return (
    <section className="py-16">
      <GlassCard className="overflow-hidden p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.16),transparent_35%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="protocol-label text-cyan-200/70">Launch</div>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.45rem]">
              Build the Pact. Lock the ETH. Let truth settle the rest.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/65">
              Start with one clear agreement and turn TruthPact into your Base Sepolia demo centerpiece.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GlowButton href="/create">Create a Pact</GlowButton>
            <GlowButton href="/dashboard" variant="secondary">
              View Dashboard
            </GlowButton>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
