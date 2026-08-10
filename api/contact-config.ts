import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Returnerar Web3Forms access key till klienten.
 * Nyckeln är avsedd att användas i webbläsaren (Web3Forms modell);
 * själva mejlskicket måste ske client-side pga Cloudflare på deras API.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metod ej tillåten." });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey || accessKey.startsWith("[")) {
    return res.status(500).json({ error: "Saknar WEB3FORMS_ACCESS_KEY." });
  }

  return res.status(200).json({ accessKey });
}
