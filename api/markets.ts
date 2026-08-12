import type { VercelRequest, VercelResponse } from "@vercel/node";

const FILE_PATH = "public/data/markets.json";

type MarketEvent = {
  id: string;
  date: string;
  day: string;
  title: string;
  place: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Saknar miljövariabel: ${name}`);
  return value;
}

function unauthorized(res: VercelResponse) {
  return res.status(401).json({ error: "Fel lösenord." });
}

async function githubRequest(
  path: string,
  init: RequestInit & { token: string },
) {
  const { token, ...rest } = init;
  const response = await fetch(`https://api.github.com${path}`, {
    ...rest,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
  });
  return response;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "PUT" && req.method !== "POST") {
    return res.status(405).json({ error: "Metod ej tillåten." });
  }

  try {
    const password = String(req.body?.password ?? "");
    const markets = req.body?.markets as MarketEvent[] | undefined;
    const action = String(req.body?.action ?? "");

    if (password !== requiredEnv("ADMIN_PASSWORD")) {
      return unauthorized(res);
    }

    // Login-check only — does not write to GitHub.
    if (action === "verify") {
      return res.status(200).json({ ok: true });
    }

    if (!Array.isArray(markets)) {
      return res.status(400).json({ error: "Ogiltig marknadslista." });
    }

    for (const m of markets) {
      if (!m || typeof m !== "object") {
        return res.status(400).json({ error: "Ogiltig marknadsrad." });
      }
      if (!m.date?.trim() || !m.day?.trim() || !m.title?.trim() || !m.place?.trim()) {
        return res
          .status(400)
          .json({ error: "Alla fält måste fyllas i (datum, dag, titel, plats)." });
      }
    }

    const token = requiredEnv("GITHUB_TOKEN");
    const owner = requiredEnv("GITHUB_OWNER");
    const repo = requiredEnv("GITHUB_REPO");
    const branch = process.env.GITHUB_BRANCH || "main";

    const normalized = markets.map((m, i) => ({
      id: m.id?.trim() || `m${i + 1}`,
      date: m.date.trim(),
      day: m.day.trim(),
      title: m.title.trim(),
      place: m.place.trim(),
    }));

    const contentObj = { markets: normalized };
    const content = Buffer.from(
      `${JSON.stringify(contentObj, null, 2)}\n`,
      "utf8",
    ).toString("base64");

    const getRes = await githubRequest(
      `/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${encodeURIComponent(branch)}`,
      { method: "GET", token },
    );

    if (!getRes.ok) {
      const text = await getRes.text();
      return res.status(502).json({
        error: "Kunde inte läsa filen från GitHub.",
        detail: text.slice(0, 300),
      });
    }

    const current = (await getRes.json()) as { sha: string };
    const putRes = await githubRequest(
      `/repos/${owner}/${repo}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        token,
        body: JSON.stringify({
          message: "Uppdatera kommande marknader",
          content,
          sha: current.sha,
          branch,
        }),
      },
    );

    if (!putRes.ok) {
      const text = await putRes.text();
      return res.status(502).json({
        error: "Kunde inte spara till GitHub.",
        detail: text.slice(0, 300),
      });
    }

    return res.status(200).json({
      ok: true,
      message:
        "Sparat. Sajten uppdateras automatiskt inom någon minut via Vercel.",
      markets: normalized,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return res.status(500).json({ error: message });
  }
}
