// Kimi K2.6 pre-flight — chat completion + tool-call round-trip (Moonshot OpenAI-compatible).
// Confirms the ⚠️ open items: base URL (.ai vs .cn), model slug, and that tool-calling works.
// Override defaults with MOONSHOT_BASE_URL / MOONSHOT_MODEL in .env.local if needed.
// Run: node --env-file=.env.local scripts/preflight/kimi.mjs
const KEY = process.env.MOONSHOT_API_KEY;
if (!KEY) { console.error('  ✗ missing MOONSHOT_API_KEY'); process.exit(1); }
const BASE = process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.ai/v1';
const MODEL = process.env.MOONSHOT_MODEL || 'kimi-k2.6';

const tools = [{
  type: 'function',
  function: { name: 'get_weather', description: 'Get current weather for a city',
    parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] } },
}];

const r = await fetch(`${BASE}/chat/completions`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: 'What is the weather in Paris? Use the tool.' }], tools, tool_choice: 'auto', max_tokens: 200 }),
});
const text = await r.text();
console.log(`Kimi (${BASE} | ${MODEL}) → HTTP ${r.status}`);
if (!r.ok) {
  console.log('  body:', text.slice(0, 400));
  console.log('  ⚠ try MOONSHOT_BASE_URL=https://api.moonshot.cn/v1 or a different slug; else fall back to Claude code-gen');
  process.exitCode = 1;
} else {
  const tc = JSON.parse(text).choices?.[0]?.message?.tool_calls;
  console.log(tc ? `  ✓ tool-calling works → ${tc[0]?.function?.name}(${tc[0]?.function?.arguments})`
                  : '  ⚠ replied but returned NO tool_calls — tool use may be unsupported on this slug');
}
