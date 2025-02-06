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

export class CONST_CHAIN_IDS {
  static ETHEREUM = 1;
  static BINANCE = 56;
  static POLYGON = 137;
  static AVALANCHE = 43114;
  static ARBITRUM = 42161;
  static OPTIMISM = 10;
  static BITCOIN = 0;
  static SOLANA = 0;
  static SOLAR = 0;
}

export class CONST_CHAIN_ICONS {
  static ETHEREUM = EthereumIcon;
  static BINANCE = BinanceIcon;
  static POLYGON = PolygonIcon;
  static AVALANCHE = AvalancheIcon;
  static ARBITRUM = ArbitrumIcon;
  static OPTIMISM = OptimismIcon;
  static BITCOIN = BitcoinIcon;
  static SOLANA = SolanaIcon;
  static SOLAR = SolarIcon;
}

export class CONST_CHAIN_NAMES {
  static ETHEREUM = "Ethereum";
  static BINANCE = "Binance Smart Chain";
  static POLYGON = "Polygon";
  static AVALANCHE = "Avalanche C-Chain";
  static ARBITRUM = "Arbitrum One";
  static OPTIMISM = "Optimism";
  static BITCOIN = "Bitcoin";
  static SOLANA = "Solana";
  static SOLAR = "Solar Blockchain";
}

export class CONST_CHAIN_SYMBOLS {
  static ETHEREUM = "ETH";
  static BINANCE = "BNB";
  static POLYGON = "MATIC";
  static AVALANCHE = "AVAX";
  static ARBITRUM = "ARBETH";
  static OPTIMISM = "OETH";
  static BITCOIN = "BTC";
  static SOLANA = "SOL";
  static SOLAR = "SXP";
}

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
      symbol: CONST_CHAIN_SYMBOLS.ARBITRUM,
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
