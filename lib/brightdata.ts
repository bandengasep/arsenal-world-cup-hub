// Bright Data — live web data. SERP zone (Google JSON) + Web Unlocker zone (markdown).
const EP = "https://api.brightdata.com/request";
const TOKEN = process.env.BRIGHTDATA_API_TOKEN;

async function callBrightData(body: Record<string, unknown>): Promise<{ ok: boolean; status: number; text: string }> {
  const r = await fetch(EP, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: r.ok, status: r.status, text: await r.text() };
}

/** Google SERP via Bright Data → compact ranked results string. */
export async function serpSearch(query: string): Promise<string> {
  if (!TOKEN) return "Bright Data not configured.";
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&brd_json=1`;
  const { ok, status, text } = await callBrightData({
    zone: process.env.BRIGHTDATA_SERP_ZONE,
    url,
    format: "raw",
  });
  if (!ok) return `Search failed (HTTP ${status}).`;
  try {
    const j = JSON.parse(text);
    const organic = j.organic ?? j.organic_results ?? [];
    if (Array.isArray(organic) && organic.length) {
      return organic
        .slice(0, 6)
        .map(
          (o: Record<string, string>, i: number) =>
            `${i + 1}. ${o.title ?? o.name ?? ""}\n   ${o.description ?? o.snippet ?? ""}\n   ${o.link ?? o.url ?? ""}`,
        )
        .join("\n");
    }
    // Answer box / knowledge panel fallback
    const ab = j.answer_box ?? j.knowledge ?? null;
    if (ab) return JSON.stringify(ab).slice(0, 1500);
    return JSON.stringify(j).slice(0, 1500);
  } catch {
    return text.slice(0, 1500);
  }
}

/** Fetch a page as markdown via the Web Unlocker zone. */
export async function unlock(url: string): Promise<string> {
  if (!TOKEN) return "Bright Data not configured.";
  const { ok, status, text } = await callBrightData({
    zone: process.env.BRIGHTDATA_UNLOCKER_ZONE,
    url,
    format: "raw",
    data_format: "markdown",
  });
  return ok ? text.slice(0, 4000) : `Fetch failed (HTTP ${status}).`;
}
