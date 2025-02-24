import { createSlice } from "@reduxjs/toolkit";

import { compareJSONStructure } from "../lib/helper/JSONHelper";
import { resetBalanceList } from "../lib/helper/BalanceHelper";

import { IBalance, IBalanceList } from "../types/WalletTypes";
import tymtStorage from "../lib/storage/tymtStorage";

const init: IBalanceList = {
  list: resetBalanceList(),
};

const loadBalanceList: () => IBalanceList = () => {
  const data = tymtStorage.get(`balanceList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`balanceList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadBalanceList(),
  status: "balanceList",
  msg: "",
};

export const balanceListSlice = createSlice({
  name: "balanceList",
  initialState,
  reducers: {
    setBalanceList: (state, action) => {
      state.data.list = action.payload;
      tymtStorage.set(`balanceList`, JSON.stringify(state.data));
    },
    appendBalanceList: (state, action) => {
      const temp = state.data.list.filter((one) => !(action.payload as IBalance[]).some((two) => two.symbol === one.symbol));
      state.data.list = [...temp, ...action.payload];
      tymtStorage.set(`balanceList`, JSON.stringify(state.data));
    },
  },
});

export const getBalanceList = (state: any) => state.balanceList.data;
export const { setBalanceList, appendBalanceList } = balanceListSlice.actions;

export default balanceListSlice.reducer;
