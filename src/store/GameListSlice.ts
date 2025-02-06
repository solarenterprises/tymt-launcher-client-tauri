import { createSlice } from "@reduxjs/toolkit";
import { IGameList } from "../types/GameTypes";
import tymtStorage from "../lib/storage/tymtStorage";

const init: IGameList = {
  games: [],
};

const loadGameList = () => {
  const data = tymtStorage.get(`gameList`);
  if (!data) {
    tymtStorage.set(`gameList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadGameList(),
  status: "gameList",
  msg: "",
};

export const gameListSlice = createSlice({
  name: "gameList",
  initialState,
  reducers: {
    setGameList(state, action) {
      state.data.games = action.payload;
      tymtStorage.set(`gameList`, JSON.stringify(state.data));
    },
  },
});

export const getGameList = (state: any) => state.gameList.data;
export const { setGameList } = gameListSlice.actions;

export default gameListSlice.reducer;
