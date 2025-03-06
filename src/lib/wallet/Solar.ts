import { Managers, Identities, Transactions, Crypto } from "@solar-network/crypto";
import { generateMnemonic } from "bip39";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import Big from "big.js";

import { CONFIG_NETWORK_NAME, CONFIG_SOLAR_API_URL } from "../../config/MainConfig";

import { IRecipient, ITransactionPagination, ITransaction } from "../../types/TransactionTypes";

export class Solar {
  static async generateMnemonic(): Promise<string> {
    const passphrase = generateMnemonic();
    return passphrase;
  }

  static async getAddress(mnemonic: string): Promise<string> {
    Managers.configManager.setFromPreset(CONFIG_NETWORK_NAME === "mainnet" ? "mainnet" : "testnet");
    return Identities.Address.fromPassphrase(mnemonic.normalize("NFD"));
  }

  static getPublicKey(mnemonic: string): string {
    return Identities.PublicKey.fromPassphrase(mnemonic.normalize("NFD"));
  }

  static async addTxToQueue(body: any, url: string): Promise<AxiosResponse<any, any>> {
    return await axios.post(`${url}/transactions`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static async getData(query: any, url: string): Promise<AxiosResponse<any, any>> {
    const config: AxiosRequestConfig = {
      params: query,
    };
    return await axios.get(`${CONFIG_SOLAR_API_URL}/${url}`, config);
  }

  static async getBlockchain() {
    return this.getData({}, "blockchain");
  }

  static async get53Delegates(page: number) {
    const query1 = {
      page: page,
      limit: 53,
      isResigned: false,
      orderBy: "rank:asc",
    };
    return this.getData(query1, "delegates");
  }

  static async getAllDelegates() {
    const query1 = {
      page: 1,
      limit: 100,
      isResigned: false,
      orderBy: "address:asc",
    };
    const res1: any = await this.getData(query1, "delegates");
    const numberOfDelegates = res1.data.meta.totalCount;
    const numberOfPages = Math.ceil(numberOfDelegates / 100);
    let queries = [];
    for (let i = 2; i <= numberOfPages; i++) {
      queries.push({
        page: i,
        limit: 100,
        isResigned: false,
        orderBy: "address:asc",
      });
    }
    const res2: any[] = await Promise.all(queries.map((query) => this.getData(query, "delegates")));
    let res3: any[] = res1.data.data;
    for (let i = 0; i < res2.length; i++) {
      res3 = [...res3, ...res2[i].data.data];
    }
    return res3;
  }

  static async getVotingData(address: string) {
    try {
      const query2 = {
        page: 1,
        limit: 1,
      };
      return this.getData(query2, `wallets/${address}/votes`);
    } catch (err) {
      console.error("Failed to getVotingData: ", err);
    }
  }

  static async getCurrentNonce(address: string): Promise<number> {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/wallets/${address}`);
      return parseInt(response.data.data.nonce);
    } catch (e) {
      throw new Error(`Failed to get current nonce: ${e.message}`);
    }
  }

  static async vote(passphrase: string, addr: string, votesAsset: any, sxpFee: number) {
    Managers.configManager.setFromPreset(CONFIG_NETWORK_NAME === "mainnet" ? "mainnet" : "testnet");
    let nonce = await this.getCurrentNonce(addr);
    let tx = Transactions.BuilderFactory.vote()
      .nonce((nonce + 1).toString())
      .votesAsset(votesAsset)
      .fee(
        Big(sxpFee)
          .times(10 ** 8)
          .toFixed(0)
      )
      .sign(passphrase);
    let txJson = tx.build().toJson();
    let res = this.addTxToQueue(JSON.stringify({ transactions: [txJson] }), CONFIG_SOLAR_API_URL ?? "");
    return res;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/wallets/${addr}`);
      return response.data.data.balance;
    } catch {
      return 0;
    }
  }

  static validateAddress(address: string): boolean {
    Managers.configManager.setFromPreset(CONFIG_NETWORK_NAME === "mainnet" ? "mainnet" : "testnet");
    return Identities.Address.validate(address);
  }

  static async sendTransaction(
    passphrase: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }, // fee in SXP
    secondPassphrase?: string
  ): Promise<{ success: boolean; message?: string; error?: string; data?: any }> {
    try {
      const addr = await Solar.getAddress(passphrase);
      let nonce: number = await Solar.getCurrentNonce(addr);
      if (tx.recipients.length === 0) {
        return {
          success: false,
          error: "No recipients provided",
        };
      }

      Managers.configManager.setFromPreset(CONFIG_NETWORK_NAME === "mainnet" ? "mainnet" : "testnet");
      let transaction = Transactions.BuilderFactory.transfer();

      tx.recipients.forEach((recipient) => {
        transaction.addTransfer(
          recipient.address,
          Big(recipient.amount)
            .times(10 ** 8)
            .toFixed(0)
        );
      });

      let itransaction = transaction
        .fee(
          Big(tx.fee)
            .times(10 ** 8)
            .toFixed(0)
        )
        .nonce((nonce + 1).toString());

      if (tx.vendorField && tx.vendorField.length > 0) {
        itransaction = itransaction.memo(tx.vendorField);
      }

      let txJson = itransaction.sign(passphrase);

      if (secondPassphrase && secondPassphrase.length > 0) {
        txJson = itransaction.secondSign(secondPassphrase);
      }

      let res = await Solar.addTxToQueue(JSON.stringify({ transactions: [txJson.build().toJson()] }), CONFIG_SOLAR_API_URL ?? "");

      if (res.status !== 200) {
        return {
          success: false,
          error: "Request failed",
        };
      } else {
        if (res.data.errors === undefined) {
          return {
            success: true,
            message: res.data.data.accept[0],
          };
        } else {
          return {
            success: false,
            error: res.data.errors[res.data.data.invalid[0]].message as string,
          };
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err.message as string,
      };
    }
  }

  static async getTransactions(addr: string, page: number, pageSize: number): Promise<ITransactionPagination> {
    try {
      const response = await axios.get(`${CONFIG_SOLAR_API_URL}/wallets/${addr}/transactions`, {
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
  }

  static async signMessage(message: string, passphrase: string): Promise<string> {
    return Crypto.Message.sign(message, passphrase.normalize("NFD")).signature;
  }

  static async verifyMessage(message: string, publicKey: string, signature: string): Promise<boolean> {
    return Crypto.Message.verify({ message, publicKey, signature });
  }
}

export default Solar;
