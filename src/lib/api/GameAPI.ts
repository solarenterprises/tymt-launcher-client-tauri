import axiosAuth from "../core/AxiosAuth";
import { IGame } from "../../types/GameTypes";
import { IMetaPagination, IPaginationQuery } from "../../types/APITypes/BasicAPITypes";

export const GameAPI = {
  fetchGameList: async (query: IPaginationQuery = { page: 1, limit: 20 }): Promise<{ data: IGame[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IGame[]; meta: IMetaPagination }>(`/game/list`, { params: query });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to fetchGameList");
    }
  },

  // fetchComingGameList: async (page: number): Promise<any> => {
  //   const res = await axiosAuth.get<{ data: any }>(`/store/by-visibility-state/coming%20soon?page=${page}`);
  //   return res.data.data;
  // },
};

export default GameAPI;
