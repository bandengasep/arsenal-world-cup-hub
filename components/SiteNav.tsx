import Link from "next/link";

const TABS = [
  { label: "GUNNERS TODAY", href: "/" },
  { label: "ASK", href: "/ask" },
  { label: "ORACLE", href: "/oracle" },
  { label: "GOALS", href: "/goals" },
  { label: "BRIEFING", href: "/briefing" },
];

export function SiteNav({
  active = "GUNNERS TODAY",
  liveNow,
  asOf,
}: {
  active?: string;
  liveNow: number;
  asOf: string;
}) {
  return (
    <nav
      style={{ height: 64, borderBottom: "1px solid #E1E1E1" }}
      className="sticky top-0 z-50 flex items-center justify-between bg-white px-10"
    >
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3">
        <span
          className="font-display flex items-center justify-center text-white"
          style={{ width: 34, height: 34, borderRadius: 6, background: "#E30613", fontSize: 15 }}
        >
          AFC
        </span>
        <span className="font-display text-ink" style={{ fontSize: 22, lineHeight: "28px", letterSpacing: "0.01em" }}>
          ARSENAL
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#9A9A9A" }}>
          WORLD CUP HUB
        </span>
      </Link>

      {/* Tabs */}
      <div className="hidden items-center gap-8 md:flex">
        {TABS.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: t.label === active ? "#E30613" : "#10182E",
            }}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span
          className="flex items-center gap-2"
          style={{ background: "#FDECEC", borderRadius: 100, padding: "4px 10px" }}
        >
          <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#F00000" }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: "#F00000" }}>
            {liveNow} LIVE
          </span>
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#7A7A7A" }}>{asOf}</span>
      </div>
    </nav>
  );
}
