"use client";

import { isAddress, parseEther } from "ethers";
import { Sparkles, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { BASE_SEPOLIA_CHAIN_NAME, defaultJudgeAddress } from "@/lib/config";
import { getReadContract, getWriteContract } from "@/lib/pacts";
import { useWallet } from "@/lib/wallet-context";

const initialState = {
  worker: "",
  judge: defaultJudgeAddress,
  prompt: "",
  escrowAmount: "0.05",
  deadline: "",
};

const examplePrompts = [
  "Write a one-page market brief summarizing Base ecosystem momentum and attach sources.",
  "Design a premium landing page hero with glassmorphism, animated timeline, and wallet CTA.",
  "Review a submitted research memo and verify whether the output matches the requested task.",
];

export function CreatePactForm() {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { isConnected, isBaseSepolia } = useWallet();

  const previewDeadline = useMemo(() => {
    if (!values.deadline) return "Not set";
    return new Date(values.deadline).toLocaleString();
  }, [values.deadline]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isConnected) {
      setError("Connect a wallet to create a Pact.");
      return;
    }

    if (!isBaseSepolia) {
      setError(`Switch to ${BASE_SEPOLIA_CHAIN_NAME} before creating a Pact.`);
      return;
    }

    if (!isAddress(values.worker.trim())) {
      setError("Enter a valid worker address.");
      return;
    }

    if (!isAddress(values.judge.trim())) {
      setError("Enter a valid judge address.");
      return;
    }

    if (!values.prompt.trim()) {
      setError("Enter a task prompt.");
      return;
    }

    let escrowAmount: bigint;
    try {
      escrowAmount = parseEther(values.escrowAmount.trim());
    } catch {
      setError("Enter a valid escrow amount.");
      return;
    }

    const deadlineMs = Date.parse(values.deadline);
    if (!Number.isFinite(deadlineMs)) {
      setError("Choose a valid deadline.");
      return;
    }

    const deadline = Math.floor(deadlineMs / 1000);
    if (deadline <= Math.floor(Date.now() / 1000)) {
      setError("Deadline must be in the future.");
      return;
    }

    setSubmitting(true);

    try {
      const readContract = getReadContract();
      const contract = await getWriteContract();
      const expectedPactId = Number(await readContract.pactCount());
      const tx = await contract.createPact(
        values.worker.trim(),
        values.judge.trim(),
        values.prompt.trim(),
        escrowAmount,
        deadline,
      );
      const receipt = await tx.wait();

      const pactCreatedLog = receipt.logs
        .map((log: { topics: readonly string[]; data: string }) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((log: { name?: string; args?: { pactId?: bigint } } | null) => log?.name === "PactCreated");

      const pactId = pactCreatedLog ? Number(pactCreatedLog.args?.pactId ?? expectedPactId) : expectedPactId;

      let pactVerified = false;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await readContract.getPact(pactId);
          pactVerified = true;
          break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }

      if (!pactVerified) {
        throw new Error(`Pact was created, but it is not readable yet. Try opening Pact #${pactId} from the dashboard.`);
      }

      router.push(`/pacts/${pactId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to create pact.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-8">
      <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <div className="space-y-6">
          <div className="glass-panel p-5 sm:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/[0.08] px-3 py-1 font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Create Pact
            </div>
            <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-[2.55rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[3.45rem]">
              Lock the terms. Verify the truth. Settle onchain.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
              Define the worker, judge, scope, deadline, and escrow amount. TruthPact turns the brief into a Base Sepolia execution record.
            </p>
          </div>

          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="panel-label">Pact Builder</div>
                <div className="mt-2 panel-title">Compose the agreement</div>
              </div>
              <div className="protocol-chip text-white/45">
                Base Sepolia
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Worker Address"
                  helper="This wallet is allowed to submit the finished work."
                  value={values.worker}
                  onChange={(value) => setValues((current) => ({ ...current, worker: value }))}
                  placeholder="0x..."
                />
                <Field
                  label="Judge Address"
                  helper="This wallet or backend judge decides approve or reject."
                  value={values.judge}
                  onChange={(value) => setValues((current) => ({ ...current, judge: value }))}
                  placeholder="0x..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Escrow Amount"
                  helper="Locked only after the client funds the Pact."
                  value={values.escrowAmount}
                  onChange={(value) => setValues((current) => ({ ...current, escrowAmount: value }))}
                  placeholder="0.05"
                />
                <div>
                  <label className="protocol-label mb-2 block">Deadline</label>
                  <input
                    type="datetime-local"
                    value={values.deadline}
                    onChange={(event) => setValues((current) => ({ ...current, deadline: event.target.value }))}
                    min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                    className="compact-field"
                    required
                  />
                  <p className="mt-2 text-xs leading-6 text-white/42">The client can reclaim escrow after this time if the Pact remains unresolved.</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="protocol-label block">Task Prompt</label>
                  <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-white/35">Source of truth</div>
                </div>
                <textarea
                  value={values.prompt}
                  onChange={(event) => setValues((current) => ({ ...current, prompt: event.target.value }))}
                  placeholder="Describe the exact work to be delivered and what truth the judge should verify."
                  className="min-h-[170px] w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-cyan-300/[0.03]"
                  required
                />
                <p className="mt-2 text-xs leading-6 text-white/42">
                  Make the instruction specific. The judge reads this prompt to determine whether the worker submission actually satisfies the pact.
                </p>
              </div>

              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <div className="protocol-label mb-3 flex items-center gap-2">
                  <WandSparkles className="h-3.5 w-3.5 text-cyan-200" />
                  Example prompts
                </div>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setValues((current) => ({ ...current, prompt }))}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs text-white/68 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {error ? <div className="rounded-[20px] border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <GlowButton type="submit" disabled={submitting}>
                  {submitting ? "Creating Pact..." : "Create Pact"}
                </GlowButton>
                <div className="text-xs leading-6 text-white/42">
                  Creation only defines the agreement. Escrow is funded separately by the client on the detail page.
                </div>
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-5 sm:p-6">
            <div className="panel-label">Live Preview</div>
            <div className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(139,92,246,0.08),rgba(59,130,246,0.06))] p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-base font-semibold text-white">Draft Pact</div>
                <div className="protocol-chip">
                  Created
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PreviewStat label="Worker" value={values.worker || "Pending"} />
                <PreviewStat label="Judge" value={values.judge || "Pending"} />
                <PreviewStat label="Escrow Amount" value={`${values.escrowAmount || "0.00"} ETH`} />
                <PreviewStat label="Deadline" value={previewDeadline} />
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <div className="protocol-label">Prompt Preview</div>
              <p className="mt-3 text-sm leading-7 text-white/72">
                {values.prompt || "Your task prompt will appear here as the shared truth source for the worker and the judge."}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="panel-label">How It Plays Out</div>
            <div className="mt-4 space-y-3">
              {[
                "1. Client creates the Pact and shares the detail page.",
                "2. Client funds escrow once the worker terms look correct.",
                "3. Worker submits proof and deliverable text.",
                "4. Judge approves or rejects. ETH settles from contract rules.",
              ].map((line) => (
                <div key={line} className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
                  {line}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  helper,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="protocol-label mb-2 block">{label}</label>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="compact-field" required />
      <p className="mt-2 text-xs leading-6 text-white/42">{helper}</p>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.04] px-3 py-3">
      <div className="protocol-label">{label}</div>
      <div className="mt-2 truncate text-sm font-medium text-white">{value}</div>
    </div>
  );
}
