"use client";

import { AlertTriangle, Wallet } from "lucide-react";

import { GlowButton } from "@/components/ui/glow-button";
import { shortAddress } from "@/lib/format";
import { useWallet } from "@/lib/wallet-context";
import { BASE_SEPOLIA_CHAIN_NAME } from "@/lib/config";

export function ConnectWalletButton() {
  const { address, isConnected, isConnecting, isBaseSepolia, connectWallet, switchToBaseSepolia } = useWallet();

  if (!isConnected) {
    return (
      <GlowButton onClick={() => void connectWallet()} variant="secondary">
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </GlowButton>
    );
  }

  if (!isBaseSepolia) {
    return (
      <GlowButton onClick={() => void switchToBaseSepolia()} variant="danger">
        <AlertTriangle className="mr-2 h-4 w-4" />
        Switch to {BASE_SEPOLIA_CHAIN_NAME}
      </GlowButton>
    );
  }

  return (
    <div className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
      {shortAddress(address)}
    </div>
  );
}
