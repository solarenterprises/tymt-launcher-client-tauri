import { RequestInit } from "node-fetch";

export interface IDownloadFile {
  downloadLink: string;
  downloadPath: string;
}

export interface IUnzipFile {
  fileLocation: string;
  installDir: string;
}

export interface IRunUrlArgs {
  url: string;
  args: string[];
}

export interface IFetch {
  url: string;
  init?: RequestInit;
}
