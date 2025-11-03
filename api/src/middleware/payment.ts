import { paymentMiddleware as _paymentMiddleware } from "x402-hono";
import { payai } from "facilitators";

export function paymentMiddleware(payoutAddress: `0x${string}`) {
  return _paymentMiddleware(
    payoutAddress,
    {
      "/quote": {
        price: "$0.005",
        network: "base",
        config: {
          discoverable: true,
          description: "Aggregated swap quote",
          inputSchema: {
            bodyType: "json",
            bodyFields: {
              tokenIn: {
                type: "string",
                description: "Input token address (EVM address)",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: true
              },
              tokenOut: {
                type: "string",
                description: "Output token address (EVM address)",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: true
              },
              amount: {
                type: "string",
                description: "Amount in base units (wei, etc.)",
                pattern: "^[0-9]+$",
                required: true
              },
              fee: {
                type: "number",
                description: "Fee fraction (0–0.5)",
                minimum: 0,
                maximum: 0.5,
                default: 0
              },
              feeBy: {
                type: "string",
                description: "Indicates which side the fee applies to",
                enum: ["input", "output"],
                default: "output"
              },
              maxPriceImpact: {
                type: "number",
                description: "Maximum allowed price impact (0–1)",
                minimum: 0,
                maximum: 1,
                default: 1
              },
              maxSlippage: {
                type: "number",
                description: "Maximum slippage allowed (0–1)",
                minimum: 0,
                exclusiveMaximum: 1,
                default: 0.005
              },
              onlyDEX: {
                type: "string",
                description: "Comma-separated list of DEXes to include",
                default: ""
              },
              onlyPools: {
                type: "string",
                description: "Comma-separated list of pool addresses to include",
                default: ""
              },
              excludeDEX: {
                type: "string",
                description: "Comma-separated list of DEXes to exclude",
                default: ""
              },
              excludePools: {
                type: "string",
                description: "Comma-separated list of pool addresses to exclude",
                default: ""
              },
              excludeTokens: {
                type: "string",
                description: "Comma-separated list of token addresses to exclude",
                default: ""
              },
              includeRfq: {
                type: "boolean",
                description: "Whether to include RFQ quotes",
                default: false
              },
              visualize: {
                type: "boolean",
                description: "Whether to visualize the route",
                default: false
              },
              debug: {
                type: "boolean",
                description: "Enable debugging mode",
                default: false
              },
              referrer: {
                type: "string",
                description: "Referrer identifier",
                default: "x402"
              }
            },
            headerFields: {
              "content-type": {
                type: "string",
                description: "MIME type of the request body",
                default: "application/json"
              }
            }
          },
          outputSchema: {
            type: "object",
            additionalProperties: false,
            properties: {
              status: { type: "string", description: "Request status" },
              tokens: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    address: {
                      type: "string",
                      description: "Token contract address (0x… or native placeholder)",
                      pattern: "^0x[a-fA-F0-9]{40}$|^0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE$"
                    },
                    symbol: { type: "string" },
                    name: { type: "string" },
                    decimals: { type: "integer", minimum: 0 }
                  },
                  required: ["address", "symbol", "name", "decimals"]
                }
              },
              tokenFrom: { type: "integer", minimum: 0 },
              tokenTo: { type: "integer", minimum: 0 },
              swapPrice: { type: "number" },
              priceImpact: { type: "number" },
              amountIn: {
                type: "string",
                description: "Base units (wei, etc.)",
                pattern: "^[0-9]+$"
              },
              assumedAmountOut: {
                type: "string",
                description: "Base units (wei, etc.)",
                pattern: "^[0-9]+$"
              }
            },
            required: [
              "status",
              "tokens",
              "tokenFrom",
              "tokenTo",
              "swapPrice",
              "priceImpact",
              "amountIn",
              "assumedAmountOut"
            ],
            // keep both in case the library accepts one or the other
            example: {
              status: "Success",
              tokens: [
                {
                  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                  symbol: "ETH",
                  name: "Ether",
                  decimals: 18
                },
                {
                  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                  symbol: "WETH",
                  name: "Wrapped Ether",
                  decimals: 18
                },
                {
                  address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
                  symbol: "SUSHI",
                  name: "SushiToken",
                  decimals: 18
                }
              ],
              tokenFrom: 0,
              tokenTo: 2,
              swapPrice: 2837.6709246572527,
              priceImpact: -0.002204113661183449,
              amountIn: "10000000000000000",
              assumedAmountOut: "28376709246572527616"
            },
            examples: [
              {
                status: "Success",
                tokens: [
                  {
                    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    symbol: "ETH",
                    name: "Ether",
                    decimals: 18
                  },
                  {
                    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    symbol: "WETH",
                    name: "Wrapped Ether",
                    decimals: 18
                  },
                  {
                    address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
                    symbol: "SUSHI",
                    name: "SushiToken",
                    decimals: 18
                  }
                ],
                tokenFrom: 0,
                tokenTo: 2,
                swapPrice: 2837.6709246572527,
                priceImpact: -0.002204113661183449,
                amountIn: "10000000000000000",
                assumedAmountOut: "28376709246572527616"
              }
            ]
          }
        },
      },
      "/swap": {
        price: "$0.01",
        network: "base",
        config: {
          discoverable: true,
          description: "Aggregated swap transaction",
          inputSchema: {
            bodyType: "json",
            bodyFields: {
              tokenIn: {
                type: "string",
                description: "Input token address (EVM address)",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: true
              },
              tokenOut: {
                type: "string",
                description: "Output token address (EVM address)",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: true
              },
              sender: {
                type: "string",
                description: "Address of the wallet initiating the swap",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: true
              },
              recipient: {
                type: "string",
                description: "Recipient address (defaults to sender if omitted)",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: false
              },
              amount: {
                type: "string",
                description: "Swap amount in base units (wei, etc.)",
                pattern: "^[0-9]+$",
                required: true
              },
              fee: {
                type: "number",
                description: "Fee fraction (0–0.5)",
                minimum: 0,
                maximum: 0.5,
                default: 0
              },
              feeReceiver: {
                type: "string",
                description: "Address receiving the fee (required when fee > 0)",
                pattern: "^0x[a-fA-F0-9]{40}$",
                required: false
              },
              feeBy: {
                type: "string",
                description: "Indicates which side the fee applies to",
                enum: ["input", "output"],
                default: "output"
              },
              maxPriceImpact: {
                type: "number",
                description: "Maximum allowed price impact (0–1)",
                minimum: 0,
                maximum: 1,
                default: 1
              },
              maxSlippage: {
                type: "number",
                description: "Maximum slippage allowed (0–1)",
                minimum: 0,
                exclusiveMaximum: 1,
                default: 0.005
              },
              source: {
                type: "string",
                description: "Liquidity source for routing",
                enum: ["sender", "router"],
                default: "sender"
              },
              onlyDEX: {
                type: "string",
                description: "Comma-separated list of DEXes to include",
                default: ""
              },
              onlyPools: {
                type: "string",
                description: "Comma-separated list of pool addresses to include",
                default: ""
              },
              excludeDEX: {
                type: "string",
                description: "Comma-separated list of DEXes to exclude",
                default: ""
              },
              excludePools: {
                type: "string",
                description: "Comma-separated list of pool addresses to exclude",
                default: ""
              },
              excludeTokens: {
                type: "string",
                description: "Comma-separated list of token addresses to exclude",
                default: ""
              },
              includeRfq: {
                type: "boolean",
                description: "Whether to include RFQ quotes",
                default: false
              },
              visualize: {
                type: "boolean",
                description: "Whether to visualize the swap route",
                default: false
              },
              debug: {
                type: "boolean",
                description: "Enable debugging mode",
                default: false
              },
              referrer: {
                type: "string",
                description: "Referrer identifier",
                default: "x402"
              },
              simulate: {
                type: "boolean",
                description: "If true, simulate the transaction instead of executing",
                default: false
              },
              validate: {
                type: "boolean",
                description: "If true, perform validation checks before swap",
                default: false
              },
              override: {
                type: "boolean",
                description: "If true, bypass some safety limits (internal use)",
                default: false
              }
            },
            headerFields: {
              "content-type": {
                type: "string",
                description: "MIME type of the request body",
                default: "application/json"
              }
            }
          },
          outputSchema: {
            type: "object",
            additionalProperties: false,
            properties: {
              status: { type: "string", description: "Request status (e.g. Success)" },
              tokens: {
                type: "array",
                description: "Token metadata referenced by tokenFrom/tokenTo indices",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    address: { type: "string", description: "Token contract or native sentinel" },
                    symbol: { type: "string" },
                    name: { type: "string" },
                    decimals: { type: "integer", minimum: 0 }
                  },
                  required: ["address", "symbol", "name", "decimals"]
                }
              },
              tokenFrom: { type: "integer", minimum: 0, description: "Index into tokens[]" },
              tokenTo: { type: "integer", minimum: 0, description: "Index into tokens[]" },
              swapPrice: { type: "number", description: "Quoted price (tokenTo per tokenFrom)" },
              priceImpact: { type: "number", description: "Estimated price impact (-1..1)" },
              amountIn: {
                type: "string",
                description: "Input amount in base units",
                pattern: "^[0-9]+$"
              },
              assumedAmountOut: {
                type: "string",
                description: "Estimated output in base units",
                pattern: "^[0-9]+$"
              },
              tx: {
                type: "object",
                description: "Prepared transaction to execute the swap",
                additionalProperties: false,
                properties: {
                  from: {
                    description: "Sender address (may come as number in upstream payloads)",
                    oneOf: [
                      { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
                      { type: "number" }
                    ]
                  },
                  to: {
                    description: "Target contract/address (may come as number in upstream payloads)",
                    oneOf: [
                      { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
                      { type: "number" }
                    ]
                  },
                  gas: {
                    description: "Gas limit (decimal string)",
                    type: "string",
                    pattern: "^[0-9]+$"
                  },
                  gasPrice: {
                    description: "Gas price in wei (number)",
                    type: "number",
                    minimum: 0
                  },
                  data: {
                    description: "Calldata hex",
                    type: "string",
                    pattern: "^0x[0-9a-fA-F]*$"
                  },
                  value: {
                    description: "ETH value in wei (decimal string)",
                    type: "string",
                    pattern: "^[0-9]+$"
                  }
                },
                required: ["from", "to", "gas", "gasPrice", "data", "value"]
              }
            },
            required: [
              "status",
              "tokens",
              "tokenFrom",
              "tokenTo",
              "swapPrice",
              "priceImpact",
              "amountIn",
              "assumedAmountOut",
              "tx"
            ],
            example: {
              status: "Success",
              tokens: [
                {
                  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                  symbol: "ETH",
                  name: "Ether",
                  decimals: 18
                },
                {
                  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                  symbol: "WETH",
                  name: "Wrapped Ether",
                  decimals: 18
                },
                {
                  address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
                  symbol: "SUSHI",
                  name: "SushiToken",
                  decimals: 18
                }
              ],
              tokenFrom: 0,
              tokenTo: 2,
              swapPrice: 2837.6709246572527,
              priceImpact: -0.002204113661183449,
              amountIn: "10000000000000000",
              assumedAmountOut: "28376709246572527616",
              tx: {
                from: 1.2380129724542482e+48,
                to: 9.83650862853668e+47,
                gas: "162561",
                gasPrice: 682394289,
                data: "0x5f3bd1c8...0000", // truncated for readability
                value: "10000000000000000"
              }
            }
          }
        },
      },
      "/price": {
        price: "$0.01",
        network: "base",
        config: { description: "Returns token prices for specified chain with optional token address" },
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
