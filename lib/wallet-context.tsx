"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_NAME,
  BASE_SEPOLIA_CURRENCY,
  BASE_SEPOLIA_EXPLORER_URL,
  BASE_SEPOLIA_HEX_CHAIN_ID,
  baseSepoliaRpcUrl,
} from "@/lib/config";
import { getBrowserProvider, getInjectedEthereumProvider } from "@/lib/pacts";

interface WalletContextValue {
  address: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  isBaseSepolia: boolean;
  connectWallet: () => Promise<void>;
  switchToBaseSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

async function parseChainId() {
  if (typeof window === "undefined") return null;

  const provider = await getBrowserProvider().catch(() => null);
  if (!provider) return null;

  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  if (!chainId) return null;
  return chainId;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;

    const sync = async () => {
      const accounts = (await window.ethereum?.request({ method: "eth_accounts" })) as string[];
      setAddress(accounts?.[0] || "");
      setChainId(await parseChainId());
    };

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts?.[0] || "");
    };

    const handleChainChanged = async () => {
      setChainId(await parseChainId());
    };

    void sync();
    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask or another injected wallet is required.");
    }

    setIsConnecting(true);
    try {
      const provider = await getBrowserProvider();
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
      setAddress(accounts?.[0] || "");
      setChainId(await parseChainId());
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToBaseSepolia = async () => {
    const injectedProvider = getInjectedEthereumProvider();
    if (!injectedProvider) return;

    try {
      await injectedProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_SEPOLIA_HEX_CHAIN_ID }],
      });
    } catch (error) {
      const maybeError = error as {
        code?: number;
        message?: string;
        error?: { code?: number; message?: string };
        info?: { error?: { code?: number; message?: string } };
      };

      const nestedCode = maybeError.error?.code ?? maybeError.info?.error?.code;
      const nestedMessage =
        maybeError.message ?? maybeError.error?.message ?? maybeError.info?.error?.message ?? "";
      const shouldAddChain =
        maybeError.code === 4902 ||
        nestedCode === 4902 ||
        nestedMessage.includes("Unrecognized chain ID") ||
        nestedMessage.includes("wallet_addEthereumChain");

      if (!shouldAddChain) {
        throw error;
      }

      await injectedProvider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: BASE_SEPOLIA_HEX_CHAIN_ID,
            chainName: BASE_SEPOLIA_CHAIN_NAME,
            nativeCurrency: BASE_SEPOLIA_CURRENCY,
            rpcUrls: [baseSepoliaRpcUrl],
            blockExplorerUrls: [BASE_SEPOLIA_EXPLORER_URL],
          },
        ],
      });
    }

    setChainId(BASE_SEPOLIA_CHAIN_ID);
  };

  const value = useMemo(
    () => ({
      address,
      chainId,
      isConnected: Boolean(address),
      isConnecting,
      isBaseSepolia: chainId === BASE_SEPOLIA_CHAIN_ID,
      connectWallet,
      switchToBaseSepolia,
    }),
    [address, chainId, isConnecting],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWallet must be used inside WalletProvider.");
  return value;
}
