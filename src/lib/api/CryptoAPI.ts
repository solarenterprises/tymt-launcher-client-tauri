import axios from "axios";
import axiosAuth from "../core/AxiosAuth";
import { CONFIG_SOLAR_API_URL, CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";
import { CONST_CHAIN_SYMBOLS } from "../../const/ChainConsts";
import { ITransactionPagination, ITransaction } from "../../types/TransactionTypes";
import { formatEvmResponseToTxPagination } from "../helper/WalletHelper";
import { CONST_CURRENCY_NAMES } from "../../const/CurrencyConsts";

export const CryptoAPI = {
  getAllCurrencyRates: async (): Promise<any> => {
    try {
      const currencies = Object.values(CONST_CURRENCY_NAMES).join(",");
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/currency-rates`, { params: { currencies } });
      const data = res?.data?.data?.map((one) => ({ currency: one?.currency, reserve: parseFloat(one?.rate) }));
      return data;
    } catch (err) {
      console.error("Failed to getAllCurrencyRates: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAllCurrencyRates");
    }
  },

  getAllPrices: async (): Promise<any> => {
    try {
      const symbols = Object.values(CONST_CHAIN_SYMBOLS).join(",");
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/price`, { params: { symbols } });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getAllPrices: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAllPrices");
    }
  },

  getAllBalance: async (body: { evmAddress: string; solAddress: string; btcAddress: string }): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance`, body);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getAllBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAllBalance");
    }
  },

  //     SSSSSSSSSSSSSSS XXXXXXX       XXXXXXXPPPPPPPPPPPPPPPPP
  //   SS:::::::::::::::SX:::::X       X:::::XP::::::::::::::::P
  //  S:::::SSSSSS::::::SX:::::X       X:::::XP::::::PPPPPP:::::P
  //  S:::::S     SSSSSSSX::::::X     X::::::XPP:::::P     P:::::P
  //  S:::::S            XXX:::::X   X:::::XXX  P::::P     P:::::P
  //  S:::::S               X:::::X X:::::X     P::::P     P:::::P
  //   S::::SSSS             X:::::X:::::X      P::::PPPPPP:::::P
  //    SS::::::SSSSS         X:::::::::X       P:::::::::::::PP
  //      SSS::::::::SS       X:::::::::X       P::::PPPPPPPPP
  //         SSSSSS::::S     X:::::X:::::X      P::::P
  //              S:::::S   X:::::X X:::::X     P::::P
  //              S:::::SXXX:::::X   X:::::XXX  P::::P
  //  SSSSSSS     S:::::SX::::::X     X::::::XPP::::::PP
  //  S::::::SSSSSS:::::SX:::::X       X:::::XP::::::::P
  //  S:::::::::::::::SS X:::::X       X:::::XP::::::::P
  //   SSSSSSSSSSSSSSS   XXXXXXX       XXXXXXXPPPPPPPPPP

  getSxpBalance: async (address: string): Promise<any> => {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/wallets/${address}`);
      return response.data.data.balance / 1e8;
    } catch (err) {
      // return 0;
      console.error("Failed to getSxpBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getSxpBalance");
    }
  },

  getSxpTransactions: async (address: string, page: number, pageSize: number): Promise<ITransactionPagination> => {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/wallets/${address}/transactions`, {
        params: {
          page,
          limit: pageSize,
        },
      });
      const txList: ITransaction[] = response.data.data.map((one) => ({
        txId: one?.id,
        type: one?.type === 6 ? "transfer" : one?.type === 2 ? "vote" : "",
        asset: one?.type === 6 ? one?.asset?.transfers?.map((three) => ({ amount: three?.amount / 1e8, recipient: three?.recipientId })) : [],
        amount: one?.type === 6 ? one?.asset?.transfers?.reduce((sum, two) => sum + two?.amount / 1e8, 0) : 0,
        sender: one?.sender,
        fee: one?.fee / 1e8,
        timestamp: one?.timestamp?.unix,
      }));
      const result: ITransactionPagination = {
        meta: {
          totalCount: response.data.meta.totalCount,
          pageCount: response.data.meta.pageCount,
          count: response.data.meta.count,
        },
        data: txList,
      };
      return result;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return null;
    }
  },

  // getSxpTransaction: async (txId: string): Promise<any> => {
  //   try {
  //     return (await (await fetch(`${CONFIG_SOLAR_API_URL}/transactions/${txId}`)).json()).data;
  //   } catch {
  //     return undefined;
  //   }
  // },

  getSxpTransaction: async (txId: string): Promise<any> => {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/transactions/${txId}`);
      return response.data.data; // Return the transaction data
    } catch (err) {
      console.error("Failed to getSxpTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getSxpTransaction");
    }
  },

  // EEEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTTTTTTHHHHHHHHH     HHHHHHHHH
  // E::::::::::::::::::::ET:::::::::::::::::::::TH:::::::H     H:::::::H
  // E::::::::::::::::::::ET:::::::::::::::::::::TH:::::::H     H:::::::H
  // EE::::::EEEEEEEEE::::ET:::::TT:::::::TT:::::THH::::::H     H::::::HH
  //   E:::::E       EEEEEETTTTTT  T:::::T  TTTTTT  H:::::H     H:::::H
  //   E:::::E                     T:::::T          H:::::H     H:::::H
  //   E::::::EEEEEEEEEE           T:::::T          H::::::HHHHH::::::H
  //   E:::::::::::::::E           T:::::T          H:::::::::::::::::H
  //   E:::::::::::::::E           T:::::T          H:::::::::::::::::H
  //   E::::::EEEEEEEEEE           T:::::T          H::::::HHHHH::::::H
  //   E:::::E                     T:::::T          H:::::H     H:::::H
  //   E:::::E       EEEEEE        T:::::T          H:::::H     H:::::H
  // EE::::::EEEEEEEE:::::E      TT:::::::TT      HH::::::H     H::::::HH
  // E::::::::::::::::::::E      T:::::::::T      H:::::::H     H:::::::H
  // E::::::::::::::::::::E      T:::::::::T      H:::::::H     H:::::::H
  // EEEEEEEEEEEEEEEEEEEEEE      TTTTTTTTTTT      HHHHHHHHH     HHHHHHHHH

  getEthBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/eth/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getEthBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getEthBalance");
    }
  },

  getEthTransactions: async (address: string, page: number, pageSize: number): Promise<ITransactionPagination> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/eth/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      const result = formatEvmResponseToTxPagination(res);
      return result;
    } catch (err) {
      console.error("Failed to getEthTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getEthTransactions");
    }
  },

  sendEthRawTransaction: async (rawTransactions: string[]): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/send-raw-transaction/eth`, {
        rawTransactions: rawTransactions,
      });
      console.log(res.data);
      if (res?.data?.data?.response?.error) {
        return {
          success: false,
          error: res?.data?.data?.response?.error?.message,
          data: res?.data?.data,
        };
      }
      return {
        success: true,
        message: res?.data?.data?.txHash,
        data: res?.data?.data,
      };
    } catch (err) {
      console.error("Failed to sendEthRawTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to sendEthRawTransaction");
    }
  },

  getEthTransactionCount: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/get-transaction-count/eth`, { address });
      console.log(res.data);
      return parseInt(res?.data?.data?.count, 16);
    } catch (err) {
      console.error("Failed to getEthTransactionCount: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getEthTransactionCount");
    }
  },

  getEthGasPrice: async (): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/gas-price/eth`);
      console.log(res.data);
      return parseInt(res?.data?.data?.gasPrice, 16);
    } catch (err) {
      console.error("Failed to getEthGasPrice: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getEthGasPrice");
    }
  },

  // BBBBBBBBBBBBBBBBB      SSSSSSSSSSSSSSS         CCCCCCCCCCCCC
  // B::::::::::::::::B   SS:::::::::::::::S     CCC::::::::::::C
  // B::::::BBBBBB:::::B S:::::SSSSSS::::::S   CC:::::::::::::::C
  // BB:::::B     B:::::BS:::::S     SSSSSSS  C:::::CCCCCCCC::::C
  //   B::::B     B:::::BS:::::S             C:::::C       CCCCCC
  //   B::::B     B:::::BS:::::S            C:::::C
  //   B::::BBBBBB:::::B  S::::SSSS         C:::::C
  //   B:::::::::::::BB    SS::::::SSSSS    C:::::C
  //   B::::BBBBBB:::::B     SSS::::::::SS  C:::::C
  //   B::::B     B:::::B       SSSSSS::::S C:::::C
  //   B::::B     B:::::B            S:::::SC:::::C
  //   B::::B     B:::::B            S:::::S C:::::C       CCCCCC
  // BB:::::BBBBBB::::::BSSSSSSS     S:::::S  C:::::CCCCCCCC::::C
  // B:::::::::::::::::B S::::::SSSSSS:::::S   CC:::::::::::::::C
  // B::::::::::::::::B  S:::::::::::::::SS      CCC::::::::::::C
  // BBBBBBBBBBBBBBBBB    SSSSSSSSSSSSSSS           CCCCCCCCCCCCC

  getBscBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/bsc/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getBscBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getBscBalance");
    }
  },

  getBscTransactions: async (address: string, page: number, pageSize: number): Promise<ITransactionPagination> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/bsc/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      const result = formatEvmResponseToTxPagination(res);
      return result;
    } catch (err) {
      console.error("Failed to getBscTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getBscTransactions");
    }
  },

  sendBscRawTransaction: async (rawTransactions: string[]): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/send-raw-transaction/bsc`, {
        rawTransactions: rawTransactions,
      });
      console.log(res.data);
      if (res?.data?.data?.response?.error) {
        return {
          success: false,
          error: res?.data?.data?.response?.error?.message,
          data: res?.data?.data,
        };
      }
      return {
        success: true,
        message: res?.data?.data?.txHash,
        data: res?.data?.data,
      };
    } catch (err) {
      console.error("Failed to sendBscRawTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to sendBscRawTransaction");
    }
  },

  getBscTransactionCount: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/get-transaction-count/bsc`, { address });
      console.log(res.data);
      return parseInt(res?.data?.data?.count, 16);
    } catch (err) {
      console.error("Failed to getBscTransactionCount: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getBscTransactionCount");
    }
  },

  getBscGasPrice: async (): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/gas-price/bsc`);
      console.log(res.data);
      return parseInt(res?.data?.data?.gasPrice, 16);
    } catch (err) {
      console.error("Failed to getBscGasPrice: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getBscGasPrice");
    }
  },

  // PPPPPPPPPPPPPPPPP        OOOOOOOOO     LLLLLLLLLLL
  // P::::::::::::::::P     OO:::::::::OO   L:::::::::L
  // P::::::PPPPPP:::::P  OO:::::::::::::OO L:::::::::L
  // PP:::::P     P:::::PO:::::::OOO:::::::OLL:::::::LL
  //   P::::P     P:::::PO::::::O   O::::::O  L:::::L
  //   P::::P     P:::::PO:::::O     O:::::O  L:::::L
  //   P::::PPPPPP:::::P O:::::O     O:::::O  L:::::L
  //   P:::::::::::::PP  O:::::O     O:::::O  L:::::L
  //   P::::PPPPPPPPP    O:::::O     O:::::O  L:::::L
  //   P::::P            O:::::O     O:::::O  L:::::L
  //   P::::P            O:::::O     O:::::O  L:::::L
  //   P::::P            O::::::O   O::::::O  L:::::L         LLLLLL
  // PP::::::PP          O:::::::OOO:::::::OLL:::::::LLLLLLLLL:::::L
  // P::::::::P           OO:::::::::::::OO L::::::::::::::::::::::L
  // P::::::::P             OO:::::::::OO   L::::::::::::::::::::::L
  // PPPPPPPPPP               OOOOOOOOO     LLLLLLLLLLLLLLLLLLLLLLLL

  getPolBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/pol/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getPolBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getPolBalance");
    }
  },

  getPolTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/pol/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      const result = formatEvmResponseToTxPagination(res);
      return result;
    } catch (err) {
      console.error("Failed to getPolTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getPolTransactions");
    }
  },

  sendPolRawTransaction: async (rawTransactions: string[]): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/send-raw-transaction/pol`, {
        rawTransactions: rawTransactions,
      });
      console.log(res.data);
      if (res?.data?.data?.response?.error) {
        return {
          success: false,
          error: res?.data?.data?.response?.error?.message,
          data: res?.data?.data,
        };
      }
      return {
        success: true,
        message: res?.data?.data?.txHash,
        data: res?.data?.data,
      };
    } catch (err) {
      console.error("Failed to sendPolRawTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to sendPolRawTransaction");
    }
  },

  getPolTransactionCount: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/get-transaction-count/pol`, { address });
      console.log(res.data);
      return parseInt(res?.data?.data?.count, 16);
    } catch (err) {
      console.error("Failed to getPolTransactionCount: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getPolTransactionCount");
    }
  },

  getPolGasPrice: async (): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/gas-price/pol`);
      console.log(res.data);
      return parseInt(res?.data?.data?.gasPrice, 16);
    } catch (err) {
      console.error("Failed to getPolGasPrice: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getPolGasPrice");
    }
  },

  //                AAA   VVVVVVVV           VVVVVVVV   AAA               XXXXXXX       XXXXXXX
  //               A:::A  V::::::V           V::::::V  A:::A              X:::::X       X:::::X
  //              A:::::A V::::::V           V::::::V A:::::A             X:::::X       X:::::X
  //             A:::::::AV::::::V           V::::::VA:::::::A            X::::::X     X::::::X
  //            A:::::::::AV:::::V           V:::::VA:::::::::A           XXX:::::X   X:::::XXX
  //           A:::::A:::::AV:::::V         V:::::VA:::::A:::::A             X:::::X X:::::X
  //          A:::::A A:::::AV:::::V       V:::::VA:::::A A:::::A             X:::::X:::::X
  //         A:::::A   A:::::AV:::::V     V:::::VA:::::A   A:::::A             X:::::::::X
  //        A:::::A     A:::::AV:::::V   V:::::VA:::::A     A:::::A            X:::::::::X
  //       A:::::AAAAAAAAA:::::AV:::::V V:::::VA:::::AAAAAAAAA:::::A          X:::::X:::::X
  //      A:::::::::::::::::::::AV:::::V:::::VA:::::::::::::::::::::A        X:::::X X:::::X
  //     A:::::AAAAAAAAAAAAA:::::AV:::::::::VA:::::AAAAAAAAAAAAA:::::A    XXX:::::X   X:::::XXX
  //    A:::::A             A:::::AV:::::::VA:::::A             A:::::A   X::::::X     X::::::X
  //   A:::::A               A:::::AV:::::VA:::::A               A:::::A  X:::::X       X:::::X
  //  A:::::A                 A:::::AV:::VA:::::A                 A:::::A X:::::X       X:::::X
  // AAAAAAA                   AAAAAAAVVVAAAAAAA                   AAAAAAAXXXXXXX       XXXXXXX

  getAvaxBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/avax/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getAvaxBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAvaxBalance");
    }
  },

  getAvaxTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/avax/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      const result = formatEvmResponseToTxPagination(res);
      return result;
    } catch (err) {
      console.error("Failed to getAvaxTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAvaxTransactions");
    }
  },

  sendAvaxRawTransaction: async (rawTransactions: string[]): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/send-raw-transaction/avax`, {
        rawTransactions: rawTransactions,
      });
      console.log(res.data);
      if (res?.data?.data?.response?.error) {
        return {
          success: false,
          error: res?.data?.data?.response?.error?.message,
          data: res?.data?.data,
        };
      }
      return {
        success: true,
        message: res?.data?.data?.txHash,
        data: res?.data?.data,
      };
    } catch (err) {
      console.error("Failed to sendAvaxRawTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to sendAvaxRawTransaction");
    }
  },

  getAvaxTransactionCount: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/get-transaction-count/avax`, { address });
      console.log(res.data);
      return parseInt(res?.data?.data?.count, 16);
    } catch (err) {
      console.error("Failed to getAvaxTransactionCount: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAvaxTransactionCount");
    }
  },

  getAvaxGasPrice: async (): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/gas-price/avax`);
      console.log(res.data);
      return parseInt(res?.data?.data?.gasPrice, 16);
    } catch (err) {
      console.error("Failed to getAvaxGasPrice: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAvaxGasPrice");
    }
  },

  //                AAA               RRRRRRRRRRRRRRRRR   BBBBBBBBBBBBBBBBB
  //               A:::A              R::::::::::::::::R  B::::::::::::::::B
  //              A:::::A             R::::::RRRRRR:::::R B::::::BBBBBB:::::B
  //             A:::::::A            RR:::::R     R:::::RBB:::::B     B:::::B
  //            A:::::::::A             R::::R     R:::::R  B::::B     B:::::B
  //           A:::::A:::::A            R::::R     R:::::R  B::::B     B:::::B
  //          A:::::A A:::::A           R::::RRRRRR:::::R   B::::BBBBBB:::::B
  //         A:::::A   A:::::A          R:::::::::::::RR    B:::::::::::::BB
  //        A:::::A     A:::::A         R::::RRRRRR:::::R   B::::BBBBBB:::::B
  //       A:::::AAAAAAAAA:::::A        R::::R     R:::::R  B::::B     B:::::B
  //      A:::::::::::::::::::::A       R::::R     R:::::R  B::::B     B:::::B
  //     A:::::AAAAAAAAAAAAA:::::A      R::::R     R:::::R  B::::B     B:::::B
  //    A:::::A             A:::::A   RR:::::R     R:::::RBB:::::BBBBBB::::::B
  //   A:::::A               A:::::A  R::::::R     R:::::RB:::::::::::::::::B
  //  A:::::A                 A:::::A R::::::R     R:::::RB::::::::::::::::B
  // AAAAAAA                   AAAAAAARRRRRRRR     RRRRRRRBBBBBBBBBBBBBBBBB

  getArbBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/arb/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getArbBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getArbBalance");
    }
  },

  getArbTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/arb/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      const result = formatEvmResponseToTxPagination(res);
      return result;
    } catch (err) {
      console.error("Failed to getArbTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getArbTransactions");
    }
  },

  sendArbRawTransaction: async (rawTransactions: string[]): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/send-raw-transaction/arb`, {
        rawTransactions: rawTransactions,
      });
      console.log(res.data);
      if (res?.data?.data?.response?.error) {
        return {
          success: false,
          error: res?.data?.data?.response?.error?.message,
          data: res?.data?.data,
        };
      }
      return {
        success: true,
        message: res?.data?.data?.txHash,
        data: res?.data?.data,
      };
    } catch (err) {
      console.error("Failed to sendArbRawTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to sendArbRawTransaction");
    }
  },

  getArbTransactionCount: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/get-transaction-count/arb`, { address });
      console.log(res.data);
      return parseInt(res?.data?.data?.count, 16);
    } catch (err) {
      console.error("Failed to getArbTransactionCount: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getArbTransactionCount");
    }
  },

  getArbGasPrice: async (): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/gas-price/arb`);
      console.log(res.data);
      return parseInt(res?.data?.data?.gasPrice, 16);
    } catch (err) {
      console.error("Failed to getArbGasPrice: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getArbGasPrice");
    }
  },

  //      OOOOOOOOO     PPPPPPPPPPPPPPPPP
  //    OO:::::::::OO   P::::::::::::::::P
  //  OO:::::::::::::OO P::::::PPPPPP:::::P
  // O:::::::OOO:::::::OPP:::::P     P:::::P
  // O::::::O   O::::::O  P::::P     P:::::P
  // O:::::O     O:::::O  P::::P     P:::::P
  // O:::::O     O:::::O  P::::PPPPPP:::::P
  // O:::::O     O:::::O  P:::::::::::::PP
  // O:::::O     O:::::O  P::::PPPPPPPPP
  // O:::::O     O:::::O  P::::P
  // O:::::O     O:::::O  P::::P
  // O::::::O   O::::::O  P::::P
  // O:::::::OOO:::::::OPP::::::PP
  //  OO:::::::::::::OO P::::::::P
  //    OO:::::::::OO   P::::::::P
  //      OOOOOOOOO     PPPPPPPPPP

  getOpBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/op/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getOpBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getOpBalance");
    }
  },

  getOpTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/op/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      const result = formatEvmResponseToTxPagination(res);
      return result;
    } catch (err) {
      console.error("Failed to getOpTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getOpTransactions");
    }
  },

  sendOpRawTransaction: async (rawTransactions: string[]): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/send-raw-transaction/op`, {
        rawTransactions: rawTransactions,
      });
      console.log(res.data);
      if (res?.data?.data?.response?.error) {
        return {
          success: false,
          error: res?.data?.data?.response?.error?.message,
          data: res?.data?.data,
        };
      }
      return {
        success: true,
        message: res?.data?.data?.txHash,
        data: res?.data?.data,
      };
    } catch (err) {
      console.error("Failed to sendOpRawTransaction: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to sendOpRawTransaction");
    }
  },

  getOpTransactionCount: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.post(`${CONFIG_TYMT_BACKEND_URL}/crypto/get-transaction-count/op`, { address });
      console.log(res.data);
      return parseInt(res?.data?.data?.count, 16);
    } catch (err) {
      console.error("Failed to getOpTransactionCount: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getOpTransactionCount");
    }
  },

  getOpGasPrice: async (): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/gas-price/op`);
      console.log(res.data);
      return parseInt(res?.data?.data?.gasPrice, 16);
    } catch (err) {
      console.error("Failed to getOpGasPrice: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getOpGasPrice");
    }
  },

  //     SSSSSSSSSSSSSSS      OOOOOOOOO     LLLLLLLLLLL
  //   SS:::::::::::::::S   OO:::::::::OO   L:::::::::L
  //  S:::::SSSSSS::::::S OO:::::::::::::OO L:::::::::L
  //  S:::::S     SSSSSSSO:::::::OOO:::::::OLL:::::::LL
  //  S:::::S            O::::::O   O::::::O  L:::::L
  //  S:::::S            O:::::O     O:::::O  L:::::L
  //   S::::SSSS         O:::::O     O:::::O  L:::::L
  //    SS::::::SSSSS    O:::::O     O:::::O  L:::::L
  //      SSS::::::::SS  O:::::O     O:::::O  L:::::L
  //         SSSSSS::::S O:::::O     O:::::O  L:::::L
  //              S:::::SO:::::O     O:::::O  L:::::L
  //              S:::::SO::::::O   O::::::O  L:::::L         LLLLLL
  //  SSSSSSS     S:::::SO:::::::OOO:::::::OLL:::::::LLLLLLLLL:::::L
  //  S::::::SSSSSS:::::S OO:::::::::::::OO L::::::::::::::::::::::L
  //  S:::::::::::::::SS    OO:::::::::OO   L::::::::::::::::::::::L
  //   SSSSSSSSSSSSSSS        OOOOOOOOO     LLLLLLLLLLLLLLLLLLLLLLLL

  getSolBalance: async (address: string): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/balance/sol/${address}`);
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getSolBalance: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getSolBalance");
    }
  },

  getSolTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/sol/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getSolTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getSolTransactions");
    }
  },
};
