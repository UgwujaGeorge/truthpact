export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_SEPOLIA_EXPLORER_URL = "https://sepolia.basescan.org";
export const BASE_SEPOLIA_CHAIN_NAME = "Base Sepolia";
export const BASE_SEPOLIA_HEX_CHAIN_ID = "0x14a34";
export const BASE_SEPOLIA_CURRENCY = {
  name: "ETH",
  symbol: "ETH",
  decimals: 18,
};

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const baseSepoliaRpcUrl =
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
export const defaultJudgeAddress = process.env.NEXT_PUBLIC_DEFAULT_JUDGE_ADDRESS || "";
