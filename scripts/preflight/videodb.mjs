// VideoDB pre-flight — verify auth + collection access (no slow ingest here;
// real ingest lives in scripts/ingest_highlights.py).
// Run: node --env-file=.env.local scripts/preflight/videodb.mjs
import { connect } from 'videodb';
const key = process.env.VIDEO_DB_API_KEY;
if (!key) { console.error('  ✗ missing VIDEO_DB_API_KEY'); process.exit(1); }

try {
  const conn = connect({ apiKey: key });
  const coll = await conn.getCollection('default');
  console.log('VideoDB → ✓ connected; default collection id:', coll?.id ?? coll?.meta?.id ?? '(ok)');
  console.log('  (full ingest happens in scripts/ingest_highlights.py — not part of smoke)');
} catch (e) {
  console.error('  ✗ VideoDB error:', e.message);
  process.exitCode = 1;
}
