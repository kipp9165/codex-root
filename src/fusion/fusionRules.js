"use strict";

// =============================================================================
// FUSION RULES — Specification (no executable logic)
// =============================================================================
//
// This module defines the specification for the fusion layer within the
// Codex system. Fusion combines multiple perception signals and context
// state into a single, coherent decision or action recommendation.
//
// Fusion Goals:
//   - Aggregate concurrent signals to avoid redundant processing.
//   - Resolve conflicts between contradictory signals using priority rules.
//   - Produce a single FusionResult per evaluation cycle.
//
// FusionResult Schema:
//   {
//     decision   : <string>  — recommended action (e.g. "activate_tier", "alert_admin"),
//     confidence : <number>  — 0.0–1.0 score representing certainty,
//     signals    : <array>   — source signals that contributed to this decision,
//     context    : <object>  — merged context snapshot at evaluation time,
//     timestamp  : <string>  — ISO 8601 UTC timestamp
//   }
//
// Priority Rules (highest to lowest):
//   1. SYSTEM_RESOURCE_ALERT (critical)
//   2. BILLING_EVENT
//   3. USER_TIER_CHANGE
//   4. INTEGRATION_HEALTH
//   5. USER_ACTIVITY_SPIKE
//
// Conflict Resolution:
//   - When two signals of equal priority contradict, emit a "manual_review" decision.
//   - Stale signals (older than FUSION_TTL_MS) are excluded from evaluation.
//
// Evaluation Trigger Conditions:
//   - On receipt of any "critical" severity signal.
//   - On completion of each polling cycle (batch evaluation).
//   - On explicit external call (e.g. admin API request).
//
// Integration Points:
//   - perceptionSignals.js : Provides raw signals consumed by fusion.
//   - personaRules.js      : Receives FusionResult to shape persona response.
//   - tierActivationHandler.js: May be invoked as a fusion decision action.
//
// =============================================================================
