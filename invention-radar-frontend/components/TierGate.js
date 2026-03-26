export function TierGate({ tier, minTier, children, fallback = null }) {
  const rank = { free: 0, starter: 1, pro: 2 };
  const current = rank[tier] ?? 0;
  const required = rank[minTier];

  return current >= required ? children : fallback;
}
