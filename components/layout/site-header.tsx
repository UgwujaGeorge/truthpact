import Link from "next/link";

import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create Pact" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/45 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
            <div className="h-4 w-4 rounded-full bg-[linear-gradient(135deg,#67e8f9,#818cf8)] shadow-[0_0_24px_rgba(103,232,249,0.6)]" />
          </div>
          <div>
            <div className="font-[var(--font-display)] text-lg font-semibold tracking-[-0.02em] text-white">TruthPact</div>
            <div className="protocol-label text-white/35">Truth Escrow Engine</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <ConnectWalletButton />
      </div>
    </header>
  );
}
