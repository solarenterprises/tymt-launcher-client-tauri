import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import tymtCore from "../lib/core/tymtCore";

import { CONST_CURRENCY_SYMBOLS } from "../const/CurrencyConsts";
import { CONST_CHAIN_NAMES, CONST_CHAIN_SYMBOLS, CONST_SUPPORT_CHAINS } from "../const/ChainConsts";
import { CONST_FEE_SXP } from "../const/WalletConsts";

import { getCurrentChain } from "../store/CurrentChainSlice";
import { getCurrentCurrency } from "../store/CurrentCurrencySlice";
import { getCurrentToken, setCurrentToken } from "../store/CurrentTokenSlice";
import { getWallet } from "../store/WalletSlice";
import { /*appendPriceList,*/ getPriceList, setPriceList } from "../store/PriceListSlice";
import { appendBalanceList, getBalanceList, setBalanceList } from "../store/BalanceListSlice";
import { getReserveList, setReserveList } from "../store/ReserveListSlice";
import { getWalletSetting, setWalletSetting } from "../store/WalletSettingSlice";
import { getMnemonic } from "../store/MnemonicSlice";
import { getAuth } from "../store/AuthSlice";

import { CryptoAPI } from "../lib/api/CryptoAPI";

import {
  getCurrentChainWalletAddress,
  getExplorerUrl,
  getNativeTokenBalanceByChainName,
  getNativeTokenPriceByChainName,
  getSupportChainByName,
  getSupportNativeOrTokenBySymbol,
  getTokenBalanceBySymbol,
  getTokenPriceBySymbol,
  getPublicKey,
  getNativeDecimalsBySymbol,
} from "../lib/helper/WalletHelper";

import { ICurrentChain, ISupportChain, ISupportNative, ISupportToken } from "../types/ChainTypes";
import { ICurrentCurrency, IReserveList } from "../types/CurrencyTypes";
import { IBalanceList, ICurrentToken, IVotingData, IWalletAddresses } from "../types/WalletTypes";
import { IPriceList } from "../types/PriceTypes";
import { IAuth, IMnemonic } from "../types/AccountTypes";
import { IWalletSetting } from "../types/SettingTypes";
import { IRecipient } from "../types/TransactionTypes";

interface WalletContextType {
  passphrase: string;
  sxpPrice: number;
  sxpBalance: number;
  sxpAddress: string;
  sxpFee: number;
  publicKey: string;
  ethPrivateKey: string;
  currentSupportChain: ISupportChain;
  currentChainWalletAddress: string;
  currentChainExplorerUrl: string;
  currentCurrencyReserve: number;
  currentCurrencySymbol: string;
  currentNativeOrToken: ISupportNative | ISupportToken;
  currentChainNativePrice: number;
  currentChainNativeBalance: number;
  totalBalance: number;

  sxpVote: (__: IWalletAddresses, ___: number, _____: IVotingData) => Promise<{ success: boolean; error?: string }>;
  transferCoin: (recipients: IRecipient[], fee: string) => Promise<{ success: boolean; message?: string; error?: string; data?: any }>;
  setSxpFeeAsInput: (_: number) => void;
  fetchBalanceList: () => void;
  fetchSXPBalance: () => void;
  fetchPriceList: () => void;
  handleRefreshClick: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  const [sxpFee, setSxpFee] = useState<number>(0);
  const [ethPrivateKey, setEthPrivagteKey] = useState<string>("");

  const authStore: IAuth = useSelector(getAuth);
  const mnemonicStore: IMnemonic = useSelector(getMnemonic);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const currentTokenStore: ICurrentToken = useSelector(getCurrentToken);
  const walletStore: IWalletAddresses = useSelector(getWallet);
  const priceListStore: IPriceList = useSelector(getPriceList);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const reserveListStore: IReserveList = useSelector(getReserveList);
  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);

  const passphrase = useMemo(() => mnemonicStore?.mnemonic, [mnemonicStore]);
  const sxpPrice = useMemo(() => getNativeTokenPriceByChainName(priceListStore, CONST_CHAIN_NAMES?.SOLAR), [priceListStore]);
  const sxpBalance = useMemo(() => getNativeTokenBalanceByChainName(balanceListStore, CONST_CHAIN_NAMES?.SOLAR), [balanceListStore]);
  const sxpAddress = useMemo(() => walletStore?.solar, [walletStore]);
  const publicKey = useMemo(() => getPublicKey(passphrase), [passphrase]);

  const currentSupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);
  const currentChainWalletAddress: string = useMemo(
    () => getCurrentChainWalletAddress(walletStore, currentChainStore?.chain),
    [walletStore, currentChainStore]
  );
  const currentChainExplorerUrl: string = useMemo(() => getExplorerUrl(currentSupportChain, walletStore), [currentSupportChain, walletStore]);
  const currentCurrencyReserve: number = useMemo(
    () => reserveListStore?.list?.find((one) => one?.currency === currentCurrencyStore?.currency)?.reserve,
    [reserveListStore, currentCurrencyStore]
  );
  const currentCurrencySymbol: string = useMemo(() => CONST_CURRENCY_SYMBOLS[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const currentNativeOrToken = useMemo(() => getSupportNativeOrTokenBySymbol(currentTokenStore?.token), [currentTokenStore]);
  const currentChainNativeBalance = useMemo(
    () => getTokenBalanceBySymbol(balanceListStore, currentSupportChain?.native?.symbol),
    [balanceListStore, currentSupportChain]
  );
  const currentChainNativePrice = useMemo(
    () => getTokenPriceBySymbol(priceListStore, currentSupportChain?.native?.symbol),
    [priceListStore, currentSupportChain]
  );

  const totalBalance = useMemo(() => {
    let total = 0;
    CONST_SUPPORT_CHAINS.forEach((supportChain) => {
      const nativeDecimal = getNativeDecimalsBySymbol(supportChain.native.symbol);
      const nativeBalance =
        balanceListStore.list.find((one) => one.symbol === supportChain.native.symbol)?.balance / Math.pow(10, nativeDecimal as number) || 0;
      const nativePrice = priceListStore.list.find((one) => one.symbol === supportChain.native.symbol)?.price || 0;
      total += nativeBalance * nativePrice;
      supportChain.tokens.forEach((token) => {
        const tokenBalance = balanceListStore.list.find((one) => one.symbol === token.symbol)?.balance || 0;
        const tokenPrice = priceListStore.list.find((one) => one.symbol === token.symbol)?.price || 0;
        total += tokenBalance * tokenPrice;
      });
    });
    return total * currentCurrencyReserve;
  }, [balanceListStore, priceListStore, currentCurrencyReserve]);

  const setSxpFeeAsInput = useCallback(
    (fee: number) => {
      dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "input" }));
      setSxpFee(fee);
    },
    [dispatch, walletSettingStore]
  );

  const transferCoin = useCallback(
    async (
      recipients: IRecipient[],
      fee: string // fee in SXP
    ) => {
      let res;
      switch (recipients[0].chainSymbol) {
        case CONST_CHAIN_SYMBOLS.SOLAR:
          res = await tymtCore.Blockchains.solar.wallet.sendTransaction(passphrase, { recipients, fee });
          break;
        case CONST_CHAIN_SYMBOLS.ETHEREUM:
          res = await tymtCore.Blockchains.eth.wallet.sendTransaction(ethPrivateKey, walletStore?.ethereum, recipients);
          break;
        case CONST_CHAIN_SYMBOLS.BINANCE:
          res = await tymtCore.Blockchains.bsc.wallet.sendTransaction(ethPrivateKey, walletStore?.ethereum, recipients);
          break;
        case CONST_CHAIN_SYMBOLS.POLYGON:
          res = await tymtCore.Blockchains.polygon.wallet.sendTransaction(ethPrivateKey, walletStore?.ethereum, recipients);
          break;
        case CONST_CHAIN_SYMBOLS.AVALANCHE:
          res = await tymtCore.Blockchains.avalanche.wallet.sendTransaction(ethPrivateKey, walletStore?.ethereum, recipients);
          break;
        case CONST_CHAIN_SYMBOLS.ARBITRUM:
          res = await tymtCore.Blockchains.arbitrum.wallet.sendTransaction(ethPrivateKey, walletStore?.ethereum, recipients);
          break;
        case CONST_CHAIN_SYMBOLS.OPTIMISM:
          res = await tymtCore.Blockchains.op.wallet.sendTransaction(ethPrivateKey, walletStore?.ethereum, recipients);
          break;
      }
      return res;
    },
    [passphrase, ethPrivateKey, walletStore]
  );

  const fetchCurrencyRates = useCallback(async () => {
    const currencyRates = await CryptoAPI.getAllCurrencyRates();
    dispatch(setReserveList(currencyRates));
  }, []);

  const fetchBalanceList = useCallback(async () => {
    if (!walletStore || !walletStore?.solar) return;
    const sxpBalance = await tymtCore.Blockchains.solar.wallet.getBalance(walletStore?.solar);
    const balanceList: Array<{ symbol: string; balance: number }> = await CryptoAPI.getAllBalance({
      evmAddress: walletStore?.ethereum,
      solAddress: walletStore?.solana,
      btcAddress: walletStore?.bitcoin,
    });
    const data = [
      ...balanceList,
      {
        symbol: CONST_CHAIN_SYMBOLS.SOLAR,
        balance: sxpBalance,
      },
    ];
    dispatch(setBalanceList(data));
  }, [walletStore, dispatch]);

  const fetchSXPBalance = useCallback(async () => {
    if (!walletStore || !walletStore?.solar) return;
    const sxpBalance = await tymtCore.Blockchains.solar.wallet.getBalance(walletStore?.solar);
    const data = [
      {
        symbol: CONST_CHAIN_SYMBOLS.SOLAR,
        balance: sxpBalance,
      },
    ];
    dispatch(appendBalanceList(data));
  }, [walletStore]);

  const fetchPriceList = async () => {
    try {
      const priceList = await CryptoAPI.getAllPrices();
      dispatch(setPriceList(priceList));
    } catch (err) {
      console.error("Failed to fetchPriceList: ", err);
    }
  };

  const handleRefreshClick = useCallback(async () => {
    try {
      await Promise.all([fetchPriceList(), fetchBalanceList(), fetchCurrencyRates()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }, [fetchPriceList, fetchBalanceList]);

  const getEthPrivateKey = async (passphrase: string) => {
    const privateKey = await tymtCore.Blockchains.eth.wallet.getPrivateKey(passphrase);
    setEthPrivagteKey(privateKey);
  };

  const sxpVote = useCallback(
    async (walletStore: IWalletAddresses, sxpFee: number, voteAsset: IVotingData) => {
      try {
        const res = await tymtCore.Blockchains.solar.wallet.vote(passphrase, walletStore?.solar, voteAsset, sxpFee);
        if (res.data.data.invalid[0]) {
          const temp = res.data.data.invalid[0];
          const err = res.data.errors[temp].message;
          throw new Error(err);
        }
        setTimeout(fetchSXPBalance, 10000);
        return { success: true };
      } catch (err) {
        console.error("Failed to sxpVote: ", err);
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [passphrase, fetchSXPBalance]
  );

  useEffect(() => {
    getEthPrivateKey(passphrase);
  }, [passphrase]);

  useEffect(() => {
    dispatch(setCurrentToken(currentSupportChain?.native?.symbol));
  }, [currentSupportChain]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchPriceList(), fetchCurrencyRates()]);
      setTimeout(fetchData, 10 * 60 * 1000); // Call again after 10 minutes
    };
    if (authStore?.isLoggedIn) fetchData();
  }, [authStore]);

  useEffect(() => {
    switch (walletSettingStore?.feeLevel) {
      case "minimum":
        setSxpFee(CONST_FEE_SXP.MIN);
        break;
      case "average":
        setSxpFee(CONST_FEE_SXP.MID);
        break;
      case "maximum":
        setSxpFee(CONST_FEE_SXP.MAX);
        break;
      default:
        break;
    }
  }, [walletSettingStore]);

  return (
    <WalletContext.Provider
      value={{
        passphrase,
        sxpPrice,
        sxpBalance,
        sxpAddress,
        sxpFee,
        publicKey,
        ethPrivateKey,
        currentSupportChain,
        currentChainWalletAddress,
        currentChainExplorerUrl,
        currentCurrencyReserve,
        currentCurrencySymbol,
        currentNativeOrToken,
        currentChainNativePrice,
        currentChainNativeBalance,
        totalBalance,
        sxpVote,
        transferCoin,
        setSxpFeeAsInput,
        fetchBalanceList,
        fetchSXPBalance,
        fetchPriceList,
        handleRefreshClick,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
