// tests/swap.test.ts
import { describe, expect, it } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, MULTISIG_ADDRESS, nativeAddress, WNATIVE_ADDRESS } from "sushi/evm";

describe("/swap", () => {
  const app = init();

  it("POST /swap/:chainId returns route/tx", async () => {
    const res = await app.request(`/swap/${EvmChainId.ETHEREUM}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tokenIn: nativeAddress,
        tokenOut: WNATIVE_ADDRESS[EvmChainId.ETHEREUM],
        sender: MULTISIG_ADDRESS[EvmChainId.ETHEREUM],
        amount: "1000",
        // recipient omitted -> defaults to sender via schema transform
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("Success");
    expect(data.tx?.data).toMatch(/^0x[0-9a-fA-F]+$/);
  });

  it("400 on invalid address", async () => {
    const res = await app.request(`/swap/${EvmChainId.ARBITRUM}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tokenIn: "horse", // invalid
        tokenOut: WNATIVE_ADDRESS[EvmChainId.ARBITRUM],
        sender: MULTISIG_ADDRESS[EvmChainId.ARBITRUM],
        amount: "1",
      }),
    });

    expect(res.status).toBe(400);
  });
});
