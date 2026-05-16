import { GlassCard } from "@/components/ui/glass-card";
import { shortAddress } from "@/lib/format";
import type { Pact } from "@/types/pact";

export function PactMetadataCard({ pact }: { pact: Pact }) {
  const fields = [
    ["Client", shortAddress(pact.client)],
    ["Worker", shortAddress(pact.worker)],
    ["Judge", shortAddress(pact.judge)],
    ["Prompt Length", `${pact.prompt.length} chars`],
  ];

  return (
    <GlassCard className="p-4">
      <div className="panel-label">Pact Metadata</div>
      <div className="mt-4 space-y-3">
        {fields.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-[18px] border border-white/6 bg-white/[0.03] px-3 py-3">
            <span className="protocol-label">{label}</span>
            <span className="font-[var(--font-mono)] text-[12px] font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
