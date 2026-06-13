// Daytona pre-flight — run Python (print + matplotlib) and confirm a base64 chart comes back.
// Run: node --env-file=.env.local scripts/preflight/daytona.mjs
import { Daytona } from '@daytona/sdk';
const key = process.env.DAYTONA_API_KEY;
if (!key) { console.error('  ✗ missing DAYTONA_API_KEY'); process.exit(1); }

const code = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
print('hello from daytona')
plt.plot([1, 2, 3], [3, 1, 2]); plt.title('smoke'); plt.show()
`;

const daytona = new Daytona({ apiKey: key });
let sandbox;
try {
  sandbox = await daytona.create({ language: 'python', ephemeral: true, autoStopInterval: 5 });
  const res = await sandbox.process.codeRun(code);
  const stdout = res.artifacts?.stdout ?? res.result;
  const charts = (res.artifacts?.charts ?? []).filter((c) => c.png);
  console.log('Daytona → ran OK');
  console.log('  stdout:', String(stdout).trim());
  console.log(charts.length ? `  ✓ chart PNG returned (${charts[0].png.length} base64 chars)` : '  ✗ no chart PNG in artifacts');
  if (!charts.length) process.exitCode = 1;
} catch (e) {
  console.error('  ✗ Daytona error:', e.message);
  process.exitCode = 1;
} finally {
  if (sandbox) { await sandbox.delete(); console.log('  ✓ sandbox deleted (meter stopped)'); }
}
