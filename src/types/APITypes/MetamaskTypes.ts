export interface IRPCRequest {
  request: {
    method: string;
    params: any[];
  };
  chain: {
    chainId: string;
  };
}
