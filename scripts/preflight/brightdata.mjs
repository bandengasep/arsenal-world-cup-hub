// Bright Data pre-flight — SERP zone (json) + Web Unlocker zone (markdown).
// Run: node --env-file=.env.local scripts/preflight/brightdata.mjs
const TOKEN = process.env.BRIGHTDATA_API_TOKEN;
const SERP = process.env.BRIGHTDATA_SERP_ZONE;
const UNLOCKER = process.env.BRIGHTDATA_UNLOCKER_ZONE;
const EP = 'https://api.brightdata.com/request';

const need = (name, v) => {
  if (!v) { console.error(`  ✗ missing ${name} in .env.local`); process.exitCode = 1; return false; }
  return true;
};

async function call(label, body) {
  const r = await fetch(EP, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  console.log(`${label} → HTTP ${r.status} (${text.length} bytes)`);
  if (!r.ok) { console.log('  body:', text.slice(0, 300)); process.exitCode = 1; }
  else console.log(`  ✓ ${label} zone works — sample: ${text.slice(0, 120).replace(/\s+/g, ' ')}`);
}

if (need('BRIGHTDATA_API_TOKEN', TOKEN)) {
  if (need('BRIGHTDATA_SERP_ZONE', SERP))
    await call('SERP', { zone: SERP, url: 'https://www.google.com/search?q=fifa+world+cup+2026+standings&brd_json=1', format: 'raw' });
  if (need('BRIGHTDATA_UNLOCKER_ZONE', UNLOCKER))
    await call('UNLOCKER', { zone: UNLOCKER, url: 'https://www.fifa.com/en/tournaments/mens/worldcup', format: 'raw', data_format: 'markdown' });
}
