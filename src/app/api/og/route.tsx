import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "JobsDekho";
  const org = searchParams.get("org") || "Career Opportunities India";
  const category = searchParams.get("category") || "";
  const deadline = searchParams.get("deadline") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>💼 JobsDekho</div>
          {category && (
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 16px", fontSize: 18, fontWeight: 600 }}>
              {category}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.2, maxWidth: "90%" }}>
            {title.length > 80 ? title.slice(0, 80) + "…" : title}
          </div>
          <div style={{ fontSize: 24, opacity: 0.9, fontWeight: 500 }}>{org}</div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, opacity: 0.8 }}>
          <div>jobsdekho.com</div>
          {deadline && <div>Deadline: {deadline}</div>}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
