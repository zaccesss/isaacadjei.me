import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

function sanitiseOgParam(str: string, maxLen: number): string {
  return str.replace(/[^\x20-\x7E]/g, "").slice(0, maxLen)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rawTitle = searchParams.get("title") ?? "Isaac Adjei"
  const rawDescription = searchParams.get("description") ?? "Electronic Engineering & Computer Science Student"
  const title = sanitiseOgParam(rawTitle, 100)
  const description = sanitiseOgParam(rawDescription, 200)

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0a 100%)",
          padding: "40px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#121212",
              border: "1px solid rgba(250, 250, 250, 0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                fontSize: "38px",
                fontWeight: 800,
                letterSpacing: "-3px",
                color: "#FAFAFA",
              }}
            >
              ia
              <span style={{ color: "#5778DB" }}>.</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            isaacadjei.me
          </div>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: "700",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.1",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "32px",
            color: "#a0a0a0",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          {description}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px",
            color: "#666",
          }}
        >
          <span>Electronic Engineering</span>
          <span style={{ color: "#667eea" }}>•</span>
          <span>Computer Science</span>
          <span style={{ color: "#667eea" }}>•</span>
          <span>Aston University</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    }
  )
}
