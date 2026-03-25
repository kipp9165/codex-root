/**
 * Very simple, deterministic scoring functions.
 * These are placeholders and can be replaced with real models later.
 */

function basicNoveltyScore(input) {
  if (!input || typeof input !== "string") return 0.5;

  const length = input.trim().length;

  if (length < 40) return 0.4;
  if (length < 120) return 0.6;
  if (length < 280) return 0.72;
  if (length < 560) return 0.78;
  return 0.82;
}

function basicConfidenceScore(input) {
  if (!input || typeof input !== "string") return 0.5;

  const length = input.trim().length;

  if (length < 40) return 0.45;
  if (length < 120) return 0.6;
  if (length < 280) return 0.65;
  if (length < 560) return 0.7;
  return 0.75;
}

module.exports = {
  basicNoveltyScore,
  basicConfidenceScore
};
