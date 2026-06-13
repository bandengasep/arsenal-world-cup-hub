// Daytona — run Python in an ephemeral sandbox, capture stdout + matplotlib chart PNGs.
import { Daytona } from "@daytona/sdk";

export interface PyRun {
  stdout: string;
  charts: string[]; // base64 PNGs
  error?: string;
}

export async function runPython(code: string): Promise<PyRun> {
  const key = process.env.DAYTONA_API_KEY;
  if (!key) return { stdout: "", charts: [], error: "Daytona not configured" };

  const daytona = new Daytona({ apiKey: key });
  let sandbox;
  try {
    sandbox = await daytona.create({ language: "python", ephemeral: true, autoStopInterval: 5 });
    const res = await sandbox.process.codeRun(code);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const artifacts = (res as any).artifacts ?? {};
    const stdout = String(artifacts.stdout ?? (res as any).result ?? "");
    const charts: string[] = (artifacts.charts ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((c: any) => c?.png)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => c.png as string);
    return { stdout, charts };
  } catch (e) {
    return { stdout: "", charts: [], error: e instanceof Error ? e.message : String(e) };
  } finally {
    if (sandbox) {
      try {
        await sandbox.delete();
      } catch {
        /* meter best-effort */
      }
    }
  }
}
