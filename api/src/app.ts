import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { health } from "./routes/health.js";
import { paymentMiddleware } from "./middleware/payment.js";
import { price } from "./routes/price.js";
import { token } from "./routes/token.js";
import { quote } from "./routes/quote.js";
import { swap } from "./routes/swap.js";
import { PAYOUT_ADDRESS } from "./config.js";

export function init() {
    if (!PAYOUT_ADDRESS) throw new Error('PAYOUT_ADDRESS not set')

    const app = new Hono();

    // static
    app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));
    app.use("/og.png", serveStatic({ path: "./public/og.png" }));
    app.use("/", serveStatic({ path: "./public/index.html" }));

    // public
    app.route("/health", health);

    // Paid routes: apply payment middleware *only* to this group
    const paid = new Hono();

    if (process.env.NODE_ENV !== "test") {
        paid.use("*", paymentMiddleware(PAYOUT_ADDRESS));
    }

    paid.route("/quote", quote);
    paid.route("/swap", swap);
    paid.route("/price", price);
    paid.route("/token", token);
    app.route("/", paid);

    return app;
}