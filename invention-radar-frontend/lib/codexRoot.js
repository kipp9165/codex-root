const API_BASE = process.env.NEXT_PUBLIC_CODEX_ROOT_URL || "https://codex-root-v1.onrender.com";

export async function getMe(email) {
  const res = await fetch(`${API_BASE}/me?email=${encodeURIComponent(email)}`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
}

export async function createCheckoutSession({ priceId, email }) {
  const res = await fetch(`${API_BASE}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      priceId,
      customerEmail: email,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/cancel`
    })
  });
  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
}

export async function createBillingPortal({ customerId }) {
  const res = await fetch(`${API_BASE}/billing/portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account`
    })
  });
  if (!res.ok) throw new Error("Portal failed");
  return res.json();
}
