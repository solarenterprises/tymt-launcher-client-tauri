import { CONST_CHAIN_NAMES } from "../../const/ChainConsts";

import tymtCore from "../core/tymtCore";

import { getCurrentChainWalletAddress, getNativeSymbolByChainName, getSupportTokensByChainName } from "../../lib/helper/WalletHelper";

import { IBalance, IWalletAddresses } from "../../types/WalletTypes";
import { IParamsFetchChainBalance } from "../../types/APITypes/BalanceAPITypes";

export class BalanceAPI {
  static fetchBalanceList = async (walletStore: IWalletAddresses) => {
    try {
      // const asyncFunctions = CONST_SUPPORT_CHAINS?.map((one) =>
      //   this.fetchChainBalance({
      //     walletStore: walletStore,
      //     chainName: one?.native?.name,
      //   })
      // );
      const asyncFunctions = this.fetchChainBalance({ walletStore, chainName: CONST_CHAIN_NAMES.SOLAR });
      const result = await Promise.all([asyncFunctions]);
      const flattenedResult = result?.flat();
      return flattenedResult;
    } catch (err) {
      console.error("Failed to fetchBalanceList: ", err);
    }
  };

  static fetchChainBalance = async ({ walletStore, chainName }: IParamsFetchChainBalance) => {
    try {
      const walletAddress = getCurrentChainWalletAddress(walletStore, chainName);
      const supportTokens = getSupportTokensByChainName(chainName);
      let nativeBalance: IBalance;
      let tokenBalances: IBalance[] = [];
      switch (chainName) {
        case CONST_CHAIN_NAMES.ARBITRUM:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.arbitrum.wallet.getBalance(walletAddress),
          };
          tokenBalances = await tymtCore.Blockchains.arbitrum.wallet.getTokenBalance(walletAddress, supportTokens);
          break;
        case CONST_CHAIN_NAMES.AVALANCHE:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.avalanche.wallet.getBalance(walletAddress),
          };
          tokenBalances = await tymtCore.Blockchains.avalanche.wallet.getTokenBalance(walletAddress, supportTokens);
          break;
        case CONST_CHAIN_NAMES.BINANCE:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.bsc.wallet.getBalance(walletAddress),
          };
          tokenBalances = await tymtCore.Blockchains.bsc.wallet.getTokenBalance(walletAddress, supportTokens);
          break;
        case CONST_CHAIN_NAMES.BITCOIN:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.btc.wallet.getBalance(walletAddress),
          };
          break;
        case CONST_CHAIN_NAMES.ETHEREUM:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.eth.wallet.getBalance(walletAddress),
          };
          tokenBalances = await tymtCore.Blockchains.eth.wallet.getTokenBalance(walletAddress, supportTokens);
          break;
        case CONST_CHAIN_NAMES.OPTIMISM:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.op.wallet.getBalance(walletAddress),
          };
          tokenBalances = await tymtCore.Blockchains.op.wallet.getTokenBalance(walletAddress, supportTokens);
          break;
        case CONST_CHAIN_NAMES.POLYGON:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.polygon.wallet.getBalance(walletAddress),
          };
          tokenBalances = await tymtCore.Blockchains.polygon.wallet.getTokenBalance(walletAddress, supportTokens);
          break;
        case CONST_CHAIN_NAMES.SOLANA:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.solana.wallet.getBalance(walletAddress),
          };
          break;
        case CONST_CHAIN_NAMES.SOLAR:
          nativeBalance = {
            symbol: getNativeSymbolByChainName(chainName),
            balance: await tymtCore.Blockchains.solar.wallet.getBalance(walletAddress),
          };
          break;
      }
      const res = [...tokenBalances, nativeBalance];
      return res;
    } catch (err) {
      console.error("Failed to fetchChainBalance: ", err);
    }
  };
}
