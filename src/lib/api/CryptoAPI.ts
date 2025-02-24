import axiosAuth from "../core/AxiosAuth";
import { CONFIG_SOLAR_API_URL, CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";
import { CONST_CHAIN_SYMBOLS } from "../../const/ChainConsts";
import axios from "axios";

export const CryptoAPI = {
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

  // getSxpTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
  //   try {
  //     return (await (await fetch(`${CONFIG_SOLAR_API_URL}/wallets/${address}/transactions?page=${page}&limit=${pageSize}`)).json()).data;
  //   } catch {
  //     return [];
  //   }
  // },

  getSxpTransactions: async (address: string, page: number, pageSize: number): Promise<any[]> => {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/wallets/${address}/transactions`, {
        params: {
          page,
          limit: pageSize,
        },
      });
      return response.data.data; // Return the transactions data
    } catch (err) {
      console.error("Failed to getSxpTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getSxpTransactions");
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

  getEthTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/eth/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getEthTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getEthTransactions");
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

  getBscTransactions: async (address: string, page: number, pageSize: number): Promise<any> => {
    try {
      const res = await axiosAuth.get(`${CONFIG_TYMT_BACKEND_URL}/crypto/transactions/bsc/${address}`, {
        params: {
          page,
          pageSize,
        },
      });
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getBscTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getBscTransactions");
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
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getPolTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getPolTransactions");
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
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getAvaxTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getAvaxTransactions");
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
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getArbTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getArbTransactions");
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
      return res?.data?.data;
    } catch (err) {
      console.error("Failed to getOpTransactions: ", err.response?.data ?? err);
      throw new Error(err.response?.data?.error ?? "Failed to getOpTransactions");
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
