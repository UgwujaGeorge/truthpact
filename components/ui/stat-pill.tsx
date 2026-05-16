import { cn } from "@/lib/utils";

export function StatPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl", className)}>
      <div className="protocol-label">{label}</div>
      <div className="mt-1 font-[var(--font-mono)] text-[12px] font-semibold uppercase text-white">{value}</div>
    </div>
  );
}
