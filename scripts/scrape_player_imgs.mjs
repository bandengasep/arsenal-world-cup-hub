// Fetch Arsenal player pages via Bright Data Unlocker, extract headshot og:image,
// download the photo locally to public/players/<key>.jpg, and write data/player_img_urls.json.
// Run: node --env-file=.env.local scripts/scrape_player_imgs.mjs
import { writeFile } from "node:fs/promises";

const TOKEN = process.env.BRIGHTDATA_API_TOKEN;
const UNLOCKER = process.env.BRIGHTDATA_UNLOCKER_ZONE;
const EP = "https://api.brightdata.com/request";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";

const PLAYERS = [
  { key: "raya", slug: "david-raya" },
  { key: "saliba", slug: "william-saliba" },
  { key: "gabriel", slug: "gabriel" },
  { key: "hincapie", slug: "piero-hincapie" },
  { key: "odegaard", slug: "martin-odegaard" },
  { key: "rice", slug: "declan-rice" },
  { key: "zubimendi", slug: "martin-zubimendi" },
  { key: "merino", slug: "mikel-merino" },
  { key: "saka", slug: "bukayo-saka" },
  { key: "martinelli", slug: "gabriel-martinelli" },
  { key: "havertz", slug: "kai-havertz" },
  { key: "trossard", slug: "leandro-trossard" },
  { key: "gyokeres", slug: "viktor-gyokeres" },
  { key: "eze", slug: "eberechi-eze" },
  { key: "madueke", slug: "noni-madueke" },
];

const clean = (u) => u.replace(/&amp;/g, "&");

async function fetchPage(slug) {
  const url = `https://www.arsenal.com/men/players/${slug}`;
  const r = await fetch(EP, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ zone: UNLOCKER, url, format: "raw" }),
  });
  return { status: r.status, html: await r.text() };
}

function extractHeadshot(html) {
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (!og) return null;
  const ogUrl = clean(og[1]);
  const fileM = ogUrl.match(/images\/([^?]+\.(?:png|jpg|jpeg|webp))/i);
  if (fileM) {
    const file = fileM[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const big = html.match(new RegExp(`/sites/default/files/styles/large_16x9/public/images/${file}\\?[^"'\\s]*`, "i"));
    if (big) return clean("https://www.arsenal.com" + big[0]);
  }
  return ogUrl;
}

async function download(imgUrl, key) {
  const r = await fetch(imgUrl, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`img HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(`public/players/${key}.jpg`, buf);
  return buf.length;
}

const results = await Promise.all(
  PLAYERS.map(async (p) => {
    try {
      const { status, html } = await fetchPage(p.slug);
      if (status !== 200 || html.length < 5000) return { ...p, ok: false, why: `page HTTP ${status}` };
      const img = extractHeadshot(html);
      if (!img) return { ...p, ok: false, why: "no og:image" };
      const bytes = await download(img, p.key);
      return { ...p, ok: true, bytes, url: img };
    } catch (e) {
      return { ...p, ok: false, why: String(e.message || e) };
    }
  }),
);

const manifest = {};
for (const r of results) {
  if (r.ok) { manifest[r.key] = r.url; console.log(`✓ ${r.key.padEnd(11)} ${String(r.bytes).padStart(7)}b`); }
  else console.log(`✗ ${r.key.padEnd(11)} FAIL: ${r.why} (${r.slug})`);
}
await writeFile("data/player_img_urls.json", JSON.stringify(manifest, null, 2));
console.log(`\n${results.filter((r) => r.ok).length}/${PLAYERS.length} ok · manifest → data/player_img_urls.json`);
