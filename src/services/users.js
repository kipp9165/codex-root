import baserowRequest from "./baserow.js";

const USERS_TABLE_ID = process.env.BASEROW_USERS_TABLE_ID;

export async function findUserByEmail(email) {
  const res = await baserowRequest(
    "GET",
    `/database/rows/table/${USERS_TABLE_ID}/?user_field_names=true&filter__email__equal=${encodeURIComponent(email)}`
  );
  return res.results?.[0] || null;
}

export async function findUserByStripeCustomerId(stripeCustomerId) {
  const res = await baserowRequest(
    "GET",
    `/database/rows/table/${USERS_TABLE_ID}/?user_field_names=true&filter__stripe_customer_id__equal=${encodeURIComponent(stripeCustomerId)}`
  );
  return res.results?.[0] || null;
}

export async function createUser({ email, stripeCustomerId }) {
  return baserowRequest("POST", `/database/rows/table/${USERS_TABLE_ID}/?user_field_names=true`, {
    email,
    stripe_customer_id: stripeCustomerId || "",
    current_tier: "free"
  });
}

export async function updateUser(id, fields) {
  return baserowRequest(
    "PATCH",
    `/database/rows/table/${USERS_TABLE_ID}/${id}/?user_field_names=true`,
    fields
  );
}

export async function upsertUserFromStripe({ email, stripeCustomerId }) {
  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser({ email, stripeCustomerId });
  } else if (stripeCustomerId && !user.stripe_customer_id) {
    user = await updateUser(user.id, { stripe_customer_id: stripeCustomerId });
  }
  return user;
}
