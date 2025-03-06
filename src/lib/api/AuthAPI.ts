import axios from "axios";
import { CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";
import tymtCore from "../core/tymtCore";
import { getPublicKey } from "../helper/WalletHelper";
import { IUser } from "../../types/APITypes/UserAPITypes";
import { ILoginParams, ISignupParams, ILoginResponse } from "../../types/APITypes/AuthAPITypes";

export const AuthAPI = {
  requestMessage: async (publicKey: string): Promise<string> => {
    try {
      const res = await axios.post(`${CONFIG_TYMT_BACKEND_URL}/auth/request-message`, { publicKey });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to requestMessage: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to requestMessage");
    }
  },

  signup: async (params: ISignupParams): Promise<IUser> => {
    try {
      const { nickname, sxpAddress, passphrase } = params;
      const publicKey = getPublicKey(passphrase);
      const message = await AuthAPI.requestMessage(publicKey);
      const signedMessage = await tymtCore.Blockchains.solar.wallet.signMessage(message, passphrase);
      const res = await axios.post<{ data: IUser }>(`${CONFIG_TYMT_BACKEND_URL}/auth/signup`, { nickname, sxpAddress, publicKey, signedMessage });
      return res?.data?.data;
    } catch (err) {
      throw new Error(err.response?.data?.error ?? "Failed to signup");
    }
  },

  login: async (params: ILoginParams): Promise<ILoginResponse> => {
    try {
      const { sxpAddress, passphrase } = params;
      const publicKey = getPublicKey(passphrase);
      const message = await AuthAPI.requestMessage(publicKey);
      const signedMessage = await tymtCore.Blockchains.solar.wallet.signMessage(message, passphrase);
      const res = await axios.post<{ data: ILoginResponse }>(`${CONFIG_TYMT_BACKEND_URL}/auth/login`, { sxpAddress, publicKey, signedMessage });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to login: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to login");
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const res = await axios.post(`${CONFIG_TYMT_BACKEND_URL}/auth/refresh-token`, { refreshToken });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to refreshToken: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to refreshToken");
    }
  },
};
