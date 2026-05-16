import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { WalletProvider } from "@/lib/wallet-context";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TruthPact",
  description: "AI-agent escrow with truth verification and reactive settlement on Base Sepolia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body className="font-[var(--font-body)]">
        <WalletProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-[-140px] h-[420px] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.24),transparent_55%)]" />
            <div className="pointer-events-none absolute right-[-120px] top-[160px] h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute left-[-80px] top-[520px] h-[280px] w-[280px] rounded-full bg-emerald-400/10 blur-3xl" />
            <SiteHeader />
            <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
