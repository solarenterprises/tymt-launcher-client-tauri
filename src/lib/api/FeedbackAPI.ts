import axiosAuth from "../core/AxiosAuth";
import { IFeedback } from "../../types/GameTypes";
import { IMetaPagination, IPaginationQuery } from "../../types/APITypes/BasicAPITypes";

export const FeedbackAPI = {
  getFeedbacks: async ({
    gameId,
    query = { page: 1, limit: 5 },
  }: {
    gameId: string;
    query?: IPaginationQuery;
  }): Promise<{ data: IFeedback[]; meta: IMetaPagination }> => {
    try {
      const res = await axiosAuth.get<{ data: IFeedback[]; meta: IMetaPagination }>(`/game/${gameId}/feedback`, { params: query });
      return res.data;
    } catch (err) {
      console.error("Failed to getFeedbacks: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getFeedbacks");
    }
  },

  createFeedback: async ({ gameId, ...data }: { gameId: string; isAnonymous?: boolean; rating: number; text: string }) => {
    try {
      const res = await axiosAuth.post<IFeedback>(`/game/${gameId}/feedback`, data);
      return res.data;
    } catch (err) {
      console.error("Failed to createFeedback: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to createFeedback");
    }
  },
};
