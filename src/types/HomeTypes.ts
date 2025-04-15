import { IGame } from "./GameTypes";

export interface PaginationType {
  index: number;
  page: string;
}

export interface tymtLogoType {
  isDrawerExpanded: boolean;
}

export interface IPropsMode {
  status: number;
  setStatus: (status: number) => void;
}

export interface ILibraryMode {
  mode: number;
}

export interface IDownloadStatus {
  downloaded: number;
  speed: number;
  total: number;
  duration: number;
  expectation: number;
  game: string;
}

export interface IInstallStatus {
  progress: number;
  isInstalling: boolean;
  name: string;
}

export interface IRemoveStatus {
  game: IGame;
}

export interface IPoint {
  x: number;
  y: number;
}
