import * as bip39 from "bip39";

import { CONST_CHAIN_NAMES, CONST_CHAIN_SYMBOLS, CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";
import { add } from "./balanceUtils";
import {
  CONFIG_NETWORK_NAME,
  CONFIG_SOLAR_SCAN,
  CONFIG_BSC_SCAN,
  CONFIG_ETH_SCAN,
  CONFIG_SOL_SCAN,
  CONFIG_POL_SCAN,
  CONFIG_AVAX_SCAN,
  CONFIG_ARB_SCAN,
  CONFIG_OPT_SCAN,
  CONFIG_BTC_SCAN,
} from "../../config/MainConfig";

import tymtCore from "../core/tymtCore";

import { IWalletAddresses, IBalanceList } from "../../types/WalletTypes";
import { IPriceList } from "../../types/PriceTypes";
import { ISupportChain } from "../../types/ChainTypes";
import { ITransaction, ITransactionPagination, txIconMap } from "../../types/TransactionTypes";
import { formatUnixTime } from "./DateHelper";

export const checkMnemonic = (_mnemonic: string) => {
  if (_mnemonic.split(" ").length == 24) {
    return (
      (bip39.validateMnemonic(_mnemonic.split(" ").slice(0, 12).join(" ")) && bip39.validateMnemonic(_mnemonic.split(" ").slice(12, 24).join(" "))) ||
      bip39.validateMnemonic(_mnemonic)
    );
  } else if (_mnemonic.split(" ").length == 12) {
    return bip39.validateMnemonic(_mnemonic);
  }
  return false;
};

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice(); // Clone the array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

export const getMnemonic = (_length: number) => {
  if (_length === 12) {
    return `${bip39.generateMnemonic()}`;
  } else if (_length === 24) {
    return `${bip39.generateMnemonic()} ${bip39.generateMnemonic()}`;
  }
  return "";
};

export const getWalletAddressesFromPassphrase = async (_passphrase: string) => {
  try {
    const solarAddr = await tymtCore.Blockchains.solar.wallet.getAddress(_passphrase);
    // const bscAddr = await tymtCore.Blockchains.bsc.wallet.getAddress(_passphrase);
    // const ethereumAddr = await tymtCore.Blockchains.eth.wallet.getAddress(_passphrase);
    // const bitcoinAddr = await tymtCore.Blockchains.btc.wallet.getAddress(_passphrase);
    // const solanaAddr = await tymtCore.Blockchains.solana.wallet.getAddress(_passphrase);
    // const polygonAddr = await tymtCore.Blockchains.polygon.wallet.getAddress(_passphrase);
    // const avalancheAddr = await tymtCore.Blockchains.avalanche.wallet.getAddress(_passphrase);
    // const arbitrumAddr = await tymtCore.Blockchains.arbitrum.wallet.getAddress(_passphrase);
    // const optimismAddr = await tymtCore.Blockchains.op.wallet.getAddress(_passphrase);

    const res: IWalletAddresses = {
      arbitrum: null, // arbitrumAddr,
      avalanche: null, // avalancheAddr,
      bitcoin: null, // bitcoinAddr,
      binance: null, // bscAddr,
      ethereum: null, // ethereumAddr,
      optimism: null, // optimismAddr,
      polygon: null, // polygonAddr,
      solana: null, // solanaAddr,
      solar: solarAddr,
    };

    return res;
  } catch (err) {
    console.error("Failed to getWalletAddressesFromPassphrase: ", err);
  }
};

export const getCurrentChainWalletAddress = (walletStore: IWalletAddresses, chainName: string) => {
  try {
    let res = "";
    switch (chainName) {
      case CONST_CHAIN_NAMES.ARBITRUM:
        res = walletStore?.arbitrum;
        break;
      case CONST_CHAIN_NAMES.AVALANCHE:
        res = walletStore?.avalanche;
        break;
      case CONST_CHAIN_NAMES.BINANCE:
        res = walletStore?.binance;
        break;
      case CONST_CHAIN_NAMES.BITCOIN:
        res = walletStore?.bitcoin;
        break;
      case CONST_CHAIN_NAMES.ETHEREUM:
        res = walletStore?.ethereum;
        break;
      case CONST_CHAIN_NAMES.OPTIMISM:
        res = walletStore?.optimism;
        break;
      case CONST_CHAIN_NAMES.POLYGON:
        res = walletStore?.polygon;
        break;
      case CONST_CHAIN_NAMES.SOLANA:
        res = walletStore?.solana;
        break;
      case CONST_CHAIN_NAMES.SOLAR:
        res = walletStore?.solar;
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getCurrentChainWalletAddress: ", err);
  }
};

export const getSupportChainByName = (chainName: string) => {
  try {
    const res = CONST_SUPPORT_CHAINS?.find((one) => one?.native?.name === chainName);
    return res;
  } catch (err) {
    console.error("Failed to getSupportChainByName: ", err);
  }
};

export const getNativeSymbolByChainName = (chainName: string) => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const res = supportChain?.native?.symbol;
    return res;
  } catch (err) {
    console.error("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const getSupportTokensByChainName = (chainName: string) => {
  try {
    const res = getSupportChainByName(chainName)?.tokens;
    return res;
  } catch (err) {
    console.error("Failed to getSupportTokensByChainName: ", err);
  }
};

export const getTokenPriceBySymbol = (priceListStore: IPriceList, symbol: string): string => {
  try {
    const price = priceListStore?.list?.find((one) => one?.symbol === symbol)?.price || 0;
    return price.toString();
  } catch (err) {
    console.error("Failed to getCurrentChainNativeTokenPrice: ", err);
    return '0';
  }
};

export const getNativeDecimalsBySymbol = (symbol: string): number | null => {
  for (const chain of CONST_SUPPORT_CHAINS) {
    if (chain.native.symbol === symbol) {
      return Number(chain.native.decimals); // Return the decimal if the symbol matches
    }
  }
  return null; // Return null if the symbol is not found
};

export const getTokenBalanceBySymbol = (balanceListStore: IBalanceList, symbol: string): string => {
  try {
    const balance = balanceListStore?.list?.find((one) => one?.symbol === symbol)?.balance || '0';
    return balance;
  } catch (err) {
    console.error("Failed to getTokenBalanceBySymbol: ", err);
    return '0';
  }
};

export const getNativeTokenPriceByChainName = (priceListStore: IPriceList, chainName: string): string => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const symbol = supportChain?.native?.symbol;
    return getTokenPriceBySymbol(priceListStore, symbol);
  } catch (err) {
    console.error("Failed to getNativeSymbolByChainName: ", err);
    return '0';
  }
};

export const getNativeTokenBalanceByChainName = (balanceListStore: IBalanceList, chainName: string): string => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const symbol = supportChain?.native?.symbol;
    return getTokenBalanceBySymbol(balanceListStore, symbol);
  } catch (err) {
    console.error("Failed to getNativeSymbolByChainName: ", err);
    return '0';
  }
};

export const getSupportNativeOrTokenBySymbol = (tokenSymbol: string) => {
  try {
    const res_1 = CONST_SUPPORT_CHAINS?.find((chain) => chain?.native?.symbol === tokenSymbol)?.native;
    if (res_1) return res_1;
    for (const chain of CONST_SUPPORT_CHAINS) {
      const token = chain?.tokens?.find((token) => token?.symbol === tokenSymbol);
      if (token) {
        return token;
      }
    }
  } catch (err) {
    console.error("Failed to getSupportNativeOrTokenBySymbol: ", err);
  }
};

export const getExplorerUrl = (chain: ISupportChain, walletStore: IWalletAddresses): string => {
  let url = "";
  const currentChainWallet = getCurrentChainWalletAddress(walletStore, chain?.native?.name);
  switch (chain?.native?.symbol) {
    case CONST_CHAIN_SYMBOLS.SOLAR: {
      url = CONFIG_SOLAR_SCAN + "wallet/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.BINANCE: {
      url = CONFIG_BSC_SCAN + "address/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.ETHEREUM: {
      url = CONFIG_ETH_SCAN + "address/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.BITCOIN: {
      url = CONFIG_BTC_SCAN + "address/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.SOLANA: {
      if (CONFIG_NETWORK_NAME == "testnet") {
        url = CONFIG_SOL_SCAN + "account/" + currentChainWallet + "?cluster=testnet";
      } else {
        url = CONFIG_SOL_SCAN + "account/" + currentChainWallet;
      }
      break;
    }
    case CONST_CHAIN_SYMBOLS.POLYGON: {
      url = CONFIG_POL_SCAN + "address/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.AVALANCHE: {
      url = CONFIG_AVAX_SCAN + "address/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.ARBITRUM: {
      url = CONFIG_ARB_SCAN + "address/" + currentChainWallet;
      break;
    }
    case CONST_CHAIN_SYMBOLS.OPTIMISM: {
      url = CONFIG_OPT_SCAN + "address/" + currentChainWallet;
      break;
    }
  }
  return url;
};

export const getPublicKey = (passphrase: string) => {
  return tymtCore.Blockchains.solar.wallet.getPublicKey(passphrase);
};

export const getTxScanLink = (txId: string, currentChainName: string) => {
  let res: string;
  switch (currentChainName) {
    case CONST_CHAIN_NAMES.SOLAR:
      res = CONFIG_SOLAR_SCAN + "transaction/" + txId;
      break;
    case CONST_CHAIN_NAMES.ETHEREUM:
      res = CONFIG_ETH_SCAN + "tx/" + txId;
      break;
    case CONST_CHAIN_NAMES.BINANCE:
      res = CONFIG_BSC_SCAN + "tx/" + txId;
      break;
    case CONST_CHAIN_NAMES.POLYGON:
      res = CONFIG_POL_SCAN + "tx/" + txId;
      break;
    case CONST_CHAIN_NAMES.AVALANCHE:
      res = CONFIG_AVAX_SCAN + "tx/" + txId;
      break;
    case CONST_CHAIN_NAMES.ARBITRUM:
      res = CONFIG_ARB_SCAN + "tx/" + txId;
      break;
    case CONST_CHAIN_NAMES.OPTIMISM:
      res = CONFIG_OPT_SCAN + "tx/" + txId;
      break;
  }
  return res;
};

export const formatTx = (tx: ITransaction, currentChainWallet: string, currentChainName: string) => {
  const displayTxImage = tx.type === "vote" ? txIconMap.get("TX_VOTE") : tx.sender === currentChainWallet ? txIconMap.get("TX_OUT") : txIconMap.get("TX_IN");
  // Use balanceUtils to add string amounts properly
  const displayTxAmount = add(tx.amount, tx.fee);
  const displayTxAddress = tx.type === "vote" ? tx.sender : tx.sender === currentChainWallet && tx.asset.length > 0 ? tx.asset[0].recipient : tx.sender;
  const displayTxTooltip = tx.type === "vote" ? "Vote" : tx.sender === currentChainWallet ? "Transfer Out" : "Transfer In";
  const displayTimestamp = formatUnixTime(tx.timestamp);
  const txScanLink = getTxScanLink(tx.txId, currentChainName);
  return {
    displayTxAddress,
    displayTxAmount,
    displayTxImage,
    displayTxTooltip,
    displayTimestamp,
    txScanLink,
  };
};

export const formatEvmResponseToTxPagination = (res: any) => {
  const txList: ITransaction[] = res?.data?.data?.transactions?.map((one) => ({
    txId: one?.txid,
    type: "transfer",
    asset: one?.vout?.map((two) => ({ amount: two?.value, recipient: two?.addresses[0] })),
    amount: one?.value / 1e18,
    sender: one?.vin[0]?.addresses[0],
    fee: one?.fees / 1e18,
    timestamp: one?.blockTime,
  }));
  const result: ITransactionPagination = {
    meta: {
      totalCount: res?.data?.data?.txs,
      pageCount: res?.data?.data?.totalPages,
      count: res?.data?.data?.itemsOnPage,
    },
    data: txList,
  };
  return result;
};
