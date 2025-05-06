import axiosAuth from "../core/AxiosAuth";
import { IGame } from "../../types/GameTypes";
import { IMetaPagination, IPaginationQuery } from "../../types/APITypes/BasicAPITypes";
import { IGameListQuery } from "../../types/APITypes/GameAPITypes";
import { IPurchaseHistory } from "../../types/APITypes/PurchaseAPITypes";

export const GameAPI = {
  fetchGame: async (gameId: string): Promise<IGame> => {
    try {
      const res = await axiosAuth.get<{ data: IGame }>(`/game/id/${gameId}`);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchGame");
    }
  },

  fetchGameList: async (query: IGameListQuery = { page: 1, limit: 20 }): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/list`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchGameList");
    }
  },

  fetchFreeGameList: async (query: IGameListQuery = { page: 1, limit: 20, price: 0 }): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/list`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchFreeGameList");
    }
  },

  fetchRecentlyAddedGameList: async (
    query: IPaginationQuery = { page: 1, limit: 20, sort: '{"tymtReleaseDate":1}' }
  ): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/recent`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchRecentlyAddedGameList");
    }
  },

  fetchComingSoonGameList: async (query: IPaginationQuery = { page: 1, limit: 20 }): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/coming-soon`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchComingSoonGameList");
    }
  },

  fetchTrendingGameList: async (
    query: IPaginationQuery = { page: 1, limit: 10, sort: '{"downloadCount":-1}' }
  ): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/list`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchTrendingGameList");
    }
  },

  increaseDownloadCount: async (gameId: string): Promise<any> => {
    try {
      const res = await axiosAuth.put<any>(`/game/download/${gameId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to increaseDownloadCount: ", err);
    }
  },

  postGameOrder: async (game_id: string): Promise<any> => {
    try {
      const res = await axiosAuth.post<{ data: any }>(`/game/order`, { game_id });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to postGameOrder");
    }
  },

  postGamePurchase: async (order_id: string, tx_hash: string): Promise<any> => {
    try {
      const res = await axiosAuth.post<{ data: any }>(`/game/purchase`, { order_id, tx_hash });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to postGamePurchase");
    }
  },

  verifyPurchase: async (game_id: string): Promise<any> => {
    try {
      const res = await axiosAuth.post<{ data: any }>(`/game/verify-purchase`, { game_id });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to verifyPurchase");
    }
  },

  fetchPurchasedGameList: async (query: IPaginationQuery = { page: 1, limit: 20 }): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/purchase`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchPurchase");
    }
  },

  fetchPurchaseHistory: async (query: IPaginationQuery = { page: 1, limit: 20 }): Promise<{ data: IPurchaseHistory[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IPurchaseHistory[]; meta: IMetaPagination }>(`/purchase`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchPurchaseHistory");
    }
  },

  // fetchComingGameList: async (page: number): Promise<any> => {
  //   const res = await axiosAuth.get<{ data: any }>(`/store/by-visibility-state/coming%20soon?page=${page}`);
  //   return res.data.data;
  // },
};

export default GameAPI;
