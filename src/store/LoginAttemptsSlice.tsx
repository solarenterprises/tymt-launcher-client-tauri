import { createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../lib/helper/JSONHelper";
import tymtStorage from "../lib/storage/tymtStorage";
import { ILoginAttempts } from "../types/AccountTypes";

const init: ILoginAttempts = {
  count: 0,
  lockoutUntil: 0,
};

const isValidAttempts = (data: any): data is ILoginAttempts => {
  return data && typeof data.count === "number" && !isNaN(data.count) && typeof data.lockoutUntil === "number";
};

const loadLoginAttempts: () => ILoginAttempts = () => {
  const data = tymtStorage.get(`loginAttempts`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`loginAttempts`, JSON.stringify(init));
    return init;
  }
  try {
    const parsed = JSON.parse(data);

    // Validate data integrity
    if (!isValidAttempts(parsed)) {
      console.error("Invalid login attempts data, resetting");
      tymtStorage.set("loginAttempts", JSON.stringify(init));
      return init;
    }

    // Clear expired lockouts
    if (parsed.lockoutUntil && Date.now() >= parsed.lockoutUntil) {
      const cleared = { count: 0, lockoutUntil: 0 };
      tymtStorage.set("loginAttempts", JSON.stringify(cleared));
      return cleared;
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse login attempts", err);
    tymtStorage.set(`loginAttempts`, JSON.stringify(init));
    return init;
  }
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
