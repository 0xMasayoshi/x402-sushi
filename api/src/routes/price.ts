import { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { API_URL } from "../config.js";
import { swapApiChainId } from "../utils/zod.js";
import { sz } from "sushi";

export const price = new Hono();

const chainIdParamSchema = z.object({
  chainId: swapApiChainId,
});
type ChainIdParams = z.infer<typeof chainIdParamSchema>;

/**
 * GET /price/:chainId
 * Returns prices map for a chainId
 */
price.get("/:chainId", async (c) => {
  const parsed = chainIdParamSchema.safeParse(c.req.param());
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

  const { chainId } = parsed.data;

  const u = new URL(`${API_URL.replace(/\/$/, "")}/price/v1/${chainId}`);

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});

const priceByTokenParamsSchema = z.object({
  chainId: swapApiChainId,
  tokenAddress: sz.evm.address(),
});
type PriceByTokenParams = z.infer<typeof priceByTokenParamsSchema>;

/**
 * GET /price/:chainId/:tokenAddress
 * Returns price number for a token on a chainId
 */
price.get("/:chainId/:tokenAddress", async (c) => {
  const parsed = priceByTokenParamsSchema.safeParse(c.req.param());
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

  const { chainId, tokenAddress } = parsed.data;

  const u = new URL(`${API_URL.replace(/\/$/, "")}/price/v1/${chainId}/${tokenAddress}`);

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});
