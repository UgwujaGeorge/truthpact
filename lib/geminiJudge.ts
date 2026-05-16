import type { EvidenceKind, GeminiPart } from "@/lib/evidence";

export interface JudgeVerdict {
  verdict: "approve" | "reject" | "manual_review";
  score: number;
  reason: string;
  checklist: string[];
  evidenceSummary: string;
  evidenceType: EvidenceKind;
  model: string;
}

interface GeminiResponsePart {
  text?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiResponsePart[];
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
}

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = [
  "You are TruthPact's AI escrow judge. Evaluate whether the submitted evidence satisfies the pact prompt.",
  "Inputs may include plain text, extracted webpage content, images, PDFs, audio, or video. Inspect the supplied evidence parts directly.",
  "Be fair, practical, and demo-friendly. Approve submissions that substantially satisfy the core task, even when they are not perfect.",
  "Do not reject for small omissions, imperfect formatting, minor quality issues, or reasonable ambiguity when the worker made a genuine substantial effort.",
  "Give reasonable benefit of the doubt when the evidence is relevant and materially addresses the prompt.",
  "Reject only when the submission is empty, spammy, irrelevant, obviously low effort, unsafe, or clearly fails the core task.",
  "If the submission is unclear, partially complete, or you are genuinely uncertain whether it meets the bar, choose 'manual_review' instead of 'reject'.",
  "Always return the evidenceType you used and a short evidenceSummary describing what you inspected.",
].join(" ");

export async function evaluateSubmissionWithGemini({
  prompt,
  workText,
  workURI,
  evidenceParts,
  evidenceType,
  evidenceSummary,
}: {
  prompt: string;
  workText: string;
  workURI: string;
  evidenceParts: GeminiPart[];
  evidenceType: EvidenceKind;
  evidenceSummary: string;
}): Promise<JudgeVerdict> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const briefingText = [
    "Evaluate this pact submission and return only JSON matching the schema.",
    "",
    "Pact prompt:",
    prompt,
    "",
    `Detected evidence type: ${evidenceType}`,
    `Evidence summary: ${evidenceSummary}`,
    "",
    "Worker-provided description (may be empty):",
    workText || "(empty)",
    "",
    "Original work URI (for reference, may be empty):",
    workURI || "(empty)",
    "",
    "Scoring guidance:",
    "- 80-100: strong submission that satisfies the task. Approve.",
    "- 60-79: acceptable or substantially complete submission with minor gaps. Approve.",
    "- 40-59: unclear, incomplete, or borderline enough to need human judgment. Return manual_review.",
    "- 0-39: empty, spammy, irrelevant, unsafe, obviously low effort, or clearly fails the core task. Reject.",
    "Verdict guidance: do not require perfection. Approve substantial completion. Use manual_review when uncertain instead of rejecting.",
    "",
    "Evidence parts follow below.",
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: briefingText }, ...evidenceParts],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              verdict: { type: "string", enum: ["approve", "reject", "manual_review"] },
              score: { type: "integer", minimum: 0, maximum: 100 },
              reason: { type: "string" },
              checklist: { type: "array", items: { type: "string" } },
              evidenceSummary: { type: "string" },
              evidenceType: { type: "string" },
            },
            required: ["verdict", "score", "reason", "checklist", "evidenceSummary", "evidenceType"],
          },
        },
      }),
    },
  );

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini judge request failed.");
  }

  const text = data.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === "string")?.text;

  if (!text) {
    const blockReason = data.promptFeedback?.blockReason;
    throw new Error(
      blockReason ? `Gemini returned no verdict. Block reason: ${blockReason}.` : "Gemini returned no verdict.",
    );
  }

  return normalizeGeminiVerdict(JSON.parse(text), { model, fallbackEvidenceType: evidenceType, fallbackEvidenceSummary: evidenceSummary });
}

function normalizeGeminiVerdict(
  value: unknown,
  { model, fallbackEvidenceType, fallbackEvidenceSummary }: { model: string; fallbackEvidenceType: EvidenceKind; fallbackEvidenceSummary: string },
): JudgeVerdict {
  if (!value || typeof value !== "object") {
    throw new Error("Gemini returned an invalid verdict payload.");
  }

  const payload = value as {
    verdict?: unknown;
    score?: unknown;
    reason?: unknown;
    checklist?: unknown;
    evidenceSummary?: unknown;
    evidenceType?: unknown;
  };

  const rawVerdict = typeof payload.verdict === "string" ? payload.verdict.toLowerCase() : "";
  const parsedVerdict: JudgeVerdict["verdict"] =
    rawVerdict === "approve" ? "approve" : rawVerdict === "manual_review" ? "manual_review" : "reject";

  const numericScore = typeof payload.score === "number" ? payload.score : Number(payload.score);
  const score = Number.isFinite(numericScore) ? Math.max(0, Math.min(100, Math.round(numericScore))) : 0;

  let verdict: JudgeVerdict["verdict"];
  if (parsedVerdict === "manual_review") {
    verdict = "manual_review";
  } else if (score >= 60) {
    verdict = "approve";
  } else if (score >= 40) {
    verdict = "manual_review";
  } else {
    verdict = "reject";
  }

  const checklist = Array.isArray(payload.checklist)
    ? payload.checklist.filter((item): item is string => typeof item === "string").slice(0, 6)
    : [];

  const reason =
    typeof payload.reason === "string" && payload.reason.trim()
      ? payload.reason.trim()
      : "Gemini returned no reasoning.";

  const evidenceSummary =
    typeof payload.evidenceSummary === "string" && payload.evidenceSummary.trim()
      ? payload.evidenceSummary.trim()
      : fallbackEvidenceSummary;

  const evidenceTypeRaw = typeof payload.evidenceType === "string" ? payload.evidenceType.trim() : "";
  const allowedTypes: EvidenceKind[] = ["text", "url", "image", "pdf", "document", "audio", "video", "unknown"];
  const evidenceType: EvidenceKind = (allowedTypes as string[]).includes(evidenceTypeRaw)
    ? (evidenceTypeRaw as EvidenceKind)
    : fallbackEvidenceType;

  return {
    verdict,
    score,
    reason,
    checklist,
    evidenceSummary,
    evidenceType,
    model,
  };
}
