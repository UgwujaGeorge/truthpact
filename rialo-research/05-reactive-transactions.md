# Source: Reactive Transactions — A Model for Native Automation on Rialo

**Published:** April 20, 2026
**URL:** https://rialo.io/posts/reactive-transactions-a-model-for-native-automation-on-rialo

## One-line
The mechanism doc for Rialo's most distinctive primitive. Predicates are stored on-chain, evaluated by every validator each block, and trigger associated transactions automatically.

## How it works
A user/contract registers (predicate, transaction). On every block:
1. Block of normal user-submitted txs executes (changes balances, emits events, etc.).
2. Validators evaluate every predicate whose dependencies could have changed (deterministic — every validator agrees).
3. Triggered predicates enqueue their associated transaction.
4. Triggered tx runs in same or subsequent block; consensus protocol guarantees execution.

Predicates can reference: on-chain state (balances, collateral ratios, AMM curves), state transitions from earlier txs in the same block, emitted events, validator-attested oracle data, time/block-height conditions, results of earlier workflow steps.

## Differences from offchain automation
- No bots/keepers/cron systems. No external monitoring infrastructure.
- Single trust model — the same validators that execute are the same that "watch."
- Race conditions, gas wars, and the "tip war" problem (paying extra to land tx during congestion) disappear.
- Long-running workflows that span many blocks (hours, days) are a first-class primitive — a tx can suspend, store a predicate to wake it later, schedule a delayed step.

## Application categories called out (more product-idea raw material)
- **Lending:** automatic per-block collateral checks, partial liquidations, delayed liquidations evaluating market stability, multi-asset correlated triggers, cross-protocol risk signals, chain-level circuit breakers.
- **Perp markets ("autonomous finance"):** instant liquidations, oracle-driven funding-rate updates, dynamic leverage tied to volatility, rolling settlement windows, composite signals (orderbook depth + volatility + price), automatic position adjustments.
- **AMMs/vaults:** fees that rise during volatility spikes, liquidity-driven concentration band shifts, auto-rebalancing, dynamic slippage, hedging triggered by spreads.
- **RWAs:** periodic coupon distribution, NAV recalcs, cash-flow waterfalls, repayment schedules, default detection, settlement tied to macro indicators.
- **Prediction markets:** instant settlement when verified data lands, multi-source validation, bracketed tournaments, recurring markets, structured conditional payouts, workflow markets that *spawn* further markets.
- **Cross-protocol orchestration:** automated hedging triggered by lending market conditions, stablecoin issuers reacting to redemption flows, treasury ops triggered by governance.
- **Hybrid on/off-chain:** workflows that wait for external confirmations, composite signals from multiple APIs, retry/fallback logic.
- **Other:** scheduled DCA, recurring funding updates, vesting unlocks, stop-loss/take-profit, multi-step pipelines (sell A → buy B → deposit), portfolio rebalancing, subscriptions/recurring payments enforced by triggers.

## Important framing
Reactive txs aren't just nicer UX — they're *the* missing primitive. Most offchain automation infra exists "only because onchain programs cannot suspend execution." Rialo collapses an entire industry segment (Chainlink Automation, Gelato, Keep3r, etc.) into the protocol itself.
