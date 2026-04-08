"use client";

import { useState } from "react";
import RadarScanOverlay from "./RadarScanOverlay";
import RadarResults from "./RadarResults";
import RadarHistory from "./RadarHistory";
import BillingStripeButton from "./BillingStripeButton";

const API_URL = "https://codex-root-v1.onrender.com/radar";

function classifyIndustry(text) {
  const t = text.toLowerCase();
  if (/medical|health|pharma|biotech|genomic/.test(t))
    return ["Healthcare", "Biotechnology"];
  if (/energy|solar|wind|battery|fuel/.test(t))
    return ["Energy", "CleanTech"];
  if (/ai|machine learning|neural|data|software|algorithm/.test(t))
    return ["Technology", "AI/ML"];
  if (/transport|vehicle|drone|aerospace|aviation/.test(t))
    return ["Transportation", "Aerospace"];
  if (/food|agri|farm|crop|nutrition/.test(t))
    return ["Agriculture", "FoodTech"];
  if (/finance|fintech|payment|banking|crypto/.test(t))
    return ["Finance", "FinTech"];
  return ["General Technology"];
}

export default function RadarForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleScan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.analysis?.industryTags?.length) {
        if (!data.analysis) data.analysis = {};
        data.analysis.industryTags = classifyIndustry(input);
      }

      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 10));
    } catch (err) {
      setResult({ error: err.message || "Radar scan failed. Check backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            margin: "0 0 12px",
            letterSpacing: "-0.02em"
          }}
        >
          Invention Radar
        </h1>
        <p style={{ margin: 0, opacity: 0.6, fontSize: "15px" }}>
          Real-time invention intelligence by Codex Labs
        </p>
      </div>

      <div
        style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}
      >
        <RadarScanOverlay active={loading} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your invention idea..."
            disabled={loading}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "12px",
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            <button
              onClick={handleScan}
              disabled={loading || !input.trim()}
            >
              {loading ? "Scanning…" : "Run Radar Scan"}
            </button>
            <BillingStripeButton />
          </div>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: "28px" }}>
          <RadarResults data={result} />
        </div>
      )}

      <RadarHistory history={history} onSelect={setResult} />
    </div>
  );
}
