import { IWalletAddresses } from "../WalletTypes";

export interface IParamsFetchChainBalance {
  walletStore: IWalletAddresses;
  chainName: string;
}
