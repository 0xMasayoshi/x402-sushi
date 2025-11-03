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
 * POST /quote/:chainId
 * Validates with Zod (no transforms/defaults) and forwards the **raw** query to Sushi.
 */
quote.post("/:chainId", async (c) => {
  // validate path
  const p = pathSchema.safeParse(c.req.param());
  if (!p.success) return c.json({ error: p.error.format() }, 400);
  const { chainId } = p.data;

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
  const v = quoteParamsSchema.safeParse(rawBody);
  if (!v.success) return c.json({ error: v.error.format() }, 400);

  const u = new URL(`${API_URL.replace(/\/$/, "")}/quote/v7/${chainId}`);

  // forward exact raw keys as strings (no renames; preserve client casing)
  for (const [k, val] of Object.entries(rawBody)) {
    if (val === undefined || val === null || val === "") continue;
    // arrays -> comma-separated; bigint/number/boolean -> string
    if (Array.isArray(val)) {
      if (val.length > 0) u.searchParams.set(k, val.join(","));
    } else if (typeof val === "object") {
      // avoid sending objects (not supported upstream)
      u.searchParams.set(k, JSON.stringify(val));
    } else {
      u.searchParams.set(k, String(val));
    }
  }

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});