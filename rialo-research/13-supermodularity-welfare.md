# Source: Supermodularity and System Welfare — The Economics of Integration

**Published:** April 22, 2026
**URL:** https://rialo.io/posts/supermodularity-and-system-welfare-the-economics-of-integration

## One-line
The economics-paper companion to Foundations II. Adds the welfare-loss framing to the supermodularity argument: dApp surplus today is destroyed by middleware fragmentation; Rialo recovers it by absorbing supermodulars into the chain.

## Welfare framework
- "System welfare" = total value to devs/users after execution costs, coordination overhead, operational risk.
- High welfare ⇔ valuable on-chain activity is cheap, reliable, scalable.
- Today's chains lose welfare in two ways: (1) compounding middleware fees → high prices, low demand; (2) middleware doesn't share base-layer reliability/decentralization → operational risk.

## Liquidation example (recurring throughout the corpus)
- Today: oracle + keeper + bridge fees stack up; cost approaches or exceeds value → throttled liquidations or higher user fees → bad debt risk → users exit.
- Rialo's version: protocol-native oracles (intervals or change-driven); native automation re-checks LTV per block or per oracle update; reactive tx liquidates when collateral negative. Single execution price, no markup chain.

## Big-picture lens
This post is the place where Rialo's pitch is most explicit:
> "In a world where throughput, speed, and basic composability are increasingly commoditized, blockchains will start differentiating based on **how well their components work together** (compositional power)."

Implication for product builders: the moat is in compositions of primitives, not any one feature.
