import { getPactStatusLabel, getPactStatusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

const tones = {
  pending: "border-white/10 bg-white/6 text-white/80 shadow-[0_0_22px_rgba(255,255,255,0.06)]",
  funded: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]",
  review: "border-violet-300/20 bg-violet-300/10 text-violet-100 shadow-[0_0_28px_rgba(168,85,247,0.2)]",
  success: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 shadow-[0_0_28px_rgba(52,211,153,0.18)]",
  danger: "border-rose-300/20 bg-rose-300/10 text-rose-100 shadow-[0_0_28px_rgba(244,63,94,0.16)]",
  muted: "border-white/10 bg-white/5 text-white/55 shadow-[0_0_18px_rgba(255,255,255,0.04)]",
};

export function PactStatusBadge({ status }: { status: number }) {
  const tone = getPactStatusTone(status) as keyof typeof tones;

  return (
    <div className={cn("inline-flex rounded-full border px-3 py-1 font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-xl", tones[tone])}>
      {getPactStatusLabel(status)}
    </div>
  );
}
