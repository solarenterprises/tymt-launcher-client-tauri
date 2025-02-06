import axiosAuth from "../core/AxiosAuth";
import { IUpdateProfile, IUser } from "../../types/APITypes/UserAPITypes";

export const UserAPI = {
  updateProfile: async (profile: IUpdateProfile): Promise<IUser> => {
    try {
      const res = await axiosAuth.put<{ data: IUser }>(`/user`, profile);
      return res.data.data;
    } catch (err) {
      console.error("Failed to updateProfile: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to updateProfile");
    }
  },

  updateAvatar: async (formData: FormData): Promise<IUser> => {
    try {
      const res = await axiosAuth.put<{ data: IUser }>(`/user/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data;
    } catch (err) {
      console.error("Failed to updateAvatar: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to updateAvatar");
    }
  },
};
