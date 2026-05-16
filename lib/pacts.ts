import { BrowserProvider, Contract, JsonRpcProvider, type ContractRunner } from "ethers";

import { truthPactAbi } from "@/lib/abi/truthPact";
import { baseSepoliaRpcUrl, contractAddress } from "@/lib/config";
import type { Pact } from "@/types/pact";

let readProvider: JsonRpcProvider | null = null;

export function getInjectedEthereumProvider() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const provider = window.ethereum;
  if (!provider) {
    return undefined;
  }

  const providers = provider.providers;
  if (!providers?.length) {
    return provider;
  }

  return (
    providers.find((item) => item.isMetaMask) ||
    providers.find((item) => item.isCoinbaseWallet) ||
    providers.find((item) => item.isRabby) ||
    providers[0]
  );
}

function getReadProvider() {
  if (!readProvider) {
    readProvider = new JsonRpcProvider(baseSepoliaRpcUrl);
  }

  return readProvider;
}

export function getReadContract() {
  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not configured.");
  }

  return new Contract(contractAddress, truthPactAbi, getReadProvider());
}

export async function getBrowserProvider() {
  const injectedProvider = getInjectedEthereumProvider();

  if (!injectedProvider) {
    throw new Error("No injected wallet found.");
  }

  return new BrowserProvider(injectedProvider);
}

export async function getWriteContract() {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();

  return new Contract(contractAddress, truthPactAbi, signer as ContractRunner);
}

export function mapPact(raw: any, id: number): Pact {
  return {
    id,
    client: raw.client,
    worker: raw.worker,
    judge: raw.judge,
    prompt: raw.prompt,
    escrowAmount: BigInt(raw.escrowAmount),
    deadline: BigInt(raw.deadline),
    workURI: raw.workURI,
    workText: raw.workText,
    status: Number(raw.status),
    createdAt: BigInt(raw.createdAt),
    judgedAt: BigInt(raw.judgedAt),
  };
}

export async function fetchPactCount() {
  const contract = getReadContract();
  const count = await contract.pactCount();
  return Number(count);
}

export async function fetchPact(id: number) {
  const contract = getReadContract();
  const pact = await contract.getPact(id);
  return mapPact(pact, id);
}

export async function fetchAllPacts() {
  const count = await fetchPactCount();
  const items = await Promise.all([...Array(count)].map((_, index) => fetchPact(index)));
  return items.sort((a, b) => b.id - a.id);
}

declare global {
  interface EthereumProviderLike {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isRabby?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on?: (event: string, listener: (...args: any[]) => void) => void;
    removeListener?: (event: string, listener: (...args: any[]) => void) => void;
  }

  interface Window {
    ethereum?: EthereumProviderLike & {
      providers?: EthereumProviderLike[];
    };
  }
}
