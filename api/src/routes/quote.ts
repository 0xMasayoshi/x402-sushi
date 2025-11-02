import { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { sz } from 'sushi'
import z from "zod";
import { TransferValue } from "sushi/evm";
import { parseAddressList, parseDexList, swapApiChainId } from "../utils/zod.js";
import { API_URL } from "../config.js";

export const quote = new Hono();

const quoteParamsSchema = z.object({
  tokenIn: sz.evm.address(),
  tokenOut: sz.evm.address(),
  amount: z.coerce.bigint(),

  fee: z.coerce.number().min(0).max(0.5).default(0),
  feeBy: z.enum(TransferValue).default(TransferValue.Output),

  maxPriceImpact: z.coerce.number().positive().max(1).default(1),
  maxSlippage: z.coerce.number().gte(0).lt(1).default(0.005),

  onlyDEX: z.string().transform(parseDexList).default([]),
  onlyPools: z.string().transform(parseAddressList).default([]),
  excludeDEX: z.string().transform(parseDexList).default([]),
  excludePools: z.string().transform(parseAddressList).default([]),
  excludeTokens: z.string().transform(parseAddressList).default([]),

  includeRfq: z.coerce.boolean().default(false),
  visualize: z.coerce.boolean().default(false),
  debug: z.coerce.boolean().default(false),
  referrer: z.string().default("x402"),
});

type QuoteParams = z.infer<typeof quoteParamsSchema>;


const pathSchema = z.object({
    chainId: swapApiChainId
})

/**
 * GET /quote/:chainId
 * Validates with Zod (no transforms/defaults) and forwards the **raw** query to Sushi.
 */
quote.get("/:chainId", async (c) => {
  const p = pathSchema.safeParse(c.req.param());
  if (!p.success) return c.json({ error: p.error.format() }, 400);
  const { chainId } = p.data;

  const raw = c.req.query(); // Record<string, string>
  const v = quoteParamsSchema.safeParse(raw);
  if (!v.success) return c.json({ error: v.error.format() }, 400);

  const u = new URL(`${API_URL.replace(/\/$/, "")}/quote/v7/${chainId}`);

  // forward exact raw params (no renames; keep upstream casing like 'vizualize' if client sent it)
  for (const [k, v] of Object.entries(raw)) {
    if (v !== "") u.searchParams.set(k, v);
  }

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});