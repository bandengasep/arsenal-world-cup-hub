"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#10182E" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.01em" }}>Something went wrong</span>
          <p style={{ color: "#7A7A7A", fontSize: 15, maxWidth: 420 }}>The Arsenal World Cup Hub hit an unexpected error.</p>
          <button
            onClick={reset}
            style={{ borderRadius: 100, padding: "11px 24px", background: "#E30613", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
