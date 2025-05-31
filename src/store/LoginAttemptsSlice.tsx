import { createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../lib/helper/JSONHelper";
import tymtStorage from "../lib/storage/tymtStorage";
import { ILoginAttempts } from "../types/AccountTypes";

const init: ILoginAttempts = {
  count: 0,
  lockoutUntil: 0,
};

const loadLoginAttempts: () => ILoginAttempts = () => {
  const data = tymtStorage.get(`loginAttempts`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`loginAttempts`, JSON.stringify(init));
    return init;
  }
  const parsed = JSON.parse(data);

  // Clear expired lockouts
  if (parsed.lockoutUntil && Date.now() >= parsed.lockoutUntil) {
    const cleared = { count: 0, lockoutUntil: 0 };
    tymtStorage.set("loginAttempts", JSON.stringify(cleared));
    return cleared;
  }

  return parsed;
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
