export interface IPriceAPIGetAllTokenPricesResponse {
  _id: string;
  chainId: number;
  chainName: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  price: number;
  timestamp: string;
  symbol: string; // cmc
}
