"use strict";

/**
 * Resolve user identity from the request context.
 * In production this would look up the user in a database.
 * For now it returns the authenticated caller identity derived from headers.
 */
function resolveUser(req) {
  const userId = req.headers["x-user-id"] || null;
  const email = req.headers["x-user-email"] || null;
  const tier = req.headers["x-user-tier"] || "free";

  if (!userId) {
    return null;
  }

  return { userId, email, tier };
}

module.exports = { resolveUser };
