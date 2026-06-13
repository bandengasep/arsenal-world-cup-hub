"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}
    >
      <span className="font-display" style={{ fontSize: 44, color: "#10182E" }}>
        SOMETHING WENT WRONG
      </span>
      <p style={{ color: "#7A7A7A", fontSize: 15, maxWidth: 440 }}>
        That page hit a snag. The rest of the hub is fine — give it another go.
      </p>
      <button
        onClick={reset}
        style={{ borderRadius: 100, padding: "11px 24px", background: "#E30613", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}
      >
        Try again
      </button>
    </div>
  );
}
