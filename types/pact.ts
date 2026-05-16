export type PactStatusKey =
  | "Created"
  | "Funded"
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "Refunded";

export interface Pact {
  id: number;
  client: string;
  worker: string;
  judge: string;
  prompt: string;
  escrowAmount: bigint;
  deadline: bigint;
  workURI: string;
  workText: string;
  status: number;
  createdAt: bigint;
  judgedAt: bigint;
}

