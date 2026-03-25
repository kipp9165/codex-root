"use client";

export default function NotionExportButton({ data }) {
  const handleExport = async () => {
    if (!data) return;

    const { input, analysis, proceduralBrief, meta } = data;

    const md = [
      `# Invention Radar Brief`,
      ``,
      `**Timestamp:** ${meta?.timestamp || ""}`,
      `**Version:** ${meta?.version || ""}`,
      ``,
      `## Input`,
      input?.raw || "",
      ``,
      `## Analysis`,
      `- Novelty Score: ${analysis?.noveltyScore}`,
      `- Confidence: ${analysis?.confidence}`,
      `- Industry Tags: ${(analysis?.industryTags || []).join(", ")}`,
      ``,
      `## Procedural Brief`,
      proceduralBrief?.summary || "",
      ``,
      `### Recommended Next Steps`,
      ...(proceduralBrief?.recommendedNextSteps || []).map((s) => `- ${s}`)
    ].join("\n");

    try {
      await navigator.clipboard.writeText(md);
      alert("Radar brief copied to clipboard. Paste into Notion.");
    } catch {
      alert("Unable to copy. Select and copy manually.");
    }
  };

  return (
    <button
      onClick={handleExport}
      style={{
        background: "transparent",
        border: "1px solid rgba(77,240,255,0.2)",
        color: "#f5f5f5",
        padding: "8px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        marginLeft: "8px"
      }}
    >
      Export brief to Notion (copy)
    </button>
  );
}
