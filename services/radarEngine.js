const { basicNoveltyScore, basicConfidenceScore } = require("./scoring");
const { classifyIndustry } = require("./classification");

/**
 * runRadarAnalysis
 *
 * v1.0 placeholder radar engine.
 * Safe, deterministic, and ready to be replaced by a richer pipeline.
 */
async function runRadarAnalysis(input) {
  const noveltyScore = basicNoveltyScore(input);
  const confidence = basicConfidenceScore(input);
  const industryTags = classifyIndustry(input);

  const summary =
    "This is a v1.0 placeholder procedural brief. The full Invention Radar pipeline will enrich this with legal, technical, and strategic guidance.";

  const recommendedNextSteps = [
    "Clarify the core inventive concept in one sentence.",
    "Identify prior art or similar systems you are aware of.",
    "Decide whether this is patent, trade secret, or publication oriented.",
    "Run a deeper Invention Radar pass once the full pipeline is online."
  ];

  return {
    analysis: {
      noveltyScore,
      riskFlags: [],
      industryTags,
      confidence
    },
    proceduralBrief: {
      summary,
      recommendedNextSteps
    }
  };
}

module.exports = {
  runRadarAnalysis
};
