// tests/price.test.ts
import { describe, expect, it } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, WNATIVE_ADDRESS } from "sushi/evm";

describe("/price", () => {
  const app = init();

  it("POST /price (map) returns a price map", async () => {
    const res = await app.request(`/price`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chainId: EvmChainId.ARBITRUM,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[WNATIVE_ADDRESS[EvmChainId.ARBITRUM].toLowerCase()]).greaterThan(0);
  });

  it("POST /price (single) returns a number", async () => {
    const res = await app.request(`/price`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chainId: EvmChainId.ARBITRUM,
        tokenAddress: WNATIVE_ADDRESS[EvmChainId.ARBITRUM].toLowerCase(),
      }),
    });
    expect(res.status).toBe(200);
    const price = await res.json();
    expect(price).greaterThan(0);
  });
});
