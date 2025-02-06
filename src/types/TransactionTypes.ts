export interface IRecipient {
  address: string;
  amount: string;
  chainSymbol?: string;
  tokenSymbol?: string;
  tokenAddr?: string;
  tokenDecimals?: Number;
  icon?: string;
}

export interface ISendCoinData {
  passphrase: string;
  fee: number;
  recipients: IRecipient[];
  vendorField?: string;
}

export interface ISendCoin {
  currentTokenSymbol: string;
  data: ISendCoinData;
}
