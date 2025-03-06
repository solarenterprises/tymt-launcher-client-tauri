import { createSlice } from "@reduxjs/toolkit";
import { IDownloadStatus } from "../types/HomeTypes";

const init: IDownloadStatus = {
  downloaded: 0,
  speed: 0,
  total: 0,
  duration: 0,
  expectation: 0,
  game: null,
};

const loadDownloadStatus: () => IDownloadStatus = () => {
  return init;
};

const initialState = {
  data: loadDownloadStatus(),
  status: "downloadStatus",
  msg: "",
};

const downloadStatusSlice = createSlice({
  name: "downloadStatus",
  initialState,
  reducers: {
    setDownloadStatus(state, action) {
      state.data = action.payload;
    },
    resetDownloadStatus(state) {
      state.data = init;
    },
  },
});

export const getDownloadStatus = (state: any) => state.downloadStatus.data;

export default downloadStatusSlice.reducer;

export const { setDownloadStatus, resetDownloadStatus } = downloadStatusSlice.actions;
