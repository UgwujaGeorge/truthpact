import { CheckCircle2, CircleDashed, Clock3, Send, ShieldCheck, Wallet2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Pact } from "@/types/pact";

const steps = [
  { key: 0, title: "Pact created", icon: CircleDashed },
  { key: 1, title: "Escrow funded", icon: Wallet2 },
  { key: 2, title: "Work submitted", icon: Send },
  { key: 3, title: "Judge approved", icon: ShieldCheck },
  { key: 4, title: "Judge rejected", icon: ShieldCheck },
  { key: 5, title: "Client refunded", icon: CheckCircle2 },
];

export function ExecutionTimeline({ pact }: { pact: Pact }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = pact.status >= step.key && !(step.key === 4 && pact.status !== 4) && !(step.key === 5 && pact.status !== 5);
        const hideApproved = step.key === 3 && pact.status === 4;
        const hideRejected = step.key === 4 && pact.status !== 4;
        const hideRefund = step.key === 5 && pact.status !== 5;

        if (hideApproved || hideRejected || hideRefund) {
          if (step.key > 2 && pact.status < 3) return null;
          if (hideRejected || hideRefund) return null;
        }

        return (
          <div key={step.title} className="flex gap-4 rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-4">
            <div className="flex w-9 flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                  isActive
                    ? "border-cyan-300/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(168,85,247,0.14))] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]"
                    : "border-white/10 bg-white/5 text-white/35",
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 ? <div className="mt-2 h-full w-px bg-gradient-to-b from-cyan-300/30 to-transparent" /> : null}
            </div>
            <div className="min-w-0">
              <div className="font-[var(--font-mono)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white">{step.title}</div>
              <div className="mt-1 text-sm leading-6 text-white/55">
                {isActive ? "Recorded in the Pact execution path." : "Awaiting this transition."}
              </div>
            </div>
          </div>
        );
      })}
      {pact.status <= 2 ? (
        <div className="flex items-center gap-3 rounded-[22px] border border-violet-300/15 bg-[linear-gradient(135deg,rgba(168,85,247,0.08),rgba(34,211,238,0.05))] p-4 text-sm text-violet-100">
          <Clock3 className="h-4 w-4" />
          Timeline will continue once the judge writes a verdict or the client refunds after expiry.
        </div>
      ) : null}
    </div>
  );
}
