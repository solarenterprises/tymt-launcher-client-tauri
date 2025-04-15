export interface IAccount {
  uid: string;
  avatar: string;
  nickname: string;
  password: string;
  mnemonic: string;
  sxpAddress: string;
  publicKey: string;
  notificationStatus: boolean;
  onlineStatus: boolean;
  status: number;
}

export interface IAccountList {
  list: IAccount[];
}

export interface ISaltToken {
  salt: string;
  token: string;
}

export interface IMnemonic {
  mnemonic: string;
}

export interface IAuth {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
}
