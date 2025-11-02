import { describe, expect, it } from "vitest";
import { init } from "../src/app.js";
import { EvmChainId, MULTISIG_ADDRESS, nativeAddress, WNATIVE_ADDRESS } from "sushi/evm";

describe("/swap", () => {
  const app = init();

  it("GET /swap/:chainId returns route/tx", async () => {
    const url = `/swap/${EvmChainId.ETHEREUM}?tokenIn=${nativeAddress}&tokenOut=${WNATIVE_ADDRESS[EvmChainId.ETHEREUM]}&sender=${MULTISIG_ADDRESS[EvmChainId.ETHEREUM]}&amount=1000`;
    const res = await app.request(url);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("Success");
    expect(data.tx?.data).toMatch(/^0x[0-9a-fA-F]+$/);
  });

  it("400 on invalid address", async () => {
    const res = await app.request("/swap/42161?tokenIn=horse");
    expect(res.status).toBe(400);
  });
});
