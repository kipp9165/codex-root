"use client";

export default function RadarHistory({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "16px",
        borderRadius: "10px",
        background: "rgba(5,5,12,0.9)",
        border: "1px solid rgba(77,240,255,0.06)"
      }}
    >
      <div
        style={{
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          opacity: 0.7,
          marginBottom: "10px"
        }}
      >
        Multi-pass Radar History
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {history.map((entry, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(entry)}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              background: "rgba(77,240,255,0.08)",
              color: "#f5f5f5",
              border: "1px solid rgba(77,240,255,0.4)",
              fontSize: "12px"
            }}
          >
            Pass {idx + 1} • {entry.meta?.timestamp?.slice(11, 19) || "time"}
          </button>
        ))}
      </div>
    </div>
  );
}
