// Gunners Today data model + demo-safety snapshot.
// The snapshot mirrors the approved Paper mock (all-states showcase) and is the
// guaranteed fallback when the live feed (Bright Data) is empty or errors.
// See docs/superpowers/specs/2026-06-13-arsenal-world-cup-hub-design.md §5b.

export type PlayerStatus = "LIVE" | "KO" | "FT";

export interface Gunner {
  key: string; // image key → /players/<key>.jpg
  name: string; // uppercase display name (with diacritics)
  number: number; // squad number
  code: string; // 3-letter nation code, e.g. ENG
  nation: string; // full nation name, e.g. England
  position: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD";
  status: PlayerStatus;
  badge: string; // "LIVE 67'" | "KO 21:00" | "FT"
  opponent: string; // "vs SPAIN"
  stat: string | null; // "1G · 1A" | "1G" | "1A" | null (→ render "—")
  captain?: boolean;
}

export interface HeroStats {
  players: number;
  nations: number;
  liveNow: number;
  goals: number;
  asOf: string;
  stage: string;
}

const p = (g: Omit<Gunner, "key"> & { key: string }): Gunner => g;

// Order = display order on the grid (matches the mock: LIVE block → KO → FT).
export const gunnersSnapshot: Gunner[] = [
  p({ key: "saka", name: "BUKAYO SAKA", number: 7, code: "ENG", nation: "England", position: "FORWARD", status: "LIVE", badge: "LIVE 67'", opponent: "vs SPAIN", stat: "1G · 1A" }),
  p({ key: "rice", name: "DECLAN RICE", number: 41, code: "ENG", nation: "England", position: "MIDFIELDER", status: "LIVE", badge: "LIVE 67'", opponent: "vs SPAIN", stat: "1G" }),
  p({ key: "eze", name: "EBERECHI EZE", number: 10, code: "ENG", nation: "England", position: "MIDFIELDER", status: "LIVE", badge: "LIVE 67'", opponent: "vs SPAIN", stat: null }),
  p({ key: "madueke", name: "NONI MADUEKE", number: 20, code: "ENG", nation: "England", position: "FORWARD", status: "LIVE", badge: "LIVE 67'", opponent: "vs SPAIN", stat: null }),
  p({ key: "raya", name: "DAVID RAYA", number: 22, code: "ESP", nation: "Spain", position: "GOALKEEPER", status: "LIVE", badge: "LIVE 67'", opponent: "vs ENGLAND", stat: null }),
  p({ key: "zubimendi", name: "MARTÍN ZUBIMENDI", number: 36, code: "ESP", nation: "Spain", position: "MIDFIELDER", status: "LIVE", badge: "LIVE 67'", opponent: "vs ENGLAND", stat: "1G" }),
  p({ key: "merino", name: "MIKEL MERINO", number: 23, code: "ESP", nation: "Spain", position: "MIDFIELDER", status: "LIVE", badge: "LIVE 67'", opponent: "vs ENGLAND", stat: "1A" }),
  p({ key: "gabriel", name: "GABRIEL MAGALHÃES", number: 6, code: "BRA", nation: "Brazil", position: "DEFENDER", status: "KO", badge: "KO 21:00", opponent: "vs GERMANY", stat: null }),
  p({ key: "martinelli", name: "GABRIEL MARTINELLI", number: 11, code: "BRA", nation: "Brazil", position: "FORWARD", status: "KO", badge: "KO 21:00", opponent: "vs GERMANY", stat: null }),
  p({ key: "havertz", name: "KAI HAVERTZ", number: 29, code: "GER", nation: "Germany", position: "FORWARD", status: "KO", badge: "KO 21:00", opponent: "vs BRAZIL", stat: null }),
  p({ key: "hincapie", name: "PIERO HINCAPIÉ", number: 18, code: "ECU", nation: "Ecuador", position: "DEFENDER", status: "KO", badge: "KO 18:00", opponent: "vs SENEGAL", stat: null }),
  p({ key: "odegaard", name: "MARTIN ØDEGAARD", number: 8, code: "NOR", nation: "Norway", position: "MIDFIELDER", status: "FT", badge: "FT", opponent: "vs MEXICO", stat: "1G", captain: true }),
  p({ key: "saliba", name: "WILLIAM SALIBA", number: 2, code: "FRA", nation: "France", position: "DEFENDER", status: "FT", badge: "FT", opponent: "vs CANADA", stat: null }),
  p({ key: "gyokeres", name: "VIKTOR GYÖKERES", number: 9, code: "SWE", nation: "Sweden", position: "FORWARD", status: "FT", badge: "FT", opponent: "vs SOUTH KOREA", stat: "1G" }),
  p({ key: "trossard", name: "LEANDRO TROSSARD", number: 19, code: "BEL", nation: "Belgium", position: "FORWARD", status: "FT", badge: "FT", opponent: "vs USA", stat: "1A" }),
];

export function deriveHeroStats(gunners: Gunner[]): HeroStats {
  const nations = new Set(gunners.map((g) => g.nation)).size;
  const liveNow = gunners.filter((g) => g.status === "LIVE").length;
  const goals = gunners.reduce((sum, g) => {
    const m = g.stat?.match(/(\d+)\s*G/);
    return sum + (m ? Number(m[1]) : 0);
  }, 0);
  return {
    players: gunners.length,
    nations,
    liveNow,
    goals,
    asOf: "13 JUN 2026",
    stage: "FIFA WORLD CUP 2026 · GROUP STAGE · MATCHDAY 3",
  };
}

// Notable verified absentees — narrative hooks (from data/arsenal_wc_squad.json).
export const absentees = [
  { name: "Jurriën Timber", nation: "Netherlands", reason: "Ruled out — groin injury" },
  { name: "Gabriel Jesus", nation: "Brazil", reason: "Omitted from final 26 (post-ACL)" },
  { name: "Riccardo Calafiori", nation: "Italy", reason: "Italy failed to qualify" },
  { name: "Christian Nørgaard", nation: "Denmark", reason: "Denmark failed to qualify" },
  { name: "Ben White", nation: "England", reason: "Stepped away from intl duty" },
];

export const photoFor = (key: string) => `/players/${key}.jpg`;
