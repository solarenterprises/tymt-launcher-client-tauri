import { createSlice } from "@reduxjs/toolkit";

import { compareJSONStructure } from "../lib/helper/JSONHelper";
import { resetPriceList } from "../lib/helper/PriceHelper";

import { IPrice, IPriceList } from "../types/PriceTypes";
import tymtStorage from "../lib/storage/tymtStorage";

const init: IPriceList = {
  list: resetPriceList(),
};

const loadPriceList: () => IPriceList = () => {
  const data = tymtStorage.get(`priceList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`priceList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadPriceList(),
  status: "priceList",
  msg: "",
};

export const priceListSlice = createSlice({
  name: "priceList",
  initialState,
  reducers: {
    setPriceList: (state, action) => {
      state.data.list = action.payload;
      tymtStorage.set(`priceList`, JSON.stringify(state.data));
    },
    appendPriceList: (state, action) => {
      const temp = state.data.list.filter((one) => !(action.payload as IPrice[]).some((two) => two.symbol === one.symbol));
      state.data.list = [...temp, ...action.payload];
      tymtStorage.set(`priceList`, JSON.stringify(state.data));
    },
  },
});

export const getPriceList = (state: any) => state.priceList.data;
export const { setPriceList, appendPriceList } = priceListSlice.actions;

export default priceListSlice.reducer;
