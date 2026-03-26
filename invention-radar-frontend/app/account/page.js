"use client";

import { useMe } from "../../hooks/useMe";
import { TierGate } from "../../components/TierGate";
import { BillingPanel } from "../../components/BillingPanel";

const PRO_PRICE_ID = "price_pro_monthly"; // match Stripe

export default function AccountPage() {
  const email = "kipp@example.com"; // replace with real auth later
  const { me, loading } = useMe(email);

  if (loading || !me) return <p>Loading…</p>;

  return (
    <main>
      <h1>Account</h1>
      <p>Email: {me.email}</p>
      <p>Tier: {me.tier}</p>
      <BillingPanel
        email={me.email}
        tier={me.tier}
        stripeCustomerId={me.stripeCustomerId}
        proPriceId={PRO_PRICE_ID}
      />
      <TierGate tier={me.tier} minTier="pro" fallback={<p>Upgrade to Pro to access this feature.</p>}>
        <p>🎉 You have Pro access!</p>
      </TierGate>
    </main>
  );
}
