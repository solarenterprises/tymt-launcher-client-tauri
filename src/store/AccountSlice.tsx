import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import tymtStorage from "../lib/storage/tymtStorage";
import { compareJSONStructure } from "../lib/helper/JSONHelper";
import { UserAPI } from "../lib/api/UserAPI";

import { IAccount } from "../types/AccountTypes";
import { IUser } from "../types/APITypes/UserAPITypes";

const init: IAccount = {
  uid: "",
  avatar: "",
  nickname: "",
  password: "",
  mnemonic: "",
  publicKey: "",
  sxpAddress: "",
  notificationStatus: false,
  onlineStatus: false,
  status: 0,
};

const loadAccount: () => IAccount = () => {
  const data = tymtStorage.get(`account`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`account`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadAccount(),
  status: "account",
  msg: "",
};

export const updateProfile = createAsyncThunk("account/updateProfile", UserAPI.updateProfile);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`account`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.data = { ...action.payload, uid: action.payload._id, password: state.data.password, mnemonic: state.data.mnemonic };
        tymtStorage.set(`account`, JSON.stringify(state.data));
        state.status = "account";
      })
      .addCase(updateProfile.rejected, (state) => {
        state.status = "error";
        state.msg = "Failed to update profile";
      });
  },
});

export const getAccount = (state: any) => state.account.data;
export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;
