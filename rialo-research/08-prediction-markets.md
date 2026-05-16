# Source: How Rialo Secures Prediction Markets

**Published:** December 19, 2025
**URL:** https://rialo.io/posts/how-rialo-secures-prediction-markets

## One-line
Aggregation oracles (DON-style, e.g. Chainlink) and optimistic oracles (UMA-style) both break above an economic security boundary. Rialo's approach: resolution is *a line of code that points at a primary source* (NFL.com, federalreserve.gov, weather.com), with the chain itself attesting fetch + computation.

## The economic security boundary (formalized)
- Attack profitable when (payouts from false outcomes + short-token-profit) > token-loss-from-crash.
- For a $500M-mcap voting-token oracle securing 10 markets at $10M each, even at 20% turnout the attacker pockets ~$17.5M after the token crash. Optimistic + aggregation oracles fail here.
- General lesson: any oracle whose security is its own token's market cap can be bribed once markets get big enough.

## Rialo's "primary-source" model
- A market specifies the source (URL/API) and the policy (e.g., "what does the JSON field `winner` say at time T?").
- Rialo validators fetch + attest. MCP routing layer mitigates censorship.
- Three benefits: (1) real-world institutional reputation does the heavy lifting (NFL.com isn't lying about the Super Bowl winner to rug a prediction market); (2) decentralized resolution across unrelated domains (sports + rates + weather can't all be bribed simultaneously); (3) eliminates oracle "telephone game" — anyone can inspect the source and policy.

## Compared to aggregation oracles
- Full source, not a median (no information lost on outliers).
- Fresher by construction — primary source as it publishes; no consensus game on stale value.
- No redundant staking layer (no separate bonded-reporter quorum; chain stake itself secures).
- Higher security at scale — cost to attack rises with usage.

## Implication for product ideas
This is a *general primitive*, not just a prediction-market trick. Anything that needs "what does this trustworthy webpage say?" — oracle-replacement, news-driven derivatives, programmable insurance, IP/media royalty splits, dynamic RWAs — can be built with the same shape.
