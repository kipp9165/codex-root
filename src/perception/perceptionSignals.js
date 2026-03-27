"use strict";

// =============================================================================
// PERCEPTION SIGNALS — Specification (no executable logic)
// =============================================================================
//
// This module defines the specification for perception signals within the
// Codex system. Perception signals are environmental or contextual inputs
// that the system observes and interprets before taking action.
//
// Signal Types:
//   - USER_TIER_CHANGE      : A user's tier has changed (upgrade / downgrade).
//   - USER_ACTIVITY_SPIKE   : Detected burst of user activity above threshold.
//   - SYSTEM_RESOURCE_ALERT : CPU / memory / storage nearing configured limit.
//   - INTEGRATION_HEALTH    : External integration (Baserow, Stripe) status update.
//   - BILLING_EVENT         : Billing lifecycle event (payment, failure, expiry).
//
// Signal Schema:
//   {
//     type      : <string>  — one of the signal types above,
//     source    : <string>  — module or service that emitted the signal,
//     payload   : <object>  — signal-specific data,
//     timestamp : <string>  — ISO 8601 UTC timestamp,
//     severity  : <string>  — "info" | "warn" | "critical"
//   }
//
// Processing Rules:
//   1. Signals MUST be validated against their schema before processing.
//   2. Unknown signal types MUST be logged and discarded.
//   3. "critical" severity signals MUST trigger an immediate alert.
//   4. Signals are immutable once emitted; create a new signal to amend.
//
// Integration Points:
//   - fusionRules.js : Combines multiple signals into composite decisions.
//   - personaRules.js: Uses perception output to shape persona behaviour.
//   - tierActivationListener.js: Emits USER_TIER_CHANGE signals on activation.
//
// =============================================================================
