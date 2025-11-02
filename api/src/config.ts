import { EvmChainId } from "sushi/evm"
import "dotenv/config"

export const API_URL = process.env.SUSHI_API_URL || "https://api.sushi.com"
export const PAYOUT_ADDRESS = process.env.PAYOUT_ADDRESS as `0x${string}`

export const API_SUPPORTED_CHAIN_IDS = [
  EvmChainId.ARBITRUM,
  EvmChainId.ARBITRUM_NOVA,
  EvmChainId.AVALANCHE,
  EvmChainId.BASE,
  EvmChainId.BOBA,
  EvmChainId.BOBA_BNB,
  EvmChainId.BSC,
  EvmChainId.BTTC,
  EvmChainId.CELO,
  EvmChainId.CORE,
  EvmChainId.ETHEREUM,
  EvmChainId.FANTOM,
  EvmChainId.FILECOIN,
  EvmChainId.GNOSIS,
  EvmChainId.HAQQ,
  EvmChainId.HARMONY,
  EvmChainId.KAVA,
  EvmChainId.LINEA,
  EvmChainId.METIS,
  EvmChainId.OPTIMISM,
  EvmChainId.POLYGON,
  EvmChainId.POLYGON_ZKEVM,
  EvmChainId.SCROLL,
  EvmChainId.THUNDERCORE,
  EvmChainId.ZETACHAIN,
  EvmChainId.CRONOS,
  EvmChainId.BLAST,
  EvmChainId.SKALE_EUROPA,
  EvmChainId.ROOTSTOCK,
  EvmChainId.MANTLE,
  EvmChainId.ZKSYNC_ERA,
  EvmChainId.MANTA,
  EvmChainId.MODE,
  EvmChainId.TAIKO,
  EvmChainId.ZKLINK,
  EvmChainId.APE,
  EvmChainId.SONIC,
  EvmChainId.HEMI,
  EvmChainId.KATANA,
  EvmChainId.HYPEREVM,
  EvmChainId.BERACHAIN,
  EvmChainId.SEPOLIA,
  EvmChainId.PLASMA,
  EvmChainId.FUSE,
] as const

export type ApiSupportedChainId =
  (typeof API_SUPPORTED_CHAIN_IDS)[number]

export const isApiSupportedChainId = (
  chainId: number,
): chainId is ApiSupportedChainId =>
  API_SUPPORTED_CHAIN_IDS.includes(chainId as ApiSupportedChainId)