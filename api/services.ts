import type { VercelRequest, VercelResponse } from "@vercel/node";

const FILE_PATH = "public/data/services.json";

type ServiceStatus = "available" | "unavailable" | "sold_out";

type ServiceOffer = {
  id: string;
  title: string;
  description: string;
  status: ServiceStatus;
};

const VALID_STATUS = new Set<ServiceStatus>([
  "available",
  "unavailable",
  "sold_out",
]);

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
    const services = req.body?.services as ServiceOffer[] | undefined;
    const action = String(req.body?.action ?? "");

    if (password !== requiredEnv("ADMIN_PASSWORD")) {
      return unauthorized(res);
    }

    if (action === "verify") {
      return res.status(200).json({ ok: true });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Ogiltig produktlista." });
    }

    for (const s of services) {
      if (!s || typeof s !== "object") {
        return res.status(400).json({ error: "Ogiltig produktrad." });
      }
      if (!s.id?.trim() || !s.title?.trim() || !s.description?.trim()) {
        return res
          .status(400)
          .json({ error: "Varje produkt behöver id, titel och beskrivning." });
      }
      if (!VALID_STATUS.has(s.status)) {
        return res.status(400).json({
          error:
            "Ogiltig status. Använd tillgänglig, ej tillgänglig eller slut.",
        });
      }
    }

    const token = requiredEnv("GITHUB_TOKEN");
    const owner = requiredEnv("GITHUB_OWNER");
    const repo = requiredEnv("GITHUB_REPO");
    const branch = process.env.GITHUB_BRANCH || "main";

    const normalized = services.map((s, i) => ({
      id: s.id.trim() || `s${i + 1}`,
      title: s.title.trim(),
      description: s.description.trim(),
      status: s.status,
    }));

    const contentObj = { services: normalized };
    const content = Buffer.from(
      `${JSON.stringify(contentObj, null, 2)}\n`,
      "utf8",
    ).toString("base64");

    const getRes = await githubRequest(
      `/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${encodeURIComponent(branch)}`,
      { method: "GET", token },
    );

    let sha: string | undefined;
    if (getRes.ok) {
      const current = (await getRes.json()) as { sha: string };
      sha = current.sha;
    } else if (getRes.status !== 404) {
      const text = await getRes.text();
      return res.status(502).json({
        error: "Kunde inte läsa filen från GitHub.",
        detail: text.slice(0, 300),
      });
    }

    const putRes = await githubRequest(
      `/repos/${owner}/${repo}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        token,
        body: JSON.stringify({
          message: "Uppdatera produktstatus",
          content,
          ...(sha ? { sha } : {}),
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
      services: normalized,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return res.status(500).json({ error: message });
  }
}
