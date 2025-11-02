import { describe, it, expect } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, nativeAddress, WNATIVE_ADDRESS } from "sushi/evm";

describe("/quote", () => {
  const app = init();

  it("GET /quote/:chainId forwards raw query and returns success", async () => {
    const url = `/quote/${EvmChainId.ARBITRUM}?tokenIn=${nativeAddress}&tokenOut=${WNATIVE_ADDRESS[EvmChainId.ARBITRUM]}&amount=1000000000000000000`;
    const res = await app.request(url);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("Success");
    expect(data.amountIn).toBe("1000000000000000000");
  });

  it("400 on invalid address", async () => {
    const res = await app.request("/quote/42161?tokenIn=horse");
    expect(res.status).toBe(400);
  });
});
