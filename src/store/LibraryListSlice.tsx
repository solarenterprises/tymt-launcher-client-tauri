import { createSlice } from "@reduxjs/toolkit";
import { IGame, IGameList } from "../types/GameTypes";
import tymtStorage from "../lib/storage/tymtStorage";

const init: IGameList = {
  games: [],
};

const loadLibraryList = () => {
  const data = tymtStorage.get(`libraryList`);
  if (!data) {
    tymtStorage.set(`libraryList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadLibraryList(),
  status: "libraryList",
  msg: "",
};

export const libraryListSlice = createSlice({
  name: "libraryList",
  initialState,
  reducers: {
    setLibraryList(state, action) {
      state.data.games = action.payload;
      tymtStorage.set(`libraryList`, JSON.stringify(state.data));
    },
    addOneLibraryList(state, action) {
      const newGame = action?.payload as IGame;
      if (state?.data?.games?.some((one: IGame) => one?._id === newGame?._id)) return;
      state.data.games = [...state.data.games, newGame];
      tymtStorage.set(`libraryList`, JSON.stringify(state.data));
    },
    delOneLibraryList(state, action) {
      const game = action?.payload as IGame;
      state.data.games = state.data.games.filter((one: IGame) => one?._id !== game?._id);
      tymtStorage.set(`libraryList`, JSON.stringify(state.data));
    },
  },
});

export const getLibraryList = (state: any) => state.libraryList.data;
export const { setLibraryList, addOneLibraryList, delOneLibraryList } = libraryListSlice.actions;

export default libraryListSlice.reducer;
