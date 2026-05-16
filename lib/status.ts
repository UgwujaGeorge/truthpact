import type { PactStatusKey } from "@/types/pact";

export const pactStatuses: PactStatusKey[] = [
  "Created",
  "Funded",
  "Submitted",
  "Approved",
  "Rejected",
  "Refunded",
];

export function getPactStatusLabel(status: number): PactStatusKey {
  return pactStatuses[status] || "Created";
}

export function getPactStatusTone(status: number) {
  switch (status) {
    case 1:
      return "funded";
    case 2:
      return "review";
    case 3:
      return "success";
    case 4:
      return "danger";
    case 5:
      return "muted";
    default:
      return "pending";
  }
}

