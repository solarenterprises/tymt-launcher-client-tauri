export interface ISupportNative {
  address: string;
  symbol: string;
  name: string;
  key: string;
  decimals: Number;
  logo: string;
  website: string;
  chainId: Number;
  cmc: string;
}

export interface ISupportToken {
  address: string;
  symbol: string;
  displaySymbol: string;
  name: string;
  decimals: Number;
  logo: string;
  website: string;
  cmc: string;
}

export interface ISupportChain {
  native: ISupportNative;
  tokens: ISupportToken[];
}

export interface ICurrentChain {
  chain: string;
}
