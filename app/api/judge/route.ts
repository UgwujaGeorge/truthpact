import { Contract, getAddress, JsonRpcProvider, Wallet } from "ethers";
import { NextResponse } from "next/server";

import { truthPactAbi } from "@/lib/abi/truthPact";
import { prepareEvidence } from "@/lib/evidence";
import { evaluateSubmissionWithGemini } from "@/lib/geminiJudge";

export const runtime = "nodejs";
export const maxDuration = 60;

type SettlementStatus = "manual" | "settled" | "skipped" | "failed";

export async function POST(request: Request) {
  try {
    const { pactId } = (await request.json()) as { pactId?: number };

    if (typeof pactId !== "number") {
      return NextResponse.json({ error: "pactId is required." }, { status: 400 });
    }

    const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || process.env.BASE_SEPOLIA_RPC_URL;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!rpcUrl || !contractAddress) {
      return NextResponse.json({ error: "RPC URL or contract address is not configured." }, { status: 500 });
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const contract = new Contract(contractAddress, truthPactAbi, provider);
    const pact = await contract.getPact(pactId);
    const prompt = String(pact.prompt || "");
    const workText = String(pact.workText || "");
    const workURI = String(pact.workURI || "");
    const status = Number(pact.status);
    const autoJudgeEnabled = process.env.AUTO_JUDGE_ENABLED === "true";

    if (status !== 2) {
      return NextResponse.json(
        { error: "Pact must be in Submitted status before AI judging can run.", settlementStatus: "skipped" },
        { status: 400 },
      );
    }

    if (!workText.trim() && !workURI.trim()) {
      return NextResponse.json(
        { error: "Submitted work is empty. Add work text or a work URI before judging.", settlementStatus: "skipped" },
        { status: 400 },
      );
    }

    const evidence = await prepareEvidence({ workText, workURI });

    if (evidence.manualReview) {
      return NextResponse.json({
        verdict: "manual_review",
        score: 0,
        reason: evidence.manualReviewReason || "Evidence cannot be evaluated automatically.",
        checklist: [],
        evidenceSummary: evidence.summary,
        evidenceType: evidence.evidenceType,
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        settlementStatus: "manual" as SettlementStatus,
        autoJudgeEnabled,
      });
    }

    const result = await evaluateSubmissionWithGemini({
      prompt,
      workText,
      workURI,
      evidenceParts: evidence.parts,
      evidenceType: evidence.evidenceType,
      evidenceSummary: evidence.summary,
    });

    let txHash: string | undefined;
    let settlementStatus: SettlementStatus = "manual";
    let settlementError: string | undefined;
    const judgePrivateKey = process.env.JUDGE_PRIVATE_KEY;
    const canAutoSettle = result.verdict === "approve" || result.verdict === "reject";

    if (autoJudgeEnabled && canAutoSettle) {
      if (!judgePrivateKey) {
        settlementStatus = "skipped";
        settlementError = "AUTO_JUDGE_ENABLED is true, but JUDGE_PRIVATE_KEY is not configured.";
      } else {
        const signer = new Wallet(judgePrivateKey, provider);
        const signerAddress = getAddress(await signer.getAddress());
        const pactJudgeAddress = getAddress(String(pact.judge));

        if (signerAddress !== pactJudgeAddress) {
          settlementStatus = "failed";
          settlementError = "Auto-settlement blocked: JUDGE_PRIVATE_KEY does not match this pact's judge address.";
        } else {
          try {
            const writeContract = new Contract(contractAddress, truthPactAbi, signer);
            const tx =
              result.verdict === "approve"
                ? await writeContract.approvePact(pactId)
                : await writeContract.rejectPact(pactId);
            await tx.wait();
            txHash = tx.hash;
            settlementStatus = "settled";
          } catch (cause) {
            settlementStatus = "failed";
            settlementError = cause instanceof Error ? cause.message : "Auto-settlement transaction failed.";
          }
        }
      }
    } else if (autoJudgeEnabled && !canAutoSettle) {
      settlementStatus = "manual";
      settlementError = "Verdict is manual_review — auto-settlement skipped, human judge action required.";
    }

    return NextResponse.json({
      ...result,
      txHash,
      settlementStatus,
      settlementError,
      autoJudgeEnabled,
    });
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "Judge execution failed." },
      { status: 500 },
    );
  }
}
