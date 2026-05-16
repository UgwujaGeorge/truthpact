export const TRUTHPACT_JUDGE_ENGINE_LABEL = "TruthPact Intelligence";

const COPY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bRun Gemini Judge\b/gi, "Run AI Judge"],
  [/\bGemini AI Judge\b/gi, "AI Judge"],
  [/\bGemini Evaluation\b/gi, "AI Evaluation"],
  [/\bGemini Processing(?:\.\.\.)?\b/gi, "Analyzing Submission..."],
  [/\bGemini Checklist\b/gi, "Verification Checklist"],
  [/\bGemini Model\b/gi, "Judge Engine"],
  [/\bPowered by Gemini\b/gi, ""],
  [/\bGemini verdict\b/gi, "AI verdict"],
  [/\bGemini reasoning\b/gi, "Judge reasoning"],
  [/\bcalling Gemini\b/gi, "engaging the verification engine"],
  [/\bGemini multimodal\b/gi, "the verification engine"],
  [/\bGemini judge\b/gi, "AI judge"],
  [/\bGemini returned\b/gi, "The AI judge returned"],
  [/\bGemini inline payload limit\b/gi, "verification engine inline payload limit"],
  [/\bto Gemini\b/gi, "to the verification engine"],
  [/\bgemini-\d+(?:\.\d+)?(?:-[a-z0-9]+)+\b/gi, TRUTHPACT_JUDGE_ENGINE_LABEL],
  [/\bGemini\b/gi, TRUTHPACT_JUDGE_ENGINE_LABEL],
];

export function sanitizeJudgeCopy(value?: string | null) {
  if (!value) return "";

  return COPY_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
    .replace(/\s{2,}/g, " ")
    .trim();
}
