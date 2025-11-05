import { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { API_URL } from "../config.js";
import { swapApiChainId } from "../utils/zod.js";
import { sz } from "sushi";

const priceParamSchema = z.object({
  chainId: swapApiChainId,
  tokenAddress: sz.evm.address()
})

type PriceParams = z.infer<typeof priceParamSchema>;

export const price = new Hono();

/**
 * POST /price
 * - returns price number for that token on chainId
 */
price.post("/", async (c) => {
  console.log('/price')
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
  const parsed = priceParamSchema.safeParse(rawBody);
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

  const { chainId, tokenAddress } = parsed.data;

  // construct upstream URL:
  //  - /price/v1/:chainId/:tokenAddress
  const u = `${API_URL.replace(/\/$/, "")}/price/v1/${chainId}/${tokenAddress}`;

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  console.log('returning', text)
  return c.newResponse(text, r.status as StatusCode);
});