import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const MARKETS_FILE = path.resolve("public/data/markets.json");

/** Lokal sparning till markets.json under `npm run dev`. */
function marketsDevApi(): Plugin {
  return {
    name: "markets-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/markets", async (req, res, next) => {
        if (req.method === "GET") {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, mode: "dev" }));
          return;
        }

        if (req.method !== "POST" && req.method !== "PUT") {
          next();
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
            password?: string;
            markets?: unknown;
          };

          const expected = process.env.ADMIN_PASSWORD || "dev";
          if (body.password !== expected) {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Fel lösenord." }));
            return;
          }

          if (!Array.isArray(body.markets)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Ogiltig marknadslista." }));
            return;
          }

          const payload = { markets: body.markets };
          fs.writeFileSync(
            MARKETS_FILE,
            `${JSON.stringify(payload, null, 2)}\n`,
            "utf8",
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: true,
              message: "Sparat lokalt (dev). På Vercel sparas det till GitHub.",
              markets: body.markets,
            }),
          );
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : "Okänt fel",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), marketsDevApi()],
  server: {
    port: 5173,
    open: true,
  },
});
