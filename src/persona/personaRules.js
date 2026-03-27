"use strict";

// =============================================================================
// PERSONA RULES — Specification (no executable logic)
// =============================================================================
//
// This module defines the specification for persona behaviour rules within
// the Codex system. Persona rules govern how the system presents itself and
// responds to users based on their tier, context, and fusion decisions.
//
// Persona Modes:
//   - STANDARD    : Default interaction style for free/starter tier users.
//   - PROFESSIONAL: Enhanced, formal style for pro tier users.
//   - EXECUTIVE   : High-conciseness, priority-access style for enterprise users.
//   - ALERT       : System-priority mode triggered by critical fusion decisions.
//
// Persona Selection Rules:
//   1. Derive base mode from the user's active tier (see capabilitiesMap.js).
//   2. Override with ALERT mode when a "critical" FusionResult is active.
//   3. Persona mode persists for the duration of a user session unless overridden.
//   4. Persona MUST NOT expose capabilities the user's tier does not include.
//
// Response Modifiers:
//   - tone         : "casual" | "formal" | "concise"
//   - verbosity    : "verbose" | "standard" | "minimal"
//   - escalation   : boolean — whether to surface escalation prompts
//
// Tier → Persona Defaults:
//   free       → mode: STANDARD,      tone: casual,  verbosity: verbose, escalation: true
//   starter    → mode: STANDARD,      tone: formal,  verbosity: standard, escalation: true
//   pro        → mode: PROFESSIONAL,  tone: formal,  verbosity: standard, escalation: false
//   enterprise → mode: EXECUTIVE,     tone: concise, verbosity: minimal, escalation: false
//
// Integration Points:
//   - fusionRules.js   : Provides FusionResult that may override persona mode.
//   - capabilitiesMap.js: Constrains which capabilities persona may surface.
//   - tierActivationListener.js: Triggers persona re-evaluation on tier change.
//
// =============================================================================
