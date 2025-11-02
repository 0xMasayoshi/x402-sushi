import { isEvmAddress } from "sushi/evm";
import z from "zod";
import { isApiSupportedChainId } from "../config.js";

export function parseDexList(v: string): string[] {
  if (!v.length) return [];
  return v
    .toLowerCase()
    .split(",")
}

export function parseAddressList(v: string): `0x${string}`[] {
  if (!v.length) return [];
  return v
    .toLowerCase()
    .split(",")
    .filter((x) => isEvmAddress(x));
}

export const swapApiChainId = z
  .coerce
  .number()
  .int()
  .refine(isApiSupportedChainId, {
    message: "Unsupported chainId for /swap API",
  });