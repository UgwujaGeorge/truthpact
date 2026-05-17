# TruthPact

TruthPact is a project built for rialo and this is a demo. The judge API uses Gemini to evaluate submitted work against the pact prompt, then optionally settles the pact from the configured judge wallet.

## Environment

Copy `.env.example` to `.env` and set the deployment values locally. Do not commit `.env`.

```bash
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_DEFAULT_JUDGE_ADDRESS=
AUTO_JUDGE_ENABLED=false
JUDGE_PRIVATE_KEY=
```

## Judge Modes

Manual mode:

```bash
AUTO_JUDGE_ENABLED=false
```

Run the Gemini judge from a submitted pact page. The API returns the verdict, score, reason, and checklist, but it does not write an approval or rejection transaction.

Auto-settlement mode:

```bash
AUTO_JUDGE_ENABLED=true
JUDGE_PRIVATE_KEY=<local judge wallet private key>
```

The server derives the judge wallet address from `JUDGE_PRIVATE_KEY` and only calls `approvePact` or `rejectPact` when it matches the pact's judge address.

## Verification

```bash
npm test
npm run build
```
