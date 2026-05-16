# Rialo — Research Synthesis (Phase 1)

> Sources: 11 first-party Rialo blog posts, the rialo.io homepage/docs CMS, learn.rialo.io, Pantera Capital and Fabric Ventures investment posts, Fortune coverage, Messari profile, crypto.news, PANews, plus secondary search results and community GitHub. Notes per source live in `01-..` through `14-..` in this folder.

---

## What Rialo is, in one paragraph

Rialo is a new high-performance Layer 1 blockchain by Subzero Labs — founded by ex-Mysten Labs (Sui) engineers Ade Adepoju and Lu Zhang, $20M seed led by Pantera (Aug 2025), with private DevNet live and mainnet targeted for 2026. Rialo's bet is that the "modular vs monolithic" debate is over and the next axis of differentiation is **supermodularity**: the chain absorbs the middleware that today fragments dApp stacks (oracles, automation, indexers, bridges, privacy gadgets, schedulers, paymasters) into protocol-native primitives that compose into emergent capabilities you cannot build elsewhere. The headline primitives are native HTTPS web calls from inside smart contracts, on-chain reactive/conditional transactions evaluated by validators each block (no bots/keepers), a confidential execution layer (REX) over MPC/FHE/TEEs, primary-source oracles attested by validators, a native bridge run by the validator set, RISC-V smart contracts with Solana-VM compatibility, identity/auth via email/SMS/social (anchored by Jan Camenisch's anonymous-credential research lineage), Multiple Concurrent Proposers for scalability, optimistic concurrency control for parallel execution, and Stake-for-Service — a paymaster system that converts staking yield into non-transferable service credits so contracts and users self-fund forever.

---

## Native primitives — the full list

For each: a 2–3 sentence explanation, plus what it lets you do that you can't do (or can't do cheaply) on Ethereum or Solana.

### 1. Native HTTPS web calls inside smart contracts
A contract can issue an HTTP request (described as a one-line `http.get`-style call) and use the response as part of consensus-evaluated logic. Validators fetch + attest. **Unlocks:** any "smart contract that needs to read or write a normal API" (Stripe, Plaid, Spotify, AWS, NFL.com, federalreserve.gov, Massive.io, Polygon-equity feeds) without paying an oracle middleman or running off-chain bots.

### 2. Reactive (conditional) transactions
Predicates are stored on-chain and re-evaluated by every validator each block. When the predicate becomes true (any combination of on-chain state, prior in-block transitions, emitted events, time/height, oracle-attested external data, or earlier workflow steps), the associated tx executes automatically. **Unlocks:** workflows that suspend, sleep, await, and resume across many blocks; long-running multi-step financial logic without keepers; cron-without-cron; same-block cascades like "oracle update → LTV recompute → liquidation"; deadline + escrow logic for agent payments.

### 3. Native asynchronous execution / `Future` / `Promise` / `.await`
Smart contracts can `await` external calls and on-chain conditions. The execution model is async-first, like Tokio in Rust. Combined with reactive txs, contracts behave like real software, not single-shot atomic transactions. **Unlocks:** multi-block workflows, retry/fallback logic, structured concurrency at the contract level.

### 4. Native scheduling / timers
First-class block-height and timestamp predicates, including delayed and recurring schedules. **Unlocks:** subscriptions, vesting unlocks, recurring payments, DCA bots, deadline-driven escrow, scheduled NAV updates — all at protocol cost, not Gelato/Chainlink-Automation cost.

### 5. Native privacy / REX (Rialo Extended Execution)
A confidential-execution sidecar to the public chain, using a mix of MPC, FHE, and TEEs orchestrated by a cryptographic layer (key refresh, re-encryption, attestation, allowed-program certification). Inputs decrypted only inside REX, outputs verifiably posted on-chain. **Unlocks:** dark order books, private DeFi, KYC without leaking PII, per-app credentialed access to Web2 APIs (with the credentials never on-chain), any "verifiable but not public" computation.

### 6. Stake-for-Service (SfS)
A staking position can route a fraction of its yield to a `ServicePaymaster`, which mints non-transferable service credits redeemable for gas/storage/execution. **Unlocks:** gasless onboarding paid out of yield (apps stake on the user's behalf), self-funding contracts that operate forever from yield, bulk subsidized fees from a DAO/exchange treasury, predictable budgeting in fiat-stable credits rather than volatile RLO. Also turns issuance policy into operational policy — governance can route extra credits to specific categories (oracles, RWA settlement) as targeted stimulus.

### 7. Primary-source / validator-attested oracles
Markets specify the source URL + policy (e.g., "what does this JSON field on weather.com say at time T?") and the chain itself attests fetch + computation. Apps can request the *full* underlying data stream and compute their own median/mean/tail-risk metrics. **Unlocks:** prediction markets that resolve from first principles (NFL.com, fed.gov, Moody's), real-time RWA price feeds with attested derived signals (Project 1337 demoed 1,337 stocks at sub-second latency with custom alpha/bias/VaR signals), no separate bonded-reporter quorum to bribe.

### 8. Confidential web calls (privacy + web calls combined)
A user can encrypt an auth token or API key, sign a tx that says "go to this Web2 service on my behalf, evaluate this condition, and post the outcome." Validator decrypts inside REX, executes, erases credentials. **Unlocks:** automated bank-account actions, IoT control via authenticated APIs, agentic workflows that act on user accounts without anyone — even validators — seeing the credentials.

### 9. MCP — Multiple Concurrent Proposers
Block-producer parallelism for higher throughput / censorship resistance. Pantera and Subzero name MCP explicitly. **Unlocks:** routing-layer censorship mitigation (matters for primary-source oracles) and global-scale throughput.

### 10. Optimistic concurrency control
All txs execute in parallel; commits ordered; txs that read stale state are re-executed. **Unlocks:** maximum parallelism on read-heavy and shard-friendly workloads (per-user reactive automations, per-task SCALE escrows, per-asset feeds). Hot single-account writes still pay retry cost — design pattern: shard state by user/asset.

### 11. Native bridge run by the validator set
Built-in cross-chain message + asset transfer; no third-party bridge. **Unlocks:** cross-chain reactive workflows ("when X on Solana, do Y on Rialo, send Z to my Ethereum address") without bridge security being the weakest link.

### 12. RISC-V VM (primary execution environment)
General-purpose ISA on-chain — supports complex computation including AI inference, statistical models, simulators. Smart contracts written in Rust (and likely other languages) compiled to RISC-V. **Unlocks:** running real numerical workloads on-chain (financial models, ML inference) — historically infeasible in EVM/MoveVM.

### 13. Solana VM compatibility (and MoveVM planned)
Existing Solana programs can run on Rialo with minimal changes. **Unlocks:** porting Solana dApps to inherit Rialo primitives (web calls, reactivity, privacy) without rewriting from scratch.

### 14. Real-World Identity (email / SMS / social login + Camenisch's anonymous-credentials lineage)
The chain treats Web2 identity primitives as first-class. With Camenisch on board, expect Idemix/CL-signature-style selective disclosure ("prove you're over 18, an accredited investor, a US resident") and unlinkable credentials. **Unlocks:** consumer-grade onboarding, regulated DeFi that doesn't leak PII, programmable wills, recoverable accounts.

### 15. SCALE — Simple Contracts for Agent Labor Execution (early standard)
A YC-SAFE-inspired contract template for hiring AI agents: pay, deadline, prompt, third-party Judge agent. Combines escrow + reactive deadline + Judge call (via native web call to A2A protocol). **Unlocks:** trustable composable agent workflows, agent registries, passive income from running Judge agents.

---

## Architectural philosophy

### Supermodularity
Rialo's central design principle. A component is integrated into the base layer if and only if increasing it raises the marginal value of increasing another core component (positive cross-partial). Otherwise it is "commoditized" and sourced externally. The slogan: **integrate the supermodulars, commoditize the complements.** Examples in the corpus:
- Execution × oracles → fast trading (Hyperliquid analog).
- Execution × reactive automation × stake-for-service → contracts that run forever, autonomous finance.
- Execution × privacy × web calls → authenticated Web2 interaction (private credit-score loans, programmable bank actions).
- Execution × bridge × oracles × reactive → cross-chain conditional workflows.
- Counter-example: fiat onramps complement chains in *consumption* but not production → don't integrate.

### Vertical integration vs compound marginalization
The economic counterpart. Today's stack (L1 + oracle + indexer + keeper + bridge + privacy gadget + paymaster) is a sequence of monopolies each marking up independently — classical *double / compound marginalization*. The cumulative tax can erase ≥90% of dApp surplus (per the Subzero Labs paper). Rialo's answer: vertically integrate the supermodular middleware into the chain itself. One execution price, one set of incentives optimizing for total throughput rather than per-layer extraction. The argument is more nuanced than "monolithic chains good"; it's specifically about which integrations are economically justified.

### "Real-world chain" framing
Almost every post invokes the smartphone analogy: the iPhone wasn't an iPod plus internet — it converged GPS + camera + connectivity into a single device, which unlocked Uber/Instagram/WhatsApp. Rialo wants to be the platform on which a non-speculative consumer dApp ecosystem becomes possible by collapsing the seams between Web3 and Web2.

---

## Developer experience

### Language & VM
- Smart contracts target **RISC-V** (Rialo's native VM), with Rust as the apparent first-class authoring language.
- **Solana VM (SVM) compatible** — existing Solana code runs.
- **MoveVM planned**.
- The combination of RISC-V + Rust signals general-purpose computation including ML/statistical models on-chain — confirmed by Project 1337 doing custom signal computation inside REX.

### SDK / tooling (best inferred picture; not all official-doc-confirmed)
- **`rialo-cdk`** — Rust crate. Wallet management, tx signing.
- **`rialo-api-types`** — typed request/response.
- **`TransactionBuilder`** for constructing on-chain operations.
- **JSON-RPC 2.0** client, deliberately Solana-ecosystem compatible.
- **BIP39 keyring** with hierarchical deterministic derivation.
- CDK feature flags: `file-storage`, `encryption`, `mnemonic`, `rpc-client`.
- **`getWorkflowLineage`** method — trace chains of reactive transactions for debugging.
- Native HTTP described as a one-liner inside contracts.
- A "Rialo Builder Hub" / "Rialo Agent Registry" are mentioned but not fully documented.

### What writing a contract probably looks like
Based on the corpus, a Rialo contract is a Rust crate compiled to RISC-V that:
- Exposes entrypoints called by ordinary user txs (Solana-style).
- Can issue async `http.get`/`http.post`-style calls and `.await` results during execution.
- Can `register_predicate(condition, transaction)` so the validator runtime auto-fires the tx when the condition is met.
- Can request confidential execution by routing inputs through REX (encrypt-to-network-public-key, run shielded program, post outcome).
- Can read attested oracle data from validator-fetched primary sources.
- Supports `await`-style multi-block workflows.

The post corpus does not show full code samples (the specific syntax is not yet public on the website), but the SCALE walkthrough and Project 1337 architecture imply this shape concretely.

### Status of public docs
- The `/docs` page on rialo.io is a Webflow CMS shell — actual docs items aren't rendering in static HTML and the site isn't yet linking to a public docs portal.
- `learn.rialo.io` is a SPA hosting interactive demos (concurrency-control visualizer is live).
- Community GitHub projects (`fusion-gateway`, `rialo-webhook-example`, ROXOR Cavalier, RealQuest) suggest the SDK is shared with select developers but full public availability of detailed reference docs and example contracts is still maturing.

---

## Current status (as of May 2026)

- **Funding:** $20M seed (announced Aug 1, 2025, closed Q1 2025). Equity + token warrants. Lead: Pantera. Others: Variant, Coinbase Ventures, Susquehanna crypto, Mysten Labs, Fabric Ventures, Hashed, Flowdesk, Mirana.
- **Team:** ~20 people. Founders Ade Adepoju (CEO) and Lu Zhang (CTO), both ex-Mysten Labs / Sui core, with prior stints at Meta/Diem, Netflix, AMD, Google. Recent star hire: **Jan Camenisch** (privacy + cryptography lead).
- **Network:** Private DevNet live since Aug 2025. As of early 2026 there is **no public incentivized testnet and no points program**. Mainnet targeted for 2026 with ~10 native dApps committed day-one and 30+ partnership commitments.
- **Token:** RLO (referenced in stake-for-service).
- **Demos shipped:** Project 1337 (1,337 live tickers on-chain at 1337.rialo.io), `@chunliweb3` Twitter agent (SCALE), concurrency-control visualizer.
- **Channels:** discord.gg/RialoProtocol, t.me/rialoprotocol, x.com/RialoHQ, jobs.ashbyhq.com/subzero. Brand assets at drive.google.com (linked from the homepage).
- **Hackathons / public grants:** none publicly announced as a formal program; team is recruiting builders directly via Discord, Telegram, and partner VCs.

---

## What this means for product builders

Two design heuristics the corpus repeatedly endorses:

1. **Build for the composition, not the primitive.** A dApp that uses just one Rialo primitive could be ported to other chains as they catch up. A dApp whose value depends on the *interaction* between two or more primitives (e.g., reactive + private web call, or stake-for-service + native oracles + reactive automation) is structurally hard to copy elsewhere.

2. **Lean into real-world data + real-world identity + real-world automation together.** That triad is where Rialo's competitive moat is most defensible: any product that needs to read the world, react to it without bots, and authenticate against Web2 systems privately — that's the empty quadrant on Ethereum and Solana.

The product space falls into rough categories:
- **Autonomous finance** — self-running lending/perps/AMMs that don't need keeper protocols.
- **Hybrid Web2-bridged products** — chain-native interfaces to Stripe/Plaid/Spotify/Shopify/airline/IoT data.
- **Agent economy infra** — SCALE-style escrows, agent registries, Judge agents, agent-to-agent marketplaces.
- **Living RWAs** — bonds, RECs, royalties, supply-chain receipts whose state tracks reality in real time.
- **Private-but-verifiable apps** — KYC'd DeFi, dark order books, credit-score lending, compliant stablecoins.
- **Real-time prediction markets / parametric insurance** — primary-source resolution, sub-second settlement.
- **Consumer apps with familiar UX** — social-login wallets, recoverable accounts, programmable wills, scheduled payments.

---

## Open questions / things I could not fully verify from public sources

- Exact contract syntax / annotation for declaring a reactive predicate. (Implied via SCALE write-up but no canonical example.)
- Precise REX programming model — how a developer marks a function as confidential vs public.
- Public RPC endpoints, faucet, and example repo URLs for DevNet.
- Detailed validator-set parameters, gas pricing model, and reactive-tx pricing (does evaluation cost gas? how is the predicate cost amortized?).
- Whether MCP is live in DevNet or still on the roadmap.
- Whether bridge supports arbitrary message passing or just asset transfers initially.
- Whether the "Rialo Agent Registry" is on-chain, an off-chain index, or just a planned standard.

These would shape MVP architecture, but for product-idea generation they are not blockers.
