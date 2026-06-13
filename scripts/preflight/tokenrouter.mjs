// TokenRouter pre-flight — auto:quality completion (routes to Claude via BYOK).
// Run: node --env-file=.env.local scripts/preflight/tokenrouter.mjs
const KEY = process.env.TOKENROUTER_API_KEY;
if (!KEY) { console.error('  ✗ missing TOKENROUTER_API_KEY'); process.exit(1); }
const BASE = process.env.TOKENROUTER_BASE_URL || 'https://api.tokenrouter.com/v1';
const MODEL = process.env.TOKENROUTER_MODEL || 'anthropic/claude-opus-4.8-fast';

const r = await fetch(`${BASE}/chat/completions`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: 'Reply with exactly: OK' }], max_tokens: 20 }),
});
const text = await r.text();
console.log(`TokenRouter (${MODEL}) → HTTP ${r.status}`);
if (!r.ok) {
  console.log('  body:', text.slice(0, 400));
  console.log('  ⚠ if this is a provider/credit error, confirm your Anthropic key is added in Console → Providers (BYOK)');
  process.exitCode = 1;
} else {
  const j = JSON.parse(text);
  console.log('  ✓ routed to:', j.model, '| reply:', j.choices?.[0]?.message?.content?.trim());
}
