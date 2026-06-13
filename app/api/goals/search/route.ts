import { connect } from "videodb";

export const runtime = "nodejs";
export const maxDuration = 60;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "goal";
  if (!process.env.VIDEO_DB_API_KEY) {
    return Response.json({ query: q, playerUrl: null, shots: [], count: 0, error: "VideoDB not configured" });
  }
  try {
    const conn = connect({ apiKey: process.env.VIDEO_DB_API_KEY });
    const coll = await conn.getCollection("default");
    const res: any = await coll.search(q);

    const shots = (res?.shots ?? []).slice(0, 8).map((s: any) => ({
      start: s.start ?? s.startTime,
      end: s.end ?? s.endTime,
      text: s.text ?? "",
      videoId: s.videoId ?? s.video_id ?? null,
    }));

    let playerUrl: string | null = res?.playerUrl ?? null;
    if (!playerUrl && typeof res?.compile === "function") {
      try {
        playerUrl = await res.compile();
      } catch {
        /* compile unavailable */
      }
    }

    return Response.json({ query: q, playerUrl, shots, count: shots.length, error: null });
  } catch (e) {
    return Response.json({
      query: q,
      playerUrl: null,
      shots: [],
      count: 0,
      error: e instanceof Error ? e.message : "search failed",
    });
  }
}
