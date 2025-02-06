import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { CONST_SUPPORT_CURRENCIES } from "../const/CurrencyConsts";

import tymtStorage from "../lib/storage/tymtStorage";

import { CurrencyAPI } from "../lib/api/CurrencyAPI";

import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { IReserve, IReserveList } from "../types/CurrencyTypes";

const init: IReserveList = {
  list: CONST_SUPPORT_CURRENCIES?.map((one) => {
    const data: IReserve = {
      currency: one?.name,
      reserve: 1.0,
    };
    return data;
  }),
};

const loadReserveList: () => IReserveList = () => {
  const data = tymtStorage.get(`reserveList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`reserveList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadReserveList(),
  status: "reserveList",
  msg: "",
};

export const fetchReserveListAsync = createAsyncThunk("reserve/fetchReserveAsync", CurrencyAPI.fetchReserveList);

export const reserveListSlice = createSlice({
  name: "reserveList",
  initialState,
  reducers: {
    setReserveList: (state, action) => {
      state.data.list = action.payload;
      tymtStorage.set(`reserveList`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReserveListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReserveListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload as IReserve[];
        if (!data) return;
        state.data.list = data;
        tymtStorage.set(`reserveList`, JSON.stringify(state.data));
        state.status = "reserveList";
      });
  },
});

export const getReserveList = (state: any) => state.reserveList.data;
export const { setReserveList } = reserveListSlice.actions;

export default reserveListSlice.reducer;
