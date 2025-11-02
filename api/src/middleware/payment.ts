import { paymentMiddleware as _paymentMiddleware } from "x402-hono";
import { payai } from "facilitators";

export function paymentMiddleware(payoutAddress: `0x${string}`) {
  return _paymentMiddleware(
    payoutAddress,
    {
      "/quote": {
        price: "$0.005",
        network: "base",
        config: { description: "Aggregated swap quote" },
      },
      "/swap": {
        price: "$0.01",
        network: "base",
        config: { description: "Aggregated swap transaction" },
      },
      "/price/:chainId": {
        price: "$0.01",
        network: "base",
        config: { description: "Returns token prices for specified chain" },
      },
      "/price/:chainId/:tokenAddress": {
        price: "$0.005",
        network: "base",
        config: { description: "Returns price for a specific token" },
      },
      // "/token": {
      //   price: "$0.001",
      //   network: "base",
      //   config: { description: "On-chain token data" },
      // },
    },
    payai
  );
}
