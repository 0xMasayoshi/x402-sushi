import { sz } from "sushi";
import z from "zod";
import { RouterLiquiditySource, TransferValue } from "sushi/evm";
import { parseAddressList, parseDexList, swapApiChainId } from "../utils/zod.js";
import { Hono } from "hono";
import { API_URL } from "../config.js";
import { StatusCode } from "hono/utils/http-status";

const swapParamSchema = z
  .object({
    chainId: swapApiChainId,
    tokenIn: sz.evm.address(),
    tokenOut: sz.evm.address(),
    sender: sz.evm.address(),
    recipient: sz.evm.address().optional(),
    amount: z.coerce.bigint(),

    fee: z.coerce.number().min(0).max(0.5).default(0),
    feeReceiver: sz.evm.address().optional(),
    feeBy: z.enum(TransferValue).default(TransferValue.Output),

    maxPriceImpact: z.coerce.number().positive().max(1).default(1),
    maxSlippage: z.coerce.number().min(0).lt(1).default(0.005),

    source: z.enum(RouterLiquiditySource).default(RouterLiquiditySource.Sender),

    onlyDEX: z.string().transform(parseDexList).default([]),
    onlyPools: z.string().transform(parseAddressList).default([]),
    excludeDEX: z.string().transform(parseDexList).default([]),
    excludePools: z.string().transform(parseAddressList).default([]),
    excludeTokens: z.string().transform(parseAddressList).default([]),

    includeRfq: z.coerce.boolean().default(false),
    visualize: z.coerce.boolean().default(false),
    debug: z.coerce.boolean().default(false),
    referrer: z.string().default("x402"),
    simulate: z.coerce.boolean().default(false),
    validate: z.coerce.boolean().default(false),
    override: z.coerce.boolean().default(false),
  })
  .transform((q) => ({
    ...q,
    recipient: q.recipient ?? q.sender,
  }))
  .superRefine((q, ctx) => {
    if (q.fee > 0 && !q.feeReceiver) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "feeReceiver is required when fee > 0",
        path: ["feeReceiver"],
      });
    }
    if (q.feeReceiver && q.fee <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fee must be set when feeReceiver is provided",
        path: ["fee"],
      });
    }
  });

type SwapParams = z.infer<typeof swapParamSchema>;

export const swap = new Hono();

/**
 * POST /swap/
 * - Validates query via swapParamsSchema
 * - Forwards the **raw** query (no renames) to Sushi /swap/v7/:chainId
 */
swap.post("/", async (c) => {
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
  const v = swapParamSchema.safeParse(rawBody);
  if (!v.success) return c.json({ error: v.error.format() }, 400);

  const {chainId} = v.data

  const u = new URL(`${API_URL.replace(/\/$/, "")}/swap/v7/${chainId}`);

  // forward exact raw keys as strings (no renames; preserve client casing)
  for (const [k, val] of Object.entries(rawBody)) {
    if (k === "chainId") continue;
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
  u.searchParams.set('referrer', 'x402')

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});
