"use client";

export default function BillingStripeButton() {
  const handleClick = async () => {
    alert(
      "Stripe billing not wired yet. Connect this button to /billing/checkout on Codex Root when ready."
    );
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "rgba(255,77,240,0.12)",
        border: "1px solid rgba(255,77,240,0.6)",
        color: "#f5f5f5",
        padding: "8px 12px",
        borderRadius: "999px",
        fontSize: "13px"
      }}
    >
      Upgrade via Stripe (stub)
    </button>
  );
}
