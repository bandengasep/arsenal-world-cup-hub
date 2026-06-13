import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { SquadSection } from "@/components/SquadSection";
import { getGunnersToday } from "@/lib/feed";
import { absentees } from "@/lib/gunners";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const sp = await searchParams;
  const { gunners, stats, source } = await getGunnersToday({
    forceDemo: sp.demo === "1",
  });

  return (
    <>
      <SiteNav active="GUNNERS TODAY" liveNow={stats.liveNow} asOf={stats.asOf} />
      <main className="mx-auto w-full max-w-[1440px]">
        <Hero stats={stats} />
        <SquadSection gunners={gunners} />

        <footer className="px-10 pb-12 pt-2">
          <div style={{ borderTop: "1px solid #E1E1E1" }} className="pt-5">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9A9A9A" }}>
                NOT AT THE WORLD CUP
              </span>
              <span style={{ fontSize: 11, color: "#C4C4C4" }}>
                · {source === "live" ? "live via Bright Data" : "demo-safety snapshot"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {absentees.map((a) => (
                <span key={a.name} style={{ fontSize: 12, color: "#7A7A7A" }}>
                  <strong style={{ color: "#10182E", fontWeight: 600 }}>{a.name}</strong>{" "}
                  <span style={{ color: "#9A9A9A" }}>({a.nation})</span> — {a.reason}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
