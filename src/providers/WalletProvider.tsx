import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CONST_CURRENCY_SYMBOLS } from "../const/CurrencyConsts";
import { CONST_CHAIN_NAMES, CONST_SUPPORT_CHAINS } from "../const/ChainConsts";
import { CONST_FEE_SXP } from "../const/WalletConsts";

import { getCurrentChain } from "../store/CurrentChainSlice";
import { getCurrentCurrency } from "../store/CurrentCurrencySlice";
import { getCurrentToken, setCurrentToken } from "../store/CurrentTokenSlice";
import { getWallet } from "../store/WalletSlice";
import { getPriceList } from "../store/PriceListSlice";
import { getBalanceList } from "../store/BalanceListSlice";
import { getReserveList } from "../store/ReserveListSlice";
import { getWalletSetting, setWalletSetting } from "../store/WalletSettingSlice";
import { getMnemonic } from "../store/MnemonicSlice";

import {
  getCurrentChainWalletAddress,
  getExplorerUrl,
  getNativeTokenBalanceByChainName,
  getNativeTokenPriceByChainName,
  getSupportChainByName,
  getSupportNativeOrTokenBySymbol,
  getTokenBalanceBySymbol,
  getTokenPriceByCmc,
  getPublicKey,
} from "../lib/helper/WalletHelper";

import { ICurrentChain, ISupportChain, ISupportNative, ISupportToken } from "../types/ChainTypes";
import { ICurrentCurrency, IReserveList } from "../types/CurrencyTypes";
import { IBalanceList, ICurrentToken, IVotingData, IWalletAddresses } from "../types/WalletTypes";
import { IPriceList } from "../types/PriceTypes";
import { IAccount, IMnemonic } from "../types/AccountTypes";
import { IWalletSetting } from "../types/SettingTypes";
import { IRecipient } from "../types/TransactionTypes";
import tymtCore from "../lib/core/tymtCore";

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

  sxpVote: (_: IAccount, __: IWalletAddresses, ___: number, ____: string, _____: IVotingData) => Promise<{ success: boolean; error?: string }>;
  transferCoin: (recipients: IRecipient[], fee: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  setSxpFeeAsInput: (_: number) => void;
  fetchBalanceList: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  const [sxpFee, setSxpFee] = useState<number>(0);
  const [ethPrivateKey, setEthPrivagteKey] = useState<string>("");

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
  const currentChainNativePrice = useMemo(() => getTokenPriceByCmc(priceListStore, currentSupportChain?.native?.cmc), [priceListStore, currentSupportChain]);

  const totalBalance = useMemo(() => {
    let total = 0;
    CONST_SUPPORT_CHAINS.forEach((supportChain) => {
      const nativeBalance = balanceListStore.list.find((one) => one.symbol === supportChain.native.symbol)?.balance || 0;
      const nativePrice = priceListStore.list.find((one) => one.cmc === supportChain.native.cmc)?.price || 0;
      total += nativeBalance * nativePrice;
      supportChain.tokens.forEach((token) => {
        const tokenBalance = balanceListStore.list.find((one) => one.symbol === token.symbol)?.balance || 0;
        const tokenPrice = priceListStore.list.find((one) => one.cmc === token.cmc)?.price || 0;
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

  //@ts-ignore
  const sxpVote = async (accountStore: IAccount, walletStore: IWalletAddresses, sxpFee: number, password: string, voteAsset: IVotingData) => {
    // return window.electronAPI.sxpVote(accountStore, walletStore, sxpFee, password, voteAsset);
    return null;
  };

  const transferCoin = useCallback(
    async (
      //@ts-ignore
      recipients: IRecipient[],
      //@ts-ignore
      fee: string // fee in SXP
    ) => {
      // return window.electronAPI.transferCoin(passphrase, { recipients, fee });
      return null;
    },
    [passphrase]
  );

  const fetchBalanceList = useCallback(async () => {
    if (!walletStore || !walletStore?.solar) return;
    console.time("fetchBalanceList");
    // const balanceList = await window.electronAPI.fetchBalanceList(walletStore);
    console.timeEnd("fetchBalanceList");
    // dispatch(setBalanceList(balanceList));
  }, [walletStore, dispatch]);

  const getEthPrivateKey = async (passphrase: string) => {
    const privateKey = await tymtCore.Blockchains.eth.wallet.getPrivateKey(passphrase);
    setEthPrivagteKey(privateKey);
  };

  useEffect(() => {
    getEthPrivateKey(passphrase);
  }, [passphrase]);

  useEffect(() => {
    fetchBalanceList();
    // const intervalId = setInterval(fetchBalanceList, 10000);
    // return () => clearInterval(intervalId);
  }, [dispatch, walletStore]);

  useEffect(() => {
    dispatch(setCurrentToken(currentSupportChain?.native?.symbol));
  }, [currentSupportChain]);

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
