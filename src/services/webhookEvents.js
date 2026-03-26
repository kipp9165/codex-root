import baserowRequest from "./baserow.js";

const EVENTS_TABLE_ID = process.env.BASEROW_EVENTS_TABLE_ID;

export async function hasProcessedEvent(stripeEventId) {
  const res = await baserowRequest(
    "GET",
    `/database/rows/table/${EVENTS_TABLE_ID}/?user_field_names=true&filter__stripe_event_id__equal=${encodeURIComponent(stripeEventId)}`
  );
  return res.results?.length > 0;
}

export async function recordWebhookEvent(event) {
  return baserowRequest(
    "POST",
    `/database/rows/table/${EVENTS_TABLE_ID}/?user_field_names=true`,
    {
      stripe_event_id: event.id,
      type: event.type,
      payload: JSON.stringify(event),
      processed_at: new Date().toISOString()
    }
  );
}
