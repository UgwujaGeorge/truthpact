import { formatEther } from "ethers";

export function shortAddress(value: string) {
  if (!value) return "Not set";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatEth(value: bigint) {
  return `${Number(formatEther(value)).toFixed(4)} ETH`;
}

export function formatDate(timestamp: bigint) {
  if (!timestamp) return "Pending";
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export function formatRelativeDeadline(timestamp: bigint) {
  const deltaSeconds = Number(timestamp) - Math.floor(Date.now() / 1000);
  if (deltaSeconds <= 0) return "Expired";

  const hours = Math.floor(deltaSeconds / 3600);
  const minutes = Math.floor((deltaSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

