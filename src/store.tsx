import { configureStore } from "@reduxjs/toolkit";
import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";
import { useDispatch, useSelector } from "react-redux";

// Auth
import accountReducer from "./store/AccountSlice";
import accountListReducer from "./store/AccountListSlice";
import mnemonicReducer from "./store/MnemonicSlice";
import authReducer from "./store/AuthSlice";
// ~Auth

// Wallet
import walletReducer from "./store/WalletSlice";
import reserveListReducer from "./store/ReserveListSlice";
import balanceReducer from "./store/BalanceListSlice";
import priceReducer from "./store/PriceListSlice";
import currentCurrencyReducer from "./store/CurrentCurrencySlice";
import currentChainReducer from "./store/CurrentChainSlice";
import currentTokenReducer from "./store/CurrentTokenSlice";
// ~Wallet

// Setting
import walletSettingReducer from "./store/WalletSettingSlice";
import notificationSettingReducer from "./store/NotificationSettingSlice";
import languageSettingReducer from "./store/LanguageSettingSlice";
import addressReducer from "./store/AddressSlice";
// ~Setting

// DownloadStatus
import downloadStatusReducer from "./store/DownloadStatusSlice";
// ~DownloadStatus

// Game
import gameListReducer from "./store/GameListSlice";
import libraryListReducer from "./store/LibraryListSlice";
import developerGameListReducer from "./store/DeveloperGameListSlice";
// ~Game

import tymtLogoReducer from "./store/tymtLogoSlice";
import renderTimeReducer from "./store/RenderTimeSlice";

// const blacklistActionTypes = ["intercomsupport/setChatMounted", "intercomsupport/setMountedTrue", "intercomsupport/setMountedFalse"];
const blacklistActionTypes: string[] = [];

const stateSyncConfig = {
  blacklist: blacklistActionTypes,
};

const stateSyncMiddleware = createStateSyncMiddleware(stateSyncConfig);

const store = configureStore({
  reducer: {
    // Auth
    account: accountReducer,
    accountList: accountListReducer,
    mnemonic: mnemonicReducer,
    auth: authReducer,
    // ~Auth

    // Wallet
    wallet: walletReducer,
    reserveList: reserveListReducer,
    balanceList: balanceReducer,
    priceList: priceReducer,
    currentCurrency: currentCurrencyReducer,
    currentChain: currentChainReducer,
    currentToken: currentTokenReducer,
    // ~Wallet

    // Setting
    walletSetting: walletSettingReducer,
    notificationSetting: notificationSettingReducer,
    languageSetting: languageSettingReducer,
    // ~Setting

    // DownloadStatus
    downloadStatus: downloadStatusReducer,
    // ~DownloadStatus

    // Game
    gameList: gameListReducer,
    libraryList: libraryListReducer,
    developerGameList: developerGameListReducer,
    // ~Game

    tymtLogo: tymtLogoReducer,
    renderTime: renderTimeReducer,

    address: addressReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stateSyncMiddleware),
});

initMessageListener(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
