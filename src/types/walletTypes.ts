export interface IWalletAddresses {
  arbitrum: string;
  avalanche: string;
  bitcoin: string;
  binance: string;
  ethereum: string;
  optimism: string;
  polygon: string;
  solana: string;
  solar: string;
}

export interface IBalance {
  symbol: string;
  balance: number;
}

export interface IBalanceList {
  list: IBalance[];
}

export interface IVotingData {
  [key: string]: number;
}

export interface ICurrentToken {
  token: string;
}
