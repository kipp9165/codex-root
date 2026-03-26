import baserowRequest from "./baserow.js";

const SUBSCRIPTIONS_TABLE_ID = process.env.BASEROW_SUBSCRIPTIONS_TABLE_ID;

export async function findSubscriptionByStripeId(stripeSubscriptionId) {
  const res = await baserowRequest(
    "GET",
    `/database/rows/table/${SUBSCRIPTIONS_TABLE_ID}/?user_field_names=true&filter__stripe_subscription_id__equal=${encodeURIComponent(stripeSubscriptionId)}`
  );
  return res.results?.[0] || null;
}

export async function upsertSubscription({ userId, subscription, tier }) {
  const existing = await findSubscriptionByStripeId(subscription.id);

  const fields = {
    user: userId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items?.data?.[0]?.price?.id || "",
    tier,
    status: subscription.status,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
  };

  if (!existing) {
    return baserowRequest(
      "POST",
      `/database/rows/table/${SUBSCRIPTIONS_TABLE_ID}/?user_field_names=true`,
      fields
    );
  }

  return baserowRequest(
    "PATCH",
    `/database/rows/table/${SUBSCRIPTIONS_TABLE_ID}/${existing.id}/?user_field_names=true`,
    fields
  );
}
