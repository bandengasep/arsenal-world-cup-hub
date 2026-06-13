"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { SiteNav } from "@/components/SiteNav";
import { gunnersSnapshot, deriveHeroStats } from "@/lib/gunners";

const stats = deriveHeroStats(gunnersSnapshot);
const SUGGESTIONS = ["Saka goal", "Ødegaard strike", "Martinelli finish", "free kick", "header", "long range screamer"];

interface Shot {
  start: number;
  end: number;
  text: string;
}
interface GoalsResult {
  query: string;
  playerUrl: string | null;
  shots: Shot[];
  count: number;
  error: string | null;
}

const ts = (s: number) => {
  if (s == null || isNaN(s)) return "";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function GoalsPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GoalsResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`/api/goals/search?q=${encodeURIComponent(q)}`);
      setResult(await r.json());
    } catch {
      setResult({ query: q, playerUrl: null, shots: [], count: 0, error: "search failed" });
    } finally {
      setLoading(false);
    }
  };

  // Attach the HLS supercut stream when a result arrives.
  useEffect(() => {
    const url = result?.playerUrl;
    const video = videoRef.current;
    if (!url || !video) return;
    let hls: Hls | undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url; // Safari native HLS
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    }
    return () => hls?.destroy();
  }, [result?.playerUrl]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav active="GOALS" liveNow={stats.liveNow} asOf={stats.asOf} />

      <main className="mx-auto w-full max-w-4xl px-6 pb-16">
        <div className="pt-10 pb-6">
          <h1 className="font-display" style={{ fontSize: 40, lineHeight: "94%", color: "#10182E" }}>
            ARSENAL GOALS
          </h1>
          <p style={{ fontSize: 14, color: "#7A7A7A", marginTop: 8, maxWidth: 640 }}>
            Semantic search across Gunner goal highlights — type what you remember and{" "}
            <strong style={{ color: "#10182E" }}>VideoDB</strong> finds the exact moments from the
            commentary and stitches them into a playable supercut.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(input);
          }}
          className="flex items-center gap-2"
          style={{ background: "#fff", padding: 6, borderRadius: 100, border: "1px solid #E1E1E1", boxShadow: "0 6px 24px rgba(16,24,46,0.08)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Gunner goals — e.g. 'Saka curler', 'free kick'…"
            style={{ flex: 1, border: "none", borderRadius: 100, padding: "12px 18px", fontSize: 14, outline: "none", background: "transparent" }}
          />
          <button type="submit" disabled={loading} style={{ borderRadius: 100, padding: "12px 24px", fontSize: 14, fontWeight: 700, background: loading ? "#9AA3B2" : "#E30613", color: "#fff", cursor: "pointer" }}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); search(s); }}
              style={{ border: "1px solid #E1E1E1", borderRadius: 100, padding: "6px 12px", fontSize: 12, color: "#10182E", background: "#fff", cursor: "pointer" }}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ marginTop: 28, color: "#7A7A7A", fontSize: 14 }}>
            <span className="live-dot">●</span> VideoDB is searching the commentary and compiling matching shots…
          </p>
        )}

        {result && !loading && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#E30613" }}>
              {result.count} MOMENT{result.count === 1 ? "" : "S"} FOR “{result.query.toUpperCase()}”
            </div>

            {result.playerUrl ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                playsInline
                style={{ marginTop: 14, width: "100%", borderRadius: 8, background: "#000", aspectRatio: "16 / 9" }}
              />
            ) : (
              <p style={{ marginTop: 14, fontSize: 14, color: "#7A7A7A" }}>
                {result.error
                  ? `No playable result (${result.error}).`
                  : "No matching moments found — try another search."}
              </p>
            )}

            {result.shots.length > 0 && (
              <div className="mt-5 flex flex-col gap-2">
                {result.shots.map((s, i) => (
                  <div key={i} className="flex gap-3" style={{ fontSize: 13, lineHeight: "19px" }}>
                    <span style={{ fontWeight: 700, color: "#E30613", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                      {ts(s.start)}
                    </span>
                    <span style={{ color: "#4F4F4F" }}>{s.text || "match"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p style={{ marginTop: 28, fontSize: 11, color: "#9A9A9A" }}>
          Powered by VideoDB — spoken-word index + semantic search over Gunner goal highlights. (WC 2026 goals
          are upcoming; these are real Arsenal goal compilations as stand-ins.)
        </p>
      </main>
    </div>
  );
}
