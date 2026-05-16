# Source: Secondary coverage — Pantera, Fabric Ventures, Fortune, Messari, crypto.news, PANews

## Pantera Capital — "Investing in Rialo"
URL: https://panteracapital.com/blog-investing-in-rialo/

Key points:
- Pantera **led the $20M initial financing**.
- Calls Rialo "a unified, event-driven blockchain system."
- Lists primitives: "DAG architecture" for fast txs, "decentralized security through threshold keys," event-driven program responses, automation across blockchain and non-blockchain systems, **Solana VM compat + RISC-V**.
- Use cases highlighted: RWA issuance, agent-based trading, cross-domain oracles.
- Promise: "Web3 apps that match or exceed Web2 standards in speed, usability, cost — with a fraction of the engineering burden."
- Team: founders Ade Adepoju + Lu Zhang were early Mysten/Sui engineers; team also from Meta, Apple, Google, Citadel, Coinbase, Polkadot, Solana.

## Fabric Ventures — "Why we invested in Rialo"
URL: https://medium.com/fabric-ventures/why-we-invested-in-rialo-the-blockchain-for-the-real-world-85ddd73c75dd

Key points:
- Frames the pitch as "growing the addressable market for the broader crypto space" beyond speculation.
- Specifically calls out the **UMA / Polymarket oracle risk** ($125M UMA mcap securing $170M of wagered markets) — they consider Rialo's primary-source resolution model a meaningful upgrade.
- Lists native primitives: web calls, data feeds, timers, cross-chain actions.
- User-facing pitch: phone/email payment endpoints (no seed phrases), automated yield settlement on conditions, validator-monitored programmable triggers for prediction-market resolution.

## Fortune — Subzero Labs raises $20M (Aug 1, 2025)
URL: https://fortune.com/crypto/2025/08/01/subzero-labs-seed-raise-pantera-capital-blockchain-rialo/

Key facts:
- Round closed Q1 2025; announced Aug 1, 2025.
- $20M; equity + token warrants. Lead: Pantera. Others: Variant, Coinbase Ventures, Susquehanna crypto desk.
- Founders: Ade Adepoju (CEO, 30, NYC) and Lu Zhang. Both ex-Mysten Labs.
- 20-person team at announcement.
- Adepoju quote: "Rialo isn't a layer 1." (positioning it as more — full stack).
- Adepoju also: "We don't need another iPod. We need an iPhone."
- Direct claim: developers can access external data (FICO scores cited) without an oracle/outside provider.

## Messari profile
URL: https://messari.io/project/rialo/profile

- Reinforces: developer-first L1, RISC-V smart contracts + SVM compat + native web connectivity.
- Mentions **"IPC" (Identity, Privacy, and Compliance)** as a unified protocol-layer primitive.
- Names **REX** (privacy execution environment) explicitly.
- Use cases targeted: tokenized assets, prediction markets, logistics apps, finance tools.
- Investor list expanded: Pantera lead + Coinbase Ventures, Variant, Hashed, Susquehanna, Mysten Labs, Fabric, Flowdesk, Mirana.

## crypto.news / PANews coverage
URLs:
- https://crypto.news/subzero-labs-rialo-rethinks-app-development-with-a-web2-approach-to-web3/
- https://www.panewslab.com/en/articles/d0cbc2e5-f848-4b49-93e5-7d691fddcd09
- https://www.panewslab.com/en/articles/019c9878-60b8-7088-8145-3a1e2a7fa793

Adds:
- "Compounding cost of middleware" framing comes through clearly.
- Adepoju framing: "too many brilliant teams are burning runway gluing pieces of poorly designed infrastructure together."
- Mainnet target: 2026, with **10 native dApps committed for day-one launch** and 30+ partnership commitments by end of year (per Rialo roadmap as of early 2026).

## Community-found tooling clues (unofficial GitHub repos)
- `wabrent/rialo-webhook-example` — webhook send/handle demo on Rialo.
- `Huawei123r/fusion-gateway` — modular framework that lets Rialo smart contracts connect to any HTTPS-based API.
- `tomoverflow/Rialo-RealQuest` — educational mini-game showing real-time response to weather + crypto + news feeds.
- These are community projects, not official, but suggest the SDK exposes HTTP/webhook calls and event-driven hooks today.

## SDK clues (from crypto-ambassador / gunahkarcspr Medium)
- **`rialo-cdk`** (Rust): core lib, wallet management, tx signing.
- **`rialo-api-types`**: typed request/response.
- BIP39 keyrings, hierarchical deterministic key derivation.
- `TransactionBuilder` for constructing txs.
- **JSON-RPC 2.0** RPC client, "compatible with Solana ecosystem."
- CDK feature flags: `file-storage`, `encryption`, `mnemonic`, `rpc-client`.
- `getWorkflowLineage` method for tracing reactive transaction chains (debugging compound automated workflows).
- VM roadmap: RISC-V (live), SVM (compat now), MoveVM (planned).
- Native HTTP (described as one-liner `http.get`-style call inside contracts).
