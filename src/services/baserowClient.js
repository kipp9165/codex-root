const BASEROW_API_URL = process.env.BASEROW_API_URL;
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN;
const TIER_ACTIVATIONS_TABLE_ID = process.env.BASEROW_TIER_ACTIVATIONS_TABLE_ID;

async function baserowRequest(method, path, body) {
  const res = await fetch(`${BASEROW_API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Token ${BASEROW_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Baserow error: ${res.status} ${text}`);
  }

  return res.json();
}

async function fetchRecentTierActivations(sinceIso) {
  const filter = sinceIso
    ? `&filter__timestamp__gte=${encodeURIComponent(sinceIso)}`
    : "";
  const res = await baserowRequest(
    "GET",
    `/database/rows/table/${TIER_ACTIVATIONS_TABLE_ID}/?user_field_names=true&order_by=timestamp${filter}`
  );
  return res.results || [];
}

module.exports = { fetchRecentTierActivations };
