import { createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../lib/helper/JSONHelper";
import tymtStorage from "../lib/storage/tymtStorage";
import { ILoginAttempts } from "../types/AccountTypes";

const init: ILoginAttempts = {
  count: 0,
  lockoutUntil: null,
};

const loadLoginAttempts: () => ILoginAttempts = () => {
  const data = tymtStorage.get(`loginAttempts`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`loginAttempts`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadLoginAttempts(),
  status: "loginAttempts",
  msg: "",
};

export const loginAttemptsSlice = createSlice({
  name: "loginAttempts",
  initialState,
  reducers: {
    setLoginAttempts: (state, action) => {
      state.data = action.payload;
      tymtStorage.set("loginAttempts", JSON.stringify(action.payload));
    },
  },
});

export const getLoginAttempts = (state: any) => state.loginAttempts.data;
export const { setLoginAttempts } = loginAttemptsSlice.actions;

export default loginAttemptsSlice.reducer;
