import { createSlice } from "@reduxjs/toolkit";

import { authStorage } from "../lib/storage/authStorage";
import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { IAuth } from "../types/AccountTypes";

const init: IAuth = {
  isLoggedIn: false,
  accessToken: "",
  refreshToken: "",
};

const loadAuth: () => IAuth = () => {
  const data = authStorage.get();
  if (!data || !compareJSONStructure(data, init)) {
    return init;
  }
  return data;
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
      authStorage.set(state.data);
    },
  },
});

export const getAuth = (state: any) => state.auth.data;
export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
