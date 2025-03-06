import txInIcon from "../assets/wallet/TxInIcon.svg";
import txOutIcon from "../assets/wallet/TxOutIcon.svg";
import txVoteIcon from "../assets/wallet/TxVoteIcon.svg";

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

export interface ITransaction {
  txId: string;
  type: string;
  amount: number;
  asset: Array<{ amount: number; recipient: string }>;
  sender: string;
  fee: number;
  timestamp: number;
}

export interface ITransactionPagination {
  meta: {
    totalCount: number;
    pageCount: number;
    count: number;
  };
  data: Array<ITransaction>;
}

export const txIconMap: Map<string, string> = new Map([
  ["TX_IN", txInIcon],
  ["TX_OUT", txOutIcon],
  ["TX_VOTE", txVoteIcon],
]);
