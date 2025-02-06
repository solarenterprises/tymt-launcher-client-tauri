import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import tymtStorage from "../lib/storage/tymtStorage";
import { compareJSONStructure } from "../lib/helper/JSONHelper";

import { IAuth } from "../types/AccountTypes";
import { AuthAPI } from "../lib/api/AuthAPI";
import { ILoginResponse } from "../types/APITypes/AuthAPITypes";

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

export const login = createAsyncThunk("auth/login", AuthAPI.login);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`auth`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, _action) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<ILoginResponse>) => {
      state.status = "success";
      state.data.accessToken = action.payload.accessToken;
      state.data.refreshToken = action.payload.refreshToken;
      state.data.isLoggedIn = true;
      tymtStorage.set(`auth`, JSON.stringify(state.data));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "error";
      state.msg = action.error.message;
    });
  },
});

export const getAuth = (state: any) => state.auth.data;
export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
