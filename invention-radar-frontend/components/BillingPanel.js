"use client";

import { useState } from "react";
import { createCheckoutSession, createBillingPortal } from "../lib/codexRoot";

export function BillingPanel({ email, tier, stripeCustomerId, proPriceId }) {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    const { url } = await createCheckoutSession({ priceId: proPriceId, email });
    window.location.href = url;
  }

  async function manage() {
    setLoading(true);
    const { url } = await createBillingPortal({ customerId: stripeCustomerId });
    window.location.href = url;
  }

  return (
    <div>
      <p>Current plan: <strong>{tier}</strong></p>
      {tier !== "pro" && (
        <button onClick={upgrade} disabled={loading}>
          {loading ? "Redirecting…" : "Upgrade to Pro"}
        </button>
      )}
      {stripeCustomerId && (
        <button onClick={manage} disabled={loading}>
          {loading ? "Redirecting…" : "Manage Billing"}
        </button>
      )}
    </div>
  );
}
