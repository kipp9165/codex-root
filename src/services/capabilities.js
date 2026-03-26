export const TIER_CAPABILITIES = {
  free: {
    radarPasses: 1,
    radarDepth: "basic",
    notionExport: false,
    cinematicMode: false,
    industryClassification: "basic",
    priorityQueue: false
  },
  starter: {
    radarPasses: 2,
    radarDepth: "enhanced",
    notionExport: true,
    cinematicMode: false,
    industryClassification: "enhanced",
    priorityQueue: false
  },
  pro: {
    radarPasses: 3,
    radarDepth: "deep",
    notionExport: true,
    cinematicMode: true,
    industryClassification: "advanced",
    priorityQueue: true
  }
};

export function getCapabilitiesForTier(tier) {
  const normalized = (tier || "free").toLowerCase();
  return TIER_CAPABILITIES[normalized] || TIER_CAPABILITIES.free;
}
