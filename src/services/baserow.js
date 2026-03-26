import fetch from "node-fetch";

const BASEROW_API_URL = process.env.BASEROW_API_URL;
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN;

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

export default baserowRequest;
