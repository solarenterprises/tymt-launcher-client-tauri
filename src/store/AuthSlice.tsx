import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../lib/storage/tymtStorage";
import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { IAuth } from "../types/AccountTypes";

const init: IAuth = {
  isLoggedIn: false,
  accessToken: "",
  refreshToken: "",
};

const loadAuth: () => IAuth = () => {
  const data = tymtStorage.get(`auth`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`auth`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadAuth(),
  status: "auth",
  msg: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`auth`, JSON.stringify(state.data));
    },
  },
});

export const getAuth = (state: any) => state.auth.data;
export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
