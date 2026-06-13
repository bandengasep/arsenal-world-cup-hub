// Gunners Today feed — live-first with demo-safety snapshot fallback (spec §5b).
import { gunnersSnapshot, deriveHeroStats, type Gunner, type HeroStats } from "./gunners";

export type FeedSource = "live" | "snapshot";

export interface GunnersFeed {
  gunners: Gunner[];
  stats: HeroStats;
  source: FeedSource;
}

function finalize(gunners: Gunner[], source: FeedSource): GunnersFeed {
  return { gunners, stats: deriveHeroStats(gunners), source };
}

/**
 * Live fetch via Bright Data (SERP/Unlocker). Returns null when unavailable so the
 * caller falls back to the snapshot. Wired in the live-data-layer task; the demo is
 * safe regardless because the snapshot always renders.
 */
async function fetchLiveGunners(): Promise<Gunner[] | null> {
  // TODO(task 5): normalize Bright Data results → Gunner[] (last-result/next-fixture
  // baseline + LIVE overlay). Until then, return null → snapshot.
  return null;
}

export async function getGunnersToday(opts?: { forceDemo?: boolean }): Promise<GunnersFeed> {
  if (!opts?.forceDemo) {
    try {
      const live = await fetchLiveGunners();
      if (live && live.length >= 8) return finalize(live, "live");
    } catch {
      // fall through to snapshot
    }
  }
  return finalize(gunnersSnapshot, "snapshot");
}
