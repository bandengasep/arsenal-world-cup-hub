# Arsenal World Cup Hub — Design System (exported from Paper)

> Source of truth for the frontend build. Values exported directly from the Paper mock
> (artboard `2A-0`, file `01KTZKAXCEW5V3ZPX5B771Z84G`) via `get_jsx` / `get_computed_styles`.
> Matches arsenal.com's predominantly-light editorial look. **Do not eyeball from screenshots — these are the exact values.**

## 1. Color tokens

| Token | Hex | Role |
|---|---|---|
| `--white` | `#FFFFFF` | Base ground |
| `--ink` | `#10182E` | Primary text, navy bands, nation chip |
| `--black` | `#000000` | Max-contrast text (rare) |
| `--red` | `#E30613` | **Arsenal primary** — pills, LIVE badge, top-border, contributions |
| `--red-live` | `#F00000` | Live scores / hover / hero eyebrow |
| `--navy-2` | `#151925` | Band alt |
| `--navy-3` | `#19202F` | Band alt |
| `--gold` | `#BEAC88` | Gold hairline accent |
| `--divider` | `#E1E1E1` | Page dividers |
| `--card-border` | `#E6E6E6` | Card border |
| `--inner-divider` | `#EEEEEE` | In-card divider (above stat row) |
| `--photo-bg` | `#E9ECF1` | Headshot portrait background (matches arsenal studio bg) |
| `--muted-1` | `#4F4F4F` | Position label |
| `--muted-2` | `#7A7A7A` | Opponent label |
| `--muted-3` | `#9A9A9A` | Nav "WORLD CUP HUB" |
| `--muted-4` | `#8893A8` | Hero stat sub-labels |
| `--muted-5` | `#9AA3B2` | Empty contribution (`—`) |
| `--faint-number` | `rgba(16,24,46,0.13)` (`#10182E21`) | Big jersey watermark on photo |

**Badge state backgrounds:** LIVE `#E30613` (+ white pulse dot) · KO `#10182E` · FT `rgba(16,24,46,0.55)`. Non-live states hide the dot.

## 2. Type scale

**Display — `Anton`, weight 400, uppercase** (`font-family: "Anton", system-ui, sans-serif`). Anton lacks some diacritics (Ø, Ö, Ã, É, Í) — the `system-ui` fallback covers them; render names with correct accents.

| Use | size / line-height | tracking |
|---|---|---|
| Hero headline | 60px / 94% | — |
| Card jersey watermark | 64px / 100% | — |
| Stat strip number | 34px / 100% | — |
| Section header ("THE SQUAD") | 30px / 36px | 0.01em |
| Card player name | 23px / 90% | — |
| Brand "ARSENAL" | 22px / 28px | 0.01em |

**Body/UI — `Inter`** (`font-family: "Inter", system-ui, sans-serif`).

| Use | size / lh | weight | tracking |
|---|---|---|---|
| Hero eyebrow ("FIFA WORLD CUP 2026 · …") | 12px / 16px | 700 | 0.18em |
| Pill button ("ALL 15") | 12px / 16px | 700 | 0.03em |
| Stat strip sub-label | 11px / 14px | 600 | 0.12em |
| Brand "WORLD CUP HUB" | 11px / 14px | 600 | 0.14em |
| Position label | 12px / 16px | 600 | — |
| Nation chip code | 10px / 12px | 700 | 0.04em |
| LIVE/KO/FT badge text | 10px / 12px | 700 | 0.07em |
| Opponent ("vs SPAIN") | 11px / 14px | 500 | — |
| Contribution ("1G · 1A") | 11px / 14px | 700 | 0.02em |

## 3. Spacing, radii, layout

- **Radii:** card `8px` · badge `5px` · nation chip `3px` · pill/avatar `100px` · square corners elsewhere (6–8px).
- **Player card:** width `259px`; portrait `190px` (photo `object-fit: cover; object-position: 50% 16%`); info pad `14px 14px 13px`, internal `gap: 10px`; **top border `2px` solid red**; border `1px #E6E6E6`; `overflow: clip`.
- **Grid:** `display:flex; flex-wrap:wrap; gap:16px; width:100%` → **5 columns** on the 1440 artboard (content width 1360 = 5×259 + 4×16). 15 players = 3×5.
- **Stat strip:** numbers separated by `1px` vertical rules, `36px` tall.
- Page content max-width ≈ **1360px** (40px gutters on 1440).

## 4. Player card component (canonical)

Three states driven by `status: 'LIVE' | 'KO' | 'FT'`. Badge bg + dot + text vary; everything else constant.

```tsx
type PlayerStatus = 'LIVE' | 'KO' | 'FT';
interface PlayerCard {
  name: string;        // "BUKAYO SAKA" (uppercase, real accents)
  number: number;      // 7
  code: string;        // "ENG" (nation 3-letter)
  position: string;    // "FORWARD" | "MIDFIELDER" | "DEFENDER" | "GOALKEEPER"
  photo: string;       // /players/<key>.jpg
  status: PlayerStatus;
  badge: string;       // "LIVE 67'" | "KO 21:00" | "FT"
  opponent: string;    // "vs SPAIN"
  stat?: string;       // "1G · 1A" | "1G" | "1A" | undefined → render "—" muted
}

const BADGE_BG = { LIVE: '#E30613', KO: '#10182E', FT: 'rgba(16,24,46,0.55)' };
// LIVE shows a 6px white pulse dot; KO/FT hide it.
// stat present → color #E30613 (red); absent → "—" color #9AA3B2.
```

Structural reference (Saka / LIVE), exact inline styles from Paper:

```jsx
<div style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:8, overflow:'clip',
              display:'flex', flexDirection:'column', width:259 }}>
  {/* portrait */}
  <div style={{ position:'relative', height:190, background:'#E9ECF1', overflow:'clip', display:'flex' }}>
    <div style={{ position:'absolute', inset:0, backgroundImage:`url(${photo})`,
                  backgroundSize:'cover', backgroundPosition:'50% 16%' }} />        {/* photo, painted at back */}
    <div style={{ position:'absolute', top:6, right:14, fontFamily:'Anton', fontSize:64,
                  lineHeight:'100%', color:'rgba(16,24,46,0.13)' }}>{number}</div>   {/* jersey watermark */}
    <div style={{ position:'absolute', top:12, left:12, display:'flex', alignItems:'center', gap:6,
                  borderRadius:5, padding:'5px 9px', background:BADGE_BG[status] }}>  {/* status badge */}
      {status==='LIVE' && <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} />}
      <span style={{ fontFamily:'Inter', fontWeight:700, fontSize:10, lineHeight:'12px',
                     letterSpacing:'0.07em', color:'#fff' }}>{badge}</span>
    </div>
  </div>
  {/* info */}
  <div style={{ borderTop:'2px solid #E30613', display:'flex', flexDirection:'column', gap:10,
                padding:'14px 14px 13px' }}>
    <div style={{ fontFamily:'Anton', fontSize:23, lineHeight:'90%', color:'#10182E' }}>{name}</div>
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ background:'#10182E', borderRadius:3, padding:'3px 7px', fontFamily:'Inter',
                     fontWeight:700, fontSize:10, lineHeight:'12px', letterSpacing:'0.04em', color:'#fff' }}>{code}</span>
      <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:12, color:'#4F4F4F' }}>{position}</span>
    </div>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  borderTop:'1px solid #EEEEEE', paddingTop:10 }}>
      <span style={{ fontFamily:'Inter', fontWeight:500, fontSize:11, color:'#7A7A7A' }}>{opponent}</span>
      <span style={{ fontFamily:'Inter', fontWeight:700, fontSize:11, letterSpacing:'0.02em',
                     color: stat ? '#E30613' : '#9AA3B2' }}>{stat ?? '—'}</span>
    </div>
  </div>
</div>
```

> Layering note: in Paper, `z-index` is unreliable — the photo must be the **first DOM child** so the badge/number paint on top. In real CSS use `position:absolute; inset:0` for the photo (as above) or order children photo-first.

## 5. Page regions (Gunners Today)

1. **Top nav** (h 64, white, bottom hairline): crest tile (red `#E30613` rounded square, "AFC" Anton) + "ARSENAL" (Anton 22) + "WORLD CUP HUB" (Inter 11/600/0.14em `#9A9A9A`) · center tabs (GUNNERS TODAY active red, rest `#10182E`) · right: red "● n LIVE" chip + date `13 JUN 2026`.
2. **Hero** (navy `#10182E`, ~308 tall): red eyebrow (Inter 12/700/0.18em `#F00000`) → headline (Anton 60/94% white, two lines) → **stat strip**: number (Anton 34 white) over label (Inter 11/600/0.12em `#8893A8`), LIVE-NOW number in red; `1px` rules between.
3. **Squad section**: header "THE SQUAD" (Anton 30) + "n Gunners across n nations" (Inter 16 muted) · right filter pills (active = red fill `#E30613` white text, radius 100, pad `7px 14px`; inactive = white w/ border) · then the card grid.

## 6. Assets

- 15 headshots in `public/players/<key>.jpg` (arsenal.com `large_16x9`, ~1045×588).
- Remote source URLs (for re-fetch/refresh): `data/player_img_urls.json`.
- Scraper: `scripts/scrape_player_imgs.mjs` (Bright Data Unlocker → og:image → download).
- Keys: `raya, saliba, gabriel, hincapie, odegaard, rice, zubimendi, merino, saka, martinelli, havertz, trossard, gyokeres, eze, madueke`.
