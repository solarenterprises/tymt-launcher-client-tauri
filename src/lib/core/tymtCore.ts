import Ethereum from "../wallet/Ethereum";
import Solar from "../wallet/Solar";
import BSC from "../wallet/BSC";
import Solana from "../wallet/Solana";
import Polygon from "../wallet/Polygon";
import Avalanche from "../wallet/Avalanche";
import Arbitrum from "../wallet/Arbitrum";
import Bitcoin from "../wallet/Bitcoin";
import Optimism from "../wallet/Optimism";

import { CONST_CHAIN_NAMES } from "../../const/ChainConsts";
import { CONST_CHAIN_SYMBOLS } from "../../const/ChainConsts";

// export type BlockchainKey = "solar" | "bsc" | "eth" | "solana" | "polygon" | "avalanche" | "arbitrum" | "btc" | "op";

const tymtCore = {
  Blockchains: {
    solar: {
      name: CONST_CHAIN_NAMES.SOLAR,
      symbol: CONST_CHAIN_SYMBOLS.SOLAR,
      wallet: Solar,
      explorer: "https://solarscan.com/wallet/",
      txexplorer: "https://solarscan.com/transaction/",
    },
    bsc: {
      name: CONST_CHAIN_NAMES.BINANCE,
      symbol: CONST_CHAIN_SYMBOLS.BINANCE,
      wallet: BSC,
      explorer: "https://bscscan.com/address/",
      txexplorer: "https://bscscan.com/tx/",
    },
    eth: {
      name: CONST_CHAIN_NAMES.ETHEREUM,
      symbol: CONST_CHAIN_SYMBOLS.ETHEREUM,
      wallet: Ethereum,
      explorer: "https://etherscan.io/address/",
      txexplorer: "https://etherscan.io/tx/",
    },
    btc: {
      name: CONST_CHAIN_NAMES.BITCOIN,
      symbol: CONST_CHAIN_SYMBOLS.BITCOIN,
      wallet: Bitcoin,
      explorer: "https://www.blockchain.com/explorer/addresses/btc/",
      txexplorer: "https://www.blockchain.com/explorer/transactions/btc/",
    },
    solana: {
      name: CONST_CHAIN_NAMES.SOLANA,
      symbol: CONST_CHAIN_SYMBOLS.SOLANA,
      wallet: Solana,
      explorer: "https://solscan.io/account/",
      txexplorer: "https://solscan.io/tx/",
    },
    polygon: {
      name: CONST_CHAIN_NAMES.POLYGON,
      symbol: CONST_CHAIN_SYMBOLS.POLYGON,
      wallet: Polygon,
      explorer: "https://polygonscan.com/address/",
      txexplorer: "https://polygonscan.com/tx/",
    },
    avalanche: {
      name: CONST_CHAIN_NAMES.AVALANCHE,
      symbol: CONST_CHAIN_SYMBOLS.AVALANCHE,
      wallet: Avalanche,
      explorer: "https://avascan.info/blockchain/c/address/",
      txexplorer: "https://avascan.info/blockchain/c/tx/",
    },
    arbitrum: {
      name: CONST_CHAIN_NAMES.ARBITRUM,
      symbol: CONST_CHAIN_SYMBOLS.ARBITRUM,
      wallet: Arbitrum,
      explorer: "https://arbiscan.io/address/",
      txexplorer: "https://arbiscan.io/tx/",
    },
    op: {
      name: CONST_CHAIN_NAMES.OPTIMISM,
      symbol: CONST_CHAIN_SYMBOLS.OPTIMISM,
      wallet: Optimism,
      explorer: "https://optimistic.etherscan.io/address/",
      txexplorer: "https://optimistic.etherscan.io/tx/",
    },
  },
};

export default tymtCore;
