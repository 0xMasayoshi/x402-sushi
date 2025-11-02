import { sz } from "sushi";
import z from "zod";
import { RouterLiquiditySource, TransferValue } from "sushi/evm";
import { parseAddressList, parseDexList, swapApiChainId } from "../utils/zod.js";
import { Hono } from "hono";
import { API_URL } from "../config.js";
import { StatusCode } from "hono/utils/http-status";

export const swap = new Hono();

export const swapParamsSchema = z
  .object({
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
    visualize: z.coerce.boolean().default(false), // keep key as-is; upstream may expect 'vizualize' if client sends it
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

export type SwapParams = z.infer<typeof swapParamsSchema>;

const pathSchema = z.object({
  chainId: swapApiChainId,
});

/**
 * GET /swap/:chainId
 * - Validates query via swapParamsSchema
 * - Forwards the **raw** query (no renames) to Sushi /swap/v7/:chainId
 */
swap.get("/:chainId", async (c) => {
  // validate :chainId from path
  const p = pathSchema.safeParse(c.req.param());
  if (!p.success) return c.json({ error: p.error.format() }, 400);
  const { chainId } = p.data;

  // validate query (but we'll forward the original raw)
  const raw = c.req.query(); // Record<string, string>
  const v = swapParamsSchema.safeParse(raw);
  if (!v.success) return c.json({ error: v.error.format() }, 400);

  const u = new URL(`${API_URL.replace(/\/$/, "")}/swap/v7/${chainId}`);

  // forward exact raw params; do not change keys (e.g. if client sends 'vizualize')
  for (const [k, val] of Object.entries(raw)) {
    if (val !== "") u.searchParams.set(k, val);
  }

  const r = await fetch(u, { cache: "no-store" });
  const text = await r.text();
  const ct = r.headers.get("content-type") ?? "application/json";
  c.header("content-type", ct);
  return c.newResponse(text, r.status as StatusCode);
});
