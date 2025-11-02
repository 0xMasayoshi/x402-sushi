import { describe, expect, it } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, WNATIVE_ADDRESS } from "sushi/evm";

describe("/prices", () => {
  const app = init();

  it("GET /prices/:chainId returns a price map", async () => {
    const res = await app.request(`/price/${EvmChainId.ARBITRUM}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[WNATIVE_ADDRESS[EvmChainId.ARBITRUM].toLowerCase()]).greaterThan(0);
  });

  it("GET /prices/:chainId/:tokenAddress returns a number", async () => {
    const res = await app.request(`/price/${EvmChainId.ARBITRUM}/${WNATIVE_ADDRESS[EvmChainId.ARBITRUM].toLowerCase()}`);
    expect(res.status).toBe(200);
    const price = await res.json();
    expect(price).greaterThan(0);
  });
});
