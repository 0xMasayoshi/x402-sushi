// tests/token.test.ts
import { describe, expect, it } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, SUSHI_ADDRESS } from "sushi/evm";

describe("/token", () => {
  const app = init();

  it("POST /token returns token data", async () => {
    const res = await app.request(`/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chainId: EvmChainId.ETHEREUM,
        tokenAddress: SUSHI_ADDRESS[EvmChainId.ETHEREUM].toLowerCase(),
      }),
    });
    expect(res.status).toBe(200);
    const token = await res.json();
    expect(token.symbol).toBe("SUSHI");
  });

  it("400 on invalid chainId", async () => {
    const res = await app.request(`/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chainId: "x",
        tokenAddress: SUSHI_ADDRESS[EvmChainId.ETHEREUM].toLowerCase(),
      }),
    });
    expect(res.status).toBe(400);
  });
});
