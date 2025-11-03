import { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { API_URL } from "../config.js";
import { sz } from "sushi";
import { swapApiChainId } from "../utils/zod.js";

const tokenParamSchema = z.object({
  chainId: swapApiChainId,
  tokenAddress: sz.evm.address(),
});

export const token = new Hono();

/**
 * POST /token
 * Returns token data (proxying Sushi /token/v1/{chainId}/{tokenAddress})
 */
token.post("/", async (c) => {
  // read raw JSON body
  let rawBody: unknown;
  try {
    rawBody = await c.req.json();
  } catch {
    return c.json({ error: { _error: "Invalid JSON body" } }, 400);
  }
  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
    return c.json({ error: { _error: "Body must be a JSON object" } }, 400);
  }

  // validate against Zod schema
  const parsed = tokenParamSchema.safeParse(rawBody);
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

  const { chainId, tokenAddress } = parsed.data;

  const u = new URL(`${API_URL.replace(/\/$/, "")}/token/v1/${chainId}/${tokenAddress}`);

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});