"use client";

export default function RadarScanOverlay({ active }) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: "inherit"
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          top: -60,
          left: -60,
          background:
            "conic-gradient(from 0deg, rgba(77,240,255,0.2), transparent 40%, transparent 100%)",
          animation: "radar-sweep 2.4s linear infinite"
        }}
      />
      <style>{`@keyframes radar-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
