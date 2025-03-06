import { createSlice } from "@reduxjs/toolkit";
import { IGame, IGameList } from "../types/GameTypes";
import tymtStorage from "../lib/storage/tymtStorage";

const init: IGameList = {
  games: [],
};

const loadDeveloperGameList = () => {
  const data = tymtStorage.get(`developerGameList`);
  if (!data) {
    tymtStorage.set(`developerGameList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadDeveloperGameList(),
  status: "developerGameList",
  msg: "",
};

export const developerGameListSlice = createSlice({
  name: "developerGameList",
  initialState,
  reducers: {
    setDeveloperGameList(state, action) {
      state.data.games = action.payload;
      tymtStorage.set(`developerGameList`, JSON.stringify(state.data));
    },
    addOneDeveloperGameList(state, action) {
      const newGame = action.payload as IGame;
      state.data.games = [...state.data.games, newGame];
      tymtStorage.set(`developerGameList`, JSON.stringify(state.data));
    },
    delOneDeveloperGameList(state, action) {
      const game = action.payload as IGame;
      state.data.games = state.data.games.filter((one: IGame) => one?._id !== game?._id);
      tymtStorage.set(`developerGameList`, JSON.stringify(state.data));
    },
  },
});

export const getDeveloperGameList = (state: any) => state.developerGameList.data;
export const { setDeveloperGameList, addOneDeveloperGameList, delOneDeveloperGameList } = developerGameListSlice.actions;

export default developerGameListSlice.reducer;
