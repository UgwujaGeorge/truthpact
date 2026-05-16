import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "border border-cyan-200/25 bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(99,102,241,0.95),rgba(217,70,239,0.92))] bg-[length:200%_200%] text-slate-950 shadow-[0_0_48px_rgba(99,102,241,0.28)] animate-shimmer hover:translate-y-[-1px] hover:shadow-[0_0_56px_rgba(34,211,238,0.24)]",
  secondary:
    "border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(59,130,246,0.1))] text-cyan-100 hover:border-cyan-300/35 hover:bg-cyan-300/15",
  ghost: "border border-white/10 bg-white/[0.045] text-white hover:border-white/20 hover:bg-white/9",
  danger: "border border-rose-400/24 bg-[linear-gradient(135deg,rgba(244,63,94,0.14),rgba(217,70,239,0.08))] text-rose-100 hover:bg-rose-400/16",
};

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: Variant;
  fullWidth?: boolean;
}

export function GlowButton({
  className,
  children,
  href,
  variant = "primary",
  fullWidth = false,
  ...props
}: GlowButtonProps) {
  const baseClassName = cn(
    "inline-flex h-10 items-center justify-center rounded-full px-4 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200",
    styles[variant],
    fullWidth && "w-full",
    props.disabled && "cursor-not-allowed opacity-50",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClassName} {...props}>
      {children}
    </button>
  );
}
