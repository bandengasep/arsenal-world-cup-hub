"use client";

import { useCallback, useEffect, useState } from "react";

/* Arsenal World Cup Hub — pitch deck. Reuses the hub's palette + Anton/Inter type.
   Navigate: ← → / Space, click the left/right edges, or the dots. */

const INK = "#10182E";
const RED = "#E30613";
const GOLD = "#BEAC88";
const MUTED = "#8893A8";

const GITHUB = "github.com/bandengasep/arsenal-world-cup-hub";
const LIVE = "arsenal-world-cup-hub.vercel.app";
const PLAYERS = ["saka", "odegaard", "saliba", "rice", "gabriel", "raya", "gyokeres"];

function Eyebrow({ children, color = RED }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", color }}>{children}</p>
  );
}

function SponsorTag({ name, use }: { name: string; use: string }) {
  return (
    <div style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 14 }}>
      <div className="font-display" style={{ fontSize: 22, color: "#fff", lineHeight: "100%" }}>{name}</div>
      <div style={{ fontSize: 13, color: MUTED, marginTop: 6, lineHeight: "18px" }}>{use}</div>
    </div>
  );
}

function ModuleSlide({ n, kicker, title, body, tags, dark }: { n: string; kicker: string; title: string; body: string; tags: string[]; dark?: boolean }) {
  const fg = dark ? "#fff" : INK;
  const sub = dark ? MUTED : "#7A7A7A";
  return (
    <div style={{ maxWidth: 920 }}>
      <div className="flex items-baseline gap-4">
        <span className="font-display" style={{ fontSize: 64, color: RED, lineHeight: "100%" }}>{n}</span>
        <Eyebrow>{kicker}</Eyebrow>
      </div>
      <h2 className="font-display" style={{ fontSize: 72, lineHeight: "94%", color: fg, marginTop: 18 }}>{title}</h2>
      <p style={{ fontSize: 20, lineHeight: "30px", color: sub, marginTop: 22, maxWidth: 760 }}>{body}</p>
      <div className="flex flex-wrap gap-2" style={{ marginTop: 28 }}>
        {tags.map((t) => (
          <span key={t} style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "#E1E1E1"}`, color: fg, borderRadius: 100, padding: "7px 14px", fontSize: 13, fontWeight: 700 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function DeckPage() {
  const [i, setI] = useState(0);

  const slides: { bg: string; node: React.ReactNode }[] = [
    // 1 — Title
    {
      bg: INK,
      node: (
        <div>
          <Eyebrow>AGENT FORGE AI HACKATHON · WORLD CUP 2026</Eyebrow>
          <h1 className="font-display" style={{ fontSize: 104, lineHeight: "90%", color: "#fff", marginTop: 20 }}>
            ARSENAL<br />WORLD CUP HUB
          </h1>
          <p style={{ fontSize: 22, color: MUTED, marginTop: 24, maxWidth: 720 }}>
            The Gunners at the World Cup — tracking Arsenal&apos;s 15 players across 9 nations,
            with five AI &amp; data sponsors doing real work on every screen.
          </p>
          <div className="flex gap-2" style={{ marginTop: 32 }}>
            {PLAYERS.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p} src={`/players/${p}.jpg`} alt={p} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", objectPosition: "50% 18%", border: "2px solid rgba(255,255,255,0.2)" }} />
            ))}
          </div>
          <div className="flex gap-6" style={{ marginTop: 36, fontSize: 14 }}>
            <span style={{ color: "#fff" }}><span style={{ color: RED, fontWeight: 700 }}>↗ </span>{LIVE}</span>
            <span style={{ color: "#fff" }}><span style={{ color: RED, fontWeight: 700 }}>◆ </span>{GITHUB}</span>
          </div>
        </div>
      ),
    },
    // 2 — Concept + screenshot
    {
      bg: "#fff",
      node: (
        <div className="flex items-center gap-12" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px", minWidth: 340 }}>
            <Eyebrow>THE IDEA</Eyebrow>
            <h2 className="font-display" style={{ fontSize: 60, lineHeight: "94%", color: INK, marginTop: 16 }}>
              ONE CLUB,<br />NINE NATIONS,<br />ONE LENS.
            </h2>
            <p style={{ fontSize: 19, lineHeight: "29px", color: "#4F4F4F", marginTop: 22 }}>
              A generic World Cup hub is noise. Arsenal fans want to follow <strong style={{ color: INK }}>their</strong> players.
              This hub is skinned like arsenal.com and tracks all 15 Gunners — live status, results, fixtures,
              and AI insight — in one place.
            </p>
            <div className="flex gap-8" style={{ marginTop: 28 }}>
              <div><div className="font-display" style={{ fontSize: 48, color: RED }}>15</div><div style={{ fontSize: 12, letterSpacing: "0.12em", color: "#7A7A7A", fontWeight: 600 }}>PLAYERS</div></div>
              <div><div className="font-display" style={{ fontSize: 48, color: INK }}>9</div><div style={{ fontSize: 12, letterSpacing: "0.12em", color: "#7A7A7A", fontWeight: 600 }}>NATIONS</div></div>
              <div><div className="font-display" style={{ fontSize: 48, color: INK }}>5</div><div style={{ fontSize: 12, letterSpacing: "0.12em", color: "#7A7A7A", fontWeight: 600 }}>SPONSORS</div></div>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/deck/gunners-today.png" alt="Gunners Today" style={{ flex: "1 1 460px", minWidth: 380, maxWidth: 620, borderRadius: 10, border: "1px solid #E6E6E6", boxShadow: "0 20px 50px rgba(16,24,46,0.18)" }} />
        </div>
      ),
    },
    // 3 — Sponsors
    {
      bg: INK,
      node: (
        <div style={{ maxWidth: 1000 }}>
          <Eyebrow>EVERY SPONSOR IS LOAD-BEARING</Eyebrow>
          <h2 className="font-display" style={{ fontSize: 64, lineHeight: "94%", color: "#fff", marginTop: 16, marginBottom: 40 }}>
            FIVE SPONSORS, REAL WORK
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "28px 48px" }}>
            <div style={{ flex: "1 1 280px" }}><SponsorTag name="Bright Data" use="Live Google SERP + Web Unlocker — powers Ask's web search and scraped the squad headshots." /></div>
            <div style={{ flex: "1 1 280px" }}><SponsorTag name="Kimi K2.6 / K2.7-code" use="The agent brain (tool-calling) and the model that writes the Oracle's simulation." /></div>
            <div style={{ flex: "1 1 280px" }}><SponsorTag name="TokenRouter" use="One gateway for every model call — Kimi for reasoning/code, a fast model for the briefing." /></div>
            <div style={{ flex: "1 1 280px" }}><SponsorTag name="Daytona" use="Runs the AI-generated Python in an ephemeral sandbox and returns the chart." /></div>
            <div style={{ flex: "1 1 280px" }}><SponsorTag name="VideoDB" use="Ingests goal highlights, indexes the commentary, returns a playable supercut." /></div>
          </div>
        </div>
      ),
    },
    // 4 — Gunners Today
    { bg: "#fff", node: <ModuleSlide n="01" kicker="MODULE · BRIGHT DATA" title="GUNNERS TODAY" body="A player-first grid of all 15 Gunners with real arsenal.com headshots and a live status badge — LIVE, kickoff, or full-time. Live-first data with a demo-safety snapshot fallback so it's never blank." tags={["Bright Data", "Next.js 16", "Live status"]} /> },
    // 5 — Ask
    { bg: INK, node: <ModuleSlide dark n="02" kicker="MODULE · KIMI · TOKENROUTER · BRIGHT DATA" title="ASK THE GUNNERS DESK" body="A streaming chat agent (Kimi via TokenRouter) with two tools — the official squad and live Bright Data web search — and a visible tool-trace so you watch it reason, search, and answer." tags={["Kimi K2.6", "TokenRouter", "Bright Data", "AI SDK v6"]} /> },
    // 6 — Oracle
    { bg: "#fff", node: <ModuleSlide n="03" kicker="MODULE · KIMI · DAYTONA" title="PLAYER ORACLE" body="Pick a Gunner and Kimi K2.7-code WRITES a Monte-Carlo simulation of their next match; Daytona runs it live in an ephemeral sandbox and returns win probability + the player's expected impact — plus the generated code." tags={["Kimi K2.7-code", "Daytona", "Monte Carlo"]} /> },
    // 7 — Goals
    { bg: INK, node: <ModuleSlide dark n="04" kicker="MODULE · VIDEODB" title="ARSENAL GOALS" body="Semantic search over Gunner goal highlights. VideoDB indexes the commentary, finds the exact moments you describe, and stitches them into a playable supercut — right in the browser." tags={["VideoDB", "Spoken-word index", "HLS"]} /> },
    // 8 — Briefing
    { bg: "#fff", node: <ModuleSlide n="05" kicker="MODULE · TOKENROUTER" title="DAILY GUNNERS BRIEFING" body="An auto-written recap of the Gunners' day at the World Cup — generated through TokenRouter, demonstrating per-task model routing (a fast model for the snappy recap)." tags={["TokenRouter", "Auto-generated"]} /> },
    // 9 — Reliability
    {
      bg: INK,
      node: (
        <div style={{ maxWidth: 920 }}>
          <Eyebrow>BUILT TO DEMO</Eyebrow>
          <h2 className="font-display" style={{ fontSize: 64, lineHeight: "94%", color: "#fff", marginTop: 16 }}>RELIABLE BY DESIGN</h2>
          <div className="flex flex-col gap-5" style={{ marginTop: 30 }}>
            <p style={{ fontSize: 19, lineHeight: "28px", color: "#fff" }}><span style={{ color: RED, fontWeight: 800 }}>Live-first, fallback-safe.</span> <span style={{ color: MUTED }}>The tournament is days old — a live window may have no Gunner on the pitch, so a curated snapshot always renders. The demo can&apos;t go blank.</span></p>
            <p style={{ fontSize: 19, lineHeight: "28px", color: "#fff" }}><span style={{ color: RED, fontWeight: 800 }}>Adversarially reviewed.</span> <span style={{ color: MUTED }}>A multi-agent review pass (23 agents) hardened error handling across every route before deploy.</span></p>
            <p style={{ fontSize: 19, lineHeight: "28px", color: "#fff" }}><span style={{ color: RED, fontWeight: 800 }}>Git-connected, shipped.</span> <span style={{ color: MUTED }}>Next.js 16 · React 19 · Tailwind v4 · AI SDK v6, auto-deploying on push to Vercel.</span></p>
          </div>
        </div>
      ),
    },
    // 10 — Closing
    {
      bg: RED,
      node: (
        <div style={{ textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: 92, lineHeight: "90%", color: "#fff" }}>THE GUNNERS<br />AT THE WORLD CUP</h2>
          <div className="flex flex-col gap-2" style={{ marginTop: 40, fontSize: 18, color: "#fff", alignItems: "center" }}>
            <span>◆ {GITHUB}</span>
            <span>↗ {LIVE}</span>
          </div>
        </div>
      ),
    },
  ];

  const total = slides.length;
  const go = useCallback((d: number) => setI((p) => Math.min(total - 1, Math.max(0, p + d))), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const dark = slides[i].bg !== "#fff";

  return (
    <div style={{ position: "fixed", inset: 0, background: slides[i].bg, overflow: "hidden", transition: "background 250ms ease" }}>
      {/* click zones */}
      <button aria-label="previous" onClick={() => go(-1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "20%", background: "transparent", border: "none", cursor: i > 0 ? "pointer" : "default", zIndex: 5 }} />
      <button aria-label="next" onClick={() => go(1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "20%", background: "transparent", border: "none", cursor: i < total - 1 ? "pointer" : "default", zIndex: 5 }} />

      {/* slide */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 9vw", justifyContent: slides[i].bg === RED ? "center" : "flex-start" }}>
        {slides[i].node}
      </div>

      {/* crest top-left */}
      <div className="flex items-center gap-2" style={{ position: "absolute", top: 28, left: "9vw", zIndex: 6 }}>
        <span className="font-display flex items-center justify-center text-white" style={{ width: 28, height: 28, borderRadius: 5, background: RED, fontSize: 12 }}>AFC</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: dark ? "rgba(255,255,255,0.6)" : "#9A9A9A" }}>ARSENAL WORLD CUP HUB</span>
      </div>

      {/* footer: dots + counter */}
      <div className="flex items-center justify-between" style={{ position: "absolute", bottom: 26, left: "9vw", right: "9vw", zIndex: 6 }}>
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button key={idx} aria-label={`slide ${idx + 1}`} onClick={() => setI(idx)} style={{ width: idx === i ? 22 : 8, height: 8, borderRadius: 100, border: "none", cursor: "pointer", background: idx === i ? RED : dark ? "rgba(255,255,255,0.3)" : "#D0D4DC", transition: "width 200ms ease" }} />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: dark ? "rgba(255,255,255,0.6)" : "#9A9A9A" }}>
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
