import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { IPaginationQuery } from "./BasicAPITypes";

export interface IParamfetchAllGameList {
  socket: MutableRefObject<Socket>;
  userId: string;
}

export interface IStoreSecret {
  storeId: string;
  secret: string;
}

export interface IGameListQuery extends IPaginationQuery {
  price?: number;
  platform?: string;
  genre?: string;
  type?: string;
  keyword?: string;
  // releaseDate?: string;
  // rank?: string;
}
