import type { Gunner, PlayerStatus } from "@/lib/gunners";
import { photoFor } from "@/lib/gunners";

const BADGE_BG: Record<PlayerStatus, string> = {
  LIVE: "#E30613",
  KO: "#10182E",
  FT: "rgba(16,24,46,0.55)",
};

export function PlayerCard({ g }: { g: Gunner }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6E6E6",
        borderRadius: 8,
        overflow: "clip",
        display: "flex",
        flexDirection: "column",
        width: 259,
      }}
    >
      {/* Portrait */}
      <div
        style={{
          position: "relative",
          height: 190,
          background: "#E9ECF1",
          overflow: "clip",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoFor(g.key)}
          alt={g.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 16%",
          }}
        />
        {/* Jersey number watermark */}
        <div
          className="font-display"
          style={{
            position: "absolute",
            top: 6,
            right: 14,
            fontSize: 64,
            lineHeight: "100%",
            color: "rgba(16,24,46,0.13)",
          }}
        >
          {g.number}
        </div>
        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 5,
            padding: "5px 9px",
            background: BADGE_BG[g.status],
          }}
        >
          {g.status === "LIVE" && (
            <span
              className="live-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontWeight: 700,
              fontSize: 10,
              lineHeight: "12px",
              letterSpacing: "0.07em",
              color: "#fff",
            }}
          >
            {g.badge}
          </span>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          borderTop: "2px solid #E30613",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "14px 14px 13px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            className="font-display"
            style={{ fontSize: 23, lineHeight: "90%", color: "#10182E" }}
          >
            {g.name}
          </span>
          {g.captain && (
            <span
              title="Captain"
              style={{
                flexShrink: 0,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#BEAC88",
                color: "#10182E",
                fontSize: 9,
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: 0,
              }}
            >
              C
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: "#10182E",
              borderRadius: 3,
              padding: "3px 7px",
              fontWeight: 700,
              fontSize: 10,
              lineHeight: "12px",
              letterSpacing: "0.04em",
              color: "#fff",
            }}
          >
            {g.code}
          </span>
          <span style={{ fontWeight: 600, fontSize: 12, color: "#4F4F4F" }}>
            {g.position}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #EEEEEE",
            paddingTop: 10,
          }}
        >
          <span style={{ fontWeight: 500, fontSize: 11, color: "#7A7A7A" }}>
            {g.opponent}
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.02em",
              color: g.stat ? "#E30613" : "#9AA3B2",
            }}
          >
            {g.stat ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
