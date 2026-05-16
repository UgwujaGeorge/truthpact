# Source: A Visual Guide to Concurrency Control

**Published:** January 22, 2026
**URL:** https://rialo.io/posts/a-visual-guide-to-concurrency-control
**Live demo:** https://concurrency-control.learn.rialo.io/

## One-line
Walks through optimistic vs pessimistic concurrency control for parallel execution. Punchline buried at the end: **Rialo uses optimistic concurrency control** — all txs run in parallel, validate after, retry on conflict.

## Why this matters for product design
- **OCC implication for builders:** workloads that touch many separate accounts (e.g., per-user reactive automations, independent NFT/RWA pieces, agent escrows) get maximum parallelism. Workloads that hammer one global account (centralized order book on a single asset, single-counter contracts) will see retry pressure under load.
- Design pattern: shard state by user/asset whenever possible. Let SCALE-style escrows be per-task accounts. Per-user reactive triggers are perfect for OCC.
- The article telegraphs that a "deeper technical guide on Rialo's optimistic execution" is coming.

## Quick recap of mechanism
- Pessimistic: txs declare read/write set up front; conflicting txs serialize (delays).
- Optimistic: all txs run in parallel; commits ordered; txs that read stale state get re-executed.
- OCC wins on read-heavy and shard-friendly workloads; loses on write-hot single accounts.
