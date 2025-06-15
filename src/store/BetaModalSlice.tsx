import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../lib/storage/tymtStorage";

const loadBetaModalState = () => {
  try {
    const data = tymtStorage.get("betaModal");
    return data ? JSON.parse(data) : { hasSeenBetaModal: false };
  } catch (error) {
    return { hasSeenBetaModal: false };
  }
};

const initialState = {
  data: loadBetaModalState(),
  status: "betaModal",
  msg: "",
};

const betaModalSlice = createSlice({
  name: "betaModal",
  initialState,
  reducers: {
    setBetaModalSeen: (state) => {
      state.data.hasSeenBetaModal = true;
      tymtStorage.set("betaModal", JSON.stringify(state.data));
    },
    resetBetaModalState: (state) => {
      state.data.hasSeenBetaModal = false;
      tymtStorage.set("betaModal", JSON.stringify(state.data));
    },
  },
});

export const { setBetaModalSeen, resetBetaModalState } = betaModalSlice.actions;
export const getBetaModalState = (state: any) => state.betaModal.data;
export default betaModalSlice.reducer;