import { ImageResponse } from "next/og";

export const alt = "Africa Beauty & Wellness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded link-preview card. Solid fills only (no gradients).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#440220",
          color: "#f2f2f0",
          padding: "72px 80px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>
            AFRICA BEAUTY &amp; WELLNESS
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 6,
              color: "rgba(242,242,240,0.7)",
              marginTop: 6,
            }}
          >
            MANUFACTURING PLATFORM
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05 }}>
          Building Africa&rsquo;s Next Beauty &amp; Wellness Manufacturing Giant
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 22,
            letterSpacing: 2,
            color: "rgba(242,242,240,0.72)",
          }}
        >
          Manufacturing in Africa. Powered by African ingredients.
        </div>
      </div>
    ),
    { ...size }
  );
}
