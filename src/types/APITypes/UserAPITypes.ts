export interface IUpdateProfile {
  nickname?: string;
  avatar?: string;
  notificationStatus?: boolean;
}

export interface IUser {
  _id: string;
  avatar: string;
  nickname: string;
  sxpAddress: string;
  publicKey: string;
  notificationStatus: boolean;
  onlineStatus: boolean;
  status: number;
  isAdmin: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
