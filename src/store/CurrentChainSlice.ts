import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../lib/storage/tymtStorage";
import { CONST_CHAIN_NAMES } from "../const/ChainConsts";

import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { ICurrentChain } from "../types/ChainTypes";

const init: ICurrentChain = {
  chain: CONST_CHAIN_NAMES.SOLAR,
};

const loadCurrentChain: () => ICurrentChain = () => {
  const data = tymtStorage.get(`currentChain`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`currentChain`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadCurrentChain(),
  status: "currentChain",
  msg: "",
};

export const currentChainSlice = createSlice({
  name: "currentChain",
  initialState,
  reducers: {
    setCurrentChain: (state, action) => {
      state.data.chain = action.payload;
      tymtStorage.set(`currentChain`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentChain = (state: any) => state.currentChain.data;
export const { setCurrentChain } = currentChainSlice.actions;

export default currentChainSlice.reducer;
