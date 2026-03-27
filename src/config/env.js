import "dotenv/config";

export const PORT = process.env.PORT || 3000;

// Baserow
export const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://api.baserow.io";
export const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || "";
export const BASEROW_USERS_TABLE_ID = process.env.BASEROW_USERS_TABLE_ID || "";
export const BASEROW_SUBSCRIPTIONS_TABLE_ID = process.env.BASEROW_SUBSCRIPTIONS_TABLE_ID || "";
export const BASEROW_TIER_ACTIVATIONS_TABLE_ID = process.env.BASEROW_TIER_ACTIVATIONS_TABLE_ID || "";

// Stripe
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO || "";
export const STRIPE_PRICE_ENTERPRISE = process.env.STRIPE_PRICE_ENTERPRISE || "";

// App
export const APP_URL = process.env.APP_URL || "http://localhost:3000";
export const NODE_ENV = process.env.NODE_ENV || "development";
