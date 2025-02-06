import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../lib/storage/tymtStorage";
import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { ICurrentCurrency } from "../types/CurrencyTypes";

const init: ICurrentCurrency = {
  currency: "USD",
};

const loadCurrentCurrency: () => ICurrentCurrency = () => {
  const data = tymtStorage.get(`currentCurrency`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`currentCurrency`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadCurrentCurrency(),
  status: "currentCurrency",
  msg: "",
};

export const currentCurrencySlice = createSlice({
  name: "currentCurrency",
  initialState,
  reducers: {
    setCurrentCurrency: (state, action) => {
      state.data.currency = action.payload;
      tymtStorage.set(`currentCurrency`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentCurrency = (state: any) => state.currentCurrency.data;
export const { setCurrentCurrency } = currentCurrencySlice.actions;

export default currentCurrencySlice.reducer;
