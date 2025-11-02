import { serve } from "@hono/node-server";
import { init } from "./app.js";

const port = Number(process.env.PORT ?? 1337);

const app = init();

console.log(`[api] listening on :${port}`);
serve({ fetch: app.fetch, port });
