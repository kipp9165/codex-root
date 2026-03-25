"use client";

import NotionExportButton from "./NotionExportButton";

export default function RadarResults({ data }) {
  if (!data || data.error) {
    return data?.error ? (
      <p style={{ color: "#ff4d6a" }}>{data.error}</p>
    ) : null;
  }

  const { meta, input, analysis, proceduralBrief } = data;

  return (
    <div
      style={{
        padding: "24px",
        background: "rgba(5,5,12,0.95)",
        borderRadius: "12px",
        border: "1px solid rgba(77,240,255,0.08)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(77,240,255,0.12), transparent 55%)",
          pointerEvents: "none"
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px" }}>Radar Results</h2>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>
            <span>v{meta?.version}</span>{" "}
            <span style={{ opacity: 0.6 }}>
              •{" "}
              {meta?.timestamp?.slice(0, 19).replace("T", " ") ||
                "no timestamp"}
            </span>
          </div>
        </div>

        <section style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: "14px" }}>Input</h3>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
            {input?.raw}
          </p>
        </section>

        <section
          style={{
            marginBottom: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px"
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "rgba(5,5,20,0.9)",
              border: "1px solid rgba(77,240,255,0.4)"
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7,
                marginBottom: "4px"
              }}
            >
              Novelty
            </div>
            <div style={{ fontSize: "18px" }}>
              {Math.round((analysis?.noveltyScore || 0) * 100)}%
            </div>
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "rgba(5,5,20,0.9)",
              border: "1px solid rgba(77,240,255,0.08)"
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7,
                marginBottom: "4px"
              }}
            >
              Confidence
            </div>
            <div style={{ fontSize: "18px" }}>
              {Math.round((analysis?.confidence || 0) * 100)}%
            </div>
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "rgba(5,5,20,0.9)",
              border: "1px solid rgba(77,240,255,0.08)"
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7,
                marginBottom: "4px"
              }}
            >
              Industry
            </div>
            <div style={{ fontSize: "13px" }}>
              {(analysis?.industryTags || []).join(", ") || "—"}
            </div>
          </div>
        </section>

        {proceduralBrief && (
          <section style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "14px" }}>
              Procedural Brief
            </h3>
            <p style={{ margin: "0 0 10px", fontSize: "13px", opacity: 0.9 }}>
              {proceduralBrief.summary}
            </p>
            {proceduralBrief.recommendedNextSteps?.length > 0 && (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  fontSize: "13px",
                  opacity: 0.9
                }}
              >
                {proceduralBrief.recommendedNextSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <NotionExportButton data={data} />
        </div>
      </div>
    </div>
  );
}
