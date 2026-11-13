import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#07090e",
          color: "#ece7dc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              color: "#38f2e6",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            DIMENSION-K // OBSERVATORY
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#747c8e",
              fontFamily: "monospace",
            }}
          >
            22.75°N // AGARTALA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1.05, fontWeight: "bold" }}>
            <span>Koushik</span>
            <span style={{ color: "#f0a35e", fontStyle: "italic", marginLeft: 16 }}>Kar</span>
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#a3a8b3" }}>
            Software Engineer &bull; Systems, Developer Tools & Real-Time Engines
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 24,
            fontSize: 20,
            color: "#8c93a3",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex" }}>CodeLens &bull; Ludo Neo &bull; AlgoVisuals</div>
          <div style={{ display: "flex", color: "#f0a35e" }}>NIT AGARTALA</div>
        </div>
      </div>
    ),
    size
  );
}
