# Source: Stake-for-Service — A Better Way to Pay on Rialo

**Published:** December 26, 2025
**URL:** https://rialo.io/posts/stake-for-service

## One-line
Stake-for-Service (SfS) routes a user-chosen fraction of staking yield into non-transferable "service credits" minted by a `ServicePaymaster` (SPM). Those credits pay for gas, storage, and recurring execution. Result: contracts and users that *self-fund forever* from yield, never needing manual top-ups.

## Mechanism
- An SfS position has three params: principal `R_p` (RLO staked), validator `v(p)`, routing fraction `φ_p` (% of rewards directed to services).
- Each epoch, rewards across all SfS positions are aggregated and minted as credits to the SPM.
- Credits act like programmable vouchers — non-transferable, only spendable on Rialo services. When consumed, the SPM authorizes an equivalent RLO payout to the validator/provider that did the work.
- Native token: **RLO**.

## Why it matters as a product primitive
- **Gasless onboarding** — wallet/dApp can stake on user's behalf; user transacts immediately, paid for by yield.
- **Self-funding contracts** — endow a contract with a stake, route yield, contract runs autonomously for years (the article literally says "for decades").
- **Bulk sponsorship** — exchanges/DAOs stake in bulk and route yield to subsidize 10k traders' gas. Predictable, capped budget.
- **Programmatic predictability** — DAOs allocate "10% of staking rewards to service payments" and budget treasury accordingly. Pay-for-services denominated in deterministic credits, not volatile RLO.
- **Dynamic NFTs example called out:** an NFT contract directs a portion of mint proceeds to an SfS position; staking yield then funds *forever* the contract's automated updates (e.g., NFT that changes with phases of the moon or migration patterns).

## Bigger-picture economic claim
- SfS introduces a "stimulus parameter" — governance can redirect a fraction of any planned issuance reduction into the SPM, achieving a direct utility-side stimulus without inflating supply. Network can selectively boost categories (oracles, automation, RWA settlement) by routing extra credits.
- Closes the loop between long-term capital (staked principal) and short-term consumption (gas/storage), avoiding the typical security-vs-utility tradeoff.

## Hooks for Phase 2
- **Self-maintaining protocols** funded purely by their own staked treasury yield.
- **Composable paymasters** — other chains using Rialo's SPM as a shared service layer.
- **Real-world subscriptions** — recurring API/data/compute paid in stable credits. (Combined with native web calls and reactive txs, this is genuinely new infra.)
