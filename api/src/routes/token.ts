import { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { API_URL } from "../config.js";
import { sz } from "sushi";

export const token = new Hono();

const pathSchema = z.object({
  chainId: z.string().regex(/^\d+$/, "chainId must be a number"),
  tokenAddress: sz.evm.address(),
});

/**
 * GET /token/:chainId/:tokenAddress
 * Returns token data (proxying Sushi /token/v1/{chainId}/{tokenAddress})
 */
token.get("/:chainId/:tokenAddress", async (c) => {
  const parsed = pathSchema.safeParse(c.req.param());
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

  const { chainId, tokenAddress } = parsed.data;

  const u = new URL(
    `${API_URL.replace(/\/$/, "")}/token/v1/${chainId}/${tokenAddress}`
  );

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});
