// Mnemonic is stored in memory only - not persisted to any storage
// It is cleared when the app is closed or refreshed

import { createSlice } from "@reduxjs/toolkit";
import { IMnemonic } from "../types/AccountTypes";

const init: IMnemonic = {
  mnemonic: "",
};

const initialState = {
  data: init,
  status: "mnemonic",
  msg: "",
};

export const mnemonicSlice = createSlice({
  name: "mnemonic",
  initialState,
  reducers: {
    setMnemonic: (state, action) => {
      state.data.mnemonic = action.payload;
      // No storage - memory only
    },
  },
});

export const getMnemonic = (state: any) => state.mnemonic.data;
export const { setMnemonic } = mnemonicSlice.actions;

export default mnemonicSlice.reducer;
