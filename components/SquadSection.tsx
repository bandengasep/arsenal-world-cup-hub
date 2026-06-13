"use client";

import { useMemo, useState } from "react";
import type { Gunner } from "@/lib/gunners";
import { PlayerCard } from "./PlayerCard";

type Filter = "ALL" | "IN ACTION" | "BY NATION";

const NATION_ORDER = ["England", "Spain", "Brazil", "France", "Norway", "Germany", "Belgium", "Sweden", "Ecuador"];

export function SquadSection({ gunners }: { gunners: Gunner[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const shown = useMemo(() => {
    if (filter === "IN ACTION") return gunners.filter((g) => g.status === "LIVE");
    if (filter === "BY NATION")
      return [...gunners].sort(
        (a, b) => NATION_ORDER.indexOf(a.nation) - NATION_ORDER.indexOf(b.nation),
      );
    return gunners;
  }, [filter, gunners]);

  const nations = new Set(shown.map((g) => g.nation)).size;

  const filters: Filter[] = ["ALL", "IN ACTION", "BY NATION"];
  const labelFor = (f: Filter) => (f === "ALL" ? `ALL ${gunners.length}` : f);

  return (
    <section className="px-10 py-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display" style={{ fontSize: 30, lineHeight: "36px", letterSpacing: "0.01em", color: "#10182E" }}>
            THE SQUAD
          </h2>
          <span style={{ fontSize: 15, color: "#7A7A7A" }}>
            {shown.length} Gunners across {nations} nations
          </span>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  borderRadius: 100,
                  padding: "7px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  background: active ? "#E30613" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#10182E",
                  border: active ? "1px solid #E30613" : "1px solid #E1E1E1",
                }}
              >
                {labelFor(f)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {shown.map((g) => (
          <PlayerCard key={g.key} g={g} />
        ))}
      </div>
    </section>
  );
}
