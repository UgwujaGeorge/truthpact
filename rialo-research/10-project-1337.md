# Source: Project 1337 — The Recap

**Published:** December 19, 2025
**URL:** https://rialo.io/posts/project-1337
**Live demo:** 1337.rialo.io

## One-line
Subzero streamed live prices for 1,337 stocks on-chain at sub-second latency, with cryptographic attestation, and computed proprietary signals (alpha, bias, VaR-style tail estimates) inside a shielded environment. Treat this as the existence proof for "real-time on-chain Bloomberg."

## Pipeline
1. **Source:** WebSocket feed from Massive (fka Polygon). Each msg `{symbol, price, timestamp}`.
2. **Pre-processing & verification (inside REX/shielded compute):**
   - Smoothing (EMA-style noise filter).
   - **Alpha (α)** — momentum estimator (direction + speed).
   - **Bias (b)** — short-term buy/sell pressure (bid/ask imbalance).
   - VaR tail estimates from raw data (impossible with median-only oracles).
3. **Confidentiality reason for shielded compute:** raw price feed can't be republished due to provider TOS — only derived signals are surfaced.
4. **Verifiability:** each update carries an attestation that signals came from correct execution over signed inputs.
5. **On-chain logic example (Perps Controller):** ingest α + b → adjust synthetic price + funding rate → keep longs/shorts balanced → market self-anchors to reality.
6. **Frontend:** 1,337 tiles updating every ~300ms.

## Why this matters
- Defines what "real-time financial data on-chain" actually looks like as infrastructure: TEE-attested ingestion + custom pre-processing + chain-native publication.
- Shows pre-processing is a *feature*, not just a forwarding service. Apps can ask Rialo for derived statistics (volatility, sentiment, momentum) from primary sources, without paying an oracle middleman.
- Implies a class of products: any app that needs streaming derived signals — perps DEX, RWA price NAV, dynamic stablecoins, predictive trading models, volatility indices.

## Compositional insight
Project 1337 = native web calls + REX (privacy/verifiability) + reactive transactions + sub-second execution. None of those alone is enough; together they replace a stack that today costs perps protocols hundreds of thousands of dollars per month.
