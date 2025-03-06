import SolarIcon from "../assets/chain/Solar.svg";
import ArbitrumIcon from "../assets/chain/Arbitrum.svg";
import AvalancheIcon from "../assets/chain/Avalanche.svg";
import BinanceIcon from "../assets/chain/Binance.svg";
import BitcoinIcon from "../assets/chain/Bitcoin.svg";
import EthereumIcon from "../assets/chain/Ethereum.svg";
import OptimismIcon from "../assets/chain/Optimism.svg";
import PolygonIcon from "../assets/chain/Polygon.svg";
import SolanaIcon from "../assets/chain/Solana.svg";

import { ISupportChain } from "../types/ChainTypes";
import {
  CONFIG_ARB_RPC_URL,
  CONFIG_ARB_SCAN,
  CONFIG_AVAX_RPC_URL,
  CONFIG_AVAX_SCAN,
  CONFIG_BSC_RPC_URL,
  CONFIG_BSC_SCAN,
  CONFIG_ETH_RPC_URL,
  CONFIG_ETH_SCAN,
  CONFIG_OP_RPC_URL,
  CONFIG_OPT_SCAN,
  CONFIG_POL_RPC_URL,
  CONFIG_POL_SCAN,
} from "../config/MainConfig";

export const CONST_CHAIN_IDS = {
  ETHEREUM: 1,
  BINANCE: 56,
  POLYGON: 137,
  AVALANCHE: 43114,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BITCOIN: 0,
  SOLANA: 0,
  SOLAR: 0,
};

export const CONST_CHAIN_HEX_IDS = {
  ETHEREUM: "0x01",
  BINANCE: "0x38",
  POLYGON: "0x89",
  AVALANCHE: "0xA86A",
  ARBITRUM: "0xA4B1",
  OPTIMISM: "0xA",
};

export const CONST_CHAIN_NAMES = {
  ETHEREUM: "Ethereum",
  BINANCE: "Binance Smart Chain",
  POLYGON: "Polygon",
  AVALANCHE: "Avalanche C-Chain",
  ARBITRUM: "Arbitrum One",
  OPTIMISM: "Optimism",
  BITCOIN: "Bitcoin",
  SOLANA: "Solana",
  SOLAR: "Solar Blockchain",
};

export const CONST_CHAIN_ID_TO_NAME = new Map([
  ["1", "ETHEREUM"],
  ["56", "BINANCE"],
  ["137", "POLYGON"],
  ["43114", "AVALANCHE"],
  ["42161", "ARBITRUM"],
  ["10", "OPTIMISM"],
]);

export const CONST_CHAIN_NATIVE_CURRENCY = {
  ETHEREUM: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  BINANCE: {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
  },
  POLYGON: {
    name: "Polygon (formerly MATIC)",
    symbol: "MATIC",
    decimals: 18,
  },
  AVALANCHE: {
    name: "Ether (on Optimism)",
    symbol: "ETH",
    decimals: 18,
  },
  ARBITRUM: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  OPTIMISM: {
    name: "Ether (on Arbitrum)",
    symbol: "ETH",
    decimals: 18,
  },
};

export const CONST_CHAIN_RPC_URLS = {
  ETHEREUM: CONFIG_ETH_RPC_URL,
  BINANCE: CONFIG_BSC_RPC_URL,
  POLYGON: CONFIG_POL_RPC_URL,
  AVALANCHE: CONFIG_AVAX_RPC_URL,
  ARBITRUM: CONFIG_ARB_RPC_URL,
  OPTIMISM: CONFIG_OP_RPC_URL,
};

export const CONST_CHAIN_BLOCK_EXPLORER = {
  ETHEREUM: CONFIG_ETH_SCAN,
  BINANCE: CONFIG_BSC_SCAN,
  POLYGON: CONFIG_POL_SCAN,
  AVALANCHE: CONFIG_AVAX_SCAN,
  ARBITRUM: CONFIG_ARB_SCAN,
  OPTIMISM: CONFIG_OPT_SCAN,
};

export const CONST_CHAIN_ICONS = {
  ETHEREUM: EthereumIcon,
  BINANCE: BinanceIcon,
  POLYGON: PolygonIcon,
  AVALANCHE: AvalancheIcon,
  ARBITRUM: ArbitrumIcon,
  OPTIMISM: OptimismIcon,
  BITCOIN: BitcoinIcon,
  SOLANA: SolanaIcon,
  SOLAR: SolarIcon,
};

export const CONST_CHAIN_SYMBOLS = {
  ETHEREUM: "ETH",
  BINANCE: "BNB",
  POLYGON: "MATIC",
  AVALANCHE: "AVAX",
  ARBITRUM: "ARBETH",
  OPTIMISM: "OETH",
  BITCOIN: "BTC",
  SOLANA: "SOL",
  SOLAR: "SXP",
};

export const CONST_SUPPORT_CHAINS: ISupportChain[] = [
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.SOLAR,
      name: CONST_CHAIN_NAMES.SOLAR,
      key: "sxp",
      decimals: 8,
      logo: CONST_CHAIN_ICONS.SOLAR,
      website: "https://solar.org/",
      chainId: 0,
      cmc: "swipe",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.BINANCE,
      name: CONST_CHAIN_NAMES.BINANCE,
      key: "smartchain",
      decimals: 18,
      // logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
      logo: CONST_CHAIN_ICONS.BINANCE,
      website: null,
      chainId: 56,
      cmc: "binancecoin",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.ETHEREUM,
      name: CONST_CHAIN_NAMES.ETHEREUM,
      key: "ethereum",
      decimals: 18,
      // logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/info/logo.png",
      logo: CONST_CHAIN_ICONS.ETHEREUM,
      website: "https://ethereum.org/",
      chainId: 1,
      cmc: "ethereum",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.BITCOIN,
      name: CONST_CHAIN_NAMES.BITCOIN,
      key: "bitcoin",
      decimals: 8,
      // logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029",
      logo: CONST_CHAIN_ICONS.BITCOIN,
      website: "https://bitcoin.org/",
      chainId: 0,
      cmc: "bitcoin",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.SOLANA,
      name: CONST_CHAIN_NAMES.SOLANA,
      key: "solana",
      decimals: 9,
      // logo: "https://cryptologos.cc/logos/solana-sol-logo.png?v=029",
      logo: CONST_CHAIN_ICONS.SOLANA,
      website: "https://solana.com/",
      chainId: 0,
      cmc: "solana",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.POLYGON,
      name: CONST_CHAIN_NAMES.POLYGON,
      key: "polygon",
      decimals: 18,
      // logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      logo: CONST_CHAIN_ICONS.POLYGON,
      website: "https://polygon.technology/solutions/polygon-pos/",
      chainId: 137,
      cmc: "matic-network",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.AVALANCHE,
      name: CONST_CHAIN_NAMES.AVALANCHE,
      key: "avalanchec",
      decimals: 18,
      // logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
      logo: CONST_CHAIN_ICONS.AVALANCHE,
      website: "http://avax.network",
      chainId: 43114,
      cmc: "avalanche-2",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.ETHEREUM, // ARBETH is not correct for cmc symbol
      name: CONST_CHAIN_NAMES.ARBITRUM,
      key: "arbitrum",
      decimals: 18,
      // logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=029",
      logo: CONST_CHAIN_ICONS.ARBITRUM,
      website: "https://offchainlabs.com",
      chainId: 42161,
      cmc: "arbitrum",
    },
    tokens: [],
  },
  {
    native: {
      address: "",
      symbol: CONST_CHAIN_SYMBOLS.OPTIMISM,
      name: CONST_CHAIN_NAMES.OPTIMISM,
      key: "optimism",
      decimals: 18,
      // logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029",
      logo: CONST_CHAIN_ICONS.OPTIMISM,
      website: "https://www.optimism.io/",
      chainId: 10,
      cmc: "optimism",
    },
    tokens: [],
  },
];
