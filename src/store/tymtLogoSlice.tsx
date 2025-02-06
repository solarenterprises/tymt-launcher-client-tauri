import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../lib/storage/tymtStorage";
import { tymtLogoType } from "../types/HomeTypes";
import { compareJSONStructure } from "../lib/helper/JSONHelper";

const init: tymtLogoType = {
  isDrawerExpanded: true,
};

const loadData: () => tymtLogoType = () => {
  const data = tymtStorage.get(`tymtLogo`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`tymtLogo`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`tymtLogo`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadData(),
  status: "tymtLogo",
  msg: "",
};

const tymtLogoSlice = createSlice({
  name: "tymtLogo",
  initialState,
  reducers: {
    setCurrentLogo(state, action) {
      state.data = action.payload;
      tymtStorage.set(`tymtLogo`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentLogo = (state: any) => state.tymtLogo.data;

export default tymtLogoSlice.reducer;

export const { setCurrentLogo } = tymtLogoSlice.actions;
