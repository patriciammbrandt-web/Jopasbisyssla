import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const MARKETS_FILE = path.resolve("public/data/markets.json");
const SERVICES_FILE = path.resolve("public/data/services.json");

function readJsonBody(req: import("http").IncomingMessage): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    } catch (err) {
      reject(err);
    }
  });
}

function sendJson(
  res: import("http").ServerResponse,
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

/** Lokal sparning till JSON under `npm run dev`. */
function cmsDevApi(): Plugin {
  return {
    name: "cms-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/markets", async (req, res, next) => {
        if (req.method === "GET") {
          sendJson(res, 200, { ok: true, mode: "dev" });
          return;
        }

        if (req.method !== "POST" && req.method !== "PUT") {
          next();
          return;
        }

        try {
          const body = (await readJsonBody(req)) as {
            password?: string;
            markets?: unknown;
            action?: string;
          };

          const expected = process.env.ADMIN_PASSWORD || "dev";
          if (body.password !== expected) {
            sendJson(res, 401, { error: "Fel lösenord." });
            return;
          }

          if (body.action === "verify") {
            sendJson(res, 200, { ok: true });
            return;
          }

          if (!Array.isArray(body.markets)) {
            sendJson(res, 400, { error: "Ogiltig marknadslista." });
            return;
          }

          const payload = { markets: body.markets };
          fs.writeFileSync(
            MARKETS_FILE,
            `${JSON.stringify(payload, null, 2)}\n`,
            "utf8",
          );

          sendJson(res, 200, {
            ok: true,
            message: "Sparat lokalt (dev). På Vercel sparas det till GitHub.",
            markets: body.markets,
          });
        } catch (err) {
          sendJson(res, 500, {
            error: err instanceof Error ? err.message : "Okänt fel",
          });
        }
      });

      server.middlewares.use("/api/services", async (req, res, next) => {
        if (req.method === "GET") {
          sendJson(res, 200, { ok: true, mode: "dev" });
          return;
        }

        if (req.method !== "POST" && req.method !== "PUT") {
          next();
          return;
        }

        try {
          const body = (await readJsonBody(req)) as {
            password?: string;
            services?: unknown;
            action?: string;
          };

          const expected = process.env.ADMIN_PASSWORD || "dev";
          if (body.password !== expected) {
            sendJson(res, 401, { error: "Fel lösenord." });
            return;
          }

          if (body.action === "verify") {
            sendJson(res, 200, { ok: true });
            return;
          }

          if (!Array.isArray(body.services)) {
            sendJson(res, 400, { error: "Ogiltig produktlista." });
            return;
          }

          const payload = { services: body.services };
          fs.writeFileSync(
            SERVICES_FILE,
            `${JSON.stringify(payload, null, 2)}\n`,
            "utf8",
          );

          sendJson(res, 200, {
            ok: true,
            message: "Sparat lokalt (dev). På Vercel sparas det till GitHub.",
            services: body.services,
          });
        } catch (err) {
          sendJson(res, 500, {
            error: err instanceof Error ? err.message : "Okänt fel",
          });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), cmsDevApi()],
  server: {
    port: 5173,
    open: true,
  },
});
