import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../lib/storage/tymtStorage";
import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { IWalletAddresses } from "../types/WalletTypes";

const init: IWalletAddresses = {
  arbitrum: "",
  avalanche: "",
  bitcoin: "",
  binance: "",
  ethereum: "",
  optimism: "",
  polygon: "",
  solana: "",
  solar: "",
};

const loadWallet: () => IWalletAddresses = () => {
  const data = tymtStorage.get(`wallet`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`wallet`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadWallet(),
  status: "wallet",
  msg: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`wallet`, JSON.stringify(state.data));
    },
  },
});

export const getWallet = (state: any) => state.wallet.data;
export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
