import { IUser } from "./UserAPITypes";

export interface ISignupParams {
  nickname: string;
  sxpAddress: string;
  passphrase: string;
}

export interface ILoginParams {
  sxpAddress: string;
  passphrase: string;
}

export interface ILoginResponse {
  user: IUser;
  refreshToken: string;
  accessToken: string;
}
