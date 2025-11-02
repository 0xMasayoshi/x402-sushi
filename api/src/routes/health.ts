import { Hono } from "hono";
import { cors } from "hono/cors";

export const health = new Hono();

// CORS only for /health
health.use("/*", cors({ origin: "*" }));

health.get("/", (c) => c.json({ ok: true }));

// export mounted path from index.ts as app.route("/health", health)