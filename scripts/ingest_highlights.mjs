// Ingest Gunner goal-highlight videos into VideoDB (YouTube URL → index spoken words).
// Idempotent: skips videos already present (by title). Writes data/goals_index.json.
// Run: node --env-file=.env.local scripts/ingest_highlights.mjs
import { connect } from "videodb";
import { writeFile } from "node:fs/promises";

// WC2026 goals are fictional, so these are real Arsenal goal compilations as stand-ins.
// Swap in official @arsenal video URLs here as desired.
const TARGETS = [
  { key: "saka", player: "Bukayo Saka", url: "https://www.youtube.com/watch?v=CjXnBXQWNb0" },
  { key: "odegaard", player: "Martin Ødegaard", url: "https://www.youtube.com/watch?v=6Akx-R8qQBM" },
  { key: "martinelli", player: "Gabriel Martinelli", url: "https://www.youtube.com/watch?v=5z7z6kUZZ8E" },
];

const t0 = Date.now();
const el = () => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

const conn = connect({ apiKey: process.env.VIDEO_DB_API_KEY });
const coll = await conn.getCollection("default");
const existing = await coll.getVideos();
const existingNames = new Set(existing.map((v) => (v.meta?.name ?? v.name ?? "")));
console.log(`[${el()}] collection has ${existing.length} videos`);

const manifest = [];
for (const v of existing) manifest.push({ videoId: v.meta?.id ?? v.id, title: v.meta?.name ?? v.name });

for (const t of TARGETS) {
  const already = [...existingNames].some((n) => n && t.player.split(" ").pop() && n.toLowerCase().includes(t.player.split(" ").pop().toLowerCase()));
  if (already) {
    console.log(`[${el()}] skip ${t.player} (already ingested)`);
    continue;
  }
  try {
    console.log(`[${el()}] uploading ${t.player} …`);
    const video = await coll.uploadURL({ url: t.url });
    const id = video.meta?.id ?? video.id;
    const title = video.meta?.name ?? video.name;
    console.log(`[${el()}] uploaded ${t.player}: ${id} "${(title ?? "").slice(0, 50)}"`);
    await video.indexSpokenWords();
    console.log(`[${el()}] indexed ${t.player}`);
    manifest.push({ videoId: id, title, player: t.player });
  } catch (e) {
    console.log(`[${el()}] ERROR ${t.player}: ${e.message}`);
  }
}

await writeFile("data/goals_index.json", JSON.stringify({ collectionId: coll.meta?.id ?? coll.id, videos: manifest }, null, 2));
console.log(`[${el()}] DONE — ${manifest.length} videos in collection; manifest → data/goals_index.json`);
