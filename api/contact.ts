import type { VercelRequest, VercelResponse } from "@vercel/node";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function badRequest(res: VercelResponse, error: string) {
  return res.status(400).json({ error });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metod ej tillåten." });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return res.status(500).json({ error: "Saknar WEB3FORMS_ACCESS_KEY." });
  }

  const body = (req.body ?? {}) as ContactBody;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name) return badRequest(res, "Fyll i ditt namn.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest(res, "Ange en giltig e-postadress.");
  }
  if (message.length < 10) {
    return badRequest(res, "Skriv gärna några rader (minst 10 tecken).");
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: subject || "Meddelande från jopashonung.se",
        message,
        from_name: "Jopas Honung – webbformulär",
      }),
    });

    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || !data.success) {
      return res.status(502).json({
        error: data.message || "Kunde inte skicka meddelandet.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Kunde inte nå e-posttjänsten." });
  }
}
