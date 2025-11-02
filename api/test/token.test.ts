import { describe, expect, it } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, SUSHI_ADDRESS } from "sushi/evm";

describe("/token", () => {
  const app = init();


  it("GET /tokens/:chainId/:tokenAddress returns token data", async () => {
    const res = await app.request(`/token/${EvmChainId.ETHEREUM}/${SUSHI_ADDRESS[EvmChainId.ETHEREUM].toLowerCase()}`);
    expect(res.status).toBe(200);
    const token = await res.json();
    expect(token.symbol).toBe("SUSHI");
  });

  it("400 on invalid chainId", async () => {
    const res = await app.request(`/token/x/${SUSHI_ADDRESS[EvmChainId.ETHEREUM].toLowerCase()}`);
    expect(res.status).toBe(400);
  });
});
