// tests/quote.test.ts
import { describe, it, expect } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, nativeAddress, WNATIVE_ADDRESS } from "sushi/evm";

describe("/quote", () => {
  const app = init();

  it("POST /quote/:chainId forwards raw body and returns success", async () => {
    const res = await app.request(`/quote/${EvmChainId.ARBITRUM}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tokenIn: nativeAddress,
        tokenOut: WNATIVE_ADDRESS[EvmChainId.ARBITRUM],
        amount: "1000000000000000000",
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("Success");
    expect(data.amountIn).toBe("1000000000000000000");
  });

  it("400 on invalid address", async () => {
    const res = await app.request(`/quote/${EvmChainId.ARBITRUM}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tokenIn: "horse", // invalid
        tokenOut: WNATIVE_ADDRESS[EvmChainId.ARBITRUM],
        amount: "1",
      }),
    });

    expect(res.status).toBe(400);
  });
});
