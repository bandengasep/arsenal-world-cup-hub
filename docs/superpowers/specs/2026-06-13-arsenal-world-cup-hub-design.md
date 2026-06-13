# Arsenal World Cup Hub — Design Spec & Session Handoff

> **Date:** 2026-06-13 · **Status:** design locked, pre-flight verified, **Paper mock complete + design tokens exported**. Next: build.
> This supersedes the pre-pivot plans at `~/.claude/plans/calm-snuggling-elephant.md` and
> `~/.claude/plans/curious-stirring-badger.md` for the **Arsenal** direction. The engine,
> sponsors, scaffold, and verified pre-flight configs below all carry forward.

---

## 0. RESUME HERE (read first after the folder rename)

The folder is being renamed `world-cup-hub` → **`Arsenal-World-Cup-Hub`**. Everything below lives
inside the folder and moves with it (incl. `.env.local` with real secrets, `node_modules/`,
smoke tests). To resume in a fresh session:

1. `cd ~/dev/Arsenal-World-Cup-Hub && claude`
2. Tell it: *"Read `docs/superpowers/specs/2026-06-13-arsenal-world-cup-hub-design.md` and continue."*
3. **Paper mock** (cloud, survives): file id **`01KTZKAXCEW5V3ZPX5B771Z84G`**, url
   https://app.paper.design/file/01KTZKAXCEW5V3ZPX5B771Z84G — reopen with `open_file`. Artboard
   `2A-0` = the Arsenal "Gunners Today" home (in progress); `1-0` = the obsolete amber mock (delete).
4. No git repo yet — **nothing pushed**. When created, name the GitHub repo `Arsenal-World-Cup-Hub`
   (public, identity `gh-personal` = the `bandengasep` account). `.gitignore` already protects
   `.env*` + `.envrc` (live Vercel token) — verify before first push.

---

## 1. Concept (pivoted)

**"The Gunners at the World Cup"** — a hub that tracks **Arsenal FC players competing for their
national teams at WC 2026**, skinned to match **arsenal.com**. Sharper and more relatable than a
generic WC hub. Engine + sponsors unchanged from the original plan; concept, design, and content
are Arsenal-specific.

**Content basis (verified):** 15 Arsenal players across 9 nations — see
`data/arsenal_wc_squad.json` (England 4: Saka, Rice, Eze, Madueke · Spain 3: Raya, Zubimendi,
Merino · Brazil 2: Gabriel Magalhães, Martinelli · France Saliba · Norway Ødegaard [captain] ·
Germany Havertz · Belgium Trossard · Sweden Gyökeres · Ecuador Hincapié). Notable verified
absentees (narrative hooks): Timber (injured-out), Gabriel Jesus (omitted), Calafiori (Italy DNQ),
Nørgaard (Denmark DNQ), Ben White (retired from intl).

---

## 2. Pre-flight — VERIFIED 5/5 (the engine works before feature code)

All keys are in `.env.local` (gitignored). Smoke tests in `scripts/preflight/*.mjs`
(`node --env-file=.env.local scripts/preflight/<x>.mjs`).

| Sponsor | Status | Verified config |
|---|---|---|
| **Bright Data** | ✅ | REST `POST https://api.brightdata.com/request`, `Authorization: Bearer <BRIGHTDATA_API_TOKEN>`. SERP zone **`world_cup_hub_02`** (`format:"raw"` + append `&brd_json=1` to the Google URL → JSON). Unlocker zone **`world_cup_hub_03`** (`format:"raw"`, `data_format:"markdown"`). Runtime key is limited (can use zones, not create them). |
| **Kimi K2.6** | ✅ tool-calling | Direct: `https://api.moonshot.ai/v1`, slug `kimi-k2.6`. ALSO available via TokenRouter (see below) — preferred. |
| **TokenRouter** | ✅ | Base **`https://api.tokenrouter.com/v1`** (`.com`, not `.io`!), key `sk-…`, **no BYOK**, unlimited quota. 98 models incl. `anthropic/claude-opus-4.8`, `moonshotai/kimi-k2.6`, `moonshotai/kimi-k2.7-code`. Model IDs are `provider/model`. Dashboard = the "production ops" demo artifact. |
| **Daytona** | ✅ | `@daytona/sdk` (renamed pkg). Ran Python + matplotlib, returned base64 chart PNG (`res.artifacts.charts[0].png`). Always `delete()` in `finally`; `ephemeral:true`, `autoStopInterval:5`. |
| **VideoDB** | ✅ | `videodb` JS SDK `connect({apiKey})` → `getCollection('default')` (id `c-703aca49-…`). Pre-ingest highlights via `scripts/ingest_highlights.py`; runtime = search+play only. |

**Model architecture (both model-sponsors load-bearing on every agent turn — all via TokenRouter):**
- **Agent brain** (orchestration + tool-calling): `moonshotai/kimi-k2.6`
- **Code-gen** (Oracle's Python for Daytona): `moonshotai/kimi-k2.7-code`
- **Fallback** (invisible, demo-safety only): `anthropic/claude-opus-4.8-fast`
- One OpenAI-compatible client → TokenRouter, swap `model` per task. `.env.local` has
  `TOKENROUTER_BASE_URL` + `TOKENROUTER_MODEL`.

---

## 3. Design system (matches arsenal.com — verified teardown)

**arsenal.com is predominantly LIGHT** (white base + red brand + navy "spotlight" bands).

- **Palette:** white `#FFFFFF` base · text `#10182E`/`#000` · Arsenal red `#E30613` (primary) ·
  `#F00000` (live scores / hover) · navy bands `#10182E` / `#151925` / `#19202F` ·
  gold hairline `#BEAC88` · dividers `#E1E1E1` · muted text `#7A7A7A`/`#4F4F4F`.
- **Type:** *Northbank* (custom, all-caps Art-Deco display) → **Anton** substitute (headlines,
  player names, big numbers, UPPERCASE). *Chapman* (body) → **Inter** (UI/body, 500–700). Oswald
  in reserve. Both Google Fonts, verified available in Paper.
- **Signature components:** fixture/info cards with a **2px red top border**; white **player
  cards** (portrait + Anton name + nation chip + position); **pill** buttons (red `#E30613`,
  radius 100px); navy feature bands for drama; mostly square corners (6–8px), pills/circles only
  for buttons/avatars; custom icon font / crest at nav left.
- **Mood:** bold, heritage, stadium-grand, editorial/broadcast, high-contrast, image-forward.

(Full teardown incl. exact CSS selectors: see the research output referenced in git history /
the workflow transcript. Key facts captured above.)

---

## 4. Modules (all five — confirmed scope)

1. **Gunners Today** (home) — player-first grid of the 15 Gunners (status badges: LIVE / kickoff /
   FT), navy hero with "15 PLAYERS · 9 NATIONS" stats, filters (All / In action / By nation).
   *Bright Data.* **Today's marquee: England vs Spain = 7 Gunners on one pitch.**
2. **Ask the Gunners Desk** — streaming chat; agent (Kimi via TokenRouter) + tools, with a visible
   tool-trace. *Kimi + TokenRouter + Bright Data.*
3. **Player Oracle** — pick a Gunner's nation/fixture → Kimi (`k2.7-code`) writes a Monte-Carlo sim
   → Daytona runs it → win-prob + the player's expected impact chart. *Kimi + Daytona.*
4. **Arsenal Goals** — VideoDB semantic search over pre-ingested clips → playable Gunner WC goals.
   *VideoDB.*
5. **Daily Gunners Briefing** — auto recap of Arsenal players' WC performances. *TokenRouter.*

**Demo floor** (if time runs short): Gunners Today + Ask + one Oracle sim = Bright Data + Kimi +
TokenRouter + Daytona visibly working. Goals + Briefing are stretch.

---

## 5. What's built so far

- Next.js 16 + React 19 + Tailwind v4 scaffold (App Router) merged into the folder; deps installed
  (`ai@6`, `@ai-sdk/react@3`, `@ai-sdk/openai-compatible@2`, `zod`, `@daytona/sdk`, `videodb`, `openai`).
- `.gitignore` hardened (`.env*`, `.envrc`, `.venv/`); `.env.example` committed; `.env.local` filled.
- `scripts/preflight/*.mjs` — all 5 smoke tests (green).
- `data/arsenal_wc_squad.json` — verified roster + demo-safety snapshot.
- **Paper mock COMPLETE** (artboard `2A-0`): top nav, navy hero + stat strip, squad header + filters,
  and the full **3×5 grid of all 15 Gunners** with real arsenal.com headshots, squad numbers, nation
  chips, positions, opponents, contributions, and a 3-state status badge (LIVE red+dot / KO navy /
  FT gray). Approved direction: keep as the **all-states showcase** (also the demo-safety fallback view).
- **Player-image pipeline:** `scripts/scrape_player_imgs.mjs` (Bright Data Unlocker → og:image →
  `large_16x9`) downloaded all 15 headshots to `public/players/<key>.jpg`; source URLs in
  `data/player_img_urls.json`. (Paper renders remote URLs only — `paper-asset://` local loads fail here.)
- **Design tokens exported** → `docs/design/arsenal-design-system.md` (exact colors, type scale,
  spacing, the canonical player-card component w/ 3 states, page-region specs). This is the build's
  source of truth.

## 5b. Demo data strategy — CONFIRMED 2026-06-13 (live-first + fallback)

Reality check: today is only ~2 days into the group stage (WC started 11 Jun). Many Gunners haven't
played yet, and a short demo window may have **zero** Arsenal players live. So the hub must never
depend on a live match being in progress. Three layers:

1. **Always-populated baseline (real data):** each card shows the player's **last result** *or*
   **next fixture** (both always exist from the real schedule via Bright Data). The grid is never
   empty or fabricated.
2. **LIVE is an opportunistic overlay** — the red badge + minute appears *only* when a match is
   genuinely in progress.
3. **Demo-safety snapshot fallback:** if Bright Data returns nothing/errors (or we want a
   guaranteed-impressive view), render the curated state from `data/arsenal_wc_squad.json`. A
   `?demo=1` (or env) toggle forces the showcase. **The Paper mock IS this fallback view.**

Plus: the other four modules (Ask, Oracle, Goals, Briefing) don't need live football and are
demoable any time — so even with no Gunner on the pitch, all five sponsors still visibly work.

## 6. Next steps

1. ~~Finish the Paper mock → export tokens.~~ **DONE** — see §5. (Showcase kept; real fixtures wired at build time.)
2. **Build the Next.js "Gunners Today" page** against `docs/design/arsenal-design-system.md`
   (Tailwind v4). ⚠️ Per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing Next.js code.
3. **Data layer:** live-first fetch (Bright Data SERP/Unlocker) → normalize to the card model →
   snapshot fallback (§5b). Last-result/next-fixture baseline + LIVE overlay.
4. Remaining build order: Ask agent (Kimi via TokenRouter + tool-trace) → Daytona+Kimi Oracle →
   VideoDB Goals → Briefing → README + rehearse.
5. Create public GitHub repo `Arsenal-World-Cup-Hub` (gh-personal) + deploy to Vercel.
